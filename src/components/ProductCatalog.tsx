import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  isLoading: boolean;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  categories: { name: string; count: number }[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  onQuickView: (product: Product) => void;
  onClearFilters: () => void;
}

export function ProductCatalog({
  products,
  isLoading,
  activeCategory,
  onCategoryChange,
  categories,
  searchQuery,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortByChange,
  onQuickView,
  onClearFilters,
}: ProductCatalogProps) {
  const hasActiveFilters =
    activeCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    priceRange[0] > 0 ||
    priceRange[1] < 500;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Catalog Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            AURA Storefront
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 tracking-tight mt-1">
            Studio Merchandise & Objects
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-lg">
            Tactile acoustic hardware, heat-retaining ceramics, artisanal full-grain leather, and balanced interior lighting.
          </p>
        </div>

        {/* Counter */}
        <span className="text-xs font-medium text-stone-500 tabular-nums self-start sm:self-auto">
          Showing <span className="font-semibold text-stone-900">{products.length}</span> verified goods
        </span>
      </div>

      {/* Interactive Filter & Sort Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Category Segmented Control */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeCategory === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            All Goods
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => onCategoryChange(c.name)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === c.name
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Search, Price & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search field */}
          <div className="relative min-w-[180px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-stone-500"
            />
          </div>

          {/* Price Range Filter Slider/Badge */}
          <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 border border-stone-200 px-2.5 py-1.5 rounded">
            <span>Under:</span>
            <select
              value={priceRange[1]}
              onChange={(e) => onPriceRangeChange([0, Number(e.target.value)])}
              className="bg-transparent font-semibold text-stone-900 focus:outline-none tabular-nums"
            >
              <option value="500">Any Price</option>
              <option value="350">&lt; $350</option>
              <option value="200">&lt; $200</option>
              <option value="100">&lt; $100</option>
              <option value="60">&lt; $60</option>
            </select>
          </div>

          {/* Sort By selector */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 border border-stone-200 px-2.5 py-1.5 rounded">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="bg-transparent font-medium text-stone-900 focus:outline-none"
            >
              <option value="newest">Newest Editions</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded text-xs flex items-center gap-1"
              title="Reset filters"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

        </div>

      </div>

      {/* Product Grid (3-columns on desktop, 2 on tablet, 1 on mobile) */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-stone-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500">Retrieving catalog items from MongoDB...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center bg-white border border-stone-200 rounded-xl p-8 space-y-3">
          <Sparkles className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold font-display text-stone-900">
            No matching products found
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try resetting your active category, clearing the search query, or adjusting the price threshold.
          </p>
          <button
            onClick={onClearFilters}
            className="mt-2 px-4 py-2 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Clear Active Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}

    </div>
  );
}
