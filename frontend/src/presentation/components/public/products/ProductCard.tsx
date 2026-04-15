'use client';

import React from 'react';
import { Book } from '@/src/domain/entity/book.entity';
import { BookType } from '@/src/domain/entity/book-type.enum';
import {
  ShoppingCart, Star, Heart, Bookmark, Award,
  BookOpen, Globe, Flame, Gem, Calendar
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/src/presentation/context/CartContext';
import { formatCurrency } from '@/src/shared/currency.utils';

interface ProductCardProps {
  product: Book;
  onAddToCart?: (product: Book) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { addToCart } = useCart();

  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const renderTypeBadge = () => {
    switch (product.type) {
      case BookType.HOT:
        return (
          <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
            <Flame size={10} fill="currentColor" /> HOT
          </span>
        );
      case BookType.LIMITED:
        return (
          <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
            <Gem size={10} /> LIMITED
          </span>
        );
      case BookType.PRE_ORDER:
        return (
          <span className="bg-slate-800 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
            <Calendar size={10} /> ĐẶT TRƯỚC
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`group relative bg-white rounded-[2rem] border ${product.isNotable ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-100'} shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-2 transition-all duration-500 overflow-hidden`}>

      {/* 1. QUICK INFO OVERLAY */}
      <div className="absolute inset-x-0 top-0 z-20 p-5 bg-white/95 backdrop-blur-md translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500 border-b border-emerald-50 shadow-lg">
        <p className="text-[10px] font-black text-emerald-600 mb-2 uppercase tracking-[0.2em]">Xem nhanh</p>
        <p className="text-xs text-slate-600 line-clamp-3 mb-4 font-medium italic leading-relaxed">
          &quot;{product.description || 'Chưa có mô tả cho tác phẩm này.'}&quot;
        </p>
        <div className="flex gap-4 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <BookOpen size={12} className="text-emerald-900" />
            <span className="text-[10px] font-black uppercase">320 Trang</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Globe size={12} className="text-emerald-900" />
            <span className="text-[10px] font-black uppercase">Tiếng Việt</span>
          </div>
        </div>
      </div>

      {/* Badges Stack */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {renderTypeBadge()}

        {product.isNotable && (
          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
            <Star size={10} fill="currentColor" /> NỔI BẬT
          </span>
        )}

        {hasDiscount && (
          <span className="bg-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-4 right-4 z-30 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
        <Heart size={18} />
      </button>

      {/* Image Section */}
      <Link href={`/products/${product.id}`} className="block aspect-[3/4] relative overflow-hidden bg-emerald-50">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-emerald-50">
            <Bookmark size={40} className="text-emerald-200" />
          </div>
        )}
        {/* Overlay for Visual Polish */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      {/* Product Info */}
      <div className="p-5 space-y-3 relative bg-white z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em]">
              {product.category?.name || 'Văn học'}
            </p>
            {product.isNotable && <Award size={12} className="text-emerald-900" />}
          </div>

          <h3 className="text-base font-black text-slate-950 line-clamp-1 group-hover:text-emerald-700 transition-colors tracking-tight">
            {product.title}
          </h3>
          <p className="text-xs text-emerald-800 font-medium italic">
            bởi {product.author?.name || 'Ẩn danh'}
          </p>
        </div>

        {/* Rating & Sold Info */}
        <div className="flex items-center justify-between border-t border-emerald-50 pt-3">
          <div className="flex items-center gap-1 text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md">
            <Star size={10} fill="currentColor" />
            <span className="text-[10px] font-black">5.0</span>
          </div>
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            {product.type === BookType.PRE_ORDER ? 'Sắp có' : product.stock === 0 ? 'Hết hàng' : 'Còn hàng'}
          </span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[10px] text-slate-400 line-through font-bold">
                {formatCurrency(product.price)}
              </span>
            )}
            <span className={`text-xl font-black tracking-tighter ${product.type === BookType.HOT ? 'text-rose-600' :
                'text-slate-950'
              }`}>
              {discountedPrice.toLocaleString('vi-VN')}₫
            </span>
          </div>

          <button
            disabled={product.stock === 0 && product.type !== BookType.PRE_ORDER}
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
              onAddToCart?.(product);
            }}
            className={`p-3 rounded-2xl z-30 transition-all shadow-md active:scale-90 ${product.type === BookType.HOT ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-100' :
                'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
              } text-white disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed`}
          >
            <ShoppingCart size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
