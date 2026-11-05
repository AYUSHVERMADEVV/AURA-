import React from 'react';
import { Package, ShieldCheck, RefreshCw, Award } from 'lucide-react';

interface FooterProps {
  onNavigateCategory: (category: string) => void;
}

export function Footer({ onNavigateCategory }: FooterProps) {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20">
      {/* Trust bar */}
      <div className="border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-stone-400">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-stone-300 shrink-0" />
            <div>
              <p className="font-semibold text-stone-200">Complimentary Shipping</p>
              <p className="text-[11px] text-stone-400">On all studio orders over $150</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-stone-300 shrink-0" />
            <div>
              <p className="font-semibold text-stone-200">2-Year Studio Warranty</p>
              <p className="text-[11px] text-stone-400">Comprehensive hardware coverage</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-stone-300 shrink-0" />
            <div>
              <p className="font-semibold text-stone-200">30-Day Evaluation</p>
              <p className="text-[11px] text-stone-400">Effortless domestic returns</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-stone-300 shrink-0" />
            <div>
              <p className="font-semibold text-stone-200">Artisanal Provenance</p>
              <p className="text-[11px] text-stone-400">Ethically sourced materials</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-2 space-y-4">
          <span className="text-xl font-bold font-display tracking-tight text-stone-100">
            AURA
          </span>
          <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
            Curated objects engineered for focused living, tactile clarity, and everyday acoustic balance. Handcrafted with honest materials and designed to age with grace.
          </p>
          <div className="pt-2 text-xs text-stone-500">
            <span className="font-medium text-stone-400">MERN Stack Architecture</span>
            <div className="flex items-center gap-2 mt-1">
              <span>React 19</span>
              <span aria-hidden="true">·</span>
              <span>Express.js</span>
              <span aria-hidden="true">·</span>
              <span>MongoDB</span>
              <span aria-hidden="true">·</span>
              <span>Node.js</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-stone-100 tracking-wider uppercase mb-3">
            Collection
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li>
              <button
                onClick={() => onNavigateCategory('Audio & Acoustics')}
                className="hover:text-stone-200 transition-colors"
              >
                Audio & Acoustics
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateCategory('Brew & Ceramics')}
                className="hover:text-stone-200 transition-colors"
              >
                Brew & Ceramics
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateCategory('Desk & Studio')}
                className="hover:text-stone-200 transition-colors"
              >
                Desk & Studio
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateCategory('Lighting & Living')}
                className="hover:text-stone-200 transition-colors"
              >
                Lighting & Living
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateCategory('Curated Essentials')}
                className="hover:text-stone-200 transition-colors"
              >
                Curated Essentials
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-stone-100 tracking-wider uppercase mb-3">
            Customer Care
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li>
              <span className="hover:text-stone-200 transition-colors cursor-pointer">Order Tracking</span>
            </li>
            <li>
              <span className="hover:text-stone-200 transition-colors cursor-pointer">Shipping & Dispatch</span>
            </li>
            <li>
              <span className="hover:text-stone-200 transition-colors cursor-pointer">Returns & Exchanges</span>
            </li>
            <li>
              <span className="hover:text-stone-200 transition-colors cursor-pointer">Material Care Guide</span>
            </li>
            <li>
              <span className="hover:text-stone-200 transition-colors cursor-pointer">Contact Support</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-stone-100 tracking-wider uppercase mb-3">
            Studio Journal
          </h4>
          <p className="text-xs text-stone-400 leading-relaxed mb-3">
            Receive seasonal dispatches, architectural profiles, and limited run release notifications.
          </p>
          <div className="flex gap-1.5">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-stone-800 border border-stone-700 rounded-md px-2.5 py-1.5 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-stone-500 w-full"
            />
            <button className="bg-stone-200 text-stone-900 px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-white transition-colors shrink-0">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800 py-6 text-center text-xs text-stone-500">
        <p>© 2026 AURA Goods Co. All rights reserved. Built with precision MERN Stack architecture.</p>
      </div>
    </footer>
  );
}
