import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register, quickDemoLogin } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, phone);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = async (role: 'customer' | 'admin') => {
    setError('');
    setIsLoading(true);
    try {
      await quickDemoLogin(role);
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-stone-200 relative">
        
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <span className="text-xl font-bold font-display tracking-tight text-stone-900">
            AURA
          </span>
          <h2 className="text-base font-semibold text-stone-800 mt-1">
            {authModalMode === 'login' ? 'Sign In to Your Account' : 'Create Studio Profile'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {authModalMode === 'login'
              ? 'Manage orders, save shipping coordinates, and track deliveries.'
              : 'Join AURA to receive studio dispatches and expedited checkout.'}
          </p>
        </div>

        {/* 1-Click Fast Demo Testing Strip */}
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 mb-5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600">
            <span>Fast Project Evaluation:</span>
            <span className="text-[10px] text-stone-400 font-normal">No typing required</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('customer')}
              disabled={isLoading}
              className="py-1.5 px-2 bg-white hover:bg-stone-100 border border-stone-300 rounded text-xs font-medium text-stone-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5 text-stone-600" />
              <span>Demo Customer</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              disabled={isLoading}
              className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded text-xs font-semibold text-amber-900 transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {authModalMode === 'register' && (
            <div>
              <label className="block font-medium text-stone-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Marcus Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none focus:border-stone-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-medium text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>

          {authModalMode === 'register' && (
            <div>
              <label className="block font-medium text-stone-700 mb-1">Phone (Optional)</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none focus:border-stone-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>{authModalMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Mode switch */}
        <div className="text-center mt-5 pt-4 border-t border-stone-100 text-xs text-stone-500">
          {authModalMode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="font-semibold text-stone-900 hover:underline"
              >
                Create one now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="font-semibold text-stone-900 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
