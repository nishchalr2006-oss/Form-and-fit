import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { EmptyCatalogState } from '../components/EmptyCatalogState';
import { Filter, SlidersHorizontal, Search, X } from 'lucide-react';

export const Shop: React.FC = () => {
  const { products, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state synchronized with URL searchParams
  const selectedCategory = searchParams.get('category') || '';
  const selectedGender = searchParams.get('gender') || '';
  const searchQuery = searchParams.get('search') || '';
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [priceMax, setPriceMax] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Available size options
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'UK 7', 'UK 8', 'UK 9', 'UK 10'];

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.status === 'published')
      .filter((p) => {
        if (selectedCategory && p.category_id !== selectedCategory) return false;
        if (selectedGender && p.gender_collection !== selectedGender && p.gender_collection !== 'Unisex') return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(query);
          const matchDesc = (p.description || '').toLowerCase().includes(query);
          const matchFabric = (p.fabric_material || '').toLowerCase().includes(query);
          const matchSku = (p.sku || '').toLowerCase().includes(query);
          if (!matchName && !matchDesc && !matchFabric && !matchSku) return false;
        }
        if (selectedSize) {
          const hasSize = p.variants?.some((v) => v.size === selectedSize && v.stock_quantity > 0);
          if (!hasSize) return false;
        }
        const effectivePrice = p.sale_price || p.regular_price;
        if (effectivePrice > priceMax) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') {
          return (a.sale_price || a.regular_price) - (b.sale_price || b.regular_price);
        }
        if (sortBy === 'price-high') {
          return (b.sale_price || b.regular_price) - (a.sale_price || a.regular_price);
        }
        if (sortBy === 'recommended') {
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
        // newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [products, selectedCategory, selectedGender, searchQuery, selectedSize, priceMax, sortBy]);

  const handleCategoryChange = (catId: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId) {
      newParams.set('category', catId);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleGenderChange = (gender: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (gender) {
      newParams.set('gender', gender);
    } else {
      newParams.delete('gender');
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSelectedSize('');
    setPriceMax(10000);
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#111111]/15 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
            Form &amp; Fit Collection
          </span>
          <h1 className="font-space font-bold text-3xl uppercase tracking-tight text-[#111111]">
            {selectedGender
              ? `${selectedGender}'s Fashion`
              : selectedCategory
              ? categories.find((c) => c.id === selectedCategory)?.name || 'Category'
              : 'Shop All Catalog'}
          </h1>
          {searchQuery && (
            <p className="text-xs text-[#111111]/70 mt-1 font-sans">
              Search results for: <span className="font-bold">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Sort Controls & Mobile Filter Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-[#111111] font-space text-xs uppercase font-bold cursor-pointer"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-space font-bold uppercase text-[#111111]/60 shrink-0">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#111111] px-3 py-2 font-space text-xs uppercase font-bold text-[#111111] focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest Drops</option>
              <option value="recommended">Recommended / Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block space-y-6 bg-white p-5 border border-[#111111]/10 self-start">
          <div className="flex justify-between items-center border-b border-[#111111]/10 pb-3">
            <h3 className="font-space font-bold text-xs uppercase tracking-wider flex items-center gap-2 text-[#111111]">
              <Filter size={14} /> Filter Catalog
            </h3>
            {(selectedCategory || selectedGender || selectedSize || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-space text-red-600 hover:underline uppercase font-bold cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Gender / Collection Filter */}
          <div className="space-y-2">
            <h4 className="font-space font-bold text-xs uppercase text-[#111111]">Gender / Collection</h4>
            <div className="space-y-1 text-xs">
              {['', 'Men', 'Women', 'Unisex', 'Footwear', 'Accessories'].map((g) => (
                <button
                  key={g || 'all'}
                  onClick={() => handleGenderChange(g)}
                  className={`block w-full text-left py-1.5 px-2 font-space uppercase transition-colors cursor-pointer ${
                    selectedGender === g ? 'bg-[#111111] text-[#C7F464] font-bold' : 'hover:bg-[#F7F6F2] text-[#111111]/80'
                  }`}
                >
                  {g || 'All Collections'}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2 pt-2 border-t border-[#111111]/10">
            <h4 className="font-space font-bold text-xs uppercase text-[#111111]">Categories</h4>
            <div className="space-y-1 text-xs max-h-48 overflow-y-auto">
              <button
                onClick={() => handleCategoryChange('')}
                className={`block w-full text-left py-1.5 px-2 font-space uppercase cursor-pointer ${
                  !selectedCategory ? 'bg-[#111111] text-[#C7F464] font-bold' : 'hover:bg-[#F7F6F2] text-[#111111]/80'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`block w-full text-left py-1.5 px-2 font-space uppercase cursor-pointer ${
                    selectedCategory === cat.id ? 'bg-[#111111] text-[#C7F464] font-bold' : 'hover:bg-[#F7F6F2] text-[#111111]/80'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2 pt-2 border-t border-[#111111]/10">
            <h4 className="font-space font-bold text-xs uppercase text-[#111111]">Available Size</h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedSize('')}
                className={`px-2 py-1 text-[11px] font-mono border cursor-pointer ${
                  !selectedSize ? 'bg-[#111111] text-[#C7F464] border-[#111111]' : 'border-[#111111]/20 hover:bg-[#F7F6F2]'
                }`}
              >
                ALL
              </button>
              {allSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz === selectedSize ? '' : sz)}
                  className={`px-2 py-1 text-[11px] font-mono border cursor-pointer ${
                    selectedSize === sz ? 'bg-[#111111] text-[#C7F464] border-[#111111]' : 'border-[#111111]/20 hover:bg-[#F7F6F2]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-[#111111]/10">
            <div className="flex justify-between items-center text-xs font-space font-bold">
              <span>Max Price</span>
              <span>₹{priceMax.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="499"
              max="15000"
              step="500"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-[#111111] cursor-pointer"
            />
          </div>
        </div>

        {/* Main Products Grid */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs font-space font-bold text-[#111111]/60 uppercase">
            <span>Showing {filteredProducts.length} Items</span>
            {searchQuery && (
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('search');
                  setSearchParams(newParams);
                }}
                className="flex items-center gap-1 text-red-600 hover:underline cursor-pointer"
              >
                Clear Search <X size={12} />
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            products.filter((p) => p.status === 'published').length === 0 ? (
              <EmptyCatalogState />
            ) : (
              <div className="bg-white border border-[#111111]/20 p-12 text-center space-y-4">
                <Search size={32} className="mx-auto text-[#111111]/40" />
                <h3 className="font-space font-bold text-xl uppercase">No Matching Products</h3>
                <p className="text-xs text-[#111111]/60 max-w-sm mx-auto font-sans">
                  Try adjusting your filter preferences, price range, or search terms.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-[#111111] text-[#F7F6F2] font-space text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
