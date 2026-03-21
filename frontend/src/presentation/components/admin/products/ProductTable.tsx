'use client';

import React from 'react';
import { Edit, Trash2, BookOpen, Package } from 'lucide-react';
import { Book } from '@/src/domain/entity/book.entity';
import Image from 'next/image';

interface ProductTableProps {
  products: Book[]; // Changed to Book entity
  onEdit: (product: Book) => void;
  onDelete: (id: number) => void; // IDs are now numbers
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Book</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Category</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Inventory</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Price</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {products.map((book) => (
            <tr key={book.id} className="hover:bg-slate-50 transition-colors">
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
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-bold text-slate-900 truncate max-w-[200px]">
                      {book.title}
                    </div>
                    {/* Accessing author.name since it's an object */}
                    <div className="text-xs text-slate-500 italic">
                      by {book.author?.name || 'Unknown Author'}
                    </div>
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase">
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
                <div className="text-[10px] text-slate-400 uppercase mt-0.5">In Stock</div>
              </td>

              {/* Price & Discount */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-slate-900">
                  ${book.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                {book.discount > 0 ? (
                  <div className="text-xs text-green-600 font-medium">-{book.discount}% Off</div>
                ) : null}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(book)}
                  className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors mr-1"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => book.id && onDelete(book.id)}
                  className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;