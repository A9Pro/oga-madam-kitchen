import { createClient } from "@supabase/supabase-js";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/* ─── Typed helpers ──────────────────────────── */
export type Profile = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  loyalty_points: number;
  tier: "Silver" | "Gold" | "VIP";
  created_at: string;
};

export type Address = {
  id: string;
  user_id: string;
  label: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  zip: string;
  is_default: boolean;
};

export type Order = {
  id: string;
  user_id: string;
  status: "Pending" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";
  total: number;
  type: "pickup" | "delivery";
  address_id: string | null;
  created_at: string;
  items: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  dish_id: number;
  dish_name: string;
  quantity: number;
  unit_price: number;
};