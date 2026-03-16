import { Link, useParams } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Star, MapPin, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { providers, listings, reviews } from '../../data/mockData';
import { RatingStars } from '../../components/RatingStars';

export default function ProviderProfile() {
  const { id } = useParams<{ id: string }>();
  const provider = providers.find(p => p.id === id) ?? providers[0];
  const providerListings = listings.filter(l => l.providerId === provider.id);
  const providerReviews = reviews.filter(r => r.providerId === provider.id).slice(0, 5);
  const initials = provider.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-secondary px-4 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start gap-5 mb-8 pb-8 border-b border-border">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-primary text-primary-foreground flex items-center justify-center text-2xl font-semibold shrink-0">
            {provider.avatarUrl ? (
              <img src={provider.avatarUrl} alt={provider.name} className="w-full h-full object-cover" />
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
                <span className="text-muted">({provider.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted">
                <MapPin size={13} />
                <span>{provider.zipCodes.slice(0, 3).join(', ')}</span>
              </div>
              <span className="text-muted text-sm">
                Member since {new Date(provider.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            {provider.bio && <p className="text-sm leading-relaxed max-w-2xl">{provider.bio}</p>}
          </div>
        </div>

        {/* Services */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-5">Services offered</h2>
          {providerListings.length === 0 ? (
            <p className="text-sm text-muted">No listings yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {providerListings.map(listing => (
                <Card key={listing.id} className="border-border p-5 hover:border-primary transition-colors">
                  <h3 className="font-medium mb-1.5">{listing.title}</h3>
                  <p className="text-sm text-muted mb-4 line-clamp-2">{listing.description}</p>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="font-medium flex items-center gap-1">
                      <DollarSign size={13} />{listing.price}
                    </span>
                    <span className="text-muted flex items-center gap-1">
                      <Clock size={13} />{listing.duration}m
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
        </section>
      </div>
    </div>
  );
}
