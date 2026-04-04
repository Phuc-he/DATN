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
    <section className="py-12 bg-white">
      <div className="container mx-auto px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Explore by Genre</h2>
            <p className="text-sm text-slate-500">Find exactly what you&apos;re looking for</p>
          </div>
          <Link href="/categories" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
            All Genres
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Scrollable Container (for mobile) */}
        <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 sm:overflow-visible">
          {categories.map((category, index) => (
            <Link 
              key={category.id || index}
              href={`/shop/search?category=${category.id}`} 
              className="group flex flex-col items-center gap-4 min-w-[100px]"
            >
              {/* Circle Image Wrapper */}
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full p-1 border-2 border-transparent group-hover:border-blue-500 transition-all duration-300 shadow-sm group-hover:shadow-blue-100">
                <div className="relative h-full w-full rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-inner">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-blue-50 text-blue-500">
                      <Book size={32} />
                    </div>
                  )}
                </div>
              </div>

              {/* Category Name */}
              <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 text-center transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCircles;