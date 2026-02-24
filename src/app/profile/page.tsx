"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useSpoonCursor } from "@/hooks/useSpoonCursor";
import type { Address, Order } from "@/lib/supabase";

const GOLD  = "#D4A843";
const GOLD2 = "#F0C060";
const RED   = "#C0392B";

/* ─────────────────────────────────────────
   BADGE DEFINITIONS
───────────────────────────────────────── */
const ALL_BADGES = [
  { id: "first",    icon: "🥇", label: "First Order",      desc: "Placed your first order"        },
  { id: "loyal",    icon: "👑", label: "Loyal Customer",    desc: "10+ orders placed"              },
  { id: "spicy",    icon: "🔥", label: "Spice Lover",       desc: "Ordered pepper soup 3x"         },
  { id: "bigorder", icon: "🎯", label: "Big Spender",       desc: "Single order over $50"          },
  { id: "reviewer", icon: "⭐", label: "Top Reviewer",      desc: "Left 5 reviews"                 },
  { id: "vip",      icon: "💎", label: "VIP Member",        desc: "Reached VIP tier"               },
];

type Tab = "overview" | "orders" | "favourites" | "addresses" | "settings" | "notifications";
type AuthMode = "login" | "signup" | "verify" | "forgot";

/* ─────────────────────────────────────────
   TOAST
───────────────────────────────────────── */
function Toast({ msg, show, type = "success" }: { msg: string; show: boolean; type?: "success" | "error" }) {
  return (
    <div style={{
      position: "fixed", bottom: 90, left: "50%",
      transform: `translateX(-50%) translateY(${show ? 0 : 20}px)`,
      opacity: show ? 1 : 0, pointerEvents: "none",
      zIndex: 9999, borderRadius: 999, padding: "12px 24px",
      background: type === "error" ? "#1a0606" : "#111009",
      border: `1px solid ${type === "error" ? "rgba(192,57,43,.5)" : "rgba(212,168,67,.35)"}`,
      display: "flex", alignItems: "center", gap: 10,
      fontSize: 13, fontWeight: 600, color: "#fff",
      boxShadow: "0 16px 48px rgba(0,0,0,.6)",
      transition: "all .38s cubic-bezier(.23,1,.32,1)",
    }}>
      <span style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
        background: type === "error" ? RED : GOLD,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, color: "#fff", fontWeight: 800,
      }}>{type === "error" ? "✕" : "✓"}</span>
      {msg}
    </div>
  );
}

/* ─────────────────────────────────────────
   TOGGLE
───────────────────────────────────────── */
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} style={{
      width: 46, height: 26, borderRadius: 999,
      background: on ? GOLD : "rgba(255,255,255,.12)",
      border: "none", cursor: "pointer", position: "relative",
      transition: "background .3s", flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: 3, left: on ? 22 : 3,
        width: 20, height: 20, borderRadius: "50%", background: "#fff",
        transition: "left .3s cubic-bezier(.23,1,.32,1)",
        boxShadow: "0 1px 4px rgba(0,0,0,.3)",
      }}/>
    </button>
  );
}

