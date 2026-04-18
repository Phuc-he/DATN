'use client';

import { Order } from '@/src/domain/entity/order.entity';
import { OrderStatus, getOrderStatusDetails } from '@/src/domain/entity/order-status.enum';
import { BookOpen, Calendar, Eye, Package, User } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface OrderTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onUpdateStatus?: (id: number, status: OrderStatus) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onViewDetails }) => {
  return (
    <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-emerald-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Thông tin đơn hàng</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Khách hàng</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Sản phẩm</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Tổng cộng</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Trạng thái</th>
            <th className="px-6 py-4 text-right text-xs font-bold text-emerald-800 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {orders.map((order) => {
            const statusDetail = getOrderStatusDetails(order.status);

            return (
              <tr key={order.id} className="hover:bg-emerald-50 transition-colors text-slate-950">
                {/* Order ID & Placeholder Date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-black text-emerald-600 font-mono">
                    #{order.id?.toString().padStart(6, '0')}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 uppercase font-bold">
                    <Calendar size={12} />
                    {/* Assuming id reflects order sequence, or use a date field if added to entity */}
                    MÃ THAM CHIẾU: {order.cartId || 'TRỰC TIẾP'}
                  </div>
                </td>

                {/* Customer Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-emerald-800">
                      <User size={14} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-950">{order.fullName}</div>
                      <div className="text-[10px] text-emerald-800">{order.phone}</div>
                    </div>
                  </div>
                </td>

                {/* Items Summary - Visual Stacking */}
                <td className="px-6 py-4">
                  <div className="flex -space-x-2 overflow-hidden mb-1">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="inline-block h-8 w-8 rounded-lg ring-2 ring-white bg-white overflow-hidden border border-slate-100 shadow-sm">
                        {item.book.imageUrl ? (
                          <Image
                            className="rounded border border-slate-100 object-cover"
                            src={item.book.imageUrl}
                            alt={item.book.title}
                            width={64}
                            height={64}
                          />
                        ) : (
                          <div className="h-full w-full rounded bg-slate-100 flex items-center justify-center text-slate-400">
                            <BookOpen size={20} />
                          </div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-black text-slate-600 ring-2 ring-white border border-slate-100">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Package size={10} /> {order.items.reduce((acc, curr) => acc + curr.quantity, 0)} Sản phẩm
                  </div>
                </td>

                {/* Price */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-black text-slate-950">
                    {order.totalAmount.toLocaleString()} <span className="text-[10px] font-medium text-emerald-800">VNĐ</span>
                  </div>
                  <div className="text-[10px] text-slate-400 italic">Đã bao gồm thuế & phí</div>
                </td>

                {/* Delivery Status using Entity Helper */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black text-white shadow-sm ${statusDetail.color}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                    {statusDetail.label.toUpperCase()}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(order)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md active:scale-95"
                  >
                    <Eye size={14} />
                    XEM CHI TIẾT
                  </button>
                </td>
              </tr>
            );
          })}
          {orders.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic text-sm">
                Không tìm thấy đơn hàng nào trong hệ thống.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
