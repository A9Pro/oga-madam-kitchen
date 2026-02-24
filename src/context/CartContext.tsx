"use client";

import {
  createContext, useContext, useState, useCallback,
  useEffect, ReactNode,
} from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  img: string;
  cat: string;
}

interface CartCtx {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, delta: number) => void;
  setQty: (id: number, qty: number) => void;
  clearCart: () => void;
  isInCart: (id: number) => boolean;
  getQty: (id: number) => number;
}

const CartContext = createContext<CartCtx>({
  items: [], cartCount: 0, subtotal: 0,
  addItem: () => {}, removeItem: () => {}, updateQty: () => {},
  setQty: () => {}, clearCart: () => {},
  isInCart: () => false, getQty: () => 0,
});

const STORAGE_KEY = "oga_madam_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever items change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items, hydrated]);

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal  = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const addItem = useCallback((item: Omit<CartItem, "qty">) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: number) =>
    setItems(prev => prev.filter(i => i.id !== id)), []);

  const updateQty = useCallback((id: number, delta: number) =>
    setItems(prev => prev
      .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
      .filter(i => i.qty > 0)
    ), []);

  const setQty = useCallback((id: number, qty: number) =>
    setItems(prev =>
      qty <= 0
        ? prev.filter(i => i.id !== id)
        : prev.map(i => i.id === id ? { ...i, qty } : i)
    ), []);

  const clearCart = useCallback(() => setItems([]), []);
  const isInCart  = useCallback((id: number) => items.some(i => i.id === id), [items]);
  const getQty    = useCallback((id: number) => items.find(i => i.id === id)?.qty ?? 0, [items]);

  return (
    <CartContext.Provider value={{
      items, cartCount, subtotal,
      addItem, removeItem, updateQty, setQty, clearCart, isInCart, getQty,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);