import React from 'react';
import { Headphones, Coffee, Compass, Lamp, Sparkles } from 'lucide-react';

interface FeaturedCategoriesProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  categoriesWithCount?: { name: string; count: number }[];
}

export function FeaturedCategories({
  activeCategory,
  onSelectCategory,
  categoriesWithCount = []
}: FeaturedCategoriesProps) {
  const categoryDefs = [
    {
      name: 'all',
      label: 'All Goods',
      icon: Sparkles,
      desc: 'Complete studio catalog'
    },
    {
      name: 'Audio & Acoustics',
      label: 'Audio & Acoustics',
      icon: Headphones,
      desc: 'Wireless studio monitors & headphones'
    },
    {
      name: 'Brew & Ceramics',
      label: 'Brew & Ceramics',
      icon: Coffee,
      desc: 'Hand-thrown stoneware & extraction'
    },
    {
      name: 'Desk & Studio',
      label: 'Desk & Studio',
      icon: Compass,
      desc: 'Full-grain leather mats & brass pens'
    },
    {
      name: 'Lighting & Living',
      label: 'Lighting & Living',
      icon: Lamp,
      desc: 'Architectural lamps & travertine objects'
    },
  ];

  return (
    <section className="py-12 bg-stone-100 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Browse By Specialty
            </span>
            <h2 className="text-2xl font-bold font-display text-stone-900 tracking-tight mt-1">
              Curated Disciplines
            </h2>
          </div>
          <p className="text-xs text-stone-500 max-w-sm">
            Every category represents purposeful design, calibrated ergonomics, and sustainable material provenance.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categoryDefs.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.name;
            const countInfo = categoriesWithCount.find(c => c.name === cat.name);

            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`p-4 rounded-lg text-left transition-all border ${
                  isSelected
                    ? 'bg-white border-stone-900 shadow-xs'
                    : 'bg-stone-50 hover:bg-white border-stone-200/80 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-md ${isSelected ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-700'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {countInfo && (
                    <span className="text-[11px] font-medium text-stone-400 tabular-nums">
                      {countInfo.count} items
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-stone-900">
                  {cat.label}
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                  {cat.desc}
                </p>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
