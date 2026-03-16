import { useState, useMemo } from 'react';
import { ListingCard } from '../../components/ListingCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react';
import { listings, categories } from '../../data/mockData';
import { getListingImage } from '../../data/images';
import { EmptyState } from '../../components/EmptyState';

type SortKey = 'featured' | 'price-low' | 'price-high' | 'rating';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
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
    if (selectedCategories.length > 0) result = result.filter(l => selectedCategories.includes(l.category));
    if (minPrice !== '') result = result.filter(l => l.price >= Number(minPrice));
    if (maxPrice !== '') result = result.filter(l => l.price <= Number(maxPrice));
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
    }
    return result;
  }, [searchTerm, selectedCategories, minPrice, maxPrice, sortBy]);

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="search-input" className="mb-2 block">Search</Label>
        <div className="relative">
          <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <Input
            id="search-input"
            placeholder="Search services…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <fieldset>
        <legend className="text-sm font-medium mb-3">Categories</legend>
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-2">
              <Checkbox id={`s-cat-${cat.id}`} checked={selectedCategories.includes(cat.id)} onCheckedChange={() => toggleCategory(cat.id)} />
              <label htmlFor={`s-cat-${cat.id}`} className="text-sm cursor-pointer">{cat.name}</label>
            </div>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-sm font-medium mb-3">Price Range</legend>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="s-min" className="text-xs text-muted">Min ($)</Label>
            <Input id="s-min" type="number" min="0" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="s-max" className="text-xs text-muted">Max ($)</Label>
            <Input id="s-max" type="number" min="0" placeholder="200" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="mt-1" />
          </div>
        </div>
      </fieldset>
      <Button variant="outline" className="w-full" onClick={clearFilters}>Clear all filters</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-border px-4 lg:px-8">
        <div className="py-5 lg:py-8">
          <h1 className="text-2xl lg:text-[32px] font-semibold">Search Services</h1>
        </div>
      </div>

      <div className="flex">
        <aside className="hidden lg:block w-72 border-r border-border p-6 min-h-screen sticky top-0 overflow-y-auto">
          {filterPanel}
        </aside>

        <main className="flex-1 p-4 lg:p-8 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
                <SlidersHorizontal size={14} className="mr-1" /> Filters
              </Button>
              <p className="text-sm text-muted">{filtered.length} services found</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
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
                  linkPrefix="/customer"
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {filtersOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setFiltersOpen(false)} aria-hidden="true" />
          <aside className="fixed inset-y-0 left-0 z-50 w-80 max-w-full bg-white border-r border-border p-6 overflow-y-auto lg:hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="p-1 rounded hover:bg-secondary"><X size={18} /></button>
            </div>
            {filterPanel}
          </aside>
        </>
      )}
    </div>
  );
}
