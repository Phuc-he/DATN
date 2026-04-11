'use client';

import { useCart } from '@/src/presentation/context/CartContext';
import { ArrowRight, CreditCard, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const CartPage = () => {
  const { cart, removeFromCart, updateAmount, cartTotal, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 px-4">
        <div className="bg-emerald-50 p-8 rounded-full">
          <ShoppingBag size={64} className="text-slate-300" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-950">Giỏ hàng đang trống</h2>
          <p className="text-emerald-900 mt-2">Có vẻ như bạn chưa thêm cuốn sách nào vào giỏ.</p>
        </div>
        <Link
          href="/shop"
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          Khám phá sách <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-black text-slate-950 mb-8 flex items-center gap-3">
          Giỏ hàng của bạn <span className="text-indigo-600">({cartCount})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => {
              const book = item.book;
              const discountedPrice = item.unitPrice * (1 - (item.discount || 0) / 100);

              return (
                <div
                  key={book.id}
                  className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 md:gap-6 items-center"
                >
                  {/* Book Image */}
                  <div className="relative h-24 w-16 md:h-32 md:w-24 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                    {book.imageUrl ? (
                      <Image
                        src={book.imageUrl}
                        alt={book.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-slate-100 w-full h-full flex items-center justify-center">
                        <ShoppingBag className="text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-950 truncate">{book.title}</h3>
                    <p className="text-sm text-emerald-900 mb-4">{book.author?.name || 'Tác giả ẩn danh'}</p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-emerald-50">
                        <button
                          onClick={() => updateAmount(book.id!, Math.max(1, item.quantity - 1))}
                          className="p-1 md:p-2 hover:text-indigo-600 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateAmount(book.id!, item.quantity + 1)}
                          className="p-1 md:p-2 hover:text-indigo-600 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(book.id!)}
                        className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                    </div>
                  </div>

                  {/* Price info */}
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-950">
                      {(discountedPrice * item.quantity).toLocaleString('vi-VN')}₫
                    </p>
                    {item.discount > 0 && (
                      <p className="text-xs text-orange-500 font-bold">
                        -{item.discount}%
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
              <h2 className="text-xl font-black text-slate-950 mb-6">Tóm tắt đơn hàng</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-emerald-900 font-medium">
                  <span>Tạm tính</span>
                  <span className="text-slate-950">{cartTotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-emerald-900 font-medium">
                  <span>Giao hàng</span>
                  <span className="text-green-600 font-bold uppercase text-xs">Miễn phí</span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                  <span className="font-bold text-slate-950 text-lg">Tổng cộng</span>
                  <div className="text-right">
                    <p className="text-3xl font-black text-indigo-600">
                      {cartTotal.toLocaleString('vi-VN')}₫
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Đã bao gồm thuế</p>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-slate-950 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-lg active:scale-95 mb-4"
              >
                <CreditCard size={20} /> Thanh toán ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
