import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onSelectCategory: (category: string) => void;
}

export function HeroSection({ onExplore, onSelectCategory }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-stone-100">
      {/* Background imagery with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_modern_lifestyle_1793814262520.jpg"
          alt="AURA minimalist living and acoustic studio environment"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center brightness-90 filter"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/70 to-stone-950/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-2xl space-y-6">
          
          {/* Subtle text kicker (unboxed, zero pills) */}
          <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-amber-300">
            <span>Edition 04</span>
            <span aria-hidden="true">·</span>
            <span>Acoustics & Tactile Objects</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white leading-[1.1] [text-wrap:balance]">
            Curated objects engineered for focused living.
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl">
            Explore studio-grade wireless acoustics, hand-thrown ceramics, vegetable-tanned leather desk gear, and architectural brass lighting designed for everyday clarity.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExplore}
              className="px-6 py-3 bg-stone-100 hover:bg-white text-stone-950 text-xs sm:text-sm font-semibold rounded-md transition-all shadow-sm hover:shadow flex items-center gap-2 group whitespace-nowrap"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              onClick={() => onSelectCategory('Audio & Acoustics')}
              className="px-5 py-3 bg-stone-900/60 hover:bg-stone-900/90 border border-stone-600 text-stone-200 text-xs sm:text-sm font-medium rounded-md transition-colors backdrop-blur-xs whitespace-nowrap"
            >
              View Studio Audio
            </button>
          </div>

          {/* Key proof metrics adjacent to claim */}
          <div className="pt-8 border-t border-stone-800/80 flex items-center gap-8 text-xs text-stone-400">
            <div>
              <p className="font-semibold text-stone-200 text-base tabular-nums">4.9 / 5.0</p>
              <p className="text-[11px] text-stone-400">Verified customer rating</p>
            </div>
            <div className="h-7 w-px bg-stone-800" />
            <div>
              <p className="font-semibold text-stone-200 text-base tabular-nums">100%</p>
              <p className="text-[11px] text-stone-400">Honest materials & craft</p>
            </div>
            <div className="h-7 w-px bg-stone-800" />
            <div>
              <p className="font-semibold text-stone-200 text-base tabular-nums">Free</p>
              <p className="text-[11px] text-stone-400">Express delivery &gt; $150</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
