import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order } from '../types';
import { ShieldCheck, CreditCard, Banknote, Landmark, CheckCircle, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

interface CheckoutViewProps {
  onOrderCompleted: (order: Order) => void;
  onBackToShopping: () => void;
}

export function CheckoutView({ onOrderCompleted, onBackToShopping }: CheckoutViewProps) {
  const { items, subtotal, shippingFee, tax, discount, discountCode, total, clearCart } = useCart();
  const { user } = useAuth();

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [country, setCountry] = useState(user?.address?.country || 'United States');
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'upi'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold font-display text-stone-900 mb-2">Your Bag is Empty</h2>
        <p className="text-xs text-stone-500 mb-6">Add items before proceeding to checkout.</p>
        <button
          onClick={onBackToShopping}
          className="px-5 py-2.5 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800 transition-colors"
        >
          Return to Collection
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !street.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      setErrorMessage('Please fill in all required customer and delivery address fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        customerName: name,
        customerEmail: email,
        phone,
        shippingAddress: {
          street,
          city,
          state,
          postalCode,
          country,
        },
        items: items.map(i => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        paymentMethod,
        discountCode: discountCode || undefined,
      };

      const res = await api.createOrder(payload);
      clearCart();
      onOrderCompleted(res.order);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back button */}
      <button
        onClick={onBackToShopping}
        className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Collection</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left column: Checkout Forms (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-2xl font-bold font-display text-stone-900">
              Studio Checkout
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Provide your delivery coordinates and select a preferred settlement method.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmitOrder} className="space-y-8">
            
            {/* Section 1: Customer Contact */}
            <div className="bg-white p-6 rounded-lg border border-stone-200 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                01. Customer Contact
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Elena Rostova"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none focus:border-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="elena@example.com"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none focus:border-stone-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Phone Number (for courier updates)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none focus:border-stone-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Coordinates */}
            <div className="bg-white p-6 rounded-lg border border-stone-200 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                02. Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="450 Hayes Street, Apt 3B"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none focus:border-stone-500"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="San Francisco"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none focus:border-stone-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      State / Region *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="CA"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none focus:border-stone-500"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="94102"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none focus:border-stone-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none focus:border-stone-500"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Payment Method */}
            <div className="bg-white p-6 rounded-lg border border-stone-200 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                03. Settlement Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    paymentMethod === 'card'
                      ? 'border-stone-900 bg-stone-50 text-stone-950 font-semibold shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-2 text-stone-800" />
                  <div>
                    <p className="text-xs font-semibold">Credit / Debit</p>
                    <p className="text-[10px] text-stone-500">Visa, Mastercard, Amex</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    paymentMethod === 'cod'
                      ? 'border-stone-900 bg-stone-50 text-stone-950 font-semibold shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <Banknote className="w-5 h-5 mb-2 text-stone-800" />
                  <div>
                    <p className="text-xs font-semibold">Cash On Delivery</p>
                    <p className="text-[10px] text-stone-500">Settle at doorstep</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    paymentMethod === 'upi'
                      ? 'border-stone-900 bg-stone-50 text-stone-950 font-semibold shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <Landmark className="w-5 h-5 mb-2 text-stone-800" />
                  <div>
                    <p className="text-xs font-semibold">Instant UPI / Bank</p>
                    <p className="text-[10px] text-stone-500">Direct wire transfer</p>
                  </div>
                </button>
              </div>

              {/* Conditional Card inputs */}
              {paymentMethod === 'card' && (
                <div className="pt-3 border-t border-stone-100 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded font-mono tabular-nums focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded font-mono tabular-nums focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Security CVC
                      </label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        maxLength={4}
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded font-mono tabular-nums focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-3 bg-stone-100 text-stone-700 rounded text-xs leading-relaxed">
                  <p className="font-semibold text-stone-900 mb-1">Cash on Delivery Terms</p>
                  Please keep exact currency ready for the courier. Courier will hand over the packaged receipt upon settlement.
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="p-3 bg-stone-100 text-stone-700 rounded text-xs leading-relaxed">
                  <p className="font-semibold text-stone-900 mb-1">Instant Bank & UPI Settlement</p>
                  A payment QR code and bank routing identifier will be displayed on the confirmation receipt for instant authorization.
                </div>
              )}
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white rounded-md text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Secure Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Authorize & Place Order • ${total.toFixed(2)}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right column: Itemized Order Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 pb-3 border-b border-stone-100">
              Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h3>

            {/* Items review */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.productId} className="flex gap-3 text-xs">
                  <img
                    src={i.image}
                    alt={i.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover rounded bg-stone-100 border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-900 truncate">{i.name}</p>
                    <p className="text-stone-400 text-[11px]">Qty: {i.quantity} × ${i.price.toFixed(2)}</p>
                  </div>
                  <span className="font-bold text-stone-900 tabular-nums">
                    ${(i.price * i.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="border-t border-stone-100 pt-4 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Merchandise Subtotal</span>
                <span className="font-medium text-stone-900 tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & Dispatch</span>
                <span className="font-medium text-stone-900 tabular-nums">
                  {shippingFee === 0 ? 'Complimentary Free' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-medium text-stone-900 tabular-nums">${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Promotional Discount ({discountCode})</span>
                  <span className="font-semibold tabular-nums">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-stone-200 pt-3 flex justify-between text-base font-bold text-stone-950">
                <span>Total Due</span>
                <span className="tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded text-[11px] text-stone-500 space-y-1">
              <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                <span>Protected by AURA Studio Assurance</span>
              </div>
              <p>Every order is covered with a 30-day evaluation trial and complimentary domestic return labels.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
