import React, { useState } from 'react';
import { Product } from '../types';
import { X, Star, ShoppingBag, ShieldCheck, Truck, RefreshCw, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-400 hover:text-stone-700 bg-white/80 hover:bg-stone-100 rounded-full transition-colors backdrop-blur-xs"
          aria-label="Close product preview"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Gallery / Image */}
          <div className="relative aspect-4/3 md:aspect-auto bg-stone-100 flex items-center justify-center overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center max-h-[500px]"
            />
            {product.trending && (
              <span className="absolute top-4 left-4 bg-stone-900/90 text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded">
                Trending Choice
              </span>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div className="space-y-4">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="uppercase tracking-wider font-semibold text-stone-600">
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5 text-stone-800">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold tabular-nums">{product.rating.toFixed(1)}</span>
                  <span className="text-stone-400">({product.reviewsCount} customer reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold font-display text-stone-900 leading-tight">
                {product.name}
              </h2>

              {/* Pricing */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-stone-950 tabular-nums">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                  <span className="text-xs font-semibold text-amber-800 ml-auto">
                    Low inventory: only {product.stock} units left
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Technical Specifications */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="border-t border-stone-100 pt-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                    Studio Specifications
                  </h4>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex flex-col">
                        <dt className="text-stone-400">{key}</dt>
                        <dd className="font-medium text-stone-800">{val}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Stock status indicator */}
              <div className="flex items-center gap-2 text-xs">
                <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className="font-medium text-stone-700">
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Currently Out of Stock'}
                </span>
              </div>
            </div>

            {/* Action Bar (Quantity + Add to Cart) */}
            <div className="mt-6 pt-6 border-t border-stone-200 space-y-4">
              <div className="flex items-center gap-4">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-stone-300 rounded-md bg-stone-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="px-3 py-2 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-semibold text-stone-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="px-3 py-2 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add Button */}
                <button
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 px-5 rounded-md text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xs ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag • ${(product.price * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* PDP Trust badges */}
              <div className="grid grid-cols-3 gap-2 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Free shipping &gt; $150</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>2-year warranty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>30-day trial</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
