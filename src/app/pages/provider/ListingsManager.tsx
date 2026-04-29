import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { LayoutGrid, Plus, Edit, Eye } from 'lucide-react';
import { useListings } from '../../../hooks/useListings';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { EmptyState } from '../../components/EmptyState';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function ListingsManager() {
  const { user } = useAuth();
  const { listings, loading, setListings } = useListings({ providerId: user.id, status: 'all' });

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="page-shell bg-gradient-hero border-b border-border py-6 lg:py-8">
        <div className="content-shell flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-teal flex items-center justify-center shrink-0">
              <LayoutGrid size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-[32px] font-bold leading-tight">My Listings</h1>
              <p className="text-sm font-medium text-muted-foreground">
                {listings.filter(l => l.status === 'active').length} active,{' '}
                {listings.filter(l => l.status === 'draft').length} draft (10 max)
              </p>
            </div>
          </div>
          <Link to="/provider/listings/new">
            <Button className="h-11 px-6 font-bold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-teal-sm">
              <Plus size={18} />
              + Create Listing
            </Button>
          </Link>
        </div>
      </div>

      <div className="page-shell py-6 lg:py-8">
        <div className="content-shell">
          {listings.length === 0 ? (
            <EmptyState
              icon={<Plus size={40} />}
              title="No listings yet"
              description="Create your first service listing to start accepting bookings."
              action={
                <Link to="/provider/listings/new">
                  <Button className="h-11 px-8 font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
                    Create your first listing
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {listings.map((listing, i) => (
                <Card
                  key={listing.id}
                  className="card-lift rounded-2xl p-5 lg:p-6 border border-border animate-fade-up"
                  style={{ animationDelay: `${Math.min((i + 1) * 100, 700)}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 lg:gap-8">
                    {/* Image */}
                    <div className="w-full sm:w-32 h-32 sm:h-32 rounded-xl img-zoom border border-border overflow-hidden bg-muted/20 shrink-0">
                      {listing.images?.[0] && (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-4 gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-bold text-xl truncate group-hover:text-primary transition-colors">
                              {listing.title}
                            </h3>
                            {listing.status === 'draft' && (
                              <Badge className="label-pill bg-surface-amber text-amber-600 border-0">
                                Draft
                              </Badge>
                            )}
                            {listing.status === 'active' && (
                              <Badge className="label-pill bg-surface-green text-status-green border-0">
                                Active
                              </Badge>
                            )}
                            {listing.status === 'suspended' && (
                              <Badge className="label-pill bg-surface-coral text-[#F4623A] border-0">
                                Suspended
                              </Badge>
                            )}
                            {listing.status === 'archived' && (
                              <Badge className="label-pill bg-surface-coral text-[#F4623A] border-0">
                                Archived
                              </Badge>
                            )}
                            {listing.featured && (
                              <Badge className="label-pill bg-surface-teal text-primary border-0">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2 max-w-2xl">
                            {listing.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 pt-1">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:inline">
                            Active
                          </span>
                          <Switch
                            defaultChecked={listing.status === 'active'}
                            aria-label={`Toggle ${listing.title} active status`}
                            onCheckedChange={async (checked) => {
                              const newStatus = checked ? 'active' : 'draft';
                              const { error } = await supabase
                                .from('listings')
                                .update({ status: newStatus })
                                .eq('id', listing.id);
                              if (error) { toast.error('Failed to update listing'); return; }
                              toast.success(`Listing ${checked ? 'activated' : 'deactivated'}`);
                              setListings(prev =>
                                prev.map(l => l.id === listing.id ? { ...l, status: newStatus } : l)
                              );
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pt-4 border-t border-border/40">
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                            Price
                          </span>
                          <span className="font-bold text-lg text-gradient-teal">${listing.price}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                            Duration
                          </span>
                          <span className="font-bold text-lg">{listing.duration}m</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                            Activity
                          </span>
                          <span className="font-bold text-lg">{listing.review_count} Bookings</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                            Rating
                          </span>
                          <span className="font-bold text-lg text-amber-600">{listing.rating} ★</span>
                        </div>
                      </div>

                      <div className="flex gap-3 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-4 font-bold text-xs gap-2 border-border hover:border-primary hover:text-primary"
                          asChild
                        >
                          <Link to={`/provider/listings/${listing.id}/edit`}>
                            <Edit size={14} />
                            Edit Listing
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 px-4 font-bold text-xs gap-2 hover:bg-transparent hover:underline"
                          asChild
                        >
                          <Link to={`/listing/${listing.id}`} target="_blank">
                            <Eye size={14} />
                            Live Preview
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
