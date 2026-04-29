import { useMemo, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Link } from 'react-router';
import { Search, Flag, CheckCircle, XCircle, Eye, FileText } from 'lucide-react';
import { useListings } from '../../../hooks/useListings';
import { useCategories } from '../../../hooks/useCategories';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function ListingsModeration() {
  const { listings, loading: listingsLoading, setListings } = useListings({ status: 'all' });
  const { categories, loading: categoriesLoading } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  async function handleApprove(id: string) {
    const { error } = await supabase.from('listings').update({ status: 'active' }).eq('id', id);
    if (error) { toast.error('Failed to approve listing'); return; }
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'active' } : l));
    toast.success('Listing approved');
  }

  async function handleSuspend(id: string) {
    const { error } = await supabase.from('listings').update({ status: 'suspended' }).eq('id', id);
    if (error) { toast.error('Failed to remove listing'); return; }
    setListings(prev => prev.filter(l => l.id !== id));
    toast.success('Listing removed');
  }

  const loading = listingsLoading || categoriesLoading;

  const filteredListings = useMemo(() =>
    listings.filter(l => {
      const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || l.category_slug === categoryFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'approved' && l.status === 'active') ||
        (statusFilter === 'flagged' && l.status === 'suspended') ||
        (statusFilter === 'draft' && l.status === 'draft');
      return matchesSearch && matchesCategory && matchesStatus;
    }), [listings, searchQuery, categoryFilter, statusFilter]);

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="page-shell bg-gradient-hero border-b border-border py-6 lg:py-8">
        <div className="content-shell">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-teal flex items-center justify-center shrink-0">
              <FileText size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-[32px] font-bold leading-tight">Listings</h1>
              <p className="text-sm text-muted-foreground">Review and manage service listings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-shell py-6 lg:py-8">
        <div className="content-shell">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Total Listings', value: listings.length, colorClass: '' },
              { label: 'Active', value: listings.filter(l => l.status === 'active').length, colorClass: 'text-primary' },
              { label: 'Suspended', value: listings.filter(l => l.status === 'suspended').length, colorClass: 'text-destructive' },
              { label: 'Featured', value: listings.filter(l => l.featured).length, colorClass: '' },
            ].map((s, i) => (
              <Card
                key={s.label}
                className="card-lift rounded-2xl border-border p-4 animate-fade-up"
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.colorClass}`}>{s.value}</p>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="rounded-2xl border-border p-4 mb-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1 relative w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search listings..."
                  className="pl-11"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Active</SelectItem>
                  <SelectItem value="flagged">Suspended</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Table */}
          <Card className="card-lift rounded-2xl border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-hero">
                    <TableHead>Listing</TableHead>
                    <TableHead className="hidden sm:table-cell">Provider</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredListings.map(listing => (
                    <TableRow key={listing.id} className="hover:bg-secondary/40 transition-colors">
                      <TableCell>
                        <p className="font-semibold text-sm">{listing.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">{listing.description}</p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">{listing.provider_name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge className="label-pill bg-surface-teal text-primary border-0">
                          {categories.find(c => c.slug === listing.category_slug)?.name || listing.category_slug}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-sm text-gradient-teal">
                        ${listing.price}
                      </TableCell>
                      <TableCell>
                        {listing.status === 'active' && (
                          <Badge className="label-pill bg-surface-green text-status-green border-0">
                            <CheckCircle size={11} className="mr-1" /> Active
                          </Badge>
                        )}
                        {listing.status === 'suspended' && (
                          <Badge className="label-pill bg-surface-coral text-[#F4623A] border-0">
                            <Flag size={11} className="mr-1" /> Suspended
                          </Badge>
                        )}
                        {listing.status === 'draft' && (
                          <Badge className="label-pill bg-surface-amber text-amber-600 border-0">
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="font-semibold text-sm">{listing.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">({listing.review_count})</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 flex-wrap">
                          <Link to={`/listing/${listing.id}`} target="_blank" rel="noreferrer">
                            <Button variant="ghost" size="sm">
                              <Eye size={14} className="mr-1" /> Preview
                            </Button>
                          </Link>
                          {listing.status === 'suspended' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                                onClick={() => handleApprove(listing.id)}
                              >
                                <CheckCircle size={13} className="mr-1" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-destructive text-destructive text-xs hover:bg-destructive/10"
                                onClick={() => handleSuspend(listing.id)}
                              >
                                <XCircle size={13} className="mr-1" /> Remove
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredListings.length === 0 && (
              <p className="text-center text-muted-foreground py-10 text-sm">
                No listings found matching your filters
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
