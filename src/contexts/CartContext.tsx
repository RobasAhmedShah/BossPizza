import React, { createContext, useContext, useState, useEffect } from 'react';
import { sessionManager } from '../lib/SessionManager';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  options?: Record<string, any>;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemKey: string) => void;
  updateQuantity: (itemKey: string, quantity: number) => void;
  clearCart: () => void;
  generateItemKey: (item: Omit<CartItem, 'quantity'> | CartItem) => string;
  forceReloadCart: () => void; // For debugging
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from session on mount
  useEffect(() => {
    const loadCartData = async () => {
      try {
        // Wait a bit to ensure session is initialized
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const session = sessionManager.loadSession();
        if (session?.cart?.items && Array.isArray(session.cart.items)) {
          setItems(session.cart.items);
          console.log(`🛒 Restored ${session.cart.items.length} items from cart cache`);
        } else {
          // Fallback to legacy localStorage
          const savedCart = localStorage.getItem('bigBossCart');
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) {
              setItems(parsedCart);
              console.log(`🛒 Restored ${parsedCart.length} items from legacy localStorage`);
              // Update session with legacy data
              sessionManager.updateCart(parsedCart);
            }
          }
        }
      } catch (error) {
        console.error('Error loading cart from session:', error);
        // Fallback to localStorage
        try {
          const savedCart = localStorage.getItem('bigBossCart');
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) {
              setItems(parsedCart);
              console.log(`🛒 Fallback: Restored ${parsedCart.length} items from localStorage`);
            }
          }
        } catch (fallbackError) {
          console.error('Error with localStorage fallback:', fallbackError);
        }
      } finally {
        setIsLoaded(true);
      }
    };

    loadCartData();
  }, []);

  // Save cart to session whenever items change (but only after initial load)
  useEffect(() => {
    if (!isLoaded) return; // Don't save until we've loaded initial data
    
    try {
      sessionManager.updateCart(items);
      // Also keep legacy localStorage for backward compatibility
      localStorage.setItem('bigBossCart', JSON.stringify(items));
      console.log(`💾 Saved ${items.length} items to cart storage`);
    } catch (error) {
      console.error('Error saving cart to session:', error);
    }
  }, [items, isLoaded]);

  const generateItemKey = (item: Omit<CartItem, 'quantity'> | CartItem) => {
    return `${item.id}-${JSON.stringify(item.options || {})}`;
  };

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    const itemKey = generateItemKey(newItem);
    
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => 
        generateItemKey(item) === itemKey
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      }

      // Add new item
      return [...prevItems, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (itemKey: string) => {
    setItems(prevItems => prevItems.filter(item => 
      generateItemKey(item) !== itemKey
    ));
  };

  const updateQuantity = (itemKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemKey);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item => {
        if (generateItemKey(item) === itemKey) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    console.log('🗑️ Clearing cart');
    setItems([]);
  };

  const forceReloadCart = () => {
    console.log('🔄 Force reloading cart from storage');
    setIsLoaded(false);
    
    setTimeout(() => {
      const loadCartData = async () => {
        try {
          const session = sessionManager.loadSession();
          if (session?.cart?.items && Array.isArray(session.cart.items)) {
            setItems(session.cart.items);
            console.log(`🛒 Force restored ${session.cart.items.length} items from session`);
          } else {
            const savedCart = localStorage.getItem('bigBossCart');
            if (savedCart) {
              const parsedCart = JSON.parse(savedCart);
              if (Array.isArray(parsedCart)) {
                setItems(parsedCart);
                console.log(`🛒 Force restored ${parsedCart.length} items from localStorage`);
              }
            }
          }
        } catch (error) {
          console.error('Error force reloading cart:', error);
        } finally {
          setIsLoaded(true);
        }
      };
      
      loadCartData();
    }, 100);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      generateItemKey,
      forceReloadCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};