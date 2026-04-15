'use client';

import {
  ArrowRight,
  CheckCircle2,
  Mail,
  ShoppingBag,
  Truck
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Chúng tôi bọc nội dung trong một component để sử dụng useSearchParams an toàn với Suspense
const SuccessContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Biểu tượng Thành công */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-200 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <CheckCircle2 size={100} className="text-emerald-900 relative z-10" />
        </div>
      </div>

      {/* Thông điệp chính */}
      <h1 className="text-4xl font-black text-slate-950 mb-4 tracking-tight">
        Đơn hàng đã được xác nhận!
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Cảm ơn bạn đã mua sắm. Những cuốn sách của bạn đang được chuẩn bị để gửi đến ngôi nhà mới.
      </p>

      {/* Thẻ thông tin đơn hàng */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-6 border-b border-emerald-50">
          <div className="text-left">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mã Đơn Hàng</p>
            <p className="text-lg font-mono font-bold text-slate-950">#{orderId || 'N/A'}</p>
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-4 py-1 rounded-full text-sm font-bold">
            Đang xử lý
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="flex items-start gap-3">
            <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
              <Mail size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-950 text-sm">Xác nhận qua Email</p>
              <p className="text-xs text-emerald-900">Đã gửi đến email đã đăng ký của bạn.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
              <Truck size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-950 text-sm">Thời gian giao hàng dự kiến</p>
              <p className="text-xs text-emerald-900">3-5 Ngày làm việc</p>
            </div>
          </div>
        </div>
      </div>

      {/* Các nút hành động */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/shop"
          className="flex items-center justify-center gap-2 bg-slate-950 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
        >
          <ShoppingBag size={20} />
          Tiếp tục mua sắm
        </Link>
        <Link
          href="/profile/orders"
          className="flex items-center justify-center gap-2 bg-white text-slate-950 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all active:scale-95"
        >
          Xem đơn hàng của tôi
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};

// Component trang chính
export default function Page() {
  return (
    <div className="bg-emerald-50 min-h-screen py-20 px-4">
      {/* Suspense là bắt buộc khi sử dụng useSearchParams trong App Router */}
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-emerald-900 font-medium">Đang hoàn tất chi tiết đơn hàng của bạn...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
