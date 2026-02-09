import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, Grid3X3, LayoutGrid, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ProductCard } from '@/components/products/ProductCard';
import { products, brands, playerLevels, willowTypes, categories } from '@/data/products';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedWillow, setSelectedWillow] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [searchQuery, setSearchQuery] = useState('');
  const [gridCols, setGridCols] = useState(4);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (categoryParam) {
      result = result.filter(p => p.category === categoryParam);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Level filter
    if (selectedLevels.length > 0) {
      result = result.filter(p => selectedLevels.includes(p.playerLevel));
    }

    // Willow filter
    if (selectedWillow.length > 0) {
      result = result.filter(p => p.willowType && selectedWillow.includes(p.willowType));
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0));
        break;
      default:
        result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [categoryParam, searchQuery, priceRange, selectedBrands, selectedLevels, selectedWillow, sortBy]);

  const clearFilters = () => {
    setPriceRange([0, 25000]);
    setSelectedBrands([]);
    setSelectedLevels([]);
    setSelectedWillow([]);
    setSearchQuery('');
    setSearchParams({});
  };

  const activeFiltersCount = selectedBrands.length + selectedLevels.length + selectedWillow.length +
    (priceRange[0] > 0 || priceRange[1] < 25000 ? 1 : 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h4 className="font-semibold mb-4">Price Range</h4>
        <Slider
          value={priceRange}
          min={0}
          max={25000}
          step={500}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="mb-3"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="font-semibold mb-4">Brands</h4>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedBrands([...selectedBrands, brand]);
                  } else {
                    setSelectedBrands(selectedBrands.filter(b => b !== brand));
                  }
                }}
              />
              <span className="text-sm">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Player Level */}
      <div>
        <h4 className="font-semibold mb-4">Player Level</h4>
        <div className="space-y-2">
          {playerLevels.map((level) => (
            <label key={level} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedLevels.includes(level)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedLevels([...selectedLevels, level]);
                  } else {
                    setSelectedLevels(selectedLevels.filter(l => l !== level));
                  }
                }}
              />
              <span className="text-sm capitalize">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Willow Type */}
      <div>
        <h4 className="font-semibold mb-4">Willow Type</h4>
        <div className="space-y-2">
          {willowTypes.map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedWillow.includes(type)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedWillow([...selectedWillow, type]);
                  } else {
                    setSelectedWillow(selectedWillow.filter(t => t !== type));
                  }
                }}
              />
              <span className="text-sm capitalize">{type} Willow</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl"
          >
            {categoryParam ? (
              <>
                {categories.find(c => c.slug === categoryParam)?.name || 'PRODUCTS'}
              </>
            ) : (
              <>ALL <span className="gradient-text">PRODUCTS</span></>
            )}
          </motion.h1>
          <p className="text-muted-foreground mt-2">
            {filteredProducts.length} products found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  FILTERS
                </h3>
                {activeFiltersCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="font-display text-xl">FILTERS</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>

              {/* Grid Toggle - Desktop */}
              <div className="hidden md:flex items-center gap-1 bg-muted p-1 rounded-lg">
                <Button
                  variant={gridCols === 3 ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setGridCols(3)}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridCols === 4 ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setGridCols(4)}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(activeFiltersCount > 0 || categoryParam) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {categoryParam && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {categories.find(c => c.slug === categoryParam)?.name}
                    <button onClick={() => setSearchParams({})}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedBrands.map(brand => (
                  <span key={brand} className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm">
                    {brand}
                    <button onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand))}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {selectedLevels.map(level => (
                  <span key={level} className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm capitalize">
                    {level}
                    <button onClick={() => setSelectedLevels(selectedLevels.filter(l => l !== level))}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={`grid grid-cols-2 gap-4 md:gap-6 ${gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">No products found</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
