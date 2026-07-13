"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type CartItem = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  image?: string;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (slug: string) => void;
  updateQty: (slug: string, delta: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((newItem: Omit<CartItem, "qty">) => {
    setItems(prev => {
      const existing = prev.find(i => i.slug === newItem.slug);
      if (existing) {
        return prev.map(i => i.slug === newItem.slug ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...newItem, qty: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems(prev => prev.filter(i => i.slug !== slug));
  }, []);

  const updateQty = useCallback((slug: string, delta: number) => {
    setItems(prev =>
      prev
        .map(i => i.slug === slug ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, isOpen, openCart, closeCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
