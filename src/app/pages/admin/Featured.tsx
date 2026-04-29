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

const STAGGER = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500', 'delay-600', 'delay-700'];

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
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-hero border-b border-border px-4 md:px-6 lg:px-[72px] py-8 lg:py-10">
        <div className="max-w-7xl mx-auto animate-fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-surface-gold flex items-center justify-center shrink-0">
                <Star size={22} className="text-gold fill-gold" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="label-pill bg-surface-gold text-gold-foreground">Curation</span>
                </div>
                <h1 className="text-2xl lg:text-[32px] font-semibold leading-tight">Featured Listings</h1>
                <p className="text-sm text-muted mt-0.5">Manage which listings appear on the homepage</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="label-pill bg-surface-teal text-primary animate-scale-in">
                <Star size={11} />
                {featuredListings.length} Featured
              </span>
              <span className="label-pill bg-secondary text-muted animate-scale-in delay-100">
                {listings.length} Total
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-[72px] py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Currently Featured */}
            <div className="lg:col-span-2">
              <Card className="border-border p-5 lg:p-6 mb-6 animate-fade-up">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-surface-gold flex items-center justify-center">
                      <Star size={14} className="text-gold fill-gold" />
                    </div>
                    <h2 className="text-lg font-medium">Currently Featured</h2>
                  </div>
                  <Badge className="bg-surface-teal text-primary border-0">
                    {featuredListings.length} Active
                  </Badge>
                </div>

                {featuredListings.length === 0 ? (
                  <div className="py-10 text-center border border-dashed border-border">
                    <Star size={32} className="mx-auto mb-3 text-muted opacity-40" />
                    <p className="text-sm text-muted">No featured listings yet.</p>
                    <p className="text-xs text-muted mt-1">Add some from the panel on the right.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {featuredListings.map((listing, idx) => (
                      <div
                        key={listing.id}
                        className={`flex items-center gap-3 p-3 bg-secondary border border-border card-lift animate-fade-up ${STAGGER[Math.min(idx, 7)]}`}
                      >
                        <GripVertical size={18} className="text-muted cursor-grab shrink-0" aria-hidden="true" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">{listing.title}</p>
                            <Star size={11} className="text-gold fill-gold shrink-0" />
                          </div>
                          <p className="text-xs text-muted">{listing.provider_name} · ${listing.price}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center gap-1 bg-surface-gold px-2 py-0.5">
                            <Star size={11} className="text-gold fill-gold" />
                            <span className="text-xs font-semibold text-gold-foreground">{listing.rating}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-coral hover:bg-surface-coral hover:text-coral h-8 w-8 p-0"
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

                <p className="text-xs text-muted mt-4 pt-3 border-t border-border">
                  Drag to reorder. Featured listings appear in this order on the homepage.
                </p>
              </Card>
            </div>

            {/* Add Featured */}
            <div>
              <Card className="border-border p-5 lg:p-6 animate-fade-up delay-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-surface-teal flex items-center justify-center">
                    <Plus size={14} className="text-primary" />
                  </div>
                  <h2 className="text-lg font-medium">Add Featured Listing</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="feat-search">Search Listings</Label>
                    <Input
                      id="feat-search"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search by title..."
                      className="mt-1 border-border focus:border-primary"
                    />
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2 pr-0.5">
                    {availableListings.map((listing, idx) => (
                      <div
                        key={listing.id}
                        className={`p-3 border border-border bg-secondary hover:border-primary hover:bg-surface-teal transition-colors animate-fade-up ${STAGGER[Math.min(idx, 7)]}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{listing.title}</p>
                            <p className="text-xs text-muted">{listing.provider_name}</p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 text-xs h-7 px-2"
                            onClick={() => addFeatured(listing.id)}
                          >
                            <Plus size={12} className="mr-1" /> Add
                          </Button>
                        </div>
                      </div>
                    ))}
                    {availableListings.length === 0 && (
                      <p className="text-sm text-muted text-center py-6 border border-dashed border-border">
                        No listings found
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-muted pt-3 border-t border-border">
                    Recommended: 3–6 featured listings for optimal homepage performance
                  </p>
                </div>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
