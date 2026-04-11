'use client';

import { Book, EmptyBook } from '@/src/domain/entity/book.entity';
import { Category } from '@/src/domain/entity/category.entity';
import { Author } from '@/src/domain/entity/author.entity';
import { BookType } from '@/src/domain/entity/book-type.enum'; // Added
import { BookOpen, ImageIcon, Upload, X, Star, Tag, Flame, Gem, Calendar } from 'lucide-react'; 
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Book) => void;
  initialData?: Book | null;
  categories: Category[];
  authors: Author[];
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
  authors
}) => {
  const [formData, setFormData] = useState<Partial<Book>>(EmptyBook);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(initialData);
    } else {
      setFormData({ ...EmptyBook, type: BookType.NORMAL }); // Default to Normal
    }
  }, [initialData, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-950">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="text-emerald-600" size={20} />
            <h2 className="text-xl font-bold text-slate-800">
              {initialData ? 'Edit Book' : 'Add New Book'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-emerald-800" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Left Column: Image & Status */}
            <div className="md:col-span-1 space-y-4">
              <label className="text-sm font-semibold text-slate-700 block">Book Cover</label>
              <div className="relative aspect-[3/4] w-full rounded-xl bg-emerald-50 flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 overflow-hidden">
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

              {/* Notable Work Toggle */}
              <div 
                onClick={() => setFormData({ ...formData, isNotable: !formData.isNotable })}
                className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.isNotable 
                    ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                    : 'bg-emerald-50 border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${formData.isNotable ? 'bg-emerald-400 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    <Star size={18} fill={formData.isNotable ? "currentColor" : "none"} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-700">Notable Work</p>
                    <p className="text-[10px] text-emerald-800 font-bold">Featured badge</p>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.isNotable ? 'bg-emerald-400' : 'bg-slate-300'}`}>
                   <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isNotable ? 'left-6' : 'left-1'}`} />
                </div>
              </div>
            </div>

            {/* Right Column: Fields */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-semibold text-slate-700">Book Title</label>
                <input required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>

              {/* Book Type Selection (NEW) */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">Market Status (Type)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { type: BookType.NORMAL, label: 'Normal', icon: Tag, color: 'blue' },
                    { type: BookType.HOT, label: 'Hot', icon: Flame, color: 'red' },
                    { type: BookType.LIMITED, label: 'Limited', icon: Gem, color: 'purple' },
                    { type: BookType.PRE_ORDER, label: 'Pre-order', icon: Calendar, color: 'indigo' },
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: item.type })}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                        formData.type === item.type
                          ? `border-${item.color}-500 bg-${item.color}-50 text-${item.color}-700`
                          : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      <item.icon size={16} />
                      <span className="text-[10px] font-bold uppercase">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Category</label>
                <select required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
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
                <select required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
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
                <input required type="number" step="0.01" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.price || 0} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Stock</label>
                <input required type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.stock || 0} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-6 py-2 text-slate-600 font-semibold hover:bg-emerald-50 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 shadow-md transition-all active:scale-95">
              {initialData ? 'Update Book' : 'Create Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
