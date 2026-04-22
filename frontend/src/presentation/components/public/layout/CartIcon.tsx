'use client';

import { useCart } from '@/src/presentation/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const CartIcon = () => {
  const { cartCount } = useCart();

  return (
    <Link href="/cart" className="relative inline-flex p-2 group">
      {/* Icon */}
      <ShoppingCart
        className="h-6 w-6 text-gray-600 group-hover:text-indigo-600 transition-colors"
      />

      {/* Dynamic Badge */}
      {cartCount > 0 && (
        // Adjusted positioning: changed 'bottom-0 right-0' to 'top-4 left-4' 
        // and refined the translation to keep it tucked closer to the icon.
        <span className="absolute top-4 left-4 flex h-6 w-6">
          {/* Outer glow/ping circle */}
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-40"></span>

          {/* Main Badge */}
          <span className="relative inline-flex items-center justify-center rounded-full h-6 w-6 bg-indigo-600 text-white text-[11px] font-bold shadow-md border-2 border-white">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        </span>
      )}
    </Link>
  );
};

export default CartIcon;