'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrderItem } from '@/src/domain/entity/order-item.entity';
import { Book } from '@/src/domain/entity/book.entity';
import { Voucher } from '@/src/domain/entity/voucher.entity';
import { DiscountType } from '@/src/domain/entity/discount-type.enum';

interface CartContextType {
  cart: OrderItem[];
  addToCart: (product: Book, amount: number) => void;
  removeFromCart: (productId: number) => void;
  updateAmount: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  voucherDiscount: number;
  appliedVoucher: Voucher | null;
  applyVoucher: (voucher: Voucher) => void; // Khai báo trong interface
  removeVoucher: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  // Persistence logic
  useEffect(() => {
    const savedCart = localStorage.getItem('bookshop_cart');
    if (savedCart) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bookshop_cart', JSON.stringify(cart));
  }, [cart]);

  // --- Cart Actions ---
  const addToCart = (product: Book, amount: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.book.id === product.id
            ? { ...item, quantity: item.quantity + amount }
            : item
        );
      }
      const newItem: OrderItem = {
        book: product,
        quantity: amount,
        unitPrice: product.price,
        discount: product.discount || 0,
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.book.id !== productId));
  };

  const updateAmount = (productId: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.book.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedVoucher(null);
  };

  // --- Voucher Actions ---
  // ĐỊNH NGHĨA HÀM APPLY VOUCHER Ở ĐÂY
  const applyVoucher = (voucher: Voucher) => {
    setAppliedVoucher(voucher);
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
  };

  // --- Calculations ---
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce((acc, item) => {
    const priceAfterBookDiscount = item.unitPrice * (1 - (item.discount || 0) / 100);
    return acc + (priceAfterBookDiscount * item.quantity);
  }, 0);

  const voucherDiscount = appliedVoucher
    ? (appliedVoucher.discountType === DiscountType.PERCENTAGE
      ? (subtotal * appliedVoucher.discountValue / 100)
      : appliedVoucher.discountValue)
    : 0;

  const finalCartTotal = Math.max(0, subtotal - voucherDiscount);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateAmount, 
      clearCart, 
      cartTotal: finalCartTotal, 
      cartCount, 
      voucherDiscount, 
      appliedVoucher, 
      applyVoucher, // Truyền hàm đã định nghĩa vào đây
      removeVoucher 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};