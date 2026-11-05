import React, { useState } from 'react';
import { Product } from '../types';
import { Star, Eye, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1600);
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-white border border-stone-200/90 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Product Image Container (65-75% visual weight) */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-stone-200 text-stone-500">
            <span className="text-xs font-semibold">{product.category}</span>
            <span className="text-sm font-medium text-stone-700 mt-1 text-center line-clamp-1">{product.name}</span>
          </div>
        )}

        {/* Subtle status tag (unboxed text badge or subtle corner flag) */}
        {product.trending && (
          <div className="absolute top-2.5 left-2.5 bg-stone-900/80 text-white text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded backdrop-blur-xs">
            Trending
          </div>
        )}

        {isLowStock && (
          <div className="absolute top-2.5 right-2.5 bg-amber-800/90 text-white text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded backdrop-blur-xs">
            Only {product.stock} left
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold tracking-wider uppercase">
            Out of Stock
          </div>
        )}

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-x-0 bottom-3 px-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2 bg-white/95 hover:bg-white text-stone-900 text-xs font-semibold rounded shadow-md backdrop-blur-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-4 justify-between">
        <div>
          {/* Category unboxed metadata with bullet */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-stone-400 mb-1">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1 text-stone-600">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="tabular-nums font-semibold">{product.rating.toFixed(1)}</span>
              <span className="text-stone-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-stone-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price and Add CTA baseline */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-stone-900 tabular-nums">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2 rounded-md transition-all flex items-center justify-center ${
              isAddedRecently
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs'
            }`}
            title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
            aria-label="Add to cart"
          >
            {isAddedRecently ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
