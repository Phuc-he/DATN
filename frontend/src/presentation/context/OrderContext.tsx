'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Order } from '@/src/domain/entity/order.entity';
import { useAuth } from '../hooks/useAuth';
import { AppProviders } from '@/src/provider/provider';

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  refreshOrders: () => Promise<void>;
  placeOrder: (order: Order) => Promise<Order>;
  addOrderToLocalHistory: (order: Order) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const GUEST_ORDERS_KEY = 'bookshop_guest_orders';

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { currUser } = useAuth();

  const fetchOrders = useCallback(async () => {
    if (!currUser) return;
    setLoading(true);
    try {
      const data = await AppProviders.GetAllOrdersUseCase.execute();
      // Filter orders for the current user (in case the API returns all)
      const userOrders = data.filter(o => o.user?.id === currUser.id);
      setOrders(userOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [currUser]);

  const addOrderToLocalHistory = useCallback((order: Order) => {
    if (!currUser) {
      const currentLocal = JSON.parse(localStorage.getItem(GUEST_ORDERS_KEY) || '[]');
      const updatedLocal = [order, ...currentLocal];
      localStorage.setItem(GUEST_ORDERS_KEY, JSON.stringify(updatedLocal));
      setOrders(updatedLocal);
    }
  }, [currUser]);

  // Load guest orders from localStorage on mount or when user logs out
  useEffect(() => {
    if (!currUser) {
      const saved = localStorage.getItem(GUEST_ORDERS_KEY);
      if (saved) {
        try {
          setOrders(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse guest orders from localStorage", e);
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    }
  }, [currUser]);

  // Sync logic when user logs in
  useEffect(() => {
    if (currUser) {
      fetchOrders();

      const guestOrdersJson = localStorage.getItem(GUEST_ORDERS_KEY);
      if (guestOrdersJson) {
        try {
          const guestOrders: Order[] = JSON.parse(guestOrdersJson);
          if (guestOrders.length > 0) {
            console.log(`Merging ${guestOrders.length} guest orders for user:`, currUser.email, guestOrders);

            // Associate guest orders with the logged-in user in the backend
            Promise.all(guestOrders.map(order => {
              if (order.id) {
                return AppProviders.UpdateOrderByUserIdUseCase.execute(order.id, currUser.id as number);
              }
              return Promise.resolve(null);
            })).then(() => {
              console.log("Guest orders synced successfully.");
              localStorage.removeItem(GUEST_ORDERS_KEY);
              fetchOrders(); // Refresh to include the newly associated orders
            }).catch(err => {
              console.error("Failed to sync guest orders:", err);
            });
          } else {
            localStorage.removeItem(GUEST_ORDERS_KEY);
          }
        } catch (e) {
          console.error("Error processing guest orders merge:", e);
          localStorage.removeItem(GUEST_ORDERS_KEY);
        }
      }
    }
  }, [currUser, fetchOrders]);

  const placeOrder = async (order: Order): Promise<Order> => {
    try {
      const created = await AppProviders.CreateOrderUseCase.execute(order);

      if (!currUser) {
        // Save guest order locally
        addOrderToLocalHistory(created);
      } else {
        // Logged in user: list will be refreshed or updated
        setOrders(prev => [created, ...prev]);
      }

      return created;
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      refreshOrders: fetchOrders,
      placeOrder,
      addOrderToLocalHistory
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
};
