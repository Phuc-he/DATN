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

// We wrap the content in a component to use useSearchParams safely with Suspense
const SuccessContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Success Icon */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-200 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <CheckCircle2 size={100} className="text-emerald-900 relative z-10" />
        </div>
      </div>

      {/* Main Message */}
      <h1 className="text-4xl font-black text-slate-950 mb-4 tracking-tight">
        Order Confirmed!
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Thank you for your purchase. Your stories are being prepared for their new home.
      </p>

      {/* Order Info Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-6 border-b border-emerald-50">
          <div className="text-left">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Number</p>
            <p className="text-lg font-mono font-bold text-slate-950">#{orderId || 'N/A'}</p>
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-4 py-1 rounded-full text-sm font-bold">
            Processing
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="flex items-start gap-3">
            <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
              <Mail size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-950 text-sm">Email Confirmation</p>
              <p className="text-xs text-emerald-900">Sent to your registered email.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
              <Truck size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-950 text-sm">Estimated Delivery</p>
              <p className="text-xs text-emerald-900">3-5 Business Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/shop"
          className="flex items-center justify-center gap-2 bg-slate-950 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
        >
          <ShoppingBag size={20} />
          Continue Shopping
        </Link>
        <Link
          href="/profile/orders"
          className="flex items-center justify-center gap-2 bg-white text-slate-950 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all active:scale-95"
        >
          View My Orders
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};

// The main page component
export default function Page() {
  return (
    <div className="bg-emerald-50 min-h-screen py-20 px-4">
      {/* Suspense is required when using useSearchParams in App Router */}
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-emerald-900 font-medium">Finalizing your order details...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
