import React from 'react';
import { Order } from '../types';
import { CheckCircle2, Package, Truck, ArrowRight, ShoppingBag, MapPin, Calendar } from 'lucide-react';

interface OrderSuccessViewProps {
  order: Order;
  onViewOrders: () => void;
  onContinueShopping: () => void;
}

export function OrderSuccessView({ order, onViewOrders, onContinueShopping }: OrderSuccessViewProps) {
  const estimatedDelivery = new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Header confirmation */}
        <div className="text-center space-y-3 pb-6 border-b border-stone-100">
          <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full mb-1">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
            Order Confirmed
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Thank you, <span className="font-semibold text-stone-800">{order.customerName}</span>. Your order has been placed into our fulfillment pipeline.
          </p>
          <div className="pt-2">
            <span className="inline-block px-3 py-1 bg-stone-100 text-stone-800 font-mono text-xs font-bold rounded">
              Order #{order.orderNumber}
            </span>
          </div>
        </div>

        {/* Fulfillment Timeline */}
        <div className="bg-stone-50 p-5 rounded-lg border border-stone-200/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-4">
            Estimated Delivery & Tracking
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-stone-600 mt-0.5" />
              <div>
                <p className="text-stone-400 text-[11px]">Estimated Arrival</p>
                <p className="font-semibold text-stone-900">{estimatedDelivery}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-stone-600 mt-0.5" />
              <div>
                <p className="text-stone-400 text-[11px]">Carrier Service</p>
                <p className="font-semibold text-stone-900">AURA Express Courier</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="w-4 h-4 text-stone-600 mt-0.5" />
              <div>
                <p className="text-stone-400 text-[11px]">Status</p>
                <p className="font-semibold text-emerald-600 capitalize">{order.orderStatus}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Itemized breakdown */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3">
            Itemized Order Receipt
          </h3>
          <div className="divide-y divide-stone-100 border-t border-b border-stone-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded bg-stone-100 border border-stone-200"
                  />
                  <div>
                    <p className="font-semibold text-stone-900">{item.name}</p>
                    <p className="text-stone-400 text-[11px]">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-stone-900 tabular-nums">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-stone-900 tabular-nums">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-medium text-stone-900 tabular-nums">
                {order.shippingFee === 0 ? 'Complimentary Free' : `$${order.shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Sales Tax</span>
              <span className="font-medium text-stone-900 tabular-nums">${order.tax.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount</span>
                <span className="tabular-nums">-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-bold text-stone-950">
              <span>Total Paid</span>
              <span className="tabular-nums">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping address & payment summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-4 bg-stone-50 rounded border border-stone-200/60">
            <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Destination Address</span>
            </div>
            <p className="text-stone-700 font-medium">{order.shippingAddress.street}</p>
            <p className="text-stone-500">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p className="text-stone-500">{order.shippingAddress.country}</p>
          </div>

          <div className="p-4 bg-stone-50 rounded border border-stone-200/60">
            <p className="font-bold text-stone-800 mb-1">Payment Confirmation</p>
            <p className="text-stone-700 capitalize">Method: {order.paymentMethod === 'cod' ? 'Cash On Delivery' : order.paymentMethod.toUpperCase()}</p>
            <p className="text-stone-500 capitalize">Payment Status: {order.paymentStatus}</p>
            <p className="text-stone-400 text-[11px] mt-1">Receipt dispatch sent to {order.customerEmail}</p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onViewOrders}
            className="w-full sm:w-auto flex-1 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span>View in Order History</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onContinueShopping}
            className="w-full sm:w-auto py-3 px-5 border border-stone-300 hover:bg-stone-100 text-stone-800 rounded text-xs font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

      </div>
    </div>
  );
}
