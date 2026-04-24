import { Heart } from 'lucide-react';
import { ListingCard } from '../../components/ListingCard';
import { Button } from '../../components/ui/button';
import { useListings } from '../../../hooks/useListings';
import { useFavorites } from '../../../hooks/useFavorites';
import { EmptyState } from '../../components/EmptyState';
import { Link } from 'react-router';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function Favorites() {
  const { favoriteIds, loading: favoritesLoading, toggleFavorite } = useFavorites();
  const ids = Array.from(favoriteIds);
  const { listings, loading: listingsLoading } = useListings(
    ids.length > 0 ? { listingIds: ids, status: 'all' } : { listingIds: [] }
  );

  const loading = favoritesLoading || listingsLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const favoriteListings = listings.filter(l => favoriteIds.has(l.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero border-b border-border/60 px-4 md:px-6 lg:px-[72px]">
        <div className="py-8 max-w-7xl mx-auto flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-[32px] font-bold text-foreground mb-1">Favorites</h1>
          </div>
          {favoriteListings.length > 0 && (
            <span className="text-sm text-muted font-medium"><span className="chewy-regular">{favoriteListings.length}</span> saved</span>
          )}
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-[72px]">
        <div className="py-8 max-w-7xl mx-auto">
          {favoriteListings.length === 0 ? (
            <EmptyState
              icon={<Heart size={40} />}
              title="No favorites yet"
              description="Save services you love to quickly book them again."
              action={<Link to="/customer/search"><Button>Browse services</Button></Link>}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
              {favoriteListings.map((listing, i) => (
                <div key={listing.id} className={`animate-fade-up`} style={{ animationDelay: `${Math.min(i, 7) * 60}ms` }}>
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
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
