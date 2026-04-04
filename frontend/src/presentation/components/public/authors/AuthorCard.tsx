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
      className="group bg-white border border-slate-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 flex flex-col items-center text-center"
    >
      {/* Profile Image with Ring Effect */}
      <div className="relative h-24 w-24 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 group-hover:border-blue-500 transition-colors duration-500 scale-110" />
        <div className="relative h-full w-full rounded-full overflow-hidden bg-slate-50 border-4 border-white shadow-sm">
          {author.profileImage ? (
            <Image
              src={author.profileImage}
              alt={author.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-300">
              <User size={40} />
            </div>
          )}
        </div>
      </div>

      {/* Author Info */}
      <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
        {author.name}
      </h3>
      
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 italic px-2">
        &quot;{author.bio || 'Sharing knowledge through the power of words.'}&quot;
      </p>

      {/* Stats/Badge */}
      <div className="mt-auto flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-3 py-1 rounded-full">
        <PenTool size={12} />
        <span>Featured Author</span>
      </div>
    </Link>
  );
};

export default AuthorCard;