import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { ListingCard } from '../../components/ListingCard';
import { Button } from '../../components/ui/button';
import { listings } from '../../data/mockData';
import { getListingImage } from '../../data/images';
import { EmptyState } from '../../components/EmptyState';
import { Link } from 'react-router';

const STORAGE_KEY = 'atn_favorites';

function loadFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export default function Favorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(loadFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  function removeFavorite(id: string) {
    setFavoriteIds(prev => prev.filter(f => f !== id));
  }

  // Seed with first 4 listings for demo if empty
  useEffect(() => {
    if (favoriteIds.length === 0) {
      const seeded = listings.slice(0, 4).map(l => l.id);
      setFavoriteIds(seeded);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const favoriteListings = listings.filter(l => favoriteIds.includes(l.id));

  return (
    <div className="min-h-screen bg-secondary px-4 lg:px-[72px]">
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
              <div key={listing.id} className="relative group">
                <ListingCard
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
                <button
                  onClick={() => removeFavorite(listing.id)}
                  aria-label={`Remove ${listing.title} from favorites`}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white shadow hover:bg-destructive hover:text-white transition-colors opacity-0 group-hover:opacity-100"
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
