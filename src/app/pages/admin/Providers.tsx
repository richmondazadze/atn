import { useMemo, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Search, CheckCircle, XCircle, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { providers } from '../../data/mockData';
import { toast } from 'sonner';

// Stable per-item data so values don't change on re-render
const extendedProviders = providers.map((p, i) => ({
  ...p,
  status: i % 3 === 1 ? 'pending' : 'active',
  totalEarnings: (i + 1) * 2300 + 1000,
  completedBookings: (i + 1) * 22 + 10,
}));

export default function ProvidersTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProviders = useMemo(() =>
    extendedProviders.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    }), [searchQuery, statusFilter]);

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
            { label: 'Avg Rating', value: '4.8', color: '' },
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
            <Button variant="outline" className="border-border w-full sm:w-auto" onClick={() => toast.info('Export coming soon')}>
              Export CSV
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
                            {provider.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{provider.name}</p>
                          <p className="text-xs text-muted">{provider.zipCodes?.slice(0,2).join(', ')}</p>
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
                      <span className="text-xs text-muted ml-1">({provider.reviewCount})</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{provider.completedBookings}</TableCell>
                    <TableCell className="hidden sm:table-cell font-medium text-sm">${provider.totalEarnings.toLocaleString()}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted">
                      {new Date(provider.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" aria-label="Actions">
                            <MoreVertical size={15} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info('Profile view coming soon')}>
                            <Eye size={14} className="mr-2" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info('Coming soon')}>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info('Coming soon')}>View Bookings</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info('Coming soon')}>Contact Provider</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => toast.error('Suspend action coming soon')}>
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
      </div>
    </div>
  );
}
