'use client';

import { Menu, X } from 'lucide-react';
import * as Icons from 'lucide-react'; 
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useWebSettings } from '@/src/presentation/context/WebSettingContext';
import CartIcon from './CartIcon';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import Image from 'next/image';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currUser } = useAuth();
  const router = useRouter();
  
  const { settings, loading } = useWebSettings();

  // Resolve dynamic icon
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DynamicIcon = (settings?.headerIcon && (Icons as any)[settings.headerIcon]) 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (Icons as any)[settings.headerIcon] 
    : Icons.BookOpen;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => router.push("/")}
          >
            {settings?.logoUrl ? (
              <div className="relative h-9 w-9">
                <Image 
                  src={settings.logoUrl} 
                  alt="Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="p-2 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                <DynamicIcon className="h-6 w-6 text-emerald-700 group-hover:scale-110 transition-transform" />
              </div>
            )}

            <span className="text-2xl font-black tracking-tighter text-slate-950">
              {loading ? "..." : (settings?.webName || "BookHaven")}
              <span className="text-emerald-600">.</span>
            </span>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
             <SearchBar />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="hover:text-emerald-600 transition-colors">
                <CartIcon />
            </div>

            {currUser ? (
              <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                <UserMenu />
              </div>
            ) : (
              <button 
                className="bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-100 active:scale-95"
                onClick={() => router.push('/auth')}
              >
                Đăng nhập
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <CartIcon />
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-lg bg-emerald-50 text-slate-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-8 space-y-6 animate-in slide-in-from-top duration-300">
          <SearchBar />
          <div className="flex flex-col space-y-4 font-bold text-slate-600">
            <a href="#" className="flex items-center justify-between hover:text-emerald-700 transition-colors">
                Danh mục <Icons.ChevronRight size={16} />
            </a>
            <a href="/shop/new-arrivals" className="flex items-center justify-between hover:text-emerald-700 transition-colors">
                Sách mới về <Icons.ChevronRight size={16} />
            </a>
            <a href="/shop/best-sellers" className="flex items-center justify-between hover:text-emerald-700 transition-colors">
                Bán chạy nhất <Icons.ChevronRight size={16} />
            </a>
          </div>
          
          {!currUser && (
            <button 
              className="w-full bg-emerald-700 text-white py-4 rounded-xl font-bold"
              onClick={() => router.push('/auth')}
            >
              Đăng nhập
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
