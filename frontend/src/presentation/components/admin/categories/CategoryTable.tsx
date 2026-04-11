'use client';

import React from 'react';
import { Edit, Trash2, Layers, ImageIcon } from 'lucide-react';
import { Category } from '@/src/domain/entity/category.entity';
import Image from 'next/image';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-emerald-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-800 uppercase">Category</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-800 uppercase">Description</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-800 uppercase">Created At</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-emerald-800 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-emerald-50 transition-colors">
              {/* Image & Name */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-12 w-12 flex-shrink-0 relative">
                    {category.image ? (
                      <Image
                        className="rounded-lg object-cover border border-slate-100"
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="48px"
                      />
                    ) : (
                      <div className="h-full w-full rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-bold text-slate-950">{category.name}</div>
                    <div className="text-xs text-slate-400">ID: {category.id}</div>
                  </div>
                </div>
              </td>

              {/* Description */}
              <td className="px-6 py-4">
                <div className="text-sm text-slate-600 line-clamp-2 max-w-xs">
                  {category.description || <span className="text-slate-300 italic">No description</span>}
                </div>
              </td>

              {/* Created Date */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-800">
                {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(category)}
                  className="text-emerald-600 hover:text-emerald-900 p-2 hover:bg-emerald-50 rounded-lg transition-colors mr-2"
                  title="Edit Category"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(category.id!)}
                  className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Category"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
          
          {categories.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-emerald-800">
                <Layers className="mx-auto mb-2 opacity-20" size={48} />
                <p>No categories found.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
