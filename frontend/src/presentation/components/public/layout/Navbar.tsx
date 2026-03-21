'use client';

import { Menu, X } from 'lucide-react';
import * as Icons from 'lucide-react'; // Import all icons to find the dynamic one
import { useRouter } from 'next/navigation'; // Use standard next/navigation
import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useWebSettings } from '@/src/presentation/context/WebSettingContext'; // Import your hook
import CartIcon from './CartIcon';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import Image from 'next/image';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currUser } = useAuth();
  const router = useRouter();
  
  // 1. Get settings from context
  const { settings, loading } = useWebSettings();

  // 2. Resolve the dynamic icon
  // If headerIcon is 'Library', we get Icons['Library'], else fallback to BookOpen
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DynamicIcon = (settings?.headerIcon && (Icons as any)[settings.headerIcon]) 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (Icons as any)[settings.headerIcon] 
    : Icons.BookOpen;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo Section */}
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => router.push("/")}
          >
            {/* Show Base64 Image if exists, otherwise show resolved Icon */}
            {settings?.logoUrl ? (
              <div className="relative h-8 w-8">
                <Image 
                  src={settings.logoUrl} 
                  alt="Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
            ) : (
              <DynamicIcon className="h-8 w-8 text-indigo-600 group-hover:scale-110 transition-transform" />
            )}

            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              {loading ? "..." : (settings?.webName || "BookHaven")}
            </span>
          </div>

          {/* Desktop Search (Centered) */}
          <SearchBar />

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-5">
            <CartIcon />

            {currUser ? (
              <div className="flex items-center gap-4">
                <UserMenu />
              </div>
            ) : (
              <button 
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm"
                onClick={() => router.push('/auth')}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-4">
          <SearchBar /> {/* Reuse your search bar for mobile if it's responsive */}
          <div className="flex flex-col space-y-3 font-medium text-gray-600">
            <a href="#" className="hover:text-indigo-600">Categories</a>
            <a href="#" className="hover:text-indigo-600">New Arrivals</a>
            <a href="#" className="hover:text-indigo-600">Best Sellers</a>
          </div>
          <hr />
        </div>
      )}
    </nav>
  );
};