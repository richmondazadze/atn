import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { ListingCard } from '../../components/ListingCard';
import { RatingStars } from '../../components/RatingStars';
import { Clock, MapPin } from 'lucide-react';
import { listings, bookings } from '../../data/mockData';
import { getListingImage } from '../../data/images';
import { useAuth } from '../../context/AuthContext';

export default function CustomerHome() {
  const { user } = useAuth();
  const firstName = user.name.split(' ')[0];
  const featured = listings.filter(l => l.featured).slice(0, 3);
  const upcoming = bookings.filter(b => b.status === 'confirmed').slice(0, 2);
  const previousListings = listings.slice(0, 3);

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Welcome back, {firstName}</h1>
          <p className="text-sm text-muted">Here's what's happening with your bookings</p>
        </div>

        {/* Upcoming Bookings */}
        {upcoming.length > 0 && (
          <section className="mb-10 lg:mb-12">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-xl lg:text-2xl font-semibold">Upcoming Bookings</h2>
              <Link to="/customer/bookings">
                <Button variant="ghost" className="text-primary text-sm">View all</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {upcoming.map(booking => (
                <Card key={booking.id} className="border-border bg-white p-5 lg:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-medium mb-0.5">{booking.title}</h3>
                      <p className="text-sm text-muted">{booking.providerName}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="font-semibold">${booking.price}</div>
                      <div className="text-xs text-muted">{booking.duration}m</div>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Clock size={13} />
                      <span>{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <MapPin size={13} />
                      <span className="truncate">{booking.address}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 border-border text-sm min-h-10">View details</Button>
                    <Button variant="ghost" className="text-destructive text-sm min-h-10">Cancel</Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Featured services */}
        <section className="mb-10 lg:mb-12">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-xl lg:text-2xl font-semibold">Featured services for you</h2>
            <Link to="/customer/search">
              <Button variant="ghost" className="text-primary text-sm">Browse all</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {featured.map(listing => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                providerName={listing.providerName}
                price={listing.price}
                duration={listing.duration}
                rating={listing.rating}
                reviewCount={listing.reviewCount}
                nextAvailable={listing.nextAvailable}
                featured={listing.featured}
                category={listing.category}
                image={listing.images[0] ? getListingImage(listing.images[0]) : undefined}
                linkPrefix="/customer"
              />
            ))}
          </div>
        </section>

        {/* Book again */}
        <section>
          <h2 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6">Book again</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {previousListings.map(listing => (
              <Card key={listing.id} className="border-border bg-white p-5 hover:border-primary transition-colors">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0" aria-hidden="true">
                    {listing.providerName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm truncate">{listing.title}</h3>
                    <p className="text-xs text-muted mt-0.5 truncate">{listing.providerName}</p>
                    <RatingStars rating={listing.rating} showCount={false} size={12} />
                  </div>
                </div>
                <Link to={`/customer/listing/${listing.id}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md">
                  <Button variant="outline" className="w-full border-border text-sm">Book again</Button>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
