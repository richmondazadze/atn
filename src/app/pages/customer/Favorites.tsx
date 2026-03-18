import { Heart } from 'lucide-react';
import { ListingCard } from '../../components/ListingCard';
import { Button } from '../../components/ui/button';
import { useListings } from '../../../hooks/useListings';
import { useFavorites } from '../../../hooks/useFavorites';
import { EmptyState } from '../../components/EmptyState';
import { Link } from 'react-router';

export default function Favorites() {
  const { favoriteIds, loading: favoritesLoading, toggleFavorite } = useFavorites();
  const ids = Array.from(favoriteIds);
  const { listings, loading: listingsLoading } = useListings(
    ids.length > 0 ? { listingIds: ids, status: 'all' } : { listingIds: [] }
  );

  const loading = favoritesLoading || listingsLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const favoriteListings = listings.filter(l => favoriteIds.has(l.id));

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-[32px] font-semibold">Favorites</h1>
          {favoriteListings.length > 0 && (
            <span className="text-sm text-muted">{favoriteListings.length} saved</span>
          )}
        </div>

        {favoriteListings.length === 0 ? (
          <EmptyState
            icon={<Heart size={40} />}
            title="No favorites yet"
            description="Save services you love to quickly book them again."
            action={<Link to="/customer/search"><Button className="bg-primary text-primary-foreground">Browse services</Button></Link>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {favoriteListings.map(listing => (
              <div key={listing.id} className="relative group h-full">
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
                />
                <button
                  onClick={() => toggleFavorite(listing.id)}
                  aria-label={`Remove ${listing.title} from favorites`}
                  className="absolute top-3 right-3 p-2.5 rounded-full bg-white shadow hover:bg-destructive hover:text-white transition-colors md:opacity-0 md:group-hover:opacity-100"
                >
                  <Heart size={14} className="fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
