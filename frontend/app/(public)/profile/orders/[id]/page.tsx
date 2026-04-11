'use client';

import { OrderStatus, getOrderStatusDetails } from '@/src/domain/entity/order-status.enum';
import { Order } from '@/src/domain/entity/order.entity';
// Assuming you have a cancelOrderAction or updateOrderStatusAction
import { getOrderByIdAction, updateOrderStatusAction } from '@/src/presentation/action/order.action';
import { VietQRModal } from '@/src/presentation/components/public/checkout/VietQRModal';
import {
  ArrowLeft, // Added for the cancel button icon
  BookOpen,
  CheckCircle2,
  Clock,
  Loader2,
  Package,
  Trash2,
  XCircle
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false); // State for button loading

  // 1. Fetch Order Data
  useEffect(() => {
    async function fetchOrder() {
      if (id) {
        const result = await getOrderByIdAction(Number(id));
        if (result.success && result.data) {
          setOrder(result.data);
        }
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  // 2. WebSocket Logic for payment success
  useEffect(() => {
    if (order && (order.status === OrderStatus.UNPROCESSED || order.status === OrderStatus.PROCESSING)) {
      const socket = new WebSocket('ws://localhost:8080/payment-status');
      socket.onopen = () => socket.send(`joinOrderRoom:${order.id}`);
      socket.onmessage = (event) => {
        if (event.data === "PAYMENT_SUCCESS") {
          window.location.reload(); 
        }
      };
      return () => socket.close();
    }
  }, [order]);

  // 3. Handle Cancel Order
  const handleCancelOrder = async () => {
    if (!order?.id) return;
    const confirmCancel = confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");
    if (!confirmCancel) return;
    setIsCancelling(true);
    try {
      const result = await updateOrderStatusAction(order.id, OrderStatus.CANCELLED);
      if (result.success) {
        setOrder({ ...order, status: OrderStatus.CANCELLED });
        alert("Đơn hàng đã được hủy thành công.");
      } else {
        alert(result.message || "Không thể hủy đơn hàng.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Đã xảy ra lỗi khi hủy đơn hàng.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  if (!order) return <div className="text-center py-20">Không tìm thấy đơn hàng</div>;

  const statusInfo = getOrderStatusDetails(order.status);
  const needsPayment = order.status === OrderStatus.UNPROCESSED || order.status === OrderStatus.PROCESSING;
  const canCancel = order.status === OrderStatus.UNPROCESSED || order.status === OrderStatus.PROCESSING;
  const qrUrl = `https://img.vietqr.io/image/vcb-123456789-compact2.png?amount=${order.totalAmount}&addInfo=DH${order.id}`;

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Quay lại đơn hàng của tôi
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {needsPayment && (
              <VietQRModal qrUrl={qrUrl} amount={order.totalAmount} orderId={order.id?.toString() || ""} />
            )}

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 mb-1">Chi tiết đơn hàng</h1>
                  <p className="text-slate-400 font-medium text-sm">Mã đơn: <span className="text-slate-900 font-bold">#{order.id}</span></p>
                </div>
                <div className={`px-4 py-2 rounded-2xl border font-black text-xs uppercase tracking-widest flex items-center gap-2 
                  ${order.status === OrderStatus.PAID || order.status === OrderStatus.DELIVERED ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                    order.status === OrderStatus.CANCELLED ? 'bg-red-50 border-red-100 text-red-600' :
                      'bg-amber-50 border-amber-100 text-amber-600'}`}>
                  {order.status === OrderStatus.PAID || order.status === OrderStatus.DELIVERED ? <CheckCircle2 size={16} /> :
                    order.status === OrderStatus.CANCELLED ? <XCircle size={16} /> : <Clock size={16} />}
                  {statusInfo.label}
                </div>
              </div>

              {/* --- ITEMS SECTION --- */}
              <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Package size={20} className="text-indigo-600" />
                  Sản phẩm đã đặt ({order.items.length})
                </h3>
                <div className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-4 flex items-center gap-4 first:pt-0 last:pb-0">
                      {/* Book Thumbnail */}
                      <div className="relative h-20 w-16 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0">
                        {item.book?.imageUrl ? (
                          <Image
                            src={item.book.imageUrl}
                            alt={item.book.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-slate-50 flex items-center justify-center text-slate-300">
                            <BookOpen size={24} />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">
                          {item.book?.title || "Sản phẩm không xác định"}
                        </p>
                        <p className="text-sm text-slate-500 font-medium">
                          Số lượng: {item.quantity}
                        </p>
                      </div>

                      {/* Pricing */}
                      <div className="text-right">
                        <p className="font-black text-slate-900">
                          {(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.unitPrice.toLocaleString('vi-VN')}đ / cuốn
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
             {/* ... Right column (Total & Actions) keeps here */}
             <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-6">Tổng kết đơn hàng</h3>
              <div className="flex justify-between font-bold">
                <span>Tổng thanh toán</span>
                <span className="text-2xl text-white">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-4 text-sm uppercase tracking-widest">Thao tác</h3>
              {canCancel ? (
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 hover:bg-red-100 disabled:bg-slate-100 font-bold rounded-2xl"
                >
                  {isCancelling ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                  Hủy đơn hàng
                </button>
              ) : (
                <p className="text-slate-400 text-xs text-center italic">Không thể hủy đơn lúc này.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}