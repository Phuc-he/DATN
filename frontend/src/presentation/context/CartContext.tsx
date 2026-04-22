'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { OrderItem } from '@/src/domain/entity/order-item.entity';
import { Book } from '@/src/domain/entity/book.entity';
import { Voucher } from '@/src/domain/entity/voucher.entity';
import { DiscountType } from '@/src/domain/entity/discount-type.enum';
import { useAuth } from '../hooks/useAuth';
import { AppProviders } from '@/src/provider/provider';
import { Order } from '@/src/domain/entity/order.entity';
import { OrderStatus } from '@/src/domain/entity/order-status.enum';

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
  applyVoucher: (voucher: Voucher) => void;
  removeVoucher: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [isCartSynced, setIsCartSynced] = useState(false);
  const [cartOrderId, setCartOrderId] = useState<number | null>(null);
  const { currUser } = useAuth();

  // Persistence logic: Load from localStorage on mount
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

  // Persistence logic: Save to localStorage on cart change
  useEffect(() => {
    localStorage.setItem('bookshop_cart', JSON.stringify(cart));
  }, [cart]);

  const syncBackend = useCallback(async (newItems: OrderItem[], orderIdOverride?: number | null) => {
    if (!currUser) return;

    const idToUpdate = orderIdOverride !== undefined ? orderIdOverride : cartOrderId;

    const total = newItems.reduce((acc, item) => {
      const priceAfterBookDiscount = item.unitPrice * (1 - (item.discount || 0) / 100);
      return acc + (priceAfterBookDiscount * item.quantity);
    }, 0);

    try {
      if (idToUpdate) {
        await AppProviders.UpdateOrderUseCase.execute(idToUpdate, {
          items: newItems,
          totalAmount: total
        });
      } else if (newItems.length > 0) {
        const newOrder: Order = {
          user: currUser,
          fullName: currUser.fullName || currUser.username || '',
          phone: currUser.phone || '',
          address: currUser.address || '',
          isCart: true,
          status: OrderStatus.UNPROCESSED,
          totalAmount: total,
          items: newItems
        };
        const created = await AppProviders.CreateOrderUseCase.execute(newOrder);
        setCartOrderId(created.id || null);
      }
    } catch (e) {
      console.error("Backend cart sync failed", e);
    }
  }, [currUser, cartOrderId]);

  // Sync with backend when user logs in
  useEffect(() => {
    if (currUser && !isCartSynced) {
      // Check if we already synced in this session to avoid redundant calls on page refresh
      const sessionSynced = sessionStorage.getItem('cart_synced_' + currUser.id);

      if (sessionSynced) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsCartSynced(true);
        return;
      }

      AppProviders.GetCartByUserUseCase.execute(Number(currUser.id))
        .then(cartData => {
          if (cartData) {
            setCartOrderId(cartData.id || null);
            if (cartData.items) {
              if (cart.length > 0) {
                console.log("Merging local cart with backend cart for user:", currUser.email);

                const mergedCart = [...cartData.items];
                cart.forEach(localItem => {
                  const existingItem = mergedCart.find(item => item.book.id === localItem.book.id);
                  if (existingItem) {
                    existingItem.quantity += localItem.quantity;
                  } else {
                    mergedCart.push(localItem);
                  }
                });
                setCart(mergedCart);
                syncBackend(mergedCart, cartData.id);
              } else {
                setCart(cartData.items);
              }
            }
          }
          setIsCartSynced(true);
          sessionStorage.setItem('cart_synced_' + currUser.id, 'true');
        })
        .catch(error => {
          console.error("Error fetching cart:", error);
          setIsCartSynced(true); // Prevent repeated attempts on failure
        });
    } else if (!currUser && isCartSynced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCartSynced(false);
      setCartOrderId(null);
    }
  }, [currUser, isCartSynced, cart, syncBackend]);

  // --- Cart Actions ---
  const addToCart = (product: Book, amount: number) => {
    const existing = cart.find((item) => item.book.id === product.id);
    let nextCart: OrderItem[];

    if (existing) {
      nextCart = cart.map((item) =>
        item.book.id === product.id
          ? { ...item, quantity: item.quantity + amount }
          : item
      );
    } else {
      const newItem: OrderItem = {
        book: product,
        quantity: amount,
        unitPrice: product.price,
        discount: product.discount || 0,
      };
      nextCart = [...cart, newItem];
    }

    setCart(nextCart);
    if (currUser) syncBackend(nextCart);
  };

  const removeFromCart = (productId: number) => {
    const nextCart = cart.filter((item) => item.book.id !== productId);
    setCart(nextCart);
    if (currUser) syncBackend(nextCart);
  };

  const updateAmount = (productId: number, quantity: number) => {
    const nextCart = cart.map((item) =>
      item.book.id === productId ? { ...item, quantity } : item
    );
    setCart(nextCart);
    if (currUser) syncBackend(nextCart);
  };

  const clearCart = () => {
    setCart([]);
    setAppliedVoucher(null);
    if (currUser) syncBackend([]);
  };

  // --- Voucher Actions ---
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
      applyVoucher,
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
