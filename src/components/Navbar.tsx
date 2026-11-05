import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, LogOut, ShieldCheck, Search, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, extra?: any) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function Navbar({ currentView, onNavigate, searchQuery, onSearchChange }: NavbarProps) {
  const { user, isAdmin, logout, openAuthModal } = useAuth();
  const { itemCount, openDrawer } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="text-xl font-bold tracking-tight text-stone-900 font-display whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          <span>AURA</span>
          <span className="text-xs font-normal text-stone-500 hidden sm:inline tracking-normal font-sans">
            Minimal Goods
          </span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600 whitespace-nowrap">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors hover:text-stone-950 ${currentView === 'home' ? 'text-stone-950 font-semibold' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('catalog')}
            className={`transition-colors hover:text-stone-950 ${currentView === 'catalog' ? 'text-stone-950 font-semibold' : ''}`}
          >
            Collection
          </button>
          <button
            onClick={() => onNavigate('catalog', { category: 'Audio & Acoustics' })}
            className="transition-colors hover:text-stone-950"
          >
            Audio
          </button>
          <button
            onClick={() => onNavigate('catalog', { category: 'Brew & Ceramics' })}
            className="transition-colors hover:text-stone-950"
          >
            Ceramics
          </button>
          <button
            onClick={() => onNavigate('orders')}
            className={`transition-colors hover:text-stone-950 ${currentView === 'orders' ? 'text-stone-950 font-semibold' : ''}`}
          >
            My Orders
          </button>
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1.5 transition-colors text-amber-700 hover:text-amber-900 ${currentView === 'admin' ? 'font-semibold' : ''}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Interactive Affordances (Search, Cart, User) */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Quick search input or expandable toggle */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center bg-white border border-stone-300 rounded-md px-2.5 py-1.5 shadow-xs w-48 sm:w-64">
                <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (currentView !== 'catalog') onNavigate('catalog');
                  }}
                  autoFocus
                  className="w-full bg-transparent text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    onSearchChange('');
                  }}
                  className="text-stone-400 hover:text-stone-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  if (currentView !== 'catalog') onNavigate('catalog');
                }}
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                title="Search collection"
                aria-label="Search collection"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cart Icon & Live Count */}
          <button
            onClick={openDrawer}
            className="relative p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-md transition-colors"
            title="Shopping bag"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-stone-900 text-stone-50 text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                {itemCount}
              </span>
            )}
          </button>

          {/* User Account / Auth Dropdown */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 py-1.5 px-2.5 text-xs font-medium text-stone-800 hover:bg-stone-100 rounded-md transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center text-xs font-semibold uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white border border-stone-200 rounded-lg shadow-lg py-1.5 z-50 text-xs"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-stone-100">
                      <p className="font-semibold text-stone-900">{user.name}</p>
                      <p className="text-stone-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-semibold text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={() => onNavigate('orders')}
                      className="w-full text-left px-3 py-2 hover:bg-stone-50 text-stone-700 flex items-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-stone-400" />
                      <span>Order History</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => onNavigate('admin')}
                        className="w-full text-left px-3 py-2 hover:bg-stone-50 text-amber-800 flex items-center gap-2 font-medium"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-3.5 py-1.5 text-xs font-medium text-stone-900 bg-white border border-stone-300 rounded-md hover:bg-stone-100 hover:border-stone-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
