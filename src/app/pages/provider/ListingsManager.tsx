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

export default function ListingsManager() {
  const { user } = useAuth();
  const { listings, loading, setListings } = useListings({ providerId: user.id });

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">My Listings</h1>
            <p className="text-sm text-muted">{listings.length} active listing{listings.length !== 1 ? 's' : ''} (10 max)</p>
          </div>
          <Link to="/provider/listings/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
              <Plus size={16} className="mr-2" />
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
                <Button className="bg-primary text-primary-foreground">Create your first listing</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <Card key={listing.id} className="border-border p-5 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 lg:gap-6">
                  <div className="w-full sm:w-28 h-32 sm:h-28 rounded overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 shrink-0">
                    {listing.images?.[0] && (
                      <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" loading="lazy" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h3 className="font-medium text-lg truncate">{listing.title}</h3>
                          {listing.featured && <Badge className="bg-primary/10 text-primary border-0 shrink-0">Featured</Badge>}
                        </div>
                        <p className="text-sm text-muted line-clamp-2">{listing.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted hidden sm:inline">Active</span>
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

                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-sm">
                      <div>
                        <span className="text-xs text-muted block">Price</span>
                        <span className="font-medium">${listing.price}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted block">Duration</span>
                        <span className="font-medium">{listing.duration}m</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted block">Bookings</span>
                        <span className="font-medium">{listing.review_count}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted block">Rating</span>
                        <span className="font-medium">{listing.rating} ★</span>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Link to={`/provider/listings/${listing.id}/edit`}>
                        <Button variant="outline" size="sm" className="border-border">
                          <Edit size={14} className="mr-1.5" />
                          Edit
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => toast.info('Preview coming soon')}>
                        <Eye size={14} className="mr-1.5" />
                        Preview
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
