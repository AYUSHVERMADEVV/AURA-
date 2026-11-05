import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  discountCode: string;
  applyDiscountCode: (code: string) => boolean;
  total: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('aura_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(items));
    } catch (err) {
      console.warn('Failed to persist cart:', err);
    }
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        const maxStock = product.stock || 99;
        return prev.map((i) =>
          i.productId === product._id
            ? { ...i, quantity: Math.min(newQty, maxStock) }
            : i
        );
      } else {
        return [
          ...prev,
          {
            productId: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            quantity: Math.max(1, quantity),
            image: product.image,
            category: product.category,
            stock: product.stock,
          },
        ];
      }
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscountCode('');
    setDiscountPercent(0);
  };

  const applyDiscountCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WELCOME10') {
      setDiscountCode('WELCOME10');
      setDiscountPercent(0.1);
      return true;
    } else if (clean === 'AURA20') {
      setDiscountCode('AURA20');
      setDiscountPercent(0.2);
      return true;
    }
    return false;
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal === 0 || subtotal >= 150 ? 0 : 15;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const discount = Math.round(subtotal * discountPercent * 100) / 100;
  const total = Math.max(0, Math.round((subtotal + tax + shippingFee - discount) * 100) / 100);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        shippingFee,
        tax,
        discount,
        discountCode,
        applyDiscountCode,
        total,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
