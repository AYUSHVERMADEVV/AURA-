import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { api } from './services/api';
import { Product, Order } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { FeaturedCategories } from './components/FeaturedCategories';
import { ProductCard } from './components/ProductCard';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderSuccessView } from './components/OrderSuccessView';
import { OrdersView } from './components/OrdersView';
import { AdminView } from './components/AdminView';
import { AuthModal } from './components/AuthModal';
import { ArrowRight, ShieldCheck, Compass, Sparkles, Coffee } from 'lucide-react';

function AppContent() {
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'checkout' | 'order-success' | 'orders' | 'admin'>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Filter states
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState('newest');

  // Selected product for PDP Quick View Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Confirmed order for receipt view
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadCatalog();
  }, [activeCategory, searchQuery, priceRange, sortBy]);

  const loadCatalog = async () => {
    setIsLoadingProducts(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts({
          category: activeCategory !== 'all' ? activeCategory : undefined,
          search: searchQuery.trim() || undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sort: sortBy,
        }),
        api.getCategories(),
      ]);
      setProducts(prodRes.products || []);
      setCategories(catRes.categories || []);
    } catch (err) {
      console.error('Failed to load catalog:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleNavigate = (view: string, extra?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (extra?.category) {
      setActiveCategory(extra.category);
    }
    setCurrentView(view as any);
  };

  const handleClearFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setPriceRange([0, 500]);
    setSortBy('newest');
  };

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const trendingProducts = products.filter(p => p.trending).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      
      {/* Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <div className="space-y-16">
            
            {/* Storefront Hero with Lifestyle Visual */}
            <HeroSection
              onExplore={() => handleNavigate('catalog')}
              onSelectCategory={(cat) => handleNavigate('catalog', { category: cat })}
            />

            {/* Curated Categories Bar */}
            <FeaturedCategories
              activeCategory={activeCategory}
              onSelectCategory={(cat) => handleNavigate('catalog', { category: cat })}
              categoriesWithCount={categories}
            />

            {/* Featured Collection Grid (Max 4 products, generous whitespace) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-stone-200">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Handpicked Studio Selection
                  </span>
                  <h2 className="text-2xl font-bold font-display text-stone-900 tracking-tight mt-1">
                    Featured Collection
                  </h2>
                </div>
                <button
                  onClick={() => handleNavigate('catalog')}
                  className="text-xs font-semibold text-stone-900 hover:text-stone-600 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <span>Explore All Goods</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4)).map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={setSelectedProduct}
                  />
                ))}
              </div>
            </section>

            {/* Craftsmanship & Material Provenance Story */}
            <section className="bg-stone-900 text-stone-100 py-20 border-y border-stone-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                    Studio Philosophy
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white leading-tight [text-wrap:balance]">
                    Designed for tactile permanence, not transient cycles.
                  </h2>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    We select organic Italian vegetable-tanned leathers, aerospace machined alloys, hand-thrown Japanese stonewares, and high-CRI diffused optical spheres. Every product is calibrated for acoustic quietness and visual calm.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-800 text-xs">
                    <div>
                      <p className="font-bold text-stone-200 text-sm">Precision Tolerance</p>
                      <p className="text-stone-400 mt-1">Machined aluminum enclosures with &lt; 0.05mm fit.</p>
                    </div>
                    <div>
                      <p className="font-bold text-stone-200 text-sm">Natural Patina</p>
                      <p className="text-stone-400 mt-1">Uncoated Tuscan hides that darken beautifully over years.</p>
                    </div>
                  </div>
                </div>

                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-800 border border-stone-700 shadow-xl">
                  <img
                    src="/src/assets/images/product_leather_deskmat_1793814266291.jpg"
                    alt="Tactile desk mat and machined pen"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </section>

            {/* Trending Goods Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-stone-200">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Most Requested
                  </span>
                  <h2 className="text-2xl font-bold font-display text-stone-900 tracking-tight mt-1">
                    Trending This Season
                  </h2>
                </div>
                <button
                  onClick={() => handleNavigate('catalog')}
                  className="text-xs font-semibold text-stone-900 hover:text-stone-600 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <span>View Full Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(trendingProducts.length > 0 ? trendingProducts : products.slice(4, 8)).map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={setSelectedProduct}
                  />
                ))}
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: FULL PRODUCTS CATALOG */}
        {currentView === 'catalog' && (
          <ProductCatalog
            products={products}
            isLoading={isLoadingProducts}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            categories={categories}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onQuickView={setSelectedProduct}
            onClearFilters={handleClearFilters}
          />
        )}

        {/* VIEW 3: CHECKOUT */}
        {currentView === 'checkout' && (
          <CheckoutView
            onOrderCompleted={(order) => {
              setConfirmedOrder(order);
              setCurrentView('order-success');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToShopping={() => handleNavigate('catalog')}
          />
        )}

        {/* VIEW 4: ORDER CONFIRMATION / SUCCESS */}
        {currentView === 'order-success' && confirmedOrder && (
          <OrderSuccessView
            order={confirmedOrder}
            onViewOrders={() => handleNavigate('orders')}
            onContinueShopping={() => handleNavigate('catalog')}
          />
        )}

        {/* VIEW 5: ORDERS HISTORY & TRACKING */}
        {currentView === 'orders' && (
          <OrdersView
            onBackToShopping={() => handleNavigate('catalog')}
          />
        )}

        {/* VIEW 6: ADMIN MANAGEMENT PORTAL */}
        {currentView === 'admin' && (
          <AdminView
            onBackToShopping={() => handleNavigate('catalog')}
          />
        )}

      </main>

      {/* Product Detail Modal (PDP) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onCheckout={() => handleNavigate('checkout')}
        onExplore={() => handleNavigate('catalog')}
      />

      {/* Authentication Modal (Register / Login / Demo accounts) */}
      <AuthModal />

      {/* Universal Footer */}
      <Footer
        onNavigateCategory={(cat) => handleNavigate('catalog', { category: cat })}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
