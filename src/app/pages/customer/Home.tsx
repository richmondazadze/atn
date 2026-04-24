import { Link, useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { ListingCard } from '../../components/ListingCard';
import { RatingStars } from '../../components/RatingStars';
import { Clock, MapPin, ArrowRight, Search } from 'lucide-react';
import { useListings } from '../../../hooks/useListings';
import { useBookings } from '../../../hooks/useBookings';
import { useFavorites } from '../../../hooks/useFavorites';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function CustomerHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { listings, loading: listingsLoading } = useListings();
  const { bookings, loading: bookingsLoading, refetch: refetchBookings } = useBookings();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const firstName = user.name.split(' ')[0];
  const loading = listingsLoading || bookingsLoading;

  const now = new Date();
  const upcoming = bookings
    .filter(b => {
      if (b.status !== 'confirmed') return false;
      const d = new Date(`${b.date}T${b.time}`);
      return d > now;
    })
    .slice(0, 2);

  const completedListingIds = [...new Set(
    bookings.filter(b => b.status === 'completed').map(b => b.listing_id)
  )];
  const { listings: bookAgainListings } = useListings(
    completedListingIds.length > 0 ? { listingIds: completedListingIds, status: 'all' } : { listingIds: ['__none__'] }
  );

  const preferredCategories = [...new Set(
    bookings.filter(b => b.status === 'completed').flatMap(b => {
      const listing = listings.find(l => l.id === b.listing_id);
      return listing?.category_slug ? [listing.category_slug] : [];
    })
  )];
  const featuredForYou = listings.filter(l => l.featured)
    .sort((a, b) => {
      const aMatch = preferredCategories.includes(a.category_slug) ? 1 : 0;
      const bMatch = preferredCategories.includes(b.category_slug) ? 1 : 0;
      if (aMatch !== bMatch) return bMatch - aMatch;
      const aFav = favoriteIds.has(a.id) ? 1 : 0;
      const bFav = favoriteIds.has(b.id) ? 1 : 0;
      return bFav - aFav;
    })
    .slice(0, 3);

  const bookAgain = bookAgainListings.slice(0, 3);

  async function handleCancel(bookingId: string) {
    const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
    if (error) { toast.error('Failed to cancel'); return; }
    toast.success('Booking cancelled');
    refetchBookings();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ── Welcome header ──────────────────────────────── */}
      <div className="bg-background border-b border-border/60 px-4 md:px-6 lg:px-[72px]">
        <div className="py-8 lg:py-12 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight animate-fade-up">
                Hey, {firstName}
              </h1>
              <p className="text-sm font-medium text-muted-foreground mt-2 animate-fade-up delay-100">
                Jonesboro, AR • Service Customer Dashboard
              </p>
            </div>
            <div className="flex items-center gap-3 animate-fade-up delay-200">
              <Button asChild variant="outline" className="h-11 px-6 font-bold" onClick={() => navigate('/customer/bookings')}>
                <Link to="/customer/bookings">My Schedule</Link>
              </Button>
              <Button asChild className="h-11 px-6 font-bold gap-2">
                <Link to="/customer/search">
                  <Search size={16} />
                  Find services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-[72px]">
        <div className="py-8 lg:py-10 max-w-7xl mx-auto space-y-12">

          {/* ── Upcoming Bookings ───────────────────────── */}
          {upcoming.length > 0 && (
            <section className="animate-fade-up">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">Your Schedule</h2>
                <Button asChild variant="ghost" className="text-primary font-bold text-sm gap-1 px-0 hover:bg-transparent hover:underline">
                  <Link to="/customer/bookings">
                    Full calendar <ArrowRight size={14} />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {upcoming.map((booking, i) => (
                  <Card
                    key={booking.id}
                    className={`p-5 lg:p-6 animate-fade-up`}
                    style={{ animationDelay: `${(i + 1) * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 border border-primary/10">
                            Confirmed
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground truncate">{booking.title}</h3>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Clock size={14} className="text-muted-foreground" />
                        <span className="font-medium text-foreground">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {booking.time}</span>
                      </div>
                      {booking.address && (
                        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                          <MapPin size={14} className="text-muted-foreground" />
                          <span className="truncate font-medium text-foreground">{booking.address}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-auto mb-5 pt-4 border-t border-border/40">
                      <div className="text-xl font-bold text-foreground chewy-regular">${booking.price}</div>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-tighter chewy-regular">{booking.duration} min</div>
                    </div>
                    <div className="flex gap-2 pt-5 border-t border-border/50">
                      <Button variant="outline" className="flex-1 font-bold text-xs h-9" asChild>
                        <Link to="/customer/bookings">Manage</Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="flex-1 font-bold text-xs h-9 text-coral hover:bg-surface-coral hover:text-coral"
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* ── Featured for you ────────────────────────── */}
          <section className="animate-fade-up delay-100">
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-foreground">Featured for You</h2>
              </div>
              <Button asChild variant="ghost" className="text-primary text-sm gap-1 hidden sm:flex">
                <Link to="/customer/search">
                  Browse all <ArrowRight size={14} />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredForYou.map((listing, i) => (
                <div key={listing.id} className={`animate-fade-up delay-${(i + 1) * 100}`}>
                  <ListingCard
                    id={listing.id}
                    title={listing.title}
                    providerName={listing.provider_name ?? ''}
                    price={listing.price}
                    duration={listing.duration}
                    rating={listing.rating}
                    reviewCount={listing.review_count}
                    nextAvailable={listing.next_available ?? ''}
                    featured={listing.featured}
                    category={listing.category_slug}
                    image={listing.images[0]}
                    linkPrefix="/customer"
                    isFavorite={favoriteIds.has(listing.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ── Recently Booked ──────────────────────────────── */}
          <section className="animate-fade-up delay-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">Recently Booked</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(bookAgain.length > 0 ? bookAgain : listings.slice(0, 3)).map((listing, i) => (
                <Card
                  key={listing.id}
                  className={`p-6 hover:border-primary/50 transition-all group animate-fade-up`}
                  style={{ animationDelay: `${(i + 1) * 100}ms` }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-none border border-border flex items-center justify-center text-sm font-bold shrink-0 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all" aria-hidden="true">
                      {(listing.provider_name ?? '').split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-base truncate text-foreground group-hover:text-primary transition-colors">{listing.title}</h3>
                      <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-tighter">{listing.provider_name}</p>
                      <div className="mt-2">
                        <RatingStars rating={listing.rating} showCount={false} size={12} />
                      </div>
                    </div>
                  </div>
                  <Button asChild className="w-full font-bold text-xs h-10">
                    <Link to={`/customer/listing/${listing.id}`}>Book again</Link>
                  </Button>
                </Card>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
