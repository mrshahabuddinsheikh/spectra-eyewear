'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateShippingFee, FREE_SHIPPING_THRESHOLD } from '../lib/pak-cities';

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  frameShape: string;
  frameMaterial: string;
  lensTint: string;
  frameColor: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  shippingFee: number;
  discount: number;
  discountCode: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  total: number;
  totalCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [freeShippingCoupon, setFreeShippingCoupon] = useState<boolean>(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('spectra-cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem('spectra-coupon');
      if (savedCoupon) {
        applyCoupon(savedCoupon);
      }
    } catch (e) {
      console.warn('Error loading cart state:', e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('spectra-cart', JSON.stringify(items));
    } catch (e) {
      console.warn('Error saving cart state:', e);
    }
  }, [items]);

  const addItem = (item: Omit<CartItem, 'id'>) => {
    setItems((prev) => {
      // Check if identical item already exists
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.frameShape === item.frameShape &&
          i.frameMaterial === item.frameMaterial &&
          i.lensTint === item.lensTint &&
          i.frameColor === item.frameColor
      );

      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      }

      const newItem: CartItem = {
        ...item,
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      };
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  };

  const clearCart = () => {
    setItems([]);
    setDiscountCode(null);
    setDiscountPercent(0);
    setFreeShippingCoupon(false);
    localStorage.removeItem('spectra-coupon');
  };

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'VIPCOD15' || clean === 'LUCKY15') {
      setDiscountCode(clean);
      setDiscountPercent(0.15);
      setFreeShippingCoupon(false);
      localStorage.setItem('spectra-coupon', clean);
      return true;
    }
    if (clean === 'SPECTRA10' || clean === 'LUCKY10') {
      setDiscountCode(clean);
      setDiscountPercent(0.10);
      setFreeShippingCoupon(false);
      localStorage.setItem('spectra-coupon', clean);
      return true;
    }
    if (clean === 'FREESHIP') {
      setDiscountCode(clean);
      setDiscountPercent(0);
      setFreeShippingCoupon(true);
      localStorage.setItem('spectra-coupon', clean);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setDiscountCode(null);
    setDiscountPercent(0);
    setFreeShippingCoupon(false);
    localStorage.removeItem('spectra-coupon');
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.round(subtotal * discountPercent);
  const standardShipping = calculateShippingFee(subtotal);
  const shippingFee = freeShippingCoupon ? 0 : standardShipping;
  const total = Math.max(0, subtotal - discount + shippingFee);
  const totalCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        shippingFee,
        discount,
        discountCode,
        applyCoupon,
        removeCoupon,
        total,
        totalCount,
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
