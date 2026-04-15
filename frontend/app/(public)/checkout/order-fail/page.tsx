'use client';

import {
  AlertCircle,
  ArrowLeft,
  MessageCircleQuestion,
  RefreshCcw,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const FailContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Biểu tượng Lỗi */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-rose-200 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <XCircle size={100} className="text-rose-500 relative z-10" />
        </div>
      </div>

      {/* Thông điệp chính */}
      <h1 className="text-4xl font-black text-slate-950 mb-4 tracking-tight">
        Thanh toán thất bại
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Chúng tôi không thể xử lý giao dịch của bạn. Đừng lo lắng, không có khoản tiền nào bị trừ khỏi tài khoản của bạn.
      </p>

      {/* Thẻ thông tin lỗi */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-6 border-b border-emerald-50">
          <div className="text-left">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID Tham chiếu</p>
            <p className="text-lg font-mono font-bold text-slate-950">#{orderId || 'LỖI_HỆ_THỐNG'}</p>
          </div>
          <div className="bg-rose-50 text-rose-700 px-4 py-1 rounded-full text-sm font-bold">
            Giao dịch bị từ chối
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="flex items-start gap-3">
            <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
              <AlertCircle size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-950 text-sm">Lý do phổ biến</p>
              <p className="text-xs text-emerald-900">Không đủ số dư, thông tin thẻ không chính xác hoặc hết thời gian chờ ngân hàng.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
              <MessageCircleQuestion size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-950 text-sm">Cần trợ giúp?</p>
              <p className="text-xs text-emerald-900">Liên hệ với bộ phận hỗ trợ của chúng tôi nếu vấn đề vẫn tiếp diễn.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Các nút hành động */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/checkout"
          className="flex items-center justify-center gap-2 bg-slate-950 text-white px-8 py-4 rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg active:scale-95"
        >
          <RefreshCcw size={20} />
          Thử thanh toán lại
        </Link>
        <Link
          href="/cart"
          className="flex items-center justify-center gap-2 bg-white text-slate-950 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all active:scale-95"
        >
          <ArrowLeft size={20} />
          Quay lại giỏ hàng
        </Link>
      </div>
    </div>
  );
};

export default function OrderFailPage() {
  return (
    <div className="bg-emerald-50 min-h-screen py-20 px-4">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-emerald-900 font-medium">Đang kiểm tra trạng thái giao dịch...</p>
        </div>
      }>
        <FailContent />
      </Suspense>
    </div>
  );
}