/* ─────────────────────────────────────────
   AUTH MODAL
───────────────────────────────────────── */
function AuthModal({
  onClose, isDark, fg, fg2, fg3, card, cardBdr, inputBg,
}: {
  onClose: () => void;
  isDark: boolean; fg: string; fg2: string; fg3: string;
  card: string; cardBdr: string; inputBg: string;
}) {
  const { signIn, signUp, signInGoogle } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr(""); setLoading(true);
    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) setErr(error.message);
      else onClose();
    } else if (mode === "signup") {
      if (!name.trim()) { setErr("Please enter your name."); setLoading(false); return; }
      const { error } = await signUp(email, password, name);
      if (error) setErr(error.message);
      else setMode("verify");
    } else if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/profile`,
      });
      if (error) setErr(error.message);
      else setMode("verify");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setErr(""); setLoading(true);
    const { error } = await signInGoogle();
    if (error) { setErr(error.message); setLoading(false); }
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: 12,
    border: `1px solid ${cardBdr}`, background: inputBg,
    color: fg, fontSize: 14, outline: "none",
    fontFamily: "'Outfit',sans-serif", boxSizing: "border-box" as const,
    transition: "border-color .25s",
  };

  return (
    /* Backdrop */
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 800,
        background: "rgba(0,0,0,.72)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, animation: "fadeIn .2s ease both",
      }}>
      <div style={{
        background: card, border: `1px solid ${cardBdr}`, borderRadius: 28,
        width: "100%", maxWidth: 440, padding: "40px 36px",
        boxShadow: "0 40px 100px rgba(0,0,0,.6)",
        animation: "slideUp .3s cubic-bezier(.23,1,.32,1) both",
        position: "relative", maxHeight: "90vh", overflowY: "auto",
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: 18, right: 18,
          width: 32, height: 32, borderRadius: "50%",
          background: isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)",
          border: "none", color: fg2, fontSize: 18, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>×</button>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 9, letterSpacing: ".5em", textTransform: "uppercase",
            color: GOLD, fontWeight: 700, marginBottom: 4 }}>OGA</div>
          <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: 26, fontWeight: 600, color: fg, lineHeight: 1.1 }}>
            Madam Kitchen
          </div>
        </div>

        {/* Verify screen */}
        {mode === "verify" ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 18 }}>📬</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: 24, fontWeight: 600, color: fg, marginBottom: 12 }}>
              Check your email
            </h2>
            <p style={{ fontSize: 14, color: fg2, lineHeight: 1.7, marginBottom: 24 }}>
              We sent a {mode === "verify" && password ? "verification" : "reset"} link to <strong style={{ color: fg }}>{email}</strong>.
              Click it to continue.
            </p>
            <button onClick={() => setMode("login")}
              style={{ fontSize: 13, color: GOLD, background: "none", border: "none",
                cursor: "pointer", fontWeight: 600 }}>
              Back to login →
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            {mode !== "forgot" && (
              <div style={{ display: "flex", background: isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.05)",
                borderRadius: 12, padding: 4, marginBottom: 28, gap: 4 }}>
                {(["login", "signup"] as AuthMode[]).map(m => (
                  <button key={m} onClick={() => { setMode(m); setErr(""); }}
                    style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: "none",
                      background: mode === m ? card : "transparent",
                      color: mode === m ? fg : fg2,
                      fontSize: 13, fontWeight: mode === m ? 700 : 400,
                      cursor: "pointer", transition: "all .25s",
                      boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,.12)" : "none" }}>
                    {m === "login" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>
            )}

            {mode === "forgot" && (
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                  fontSize: 22, fontWeight: 600, color: fg, marginBottom: 6 }}>
                  Reset Password
                </h2>
                <p style={{ fontSize: 13, color: fg2 }}>
                  Enter your email and we&apos;ll send a reset link.
                </p>
              </div>
            )}

            {/* Google */}
            {mode !== "forgot" && (
              <>
                <button onClick={handleGoogle} disabled={loading}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 12,
                    border: `1px solid ${cardBdr}`, background: inputBg,
                    color: fg, fontSize: 14, fontWeight: 600,
                    cursor: "pointer", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 10, transition: "all .25s",
                    marginBottom: 16, opacity: loading ? .6 : 1 }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `${GOLD}66`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = cardBdr)}>
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Continue with Google
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ flex: 1, height: 1, background: cardBdr }}/>
                  <span style={{ fontSize: 11, color: fg3, letterSpacing: ".08em",
                    textTransform: "uppercase" }}>or</span>
                  <div style={{ flex: 1, height: 1, background: cardBdr }}/>
                </div>
              </>
            )}

            {/* Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mode === "signup" && (
                <input placeholder="Full Name" value={name}
                  onChange={e => setName(e.target.value)} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = `${GOLD}88`)}
                  onBlur={e => (e.currentTarget.style.borderColor = cardBdr)}/>
              )}
              <input placeholder="Email address" type="email" value={email}
                onChange={e => setEmail(e.target.value)} style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = `${GOLD}88`)}
                onBlur={e => (e.currentTarget.style.borderColor = cardBdr)}/>
              {mode !== "forgot" && (
                <div style={{ position: "relative" }}>
                  <input placeholder={mode === "login" ? "Password" : "Create password (min 8 chars)"}
                    type={showPass ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: 48 }}
                    onFocus={e => (e.currentTarget.style.borderColor = `${GOLD}88`)}
                    onBlur={e => (e.currentTarget.style.borderColor = cardBdr)}
                    onKeyDown={e => e.key === "Enter" && submit()}/>
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    style={{ position: "absolute", right: 14, top: "50%",
                      transform: "translateY(-50%)", background: "none",
                      border: "none", color: fg3, cursor: "pointer", fontSize: 13 }}>
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              )}
            </div>

            {/* Error */}
            {err && (
              <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10,
                background: "rgba(192,57,43,.12)", border: "1px solid rgba(192,57,43,.3)",
                fontSize: 13, color: "#e74c3c" }}>
                {err}
              </div>
            )}

            {/* Forgot link */}
            {mode === "login" && (
              <button onClick={() => { setMode("forgot"); setErr(""); }}
                style={{ display: "block", marginTop: 10, fontSize: 12,
                  color: fg3, background: "none", border: "none",
                  cursor: "pointer", textAlign: "right", width: "100%" }}>
                Forgot password?
              </button>
            )}

            {/* Submit */}
            <button onClick={submit} disabled={loading}
              style={{ width: "100%", marginTop: 20, padding: "14px",
                borderRadius: 12, background: GOLD, color: "#000",
                border: "none", fontSize: 14, fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                opacity: loading ? .7 : 1, transition: "all .25s",
                fontFamily: "'Outfit',sans-serif", letterSpacing: ".04em" }}
              onMouseEnter={e => !loading && ((e.currentTarget.style.background = GOLD2))}
              onMouseLeave={e => (e.currentTarget.style.background = GOLD)}>
              {loading ? "Please wait…" :
                mode === "login"  ? "Sign In" :
                mode === "signup" ? "Create Account" : "Send Reset Link"}
            </button>

            {/* Terms */}
            {mode === "signup" && (
              <p style={{ fontSize: 11, color: fg3, textAlign: "center",
                marginTop: 14, lineHeight: 1.6 }}>
                By signing up you agree to our Terms of Service and Privacy Policy.
                A verification email will be sent to confirm your address.
              </p>
            )}

            {mode === "forgot" && (
              <button onClick={() => { setMode("login"); setErr(""); }}
                style={{ display: "block", margin: "14px auto 0",
                  fontSize: 12, color: fg3, background: "none",
                  border: "none", cursor: "pointer" }}>
                ← Back to Sign In
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function ProfilePage() {
  const { isDark, toggleTheme } = useTheme();
  const { addItem, isInCart, cartCount } = useCart();
  const { user, profile, loading: authLoading, profileLoading, signOut, updateProfile, refreshProfile } = useAuth();
  const router = useRouter();
  useSpoonCursor();

  const [activeTab,    setActiveTab]    = useState<Tab>("overview");
  const [showAuth,     setShowAuth]     = useState(false);
  const [orders,       setOrders]       = useState<Order[]>([]);
  const [addresses,    setAddresses]    = useState<Address[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [notifications,setNotifications]= useState<any[]>([]);
  const [dataLoading,  setDataLoading]  = useState(false);
  const [toast,        setToast]        = useState({ msg: "", show: false, type: "success" as "success"|"error" });

  /* Settings form state */
  const [editName,  setEditName]  = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving,    setSaving]    = useState(false);
  const [notifOn,   setNotifOn]   = useState(true);
  const [emailOn,   setEmailOn]   = useState(true);

  /* Address form */
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm] = useState({ label:"Home", line1:"", line2:"", city:"", state:"", zip:"", is_default:false });
  const [savingAddr, setSavingAddr] = useState(false);

  const bg      = isDark ? "#080706"               : "#FAF7F2";
  const bg2     = isDark ? "#0E0C0A"               : "#F0EAE0";
  const fg      = isDark ? "#FFFFFF"               : "#0D0B09";
  const fg2     = isDark ? "rgba(255,255,255,.55)" : "rgba(13,11,9,.55)";
  const fg3     = isDark ? "rgba(255,255,255,.22)" : "rgba(13,11,9,.22)";
  const card    = isDark ? "#111009"               : "#FFFFFF";
  const cardBdr = isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)";
  const inputBg = isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)";

  const showToast = useCallback((msg: string, type: "success"|"error" = "success") => {
    setToast({ msg, show: true, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
  }, []);

  /* Load user data when logged in */
  useEffect(() => {
    if (!user) return;
    setEditName(profile?.full_name ?? "");
    setEditPhone(profile?.phone ?? "");
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile]);

  const loadData = async () => {
    if (!user) return;
    setDataLoading(true);
    try {
      const [ordersRes, addrRes, badgesRes, notifsRes] = await Promise.all([
        supabase.from("orders").select("*, items:order_items(*)").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false }),
        supabase.from("badges").select("badge_id").eq("user_id", user.id),
        supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      ]);
      if (ordersRes.data) setOrders(ordersRes.data as Order[]);
      if (addrRes.data)   setAddresses(addrRes.data as Address[]);
      if (badgesRes.data) setEarnedBadges(badgesRes.data.map((b: any) => b.badge_id));
      if (notifsRes.data) setNotifications(notifsRes.data);
    } catch (e) { console.error(e); }
    setDataLoading(false);
  };

  /* Loyalty */
  const points    = profile?.loyalty_points ?? 0;
  const nextTier  = points >= 2000 ? 3000 : 2000;
  const prevTier  = points >= 2000 ? 2000 : points >= 1000 ? 1000 : 0;
  const progress  = Math.round(((points - prevTier) / (nextTier - prevTier)) * 100);
  const tier      = profile?.tier ?? "Silver";
  const tierColor = tier === "VIP" ? "#9b59b6" : tier === "Gold" ? GOLD : "#95a5a6";

  /* Save profile */
  const saveProfile = async () => {
    setSaving(true);
    const { error } = await updateProfile({ full_name: editName.trim(), phone: editPhone.trim() });
    if (error) showToast(error.message, "error");
    else showToast("Profile updated!");
    setSaving(false);
  };

  /* Save address */
  const saveAddress = async () => {
    if (!user || !addrForm.line1 || !addrForm.city || !addrForm.zip) {
      showToast("Please fill in all required address fields.", "error"); return;
    }
    setSavingAddr(true);
    const { error } = await supabase.from("addresses").insert({ ...addrForm, user_id: user.id });
    if (error) showToast(error.message, "error");
    else { showToast("Address saved!"); setShowAddrForm(false); setAddrForm({ label:"Home", line1:"", line2:"", city:"", state:"", zip:"", is_default:false }); await loadData(); }
    setSavingAddr(false);
  };

  const deleteAddress = async (id: string) => {
    await supabase.from("addresses").delete().eq("id", id);
    await loadData();
    showToast("Address removed.");
  };

  const setDefaultAddress = async (id: string) => {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user!.id);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    await loadData();
    showToast("Default address updated.");
  };

  const markNotifRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismissNotif = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSignOut = async () => {
    await signOut();
    showToast("Signed out.");
  };

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "overview",       label: "Overview",       icon: "◉"  },
    { id: "orders",         label: "Orders",         icon: "📦" },
    { id: "favourites",     label: "Favourites",     icon: "❤️" },
    { id: "addresses",      label: "Addresses",      icon: "📍" },
    { id: "notifications",  label: "Notifications",  icon: "🔔" },
    { id: "settings",       label: "Settings",       icon: "⚙️" },
  ];

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 12,
    border: `1px solid ${cardBdr}`, background: inputBg,
    color: fg, fontSize: 14, outline: "none",
    fontFamily: "'Outfit',sans-serif", boxSizing: "border-box" as const,
    transition: "border-color .25s",
  };

  const statusColor: Record<string, string> = {
    "Delivered":         "#27ae60",
    "Out for Delivery":  GOLD,
    "Preparing":         "#e67e22",
    "Pending":           "#95a5a6",
    "Cancelled":         "#e74c3c",
  };

  /* ── Loading skeleton ── */
  if (authLoading) {
    return (
      <div style={{ minHeight: "100svh", background: bg, display: "flex",
        alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%",
          border: `3px solid ${GOLD}44`, borderTopColor: GOLD,
          animation: "spin 0.8s linear infinite" }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(28px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @media(pointer:fine){ body, a, button, input, select, textarea, [role='button']{ cursor:none !important; } }
        .tab-btn:hover { color: ${GOLD} !important; background: rgba(212,168,67,.06) !important; }
        .order-card:hover { border-color: rgba(212,168,67,.3) !important; transform: translateY(-2px) !important; }
        .notif-row:hover { background: rgba(212,168,67,.04) !important; }
        .addr-card:hover { border-color: rgba(212,168,67,.3) !important; }
        .save-btn:hover { background: ${GOLD2} !important; transform: translateY(-1px) !important; }
        .logout-btn:hover { background: rgba(192,57,43,.1) !important; color: #e74c3c !important; border-color: rgba(192,57,43,.3) !important; }
        .reorder-btn:hover { background: rgba(212,168,67,.12) !important; }
        @media(max-width:768px){
          .profile-hero { padding: 100px 20px 28px !important; }
          .profile-layout { flex-direction: column !important; padding: 16px 16px 90px !important; gap: 0 !important; }
          .profile-sidebar { width: 100% !important; position: static !important; flex-direction: row !important;
            overflow-x: auto !important; gap: 4px !important; padding: 12px 0 !important;
            scrollbar-width: none !important; margin-bottom: 20px !important; }
          .profile-sidebar::-webkit-scrollbar { display: none; }
          .tab-btn { flex-direction: column !important; padding: 8px 12px !important; font-size: 10px !important;
            white-space: nowrap !important; gap: 4px !important; border-left: none !important;
            border-bottom: 3px solid transparent !important; }
          .tab-btn.active-tab { border-bottom-color: ${GOLD} !important; }
          .tab-icon { font-size: 18px !important; }
          .badges-grid { grid-template-columns: repeat(3,1fr) !important; }
          .stats-grid  { grid-template-columns: repeat(3,1fr) !important; }
          .ord-meta    { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
          .addr-row    { flex-direction: column !important; align-items: flex-start !important; }
          .addr-actions { margin-top: 10px !important; }
        }
      `}</style>

      <Toast msg={toast.msg} show={toast.show} type={toast.type}/>

      {/* Auth modal — shown when logged out */}
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)}
          isDark={isDark} fg={fg} fg2={fg2} fg3={fg3}
          card={card} cardBdr={cardBdr} inputBg={inputBg}/>
      )}

      {/* ── HERO ── */}
      <div className="profile-hero" style={{
        background: bg2, borderBottom: `1px solid ${cardBdr}`,
        padding: "110px 56px 36px", transition: "background .5s",
      }}>
        <button onClick={() => router.back()}
          style={{ display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none", color: fg2,
            fontSize: 13, cursor: "pointer", marginBottom: 20, padding: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
          onMouseLeave={e => (e.currentTarget.style.color = fg2)}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </button>

        {user && profile ? (
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name}
                  style={{ width: 72, height: 72, borderRadius: "50%",
                    objectFit: "cover", border: `3px solid ${GOLD}` }}/>
              ) : (
                <div style={{ width: 72, height: 72, borderRadius: "50%",
                  background: `linear-gradient(135deg,${GOLD},#8B6914)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, fontWeight: 700, color: "#000",
                  border: `3px solid ${GOLD}` }}>
                  {(profile.full_name || profile.email).charAt(0).toUpperCase()}
                </div>
              )}
              <span style={{ position: "absolute", bottom: 0, right: 0,
                width: 18, height: 18, borderRadius: "50%",
                background: "#27ae60", border: `2px solid ${bg2}` }}/>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                  fontWeight: 300, fontSize: "clamp(1.8rem,4vw,3rem)",
                  color: fg, lineHeight: 1, transition: "color .4s" }}>
                  {profile.full_name || "My Profile"}
                </h1>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
                  textTransform: "uppercase", padding: "4px 12px", borderRadius: 999,
                  background: `${tierColor}22`, color: tierColor,
                  border: `1px solid ${tierColor}55` }}>{tier} Member</span>
              </div>
              <p style={{ fontSize: 13, color: fg2, marginTop: 4 }}>
                {profile.email} · {points.toLocaleString()} loyalty pts
              </p>
            </div>
          </div>
        ) : (
          /* Logged-out hero */
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%",
              background: isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)",
              border: `2px dashed ${GOLD}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, flexShrink: 0 }}>👤</div>
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontWeight: 300, fontSize: "clamp(1.8rem,4vw,2.4rem)",
                color: fg, lineHeight: 1, marginBottom: 8 }}>
                My Profile
              </h1>
              <button onClick={() => setShowAuth(true)}
                style={{ padding: "10px 28px", borderRadius: 999,
                  background: GOLD, color: "#000", border: "none",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  transition: "all .25s" }}
                onMouseEnter={e => (e.currentTarget.style.background = GOLD2)}
                onMouseLeave={e => (e.currentTarget.style.background = GOLD)}>
                Sign In / Create Account →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── LAYOUT ── */}
      <div className="profile-layout" style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "32px 56px 80px",
        display: "flex", gap: 28, alignItems: "flex-start",
        background: bg, transition: "background .5s", minHeight: "60vh",
      }}>

        {/* ── SIDEBAR ── */}
        <div className="profile-sidebar" style={{
          width: 210, flexShrink: 0, position: "sticky", top: 90,
          display: "flex", flexDirection: "column", gap: 2,
        }}>
          {TABS.map(t => (
            <button key={t.id}
              className={`tab-btn${activeTab === t.id ? " active-tab" : ""}`}
              onClick={() => { if (!user && t.id !== "overview") { setShowAuth(true); return; } setActiveTab(t.id); }}
              style={{ display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", borderRadius: 14, border: "none",
                background: activeTab === t.id ? "rgba(212,168,67,.1)" : "transparent",
                color: activeTab === t.id ? GOLD : fg2,
                fontSize: 13, fontWeight: activeTab === t.id ? 700 : 400,
                cursor: "pointer", textAlign: "left",
                borderLeft: activeTab === t.id ? `3px solid ${GOLD}` : "3px solid transparent",
                transition: "all .2s" }}>
              <span className="tab-icon" style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
              {/* Notification badge */}
              {t.id === "notifications" && notifications.filter(n => !n.read).length > 0 && (
                <span style={{ marginLeft: "auto", minWidth: 18, height: 18,
                  borderRadius: 999, background: RED, color: "#fff",
                  fontSize: 9, fontWeight: 800, display: "flex",
                  alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
          ))}

          <div style={{ height: 1, background: cardBdr, margin: "8px 4px" }}/>

          {user ? (
            <button className="logout-btn" onClick={handleSignOut}
              style={{ display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", borderRadius: 14,
                border: `1px solid ${cardBdr}`, background: "transparent",
                color: fg2, fontSize: 13, fontWeight: 500, cursor: "pointer",
                transition: "all .25s" }}>
              <span style={{ fontSize: 16 }}>🚪</span> Sign Out
            </button>
          ) : (
            <button onClick={() => setShowAuth(true)}
              style={{ display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", borderRadius: 14,
                border: `1px solid ${GOLD}44`, background: "rgba(212,168,67,.08)",
                color: GOLD, fontSize: 13, fontWeight: 700, cursor: "pointer",
                transition: "all .25s" }}>
              <span style={{ fontSize: 16 }}>🔑</span> Sign In
            </button>
          )}
        </div>

        {/* ── CONTENT ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Logged-out gate */}
          {!user && activeTab !== "overview" && (
            <div style={{ textAlign: "center", padding: "80px 20px",
              background: card, border: `1px solid ${cardBdr}`, borderRadius: 22 }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🔒</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: 26, fontWeight: 300, color: fg, marginBottom: 12 }}>
                Sign in to continue
              </h2>
              <p style={{ fontSize: 14, color: fg2, marginBottom: 24 }}>
                Create an account or sign in to view your {activeTab}.
              </p>
              <button onClick={() => setShowAuth(true)}
                style={{ padding: "12px 32px", borderRadius: 999,
                  background: GOLD, color: "#000", border: "none",
                  fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Sign In / Create Account
              </button>
            </div>
          )}

          {/* ══ OVERVIEW ══ */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeUp .4s ease" }}>

              {!user && (
                <div style={{ background: `linear-gradient(135deg,rgba(212,168,67,.08),rgba(212,168,67,.03))`,
                  border: `1px solid ${GOLD}33`, borderRadius: 22, padding: "28px 30px",
                  textAlign: "center" }}>
                  <div style={{ fontSize: 44, marginBottom: 14 }}>🍽️</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                    fontSize: 24, fontWeight: 300, color: fg, marginBottom: 10 }}>
                    Welcome to Oga Madam Kitchen
                  </h2>
                  <p style={{ fontSize: 14, color: fg2, lineHeight: 1.75, marginBottom: 22, maxWidth: 380, margin: "0 auto 22px" }}>
                    Sign in to track your orders, earn loyalty points, save addresses and more.
                  </p>
                  <button onClick={() => setShowAuth(true)}
                    style={{ padding: "12px 32px", borderRadius: 999,
                      background: GOLD, color: "#000", border: "none",
                      fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    Get Started →
                  </button>
                </div>
              )}

              {user && profile && (
                <>
                  {/* Loyalty card */}
                  <div style={{ background: `linear-gradient(135deg,#1A1400,#2A1F00)`,
                    border: `1px solid ${GOLD}33`, borderRadius: 22, padding: "26px 28px",
                    position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -60, right: -60,
                      width: 220, height: 220, borderRadius: "50%",
                      background: `radial-gradient(circle,${GOLD}1A,transparent 70%)`,
                      pointerEvents: "none" }}/>
                    <div style={{ display: "flex", justifyContent: "space-between",
                      alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <span style={{ fontSize: 9, letterSpacing: ".5em", textTransform: "uppercase",
                          color: GOLD, fontWeight: 700 }}>Loyalty Rewards</span>
                        <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                          fontSize: 38, fontWeight: 600, color: "#fff", lineHeight: 1, marginTop: 6 }}>
                          {points.toLocaleString()}
                          <span style={{ fontSize: 14, color: GOLD, fontWeight: 400, marginLeft: 6 }}>pts</span>
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 12, color: tierColor, fontWeight: 700,
                          letterSpacing: ".1em", textTransform: "uppercase" }}>{tier}</span>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 3 }}>
                          {nextTier - points} pts to {tier === "Gold" ? "VIP" : tier === "Silver" ? "Gold" : "max"}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,.45)" }}>Progress</span>
                      <span style={{ fontSize: 11, color: GOLD, fontWeight: 700 }}>{progress}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 999, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${progress}%`, borderRadius: 999,
                        background: `linear-gradient(90deg,${GOLD},${GOLD2})`,
                        transition: "width 1.2s ease", boxShadow: `0 0 14px ${GOLD}88` }}/>
                    </div>
                    {/* Milestones */}
                    <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
                      {[{ pts:500, reward:"Free Puff Puff"},{pts:1000,reward:"10% off"},{pts:2000,reward:"Free Jollof"}].map(r => (
                        <div key={r.pts} style={{ flex: 1, minWidth: 110,
                          background: points >= r.pts ? `${GOLD}18` : "rgba(255,255,255,.04)",
                          border: `1px solid ${points >= r.pts ? `${GOLD}44` : "rgba(255,255,255,.08)"}`,
                          borderRadius: 12, padding: "10px 14px" }}>
                          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".06em",
                            color: points >= r.pts ? GOLD : "rgba(255,255,255,.25)",
                            textTransform: "uppercase" }}>{r.pts} pts</p>
                          <p style={{ fontSize: 12, color: points >= r.pts ? "#fff" : "rgba(255,255,255,.25)", marginTop: 3 }}>{r.reward}</p>
                          {points >= r.pts && <p style={{ fontSize: 10, color: "#27ae60", marginTop: 4, fontWeight: 700 }}>✓ Unlocked</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
                    {[
                      { label: "Total Orders",  val: orders.length,                                          icon: "📦" },
                      { label: "Total Spent",    val: `$${orders.reduce((s,o)=>s+Number(o.total),0).toFixed(2)}`, icon: "💰" },
                      { label: "Loyalty Points", val: points.toLocaleString(),                                icon: "⭐" },
                      { label: "Badges Earned",  val: `${earnedBadges.length}/${ALL_BADGES.length}`,          icon: "🏅" },
                    ].map(s => (
                      <div key={s.label} style={{ background: card, border: `1px solid ${cardBdr}`,
                        borderRadius: 18, padding: "18px 16px", textAlign: "center" }}>
                        <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                        <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                          fontSize: 20, fontWeight: 700, color: GOLD, marginBottom: 4 }}>{s.val}</p>
                        <p style={{ fontSize: 10, color: fg2, letterSpacing: ".06em",
                          textTransform: "uppercase" }}>{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Badges */}
                  <div style={{ background: card, border: `1px solid ${cardBdr}`,
                    borderRadius: 22, padding: "24px 26px" }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                      fontSize: 20, fontWeight: 600, color: fg, marginBottom: 16 }}>Your Badges</h3>
                    <div className="badges-grid" style={{ display: "grid",
                      gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
                      {ALL_BADGES.map(b => {
                        const earned = earnedBadges.includes(b.id);
                        return (
                          <div key={b.id} title={b.desc}
                            style={{ textAlign: "center", padding: "14px 8px", borderRadius: 16,
                              background: earned ? "rgba(212,168,67,.08)" : inputBg,
                              border: `1px solid ${earned ? `${GOLD}33` : cardBdr}`,
                              opacity: earned ? 1 : .35,
                              transition: "transform .2s",
                              transform: "scale(1)" }}
                            onMouseEnter={e => earned && ((e.currentTarget.style.transform = "scale(1.08)"))}
                            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                            <div style={{ fontSize: 26, marginBottom: 6, filter: earned ? "none" : "grayscale(1)" }}>{b.icon}</div>
                            <p style={{ fontSize: 9.5, fontWeight: 600, color: earned ? GOLD : fg3,
                              letterSpacing: ".04em", lineHeight: 1.3 }}>{b.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent order preview */}
                  {orders.length > 0 && (
                    <div style={{ background: card, border: `1px solid ${cardBdr}`,
                      borderRadius: 22, padding: "24px 26px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                          fontSize: 20, fontWeight: 600, color: fg }}>Latest Order</h3>
                        <button onClick={() => setActiveTab("orders")}
                          style={{ fontSize: 12, color: GOLD, background: "none",
                            border: "none", cursor: "pointer", fontWeight: 600 }}>
                          View all →
                        </button>
                      </div>
                      {(() => {
                        const o = orders[0];
                        return (
                          <div style={{ display: "flex", justifyContent: "space-between",
                            alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                            <div>
                              <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                                fontSize: 17, fontWeight: 600, color: fg }}>
                                Order #{o.id.slice(-6).toUpperCase()}
                              </span>
                              <p style={{ fontSize: 12, color: fg2, marginTop: 2 }}>
                                {new Date(o.created_at).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })}
                              </p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".07em",
                                textTransform: "uppercase", padding: "4px 12px", borderRadius: 999,
                                background: `${statusColor[o.status] ?? "#95a5a6"}18`,
                                color: statusColor[o.status] ?? "#95a5a6",
                                border: `1px solid ${statusColor[o.status] ?? "#95a5a6"}44` }}>
                                {o.status}
                              </span>
                              <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                                fontSize: 20, fontWeight: 700, color: GOLD }}>
                                ${Number(o.total).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══ ORDERS ══ */}
          {activeTab === "orders" && user && (
            <div style={{ animation: "fadeUp .4s ease" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: 26, fontWeight: 300, color: fg, marginBottom: 20 }}>Order History</h2>
              {dataLoading ? (
                <div style={{ textAlign: "center", padding: 60, color: fg2 }}>Loading orders…</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px",
                  background: card, border: `1px solid ${cardBdr}`, borderRadius: 22 }}>
                  <div style={{ fontSize: 48, marginBottom: 14 }}>📦</div>
                  <p style={{ fontSize: 16, color: fg2, fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
                    No orders yet — place your first one!
                  </p>
                  <button onClick={() => router.push("/menu")}
                    style={{ marginTop: 20, padding: "11px 28px", borderRadius: 999,
                      background: GOLD, color: "#000", border: "none",
                      fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {orders.map((o, i) => (
                    <div key={o.id} className="order-card"
                      style={{ background: card, border: `1px solid ${cardBdr}`,
                        borderRadius: 18, padding: "20px 22px",
                        animation: `fadeUp .4s ease ${i*.07}s both`,
                        transition: "border-color .3s, transform .3s" }}>
                      <div className="ord-meta" style={{ display: "flex",
                        justifyContent: "space-between", alignItems: "center",
                        marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                            fontSize: 17, fontWeight: 600, color: fg }}>
                            #{o.id.slice(-6).toUpperCase()}
                          </span>
                          <span style={{ fontSize: 12, color: fg2, marginLeft: 10 }}>
                            {new Date(o.created_at).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })}
                          </span>
                          <span style={{ fontSize: 11, color: fg3, marginLeft: 10, textTransform: "capitalize" }}>
                            · {o.type}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".07em",
                            textTransform: "uppercase", padding: "4px 12px", borderRadius: 999,
                            background: `${statusColor[o.status] ?? "#95a5a6"}18`,
                            color: statusColor[o.status] ?? "#95a5a6",
                            border: `1px solid ${statusColor[o.status] ?? "#95a5a6"}44` }}>
                            {o.status}
                          </span>
                          <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                            fontSize: 20, fontWeight: 700, color: GOLD }}>
                            ${Number(o.total).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      {/* Items */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                        {(o.items ?? []).map((item: any) => (
                          <span key={item.id} style={{ fontSize: 12, color: fg2,
                            background: inputBg, border: `1px solid ${cardBdr}`,
                            padding: "4px 11px", borderRadius: 999 }}>
                            {item.dish_name}{item.quantity > 1 ? ` ×${item.quantity}` : ""}
                          </span>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        {o.status === "Delivered" && (
                          <button className="reorder-btn" onClick={() => router.push("/menu")}
                            style={{ fontSize: 12, color: GOLD, background: "transparent",
                              border: `1px solid ${GOLD}44`, padding: "7px 16px",
                              borderRadius: 999, cursor: "pointer",
                              fontWeight: 600, transition: "all .25s" }}>
                            Reorder →
                          </button>
                        )}
                        {(o.status === "Preparing" || o.status === "Out for Delivery") && (
                          <button onClick={() => router.push(`/track/${o.id}`)}
                            style={{ fontSize: 12, color: "#27ae60", background: "rgba(39,174,96,.1)",
                              border: "1px solid rgba(39,174,96,.3)", padding: "7px 16px",
                              borderRadius: 999, cursor: "pointer", fontWeight: 600 }}>
                            Track Order →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ FAVOURITES ══ */}
          {activeTab === "favourites" && user && (
            <div style={{ animation: "fadeUp .4s ease" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: 26, fontWeight: 300, color: fg, marginBottom: 20 }}>Favourite Dishes</h2>
              <p style={{ fontSize: 14, color: fg2, marginBottom: 24, padding: "14px 18px",
                background: `${GOLD}0A`, border: `1px solid ${GOLD}22`, borderRadius: 14 }}>
                ❤️ Tap the heart on any dish on the menu page to save it here. Coming soon with full backend sync.
              </p>
              {/* Placeholder favourites — will be replaced with DB query */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
                {[
                  { id:12, name:"Jollof Rice & Chicken", price:"$18.99", priceNum:18.99, img:"/images/jollof.jpg", cat:"Mains" },
                  { id:4,  name:"Goat Meat Pepper Soup",  price:"$22.00", priceNum:22.00, img:"/images/pepper-soup.jpg", cat:"Soups" },
                  { id:18, name:"Suya Meat",              price:"$17.99", priceNum:17.99, img:"/images/suya.jpg", cat:"Mains" },
                ].map((f, i) => (
                  <div key={f.id}
                    style={{ background: card, border: `1px solid ${cardBdr}`,
                      borderRadius: 18, overflow: "hidden",
                      animation: `fadeUp .4s ease ${i*.09}s both`,
                      transition: "transform .3s, box-shadow .3s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 14px 40px rgba(0,0,0,.25)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                    <div style={{ height: 150, overflow: "hidden", position: "relative" }}>
                      <img src={f.img} alt={f.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.8)" }}/>
                      <div style={{ position: "absolute", inset: 0,
                        background: `linear-gradient(to top,${card} 0%,transparent 60%)` }}/>
                    </div>
                    <div style={{ padding: "14px 16px 16px" }}>
                      <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                        fontSize: 17, fontWeight: 600, color: fg, marginBottom: 10 }}>{f.name}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: GOLD,
                          fontFamily: "'Cormorant Garamond',Georgia,serif" }}>{f.price}</span>
                        <button
                          style={{ padding: "7px 16px", borderRadius: 999,
                            background: isInCart(f.id) ? "rgba(212,168,67,.15)" : GOLD,
                            color: isInCart(f.id) ? GOLD : "#000",
                            border: isInCart(f.id) ? `1px solid ${GOLD}` : "none",
                            fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all .25s" }}
                          onClick={() => {
                            addItem({ id:f.id, name:f.name, price:f.priceNum, img:f.img, cat:f.cat });
                            showToast(`${f.name} added to cart`);
                          }}>
                          {isInCart(f.id) ? "✓ In Cart" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ ADDRESSES ══ */}
          {activeTab === "addresses" && user && (
            <div style={{ animation: "fadeUp .4s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                  fontSize: 26, fontWeight: 300, color: fg }}>Saved Addresses</h2>
                <button onClick={() => setShowAddrForm(v => !v)}
                  style={{ padding: "9px 20px", borderRadius: 999, background: GOLD,
                    color: "#000", border: "none", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", transition: "all .25s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = GOLD2)}
                  onMouseLeave={e => (e.currentTarget.style.background = GOLD)}>
                  {showAddrForm ? "Cancel" : "+ Add New"}
                </button>
              </div>

              {/* Add address form */}
              {showAddrForm && (
                <div style={{ background: card, border: `1px solid ${GOLD}33`,
                  borderRadius: 18, padding: "22px 24px", marginBottom: 20,
                  animation: "fadeUp .3s ease" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: fg, marginBottom: 16 }}>New Address</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {/* Label */}
                    <div style={{ gridColumn: "1/-1" }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: fg2,
                        letterSpacing: ".06em", textTransform: "uppercase",
                        display: "block", marginBottom: 6 }}>Label</label>
                      <select value={addrForm.label} onChange={e => setAddrForm(f => ({ ...f, label: e.target.value }))}
                        style={{ ...inputStyle, width: "100%", appearance: "none" as const }}>
                        {["Home","Work","Other"].map(l => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                    {[
                      { key:"line1", label:"Street Address *", full: true },
                      { key:"line2", label:"Apt / Suite",      full: false },
                      { key:"city",  label:"City *",           full: false },
                      { key:"state", label:"State *",          full: false },
                      { key:"zip",   label:"ZIP *",            full: false },
                    ].map(f => (
                      <div key={f.key} style={{ gridColumn: f.full ? "1/-1" : undefined }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: fg2,
                          letterSpacing: ".06em", textTransform: "uppercase",
                          display: "block", marginBottom: 6 }}>{f.label}</label>
                        <input value={(addrForm as any)[f.key]}
                          onChange={e => setAddrForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                          style={inputStyle}
                          onFocus={e => (e.currentTarget.style.borderColor = `${GOLD}88`)}
                          onBlur={e => (e.currentTarget.style.borderColor = cardBdr)}/>
                      </div>
                    ))}
                    <div style={{ gridColumn: "1/-1", display: "flex", alignItems: "center", gap: 10 }}>
                      <Toggle on={addrForm.is_default} onChange={() => setAddrForm(f => ({ ...f, is_default: !f.is_default }))}/>
                      <span style={{ fontSize: 13, color: fg2 }}>Set as default delivery address</span>
                    </div>
                  </div>
                  <button onClick={saveAddress} disabled={savingAddr}
                    style={{ marginTop: 16, padding: "11px 28px", borderRadius: 999,
                      background: GOLD, color: "#000", border: "none",
                      fontSize: 13, fontWeight: 700, cursor: "pointer",
                      opacity: savingAddr ? .7 : 1 }}>
                    {savingAddr ? "Saving…" : "Save Address"}
                  </button>
                </div>
              )}

              {dataLoading ? (
                <div style={{ textAlign: "center", padding: 60, color: fg2 }}>Loading…</div>
              ) : addresses.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 20px",
                  background: card, border: `1px solid ${cardBdr}`, borderRadius: 18 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📍</div>
                  <p style={{ fontSize: 15, color: fg2 }}>No addresses saved yet.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {addresses.map((a, i) => (
                    <div key={a.id} className="addr-card"
                      style={{ background: card,
                        border: `1px solid ${a.is_default ? `${GOLD}55` : cardBdr}`,
                        borderRadius: 18, padding: "18px 22px",
                        animation: `fadeUp .4s ease ${i*.07}s both`,
                        transition: "border-color .3s" }}>
                      <div className="addr-row" style={{ display: "flex",
                        justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                          <div style={{ width: 42, height: 42, borderRadius: "50%",
                            background: a.is_default ? `${GOLD}18` : inputBg,
                            border: `1px solid ${a.is_default ? `${GOLD}44` : cardBdr}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 18, flexShrink: 0 }}>
                            {a.label === "Home" ? "🏠" : a.label === "Work" ? "🏢" : "📍"}
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: fg }}>{a.label}</span>
                              {a.is_default && (
                                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".1em",
                                  textTransform: "uppercase", padding: "2px 8px", borderRadius: 999,
                                  background: `${GOLD}22`, color: GOLD, border: `1px solid ${GOLD}44` }}>
                                  Default
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: 13, color: fg2, marginTop: 2 }}>
                              {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} {a.zip}
                            </p>
                          </div>
                        </div>
                        <div className="addr-actions" style={{ display: "flex", gap: 8 }}>
                          {!a.is_default && (
                            <button onClick={() => setDefaultAddress(a.id)}
                              style={{ padding: "6px 14px", borderRadius: 999,
                                background: inputBg, border: `1px solid ${cardBdr}`,
                                color: fg2, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                              Set Default
                            </button>
                          )}
                          <button onClick={() => deleteAddress(a.id)}
                            style={{ padding: "6px 14px", borderRadius: 999,
                              background: "transparent", border: "1px solid rgba(192,57,43,.3)",
                              color: "#e74c3c", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ NOTIFICATIONS ══ */}
          {activeTab === "notifications" && user && (
            <div style={{ animation: "fadeUp .4s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                  fontSize: 26, fontWeight: 300, color: fg }}>Notifications</h2>
                {notifications.some(n => !n.read) && (
                  <button onClick={async () => {
                    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id);
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    showToast("All marked as read.");
                  }} style={{ fontSize: 12, color: fg3, background: "none",
                    border: "none", cursor: "pointer", fontWeight: 600 }}
                    onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                    onMouseLeave={e => (e.currentTarget.style.color = fg3)}>
                    Mark all read
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px",
                  background: card, border: `1px solid ${cardBdr}`, borderRadius: 22 }}>
                  <div style={{ fontSize: 48, marginBottom: 14 }}>🔔</div>
                  <p style={{ fontSize: 16, color: fg2, fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
                    All caught up! No notifications.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 0,
                  border: `1px solid ${cardBdr}`, borderRadius: 18, overflow: "hidden",
                  background: card }}>
                  {notifications.map((n, i) => (
                    <div key={n.id} className="notif-row"
                      onClick={() => { markNotifRead(n.id); if (n.action_href) router.push(n.action_href); }}
                      style={{ padding: "16px 20px", cursor: "pointer",
                        background: n.read ? "transparent" : isDark ? "rgba(212,168,67,.03)" : "rgba(212,168,67,.02)",
                        borderLeft: n.read ? "3px solid transparent" : `3px solid ${GOLD}`,
                        borderBottom: i < notifications.length - 1 ? `1px solid ${cardBdr}` : "none",
                        transition: "background .2s" }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                          background: `${GOLD}18`, border: `1px solid ${GOLD}33`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 17 }}>{n.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: fg }}>{n.title}</span>
                              {!n.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, flexShrink: 0 }}/>}
                            </div>
                            <button onClick={e => { e.stopPropagation(); dismissNotif(n.id); }}
                              style={{ width: 22, height: 22, borderRadius: "50%", border: `1px solid ${cardBdr}`,
                                background: "transparent", color: fg3, fontSize: 13, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                              onMouseEnter={e => { (e.currentTarget.style.background = "rgba(192,57,43,.15)"); (e.currentTarget.style.color = "#e74c3c"); }}
                              onMouseLeave={e => { (e.currentTarget.style.background = "transparent"); (e.currentTarget.style.color = fg3); }}>
                              ×
                            </button>
                          </div>
                          <p style={{ fontSize: 12, color: fg2, lineHeight: 1.55, margin: "3px 0 6px" }}>{n.body}</p>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 10, color: fg3 }}>
                              {new Date(n.created_at).toLocaleDateString("en-US", { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" })}
                            </span>
                            {n.action_label && (
                              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".06em",
                                textTransform: "uppercase", padding: "3px 10px", borderRadius: 999,
                                background: GOLD, color: "#000" }}>
                                {n.action_label} →
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ SETTINGS ══ */}
          {activeTab === "settings" && user && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp .4s ease" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: 26, fontWeight: 300, color: fg, marginBottom: 4 }}>Settings</h2>

              {/* Profile info */}
              <div style={{ background: card, border: `1px solid ${cardBdr}`,
                borderRadius: 22, padding: "24px 26px" }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".07em",
                  textTransform: "uppercase", color: fg2, marginBottom: 18 }}>Profile Information</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label:"Display Name", val:editName,  setter:setEditName,  editable:true  },
                    { label:"Email",        val:profile?.email ?? "", setter:()=>{}, editable:false },
                    { label:"Phone",        val:editPhone, setter:setEditPhone, editable:true  },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: fg2,
                        letterSpacing: ".06em", textTransform: "uppercase",
                        display: "block", marginBottom: 6 }}>{f.label}</label>
                      <input value={f.val}
                        onChange={e => f.setter(e.target.value)}
                        disabled={!f.editable}
                        style={{ ...inputStyle, opacity: f.editable ? 1 : .55 }}
                        onFocus={e => f.editable && (e.currentTarget.style.borderColor = `${GOLD}88`)}
                        onBlur={e => (e.currentTarget.style.borderColor = cardBdr)}/>
                    </div>
                  ))}
                  <button className="save-btn" onClick={saveProfile} disabled={saving}
                    style={{ alignSelf: "flex-start", padding: "10px 28px",
                      borderRadius: 999, background: GOLD, color: "#000",
                      border: "none", fontSize: 13, fontWeight: 700,
                      cursor: "pointer", transition: "all .25s",
                      opacity: saving ? .7 : 1, marginTop: 4 }}>
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>

              {/* Notifications */}
              <div style={{ background: card, border: `1px solid ${cardBdr}`,
                borderRadius: 22, padding: "24px 26px" }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".07em",
                  textTransform: "uppercase", color: fg2, marginBottom: 18 }}>Notification Preferences</h3>
                {[
                  { label:"Push Notifications", desc:"Order updates & promos", on: notifOn, toggle: ()=>setNotifOn(v=>!v) },
                  { label:"Email Updates",       desc:"Newsletters & special offers", on: emailOn, toggle: ()=>setEmailOn(v=>!v) },
                ].map((n, i, arr) => (
                  <div key={n.label} style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "center", padding: "13px 0",
                    borderBottom: i < arr.length - 1 ? `1px solid ${cardBdr}` : "none" }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: fg }}>{n.label}</p>
                      <p style={{ fontSize: 12, color: fg2, marginTop: 2 }}>{n.desc}</p>
                    </div>
                    <Toggle on={n.on} onChange={n.toggle}/>
                  </div>
                ))}
              </div>

              {/* Appearance */}
              <div style={{ background: card, border: `1px solid ${cardBdr}`,
                borderRadius: 22, padding: "24px 26px" }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".07em",
                  textTransform: "uppercase", color: fg2, marginBottom: 18 }}>Appearance</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: fg }}>Dark Mode</p>
                    <p style={{ fontSize: 12, color: fg2, marginTop: 2 }}>Switch between dark and light theme</p>
                  </div>
                  <Toggle on={isDark} onChange={toggleTheme}/>
                </div>
              </div>

              {/* Security */}
              <div style={{ background: card, border: `1px solid ${cardBdr}`,
                borderRadius: 22, padding: "24px 26px" }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".07em",
                  textTransform: "uppercase", color: fg2, marginBottom: 18 }}>Security</h3>
                <button onClick={async () => {
                  const { error } = await supabase.auth.resetPasswordForEmail(profile!.email, {
                    redirectTo: `${window.location.origin}/profile`,
                  });
                  if (error) showToast(error.message, "error");
                  else showToast("Password reset email sent!");
                }} style={{ padding: "10px 22px", borderRadius: 999,
                  background: inputBg, border: `1px solid ${cardBdr}`,
                  color: fg2, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  transition: "all .25s" }}
                  onMouseEnter={e => { (e.currentTarget.style.borderColor = `${GOLD}55`); (e.currentTarget.style.color = GOLD); }}
                  onMouseLeave={e => { (e.currentTarget.style.borderColor = cardBdr); (e.currentTarget.style.color = fg2); }}>
                  Change Password →
                </button>
              </div>

              {/* Danger */}
              <div style={{ background: "rgba(192,57,43,.05)",
                border: "1px solid rgba(192,57,43,.18)",
                borderRadius: 22, padding: "24px 26px" }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".07em",
                  textTransform: "uppercase", color: "#e74c3c", marginBottom: 10 }}>Danger Zone</h3>
                <p style={{ fontSize: 13, color: fg2, marginBottom: 16, lineHeight: 1.65 }}>
                  Permanently delete your account and all associated data. This cannot be undone.
                </p>
                <button style={{ padding: "10px 22px", borderRadius: 999,
                  background: "transparent", border: "1px solid rgba(192,57,43,.4)",
                  color: "#e74c3c", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(192,57,43,.1)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  Delete Account
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}