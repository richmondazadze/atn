import { useState, useMemo } from 'react';
import { ListingCard } from '../../components/ListingCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Search, Grid3x3, List, SlidersHorizontal, X } from 'lucide-react';
import { getListingImageUrl } from '../../../lib/storage';
import { EmptyState } from '../../components/EmptyState';
import { useListings } from '../../../hooks/useListings';
import { useCategories } from '../../../hooks/useCategories';
import { LoadingSpinner } from '../../components/LoadingSpinner';

type SortKey = 'featured' | 'price-low' | 'price-high' | 'rating';

export default function Browse() {
  const { listings, loading: listingsLoading } = useListings();
  const { categories, loading: categoriesLoading } = useCategories();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState<number | null>(null);
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
    setMinRating(null);
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
    if (selectedCategories.length > 0) {
      result = result.filter(l => selectedCategories.includes(l.category_slug));
    }
    if (minPrice !== '') result = result.filter(l => l.price >= Number(minPrice));
    if (maxPrice !== '') result = result.filter(l => l.price <= Number(maxPrice));
    if (minRating !== null) result = result.filter(l => l.rating >= minRating);
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'featured': result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
    }
    return result;
  }, [listings, searchTerm, selectedCategories, minPrice, maxPrice, minRating, sortBy]);

  const activeFilterCount = selectedCategories.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + (minRating ? 1 : 0);

  const filterPanel = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label htmlFor="browse-search" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
          Search
        </Label>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <Input
            id="browse-search"
            placeholder="Search services…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Categories */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">
          Categories
        </legend>
        <div className="space-y-1.5">
          {categories.map(cat => (
            <label
              key={cat.slug}
              htmlFor={`cat-${cat.slug}`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-sm transition-colors ${
                selectedCategories.includes(cat.slug)
                  ? 'bg-surface-teal text-primary font-medium'
                  : 'hover:bg-secondary text-foreground/80'
              }`}
            >
              <Checkbox
                id={`cat-${cat.slug}`}
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => toggleCategory(cat.slug)}
                className="shrink-0"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Price */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">
          Price Range
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="min-price" className="text-xs text-muted mb-1 block">Min ($)</Label>
            <Input id="min-price" type="number" min="0" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="max-price" className="text-xs text-muted mb-1 block">Max ($)</Label>
            <Input id="max-price" type="number" min="0" placeholder="200" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
          </div>
        </div>
      </fieldset>

      {/* Rating */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">
          Minimum Rating
        </legend>
        <div className="space-y-1.5">
          {[5, 4, 3].map(r => (
            <label
              key={r}
              htmlFor={`rating-${r}`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-sm transition-colors ${
                minRating === r
                  ? 'bg-surface-amber text-amber-700 font-medium'
                  : 'hover:bg-secondary text-foreground/80'
              }`}
            >
              <Checkbox
                id={`rating-${r}`}
                checked={minRating === r}
                onCheckedChange={() => setMinRating(prev => prev === r ? null : r)}
                className="shrink-0"
              />
              {r}+ stars
            </label>
          ))}
        </div>
      </fieldset>

      {activeFilterCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
        </Button>
      )}
    </div>
  );

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner size="lg" label="Finding the best services for you..." />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero border-b border-border/60 px-4 lg:px-[72px]">
        <div className="py-8 lg:py-10 max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-[32px] font-bold text-foreground mb-1">Browse Services</h1>
          <p className="text-sm text-muted">Explore local services from vetted women providers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block w-72 border-r border-border/60 p-6 min-h-screen sticky top-0 overflow-y-auto">
          {filterPanel}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden flex items-center gap-2"
                onClick={() => setFiltersOpen(true)}
                aria-expanded={filtersOpen}
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <p className="text-sm text-muted">
                <span className="font-semibold text-foreground">{filtered.length}</span> service{filtered.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={v => setSortBy(v as SortKey)}>
                <SelectTrigger className="w-40 lg:w-48 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
              {/* View toggle */}
              <div className="flex border border-border rounded-xl overflow-hidden">
                <button
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-surface-teal text-primary' : 'bg-background hover:bg-secondary'}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <Grid3x3 size={15} />
                </button>
                <button
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-surface-teal text-primary' : 'bg-background hover:bg-secondary'}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <EmptyState
              title="No services found"
              description="Try adjusting your filters or search term."
              action={<Button variant="outline" onClick={clearFilters}>Clear filters</Button>}
            />
          ) : (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
            }>
              {filtered.map((listing, i) => (
                <div key={listing.id} className={`animate-fade-up`} style={{ animationDelay: `${Math.min(i, 5) * 60}ms` }}>
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
                    image={listing.images[0] ? getListingImageUrl(listing.images[0]) : undefined}
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
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setFiltersOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-[min(20rem,85vw)] max-w-full bg-background border-r border-border p-6 overflow-y-auto lg:hidden animate-fade-right">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-foreground">Filters</h2>
              <button
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="p-2 rounded-xl hover:bg-background transition-colors"
              >
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
