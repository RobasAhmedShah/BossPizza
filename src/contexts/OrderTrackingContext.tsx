import React, { createContext, useContext, useState, useEffect } from 'react';
import { ordersAPI, Order } from '../lib/supabase';
import { useAuth } from './AuthContext';

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
}

const OrderTrackingContext = createContext<OrderTrackingContextType | undefined>(undefined);

export const OrderTrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load active orders from localStorage on mount
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('bigBossActiveOrders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
          ...order,
          estimatedDeliveryTime: new Date(order.estimatedDeliveryTime),
          createdAt: new Date(order.createdAt),
        }));
        
        // Filter out expired orders
        const validOrders = parsedOrders.filter((order: ActiveOrder) => 
          new Date(order.estimatedDeliveryTime) > new Date()
        );
        
        setActiveOrders(validOrders);
      }
    } catch (error) {
      console.error('Error loading active orders:', error);
      localStorage.removeItem('bigBossActiveOrders');
    }
  }, []);

  // Fetch active orders from database
  const refreshActiveOrders = async () => {
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
  };

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
  }, [user?.email]);

  // Set up periodic refresh for active orders
  useEffect(() => {
    if (!user?.email || activeOrders.length === 0) return;

    const interval = setInterval(() => {
      refreshActiveOrders();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user?.email, activeOrders.length]);
  // Save active orders to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('bigBossActiveOrders', JSON.stringify(activeOrders));
    } catch (error) {
      console.error('Error saving active orders:', error);
    }
  }, [activeOrders]);

  // Auto-remove expired orders
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOrders(prev => 
        prev.filter(order => new Date(order.estimatedDeliveryTime) > new Date())
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addActiveOrder = (order: ActiveOrder) => {
    setActiveOrders(prev => [...prev, order]);
  };

  const updateOrderStatus = (orderId: string, status: ActiveOrder['status'], newEstimatedTime?: Date) => {
    setActiveOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status,
              ...(newEstimatedTime && { estimatedDeliveryTime: newEstimatedTime })
            }
          : order
      )
    );
  };

  const removeActiveOrder = (orderId: string) => {
    setActiveOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const getTimeRemaining = (orderId: string): number => {
    const order = activeOrders.find(o => o.id === orderId);
    if (!order) return 0;
    
    const now = new Date().getTime();
    const deliveryTime = new Date(order.estimatedDeliveryTime).getTime();
    return Math.max(0, deliveryTime - now);
  };

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