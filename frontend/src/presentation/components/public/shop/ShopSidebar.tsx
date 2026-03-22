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
  baseUrl: string; // Truyền vào '/shop' hoặc '/shop/search'
}

interface PriceRange {
  label: string;
  min?: number; // Using optional or undefined for 'Any'
  max?: number;
  currency?: string; // Optional: if you want to support multiple currencies later
}

const VND_PRICE_RANGES: PriceRange[] = [
  { 
    label: 'Tất cả mức giá', 
    min: undefined, 
    max: undefined 
  },
  { 
    label: 'Dưới 500.000₫', 
    min: 0, 
    max: 500000 
  },
  { 
    label: '500.000₫ - 1.000.000₫', 
    min: 500000, 
    max: 1000000 
  },
  { 
    label: '1.000.000₫ - 2.000.000₫', 
    min: 1000000, 
    max: 2000000 
  },
  { 
    label: 'Trên 2.000.000₫', 
    min: 2000000, 
    max: Infinity 
  },
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
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6 font-bold text-slate-900 uppercase text-[10px] tracking-[0.2em]">
          <Filter size={14} className="text-blue-600" />
          Filter by Genre
        </div>
        <div className="flex flex-col gap-1">
          <Link
            href="/shop/search"
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${!currentCategory ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            All Genres
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/search?category=${cat.id}${query ? `&q=${query}` : ''}`}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${currentCategory === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-5 font-bold text-slate-900 uppercase text-[10px] tracking-[0.2em]">
          <Banknote size={14} className="text-green-600" />
          Price Range
        </div>
        <div className="space-y-1">
          {VND_PRICE_RANGES.map((range) => {
            const isActive = minPrice === range.min?.toString() && maxPrice === range.max?.toString();
            return (
              <Link
                key={range.label}
                href={getPriceUrl(range.min, range.max)}
                className={`block text-sm py-2 px-3 rounded-xl transition-all ${isActive
                  ? 'bg-green-50 text-green-700 font-bold border border-green-100'
                  : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'
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