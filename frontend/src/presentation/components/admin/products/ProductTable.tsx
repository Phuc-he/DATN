'use client';

import React from 'react';
import { Edit, Trash2, BookOpen, Package, Star, Flame, Gem, Calendar, Tag } from 'lucide-react';
import { Book } from '@/src/domain/entity/book.entity';
import { BookType } from '@/src/domain/entity/book-type.enum';
import Image from 'next/image';

interface ProductTableProps {
  products: Book[];
  onEdit: (product: Book) => void;
  onDelete: (id: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  
  // Helper để hiển thị Badge cho Type
  const renderTypeBadge = (type?: BookType) => {
    switch (type) {
      case BookType.HOT:
        return (
          <span className="flex items-center gap-1 w-fit px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase border border-red-100">
            <Flame size={10} /> Hot
          </span>
        );
      case BookType.LIMITED:
        return (
          <span className="flex items-center gap-1 w-fit px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold uppercase border border-purple-100">
            <Gem size={10} /> Limited
          </span>
        );
      case BookType.PRE_ORDER:
        return (
          <span className="flex items-center gap-1 w-fit px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase border border-indigo-100">
            <Calendar size={10} /> Pre-order
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 w-fit px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold uppercase border border-slate-100">
            <Tag size={10} /> Normal
          </span>
        );
    }
  };

  return (
    <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Book</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Inventory</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {products.map((book) => (
            <tr key={book.id} className="hover:bg-slate-50 transition-colors group">
              {/* Image & Title */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-16 w-12 flex-shrink-0 relative">
                    {book.imageUrl ? (
                      <Image
                        className="rounded border border-slate-100 object-cover"
                        src={book.imageUrl}
                        alt={book.title}
                        fill
                      />
                    ) : (
                      <div className="h-full w-full rounded bg-slate-100 flex items-center justify-center text-slate-400">
                        <BookOpen size={20} />
                      </div>
                    )}
                    {book.isNotable && (
                      <div className="absolute -top-2 -left-2 bg-amber-400 text-white p-1 rounded-full shadow-sm border border-white z-10">
                        <Star size={10} fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-bold text-slate-900 truncate max-w-[180px]">
                      {book.title}
                    </div>
                    <div className="text-xs text-slate-500 italic">
                      by {book.author?.name || 'Unknown Author'}
                    </div>
                  </div>
                </div>
              </td>

              {/* Book Type (NEW COLUMN) */}
              <td className="px-6 py-4 whitespace-nowrap">
                {renderTypeBadge(book.type)}
              </td>

              {/* Category */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                  {book.category?.name || 'Uncategorized'}
                </span>
              </td>

              {/* Inventory */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Package size={14} className={book.stock < 10 ? 'text-red-500' : 'text-slate-400'} />
                  <span className={`text-sm font-medium ${book.stock < 10 ? 'text-red-600 font-bold' : 'text-slate-700'}`}>
                    {book.stock}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Units Left</div>
              </td>

              {/* Price & Discount */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-slate-900">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
                </div>
                {book.discount > 0 ? (
                  <div className="text-[10px] text-green-600 font-bold uppercase">
                    Save {book.discount}%
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Base Price</div>
                )}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(book)}
                    className="text-slate-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit Book"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => book.id && onDelete(book.id)}
                    className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Book"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;