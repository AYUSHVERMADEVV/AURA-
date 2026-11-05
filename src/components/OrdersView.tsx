import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order } from '../types';
import { Package, Search, Calendar, ChevronRight, Clock, Truck, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';

interface OrdersViewProps {
  onBackToShopping: () => void;
}

export function OrdersView({ onBackToShopping }: OrdersViewProps) {
  const { user, openAuthModal, quickDemoLogin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchNumber, setSearchNumber] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [lookupError, setLookupError] = useState('');

  useEffect(() => {
    if (user) {
      loadMyOrders();
    }
  }, [user]);

  const loadMyOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.getMyOrders();
      setOrders(res.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchNumber.trim()) return;

    setLookupError('');
    setSearchedOrder(null);
    try {
      const res = await api.getOrder(searchNumber.trim());
      setSearchedOrder(res.order);
    } catch (err: any) {
      setLookupError('No order found with number: ' + searchNumber.trim());
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-600">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display text-stone-900">
            Sign In to View Orders
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Access your complete order history, real-time courier tracking, and printable receipts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => openAuthModal('login')}
            className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => quickDemoLogin('customer')}
            className="w-full sm:w-auto px-5 py-2.5 bg-stone-100 text-stone-800 border border-stone-300 rounded text-xs font-semibold hover:bg-stone-200 transition-colors"
          >
            Quick 1-Click Demo Login
          </button>
        </div>

        {/* Guest order lookup form */}
        <div className="pt-8 border-t border-stone-200 text-left max-w-md mx-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
            Track Guest Order
          </h3>
          <form onSubmit={handleLookup} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. AUR-123456"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-stone-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-stone-800 text-white text-xs font-medium rounded hover:bg-stone-900"
            >
              Search
            </button>
          </form>

          {lookupError && (
            <p className="text-xs text-red-500 mt-2">{lookupError}</p>
          )}

          {searchedOrder && (
            <div className="mt-4 p-4 bg-white border border-stone-200 rounded-lg text-xs space-y-2">
              <div className="flex justify-between font-bold text-stone-900">
                <span>Order #{searchedOrder.orderNumber}</span>
                <span className="capitalize text-emerald-600">{searchedOrder.orderStatus}</span>
              </div>
              <p className="text-stone-500">Total: ${searchedOrder.total.toFixed(2)}</p>
              <p className="text-stone-500">Destination: {searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.state}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold font-display text-stone-900">
            Order History
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Tracking and records for customer <span className="font-semibold text-stone-800">{user.email}</span>
          </p>
        </div>

        <button
          onClick={onBackToShopping}
          className="text-xs font-medium text-stone-700 hover:text-stone-950 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse More Goods</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-stone-400">
          Loading your order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-white border border-stone-200 rounded-xl p-8">
          <Package className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-semibold text-stone-800">No Orders Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You haven't placed any studio orders with this account yet.
          </p>
          <button
            onClick={onBackToShopping}
            className="px-5 py-2.5 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Explore Collection
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={order._id || order.orderNumber}
                className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-xs hover:border-stone-300 transition-colors"
              >
                {/* Order Top Bar */}
                <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-stone-400 text-[10px] uppercase font-semibold">Order Placed</p>
                      <p className="font-medium text-stone-800 mt-0.5">{formattedDate}</p>
                    </div>
                    <div>
                      <p className="text-stone-400 text-[10px] uppercase font-semibold">Order Total</p>
                      <p className="font-bold text-stone-900 mt-0.5 tabular-nums">${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-stone-400 text-[10px] uppercase font-semibold">Deliver To</p>
                      <p className="font-medium text-stone-800 mt-0.5">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-stone-700 font-bold bg-white border border-stone-200 px-2 py-0.5 rounded text-[11px]">
                      #{order.orderNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-semibold capitalize ${
                        order.orderStatus === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : order.orderStatus === 'shipped'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6 divide-y divide-stone-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 object-cover rounded bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div>
                          <h4 className="font-semibold text-stone-900">{item.name}</h4>
                          <p className="text-stone-400 text-[11px] mt-0.5">
                            Quantity: {item.quantity} · Price: ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900 tabular-nums">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer notes */}
                <div className="bg-stone-50/50 px-6 py-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Payment Method: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})</span>
                  <span>Carrier: AURA Express Logistics</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
