"use client";

import {
  createContext, useContext, useState, useCallback, ReactNode,
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
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartCtx>({
  items: [], cartCount: 0,
  addItem: () => {}, removeItem: () => {}, updateQty: () => {}, clearCart: () => {},
});

// Seed with 3 items so the cart counter is visible on first load
const SEED_ITEMS: CartItem[] = [
  { id: 1, name: "Jollof Rice & Chicken", price: 18.99, qty: 1, img: "/images/jollof.jpg",      cat: "Mains"  },
  { id: 2, name: "Goat Meat Pepper Soup", price: 22.00, qty: 1, img: "/images/pepper-soup.jpg", cat: "Soups"  },
  { id: 3, name: "Puff Puff",             price: 0.90,  qty: 4, img: "/images/jollof.jpg",      cat: "Snacks" },
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(SEED_ITEMS);

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);

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
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    )), []);

  const clearCart = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider value={{ items, cartCount, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);