'use client';

import { Role, RoleLabels } from '@/src/domain/entity/role.enum';
import { UserHistoryStatus } from '@/src/domain/entity/user-history-status.enum';
import { User as UserEntity } from '@/src/domain/entity/user.entity';
import { AppProviders } from '@/src/provider/provider'; // Added import
import { History, Upload, User as UserIcon, X, RefreshCw } from 'lucide-react'; // Added RefreshCw
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: UserEntity) => void;
  initialData?: UserEntity | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [refreshing, setRefreshing] = useState(false); // State for single user sync
  const [formData, setFormData] = useState<Partial<UserEntity>>({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: Role.CUSTOMER,
    avatar: '',
    phone: '',
    address: '',
    historyStatus: UserHistoryStatus.NEW_USER
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        password: '',
      });
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        fullName: '',
        role: Role.CUSTOMER,
        avatar: '',
        phone: '',
        address: '',
        historyStatus: UserHistoryStatus.NEW_USER
      });
    }
  }, [initialData, isOpen]);

  // New function to refresh a single user's history status
  const handleRefreshUserStatus = async () => {
    if (!initialData?.id) return;
    
    setRefreshing(true);
    try {
      const updatedUser = await AppProviders.UpdateHistoryStatusForUserUseCase.execute(initialData.id);
      if (updatedUser) {
        setFormData((prev) => ({ 
          ...prev, 
          historyStatus: updatedUser.historyStatus 
        }));
        // Note: You might want to trigger a toast here saying "Status updated!"
      }
    } catch (error) {
      console.error("Failed to refresh user status:", error);
      alert("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData as UserEntity);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-950">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-emerald-800" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            
            <div className="space-y-4">
              <div className="flex flex-col items-center p-4 bg-emerald-50 rounded-xl border border-slate-100">
                <div className="relative h-24 w-24 mb-3">
                  {formData.avatar ? (
                    <Image
                      src={formData.avatar}
                      alt="Preview"
                      fill
                      className="rounded-full object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200">
                      <UserIcon size={40} />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 rounded-full text-white cursor-pointer hover:bg-emerald-700 shadow-lg transition-all">
                    <Upload size={14} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
                <span className="text-xs font-medium text-emerald-800 uppercase tracking-wider">Ảnh đại diện</span>
              </div>

              {/* History Status Section with Refresh Button */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <History size={14} /> Trạng thái mua hàng
                  </label>
                  
                  {/* The "Fun" Refresh Button */}
                  {initialData && (
                    <button
                      type="button"
                      onClick={handleRefreshUserStatus}
                      disabled={refreshing}
                      className="text-[10px] flex items-center gap-1 text-emerald-600 hover:text-emerald-800 font-bold uppercase tracking-tighter disabled:opacity-50"
                    >
                      <RefreshCw size={10} className={refreshing ? "animate-spin" : ""} />
                      Làm mới
                    </button>
                  )}
                </div>
                
                <select
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  value={formData.historyStatus}
                  onChange={(e) => setFormData({ ...formData, historyStatus: Number(e.target.value) as UserHistoryStatus })}
                >
                  <option value={UserHistoryStatus.NEW_USER}>🆕 Khách mới</option>
                  <option value={UserHistoryStatus.GOOD_HISTORY}>✅ Lịch sử tốt</option>
                  <option value={UserHistoryStatus.BOOM_HISTORY}>⚠️ Từng boom hàng</option>
                </select>
                <p className="text-[10px] text-slate-400 italic">Tính toán lại dựa trên dữ liệu đơn hàng hiện tại.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Họ và tên</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Tên đăng nhập</label>
                <input
                  required
                  disabled={!!initialData}
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-emerald-50 disabled:text-slate-400"
                  value={formData.username || ''}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Vai trò hệ thống</label>
                <select
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: Number(e.target.value) as Role })}
                >
                  <option value={Role.CUSTOMER}>{RoleLabels[Role.CUSTOMER]}</option>
                  <option value={Role.ADMIN}>{RoleLabels[Role.ADMIN]}</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input
                  required
                  type="email"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Số điện thoại</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {!initialData && (
                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Mật khẩu</label>
                  <input
                    required
                    type="password"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              )}

              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-semibold text-slate-700">Địa chỉ chi tiết</label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-slate-600 font-semibold hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 shadow-md transition-all active:scale-95"
            >
              {initialData ? 'Lưu thay đổi' : 'Tạo người dùng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
