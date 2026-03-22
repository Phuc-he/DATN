'use client';

import React from 'react';
import { Book } from '@/src/domain/entity/book.entity';
import ProductCard from './ProductCard'; // Assuming the previous component is in the same folder
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Book[];
  viewAllHref: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  products,
  viewAllHref
}) => {
  const handleAddToCart = () => {
    console.log("Added to cart!");
    // In the future, call your useCart() hook here
  };
  return (
    <section className="py-12 px-8 bg-white">
      <div className="container mx-auto">

        {/* Section Header */}
        <div className="flex justify-between items-end mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-[0.2em]">
              <Sparkles size={14} />
              Curated Collection
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-slate-500 text-sm max-w-md">
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href={viewAllHref}
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors group"
          >
            View All
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.slice(0, 5).map((product, index) => (
            <ProductCard
              key={product.id || `product-${index}`}
              product={product}
              // Pass the internal handler, not one from props
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-10 sm:hidden">
          <Link
            href={viewAllHref}
            className="flex items-center justify-center gap-2 w-full py-4 border border-slate-200 rounded-xl font-bold text-slate-700"
          >
            View All Products
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;