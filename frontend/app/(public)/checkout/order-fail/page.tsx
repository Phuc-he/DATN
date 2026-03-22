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
      {/* Error Icon */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-rose-200 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <XCircle size={100} className="text-rose-500 relative z-10" />
        </div>
      </div>

      {/* Main Message */}
      <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
        Payment Failed
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        We couldn&apos;t process your transaction. Don&apos;t worry, no funds were deducted from your account.
      </p>

      {/* Error Info Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-6 border-b border-slate-50">
          <div className="text-left">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reference ID</p>
            <p className="text-lg font-mono font-bold text-slate-900">#{orderId || 'INTERNAL_ERROR'}</p>
          </div>
          <div className="bg-rose-50 text-rose-700 px-4 py-1 rounded-full text-sm font-bold">
            Transaction Declined
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="flex items-start gap-3">
            <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
              <AlertCircle size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Common Reasons</p>
              <p className="text-xs text-slate-500">Insufficient funds, incorrect card details, or bank timeout.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
              <MessageCircleQuestion size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Need Help?</p>
              <p className="text-xs text-slate-500">Contact our support if the issue persists.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/checkout" 
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg active:scale-95"
        >
          <RefreshCcw size={20} />
          Retry Payment
        </Link>
        <Link 
          href="/cart" 
          className="flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
        >
          <ArrowLeft size={20} />
          Return to Cart
        </Link>
      </div>
    </div>
  );
};

export default function OrderFailPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-20 px-4">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium">Checking transaction status...</p>
        </div>
      }>
        <FailContent />
      </Suspense>
    </div>
  );
}