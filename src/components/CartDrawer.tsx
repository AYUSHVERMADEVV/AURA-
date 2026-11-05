import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
  onExplore: () => void;
}

export function CartDrawer({ onCheckout, onExplore }: CartDrawerProps) {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    shippingFee,
    tax,
    discount,
    discountCode,
    applyDiscountCode,
    total,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess(false);
    if (!inputCode.trim()) return;

    const ok = applyDiscountCode(inputCode);
    if (ok) {
      setCouponSuccess(true);
      setInputCode('');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10 or AURA20');
    }
  };

  const freeShippingThreshold = 150;
  const awayFromFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="text-base font-bold font-display text-stone-900">
                Shopping Bag
              </h2>
              <span className="text-xs text-stone-500 tabular-nums">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 text-xs">
            {awayFromFreeShipping > 0 ? (
              <p className="text-stone-600 mb-1.5">
                Add <span className="font-semibold text-stone-900 tabular-nums">${awayFromFreeShipping.toFixed(2)}</span> more for <span className="font-semibold text-stone-900">Free Express Shipping</span>
              </p>
            ) : (
              <p className="text-emerald-700 font-semibold mb-1.5 flex items-center gap-1.5">
                <span>✓ You qualify for Free Complimentary Delivery!</span>
              </p>
            )}
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-stone-900 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <ShoppingBag className="w-12 h-12 stroke-[1.2] mb-3 text-stone-300" />
                <p className="text-sm font-semibold text-stone-700">Your bag is empty</p>
                <p className="text-xs text-stone-400 mt-1 max-w-xs">
                  Discover studio acoustics, ceramic brewing tools, and leather workspace essentials.
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    onExplore();
                  }}
                  className="mt-5 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-md transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.productId} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-stone-100 rounded-md overflow-hidden shrink-0 border border-stone-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Item info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-stone-400 hover:text-red-500 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-stone-400 uppercase tracking-wide">
                        {item.category || 'Goods'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 rounded bg-stone-50 text-xs">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-2 py-0.5 text-stone-600 hover:text-stone-900"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-semibold text-stone-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-2 py-0.5 text-stone-600 hover:text-stone-900"
                        >
                          +
                        </button>
                      </div>

                      {/* Total Price for item */}
                      <span className="text-xs font-bold text-stone-900 tabular-nums">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Order Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3.5">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Promo code (e.g. WELCOME10)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 bg-white border border-stone-300 rounded text-xs text-stone-900 placeholder:text-stone-400 uppercase focus:outline-none focus:border-stone-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium rounded transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponSuccess && (
                <p className="text-[11px] text-emerald-600 font-medium">
                  Promo code applied successfully!
                </p>
              )}
              {couponError && (
                <p className="text-[11px] text-red-500 font-medium">
                  {couponError}
                </p>
              )}
              {discountCode && (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                  <span>Coupon {discountCode} active</span>
                  <span className="font-semibold tabular-nums">-${discount.toFixed(2)}</span>
                </div>
              )}

              {/* Subtotal Calculations */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900 tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-stone-900 tabular-nums">
                    {shippingFee === 0 ? 'Complimentary Free' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-medium text-stone-900 tabular-nums">${tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-medium tabular-nums">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-bold text-stone-950">
                  <span>Total</span>
                  <span className="tabular-nums">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Primary Checkout Button */}
              <button
                onClick={() => {
                  closeDrawer();
                  onCheckout();
                }}
                className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                <span>Encrypted checkout & 256-bit SSL protection</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
