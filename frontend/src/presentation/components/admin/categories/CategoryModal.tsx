'use client';

import React, { useEffect, useState } from 'react';
import { Category } from '@/src/domain/entity/category.entity';
import { X, Upload, Layers, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
  initialData?: Category | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    image: '',
  });

  // Safe synchronization logic
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(initialData);
    } else {
      setFormData({ name: '', description: '', image: '' });
    }
  }, [initialData, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Category);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-950">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="text-emerald-600" size={20} />
            <h2 className="text-xl font-bold text-slate-800">
              {initialData ? 'Edit Category' : 'Add Category'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-emerald-800" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category Thumbnail Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Category Image</label>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 flex-shrink-0">
                {formData.image ? (
                  <Image
                    src={formData.image}
                    alt="Preview"
                    fill
                    className="rounded-xl object-cover border border-slate-200"
                  />
                ) : (
                  <div className="h-full w-full rounded-xl bg-emerald-50 flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200">
                    <ImageIcon size={24} />
                  </div>
                )}
              </div>
              <label className="flex-1">
                <div className="flex items-center justify-center w-full px-4 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors gap-2 text-sm font-medium text-slate-600">
                  <Upload size={16} />
                  <span>Choose Image (Base64)</span>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Category Name</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. Electronics, Smartphones..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea
              rows={4}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              placeholder="Briefly describe this category..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-slate-600 font-semibold hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 shadow-md transition-all active:scale-95"
            >
              {initialData ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
