'use client';

import { useAuth } from '@/src/presentation/hooks/useAuth';
import { AuthService } from '@/src/presentation/services/auth.service';
import { ChevronDown, LogOut, Package, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const UserMenu = () => {
  const { currUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    window.location.reload(); // Refresh to clear state
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 group cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition-all"
      >
        {currUser?.avatar ? (
          <Image className="h-10 w-10 rounded-full object-cover" src={currUser?.avatar || ''} alt={currUser?.username || ''} width={40} height={40} />
        ) : (
          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-emerald-800">
            <User size={20} />
          </div>
        )}
        <div className="hidden md:block text-left">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter leading-none mb-1">Tài khoản</p>
          <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 flex items-center gap-1">
            {currUser?.username?.split(' ')[0]}
            <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </span>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-150">
          <div className="px-4 py-3 border-b border-gray-50 mb-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Đăng nhập bởi</p>
            <p className="text-sm font-bold text-gray-900 truncate">{currUser?.email}</p>
          </div>

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
          >
            <User size={18} />
            Hồ sơ cá nhân
          </Link>

          <Link
            href="/profile/orders"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
          >
            <Package size={18} />
            Đơn hàng của tôi
          </Link>

          <div className="border-t border-gray-50 mt-1 pt-1">
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left transition-colors"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
