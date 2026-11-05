import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Product, Order } from '../types';
import { Plus, Edit2, Trash2, ShieldCheck, RefreshCw, Package, ShoppingBag, DollarSign, Users, X, Check, ArrowLeft } from 'lucide-react';

interface AdminViewProps {
  onBackToShopping: () => void;
}

export function AdminView({ onBackToShopping }: AdminViewProps) {
  const { user, isAdmin, quickDemoLogin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  // Product form modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Audio & Acoustics');
  const [formPrice, setFormPrice] = useState('199');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formStock, setFormStock] = useState('20');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('/src/assets/images/product_studio_headphones_1793814263043.jpg');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formTrending, setFormTrending] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        api.getProducts(),
        api.getAllOrders(),
      ]);
      setProducts(prodRes.products || []);
      setOrders(orderRes.orders || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Audio & Acoustics');
    setFormPrice('149');
    setFormOriginalPrice('');
    setFormStock('25');
    setFormDescription('Studio-grade minimalist hardware crafted for daily focus.');
    setFormImage('/src/assets/images/product_studio_headphones_1793814263043.jpg');
    setFormFeatured(false);
    setFormTrending(false);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price.toString());
    setFormOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setFormStock(p.stock.toString());
    setFormDescription(p.description);
    setFormImage(p.image);
    setFormFeatured(Boolean(p.featured));
    setFormTrending(Boolean(p.trending));
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<Product> = {
        name: formName,
        category: formCategory,
        price: parseFloat(formPrice) || 0,
        originalPrice: formOriginalPrice ? parseFloat(formOriginalPrice) : undefined,
        stock: parseInt(formStock, 10) || 0,
        description: formDescription,
        image: formImage,
        featured: formFeatured,
        trending: formTrending,
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct._id, payload);
        setStatusMessage(`Updated product "${formName}"`);
      } else {
        await api.createProduct(payload);
        setStatusMessage(`Created product "${formName}"`);
      }

      setIsProductModalOpen(false);
      loadAdminData();
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the store catalog?`)) return;
    try {
      await api.deleteProduct(id);
      setStatusMessage(`Deleted product "${name}"`);
      loadAdminData();
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      setStatusMessage(`Updated order #${orderId.slice(-6)} to ${status}`);
      loadAdminData();
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleResetCatalog = async () => {
    if (!confirm('Reset entire catalog to default curated products?')) return;
    try {
      await api.resetSeedProducts();
      setStatusMessage('Catalog reset to defaults');
      loadAdminData();
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to reset catalog');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display text-stone-900">
            Admin Authentication Required
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Access to product catalog management, stock adjustments, and order fulfillment requires administrator credentials.
          </p>
        </div>

        <div className="p-4 bg-stone-50 rounded border border-stone-200 text-xs text-stone-600 text-left">
          <p className="font-semibold text-stone-900 mb-1">Pre-configured Demo Admin:</p>
          <p>Email: <span className="font-mono text-stone-800">admin@aura.store</span></p>
          <p>Password: <span className="font-mono text-stone-800">admin123</span></p>
        </div>

        <button
          onClick={() => quickDemoLogin('admin')}
          className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded text-xs font-semibold transition-colors"
        >
          Quick 1-Click Demo Admin Sign-In
        </button>
      </div>
    );
  }

  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-stone-900">
              AURA Management Portal
            </h1>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Admin
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Product catalog CRUD, inventory telemetry, and customer fulfillment controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetCatalog}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Reset to default seed products"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Catalog</span>
          </button>

          <button
            onClick={onBackToShopping}
            className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* KPI metric strips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-stone-700" />
          </div>
          <p className="text-2xl font-bold font-display text-stone-900 tabular-nums">
            ${totalRevenue.toFixed(2)}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">From all confirmed orders</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-stone-700" />
          </div>
          <p className="text-2xl font-bold font-display text-stone-900 tabular-nums">
            {orders.length}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">Processed transactions</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Live Catalog</span>
            <Package className="w-4 h-4 text-stone-700" />
          </div>
          <p className="text-2xl font-bold font-display text-stone-900 tabular-nums">
            {products.length}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">Active merchandise SKUs</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Inventory Health</span>
            <ShieldCheck className="w-4 h-4 text-stone-700" />
          </div>
          <p className="text-2xl font-bold font-display text-stone-900 tabular-nums">
            {products.reduce((acc, p) => acc + (p.stock || 0), 0)}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">Total physical stock count</p>
        </div>
      </div>

      {/* Tab bar (Products vs Orders) */}
      <div className="flex items-center justify-between border-b border-stone-200">
        <div className="flex items-center gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'border-stone-900 text-stone-950'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Product Management ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-stone-900 text-stone-950'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Order Fulfillment ({orders.length})
          </button>
        </div>

        {activeTab === 'products' && (
          <button
            onClick={handleOpenCreateModal}
            className="mb-2 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>
        )}
      </div>

      {/* Products Table */}
      {activeTab === 'products' && (
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded bg-stone-100 border border-stone-200 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-stone-900 line-clamp-1">{p.name}</p>
                        <p className="text-[11px] text-stone-400">ID: {p._id}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-600">{p.category}</td>
                    <td className="py-3 px-4 font-bold text-stone-900 tabular-nums">${p.price.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold tabular-nums ${p.stock <= 5 ? 'text-amber-800' : 'text-stone-700'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600 tabular-nums">★ {p.rating.toFixed(1)} ({p.reviewsCount})</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id, p.name)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Table */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Change Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-400">
                      No orders received yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o._id || o.orderNumber} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        #{o.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-stone-900">{o.customerName}</p>
                        <p className="text-[11px] text-stone-400">{o.customerEmail}</p>
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {o.items.length} {o.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900 tabular-nums">
                        ${o.total.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          o.orderStatus === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700'
                            : o.orderStatus === 'shipped'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-800'
                        }`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(o._id || o.orderNumber, e.target.value)}
                          className="px-2 py-1 bg-stone-50 border border-stone-300 rounded text-xs text-stone-800 focus:outline-none"
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Form Modal (Create or Edit) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold font-display text-stone-900">
                {editingProduct ? 'Edit Store Product' : 'Add New Product to Catalog'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none"
                  >
                    <option value="Audio & Acoustics">Audio & Acoustics</option>
                    <option value="Brew & Ceramics">Brew & Ceramics</option>
                    <option value="Desk & Studio">Desk & Studio</option>
                    <option value="Lighting & Living">Lighting & Living</option>
                    <option value="Curated Essentials">Curated Essentials</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Image URL / Path *</label>
                <input
                  type="text"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="rounded"
                  />
                  <span>Featured Collection</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formTrending}
                    onChange={(e) => setFormTrending(e.target.checked)}
                    className="rounded"
                  />
                  <span>Trending Badge</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
