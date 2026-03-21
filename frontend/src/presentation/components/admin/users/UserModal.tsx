'use client';

import { User as UserEntity } from '@/src/domain/entity/user.entity';
import { Role, RoleLabels } from '@/src/domain/entity/role.enum';
import { Upload, User as UserIcon, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: UserEntity) => void;
  initialData?: UserEntity | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<UserEntity>>({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: Role.CUSTOMER,
    avatar: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        ...initialData,
        password: '', // Never populate password field for security
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
        address: ''
      });
    }
  }, [initialData, isOpen]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-900">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6 space-y-3">
            <div className="relative h-24 w-24">
              {formData.avatar ? (
                <Image
                  src={formData.avatar}
                  alt="Preview"
                  fill
                  className="rounded-full object-cover border-2 border-blue-100"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200">
                  <UserIcon size={40} />
                </div>
              )}
              <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white cursor-pointer hover:bg-blue-700 shadow-lg transition-all">
                <Upload size={14} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Họ và tên</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nguyễn Văn A"
              />
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Tên đăng nhập</label>
              <input
                required
                disabled={!!initialData} // Usually username shouldn't be changed
                type="text"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 disabled:text-slate-400"
                value={formData.username || ''}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                required
                type="email"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Role Selection (Replaces isAdmin checkbox) */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Vai trò hệ thống</label>
              <select
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: Number(e.target.value) as Role })}
              >
                <option value={Role.CUSTOMER}>{RoleLabels[Role.CUSTOMER]}</option>
                <option value={Role.AUTHOR}>{RoleLabels[Role.AUTHOR]}</option>
                <option value={Role.ADMIN}>{RoleLabels[Role.ADMIN]}</option>
              </select>
            </div>

            {/* Password - Only show for new users */}
            {!initialData && (
              <div className="space-y-1 md:col-span-1">
                <label className="text-sm font-semibold text-slate-700">Mật khẩu</label>
                <input
                  required
                  type="password"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            )}

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Số điện thoại</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold text-slate-700">Địa chỉ chi tiết</label>
              <textarea
                rows={2}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-slate-600 font-semibold hover:bg-slate-50 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95"
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