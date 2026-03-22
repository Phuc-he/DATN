'use client';

import { Book, EmptyBook } from '@/src/domain/entity/book.entity';
import { Category } from '@/src/domain/entity/category.entity';
import { Author } from '@/src/domain/entity/author.entity';
import { BookOpen, ImageIcon, Upload, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Book) => void;
  initialData?: Book | null;
  categories: Category[];
  authors: Author[]; // Added authors prop
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
  authors
}) => {
  // Use Partial<Book> to align with your domain model
  const [formData, setFormData] = useState<Partial<Book>>(EmptyBook);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(initialData);
    } else {
      setFormData(EmptyBook);
    }
  }, [initialData, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Mapping to 'imageUrl' to match Book entity
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Book);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-900">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-600" size={20} />
            <h2 className="text-xl font-bold text-slate-800">
              {initialData ? 'Edit Book' : 'Add New Book'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Image Upload */}
            <div className="md:col-span-1 space-y-4">
              <label className="text-sm font-semibold text-slate-700 block">Book Cover</label>
              <div className="relative aspect-[3/4] w-full rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 overflow-hidden">
                {formData.imageUrl ? (
                  <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
                ) : (
                  <ImageIcon size={48} />
                )}
                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 hover:bg-black/20 transition-all group">
                  <Upload className="text-white opacity-0 group-hover:opacity-100" size={32} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            {/* Fields */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-semibold text-slate-700">Book Title</label>
                <input required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Category</label>
                <select required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={formData.category?.id || ''} 
                  onChange={(e) => {
                    const cat = categories.find(c => c.id === Number(e.target.value));
                    setFormData({ ...formData, category: cat });
                  }}>
                  <option value="" disabled>Select Category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Author</label>
                <select required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={formData.author?.id || ''} 
                  onChange={(e) => {
                    const auth = authors.find(a => a.id === Number(e.target.value));
                    setFormData({ ...formData, author: auth });
                  }}>
                  <option value="" disabled>Select Author</option>
                  {authors.map(auth => <option key={auth.id} value={auth.id}>{auth.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Price (VND)</label>
                <input required type="number" step="0.01" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.price || 0} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Stock</label>
                <input required type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.stock || 0} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-6 py-2 text-slate-600 font-semibold hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95">
              {initialData ? 'Update Book' : 'Create Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;