'use client';

import { Book } from '@/src/domain/entity/book.entity';
import { useCart } from '@/src/presentation/context/CartContext';
import {
  Award, // Added
  BookOpen,
  CheckCircle2,
  Heart,
  Layers,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Sparkles // Added
} from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

interface ProductDetailsProps {
  product: Book;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleQuantity = (type: 'inc' | 'dec') => {
    if (type === 'inc' && quantity < product.stock) setQuantity(q => q + 1);
    if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 md:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Cột trái: Ảnh sản phẩm */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className={`relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl border ${product.isNotable ? 'border-amber-200' : 'border-slate-100'} bg-slate-50`}>
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <BookOpen size={80} />
                  </div>
                )}

                {/* Badge Container */}
                <div className="absolute top-6 left-6 flex flex-col gap-3">
                  {product.isNotable && (
                    <div className="bg-amber-400 text-white font-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
                      <Star size={18} fill="currentColor" />
                      TÁC PHẨM TIÊU BIỂU
                    </div>
                  )}
                  {hasDiscount && (
                    <div className="bg-orange-500 text-white font-black px-4 py-2 rounded-lg shadow-lg w-fit">
                      GIẢM {product.discount}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Thông tin chi tiết */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <nav className="flex items-center text-xs font-bold text-blue-600 uppercase tracking-widest gap-2">
                <span>Cửa hàng</span> / <span>{product.category?.name || 'Sách'}</span>
                {product.isNotable && (
                  <>
                    <span className="text-slate-300">/</span>
                    <span className="text-amber-500 flex items-center gap-1">
                      <Sparkles size={12} /> Lựa chọn hàng đầu
                    </span>
                  </>
                )}
              </nav>
              
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                  {product.title}
                </h1>
                {product.isNotable && (
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-sm bg-amber-50 w-fit px-3 py-1 rounded-full border border-amber-100">
                    <Award size={16} />
                    Sách được đề xuất bởi biên tập viên
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <p className="text-xl text-slate-500 italic">bởi <span className="text-slate-900 font-semibold not-italic">{product.author?.name || 'Ẩn danh'}</span></p>
                <div className="flex items-center gap-1 text-amber-500">
                    <Star size={18} fill="currentColor" />
                    <span className="font-bold text-slate-900">5.0</span>
                    <span className="text-slate-400 text-sm">(0 đánh giá)</span>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border flex flex-wrap items-end gap-6 ${product.isNotable ? 'bg-amber-50/50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
              <div>
                {hasDiscount && (
                  <span className="text-lg text-slate-400 line-through font-medium block">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                )}
                <span className={`text-4xl font-black ${product.isNotable ? 'text-amber-600' : 'text-slate-900'}`}>
                  {discountedPrice.toLocaleString('vi-VN')}₫
                </span>
              </div>
              <div className="mb-1">
                {product.stock > 0 ? (
                  <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    CÒN HÀNG ({product.stock} cuốn)
                  </span>
                ) : (
                  <span className="text-xs font-bold px-3 py-1 bg-red-100 text-red-700 rounded-full">
                    HẾT HÀNG
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Mô tả
                {product.isNotable && <Sparkles size={18} className="text-amber-400" />}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {product.description || "Chưa có mô tả cho cuốn sách này."}
              </p>
            </div>

            {/* Hành động Thêm vào giỏ */}
            <div className="flex flex-col sm:flex-row gap-4 items-center pt-4">
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => handleQuantity('dec')}
                  className="p-4 hover:bg-slate-50 transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantity('inc')}
                  className="p-4 hover:bg-slate-50 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdded}
                className={`flex-1 w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:cursor-not-allowed ${
                  isAdded 
                    ? "bg-green-600 text-white" 
                    : product.isNotable 
                      ? "bg-amber-500 text-white hover:bg-amber-600" 
                      : "bg-slate-900 text-white hover:bg-blue-600"
                }`}
              >
                {isAdded ? (
                  <>
                    <CheckCircle2 size={22} />
                    Đã thêm vào giỏ!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={22} />
                    Thêm vào giỏ — {(discountedPrice * quantity).toLocaleString('vi-VN')}₫
                  </>
                )}
              </button>

              <button className={`p-4 border-2 rounded-xl transition-all ${product.isNotable ? 'border-amber-200 hover:bg-amber-50 text-amber-500' : 'border-slate-200 hover:bg-red-50 hover:text-red-500'}`}>
                <Heart size={22} fill={product.isNotable ? "currentColor" : "none"} className={product.isNotable ? "opacity-50" : ""} />
              </button>
            </div>

            {/* Thông số kỹ thuật */}
            <div className={`grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 pt-8 border-t ${product.isNotable ? 'border-amber-100' : 'border-slate-100'}`}>
              <div className="flex items-start gap-3">
                <Layers className={product.isNotable ? "text-amber-400" : "text-slate-400"} size={20} />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Thể loại</p>
                  <p className="text-sm font-semibold text-slate-700">{product.category?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className={product.isNotable ? "text-amber-400" : "text-slate-400"} size={20} />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Cam kết</p>
                  <p className="text-sm font-semibold text-slate-700">100% Sách thật</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className={product.isNotable ? "text-amber-400" : "text-slate-400"} size={20} />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Giao hàng</p>
                  <p className="text-sm font-semibold text-slate-700">Toàn quốc</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;