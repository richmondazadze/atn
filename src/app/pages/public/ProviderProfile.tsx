import { Link, useParams } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { MapPin, CheckCircle2, Clock } from 'lucide-react';
import { RatingStars } from '../../components/RatingStars';
import { useProvider } from '../../../hooks/useProviders';
import { useListings } from '../../../hooks/useListings';
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
  const avatarColor = hashColor(provider.name);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="page-shell bg-gradient-hero border-b border-border">
        <div className="content-shell py-8 lg:py-12">
          <div className="flex flex-col sm:flex-row items-start gap-6 animate-fade-up">
            {/* Avatar */}
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex items-center justify-center text-2xl font-bold shrink-0 shadow-md ${provider.avatar_url ? '' : avatarColor}`}>
              {provider.avatar_url ? (
                <img src={provider.avatar_url} alt={provider.name} className="w-full h-full object-cover" />
              ) : initials}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="label-pill bg-surface-violet text-violet text-xs font-semibold px-2.5 py-0.5 rounded-full">Provider</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl lg:text-[32px] font-bold tracking-tight">{provider.name}</h1>
                {provider.verified && (
                  <CheckCircle2 size={22} className="text-status-green shrink-0" aria-label="Verified" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 mb-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={provider.rating} size={14} />
                  <span className="font-semibold">{provider.rating}</span>
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
              {provider.bio && <p className="text-sm leading-relaxed max-w-2xl text-muted">{provider.bio}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="page-shell py-6 lg:py-10">
        <div className="content-shell">
        {/* Services */}
        <section className="mb-10 animate-fade-up delay-100">
          <h2 className="text-xl font-bold mb-5">Services offered</h2>
          {listings.length === 0 ? (
            <p className="text-sm text-muted">No listings yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {listings.map((listing, i) => (
                <Card
                  key={listing.id}
                  className="border-border p-5 card-lift hover:border-primary/40 transition-all duration-200"
                  style={{ animationDelay: `${Math.min((i + 1) * 100, 700)}ms` }}
                >
                  <h3 className="font-semibold mb-1.5">{listing.title}</h3>
                  <p className="text-sm text-muted mb-4 line-clamp-2">{listing.description}</p>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-lg font-bold text-primary">{formatPrice(listing.price)}</span>
                    <span className="text-muted flex items-center gap-1">
                      <Clock size={13} />
                      <span>{formatDuration(listing.duration)}</span>
                    </span>
                  </div>
                  <Link to="/login">
                    <Button variant="outline" className="w-full border-border text-sm hover:border-primary/40 hover:bg-surface-teal/50 transition-colors">
                      Sign in to book
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Reviews */}
        <section className="animate-fade-up delay-200">
          <h2 className="text-xl font-bold mb-5">Reviews</h2>
          {providerReviews.length === 0 ? (
            <p className="text-sm text-muted">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {providerReviews.map((review, i) => {
                const reviewInitials = review.customer_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                const reviewAvatarColor = hashColor(review.customer_name);
                return (
                  <Card
                    key={review.id}
                    className="border-border p-5 card-lift transition-all duration-200"
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
        </section>
        </div>
      </div>
    </div>
  );
}
