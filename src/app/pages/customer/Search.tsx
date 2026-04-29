import { useState, useMemo } from 'react';
import { ListingCard } from '../../components/ListingCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react';
import { useListings } from '../../../hooks/useListings';
import { useCategories } from '../../../hooks/useCategories';
import { useFavorites } from '../../../hooks/useFavorites';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';

type SortKey = 'featured' | 'price-low' | 'price-high' | 'rating';

export default function Search() {
  const { listings, loading: listingsLoading } = useListings();
  const { categories, loading: categoriesLoading } = useCategories();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const loading = listingsLoading || categoriesLoading;

  function toggleCategory(slug: string) {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    );
  }

  function clearFilters() {
    setSearchTerm('');
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('featured');
  }

  const filtered = useMemo(() => {
    let result = [...listings];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        (l.provider_name ?? '').toLowerCase().includes(q) ||
        l.category_slug.toLowerCase().includes(q)
      );
    }
    if (selectedCategories.length > 0) result = result.filter(l => selectedCategories.includes(l.category_slug));
    if (minPrice !== '') result = result.filter(l => l.price >= Number(minPrice));
    if (maxPrice !== '') result = result.filter(l => l.price <= Number(maxPrice));
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
    }
    return result;
  }, [listings, searchTerm, selectedCategories, minPrice, maxPrice, sortBy]);

  const activeFilterCount = selectedCategories.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Search</p>
        <div className="relative">
          <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <Input
            id="search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-11"
          />
        </div>
      </div>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">Categories</legend>
        <div className="space-y-1.5">
          {categories.map(cat => (
            <label
              key={cat.slug}
              htmlFor={`s-cat-${cat.slug}`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-sm transition-colors ${
                selectedCategories.includes(cat.slug)
                  ? 'bg-surface-teal text-primary font-medium'
                  : 'hover:bg-secondary text-foreground/80'
              }`}
            >
              <Checkbox
                id={`s-cat-${cat.slug}`}
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => toggleCategory(cat.slug)}
                className="shrink-0"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">Price Range</legend>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="s-min" className="text-xs text-muted mb-1 block">Min ($)</Label>
            <Input id="s-min" type="number" min="0" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="s-max" className="text-xs text-muted mb-1 block">Max ($)</Label>
            <Input id="s-max" type="number" min="0" placeholder="200" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
          </div>
        </div>
      </fieldset>

      {activeFilterCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear <span className="chewy-regular">{activeFilterCount}</span> filter{activeFilterCount > 1 ? 's' : ''}
        </Button>
      )}
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero border-b border-border/60 px-4 md:px-6 lg:px-[72px]">
        <div className="py-8">
          <h1 className="text-2xl lg:text-[32px] font-bold text-foreground mb-1">Search Services</h1>
        </div>
      </div>

      <div className="flex">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block w-72 border-r border-border/60 p-6 min-h-screen sticky top-0 overflow-y-auto">
          {filterPanel}
        </aside>

        <main className="flex-1 p-4 lg:p-8 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex flex-col items-start gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden flex items-center gap-2"
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold chewy-regular">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <p className="text-sm text-muted pl-0.5">
                <span className="font-semibold text-foreground chewy-regular">{filtered.length}</span> service{filtered.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <Select value={sortBy} onValueChange={v => setSortBy(v as SortKey)}>
              <SelectTrigger className="w-40 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title="No services found"
              description="Try different keywords or remove some filters."
              action={<Button variant="outline" onClick={clearFilters}>Clear filters</Button>}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
              {filtered.map((listing, i) => (
                <div key={listing.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 5) * 60}ms` }}>
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
          )}
        </main>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setFiltersOpen(false)} aria-hidden="true" />
          <aside className="fixed inset-y-0 left-0 z-50 w-[min(20rem,85vw)] max-w-full bg-background border-r border-border p-6 overflow-y-auto lg:hidden animate-fade-right">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-foreground">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="p-2 rounded-xl hover:bg-background transition-colors">
                <X size={18} />
              </button>
            </div>
            {filterPanel}
          </aside>
        </>
      )}
    </div>
  );
}
