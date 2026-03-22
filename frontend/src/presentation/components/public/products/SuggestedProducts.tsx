'use client';

import React from 'react';
import { Book } from '@/src/domain/entity/book.entity';
import ProductCard from './ProductCard'; // Import component bạn vừa cung cấp

interface SuggestedProductsProps {
  suggestions: Book[];
}

export const SuggestedProducts: React.FC<SuggestedProductsProps> = ({ suggestions }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="mt-20 border-t border-slate-100 pt-16 bg-slate-50">
      <div className="flex flex-col items-center justify-center mb-10 text-center">
        <div>
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Customers also bought
          </h3>
          <p className="text-slate-500 mt-2 font-medium">
            Based on purchase history from other readers
          </p>
        </div>

        <div className="hidden md:block h-1 w-24 bg-blue-600 rounded-full mb-2" />
      </div>

      {/* Grid hiển thị 4 sản phẩm mỗi hàng */}
      {/* Increased columns to 5 or 6 and reduced gap from 8 to 4 */}
      <div className='flex flex-col items-center justify-center min-h-[200px] w-full'>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {suggestions.map((product, index) => (
            <ProductCard
              key={`${product.id}_${index}`}
              product={product}
              onAddToCart={(p) => console.log(`Added ${p.title} to cart`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};