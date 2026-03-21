'use client';

import { calculateItemSubtotal } from '@/src/domain/entity/order-item.entity';
import { OrderStatus } from '@/src/domain/entity/order-status.enum';
import { Order } from '@/src/domain/entity/order.entity';
import { Hash, MapPin, Package, Phone, RefreshCw, Truck, User, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus?: (id: number, status: OrderStatus) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  order,
  onUpdateStatus
}) => {
  if (!isOpen || !order) return null;

  // Helper to determine status colors
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED: return 'bg-green-100 text-green-700 border-green-200';
      case OrderStatus.PROCESSING: return 'bg-blue-100 text-blue-700 border-blue-200';
      case OrderStatus.CANCELLED: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-900">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Order Details <span className="text-slate-400 text-sm font-normal">#{order.id}</span>
            </h2>
            <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)}`}>
              {order.status}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          
          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customer Info */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-2 text-blue-600 mb-3 font-bold text-xs uppercase tracking-wider">
                <User size={14} /> Recipient
              </div>
              <p className="text-sm font-bold text-slate-900">{order.fullName}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                <Phone size={12} /> {order.phone}
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-500 mt-1">
                <MapPin size={12} className="mt-0.5" /> 
                <span className="leading-relaxed">{order.address}</span>
              </div>
            </div>

            {/* Account Info */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-2 text-purple-600 mb-3 font-bold text-xs uppercase tracking-wider">
                <Hash size={14} /> Account
              </div>
              <p className="text-xs text-slate-500">Username:</p>
              <p className="text-sm font-medium">{order.user.username}</p>
              <p className="text-xs text-slate-500 mt-2">Email:</p>
              <p className="text-sm font-medium truncate">{order.user.email}</p>
            </div>

            {/* Order Meta */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-2 text-orange-600 mb-3 font-bold text-xs uppercase tracking-wider">
                <Truck size={14} /> Logistics
              </div>
              <p className="text-xs text-slate-500">Cart Reference:</p>
              <p className="text-sm font-mono text-slate-600">{order.cartId || 'N/A'}</p>
              
              {onUpdateStatus && order.status !== OrderStatus.DELIVERED && (
                <button 
                  onClick={() => onUpdateStatus(order.id!, OrderStatus.PROCESSING)}
                  className="mt-3 text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <RefreshCw size={10} /> Move to Shipping
                </button>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Package size={18} className="text-slate-400" /> Items Summary ({order.items.length})
            </h3>
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Product</th>
                    <th className="px-4 py-3 font-bold text-slate-500 text-center uppercase text-[10px]">Qty</th>
                    <th className="px-4 py-3 font-bold text-slate-500 text-right uppercase text-[10px]">Unit Price</th>
                    <th className="px-4 py-3 font-bold text-slate-500 text-right uppercase text-[10px]">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 flex items-center gap-3">
                        <div className="relative h-12 w-10 flex-shrink-0">
                          {/* Accessing book thumbnail - update path if different */}
                          <Image 
                            src={item.book.imageUrl || '/placeholder-book.png'} 
                            alt={item.book.title} 
                            fill 
                            className="object-cover rounded shadow-sm" 
                          />
                        </div>
                        <div>
                           <p className="font-bold text-slate-800 line-clamp-1">{item.book.title}</p>
                           <p className="text-[10px] text-slate-400 font-medium">SKU: {item.book.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-slate-600">x{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {item.discount > 0 && (
                           <span className="text-[10px] line-through text-slate-300 mr-2">
                             {item.unitPrice.toLocaleString()}
                           </span>
                        )}
                        {(item.unitPrice - item.discount).toLocaleString()} VND
                      </td>
                      <td className="px-4 py-3 text-right font-black text-slate-900">
                        {calculateItemSubtotal(item).toLocaleString()} VND
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Totals */}
          <div className="flex justify-end pt-4">
            <div className="w-full md:w-72 p-4 bg-slate-50 rounded-2xl space-y-3">
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Items Subtotal:</span>
                <span>{order.totalAmount.toLocaleString()} VND</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Shipping Fee:</span>
                <span className="text-slate-400 italic font-normal text-[10px]">Calculated at checkout</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-900">Total Amount:</span>
                <span className="text-xl font-black text-blue-600">{order.totalAmount.toLocaleString()} VND</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-black shadow-lg transition-all active:scale-95"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;