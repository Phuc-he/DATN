'use client';

import React from 'react';
import { Category } from '@/src/domain/entity/category.entity';
import { ArrowRight, Book } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryCircleProps {
  categories: Category[];
}

const CategoryCircles: React.FC<CategoryCircleProps> = ({ categories }) => {
  return (
    <section className="py-16 bg-[#f8fafc]">
      <div className="container mx-auto px-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-950 tracking-tighter">
              Curated <span className="text-emerald-600 font-serif italic font-medium">Genres</span>
            </h2>
            <p className="text-emerald-800 font-medium mt-1">Discover stories tailored to your taste</p>
          </div>
          <Link 
            href="/categories" 
            className="text-sm font-black text-emerald-700 hover:text-emerald-800 flex items-center gap-2 group uppercase tracking-widest"
          >
            All Genres
            <div className="p-2 bg-emerald-50 rounded-full transition-colors group-hover:bg-emerald-100">
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {/* Scrollable Container */}
        <div className="flex gap-10 overflow-x-auto pb-6 no-scrollbar sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 sm:overflow-visible">
          {categories.map((category, index) => (
            <Link 
              key={category.id || index}
              href={`/shop/search?category=${category.id}`} 
              className="group flex flex-col items-center gap-5 min-w-[110px]"
            >
              {/* Circle Image Wrapper */}
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full p-1.5 border border-slate-100 bg-white shadow-sm group-hover:border-emerald-500 group-hover:shadow-xl group-hover:shadow-emerald-100/50 transition-all duration-500">
                <div className="relative h-full w-full rounded-full overflow-hidden bg-emerald-50 shadow-inner">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-115 group-hover:rotate-3"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-emerald-50 text-emerald-600">
                      <Book size={32} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                
                {/* Floating Decorative Element (Optional - for extra flair) */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white scale-0 group-hover:scale-100 transition-transform duration-300" />
              </div>

              {/* Category Name */}
              <div className="space-y-1 text-center">
                <p className="text-sm font-black text-slate-800 group-hover:text-emerald-700 transition-colors tracking-tight">
                  {category.name}
                </p>
                <div className="h-0.5 w-0 bg-emerald-500 mx-auto group-hover:w-full transition-all duration-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCircles;
