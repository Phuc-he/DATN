'use client';

import { useCart } from '@/src/presentation/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const CartIcon = () => {
  const { cartCount } = useCart();

  return (
    <Link href="/cart" className="relative p-2 group">
      {/* Icon */}
      <ShoppingCart 
        className="h-6 w-6 text-gray-600 group-hover:text-indigo-600 transition-colors" 
      />

      {/* Dynamic Badge */}
      {cartCount > 0 && (
        <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 flex h-5 w-5">
          {/* Ping animation effect for better UX */}
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          
          <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-indigo-600 text-white text-[10px] font-black shadow-sm">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
