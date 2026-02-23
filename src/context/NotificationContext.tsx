"use client";

import {
  createContext, useContext, useState, useCallback, ReactNode,
} from "react";

export type NotifCategory = "order" | "delivery" | "promo" | "loyalty" | "system" | "review";

export interface Notification {
  id: string;
  category: NotifCategory;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string;
  actionLabel?: string;
  actionHref?: string;
}

interface NotifCtx {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
  addNotification: (n: Omit<Notification, "id" | "read">) => void;
}

const SEED: Notification[] = [
  { id:"n1", category:"order",    title:"Order Confirmed 🎉",     body:"Your order #0042 (Jollof Rice & Chicken) is confirmed and being prepared.",                            time:"Just now",   read:false, icon:"✅", actionLabel:"Track Order",   actionHref:"/cart"    },
  { id:"n2", category:"delivery", title:"Out for Delivery 🚗",    body:"Your order #0041 is on the way! Driver is 15–20 min from your location.",                              time:"12 min ago", read:false, icon:"🚗", actionLabel:"Live Track",     actionHref:"/cart"    },
  { id:"n3", category:"promo",    title:"Weekend Special 🔥",     body:"This weekend only — 15% off all Pepper Soup orders. Use code SPICY15 at checkout.",                    time:"1 hr ago",   read:false, icon:"🔥", actionLabel:"Order Now",      actionHref:"/menu"    },
  { id:"n4", category:"loyalty",  title:"Points Earned 👑",       body:"You earned 220 loyalty points! You're 760 pts away from VIP status.",                                  time:"2 hr ago",   read:false, icon:"👑", actionLabel:"View Rewards",   actionHref:"/profile" },
  { id:"n5", category:"order",    title:"Order Delivered ✅",     body:"Your order #0041 has been delivered. Enjoy your meal!",                                                time:"Yesterday",  read:true,  icon:"🍽️", actionLabel:"Rate Order",      actionHref:"/profile" },
  { id:"n6", category:"review",   title:"Rate Your Experience ⭐", body:"How was your Egusi Soup? Share feedback and earn 50 bonus loyalty points.",                           time:"Yesterday",  read:true,  icon:"⭐", actionLabel:"Leave Review",   actionHref:"/profile" },
  { id:"n7", category:"promo",    title:"New Menu Item 🆕",       body:"Try our new Atieke with Cassava Fish — a bold West African favourite, now available.",                 time:"2 days ago", read:true,  icon:"🆕", actionLabel:"See Menu",       actionHref:"/menu"    },
  { id:"n8", category:"delivery", title:"Delivery Delayed ⚠️",    body:"Your order #0040 is running 10 min late due to traffic. We're sorry for the wait.",                   time:"3 days ago", read:true,  icon:"⚠️", actionLabel:"Track Order",    actionHref:"/cart"    },
  { id:"n9", category:"system",   title:"Welcome to Oga Madam 🙌", body:"Thanks for joining! Earn loyalty points on every order and unlock exclusive rewards.",               time:"Jan 15",     read:true,  icon:"🙌", actionLabel:"Explore Menu",  actionHref:"/menu"    },
];

const NotifContext = createContext<NotifCtx>({
  notifications:[], unreadCount:0,
  markRead:()=>{}, markAllRead:()=>{},
  dismiss:()=>{}, clearAll:()=>{}, addNotification:()=>{},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(SEED);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead        = useCallback((id: string) => setNotifications(p => p.map(n  => n.id === id ? { ...n, read: true } : n)), []);
  const markAllRead     = useCallback(()           => setNotifications(p => p.map(n  => ({ ...n, read: true }))), []);
  const dismiss         = useCallback((id: string) => setNotifications(p => p.filter(n => n.id !== id)), []);
  const clearAll        = useCallback(()           => setNotifications([]), []);
  const addNotification = useCallback((n: Omit<Notification, "id" | "read">) =>
    setNotifications(p => [{ ...n, id:`n_${Date.now()}`, read:false }, ...p]), []);

  return (
    <NotifContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, dismiss, clearAll, addNotification }}>
      {children}
    </NotifContext.Provider>
  );
}

export const useNotifications = () => useContext(NotifContext);