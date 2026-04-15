'use client';

import React from 'react';
import { Book } from '@/src/domain/entity/book.entity';
import ProductCard from './ProductCard';
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
    console.log("Đã thêm vào giỏ!");
  };

  return (
    <section className="py-20 px-8 bg-white">
      <div className="container mx-auto">

        {/* Tiêu đề phần */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-black text-[10px] uppercase tracking-[0.3em]">
              <div className="h-px w-8 bg-emerald-200" />
              <Sparkles size={14} className="text-emerald-900" />
              Bộ sưu tập chọn lọc
            </div>

            <h2 className="text-4xl font-black text-slate-950 tracking-tighter">
              {title}
              <span className="text-emerald-600">.</span>
            </h2>

            {subtitle && (
              <p className="text-emerald-800 text-base max-w-lg font-medium leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href={viewAllHref}
            className="hidden sm:flex items-center gap-3 text-sm font-black text-slate-950 hover:text-emerald-700 transition-all group py-2 px-4 rounded-full hover:bg-emerald-50"
          >
            Khám phá tất cả
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Lưới sản phẩm */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {products.slice(0, 5).map((product, index) => (
            <div
              key={product.id || `product-${index}`}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </div>

        {/* Nút Xem tất cả trên điện thoại */}
        <div className="mt-12 sm:hidden">
          <Link
            href={viewAllHref}
            className="flex items-center justify-center gap-2 w-full py-5 bg-slate-950 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 active:scale-95 transition-transform"
          >
            Xem toàn bộ bộ sưu tập
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
