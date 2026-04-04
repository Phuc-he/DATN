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
    <section className="py-16 bg-slate-50/50">
      <div className="container mx-auto px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-12 bg-blue-600 rounded-full" />
              <span className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em]">Our Community</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900">Meet the Authors</h2>
            <p className="text-slate-500 mt-2 max-w-md">
              Discover the brilliant minds behind your favorite stories and technical insights.
            </p>
          </div>

          <Link 
            href="#" 
            className="group flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-full text-sm font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
          >
            Explore All Authors
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid Container */}
        {authors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {authors.slice(0, 4).map((author) => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            <Users size={48} className="text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">No authors found in the spotlight yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AuthorSection;