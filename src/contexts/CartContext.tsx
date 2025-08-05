import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('bigBossCart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      localStorage.removeItem('bigBossCart');
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('bigBossCart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

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
    setItems([]);
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