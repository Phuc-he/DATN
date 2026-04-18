'use client';

import React from 'react';
import { Edit, Trash2, User, PenTool, Quote } from 'lucide-react';
import { Author } from '@/src/domain/entity/author.entity';
import Image from 'next/image';

interface AuthorTableProps {
  authors: Author[];
  onEdit: (author: Author) => void;
  onDelete: (id: number) => void;
}

const AuthorTable: React.FC<AuthorTableProps> = ({ authors, onEdit, onDelete }) => {
  return (
    <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-emerald-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-800 uppercase">Tác giả</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-800 uppercase">Tiểu sử</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-800 uppercase">Mã số</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-emerald-800 uppercase">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {authors.map((author) => (
            <tr key={author.id} className="hover:bg-emerald-50 transition-colors">
              {/* Profile Image & Name */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-12 w-12 flex-shrink-0">
                    {author.profileImage ? (
                      <Image 
                        className="h-12 w-12 rounded-full object-cover border border-slate-100" 
                        src={author.profileImage} 
                        alt={author.name} 
                        width={48} 
                        height={48} 
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                        <User size={24} />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-bold text-slate-950">{author.name}</div>
                    <div className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5">
                      <PenTool size={10} /> Tác giả đã xuất bản
                    </div>
                  </div>
                </div>
              </td>

              {/* Biography Snippet */}
              <td className="px-6 py-4">
                <div className="flex items-start gap-2 max-w-md">
                  <Quote size={14} className="text-slate-300 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-600 line-clamp-2 italic">
                    {author.bio || <span className="text-slate-400">Chưa có tiểu sử.</span>}
                  </p>
                </div>
              </td>

              {/* Author ID */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-800 font-mono">
                #{author.id}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onEdit(author)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all active:scale-90"
                    title="Chỉnh sửa tác giả"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => author.id && onDelete(author.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                    disabled={!author.id}
                    title="Xóa tác giả"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          
          {authors.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-emerald-800 italic">
                Không tìm thấy tác giả nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuthorTable;
