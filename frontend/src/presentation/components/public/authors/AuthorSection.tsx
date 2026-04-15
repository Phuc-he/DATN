'use client';

import React from 'react';
import { Author } from '@/src/domain/entity/author.entity';
import { ArrowRight, Users } from 'lucide-react';
import Link from 'next/link';
import AuthorCard from './AuthorCard';

interface AuthorSectionProps {
  authors: Author[];
}

const AuthorSection: React.FC<AuthorSectionProps> = ({ authors }) => {
  return (
    <section className="py-20 bg-emerald-50">
      <div className="container mx-auto px-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-emerald-600 rounded-full" />
              <span className="text-emerald-700 font-black text-[10px] uppercase tracking-[0.3em]">
                Cộng đồng Văn học
              </span>
            </div>

            <h2 className="text-4xl font-black text-slate-950 tracking-tighter">
              Gặp gỡ những <span className="text-emerald-600 font-serif italic font-medium">Nhà tư tưởng</span>
            </h2>

            <p className="text-emerald-800 font-medium max-w-md leading-relaxed">
              Khám phá những bộ óc tài ba đằng sau những câu chuyện yêu thích của bạn và những góc nhìn kỹ thuật đang định hình thế giới.
            </p>
          </div>

          <Link
            href="/authors"
            className="group flex items-center gap-3 bg-white border border-slate-200 px-8 py-3.5 rounded-2xl text-sm font-black text-slate-950 hover:border-emerald-600 hover:text-emerald-700 transition-all shadow-sm hover:shadow-xl hover:shadow-emerald-100/50"
          >
            Khám phá tất cả tác giả
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 text-emerald-600" />
          </Link>
        </div>

        {/* Grid Container */}
        {authors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {authors.slice(0, 4).map((author, index) => (
              <div
                key={author.id || index}
                className="animate-in fade-in zoom-in duration-700"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <AuthorCard author={author} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/50 backdrop-blur-sm rounded-[3rem] p-20 border-2 border-dashed border-emerald-100 flex flex-col items-center justify-center text-center">
            <div className="p-6 bg-emerald-50 rounded-full mb-6">
              <Users size={48} className="text-emerald-200" />
            </div>
            <p className="text-slate-400 font-bold tracking-tight">
              Chưa có tác giả nào xuất hiện trong ánh đèn sân khấu.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AuthorSection;
