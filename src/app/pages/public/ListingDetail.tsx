import { Link, useParams } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Star, Clock, DollarSign, MapPin, CheckCircle2, Calendar, AlertCircle } from 'lucide-react';
import { listings, reviews } from '../../data/mockData';
import { getListingImage } from '../../data/images';
import { RatingStars } from '../../components/RatingStars';

export default function ListingDetailPublic() {
  const { id } = useParams<{ id: string }>();
  const listing = listings.find(l => l.id === id) ?? listings[0];
  const listingReviews = reviews.filter(r => r.listingId === listing.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-secondary px-4 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="h-56 sm:h-80 lg:h-96 rounded overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 mb-6 lg:mb-8">
              {listing.images[0] && getListingImage(listing.images[0]) && (
                <img src={getListingImage(listing.images[0])} alt={listing.title} className="w-full h-full object-cover" />
              )}
            </div>

            <div className="mb-6 lg:mb-8">
              <div className="flex items-start justify-between mb-3 gap-3">
                <div>
                  <h1 className="text-2xl lg:text-[32px] font-semibold mb-1.5">{listing.title}</h1>
                  <Link to={`/provider/${listing.providerId}`} className="text-primary hover:underline text-sm font-medium">
                    {listing.providerName}
                  </Link>
                </div>
                {listing.featured && <Badge className="bg-primary/10 text-primary border-0 shrink-0">Featured</Badge>}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={listing.rating} size={15} />
                  <span className="font-medium">{listing.rating}</span>
                  <span className="text-muted">({listing.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted">
                  <MapPin size={14} />
                  <span>Jonesboro, AR</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted">
                  <DollarSign size={14} />
                  <span>${listing.price}</span>
                  <span aria-hidden="true">•</span>
                  <Clock size={14} />
                  <span>{listing.duration}m</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-3">About this service</h2>
              <p className="text-base leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-3">What's included</h2>
                <div className="space-y-2">
                  {listing.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={15} className="text-primary shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <h2 className="text-lg font-medium mb-5">Reviews</h2>
              {listingReviews.length === 0 ? (
                <p className="text-sm text-muted">No reviews yet for this listing.</p>
              ) : (
                <div className="space-y-4">
                  {listingReviews.map(review => (
                    <Card key={review.id} className="border-border p-5">
                      <div className="flex items-start justify-between mb-2 gap-3">
                        <div>
                          <p className="font-medium text-sm">{review.customerName}</p>
                          <p className="text-xs text-muted">
                            {new Date(review.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <RatingStars rating={review.rating} size={13} />
                      </div>
                      <p className="text-sm">{review.text}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <Card className="border-border p-5 lg:p-6 lg:sticky lg:top-8">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-semibold">${listing.price}</span>
                <span className="text-muted text-sm">/session</span>
              </div>

              <div className="space-y-2 text-sm text-muted mb-5">
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>{listing.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>Next: {new Date(listing.nextAvailable).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>

              <Link to="/login">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Sign in to book
                </Button>
              </Link>

              <p className="text-xs text-muted mt-3 text-center">Free cancellation up to 24 hours before</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
