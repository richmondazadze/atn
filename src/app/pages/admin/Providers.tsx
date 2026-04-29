import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Search, CheckCircle, XCircle, Eye, Download, Calendar, Mail, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { useProviders } from '../../../hooks/useProviders';
import { useProviderStats } from '../../../hooks/useProviderStats';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const AVATAR_PALETTE = ['bg-primary text-primary-foreground', 'bg-violet text-white', 'bg-coral text-white', 'bg-amber text-white', 'bg-rose text-white'];
function avatarColor(name: string) {
  return AVATAR_PALETTE[name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PALETTE.length];
}

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

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <div className="bg-gradient-hero border-b border-border/50 px-4 md:px-6 lg:px-[72px] py-8 lg:py-10 animate-fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 label-pill bg-surface-violet text-violet mb-4">
            <Users size={11} />
            Admin
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold text-foreground mb-1">Provider Management</h1>
          <p className="text-sm text-muted-foreground">Review, verify, and manage all provider accounts on the platform.</p>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-[72px] py-8 lg:py-10">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up">
            {[
              { label: 'Total Providers', value: providers.length, surface: 'bg-surface-teal', text: 'text-primary' },
              { label: 'Active', value: extendedProviders.filter(p => p.status === 'active').length, surface: 'bg-surface-green', text: 'text-status-green' },
              { label: 'Pending Review', value: extendedProviders.filter(p => p.status === 'pending').length, surface: 'bg-surface-amber', text: 'text-amber-600' },
              { label: 'Avg Rating', value: avgRating, surface: 'bg-surface-violet', text: 'text-violet' },
            ].map((s, i) => (
              <div key={s.label} className={`border border-border rounded-2xl p-4 lg:p-5 bg-background animate-fade-up`} style={{ animationDelay: `${i * 75}ms` }}>
                <p className="text-xs font-bold uppercase tracking-widest text-muted mb-2">{s.label}</p>
                <p className={`text-3xl font-bold ${s.text}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="border border-border rounded-2xl p-4 bg-background animate-fade-up delay-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1 relative w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search providers by name or email..."
                  className="pl-9 focus-glow"
                  aria-label="Search providers"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-44 focus-glow">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => {
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
          </div>

          {/* Table */}
          <div className="border border-border rounded-2xl bg-background overflow-hidden animate-fade-up delay-300">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/30">
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
                    <TableRow key={provider.id} className="hover:bg-secondary/20 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9 rounded-xl shrink-0">
                            <AvatarFallback className={`rounded-xl text-sm font-bold ${avatarColor(provider.name)}`}>
                              {provider.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{provider.name}</p>
                            <p className="text-xs text-muted">{provider.zip_codes?.slice(0,2).join(', ')}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {provider.status === 'active' && (
                          <Badge className="bg-surface-green text-status-green border-0 text-xs gap-1">
                            <CheckCircle size={10} /> Active
                          </Badge>
                        )}
                        {provider.status === 'pending' && (
                          <Badge className="bg-surface-amber text-amber-600 border-0 text-xs">Pending</Badge>
                        )}
                        {provider.status === 'suspended' && (
                          <Badge className="bg-surface-coral text-coral border-0 text-xs gap-1">
                            <XCircle size={10} /> Suspended
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
                        <span className="font-bold text-sm text-foreground">{provider.rating}</span>
                        <span className="text-xs text-muted ml-1">({provider.review_count})</span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm font-semibold text-foreground">{provider.completedBookings}</TableCell>
                      <TableCell className="hidden sm:table-cell font-bold text-sm text-primary">${provider.totalEarnings.toLocaleString()}</TableCell>
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
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-2xl bg-surface-teal flex items-center justify-center mx-auto mb-3">
                  <Users size={20} className="text-primary" />
                </div>
                <p className="text-foreground font-semibold mb-1">No providers found</p>
                <p className="text-sm text-muted">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Bookings dialog */}
      <Dialog open={!!bookingsProvider} onOpenChange={() => setBookingsProvider(null)}>
        <DialogContent className="rounded-2xl">
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
                    <p className="font-semibold text-foreground">{b.title}</p>
                    <p className="text-xs text-muted">{new Date(b.date).toLocaleDateString()} • {b.time} • {b.status}</p>
                  </div>
                  <span className="font-bold text-primary">${b.price}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
