'use client';

import { Book } from '@/src/domain/entity/book.entity';
import React from 'react';
import ProductSection from './ProductSection';

interface SuggestedProductsProps {
  suggestions: Book[];
}

export const SuggestedProducts: React.FC<SuggestedProductsProps> = ({ suggestions }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="mt-20 border-t border-slate-100 pt-16 bg-emerald-50">
      <div className="flex flex-col items-center justify-center mb-10 text-center">
        <div>
          <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
            Customers also bought
          </h3>
          <p className="text-emerald-800 mt-2 font-medium">
            Based on purchase history from other readers
          </p>
        </div>

        <div className="hidden md:block h-1 w-24 bg-emerald-600 rounded-full mb-2" />
      </div>

      {/* Grid hiển thị 4 sản phẩm mỗi hàng */}
      {/* Increased columns to 5 or 6 and reduced gap from 8 to 4 */}
      <ProductSection title={''} products={suggestions} viewAllHref={'#'} />
    </div>
  );
};
