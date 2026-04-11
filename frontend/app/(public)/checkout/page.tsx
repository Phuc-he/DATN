'use client';

import { BookType } from '@/src/domain/entity/book-type.enum';
import { PaymentMethod, PaymentMethodLabel } from '@/src/domain/entity/payment.method';
import { UserHistoryStatus } from '@/src/domain/entity/user-history-status.enum';
import { createOrderAction, CreateOrderDto } from '@/src/presentation/action/order.action';
import { validateVoucherAction } from '@/src/presentation/action/voucher.action';
import { VietQRModal } from '@/src/presentation/components/public/checkout/VietQRModal';
import { useCart } from '@/src/presentation/context/CartContext';
import { useAuth } from '@/src/presentation/hooks/useAuth';
import { formatCurrency } from '@/src/shared/currency.utils';
import {
  ArrowLeft,
  CreditCard,
  Flame,
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
  const isRestrictedUser = !currUser || currUser.historyStatus === UserHistoryStatus.NEW_USER || currUser.historyStatus === UserHistoryStatus.BOOM_HISTORY;
  const [isSuccess, setIsSuccess] = useState(false);
  const MAX_QTY_FOR_RESTRICTED = 5;       // Limit 5 books
  const MAX_COD_VALUE_FOR_RESTRICTED = 50 * 26000; // Max $50 for COD

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  // 1. Kiểm tra xem giỏ hàng có chứa sách HOT, LIMITED hoặc PRE_ORDER không
  const hasSpecialBook = cart.some(item =>
    item.book.type === BookType.HOT ||
    item.book.type === BookType.LIMITED ||
    item.book.type === BookType.PRE_ORDER
  );

  // Tính phí vận chuyển dựa trên cartTotal (đã trừ voucher hoặc chưa tùy logic nghiệp vụ)
  const shippingPrice = cartTotal > 100 ? 0 : 10;
  const finalTotal = cartTotal + shippingPrice;
  const isTooManyItems = isRestrictedUser && totalQuantity > MAX_QTY_FOR_RESTRICTED;
  const isCodBlocked = hasSpecialBook || (isRestrictedUser && (finalTotal > MAX_COD_VALUE_FOR_RESTRICTED || isTooManyItems));

  const getCodBlockedReason = () => {
    if (hasSpecialBook) return "Giỏ hàng có sách Hot/Giới hạn/Pre-order. Vui lòng thanh toán trước.";
    if (isRestrictedUser && finalTotal > MAX_COD_VALUE_FOR_RESTRICTED) return `Đơn hàng trên ${formatCurrency(MAX_COD_VALUE_FOR_RESTRICTED)} yêu cầu thanh toán trước đối với khách hàng mới.`;
    if (isTooManyItems) return `Khách hàng mới chỉ được mua tối đa ${MAX_QTY_FOR_RESTRICTED} cuốn sách.`;
    return null;
  };
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

  useEffect(() => {
    if (isCodBlocked && paymentMethod === PaymentMethod.COD) {
      setPaymentMethod(PaymentMethod.VNQR);
    }
  }, [isCodBlocked, paymentMethod]);

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

  const handleSubmitOrder = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate rules before submitting
    if (isRestrictedUser && totalQuantity > MAX_QTY_FOR_RESTRICTED) {
      setError(`Khách hàng mới chỉ được mua tối đa ${MAX_QTY_FOR_RESTRICTED} cuốn sách.`);
      return;
    }

    if (isCodBlocked && paymentMethod === PaymentMethod.COD) {
      setError(getCodBlockedReason() || "Vui lòng chọn phương thức thanh toán trước.");
      return;
    }

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
        <p className="text-emerald-900">Giỏ hàng đang trống.</p>
        <Link href="/shop" className="text-indigo-600 font-bold flex items-center gap-2">
          <ArrowLeft size={18} /> Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 pt-8">
        <Link href="/cart" className="flex items-center gap-2 text-emerald-900 hover:text-indigo-600 mb-8 text-sm font-bold uppercase">
          <ArrowLeft size={16} /> Quay lại giỏ hàng
        </Link>

        {hasSpecialBook && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <Flame size={20} />
            </div>
            <div>
              <p className="text-emerald-800 text-sm font-bold">Lưu ý đơn hàng đặc biệt</p>
              <p className="text-emerald-700 text-xs mt-1">
                Giỏ hàng của bạn chứa sách <b>Hot / Giới hạn / Pre-order</b>. Theo chính sách, loại hàng này cần được thanh toán trước để giữ chỗ.
              </p>
            </div>
          </div>
        )}

        {isRestrictedUser && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <PackageCheck size={20} />
            </div>
            <div>
              <p className="text-emerald-800 text-sm font-bold">Mua hàng không cần đăng nhập</p>
              <p className="text-emerald-700 text-xs mt-1">
                Bạn đang mua hàng với tư cách <b>Khách</b>. Giới hạn tối đa {MAX_QTY_FOR_RESTRICTED} sản phẩm và COD dưới {formatCurrency(MAX_COD_VALUE_FOR_RESTRICTED)}.
              </p>
            </div>
          </div>
        )}

        {/* Banner ưu đãi: Hiện cho khách có lịch sử tốt */}
        {currUser?.historyStatus === UserHistoryStatus.GOOD_HISTORY && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <TicketPercent size={20} />
            </div>
            <div>
              <p className="text-emerald-800 text-sm font-bold">Khách hàng thân thiết</p>
              <p className="text-emerald-700 text-xs mt-1">
                Chào mừng bạn trở lại! Bạn có thể đặt hàng COD với hạn mức cao và không giới hạn số lượng sản phẩm.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cột trái: Thông tin nhận hàng */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-950 mb-6 flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><MapPin size={20} /></div>
                Thông tin giao hàng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="fullName" required placeholder="Họ và tên" defaultValue={currUser?.fullName || ''} className="w-full p-4 bg-emerald-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                <input name="phone" required placeholder="Số điện thoại" defaultValue={currUser?.phone || ''} className="w-full p-4 bg-emerald-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                <div className="md:col-span-2">
                  <input name="address" required placeholder="Địa chỉ chi tiết" defaultValue={currUser?.address || ''} className="w-full p-4 bg-emerald-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <input name="city" required placeholder="Tỉnh/Thành phố" className="w-full p-4 bg-emerald-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                <input name="zipCode" placeholder="Mã bưu điện (tùy chọn)" className="w-full p-4 bg-emerald-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </section>

            {/* Cột trái: Phương thức thanh toán */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-950 mb-6 flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><CreditCard size={20} /></div>
                Phương thức thanh toán
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.values(PaymentMethod).map((methodId) => {
                  const isDisabled = isRestrictedUser && methodId === PaymentMethod.COD && finalTotal > MAX_COD_VALUE_FOR_RESTRICTED;

                  return (
                    <label key={methodId} className={`p-4 border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between 
                      ${paymentMethod === methodId ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-emerald-50'}
                      ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === methodId ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                          {paymentMethod === methodId && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className={`font-bold ${paymentMethod === methodId ? 'text-indigo-700' : 'text-slate-600'}`}>{PaymentMethodLabel[methodId]}</span>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        className="hidden"
                        value={methodId}
                        disabled={isDisabled}
                        onChange={() => setPaymentMethod(methodId as PaymentMethod)}
                        checked={paymentMethod === methodId}
                      />
                    </label>
                  )
                })}
              </div>
              {isCodBlocked && (
                <p className="mt-3 text-xs text-red-500 font-medium flex items-center gap-1 italic">
                  * {getCodBlockedReason()}
                </p>
              )}
            </section>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 sticky top-8">
              <h2 className="text-xl font-black text-slate-950 mb-6">Tóm tắt đơn hàng</h2>

              <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.book.id} className="flex gap-4 items-center">
                    <div className="relative h-16 w-12 flex-shrink-0 rounded-lg overflow-hidden border">
                      <Image src={item.book.imageUrl || '/placeholder-book.png'} alt={item.book.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="font-bold text-slate-950 text-sm truncate">{item.book.title}</p>
                        {item.book.type !== BookType.NORMAL && (
                          <Flame size={12} className="text-emerald-900" />
                        )}
                      </div>
                      <p className="text-xs text-emerald-900">Số lượng: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-slate-950 text-sm">
                      {formatCurrency((item.unitPrice * (1 - (item.discount || 0) / 100)) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Voucher Section giữ nguyên */}
              <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-dashed border-slate-200">
                {!appliedVoucher ? (
                  <div className="flex gap-2">
                    <input value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} placeholder="Mã giảm giá" className="flex-1 px-4 py-2 bg-white border rounded-xl text-sm outline-none" />
                    <button type="button" onClick={handleApplyVoucher} disabled={isLoading || !voucherCode} className="px-6 py-2 bg-slate-950 text-white rounded-xl text-sm font-bold disabled:bg-slate-300">
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

              <div className="space-y-4 border-t border-slate-100 pt-6 mt-6">
                <div className="flex justify-between text-emerald-900">
                  <span>Tạm tính</span>
                  <span className="text-slate-950 font-bold">{formatCurrency(cartTotal)}</span>
                </div>
                {appliedVoucher && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span><Tag className="inline mr-1" size={14} /> Giảm giá voucher</span>
                    <span>-{formatCurrency(voucherDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-900">
                  <span>Phí vận chuyển</span>
                  <span>{shippingPrice === 0 ? 'MIỄN PHÍ' : formatCurrency(shippingPrice)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-lg font-black text-slate-950">Tổng cộng</span>
                  <span className="text-2xl font-black text-indigo-600">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <button disabled={isSubmitting} className="w-full bg-slate-950 text-white py-5 rounded-2xl font-bold mt-8 flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all active:scale-95 disabled:bg-slate-300">
                {isSubmitting ? <span className="animate-pulse">Đang xử lý...</span> : <><PackageCheck size={22} /> Đặt hàng ngay</>}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal VietQR */}
      {isVnQr && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
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
