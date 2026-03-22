'use client';

import { OrderStatus, getOrderStatusDetails } from '@/src/domain/entity/order-status.enum';
import { Order } from '@/src/domain/entity/order.entity';
import { getOrderByIdAction } from '@/src/presentation/action/order.action';
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  Phone,
  Truck,
  User as UserIcon,
  XCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (id) {
        // Chuyển đổi id sang number vì entity mới dùng kiểu Long/number
        const result = await getOrderByIdAction(Number(id));
        if (result.success && result.data) {
          setOrder(result.data);
        }
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4 bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen px-4 text-center">
        <AlertCircle size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-black text-slate-900">Không tìm thấy đơn hàng</h1>
        <p className="text-slate-500 mb-6">Chúng tôi không tìm thấy thông tin cho mã đơn: {id}</p>
        <Link href="/profile/orders" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const statusInfo = getOrderStatusDetails(order.status);

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Quay lại đơn hàng của tôi
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cột trái: Thông tin đơn hàng & Sản phẩm */}
          <div className="lg:col-span-2 space-y-6">

            {/* Thẻ trạng thái */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 mb-1">Chi tiết đơn hàng</h1>
                  <p className="text-slate-400 font-medium text-sm">Mã đơn: <span className="text-slate-900 font-bold">#{order.id}</span></p>
                </div>
                <div className={`px-4 py-2 rounded-2xl border font-black text-xs uppercase tracking-widest flex items-center gap-2 
                  ${order.status === OrderStatus.DELIVERED ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                    order.status === OrderStatus.CANCELLED ? 'bg-red-50 border-red-100 text-red-600' :
                      'bg-amber-50 border-amber-100 text-amber-600'}`}>
                  {order.status === OrderStatus.DELIVERED ? <CheckCircle2 size={16} /> :
                    order.status === OrderStatus.CANCELLED ? <XCircle size={16} /> : <Clock size={16} />}
                  {statusInfo.label}
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Package size={20} className="text-indigo-600" />
                  Sản phẩm đã đặt ({order.items.length})
                </h3>
                <div className="divide-y divide-slate-50">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-4 flex items-center gap-4 first:pt-0 last:pb-0">
                      <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                        {item.book.imageUrl ? (
                          <Image
                            className="rounded border border-slate-100 object-cover"
                            src={item.book.imageUrl}
                            alt={item.book.title}
                            fill
                          />
                        ) : (
                          <div className="h-full w-full rounded bg-slate-100 flex items-center justify-center text-slate-400">
                            <BookOpen size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 line-clamp-1">{item.book.title}</p>
                        <p className="text-sm text-slate-500 font-medium">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900">{(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ</p>
                        <p className="text-xs text-slate-400">{item.unitPrice.toLocaleString('vi-VN')}đ / cuốn</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Thông tin giao hàng */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <Truck size={20} className="text-indigo-600" />
                Thông tin nhận hàng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <UserIcon size={18} className="text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Người nhận</p>
                      <p className="font-bold text-slate-900">{order.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Số điện thoại</p>
                      <p className="font-bold text-slate-900">{order.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Địa chỉ</p>
                    <p className="font-bold text-slate-900 leading-relaxed">{order.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Tổng kết & Thanh toán */}
          <div className="space-y-6">

            {/* Tổng kết tiền */}
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-lg shadow-indigo-200">
              <h3 className="text-lg font-bold mb-6">Tổng kết đơn hàng</h3>
              <div className="space-y-4 text-indigo-100">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="text-white font-bold">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="text-white font-bold">0đ</span>
                </div>
                <div className="pt-4 border-t border-indigo-500 mt-4 flex justify-between items-end">
                  <span className="text-sm uppercase tracking-wider font-bold">Tổng thanh toán</span>
                  <span className="text-3xl font-black text-white leading-none">
                    {order.totalAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>

            {/* Thông tin thanh toán */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
                Thanh toán
              </h3>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Phương thức</p>
                  <p className="font-bold text-slate-900">VNPay / QR Code</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-slate-500 font-medium">Ngày đặt:</span>
                  <span className="text-slate-900 font-bold">
                    {/* Giả sử bạn có trường createdAt từ backend */}
                    {new Date().toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>

              {/* Nút hủy đơn hàng nếu chưa xử lý */}
              {order.status === OrderStatus.UNPROCESSED && (
                <button className="w-full mt-6 py-3 rounded-2xl border-2 border-red-100 text-red-600 font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                  <XCircle size={18} /> Hủy đơn hàng
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}