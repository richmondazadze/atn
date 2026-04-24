import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Plus, Edit, Eye } from 'lucide-react';
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
    <div className="min-h-screen bg-background px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 lg:mb-12">
          <div>
            <h1 className="text-2xl lg:text-[32px] font-bold mb-1">Service Listings</h1>
            <p className="text-sm font-medium text-muted-foreground">{listings.filter(l => l.status === 'active').length} active, {listings.filter(l => l.status === 'draft').length} draft (10 max)</p>
          </div>
          <Link to="/provider/listings/new">
            <Button className="h-11 px-6 font-bold gap-2">
              <Plus size={18} />
              Create Listing
            </Button>
          </Link>
        </div>

        {listings.length === 0 ? (
          <EmptyState
            icon={<Plus size={40} />}
            title="No listings yet"
            description="Create your first service listing to start accepting bookings."
            action={
              <Link to="/provider/listings/new">
                <Button className="h-11 px-8 font-bold">Create your first listing</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <Card key={listing.id} className="p-5 lg:p-6 group hover:border-primary/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 lg:gap-8">
                  <div className="w-full sm:w-32 h-32 sm:h-32 rounded-none border border-border overflow-hidden bg-muted/20 shrink-0">
                    {listing.images?.[0] && (
                      <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" loading="lazy" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-4 gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-bold text-xl truncate group-hover:text-primary transition-colors">{listing.title}</h3>
                          {listing.status === 'draft' && (
                            <Badge className="rounded-none bg-muted text-muted-foreground border-border text-[10px] uppercase font-bold tracking-wider">Draft</Badge>
                          )}
                          {listing.featured && (
                            <Badge className="rounded-none bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-bold tracking-wider">Featured</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2 max-w-2xl">{listing.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 pt-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:inline">Active</span>
                        <Switch
                          defaultChecked={listing.status === 'active'}
                          aria-label={`Toggle ${listing.title} active status`}
                          onCheckedChange={async (checked) => {
                            const newStatus = checked ? 'active' : 'draft';
                            const { error } = await supabase.from('listings').update({ status: newStatus }).eq('id', listing.id);
                            if (error) { toast.error('Failed to update listing'); return; }
                            toast.success(`Listing ${checked ? 'activated' : 'deactivated'}`);
                            setListings(prev => prev.map(l => l.id === listing.id ? { ...l, status: newStatus } : l));
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pt-4 border-t border-border/40">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Price</span>
                        <span className="font-bold text-lg chewy-regular">${listing.price}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Duration</span>
                        <span className="font-bold text-lg chewy-regular">{listing.duration}m</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Activity</span>
                        <span className="font-bold text-lg chewy-regular">{listing.review_count} Bookings</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Rating</span>
                        <span className="font-bold text-lg text-amber-600 chewy-regular">{listing.rating} ★</span>
                      </div>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      <Button variant="outline" size="sm" className="h-9 px-4 font-bold text-xs gap-2" asChild>
                        <Link to={`/provider/listings/${listing.id}/edit`}>
                          <Edit size={14} />
                          Edit Listing
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-9 px-4 font-bold text-xs gap-2 hover:bg-transparent hover:underline" asChild>
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
  );
}
