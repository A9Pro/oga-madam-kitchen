"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useNotifications } from "@/context/NotificationContext";
import { useCart } from "@/context/CartContext";

const GOLD = "#D4A843";
const GOLD2 = "#F0C060";

// Category colour map
const CAT_COLOR: Record<string, string> = {
  order:    "#27ae60",
  delivery: "#3498db",
  promo:    "#e67e22",
  loyalty:  "#9b59b6",
  review:   "#f39c12",
  system:   "#95a5a6",
};
const CAT_LABEL: Record<string, string> = {
  order:    "Order",
  delivery: "Delivery",
  promo:    "Promo",
  loyalty:  "Loyalty",
  review:   "Review",
  system:   "System",
};

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, markRead, markAllRead, dismiss, clearAll } = useNotifications();
  const { cartCount } = useCart();
  const router   = useRouter();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  const [scrolled,     setScrolled]     = useState(false);
  const [activeTab,    setActiveTab]     = useState("home");
  const [notifOpen,    setNotifOpen]     = useState(false);
  const [activeFilter, setActiveFilter]  = useState<string>("all");
  const [dismissing,   setDismissing]    = useState<Set<string>>(new Set());

  // Sync active tab
  useEffect(() => {
    if (pathname === "/cart")    setActiveTab("cart");
    else if (pathname === "/profile") setActiveTab("profile");
    else if (pathname === "/menu")    setActiveTab("menu");
    else setActiveTab("home");
  }, [pathname]);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  const goTo = (id: string, tab: string) => {
    setActiveTab(tab);
    setTimeout(() => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" }), 50);
  };
  const goToPage = (path: string, tab: string) => {
    setActiveTab(tab);
    router.push(path);
  };

  const handleDismiss = (id: string) => {
    setDismissing(prev => new Set([...prev, id]));
    setTimeout(() => {
      dismiss(id);
      setDismissing(prev => { const s = new Set(prev); s.delete(id); return s; });
    }, 320);
  };

  const handleNotifClick = (n: { id: string; actionHref?: string }) => {
    markRead(n.id);
    if (n.actionHref) { router.push(n.actionHref); setNotifOpen(false); }
  };

  // Filtered notifications
  const filtered = activeFilter === "all"
    ? notifications
    : notifications.filter(n => n.category === activeFilter);

  const filters = ["all", "order", "delivery", "promo", "loyalty", "review", "system"];

  // Theme tokens
  const logoColor  = isDark ? "#fff"                        : "#0D0B09";
  const linkColor  = isDark ? "rgba(255,255,255,0.6)"       : "rgba(13,11,9,0.6)";
  const desktopBg  = scrolled ? (isDark ? "rgba(8,7,6,0.95)" : "rgba(250,247,242,0.97)") : "transparent";
  const desktopBdr = scrolled ? (isDark ? "1px solid rgba(212,168,67,0.12)" : "1px solid rgba(212,168,67,0.2)") : "none";
  const mobTopBg   = isDark ? (scrolled ? "rgba(8,7,6,0.97)" : "rgba(8,7,6,0.92)") : (scrolled ? "rgba(250,247,242,0.97)" : "rgba(250,247,242,0.92)");
  const mobBotBg   = isDark ? "rgba(11,9,8,0.97)"     : "rgba(250,247,242,0.97)";
  const mobBorder  = isDark ? "rgba(212,168,67,0.1)"   : "rgba(212,168,67,0.2)";
  const mobIconCol = isDark ? "rgba(255,255,255,0.45)" : "rgba(13,11,9,0.4)";
  const mobText    = isDark ? "rgba(255,255,255,0.4)"  : "rgba(13,11,9,0.4)";
  const toggleBg   = isDark ? "#1A1714"                : "#DDD5C5";
  const toggleBdr  = isDark ? "rgba(255,255,255,0.1)"  : "rgba(0,0,0,0.12)";
  const notifBg    = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const panelBg    = isDark ? "#0E0C0A"                : "#FFFFFF";
  const panelBdr   = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const itemHover  = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const fg         = isDark ? "#FFFFFF"                : "#0D0B09";
  const fg2        = isDark ? "rgba(255,255,255,0.55)" : "rgba(13,11,9,0.55)";
  const fg3        = isDark ? "rgba(255,255,255,0.28)" : "rgba(13,11,9,0.28)";
  const inputBg    = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";

  const navLinks = [
    { label: "Menu",      action: () => goToPage("/menu", "menu"),                                                                           href: "/menu"          },
    { label: "Our Story", action: () => pathname === "/" ? goTo("#story", "home") : goToPage("/#story", "home"),                             href: "#story"         },
    { label: "Reviews",   action: () => pathname === "/" ? goTo("#reviews", "home") : goToPage("/#reviews", "home"),                         href: "#reviews"       },
    { label: "Order",     action: () => pathname === "/" ? goTo("#order-section", "home") : goToPage("/#order-section", "home"),             href: "#order-section" },
  ];

  const tabs = [
    {
      id: "home", label: "Home",
      action: () => pathname === "/" ? goTo("#hero", "home") : goToPage("/", "home"),
      icon: (a: boolean) => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={a ? GOLD : mobIconCol} strokeWidth={a ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H14v-5h-4v5H4a1 1 0 01-1-1V9.75z"/>
        </svg>
      ),
    },
    {
      id: "menu", label: "Menu",
      action: () => goToPage("/menu", "menu"),
      icon: (a: boolean) => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={a ? GOLD : mobIconCol} strokeWidth={a ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
        </svg>
      ),
    },
    {
      id: "cart", label: "Cart",
      action: () => goToPage("/cart", "cart"),
      icon: (a: boolean) => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={a ? GOLD : mobIconCol} strokeWidth={a ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      ),
    },
    {
      id: "profile", label: "Profile",
      action: () => goToPage("/profile", "profile"),
      icon: (a: boolean) => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={a ? GOLD : mobIconCol} strokeWidth={a ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      ),
    },
  ];

  const ThemeToggle = ({ mobile }: { mobile?: boolean }) => (
    <button onClick={toggleTheme} aria-label="Toggle theme"
      style={{ width:mobile?52:48, height:mobile?28:26, borderRadius:999,
        border:`1px solid ${toggleBdr}`, background:toggleBg,
        cursor:"pointer", display:"flex", alignItems:"center",
        padding:3, transition:"background 0.4s", flexShrink:0 }}>
      <div style={{ width:mobile?20:18, height:mobile?20:18, borderRadius:"50%",
        background:GOLD,
        transform:isDark?"translateX(0)":`translateX(${mobile?24:22}px)`,
        transition:"transform 0.4s cubic-bezier(0.23,1,0.32,1)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:mobile?11:10 }}>
        {isDark ? "🌙" : "☀️"}
      </div>
    </button>
  );

  // ── NOTIFICATION PANEL ──────────────────────────────────────────────────
  const NotificationPanel = () => (
    <div ref={panelRef} style={{
      position:"absolute", top:"calc(100% + 12px)", right:0,
      width:420, maxHeight:"80vh",
      background:panelBg, border:`1px solid ${panelBdr}`,
      borderRadius:22, overflow:"hidden",
      boxShadow:isDark
        ? "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,67,0.08)"
        : "0 24px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)",
      zIndex:600, display:"flex", flexDirection:"column",
      animation:"notifSlideIn .25s cubic-bezier(.23,1,.32,1) both",
    }}>
      <style>{`
        @keyframes notifSlideIn {
          from { opacity:0; transform:translateY(-10px) scale(.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes notifDismiss {
          from { opacity:1; transform:translateX(0); max-height:120px; }
          to   { opacity:0; transform:translateX(24px); max-height:0; padding:0; }
        }
        .notif-item { transition: background .2s; }
        .notif-item:hover { background: ${itemHover} !important; }
        .notif-dismiss:hover { background: rgba(192,57,43,.15) !important; color: #e74c3c !important; }
        .notif-action:hover { background: ${GOLD2} !important; }
        .filter-btn:hover { border-color: rgba(212,168,67,.5) !important; color: ${GOLD} !important; }
        .mark-all:hover { color: ${GOLD} !important; }
        .clear-all:hover { color: #e74c3c !important; }
        @media(max-width:768px) {
          .notif-panel-wrap { right: -80px !important; width: 360px !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ padding:"18px 20px 14px", borderBottom:`1px solid ${panelBdr}`, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
              fontSize:20, fontWeight:600, color:fg }}>Notifications</span>
            {unreadCount > 0 && (
              <span style={{ fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:999,
                background:`${GOLD}22`, color:GOLD, border:`1px solid ${GOLD}44` }}>
                {unreadCount} new
              </span>
            )}
          </div>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            {unreadCount > 0 && (
              <button className="mark-all" onClick={markAllRead}
                style={{ fontSize:11, color:fg3, background:"none", border:"none",
                  cursor:"pointer", fontWeight:600, letterSpacing:".04em",
                  textTransform:"uppercase", transition:"color .2s" }}>
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button className="clear-all" onClick={clearAll}
                style={{ fontSize:11, color:fg3, background:"none", border:"none",
                  cursor:"pointer", fontWeight:600, letterSpacing:".04em",
                  textTransform:"uppercase", transition:"color .2s" }}>
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Category filters */}
        <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:2,
          scrollbarWidth:"none" }}>
          {filters.map(f => {
            const active = activeFilter === f;
            const count  = f === "all"
              ? notifications.filter(n => !n.read).length
              : notifications.filter(n => n.category === f && !n.read).length;
            return (
              <button key={f} className="filter-btn"
                onClick={() => setActiveFilter(f)}
                style={{ flexShrink:0, padding:"4px 12px", borderRadius:999,
                  fontSize:10, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase",
                  border:`1px solid ${active ? GOLD : panelBdr}`,
                  background: active ? `${GOLD}18` : "transparent",
                  color: active ? GOLD : fg3,
                  cursor:"pointer", transition:"all .2s",
                  display:"flex", alignItems:"center", gap:5 }}>
                {f === "all" ? "All" : CAT_LABEL[f]}
                {count > 0 && (
                  <span style={{ width:14, height:14, borderRadius:"50%",
                    background: active ? GOLD : "rgba(192,57,43,.8)",
                    color:"#fff", fontSize:8, fontWeight:800,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div style={{ overflowY:"auto", flex:1, scrollbarWidth:"thin",
        scrollbarColor:`${GOLD}44 transparent` }}>
        {filtered.length === 0 ? (
          <div style={{ padding:"48px 24px", textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔔</div>
            <p style={{ fontSize:14, color:fg3, fontWeight:500 }}>No notifications here</p>
          </div>
        ) : (
          filtered.map(n => (
            <div key={n.id} className="notif-item"
              style={{
                padding:"14px 20px", cursor:"pointer",
                background: n.read ? "transparent" : (isDark ? "rgba(212,168,67,0.04)" : "rgba(212,168,67,0.03)"),
                borderLeft: n.read ? "3px solid transparent" : `3px solid ${CAT_COLOR[n.category]}`,
                animation: dismissing.has(n.id) ? "notifDismiss .32s ease forwards" : "none",
                overflow:"hidden",
              }}
              onClick={() => handleNotifClick(n)}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>

                {/* Icon */}
                <div style={{ width:40, height:40, borderRadius:12, flexShrink:0,
                  background:`${CAT_COLOR[n.category]}18`,
                  border:`1px solid ${CAT_COLOR[n.category]}33`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:18 }}>
                  {n.icon}
                </div>

                {/* Content */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                      <span style={{ fontSize:13, fontWeight:700, color:fg, lineHeight:1.3 }}>{n.title}</span>
                      {!n.read && (
                        <span style={{ width:6, height:6, borderRadius:"50%",
                          background:CAT_COLOR[n.category], flexShrink:0, marginTop:2 }}/>
                      )}
                    </div>
                    {/* Dismiss */}
                    <button className="notif-dismiss"
                      onClick={e => { e.stopPropagation(); handleDismiss(n.id); }}
                      style={{ width:22, height:22, borderRadius:"50%", flexShrink:0,
                        border:`1px solid ${panelBdr}`, background:"transparent",
                        color:fg3, fontSize:12, cursor:"pointer",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        transition:"all .2s" }}>×</button>
                  </div>

                  <p style={{ fontSize:12, color:fg2, lineHeight:1.58, margin:"4px 0 8px" }}>{n.body}</p>

                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:9, fontWeight:700, letterSpacing:".08em",
                        textTransform:"uppercase", padding:"2px 8px", borderRadius:999,
                        background:`${CAT_COLOR[n.category]}18`, color:CAT_COLOR[n.category],
                        border:`1px solid ${CAT_COLOR[n.category]}33` }}>
                        {CAT_LABEL[n.category]}
                      </span>
                      <span style={{ fontSize:10, color:fg3 }}>{n.time}</span>
                    </div>
                    {n.actionLabel && (
                      <span className="notif-action"
                        style={{ fontSize:10, fontWeight:700, letterSpacing:".06em",
                          textTransform:"uppercase", padding:"4px 10px", borderRadius:999,
                          background:GOLD, color:"#000", transition:"background .2s" }}>
                        {n.actionLabel} →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{ padding:"12px 20px", borderTop:`1px solid ${panelBdr}`,
        flexShrink:0, textAlign:"center" }}>
        <button onClick={() => { goToPage("/profile", "profile"); setNotifOpen(false); }}
          style={{ fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase",
            color:GOLD, background:"none", border:"none", cursor:"pointer",
            transition:"opacity .2s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = ".7")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
          View Notification Settings →
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ══ DESKTOP NAV ══ */}
      <nav className="nav-desktop" style={{
        position:"fixed", top:0, left:0, right:0, zIndex:500,
        padding: scrolled ? "12px 56px" : "22px 56px",
        background:desktopBg,
        backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        borderBottom:desktopBdr,
        transition:"all 0.4s ease",
        alignItems:"center", justifyContent:"space-between",
      }}>
        <Link href="/" style={{ textDecoration:"none", display:"flex", flexDirection:"column", lineHeight:1.1 }}>
          <span style={{ color:GOLD, fontSize:9, letterSpacing:"0.5em", textTransform:"uppercase", fontWeight:700 }}>OGA</span>
          <span style={{ color:logoColor, fontSize:20, fontWeight:600, fontFamily:"'Cormorant Garamond',Georgia,serif", transition:"color 0.4s" }}>
            Madam Kitchen
          </span>
        </Link>

        <div style={{ display:"flex", alignItems:"center", gap:36 }}>
          {navLinks.map(link => (
            <a key={link.label} href={link.href}
              onClick={e => { e.preventDefault(); link.action(); }}
              style={{ color:pathname === link.href ? GOLD : linkColor,
                textDecoration:"none", fontSize:11,
                letterSpacing:"0.22em", textTransform:"uppercase", fontWeight:500,
                transition:"color 0.3s", cursor:"none" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = GOLD; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = pathname === link.href ? GOLD : linkColor; }}>
              {link.label}
            </a>
          ))}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:12, position:"relative" }}>
          <ThemeToggle />

          {/* ── Notification Bell ── */}
          <div style={{ position:"relative" }}>
            <button
              onClick={() => { setNotifOpen(v => !v); }}
              aria-label="Notifications"
              style={{ position:"relative", width:40, height:40, borderRadius:"50%",
                border:`1px solid ${notifOpen ? `${GOLD}66` : "rgba(212,168,67,0.22)"}`,
                background: notifOpen ? `${GOLD}12` : "rgba(212,168,67,0.07)",
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"none", transition:"all 0.3s" }}>
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24"
                stroke={unreadCount > 0 ? GOLD : (isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)")}
                strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              {unreadCount > 0 && (
                <span style={{
                  position:"absolute", top:-5, right:-5,
                  minWidth:18, height:18, borderRadius:999,
                  background:"#C0392B", color:"#fff",
                  fontSize:9, fontWeight:800,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  padding:"0 4px",
                  border:`2px solid ${isDark ? "#080706" : "#FAF7F2"}`,
                  animation:"pulse 2s ease-in-out infinite",
                }}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && <NotificationPanel />}
          </div>

          {/* ── Cart Icon ── */}
          <Link href="/cart"
            style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center",
              width:40, height:40, borderRadius:"50%",
              border:"1px solid rgba(212,168,67,0.22)",
              background:"rgba(212,168,67,0.07)",
              textDecoration:"none", transition:"all 0.3s", cursor:"none" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,168,67,0.6)";
              (e.currentTarget as HTMLElement).style.background  = "rgba(212,168,67,0.14)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,168,67,0.22)";
              (e.currentTarget as HTMLElement).style.background  = "rgba(212,168,67,0.07)";
            }}>
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke={GOLD} strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position:"absolute", top:-5, right:-5,
                minWidth:18, height:18, borderRadius:999,
                background:GOLD, color:"#000",
                fontSize:9, fontWeight:800,
                display:"flex", alignItems:"center", justifyContent:"center",
                padding:"0 4px",
                border:`2px solid ${isDark ? "#080706" : "#FAF7F2"}`,
              }}>
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* ── Order Now ── */}
          <a href="/menu"
            onClick={e => { e.preventDefault(); goToPage("/menu", "menu"); }}
            style={{ background:GOLD, color:"#000", padding:"10px 22px",
              borderRadius:999, fontSize:12, fontWeight:700,
              letterSpacing:"0.08em", textTransform:"uppercase",
              textDecoration:"none", transition:"all 0.3s", cursor:"none" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background  = GOLD2;
              (e.currentTarget as HTMLElement).style.transform   = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow   = "0 10px 30px rgba(212,168,67,0.4)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background  = GOLD;
              (e.currentTarget as HTMLElement).style.transform   = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow   = "none";
            }}>
            Order Now
          </a>
        </div>
      </nav>

      {/* ══ MOBILE TOP BAR ══ */}
      <div className="nav-mob-top" style={{
        position:"fixed", top:0, left:0, right:0, zIndex:500,
        padding:"10px 18px",
        background:mobTopBg,
        backdropFilter:"blur(24px) saturate(180%)",
        borderBottom:`1px solid ${mobBorder}`,
        transition:"background 0.4s",
        alignItems:"center", justifyContent:"space-between",
      }}>
        <Link href="/" style={{ textDecoration:"none", display:"flex", flexDirection:"column", lineHeight:1 }}>
          <span style={{ color:GOLD, fontSize:8, letterSpacing:"0.5em", textTransform:"uppercase", fontWeight:700 }}>OGA</span>
          <span style={{ color:logoColor, fontSize:17, fontWeight:600, fontFamily:"'Cormorant Garamond',Georgia,serif", transition:"color 0.4s" }}>
            Madam Kitchen
          </span>
        </Link>

        <div style={{ display:"flex", alignItems:"center", gap:10, position:"relative" }}>
          {/* Mobile Notification Bell */}
          <div style={{ position:"relative" }} ref={panelRef}>
            <button
              aria-label="Notifications"
              onClick={() => setNotifOpen(v => !v)}
              style={{ position:"relative", width:38, height:38, borderRadius:"50%",
                border:`1px solid ${notifOpen ? `${GOLD}55` : mobBorder}`,
                background: notifOpen ? `${GOLD}10` : notifBg,
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer", transition:"all .3s" }}>
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24"
                stroke={unreadCount > 0 ? GOLD : (isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)")}
                strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              {unreadCount > 0 && (
                <span style={{
                  position:"absolute", top:-2, right:-2,
                  minWidth:16, height:16, borderRadius:999,
                  background:"#C0392B", color:"#fff",
                  fontSize:9, fontWeight:800,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  padding:"0 3px",
                  border:`2px solid ${isDark ? "#080706" : "#FAF7F2"}`,
                }}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Mobile notification panel — slides below top bar */}
            {notifOpen && (
              <div style={{ position:"fixed", top:64, left:8, right:8, zIndex:600,
                maxHeight:"75vh", borderRadius:20, overflow:"hidden",
                background:panelBg, border:`1px solid ${panelBdr}`,
                boxShadow:"0 24px 60px rgba(0,0,0,0.5)",
                display:"flex", flexDirection:"column",
                animation:"notifSlideIn .25s cubic-bezier(.23,1,.32,1) both" }}>

                {/* Header */}
                <div style={{ padding:"16px 16px 12px", borderBottom:`1px solid ${panelBdr}`, flexShrink:0 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                        fontSize:18, fontWeight:600, color:fg }}>Notifications</span>
                      {unreadCount > 0 && (
                        <span style={{ fontSize:9, fontWeight:800, padding:"2px 7px", borderRadius:999,
                          background:`${GOLD}22`, color:GOLD, border:`1px solid ${GOLD}44` }}>
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div style={{ display:"flex", gap:10 }}>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead}
                          style={{ fontSize:10, color:fg3, background:"none", border:"none",
                            cursor:"pointer", fontWeight:600, textTransform:"uppercase" }}>
                          Read all
                        </button>
                      )}
                      <button onClick={() => setNotifOpen(false)}
                        style={{ fontSize:18, color:fg3, background:"none", border:"none",
                          cursor:"pointer", lineHeight:1 }}>×</button>
                    </div>
                  </div>
                  {/* Filters */}
                  <div style={{ display:"flex", gap:5, overflowX:"auto", scrollbarWidth:"none" }}>
                    {filters.map(f => {
                      const active = activeFilter === f;
                      return (
                        <button key={f} onClick={() => setActiveFilter(f)}
                          style={{ flexShrink:0, padding:"3px 10px", borderRadius:999,
                            fontSize:9, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase",
                            border:`1px solid ${active ? GOLD : panelBdr}`,
                            background: active ? `${GOLD}18` : "transparent",
                            color: active ? GOLD : fg3, cursor:"pointer" }}>
                          {f === "all" ? "All" : CAT_LABEL[f]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* List */}
                <div style={{ overflowY:"auto", flex:1 }}>
                  {filtered.length === 0 ? (
                    <div style={{ padding:"36px 16px", textAlign:"center" }}>
                      <div style={{ fontSize:32, marginBottom:8 }}>🔔</div>
                      <p style={{ fontSize:13, color:fg3 }}>No notifications</p>
                    </div>
                  ) : (
                    filtered.map(n => (
                      <div key={n.id}
                        onClick={() => handleNotifClick(n)}
                        style={{ padding:"12px 16px", cursor:"pointer",
                          background: n.read ? "transparent" : `${CAT_COLOR[n.category]}06`,
                          borderLeft: n.read ? "3px solid transparent" : `3px solid ${CAT_COLOR[n.category]}`,
                          borderBottom:`1px solid ${panelBdr}`,
                          animation: dismissing.has(n.id) ? "notifDismiss .32s ease forwards" : "none" }}>
                        <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                          <div style={{ width:34, height:34, borderRadius:10, flexShrink:0,
                            background:`${CAT_COLOR[n.category]}18`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:15 }}>{n.icon}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", justifyContent:"space-between", gap:6 }}>
                              <span style={{ fontSize:12, fontWeight:700, color:fg, lineHeight:1.3 }}>{n.title}</span>
                              <button onClick={e => { e.stopPropagation(); handleDismiss(n.id); }}
                                style={{ fontSize:14, color:fg3, background:"none", border:"none",
                                  cursor:"pointer", flexShrink:0, lineHeight:1 }}>×</button>
                            </div>
                            <p style={{ fontSize:11, color:fg2, lineHeight:1.5, margin:"3px 0 6px" }}>{n.body}</p>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                              <span style={{ fontSize:9, color:fg3 }}>{n.time}</span>
                              {n.actionLabel && (
                                <span style={{ fontSize:9, fontWeight:700, textTransform:"uppercase",
                                  padding:"3px 8px", borderRadius:999, background:GOLD, color:"#000" }}>
                                  {n.actionLabel}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <ThemeToggle mobile />
        </div>
      </div>

      {/* ══ MOBILE BOTTOM NAV ══ */}
      <nav className="nav-mob-bot" style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:500,
        background:mobBotBg,
        backdropFilter:"blur(28px) saturate(200%)",
        borderTop:`1px solid ${mobBorder}`,
        alignItems:"stretch",
        paddingBottom:"env(safe-area-inset-bottom, 0px)",
        boxShadow: isDark ? "0 -8px 40px rgba(0,0,0,0.55)" : "0 -4px 20px rgba(0,0,0,0.1)",
        transition:"background 0.4s, border-color 0.4s",
      }}>
        {tabs.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={tab.action}
              style={{ flex:1, display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center",
                padding:"10px 4px 12px", position:"relative",
                background:"transparent", border:"none",
                cursor:"pointer", transition:"transform 0.2s" }}>
              {active && (
                <span style={{ position:"absolute", top:0, left:"50%",
                  transform:"translateX(-50%)",
                  width:28, height:3, borderRadius:"0 0 6px 6px",
                  background:GOLD, boxShadow:"0 2px 10px rgba(212,168,67,0.7)" }}/>
              )}
              <span style={{ display:"flex", alignItems:"center", justifyContent:"center",
                width:42, height:38, borderRadius:14,
                background: active ? "rgba(212,168,67,0.1)" : "transparent",
                transition:"background 0.25s", position:"relative" }}>
                {tab.icon(active)}
                {/* Cart counter on mobile bottom nav */}
                {tab.id === "cart" && cartCount > 0 && (
                  <span style={{ position:"absolute", top:3, right:3,
                    minWidth:14, height:14, borderRadius:999,
                    background:GOLD, color:"#000",
                    fontSize:8, fontWeight:800,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    padding:"0 2px" }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </span>
              <span style={{ fontSize:10, fontWeight:active?700:400,
                color: active ? GOLD : mobText,
                letterSpacing:"0.01em", marginTop:2, transition:"color 0.25s" }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}