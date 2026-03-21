'use client';

import { Author, EmptyAuthor } from '@/src/domain/entity/author.entity';
import { Upload, User as UserIcon, X, PenTool } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface AuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (author: Author) => void;
  initialData?: Author | null;
}

const AuthorModal: React.FC<AuthorModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Author>>(EmptyAuthor);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(initialData);
      } else {
        setFormData(EmptyAuthor);
      }
    }
  }, [initialData, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData as Author);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-900">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <PenTool size={20} className="text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">
              {initialData ? 'Chỉnh sửa tác giả' : 'Thêm tác giả mới'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-6 space-y-3">
            <div className="relative h-28 w-28">
              {formData.profileImage ? (
                <Image
                  src={formData.profileImage}
                  alt="Author Preview"
                  fill
                  className="rounded-full object-cover border-2 border-blue-100 shadow-sm"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200">
                  <UserIcon size={48} />
                </div>
              )}
              <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white cursor-pointer hover:bg-blue-700 shadow-lg transition-all border-2 border-white">
                <Upload size={14} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
            <p className="text-xs text-slate-400">Ảnh đại diện tác giả</p>
          </div>

          <div className="space-y-4">
            {/* Author Name */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Tên tác giả</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: J.K. Rowling"
              />
            </div>

            {/* Biography */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Tiểu sử (Bio)</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Nhập thông tin giới thiệu về tác giả..."
              />
            </div>
          </div>

          {/* Footer Actions */}
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
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              {initialData ? 'Lưu thay đổi' : 'Thêm tác giả'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthorModal;