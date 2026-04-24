import { Link, useParams } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { MapPin, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { RatingStars } from '../../components/RatingStars';
import { useProvider } from '../../../hooks/useProviders';
import { useListings } from '../../../hooks/useListings';
import { useReviews } from '../../../hooks/useReviews';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function ProviderProfile() {
  const { id } = useParams<{ id: string }>();
  const { provider, loading: providerLoading } = useProvider(id);
  const { listings, loading: listingsLoading } = useListings({ providerId: id });
  const { reviews, loading: reviewsLoading } = useReviews({ providerId: id });

  const loading = providerLoading || listingsLoading || reviewsLoading;

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  if (!provider) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-muted">Provider not found.</p>
    </div>
  );

  const providerReviews = reviews.slice(0, 5);
  const initials = provider.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start gap-5 mb-8 pb-8 border-b border-border">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-primary text-primary-foreground flex items-center justify-center text-2xl font-semibold shrink-0">
            {provider.avatar_url ? (
              <img src={provider.avatar_url} alt={provider.name} className="w-full h-full object-cover" />
            ) : initials}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl lg:text-[32px] font-semibold">{provider.name}</h1>
              {provider.verified && <CheckCircle2 size={20} className="text-primary" aria-label="Verified" />}
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-3 text-sm">
              <div className="flex items-center gap-1.5">
                <RatingStars rating={provider.rating} size={14} />
                <span className="font-medium">{provider.rating}</span>
                <span className="text-muted">({provider.review_count} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted">
                <MapPin size={13} />
                <span>{provider.zip_codes.slice(0, 3).join(', ')}</span>
              </div>
              <span className="text-muted text-sm">
                Member since {new Date(provider.joined_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            {provider.bio && <p className="text-sm leading-relaxed max-w-2xl">{provider.bio}</p>}
          </div>
        </div>

        {/* Services */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-5">Services offered</h2>
          {listings.length === 0 ? (
            <p className="text-sm text-muted">No listings yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {listings.map(listing => (
                <Card key={listing.id} className="border-border p-5 hover:border-primary transition-colors">
                  <h3 className="font-medium mb-1.5">{listing.title}</h3>
                  <p className="text-sm text-muted mb-4 line-clamp-2">{listing.description}</p>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="font-medium flex items-center gap-1">
                      <span>$</span>
                      <span>{typeof listing.price === 'number' ? listing.price : parseFloat(String(listing.price).replace(/[^0-9.]/g, '')) || 0}</span>
                    </span>
                    <span className="text-muted flex items-center gap-1">
                      <Clock size={13} />
                      <span>{listing.duration >= 60 ? `${Math.floor(listing.duration / 60)}h` : `${listing.duration}m`}</span>
                    </span>
                  </div>
                  <Link to="/login">
                    <Button variant="outline" className="w-full border-border text-sm">
                      Sign in to book
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Reviews */}
        <section>
          <h2 className="text-xl font-semibold mb-5">Reviews</h2>
          {providerReviews.length === 0 ? (
            <p className="text-sm text-muted">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {providerReviews.map(review => (
                <Card key={review.id} className="border-border p-5">
                  <div className="flex items-start justify-between mb-2 gap-3">
                    <div>
                      <p className="font-medium text-sm">{review.customer_name}</p>
                      <p className="text-xs text-muted">
                        {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <RatingStars rating={review.rating} size={13} />
                  </div>
                  <p className="text-sm">{review.text}</p>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
