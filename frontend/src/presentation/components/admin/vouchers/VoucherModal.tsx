'use client';

import { DiscountType } from '@/src/domain/entity/discount-type.enum';
import { Voucher } from '@/src/domain/entity/voucher.entity';
import { Calendar, Percent, RefreshCw, Ticket, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (voucher: Voucher) => void;
  initialData?: Voucher | null;
}

const VoucherModal: React.FC<VoucherModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Voucher>>({
    code: '',
    discountType: DiscountType.PERCENTAGE,
    discountValue: 0,
    minOrderValue: 0,
    maxUses: 100,
    usedCount: 0,
    startDate: new Date().toISOString(),
    expirationDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    isActive: true,
  });

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({ ...initialData });
    } else {
      setFormData({
        code: '',
        discountType: DiscountType.PERCENTAGE,
        discountValue: 0,
        minOrderValue: 0,
        maxUses: 100,
        usedCount: 0,
        startDate: new Date().toISOString(),
        expirationDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        isActive: true,
      });
    }
  }, [initialData, isOpen]);

  const generateRandomCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setFormData({ ...formData, code });
  };

  const formatDateForInput = (isoString: string | undefined) => {
    if (!isoString) return '';
    return isoString.split('T')[0];
  };

  const handleDateChange = (field: 'startDate' | 'expirationDate', value: string) => {
    if (!value) return;
    const isoDate = new Date(value).toISOString();
    setFormData({ ...formData, [field]: isoDate });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // FIXED: Strict numeric parsing to prevent "invalid int32: NaN"
    const voucherData = {
      ...formData,
      discountType: parseInt((formData.discountType ?? "0").toString(), 10),
      discountValue: parseFloat((formData.discountValue ?? "0").toString()),
      maxUses: parseInt((formData.maxUses ?? "0").toString(), 10),
      minOrderValue: parseFloat((formData.minOrderValue ?? "0").toString()),
    } as Voucher;

    // Safety validation before Protobuf encoding
    if (isNaN(voucherData.discountType)) {
      alert("Please select a valid Discount Type");
      return;
    }

    if (isNaN(voucherData.discountValue)) {
      alert("Please enter a valid discount value");
      return;
    }

    onSave(voucherData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-900">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Ticket className="text-blue-600" size={20} />
            <h2 className="text-xl font-bold text-slate-800">
              {initialData ? 'Edit Voucher' : 'Create New Voucher'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Code */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Voucher Code</label>
            <div className="flex gap-2">
              <input
                required
                type="text"
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono uppercase"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              />
              <button
                type="button"
                onClick={generateRandomCode}
                className="px-3 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Type</label>
              <select
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                // formData.discountType is a number (0 or 1)
                value={formData.discountType}
                onChange={(e) => {
                  // 1. Convert the string "0"/"1" from the DOM to a real number
                  const numericValue = parseInt(e.target.value, 10);

                  // 2. Update state while casting the number to the Enum type
                  setFormData({
                    ...formData,
                    discountType: numericValue as DiscountType
                  });
                }}
              >
                <option value={DiscountType.PERCENTAGE}>Percentage (%)</option>
                <option value={DiscountType.FIXED}>Fixed Amount (VND)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Value</label>
              <div className="relative">
                <input
                  required
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value === '' ? 0 : Number(e.target.value) })}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {formData.discountType === DiscountType.PERCENTAGE ? <Percent size={14} /> : "VND"}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Min Order ($)</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value === '' ? 0 : Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Max Uses</label>
              <input
                required
                type="number"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value === '' ? 0 : Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Calendar size={14} /> Start Date
              </label>
              <input
                required
                type="date"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formatDateForInput(formData.startDate)}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Calendar size={14} /> Expiration
              </label>
              <input
                required
                type="date"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formatDateForInput(formData.expirationDate)}
                onChange={(e) => handleDateChange('expirationDate', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isActive"
              className="w-5 h-5 accent-blue-600 rounded"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 cursor-pointer">
              Active and usable by customers
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-slate-600 font-semibold hover:bg-slate-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95"
            >
              {initialData ? 'Update Voucher' : 'Create Voucher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoucherModal;