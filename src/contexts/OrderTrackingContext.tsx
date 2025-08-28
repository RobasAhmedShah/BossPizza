import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ordersAPI, Order } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { sessionManager } from '../lib/SessionManager';

export interface ActiveOrder {
  id: string;
  orderNumber: string;
  status: 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'arriving_soon';
  items: Array<{
    name: string;
    quantity: number;
    customizations?: string;
  }>;
  estimatedDeliveryTime: Date;
  totalAmount: number;
  customerName: string;
  deliveryAddress: string;
  createdAt: Date;
}

interface OrderTrackingContextType {
  activeOrders: ActiveOrder[];
  addActiveOrder: (order: ActiveOrder) => void;
  updateOrderStatus: (orderId: string, status: ActiveOrder['status'], newEstimatedTime?: Date) => void;
  removeActiveOrder: (orderId: string) => void;
  getTimeRemaining: (orderId: string) => number;
  hasActiveOrders: boolean;
  refreshActiveOrders: () => Promise<void>;
  isLoading: boolean;
  saveOrdersToStorage: () => void;
  loadOrdersFromStorage: () => void;
}

const OrderTrackingContext = createContext<OrderTrackingContextType | undefined>(undefined);

// Helper functions for localStorage operations
const STORAGE_KEY = 'bigBossActiveOrders';

const saveOrdersToStorage = (orders: ActiveOrder[]) => {
  try {
    const serializedOrders = orders.map(order => ({
      ...order,
      estimatedDeliveryTime: order.estimatedDeliveryTime.toISOString(),
      createdAt: order.createdAt.toISOString(),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedOrders));
    console.log(`Saved ${orders.length} orders to localStorage`);
  } catch (error) {
    console.error('Error saving orders to localStorage:', error);
  }
};

const loadOrdersFromStorage = (): ActiveOrder[] => {
  try {
    const savedOrders = localStorage.getItem(STORAGE_KEY);
    if (!savedOrders) return [];
    
    const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
      ...order,
      estimatedDeliveryTime: new Date(order.estimatedDeliveryTime),
      createdAt: new Date(order.createdAt),
    }));
    
    // Filter out expired orders
    const validOrders = parsedOrders.filter((order: ActiveOrder) => 
      new Date(order.estimatedDeliveryTime) > new Date()
    );
    
    console.log(`Loaded ${validOrders.length} valid orders from localStorage`);
    return validOrders;
  } catch (error) {
    console.error('Error loading orders from localStorage:', error);
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

export const OrderTrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load active orders from session on mount
  useEffect(() => {
    const session = sessionManager.loadSession();
    if (session?.activeOrders?.orders) {
      setActiveOrders(session.activeOrders.orders);
      console.log(`📋 Restored ${session.activeOrders.orders.length} active orders from cache`);
    } else {
      const legacyOrders = loadOrdersFromStorage();
      setActiveOrders(legacyOrders);
    }
  }, []);

  // Fetch active orders from database
  const refreshActiveOrders = useCallback(async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    try {
      const dbOrders = await ordersAPI.getActiveOrdersByCustomer(user.email);
      
      // Convert database orders to ActiveOrder format
      const convertedOrders: ActiveOrder[] = dbOrders.map((order: Order) => ({
        id: order.id,
        orderNumber: order.order_number,
        status: mapOrderStatus(order.order_status),
        items: order.items.map(item => ({
          name: item.item_name,
          quantity: item.quantity,
          customizations: item.item_description || undefined
        })),
        estimatedDeliveryTime: order.estimated_delivery_time ? 
          new Date(order.estimated_delivery_time) : 
          new Date(Date.now() + 30 * 60 * 1000), // Default 30 minutes
        totalAmount: order.total_amount,
        customerName: order.customer_name,
        deliveryAddress: `${order.delivery_address.street}, ${order.delivery_address.city}`,
        createdAt: new Date(order.created_at)
      }));
      
      // Filter out expired orders
      const validOrders = convertedOrders.filter(order => 
        new Date(order.estimatedDeliveryTime) > new Date()
      );
      
      setActiveOrders(validOrders);
    } catch (error) {
      console.error('Error fetching active orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  // Map database order status to ActiveOrder status
  const mapOrderStatus = (dbStatus: string): ActiveOrder['status'] => {
    switch (dbStatus) {
      case 'pending':
      case 'confirmed':
        return 'confirmed';
      case 'preparing':
        return 'preparing';
      case 'ready':
        return 'ready';
      case 'out_for_delivery':
        return 'out_for_delivery';
      default:
        return 'arriving_soon';
    }
  };

  // Refresh orders when user changes
  useEffect(() => {
    if (user?.email) {
      refreshActiveOrders();
    } else {
      setActiveOrders([]);
    }
  }, [user?.email, refreshActiveOrders]);

  // Set up periodic refresh for active orders
  useEffect(() => {
    if (!user?.email || activeOrders.length === 0) return;

    const interval = setInterval(() => {
      refreshActiveOrders();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user?.email, activeOrders.length, refreshActiveOrders]);

  // Save active orders to session whenever they change
  useEffect(() => {
    sessionManager.updateActiveOrders(activeOrders);
    // Also keep legacy localStorage for backward compatibility
    saveOrdersToStorage(activeOrders);
  }, [activeOrders]);

  // Auto-remove expired orders
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOrders(prev => {
        const validOrders = prev.filter(order => new Date(order.estimatedDeliveryTime) > new Date());
        if (validOrders.length !== prev.length) {
          console.log(`Removed ${prev.length - validOrders.length} expired orders`);
        }
        return validOrders;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addActiveOrder = useCallback((order: ActiveOrder) => {
    setActiveOrders(prev => {
      const newOrders = [...prev, order];
      // Immediately save to localStorage
      saveOrdersToStorage(newOrders);
      return newOrders;
    });
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: ActiveOrder['status'], newEstimatedTime?: Date) => {
    setActiveOrders(prev => {
      const updatedOrders = prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status,
              ...(newEstimatedTime && { estimatedDeliveryTime: newEstimatedTime })
            }
          : order
      );
      // Immediately save to localStorage
      saveOrdersToStorage(updatedOrders);
      return updatedOrders;
    });
  }, []);

  const removeActiveOrder = useCallback((orderId: string) => {
    setActiveOrders(prev => {
      const filteredOrders = prev.filter(order => order.id !== orderId);
      // Immediately save to localStorage
      saveOrdersToStorage(filteredOrders);
      return filteredOrders;
    });
  }, []);

  const getTimeRemaining = useCallback((orderId: string): number => {
    const order = activeOrders.find(o => o.id === orderId);
    if (!order) return 0;
    
    const now = new Date().getTime();
    const deliveryTime = new Date(order.estimatedDeliveryTime).getTime();
    return Math.max(0, deliveryTime - now);
  }, [activeOrders]);

  const saveOrdersToStorageFn = useCallback(() => {
    saveOrdersToStorage(activeOrders);
  }, [activeOrders]);

  const loadOrdersFromStorageFn = useCallback(() => {
    const orders = loadOrdersFromStorage();
    setActiveOrders(orders);
  }, []);

  const hasActiveOrders = activeOrders.length > 0;

  return (
    <OrderTrackingContext.Provider value={{
      activeOrders,
      addActiveOrder,
      updateOrderStatus,
      removeActiveOrder,
      getTimeRemaining,
      hasActiveOrders,
      refreshActiveOrders,
      isLoading,
      saveOrdersToStorage: saveOrdersToStorageFn,
      loadOrdersFromStorage: loadOrdersFromStorageFn,
    }}>
      {children}
    </OrderTrackingContext.Provider>
  );
};

export const useOrderTracking = () => {
  const context = useContext(OrderTrackingContext);
  if (context === undefined) {
    throw new Error('useOrderTracking must be used within an OrderTrackingProvider');
  }
  return context;
};