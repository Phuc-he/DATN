'use client';

import { OrderStatus, getOrderStatusDetails } from '@/src/domain/entity/order-status.enum';
import { Order } from '@/src/domain/entity/order.entity';
import { getMyOrdersAction } from '@/src/presentation/action/order.action';
import { useAuth } from '@/src/presentation/hooks/useAuth';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  Package,
  Search,
  ShoppingBag,
  Truck,
  X,
  XCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const details = getOrderStatusDetails(status);

  const getIcon = () => {
    switch (status) {
      case OrderStatus.DELIVERED: return <CheckCircle2 size={14} />;
      case OrderStatus.CANCELLED: return <XCircle size={14} />;
      case OrderStatus.SHIPPED: return <Truck size={14} />;
      case OrderStatus.PAID: return <CheckCircle2 size={14} />;
      case OrderStatus.PROCESSING: return <Clock size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  // Map màu sắc từ helper sang class Tailwind (nếu helper trả về mã màu hex, hãy chỉnh lại ở đây)
  const colorClasses: Record<number, string> = {
    [OrderStatus.UNPROCESSED]: "bg-slate-100 text-slate-600 border-slate-200",
    [OrderStatus.PROCESSING]: "bg-blue-50 text-blue-700 border-blue-100",
    [OrderStatus.PAID]: "bg-emerald-50 text-emerald-700 border-emerald-100",
    [OrderStatus.SHIPPED]: "bg-amber-50 text-amber-700 border-amber-100",
    [OrderStatus.DELIVERED]: "bg-green-50 text-green-700 border-green-100",
    [OrderStatus.CANCELLED]: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${colorClasses[status] || "bg-gray-50"}`}>
      {getIcon()} {details.label}
    </span>
  );
};

export default function OrderHistoryPage() {
  const { currUser, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      // Sử dụng currUser.id (number) theo domain mới
      if (currUser?.id) {
        const result = await getMyOrdersAction(currUser.id);
        if (result.success && result.data) {
          setOrders(result.data);
        }
        setLoading(false);
      }
    }
    if (!authLoading) fetchOrders();
  }, [currUser, authLoading]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      const orderIdMatch = order.id?.toString().includes(searchLower);
      // Tìm kiếm theo tiêu đề sách trong items.book
      const productMatch = order.items.some((item) =>
        item.book.title.toLowerCase().includes(searchLower)
      );
      return orderIdMatch || productMatch;
    });
  }, [orders, searchQuery]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 font-medium">Đang tải lịch sử đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lịch sử đơn hàng</h1>
            <p className="text-slate-500 mt-1">Theo dõi quá trình vận chuyển và quản lý các giao dịch</p>
          </div>

          <div className="relative flex flex-row items-center w-full md:w-80 group">
            <div className="absolute left-4 pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Tìm theo mã đơn hoặc tên sách..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 h-11 pl-11 pr-10 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-sm font-bold text-slate-900 shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </header>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="text-slate-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {searchQuery ? 'Không tìm thấy đơn hàng' : 'Chưa có đơn hàng nào'}
            </h3>
            <p className="text-slate-500 mb-8">
              {searchQuery
                ? `Chúng tôi không tìm thấy kết quả nào cho "${searchQuery}"`
                : "Có vẻ như bạn chưa thực hiện mua sắm lần nào."}
            </p>
            {!searchQuery && (
              <Link href="/shop" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all">
                Đến cửa hàng ngay
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header: ID and Status */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Mã đơn hàng</p>
                        <p className="font-bold text-slate-900">#{order.id}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row justify-between gap-8">
                    {/* Danh sách sản phẩm trong đơn */}
                    <div className="flex-1 space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
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
                            <p className="text-sm text-slate-500 font-medium">
                              Số lượng: {item.quantity} × {item.unitPrice.toLocaleString('vi-VN')}đ
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tổng thanh toán & Nút hành động */}
                    <div className="lg:w-64 bg-slate-50 rounded-2xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-slate-700">Tổng cộng</span>
                          <span className="font-semibold text-slate-900">{order.items.length} sản phẩm</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                          <span className="font-bold text-slate-900">Thành tiền</span>
                          <span className="text-xl font-black text-indigo-600">
                            {order.totalAmount.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/profile/orders/${order.id}`}
                        className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 py-2.5 rounded-xl font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                      >
                        Chi tiết <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}