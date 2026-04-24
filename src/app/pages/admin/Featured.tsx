import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Star, GripVertical, X, Plus } from 'lucide-react';
import { useListings } from '../../../hooks/useListings';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function FeaturedManager() {
  const { listings, loading, setListings } = useListings();
  const [searchQuery, setSearchQuery] = useState('');

  async function removeFeatured(id: string) {
    const { error } = await supabase.from('listings').update({ featured: false }).eq('id', id);
    if (error) { toast.error('Failed to update featured status'); return; }
    setListings(prev => prev.map(l => l.id === id ? { ...l, featured: false } : l));
    toast.success('Removed from featured');
  }

  async function addFeatured(id: string) {
    const { error } = await supabase.from('listings').update({ featured: true }).eq('id', id);
    if (error) { toast.error('Failed to update featured status'); return; }
    setListings(prev => prev.map(l => l.id === id ? { ...l, featured: true } : l));
    toast.success('Added to featured');
  }

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  const featuredListings = listings.filter(l => l.featured);
  const availableListings = listings.filter(l => !l.featured && l.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-background px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Featured Listings</h1>
          <p className="text-sm text-muted">Manage which listings appear on the homepage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Currently Featured */}
          <div className="lg:col-span-2">
            <Card className="border-border p-5 lg:p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Currently Featured</h2>
                <Badge className="bg-primary/10 text-primary border-0">{featuredListings.length} Active</Badge>
              </div>

              {featuredListings.length === 0 ? (
                <p className="text-sm text-muted py-4 text-center">No featured listings. Add some from the panel on the right.</p>
              ) : (
                <div className="space-y-2">
                  {featuredListings.map(listing => (
                    <div key={listing.id} className="flex items-center gap-3 p-3 bg-background border border-border rounded">
                      <GripVertical size={18} className="text-muted cursor-grab shrink-0" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{listing.title}</p>
                        <p className="text-xs text-muted">{listing.provider_name} • ${listing.price}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1">
                          <Star size={13} className="text-amber-400 fill-amber-400" />
                          <span className="text-sm font-medium">{listing.rating}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive h-9 w-9 p-0"
                          aria-label={`Remove ${listing.title} from featured`}
                          onClick={() => removeFeatured(listing.id)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted mt-4">
                Drag to reorder. Featured listings appear in this order on the homepage.
              </p>
            </Card>
          </div>

          {/* Add Featured */}
          <div>
            <Card className="border-border p-5 lg:p-6">
              <h2 className="text-lg font-medium mb-4">Add Featured Listing</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="feat-search">Search Listings</Label>
                  <Input
                    id="feat-search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by title..."
                    className="mt-1"
                  />
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2">
                  {availableListings.map(listing => (
                    <div key={listing.id} className="p-3 border border-border rounded hover:border-primary transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{listing.title}</p>
                          <p className="text-xs text-muted">{listing.provider_name}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary text-primary shrink-0 text-xs"
                          onClick={() => addFeatured(listing.id)}
                        >
                          <Plus size={12} className="mr-1" /> Add
                        </Button>
                      </div>
                    </div>
                  ))}
                  {availableListings.length === 0 && (
                    <p className="text-sm text-muted text-center py-4">No listings found</p>
                  )}
                </div>

                <p className="text-xs text-muted pt-2 border-t border-border">
                  Recommended: 3–6 featured listings for optimal homepage performance
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
