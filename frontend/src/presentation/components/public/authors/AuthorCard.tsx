'use client';

import React from 'react';
import { Author } from '@/src/domain/entity/author.entity';
import { User, PenTool } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface AuthorCardProps {
  author: Author;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => {
  return (
    <Link
      href={`/authors/${author.id}`}
      className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-900/10 hover:-translate-y-2 flex flex-col items-center text-center"
    >
      {/* Ảnh đại diện với hiệu ứng vòng tròn */}
      <div className="relative h-28 w-28 mb-6">
        {/* Vòng trang trí hoạt hình */}
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/10 group-hover:border-emerald-500 group-hover:scale-110 transition-all duration-700" />

        <div className="relative h-full w-full rounded-full overflow-hidden bg-emerald-50 border-4 border-white shadow-md">
          {author.profileImage ? (
            <Image
              src={author.profileImage}
              alt={author.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-300 bg-emerald-50">
              <User size={48} strokeWidth={1.5} />
            </div>
          )}
        </div>
      </div>

      {/* Thông tin tác giả */}
      <div className="space-y-2 mb-6">
        <h3 className="text-xl font-black text-slate-950 group-hover:text-emerald-700 transition-colors tracking-tight">
          {author.name}
        </h3>

        <p className="text-sm text-emerald-800 line-clamp-2 leading-relaxed font-medium italic opacity-80">
          &quot;{author.bio || 'Chia sẻ kiến thức thông qua sức mạnh của ngôn từ.'}&quot;
        </p>
      </div>

      {/* Thống kê/Huy hiệu */}
      <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 bg-emerald-50 px-5 py-2 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
        <PenTool size={12} strokeWidth={2.5} />
        <span>Tác giả tiêu biểu</span>
      </div>
    </Link>
  );
};

export default AuthorCard;
