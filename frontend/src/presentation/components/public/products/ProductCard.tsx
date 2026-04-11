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

  // Helper để hiển thị Badge dựa trên BookType
  const renderTypeBadge = () => {
    switch (product.type) {
      case BookType.HOT:
        return (
          <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-md flex items-center gap-1">
            <Flame size={10} fill="currentColor" /> HOT
          </span>
        );
      case BookType.LIMITED:
        return (
          <span className="bg-purple-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-md flex items-center gap-1">
            <Gem size={10} /> GIỚI HẠN
          </span>
        );
      case BookType.PRE_ORDER:
        return (
          <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-md flex items-center gap-1">
            <Calendar size={10} /> ĐẶT TRƯỚC
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`group relative bg-white rounded-2xl border ${product.isNotable ? 'border-amber-200 shadow-amber-50' : 'border-slate-100'} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden`}>
      
      {/* 1. HOVER POPUP (Quick Info) */}
      <div className="absolute inset-x-0 top-0 z-20 p-4 bg-white/95 backdrop-blur-md translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-300 border-b border-slate-100 shadow-lg">
        <p className="text-[10px] font-bold text-blue-600 mb-1 uppercase">Thông tin nhanh</p>
        <p className="text-xs text-slate-600 line-clamp-3 mb-3 italic">
          &quot;{product.description || 'Chưa có mô tả cho sản phẩm này.'}&quot;
        </p>
        <div className="flex gap-4">
           <div className="flex items-center gap-1 text-slate-500">
              <BookOpen size={12} />
              <span className="text-[10px] font-bold">320 Trang</span>
           </div>
           <div className="flex items-center gap-1 text-slate-500">
              <Globe size={12} />
              <span className="text-[10px] font-bold">Tiếng Việt</span>
           </div>
        </div>
      </div>

      {/* Badges Stack */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {/* Ưu tiên hiển thị Loại sách (Hot/Limited/Pre-order) */}
        {renderTypeBadge()}

        {product.isNotable && (
          <span className="bg-amber-400 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-md flex items-center gap-1">
            <Star size={10} fill="currentColor" /> NỔI BẬT
          </span>
        )}
        
        {hasDiscount && (
          <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-sm">
            -{product.discount}%
          </span>
        )}
        
        {product.stock === 0 && product.type !== BookType.PRE_ORDER && (
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
            HẾT HÀNG
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-30 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100">
        <Heart size={18} />
      </button>

      {/* Image Section */}
      <Link href={`/products/${product.id}`} className="block aspect-[3/4] relative overflow-hidden bg-slate-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Bookmark size={40} className="text-slate-300" />
          </div>
        )}
        {/* Overlay cho sách Limited hoặc Notable */}
        {(product.isNotable || product.type === BookType.LIMITED) && (
          <div className={`absolute inset-0 pointer-events-none bg-gradient-to-t ${
            product.type === BookType.LIMITED ? 'from-purple-500/10' : 'from-amber-500/10'
          } to-transparent`} />
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 space-y-2 relative bg-white z-10">
        <div className="flex justify-between items-start gap-2">
          <div className="w-full">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                {product.category?.name || 'Sách'}
              </p>
              {product.isNotable && <Award size={12} className="text-amber-500" />}
              {product.type === BookType.HOT && <Flame size={12} className="text-red-500" />}
            </div>
            <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
            <p className="text-xs text-slate-500 italic line-clamp-1">
              bởi {product.author?.name || 'Ẩn danh'}
            </p>
          </div>
        </div>

        {/* Rating & Sold Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold">5.0</span> 
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">
              {product.type === BookType.PRE_ORDER ? 'Sắp có hàng' : 'Đã bán 0'}
          </span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[10px] text-slate-400 line-through">
                {product.price.toLocaleString('vi-VN')}₫
              </span>
            )}
            <span className={`text-lg font-black ${
              product.type === BookType.HOT ? 'text-red-600' : 
              product.isNotable ? 'text-amber-600' : 'text-slate-900'
            }`}>
              {discountedPrice.toLocaleString('vi-VN')}₫
            </span>
          </div>

          <button
            // Nếu là PRE_ORDER thì vẫn cho phép thêm vào giỏ hàng dù stock = 0
            disabled={product.stock === 0 && product.type !== BookType.PRE_ORDER}
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
              onAddToCart?.(product);
            }}
            className={`p-2.5 rounded-xl z-30 transition-all shadow-sm active:scale-90 ${
              product.type === BookType.HOT ? 'bg-red-600 hover:bg-red-700 text-white' :
              product.isNotable ? 'bg-amber-500 hover:bg-amber-600 text-white' : 
              'bg-slate-900 hover:bg-blue-600 text-white'
            } disabled:bg-slate-200 disabled:cursor-not-allowed`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;