
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { CartItem as CartItemType, Product, SelectedCustomization } from '@/lib/types';

interface AddToCartPayload {
  product: Product;
  quantity: number;
  price: number;
  customizations: SelectedCustomization[];
}

// Generate a unique ID for a cart item based on product ID and customizations
const generateCartItemId = (productId: string, customizations: SelectedCustomization[]): string => {
  if (!customizations || customizations.length === 0) {
    return productId;
  }
  const customizationString = customizations
    .map(c => `${c.customizationId}:${c.optionValue}`)
    .sort()
    .join('|');
  return `${productId}-${customizationString}`;
};


interface CartContextType {
  cart: CartItemType[];
  addToCart: (item: AddToCartPayload) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (payload: AddToCartPayload) => {
    const newItemId = generateCartItemId(payload.product.id, payload.customizations);
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === newItemId);
      
      if (existingItemIndex > -1) {
        // Item with same customizations already exists, just update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += payload.quantity;
        return updatedCart;
      } else {
        // Add as a new item
        const newCartItem: CartItemType = {
          id: newItemId,
          product: payload.product,
          quantity: payload.quantity,
          price: payload.price,
          customizations: payload.customizations,
        };
        return [...prevCart, newCartItem];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
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
