import { useState, useMemo } from 'react';
import { ListingCard } from '../../components/ListingCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Search, Grid3x3, List, SlidersHorizontal, X } from 'lucide-react';
import { listings, categories } from '../../data/mockData';
import { getListingImage } from '../../data/images';
import { EmptyState } from '../../components/EmptyState';

type SortKey = 'featured' | 'price-low' | 'price-high' | 'rating';

export default function Browse() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  function toggleCategory(id: string) {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
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
        l.providerName.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(l => selectedCategories.includes(l.category));
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
  }, [searchTerm, selectedCategories, minPrice, maxPrice, minRating, sortBy]);

  const activeFilterCount = selectedCategories.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + (minRating ? 1 : 0);

  const filterPanel = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label htmlFor="browse-search" className="mb-2 block">Search</Label>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
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
        <legend className="text-sm font-medium mb-3">Categories</legend>
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.id}`}
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={() => toggleCategory(cat.id)}
              />
              <label htmlFor={`cat-${cat.id}`} className="text-sm cursor-pointer">{cat.name}</label>
            </div>
          ))}
        </div>
      </fieldset>

      {/* Price */}
      <fieldset>
        <legend className="text-sm font-medium mb-3">Price Range</legend>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="min-price" className="text-xs text-muted">Min ($)</Label>
            <Input id="min-price" type="number" min="0" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="max-price" className="text-xs text-muted">Max ($)</Label>
            <Input id="max-price" type="number" min="0" placeholder="200" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="mt-1" />
          </div>
        </div>
      </fieldset>

      {/* Rating */}
      <fieldset>
        <legend className="text-sm font-medium mb-3">Minimum Rating</legend>
        <div className="space-y-2">
          {[5, 4, 3].map(r => (
            <div key={r} className="flex items-center gap-2">
              <Checkbox
                id={`rating-${r}`}
                checked={minRating === r}
                onCheckedChange={() => setMinRating(prev => prev === r ? null : r)}
              />
              <label htmlFor={`rating-${r}`} className="text-sm cursor-pointer">{r}+ stars</label>
            </div>
          ))}
        </div>
      </fieldset>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear all filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-border px-4 lg:px-[72px]">
        <div className="py-6 lg:py-8 max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Browse Services</h1>
          <p className="text-sm text-muted">Explore local services in Jonesboro, AR</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block w-72 border-r border-border p-6 min-h-screen sticky top-0 overflow-y-auto">
          {filterPanel}
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 lg:p-8 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              {/* Mobile filter toggle */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden flex items-center gap-2"
                onClick={() => setFiltersOpen(true)}
                aria-expanded={filtersOpen}
              >
                <SlidersHorizontal size={15} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <p className="text-sm text-muted">{filtered.length} service{filtered.length !== 1 ? 's' : ''} found</p>
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
              <div className="flex border border-border rounded overflow-hidden">
                <button
                  className={`p-2 ${viewMode === 'grid' ? 'bg-secondary' : 'bg-white'} hover:bg-secondary transition-colors`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <Grid3x3 size={15} />
                </button>
                <button
                  className={`p-2 ${viewMode === 'list' ? 'bg-secondary' : 'bg-white'} hover:bg-secondary transition-colors`}
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
              action={
                <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
              }
            />
          ) : (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
            }>
              {filtered.map(listing => (
                <ListingCard
                  key={listing.id}
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
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setFiltersOpen(false)} aria-hidden="true" />
          <aside className="fixed inset-y-0 left-0 z-50 w-80 max-w-full bg-white border-r border-border p-6 overflow-y-auto lg:hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="p-1 rounded hover:bg-secondary">
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
