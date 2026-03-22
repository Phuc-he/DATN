'use client';

import { updateUserProfileAction } from '@/src/presentation/action/user.action';
import { useAuth } from '@/src/presentation/hooks/useAuth';
import {
  Camera,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  User as UserIcon
} from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

const ProfilePage = () => {
  const { currUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Khởi tạo formData khớp với User Interface
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    avatar: ''
  });

  useEffect(() => {
    if (currUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        fullName: currUser.fullName || '',
        email: currUser.email || '',
        phone: currUser.phone || '',
        address: currUser.address || '',
        avatar: currUser.avatar || ''
      });
    }
  }, [currUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Ảnh phải nhỏ hơn 2MB' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currUser?.id) return;

    setIsSubmitting(true);
    setMessage(null);

    // Gửi dữ liệu cập nhật (phone trong User entity là string nên không cần convert Number)
    const result = await updateUserProfileAction(currUser.id, {
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      avatar: formData.avatar
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      // Thay vì reload, bạn có thể gọi hàm refresh user từ useAuth nếu có
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    setIsSubmitting(false);
  };

  if (!currUser) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-900">Cài đặt tài khoản</h1>
          <p className="text-slate-500">Quản lý thông tin cá nhân và địa chỉ giao hàng</p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cột trái: Avatar & Role */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
              <div className="relative group mb-4 h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                {formData.avatar ? (
                  <Image
                    className="object-cover"
                    src={formData.avatar}
                    alt={formData.fullName || 'Avatar'}
                    unoptimized
                    fill
                  />
                ) : (
                  <div className="h-full w-full bg-slate-200 flex items-center justify-center text-slate-500">
                    <UserIcon size={64} />
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera size={24} />
                </button>
              </div>

              <h2 className="font-bold text-xl text-slate-900">{formData.fullName || currUser.username}</h2>
              <p className="text-sm text-slate-400 font-medium mb-4">{formData.email}</p>

              <div className="w-full pt-4 border-t border-slate-50">
                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-2 rounded-lg">
                  {currUser.role}
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Form thông tin */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <UserIcon size={16} className="text-slate-400" /> Họ và tên
                  </label>
                  <input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Nhập họ tên"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-2 opacity-60">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Mail size={16} className="text-slate-400" /> Email (Không thể thay đổi)
                  </label>
                  <input disabled value={formData.email} className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Phone size={16} className="text-slate-400" /> Số điện thoại
                  </label>
                  <input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0xxx xxx xxx"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400" /> Địa chỉ giao hàng
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    placeholder="Địa chỉ cụ thể (Số nhà, đường, phường/xã...)"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>
              </div>

              {message && (
                <div className={`mt-6 p-4 rounded-xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-1 ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  disabled={isSubmitting}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-600 transition-all disabled:bg-slate-300 active:scale-95 shadow-xl shadow-slate-200"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;