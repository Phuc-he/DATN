'use client';

import React from 'react';
import { Book } from '@/src/domain/entity/book.entity';
import { ShoppingCart, Star, Heart, Bookmark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/src/presentation/context/CartContext';

interface ProductCardProps {
  product: Book;
  onAddToCart?: (product: Book) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { addToCart } = useCart();

  // Khớp với logic: discount mặc định là 0 từ Entity
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      
      {/* Badge: Giảm giá hoặc Hết hàng */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {hasDiscount && (
          <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-sm">
            -{product.discount}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
            HẾT HÀNG
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100">
        <Heart size={18} />
      </button>

      {/* Link tới chi tiết sản phẩm - Dùng product.id từ Kotlin Entity */}
      <Link href={`/products/${product.id}`} className="block aspect-[3/4] relative overflow-hidden bg-slate-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Bookmark size={40} className="text-slate-300" />
          </div>
        )}
      </Link>

      {/* Thông tin sản phẩm */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
              {product.category?.name || 'Sách'}
            </p>
            <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
            <p className="text-xs text-slate-500 italic line-clamp-1">
              bởi {product.author?.name || 'Ẩn danh'}
            </p>
          </div>
        </div>

        {/* Rating & Sales (Giữ lại UI nếu bạn có mở rộng thêm sau này) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold">5.0</span> 
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Đã bán 0
          </span>
        </div>

        {/* Giá và Hành động */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[10px] text-slate-400 line-through">
                {product.price.toLocaleString('vi-VN')}₫
              </span>
            )}
            <span className="text-lg font-black text-slate-900">
              {discountedPrice.toLocaleString('vi-VN')}₫
            </span>
          </div>

          <button
            disabled={product.stock === 0}
            onClick={(e) => {
              e.preventDefault();
              // Lưu ý: Đảm bảo CartContext của bạn nhận object Book mới này
              addToCart(product, 1);
              onAddToCart?.(product);
            }}
            className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 disabled:bg-slate-200 disabled:cursor-not-allowed transition-colors shadow-sm active:scale-90"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;