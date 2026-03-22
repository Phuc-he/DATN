'use client';

import { PaymentMethod, PaymentMethodLabel } from '@/src/domain/entity/payment.method';
import { createOrderAction, CreateOrderDto } from '@/src/presentation/action/order.action';
import { validateVoucherAction } from '@/src/presentation/action/voucher.action';
import { VietQRModal } from '@/src/presentation/components/public/checkout/VietQRModal';
import { useCart } from '@/src/presentation/context/CartContext';
import { useAuth } from '@/src/presentation/hooks/useAuth';
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  PackageCheck,
  Tag, TicketPercent, X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.COD);
  const [voucherCode, setVoucherCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVnQr, setIsVnQr] = useState<{ qrUrl: string; description: string; amount: number; orderId: string } | null>(null);

  const { appliedVoucher, applyVoucher, removeVoucher, cart, cartTotal, voucherDiscount, clearCart } = useCart();
  const router = useRouter();
  const { currUser } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  // Tính phí vận chuyển dựa trên cartTotal (đã trừ voucher hoặc chưa tùy logic nghiệp vụ)
  const shippingPrice = cartTotal > 100 ? 0 : 10;
  const finalTotal = cartTotal + shippingPrice;

  // Xử lý Socket.io cho thanh toán QR
  useEffect(() => {
    if (isVnQr) {
      // 1. Sử dụng Native WebSocket (ws:// thay vì http://)
      const socket = new WebSocket('ws://localhost:8080/payment-status');

      socket.onopen = () => {
        console.log("✅ WebSocket connected");
        // Gửi đúng định dạng mà Backend PaymentWebSocketHandler mong đợi
        socket.send(`joinOrderRoom:${isVnQr.orderId}`);
      };

      socket.onmessage = (event) => {
        const message = event.data;
        console.log("📩 Received from server:", message);

        // Khớp với chuỗi "PAYMENT_SUCCESS" mà Backend gửi trong notifyPaymentSuccess
        if (message === "PAYMENT_SUCCESS") {
          console.log("🎉 Payment Success! Redirecting...");
          router.push(`/checkout/order-success?id=${isVnQr.orderId}`);
        }
      };

      socket.onerror = (error) => {
        console.error("❌ WebSocket Error:", error);
      };

      socket.onclose = () => {
        console.log("🔌 WebSocket disconnected");
      };

      return () => {
        socket.close();
      };
    }
  }, [isVnQr, router]);

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setError('');
    setIsLoading(true);

    try {
      const result = await validateVoucherAction(voucherCode, cartTotal);
      if (result.success) {
        applyVoucher(result.voucher);
        setVoucherCode('');
      } else {
        setError(result.message || "Mã không hợp lệ");
      }
    } catch (err) {
      console.error("check out", err);
      setError("Lỗi kết nối máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Chuẩn bị payload khớp với CreateOrderDto đã update
      const orderPayload: CreateOrderDto = {
        user: { id: Number(currUser?.id) || 0 }, // Giả định currUser.id là number
        fullName: formData.get('fullName') as string,
        phone: formData.get('phone') as string,
        address: `${formData.get('address')}, ${formData.get('city')}`,
        voucher: appliedVoucher,
        items: cart, // Đã khớp với CartContext.cart (OrderItem[])
        paymentMethod: paymentMethod,
        totalAmount: finalTotal,
      };

      // 2. Gọi Server Action
      const result = await createOrderAction(orderPayload);

      if (result.success) {
        setIsSuccess(true);
        clearCart();
        removeVoucher();

        if (paymentMethod === PaymentMethod.VNQR && result.qrData) {
          setIsVnQr(result.qrData);
        } else {
          router.push(`/checkout/order-success?id=${result.orderId}`);
        }
        return;
      }

      setError(result.message || "Đặt hàng thất bại.");
    } catch (err) {
      console.error("check out", err);
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-slate-500">Giỏ hàng đang trống.</p>
        <Link href="/shop" className="text-indigo-600 font-bold flex items-center gap-2">
          <ArrowLeft size={18} /> Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 pt-8">
        <Link href="/cart" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 text-sm font-bold uppercase">
          <ArrowLeft size={16} /> Quay lại giỏ hàng
        </Link>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cột trái: Thông tin nhận hàng */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><MapPin size={20} /></div>
                Thông tin giao hàng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="fullName" required placeholder="Họ và tên" defaultValue={currUser?.fullName} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                <input name="phone" required placeholder="Số điện thoại" defaultValue={currUser?.phone} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                <div className="md:col-span-2">
                  <input name="address" required placeholder="Địa chỉ chi tiết" defaultValue={currUser?.address} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <input name="city" required placeholder="Tỉnh/Thành phố" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                <input name="zipCode" placeholder="Mã bưu điện (tùy chọn)" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </section>

            {/* Cột trái: Phương thức thanh toán */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><CreditCard size={20} /></div>
                Phương thức thanh toán
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.values(PaymentMethod).map((methodId) => (
                  <label key={methodId} className={`p-4 border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${paymentMethod === methodId ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-slate-50/30'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === methodId ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                        {paymentMethod === methodId && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className={`font-bold ${paymentMethod === methodId ? 'text-indigo-700' : 'text-slate-600'}`}>{PaymentMethodLabel[methodId]}</span>
                    </div>
                    <input type="radio" name="payment" className="hidden" value={methodId} onChange={() => setPaymentMethod(methodId as PaymentMethod)} checked={paymentMethod === methodId} />
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 sticky top-8">
              <h2 className="text-xl font-black text-slate-900 mb-6">Tóm tắt đơn hàng</h2>

              {/* Danh sách sản phẩm rút gọn */}
              <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.book.id} className="flex gap-4 items-center">
                    <div className="relative h-16 w-12 flex-shrink-0 rounded-lg overflow-hidden border">
                      <Image src={item.book.imageUrl || '/placeholder-book.png'} alt={item.book.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{item.book.title}</p>
                      <p className="text-xs text-slate-500">Số lượng: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">
                      ${((item.unitPrice * (1 - (item.discount || 0) / 100)) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Voucher Section */}
              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                {!appliedVoucher ? (
                  <div className="flex gap-2">
                    <input value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} placeholder="Mã giảm giá" className="flex-1 px-4 py-2 bg-white border rounded-xl text-sm outline-none" />
                    <button type="button" onClick={handleApplyVoucher} disabled={isLoading || !voucherCode} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold disabled:bg-slate-300">
                      {isLoading ? '...' : 'Áp dụng'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-50 px-4 py-2 rounded-xl text-emerald-700">
                    <span className="font-bold text-sm"><TicketPercent className="inline mr-2" size={18} /> {appliedVoucher.code} đã áp dụng!</span>
                    <button onClick={removeVoucher}><X size={18} /></button>
                  </div>
                )}
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              </div>

              {/* Tiền tính toán */}
              <div className="space-y-4 border-t border-slate-100 pt-6 mt-6">
                <div className="flex justify-between text-slate-500">
                  <span>Tạm tính</span>
                  <span className="text-slate-900 font-bold">${cartTotal.toLocaleString()}</span>
                </div>
                {appliedVoucher && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span><Tag className="inline mr-1" size={14} /> Giảm giá voucher</span>
                    <span>-${voucherDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Phí vận chuyển</span>
                  <span>{shippingPrice === 0 ? 'MIỄN PHÍ' : `$${shippingPrice}`}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-lg font-black text-slate-900">Tổng cộng</span>
                  <span className="text-3xl font-black text-indigo-600">${finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button disabled={isSubmitting} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold mt-8 flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all active:scale-95 disabled:bg-slate-300">
                {isSubmitting ? <span className="animate-pulse">Đang xử lý...</span> : <><PackageCheck size={22} /> Đặt hàng ngay</>}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal VietQR */}
      {isVnQr && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md">
            <button onClick={() => router.push(`/checkout/order-success?id=${isVnQr.orderId}`)} className="absolute -top-12 right-0 text-white hover:text-indigo-200 flex items-center gap-2 font-bold text-sm">
              Xem đơn hàng <X size={20} />
            </button>
            <VietQRModal qrUrl={isVnQr.qrUrl} amount={isVnQr.amount} orderId={isVnQr.orderId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;