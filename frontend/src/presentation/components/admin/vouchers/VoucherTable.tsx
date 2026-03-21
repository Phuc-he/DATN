'use client';

import { DiscountType } from '@/src/domain/entity/discount-type.enum';
import { Voucher } from '@/src/domain/entity/voucher.entity';
import { AlertTriangle, Calendar, CheckCircle, Edit, Ticket, Trash2, Users, XCircle } from 'lucide-react';
import React from 'react';

interface VoucherTableProps {
  vouchers: Voucher[];
  onEdit: (voucher: Voucher) => void;
  onDelete: (id: number) => void;
}

const VoucherTable: React.FC<VoucherTableProps> = ({ vouchers, onEdit, onDelete }) => {
  // Helper to check expiration against the ISO string
  const isExpired = (dateStr: string) => new Date(dateStr) < new Date();

  return (
    <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Voucher Code</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Discount</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Usage</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Validity Period</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {vouchers.map((voucher) => {
            const expired = isExpired(voucher.expirationDate);
            const isFullyUsed = (voucher.usedCount || 0) >= voucher.maxUses;
            const usagePercent = Math.min(((voucher.usedCount || 0) / voucher.maxUses) * 100, 100);

            return (
              <tr key={voucher.id} className="hover:bg-slate-50 transition-colors">
                {/* Code */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${expired ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                      <Ticket size={20} />
                    </div>
                    <span className={`text-sm font-black font-mono tracking-wider ${expired ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {voucher.code}
                    </span>
                  </div>
                </td>

                {/* Discount Value */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-slate-900">
                    {voucher.discountType === DiscountType.PERCENTAGE
                      ? `${voucher.discountValue}%`
                      : `$${voucher.discountValue.toLocaleString()}`}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">
                    Min: ${voucher.minOrderValue?.toLocaleString() || '0'}
                  </div>
                </td>

                {/* Usage Progress */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                      <Users size={12} className="text-slate-400" />
                      {voucher.usedCount} <span className="text-slate-300 font-normal">/</span> {voucher.maxUses}
                    </div>
                    {isFullyUsed && <AlertTriangle size={12} className="text-orange-500" />}
                  </div>
                  <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isFullyUsed ? 'bg-orange-500' : usagePercent > 80 ? 'bg-amber-400' : 'bg-blue-500'
                        }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </td>

                {/* Validity Dates */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Calendar size={12} className="text-slate-300" />
                      <span>{new Date(voucher.startDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold ${expired ? 'text-red-400' : 'text-slate-600'}`}>
                      <Calendar size={12} />
                      <span>{new Date(voucher.expirationDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {voucher.isActive && !expired && !isFullyUsed ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-green-100 text-green-700 border border-green-200">
                      <CheckCircle size={10} /> ACTIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-500 border border-slate-200">
                      <XCircle size={10} />
                      {expired ? 'EXPIRED' : isFullyUsed ? 'MAXED OUT' : 'INACTIVE'}
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(voucher)}
                    className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-all active:scale-90 mr-1"
                    title="Edit Voucher"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => voucher.id && onDelete(voucher.id)}
                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                    disabled={!voucher.id}
                    title="Delete Voucher"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
          {vouchers.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic text-sm">
                No vouchers found in the system.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherTable;