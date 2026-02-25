"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { useNotifications } from "@/context/NotificationContext"; // ← WIRED IN (replaces local MOCK_NOTIFS)

const GOLD  = "#D4A843";
const GOLD2 = "#F0C060";
const RED   = "#C0392B";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const pathname = usePathname();
  const router   = useRouter();

  // ─── All notification state comes from shared context now ───────────────────
  const { notifications, unreadCount, markRead, markAllRead, dismiss } = useNotifications();

  const [scrolled,  setScrolled]  = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [notifOpen, setNotifOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* ── Scroll ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Active tab from pathname ── */
  useEffect(() => {
    if      (pathname === "/cart")    setActiveTab("cart");
    else if (pathname === "/profile") setActiveTab("profile");
    else if (pathname === "/menu")    setActiveTab("menu");
    else                              setActiveTab("home");
  }, [pathname]);

  /* ── Close notif panel on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node))
        setNotifOpen(false);
    };
    if (notifOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  /* ── Navigation helper — handles both page nav and homepage section scrolls ── */
  const goTo = (target: string, tab: string) => {
    setActiveTab(tab);
    if (target.startsWith("/")) {
      router.push(target);
    } else if (pathname !== "/") {
      sessionStorage.setItem("__scrollTo", target);
      router.push("/");
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNotifClick = (n: typeof notifications[0]) => {
    markRead(n.id);
    if (n.actionHref) { router.push(n.actionHref); setNotifOpen(false); }
  };

  /* ── Theme tokens ── */
  const logoColor  = isDark ? "#fff"                         : "#0D0B09";
  const linkColor  = isDark ? "rgba(255,255,255,0.6)"        : "rgba(13,11,9,0.6)";
  const desktopBg  = scrolled ? (isDark ? "rgba(8,7,6,0.95)"        : "rgba(250,247,242,0.97)") : "transparent";
  const desktopBdr = scrolled ? (isDark ? "1px solid rgba(212,168,67,0.12)" : "1px solid rgba(212,168,67,0.2)") : "none";
  const mobTopBg   = isDark ? (scrolled ? "rgba(8,7,6,0.97)" : "rgba(8,7,6,0.90)")
                             : (scrolled ? "rgba(250,247,242,0.97)" : "rgba(250,247,242,0.90)");
  const mobBotBg   = isDark ? "rgba(11,9,8,0.97)"    : "rgba(250,247,242,0.97)";
  const mobBorder  = isDark ? "rgba(212,168,67,0.1)"  : "rgba(212,168,67,0.2)";
  const mobIconCol = isDark ? "rgba(255,255,255,0.45)" : "rgba(13,11,9,0.4)";
  const mobText    = isDark ? "rgba(255,255,255,0.4)"  : "rgba(13,11,9,0.4)";
  const toggleBg   = isDark ? "#1A1714"                : "#DDD5C5";
  const toggleBdr  = isDark ? "rgba(255,255,255,0.1)"  : "rgba(0,0,0,0.12)";
  const notifBg    = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const panelBg    = isDark ? "#0E0C0A"                : "#FFFFFF";
  const panelBdr   = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const fg         = isDark ? "#FFFFFF"                : "#0D0B09";
  const fg2        = isDark ? "rgba(255,255,255,0.55)" : "rgba(13,11,9,0.55)";
  const fg3        = isDark ? "rgba(255,255,255,0.28)" : "rgba(13,11,9,0.28)";

  const isOnProfile = pathname === "/profile";
  const isOnCart    = pathname === "/cart";
  const isOnAbout   = pathname === "/about";
  const isOnMenu    = pathname === "/menu";

  /* ── Desktop nav links ── now includes About ── */
  const navLinks = [
    { label: "Menu",      target: "/menu",          isPage: true  },
    { label: "About",     target: "/about",         isPage: true  },
    { label: "Our Story", target: "#story",         isPage: false },
    { label: "Reviews",   target: "#reviews",       isPage: false },
    { label: "Order",     target: "#order-section", isPage: false },
  ];

  /* ── Mobile bottom tabs ── */
  const tabs = [
    {
      id: "home", label: "Home", target: "/",
      icon: (a: boolean) => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
          stroke={a ? GOLD : mobIconCol} strokeWidth={a ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H14v-5h-4v5H4a1 1 0 01-1-1V9.75z"/>
        </svg>
      ),
    },
    {
      id: "menu", label: "Menu", target: "/menu",
      icon: (a: boolean) => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
          stroke={a ? GOLD : mobIconCol} strokeWidth={a ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
        </svg>
      ),
    },
    {
      id: "cart", label: "Cart", target: "/cart",
      icon: (a: boolean) => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
          stroke={a ? GOLD : mobIconCol} strokeWidth={a ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      ),
    },
    {
      id: "profile", label: "Profile", target: "/profile",
      icon: (a: boolean) => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
          stroke={a ? GOLD : mobIconCol} strokeWidth={a ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      ),
    },
  ];

  /* ── Theme toggle pill ── */
  const ThemeToggle = ({ mobile }: { mobile?: boolean }) => (
    <button onClick={toggleTheme} aria-label="Toggle theme"
      style={{ width: mobile ? 52 : 48, height: mobile ? 28 : 26,
        borderRadius: 999, border: `1px solid ${toggleBdr}`,
        background: toggleBg, cursor: "pointer",
        display: "flex", alignItems: "center", padding: 3,
        transition: "background 0.4s", flexShrink: 0 }}>
      <div style={{ width: mobile ? 20 : 18, height: mobile ? 20 : 18,
        borderRadius: "50%", background: GOLD,
        transform: isDark ? "translateX(0)" : `translateX(${mobile ? 24 : 22}px)`,
        transition: "transform 0.4s cubic-bezier(0.23,1,0.32,1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: mobile ? 11 : 10 }}>
        {isDark ? "🌙" : "☀️"}
      </div>
    </button>
  );

  /* ── Shared notification list — used in both desktop panel & mobile panel ── */
  const NotifList = ({ compact }: { compact?: boolean }) => (
    <>
      {notifications.length === 0 ? (
        <div style={{ padding: compact ? "32px 16px" : "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: compact ? 32 : 40, marginBottom: 12 }}>🔔</div>
          <p style={{ fontSize: compact ? 13 : 14, color: fg3, fontWeight: 500 }}>All caught up!</p>
        </div>
      ) : (
        notifications.map(n => (
          <div key={n.id}
            onClick={() => handleNotifClick(n)}
            style={{
              padding: compact ? "12px 16px" : "14px 20px",
              cursor: "pointer",
              background: n.read ? "transparent" : (isDark ? "rgba(212,168,67,0.04)" : "rgba(212,168,67,0.03)"),
              borderLeft: n.read ? "3px solid transparent" : `3px solid ${GOLD}`,
              borderBottom: `1px solid ${panelBdr}`,
              transition: "background .2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)")}
            onMouseLeave={e => (e.currentTarget.style.background = n.read ? "transparent" : (isDark ? "rgba(212,168,67,0.04)" : "rgba(212,168,67,0.03)"))}>
            <div style={{ display: "flex", gap: compact ? 10 : 12, alignItems: "flex-start" }}>
              <div style={{
                width: compact ? 34 : 40, height: compact ? 34 : 40,
                borderRadius: compact ? 10 : 12, flexShrink: 0,
                background: `${GOLD}18`, border: `1px solid ${GOLD}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: compact ? 15 : 18,
              }}>{n.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: compact ? 12 : 13, fontWeight: 700, color: fg, lineHeight: 1.3 }}>{n.title}</span>
                    {!n.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, flexShrink: 0 }}/>}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                    style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                      border: `1px solid ${panelBdr}`, background: "transparent",
                      color: fg3, fontSize: 13, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(192,57,43,.15)"; (e.currentTarget as HTMLElement).style.color = "#e74c3c"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = fg3; }}>
                    ×
                  </button>
                </div>
                <p style={{ fontSize: compact ? 11 : 12, color: fg2, lineHeight: 1.55, margin: "4px 0 8px" }}>{n.body}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: compact ? 9 : 10, color: fg3 }}>{n.time}</span>
                  {n.actionLabel && (
                    <span style={{ fontSize: compact ? 9 : 10, fontWeight: 700, letterSpacing: ".06em",
                      textTransform: "uppercase", padding: compact ? "3px 8px" : "4px 10px",
                      borderRadius: 999, background: GOLD, color: "#000" }}>
                      {n.actionLabel} →
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );

  /* ── Desktop notification panel ── */
  const NotificationPanel = () => (
    <div ref={panelRef} style={{
      position: "absolute", top: "calc(100% + 12px)", right: 0,
      width: 380, maxHeight: "78vh",
      background: panelBg, border: `1px solid ${panelBdr}`,
      borderRadius: 22, overflow: "hidden",
      boxShadow: isDark
        ? "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,67,0.08)"
        : "0 24px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)",
      zIndex: 600, display: "flex", flexDirection: "column",
      animation: "notifSlideIn .25s cubic-bezier(.23,1,.32,1) both",
    }}>
      <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${panelBdr}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 20, fontWeight: 600, color: fg }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999,
                background: `${GOLD}22`, color: GOLD, border: `1px solid ${GOLD}44` }}>
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              style={{ fontSize: 11, color: fg3, background: "none", border: "none",
                cursor: "pointer", fontWeight: 600, letterSpacing: ".04em",
                textTransform: "uppercase", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={e => (e.currentTarget.style.color = fg3)}>
              Mark all read
            </button>
          )}
        </div>
      </div>
      <div style={{ overflowY: "auto", flex: 1, scrollbarWidth: "thin", scrollbarColor: `${GOLD}44 transparent` }}>
        <NotifList />
      </div>
      <div style={{ padding: "12px 20px", borderTop: `1px solid ${panelBdr}`, flexShrink: 0, textAlign: "center" }}>
        <button
          onClick={() => { goTo("/profile", "profile"); setNotifOpen(false); }}
          style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase",
            color: GOLD, background: "none", border: "none", cursor: "pointer" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = ".7")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
          Notification Settings →
        </button>
      </div>
    </div>
  );

  /* ── Bell button shared between desktop + mobile ── */
  const BellButton = ({ size, isMob }: { size: number; isMob?: boolean }) => (
    <button
      onClick={() => setNotifOpen(v => !v)}
      aria-label="Notifications"
      style={{
        position: "relative", width: size, height: size, borderRadius: "50%",
        border: `1px solid ${notifOpen ? `${GOLD}66` : (isMob ? mobBorder : "rgba(212,168,67,0.22)")}`,
        background: notifOpen ? `${GOLD}12` : (isMob ? notifBg : "rgba(212,168,67,0.07)"),
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all 0.3s",
      }}>
      <svg width="17" height="17" fill="none" viewBox="0 0 24 24"
        stroke={unreadCount > 0 ? GOLD : (isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)")}
        strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
      </svg>
      {unreadCount > 0 && (
        <span style={{
          position: "absolute", top: isMob ? -2 : -5, right: isMob ? -2 : -5,
          minWidth: isMob ? 16 : 18, height: isMob ? 16 : 18, borderRadius: 999,
          background: RED, color: "#fff", fontSize: 9, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 3px",
          border: `2px solid ${isDark ? "#080706" : "#FAF7F2"}`,
          animation: isMob ? "none" : "pulse 2s ease-in-out infinite",
        }}>
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );

  return (
    <>
      <style>{`
        @keyframes notifSlideIn { from{opacity:0;transform:translateY(-10px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes cartPop { 0%{transform:scale(1)} 40%{transform:scale(1.4)} 100%{transform:scale(1)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(192,57,43,.5)} 50%{box-shadow:0 0 0 5px rgba(192,57,43,0)} }
        .nav-desktop { display: flex; }
        .nav-mob-top { display: none; }
        .nav-mob-bot { display: none; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mob-top { display: flex !important; }
          .nav-mob-bot { display: flex !important; }
        }
      `}</style>

      {/* ══ DESKTOP NAV ══ */}
      <nav className="nav-desktop" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
        padding: scrolled ? "12px 56px" : "22px 56px",
        background: desktopBg,
        backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        borderBottom: desktopBdr,
        transition: "all 0.4s ease",
        alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <span style={{ color: GOLD, fontSize: 9, letterSpacing: "0.5em", textTransform: "uppercase", fontWeight: 700 }}>OGA</span>
          <span style={{ color: logoColor, fontSize: 20, fontWeight: 600, fontFamily: "'Cormorant Garamond',Georgia,serif", transition: "color 0.4s" }}>
            Madam Kitchen
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {navLinks.map(link => {
            const isActive = link.isPage
              ? pathname === link.target
              : false; // anchor links never "active" via pathname
            return (
              <a
                key={link.label}
                href={link.target}
                onClick={e => {
                  e.preventDefault();
                  if (link.isPage) {
                    goTo(link.target, link.target === "/menu" ? "menu" : "home");
                  } else {
                    goTo(link.target, "home");
                  }
                }}
                style={{
                  color: isActive ? GOLD : linkColor,
                  textDecoration: "none", fontSize: 11,
                  letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500,
                  transition: "color 0.3s", cursor: "none",
                  borderBottom: isActive ? `1px solid ${GOLD}` : "1px solid transparent",
                  paddingBottom: 2,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = GOLD; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isActive ? GOLD : linkColor; }}>
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
          <ThemeToggle />

          {/* Notification bell + panel */}
          <div style={{ position: "relative" }}>
            <BellButton size={40} />
            {notifOpen && <NotificationPanel />}
          </div>

          {/* Profile */}
          <Link href="/profile"
            style={{
              position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
              width: 40, height: 40, borderRadius: "50%",
              border: `1px solid ${isOnProfile ? "rgba(212,168,67,0.6)" : "rgba(212,168,67,0.22)"}`,
              background: isOnProfile ? "rgba(212,168,67,0.14)" : "rgba(212,168,67,0.07)",
              textDecoration: "none", transition: "all 0.3s", cursor: "none",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,168,67,0.6)"; (e.currentTarget as HTMLElement).style.background = "rgba(212,168,67,0.14)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = isOnProfile ? "rgba(212,168,67,0.6)" : "rgba(212,168,67,0.22)"; (e.currentTarget as HTMLElement).style.background = isOnProfile ? "rgba(212,168,67,0.14)" : "rgba(212,168,67,0.07)"; }}>
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24"
              stroke={isOnProfile ? GOLD : (isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.55)")} strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            {isOnProfile && <span style={{ position: "absolute", bottom: -3, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: GOLD }}/>}
          </Link>

          {/* Cart */}
          <Link href="/cart"
            style={{
              position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
              width: 40, height: 40, borderRadius: "50%",
              border: `1px solid ${isOnCart ? "rgba(212,168,67,0.6)" : "rgba(212,168,67,0.22)"}`,
              background: isOnCart ? "rgba(212,168,67,0.14)" : "rgba(212,168,67,0.07)",
              textDecoration: "none", transition: "all 0.3s", cursor: "none",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,168,67,0.6)"; (e.currentTarget as HTMLElement).style.background = "rgba(212,168,67,0.14)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = isOnCart ? "rgba(212,168,67,0.6)" : "rgba(212,168,67,0.22)"; (e.currentTarget as HTMLElement).style.background = isOnCart ? "rgba(212,168,67,0.14)" : "rgba(212,168,67,0.07)"; }}>
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24"
              stroke={isOnCart ? GOLD : (isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.55)")} strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: -4, right: -4, minWidth: 17, height: 17, borderRadius: "50%",
                background: GOLD, color: "#000", fontSize: 9, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `2px solid ${isDark ? "#080706" : "#FAF7F2"}`,
                animation: "cartPop 0.35s cubic-bezier(.34,1.56,.64,1)" }}>
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Order Now */}
          <Link href="/order"
            style={{ background: GOLD, color: "#000", padding: "10px 22px", borderRadius: 999,
              fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              textDecoration: "none", transition: "all 0.3s", cursor: "none",
              display: "flex", alignItems: "center", gap: 6 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = GOLD2; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(212,168,67,0.4)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = GOLD; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
            Order Now
            {cartCount > 0 && (
              <span style={{ background: "#000", color: GOLD, borderRadius: 999, padding: "1px 6px", fontSize: 10, fontWeight: 800 }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* ══ MOBILE TOP BAR ══ */}
      <div className="nav-mob-top" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
        padding: "10px 18px",
        background: mobTopBg,
        backdropFilter: "blur(24px) saturate(180%)",
        borderBottom: `1px solid ${mobBorder}`,
        transition: "background 0.4s",
        alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ color: GOLD, fontSize: 8, letterSpacing: "0.5em", textTransform: "uppercase", fontWeight: 700 }}>OGA</span>
          <span style={{ color: logoColor, fontSize: 17, fontWeight: 600, fontFamily: "'Cormorant Garamond',Georgia,serif", transition: "color 0.4s" }}>
            Madam Kitchen
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
          {/* Mobile bell */}
          <div style={{ position: "relative" }}>
            <BellButton size={38} isMob />
            {/* Mobile notif panel — full width, fixed position */}
            {notifOpen && (
              <div ref={panelRef} style={{
                position: "fixed", top: 64, left: 8, right: 8, zIndex: 600,
                maxHeight: "72vh", borderRadius: 20, overflow: "hidden",
                background: panelBg, border: `1px solid ${panelBdr}`,
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
                display: "flex", flexDirection: "column",
                animation: "notifSlideIn .25s cubic-bezier(.23,1,.32,1) both",
              }}>
                <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${panelBdr}`, flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 18, fontWeight: 600, color: fg }}>
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 999,
                          background: `${GOLD}22`, color: GOLD, border: `1px solid ${GOLD}44` }}>
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead}
                          style={{ fontSize: 10, color: fg3, background: "none", border: "none", cursor: "pointer", fontWeight: 600, textTransform: "uppercase" }}>
                          Read all
                        </button>
                      )}
                      <button onClick={() => setNotifOpen(false)}
                        style={{ fontSize: 20, color: fg3, background: "none", border: "none", cursor: "pointer", lineHeight: 1, padding: "0 2px" }}>
                        ×
                      </button>
                    </div>
                  </div>
                </div>
                <div style={{ overflowY: "auto", flex: 1 }}>
                  <NotifList compact />
                </div>
              </div>
            )}
          </div>
          <ThemeToggle mobile />
        </div>
      </div>

      {/* ══ MOBILE BOTTOM NAV ══ */}
      <nav className="nav-mob-bot" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 500,
        background: mobBotBg,
        backdropFilter: "blur(28px) saturate(200%)",
        borderTop: `1px solid ${mobBorder}`,
        alignItems: "stretch",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        boxShadow: isDark ? "0 -8px 40px rgba(0,0,0,0.55)" : "0 -4px 20px rgba(0,0,0,0.1)",
        transition: "background 0.4s, border-color 0.4s",
      }}>
        {tabs.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => goTo(tab.target, tab.id)}
              style={{ flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "10px 4px 12px", position: "relative",
                transition: "transform 0.2s", background: "none", border: "none", cursor: "pointer" }}>
              {active && (
                <span style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                  width: 28, height: 3, borderRadius: "0 0 6px 6px",
                  background: GOLD, boxShadow: "0 2px 10px rgba(212,168,67,0.7)" }}/>
              )}
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center",
                width: 42, height: 38, borderRadius: 14,
                background: active ? "rgba(212,168,67,0.1)" : "transparent",
                transition: "background 0.25s", position: "relative" }}>
                {tab.icon(active)}
                {tab.id === "cart" && cartCount > 0 && (
                  <span style={{ position: "absolute", top: 3, right: 3, minWidth: 14, height: 14, borderRadius: 999,
                    background: GOLD, color: "#000", fontSize: 8, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2px" }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </span>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 400, color: active ? GOLD : mobText,
                letterSpacing: "0.01em", marginTop: 2, transition: "color 0.25s" }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}