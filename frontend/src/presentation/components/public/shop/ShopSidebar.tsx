// src/presentation/components/public/shop/ShopSidebar.tsx
import { Category } from "@/src/domain/entity/category.entity";
import { Banknote, Filter } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  categories: Category[];
  currentCategory?: string;
  minPrice?: string;
  maxPrice?: string;
  query?: string;
  baseUrl: string;
}

interface PriceRange {
  label: string;
  min?: number;
  max?: number;
}

const VND_PRICE_RANGES: PriceRange[] = [
  { label: 'All Prices', min: undefined, max: undefined },
  { label: 'Under 500.000₫', min: 0, max: 500000 },
  { label: '500.000₫ - 1.000.000₫', min: 500000, max: 1000000 },
  { label: '1.000.000₫ - 2.000.000₫', min: 1000000, max: 2000000 },
  { label: 'Over 2.000.000₫', min: 2000000, max: Infinity },
];

export const ShopSidebar = ({ categories, currentCategory, minPrice, maxPrice, query }: SidebarProps) => {

  const getPriceUrl = (pMin?: number, pMax?: number) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (currentCategory) params.set('category', currentCategory);
    if (pMin !== undefined) params.set('minPrice', pMin.toString());
    if (pMax !== undefined) params.set('maxPrice', pMax.toString());
    return `/shop/search?${params.toString()}`;
  };

  return (
    <aside className="lg:col-span-3 space-y-6">

      {/* Genre Filter */}
      <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6 font-black text-slate-950 uppercase text-[10px] tracking-[0.3em]">
          <Filter size={14} className="text-emerald-600" />
          Browse Genres
        </div>
        <div className="flex flex-col gap-1.5">
          <Link
            href="/shop/search"
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${!currentCategory
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
              : 'text-emerald-800 hover:text-emerald-600 hover:bg-emerald-50/50'
              }`}
          >
            All Genres
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/search?category=${cat.id}${query ? `&q=${query}` : ''}`}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${currentCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
                : 'text-emerald-800 hover:text-emerald-600 hover:bg-emerald-50/50'
                }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6 font-black text-slate-950 uppercase text-[10px] tracking-[0.3em]">
          <Banknote size={14} className="text-emerald-600" />
          Price Range
        </div>
        <div className="space-y-1.5">
          {VND_PRICE_RANGES.map((range) => {
            const isActive = minPrice === range.min?.toString() && maxPrice === range.max?.toString();
            return (
              <Link
                key={range.label}
                href={getPriceUrl(range.min, range.max)}
                className={`block text-sm py-2.5 px-4 rounded-xl transition-all font-bold ${isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'text-emerald-800 hover:text-emerald-600 hover:bg-emerald-50/50'
                  }`}
              >
                {range.label}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
