import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Search, CheckCircle, XCircle, Eye, Download, Calendar, Mail } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { useProviders } from '../../../hooks/useProviders';
import { useProviderStats } from '../../../hooks/useProviderStats';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';

export default function ProvidersTable() {
  const { providers, loading, setProviders } = useProviders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookingsProvider, setBookingsProvider] = useState<{ id: string; name: string } | null>(null);
  const [providerBookings, setProviderBookings] = useState<{ id: string; title: string; date: string; time: string; status: string; price: number }[]>([]);

  const providerIds = useMemo(() => providers.map(p => p.id), [providers]);
  const { stats: providerStats } = useProviderStats(providerIds);

  const extendedProviders = useMemo(() =>
    providers.map(p => ({
      ...p,
      status: p.verified ? 'active' : 'pending',
      totalEarnings: providerStats[p.id]?.earnings ?? 0,
      completedBookings: providerStats[p.id]?.completedBookings ?? 0,
    })), [providers, providerStats]);

  const filteredProviders = useMemo(() =>
    extendedProviders.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    }), [extendedProviders, searchQuery, statusFilter]);

  const avgRating = providers.length > 0
    ? (providers.reduce((s, p) => s + p.rating, 0) / providers.length).toFixed(1)
    : '—';

  useEffect(() => {
    if (!bookingsProvider) { setProviderBookings([]); return; }
    supabase.from('bookings').select('id, title, date, time, status, price').eq('provider_id', bookingsProvider.id).order('date', { ascending: false }).then(({ data }) => {
      setProviderBookings(data ?? []);
    });
  }, [bookingsProvider]);

  function handleExportCSV() {
    const headers = ['Name', 'Email', 'Status', 'Categories', 'Rating', 'Bookings', 'Earnings', 'Joined'];
    const rows = filteredProviders.map(p => [
      p.name,
      p.email ?? '',
      p.status,
      p.categories.join('; '),
      String(p.rating),
      String(p.completedBookings),
      String(p.totalEarnings),
      new Date(p.joined_date).toLocaleDateString(),
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `providers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success('Export downloaded');
  }

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Provider Management</h1>
          <p className="text-sm text-muted">Review and manage provider accounts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {[
            { label: 'Total Providers', value: providers.length, color: '' },
            { label: 'Active', value: extendedProviders.filter(p => p.status === 'active').length, color: 'text-primary' },
            { label: 'Pending Review', value: extendedProviders.filter(p => p.status === 'pending').length, color: 'text-amber-500' },
            { label: 'Avg Rating', value: avgRating, color: '' },
          ].map(s => (
            <Card key={s.label} className="border-border p-4">
              <p className="text-xs text-muted mb-1">{s.label}</p>
              <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-border p-4 mb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1 relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search providers by name or email..."
                className="pl-9"
                aria-label="Search providers"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-border w-full sm:w-auto" onClick={() => {
              const headers = ['Name', 'Email', 'Status', 'Categories', 'Rating', 'Bookings', 'Earnings', 'Joined'];
              const rows = filteredProviders.map(p => [
                p.name,
                p.email ?? '',
                p.status,
                p.categories.join('; '),
                p.rating,
                p.completedBookings,
                p.totalEarnings,
                new Date(p.joined_date).toLocaleDateString('en-US'),
              ]);
              const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = `providers-${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
              URL.revokeObjectURL(a.href);
              toast.success('Export downloaded');
            }}>
              <Download size={14} className="mr-1.5" /> Export CSV
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card className="border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Categories</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="hidden sm:table-cell">Bookings</TableHead>
                  <TableHead className="hidden sm:table-cell">Earnings</TableHead>
                  <TableHead className="hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.map(provider => (
                  <TableRow key={provider.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 shrink-0">
                          <AvatarFallback className="bg-primary/20 text-sm font-medium">
                            {provider.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{provider.name}</p>
                          <p className="text-xs text-muted">{provider.zip_codes?.slice(0,2).join(', ')}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {provider.status === 'active' && (
                        <Badge className="bg-primary/10 text-primary border-0 text-xs">
                          <CheckCircle size={11} className="mr-1" /> Active
                        </Badge>
                      )}
                      {provider.status === 'pending' && (
                        <Badge variant="secondary" className="text-xs">Pending</Badge>
                      )}
                      {provider.status === 'suspended' && (
                        <Badge variant="destructive" className="text-xs">
                          <XCircle size={11} className="mr-1" /> Suspended
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {provider.categories.slice(0, 1).map(cat => (
                          <Badge key={cat} variant="outline" className="text-xs border-border">{cat}</Badge>
                        ))}
                        {provider.categories.length > 1 && (
                          <Badge variant="outline" className="text-xs border-border">+{provider.categories.length - 1}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-sm">{provider.rating}</span>
                      <span className="text-xs text-muted ml-1">({provider.review_count})</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{provider.completedBookings}</TableCell>
                    <TableCell className="hidden sm:table-cell font-medium text-sm">${provider.totalEarnings.toLocaleString()}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted">
                      {new Date(provider.joined_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" aria-label="Actions">
                            <MoreVertical size={15} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/provider/${provider.id}`}>
                              <Eye size={14} className="mr-2" /> View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setBookingsProvider({ id: provider.id, name: provider.name })}>
                            <Calendar size={14} className="mr-2" /> View Bookings
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={provider.email ? `mailto:${provider.email}` : '#'}>
                              <Mail size={14} className="mr-2" /> Contact Provider
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={async () => {
                            const { error } = await supabase.from('providers').update({ verified: false }).eq('id', provider.id);
                            if (error) { toast.error('Failed to suspend provider'); return; }
                            setProviders(prev => prev.map(p => p.id === provider.id ? { ...p, verified: false } : p));
                            toast.success('Provider account suspended');
                          }}>
                            Suspend Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredProviders.length === 0 && (
            <p className="text-center text-muted py-10 text-sm">No providers found matching your filters</p>
          )}
        </Card>

        {/* View Bookings dialog */}
        <Dialog open={!!bookingsProvider} onOpenChange={() => setBookingsProvider(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bookings — {bookingsProvider?.name}</DialogTitle>
            </DialogHeader>
            {providerBookings.length === 0 ? (
              <p className="text-muted text-sm py-4">No bookings found.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2">
                {providerBookings.map(b => (
                  <div key={b.id} className="flex justify-between items-center text-sm py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium">{b.title}</p>
                      <p className="text-xs text-muted">{new Date(b.date).toLocaleDateString()} • {b.time} • {b.status}</p>
                    </div>
                    <span className="font-medium">${b.price}</span>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
