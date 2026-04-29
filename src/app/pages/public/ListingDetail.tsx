import { Link, useParams } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Clock, MapPin, CheckCircle2, Calendar } from 'lucide-react';
import { getListingImageUrl } from '../../../lib/storage';
import { RatingStars } from '../../components/RatingStars';
import { useListing } from '../../../hooks/useListings';
import { useReviews } from '../../../hooks/useReviews';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatDuration, formatPrice } from '../../../lib/formatters';

const palette = [
  'bg-primary text-primary-foreground',
  'bg-violet text-white',
  'bg-coral text-white',
  'bg-amber text-white',
  'bg-rose text-white',
];

function hashColor(name: string) {
  return palette[name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length];
}

export default function ListingDetailPublic() {
  const { id } = useParams<{ id: string }>();
  const { listing, loading: listingLoading } = useListing(id);
  const { reviews, loading: reviewsLoading } = useReviews({ listingId: id });

  const loading = listingLoading || reviewsLoading;

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner size="lg" label="Loading service details..." />
    </div>
  );

  if (!listing) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-muted">Listing not found.</p>
    </div>
  );

  const listingReviews = reviews.slice(0, 3);

  return (
    <div className="min-h-screen bg-background page-shell">
      <div className="content-shell py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="relative h-56 sm:h-80 lg:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-surface-teal to-surface-violet mb-6 lg:mb-8 animate-fade-up img-zoom">
              {listing.images[0] && getListingImageUrl(listing.images[0]) && (
                <img
                  src={getListingImageUrl(listing.images[0])}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              )}
              {listing.featured && (
                <span className="absolute top-3 left-3 bg-amber text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Featured
                </span>
              )}
            </div>

            {/* Title block */}
            <div className="mb-6 lg:mb-8 animate-fade-up delay-100">
              <div className="flex items-start justify-between mb-3 gap-3">
                <div>
                  <h1 className="text-2xl lg:text-[32px] font-bold tracking-tight mb-1.5">{listing.title}</h1>
                  <Link
                    to={`/provider/${listing.provider_id}`}
                    className="text-primary font-semibold hover:underline text-sm"
                  >
                    {listing.provider_name}
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={listing.rating} size={15} />
                  <span className="font-semibold">{listing.rating}</span>
                  <span className="text-muted">({listing.review_count} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted">
                  <MapPin size={14} />
                  <span>Jonesboro, AR</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted">
                  <span className="font-medium text-foreground">{formatPrice(listing.price)}</span>
                  <span aria-hidden="true">•</span>
                  <Clock size={14} />
                  <span>{formatDuration(listing.duration)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 animate-fade-up delay-200">
              <h2 className="text-lg font-semibold mb-3">About this service</h2>
              <p className="text-base leading-relaxed text-muted">{listing.description}</p>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="mb-6 animate-fade-up delay-300">
                <h2 className="text-lg font-semibold mb-3">What's included</h2>
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
            <div className="animate-fade-up delay-400">
              <h2 className="text-lg font-semibold mb-5">Reviews</h2>
              {listingReviews.length === 0 ? (
                <p className="text-sm text-muted">No reviews yet for this listing.</p>
              ) : (
                <div className="space-y-4">
                  {listingReviews.map((review, i) => {
                    const reviewInitials = review.customer_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                    const reviewAvatarColor = hashColor(review.customer_name);
                    return (
                      <Card
                        key={review.id}
                        className="border-border p-5 card-lift transition-all duration-200 animate-fade-up"
                        style={{ animationDelay: `${Math.min((i + 1) * 100, 700)}ms` }}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${reviewAvatarColor}`}>
                            {reviewInitials}
                          </div>
                          <div className="flex-1 flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-sm">{review.customer_name}</p>
                              <p className="text-xs text-muted">
                                {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                            <RatingStars rating={review.rating} size={13} />
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed pl-12">{review.text}</p>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1 order-first lg:order-last animate-fade-up delay-200">
            <Card className="rounded-2xl border border-border card-lift p-5 lg:p-6 lg:sticky lg:top-8">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-primary">{formatPrice(listing.price)}</span>
                <span className="text-muted text-sm">/session</span>
              </div>

              <div className="space-y-2 text-sm text-muted mb-5 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>{formatDuration(listing.duration)}</span>
                </div>
                {listing.next_available && !isNaN(new Date(listing.next_available).getTime()) && (
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>Next: {new Date(listing.next_available).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                  </div>
                )}
              </div>

              <Link to="/login" className="block w-full">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
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
