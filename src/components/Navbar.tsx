"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [cartCount] = useState(0);
  const [notifCount] = useState(2);
  const gold = "#D4A843";

  // Sync activeTab with current route
  useEffect(() => {
    if (pathname === "/cart") setActiveTab("cart");
    else if (pathname === "/profile") setActiveTab("profile");
    else if (pathname === "/menu") setActiveTab("menu");
    else setActiveTab("home");
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id: string, tab: string) => {
    setActiveTab(tab);
    setTimeout(() => {
      document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const goToPage = (path: string, tab: string) => {
    setActiveTab(tab);
    router.push(path);
  };

  // Desktop nav links
  const navLinks = [
    {
      label: "Menu",
      action: () => goToPage("/menu", "menu"),
      href: "/menu",
    },
    {
      label: "Our Story",
      action: () => pathname === "/" ? goTo("#story", "home") : goToPage("/#story", "home"),
      href: "#story",
    },
    {
      label: "Reviews",
      action: () => pathname === "/" ? goTo("#reviews", "home") : goToPage("/#reviews", "home"),
      href: "#reviews",
    },
    {
      label: "Order",
      action: () => pathname === "/" ? goTo("#order-section", "home") : goToPage("/#order-section", "home"),
      href: "#order-section",
    },
  ];

  const logoColor  = isDark ? "#fff"                        : "#0D0B09";
  const linkColor  = isDark ? "rgba(255,255,255,0.6)"       : "rgba(13,11,9,0.6)";
  const desktopBg  = scrolled ? (isDark ? "rgba(8,7,6,0.93)"        : "rgba(250,247,242,0.95)") : "transparent";
  const desktopBdr = scrolled ? (isDark ? "1px solid rgba(212,168,67,0.12)" : "1px solid rgba(212,168,67,0.2)") : "none";
  const mobTopBg   = isDark ? (scrolled ? "rgba(8,7,6,0.97)"        : "rgba(8,7,6,0.90)")
                             : (scrolled ? "rgba(250,247,242,0.97)"  : "rgba(250,247,242,0.90)");
  const mobBotBg   = isDark ? "rgba(11,9,8,0.97)"          : "rgba(250,247,242,0.97)";
  const mobBorder  = isDark ? "rgba(212,168,67,0.1)"        : "rgba(212,168,67,0.2)";
  const mobIconCol = isDark ? "rgba(255,255,255,0.45)"      : "rgba(13,11,9,0.4)";
  const mobText    = isDark ? "rgba(255,255,255,0.4)"       : "rgba(13,11,9,0.4)";
  const toggleBg   = isDark ? "#1A1714"                     : "#DDD5C5";
  const toggleBdr  = isDark ? "rgba(255,255,255,0.1)"       : "rgba(0,0,0,0.12)";
  const notifBg    = isDark ? "rgba(255,255,255,0.05)"      : "rgba(0,0,0,0.05)";

  const tabs = [
    {
      id: "home",
      label: "Home",
      action: () => {
        if (pathname === "/") goTo("#hero", "home");
        else goToPage("/", "home");
      },
      icon: (a: boolean) => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
          stroke={a ? gold : mobIconCol} strokeWidth={a ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H14v-5h-4v5H4a1 1 0 01-1-1V9.75z"/>
        </svg>
      ),
    },
    {
      id: "menu",
      label: "Menu",
      // Always navigate to /menu page
      action: () => goToPage("/menu", "menu"),
      icon: (a: boolean) => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
          stroke={a ? gold : mobIconCol} strokeWidth={a ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
        </svg>
      ),
    },
    {
      id: "cart",
      label: "Cart",
      action: () => goToPage("/cart", "cart"),
      icon: (a: boolean) => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
          stroke={a ? gold : mobIconCol} strokeWidth={a ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      action: () => goToPage("/profile", "profile"),
      icon: (a: boolean) => (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
          stroke={a ? gold : mobIconCol} strokeWidth={a ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      ),
    },
  ];

  const ThemeToggle = ({ mobile }: { mobile?: boolean }) => (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={{
        width: mobile ? 52 : 48,
        height: mobile ? 28 : 26,
        borderRadius: 999,
        border: `1px solid ${toggleBdr}`,
        background: toggleBg,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        padding: 3,
        transition: "background 0.4s",
        flexShrink: 0,
      }}
    >
      <div style={{
        width: mobile ? 20 : 18,
        height: mobile ? 20 : 18,
        borderRadius: "50%",
        background: gold,
        transform: isDark ? "translateX(0)" : `translateX(${mobile ? 24 : 22}px)`,
        transition: "transform 0.4s cubic-bezier(0.23,1,0.32,1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: mobile ? 11 : 10,
      }}>
        {isDark ? "🌙" : "☀️"}
      </div>
    </button>
  );

  return (
    <>
      {/* ══ DESKTOP NAV ══ */}
      <nav
        className="nav-desktop"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 500,
          padding: scrolled ? "12px 56px" : "22px 56px",
          background: desktopBg,
          backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          borderBottom: desktopBdr,
          transition: "all 0.4s ease",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <span style={{ color: gold, fontSize: 9, letterSpacing: "0.5em", textTransform: "uppercase", fontWeight: 700 }}>OGA</span>
          <span style={{ color: logoColor, fontSize: 20, fontWeight: 600, fontFamily: "'Cormorant Garamond',Georgia,serif", transition: "color 0.4s" }}>
            Madam Kitchen
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={e => { e.preventDefault(); link.action(); }}
              style={{
                color: pathname === link.href ? gold : linkColor,
                textDecoration: "none", fontSize: 11,
                letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500,
                transition: "color 0.3s", cursor: "none",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = gold; }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = pathname === link.href ? gold : linkColor;
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ThemeToggle />
          <Link
            href="/cart"
            style={{
              position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
              width: 40, height: 40, borderRadius: "50%",
              border: "1px solid rgba(212,168,67,0.22)",
              background: "rgba(212,168,67,0.07)",
              textDecoration: "none", transition: "all 0.3s", cursor: "none",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,168,67,0.6)";
              (e.currentTarget as HTMLElement).style.background = "rgba(212,168,67,0.14)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,168,67,0.22)";
              (e.currentTarget as HTMLElement).style.background = "rgba(212,168,67,0.07)";
            }}
          >
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke={gold} strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: -4, right: -4,
                width: 16, height: 16, borderRadius: "50%",
                background: gold, color: "#000", fontSize: 9, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          <a
            href="/menu"
            onClick={e => { e.preventDefault(); goToPage("/menu", "menu"); }}
            style={{
              background: gold, color: "#000", padding: "10px 22px",
              borderRadius: 999, fontSize: 12, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              textDecoration: "none", transition: "all 0.3s", cursor: "none",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "#F0C060";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(212,168,67,0.4)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = gold;
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            Order Now
          </a>
        </div>
      </nav>

      {/* ══ MOBILE TOP BAR ══ */}
      <div
        className="nav-mob-top"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 500,
          padding: "10px 18px",
          background: mobTopBg,
          backdropFilter: "blur(24px) saturate(180%)",
          borderBottom: `1px solid ${mobBorder}`,
          transition: "background 0.4s",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ color: gold, fontSize: 8, letterSpacing: "0.5em", textTransform: "uppercase", fontWeight: 700 }}>OGA</span>
          <span style={{ color: logoColor, fontSize: 17, fontWeight: 600, fontFamily: "'Cormorant Garamond',Georgia,serif", transition: "color 0.4s" }}>
            Madam Kitchen
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            aria-label="Notifications"
            style={{
              position: "relative", width: 38, height: 38, borderRadius: "50%",
              border: `1px solid ${mobBorder}`, background: notifBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24"
              stroke={isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)"} strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            {notifCount > 0 && (
              <span style={{
                position: "absolute", top: -2, right: -2,
                minWidth: 16, height: 16, borderRadius: 999,
                background: "#C0392B", color: "#fff",
                fontSize: 9, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 3px",
                border: `2px solid ${isDark ? "#080706" : "#FAF7F2"}`,
              }}>
                {notifCount}
              </span>
            )}
          </button>
          <ThemeToggle mobile />
        </div>
      </div>

      {/* ══ MOBILE BOTTOM NAV ══ */}
      <nav
        className="nav-mob-bot"
        style={{
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          zIndex: 500,
          background: mobBotBg,
          backdropFilter: "blur(28px) saturate(200%)",
          borderTop: `1px solid ${mobBorder}`,
          alignItems: "stretch",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          boxShadow: isDark
            ? "0 -8px 40px rgba(0,0,0,0.55)"
            : "0 -4px 20px rgba(0,0,0,0.1)",
          transition: "background 0.4s, border-color 0.4s",
        }}
      >
        {tabs.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={tab.action}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 4px 12px",
                position: "relative",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
            >
              {active && (
                <span style={{
                  position: "absolute",
                  top: 0, left: "50%",
                  transform: "translateX(-50%)",
                  width: 28, height: 3,
                  borderRadius: "0 0 6px 6px",
                  background: gold,
                  boxShadow: "0 2px 10px rgba(212,168,67,0.7)",
                }} />
              )}

              <span style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 42, height: 38, borderRadius: 14,
                background: active ? "rgba(212,168,67,0.1)" : "transparent",
                transition: "background 0.25s", position: "relative",
              }}>
                {tab.icon(active)}
                {tab.id === "cart" && cartCount > 0 && (
                  <span style={{
                    position: "absolute", top: 3, right: 3,
                    width: 14, height: 14, borderRadius: "50%",
                    background: gold, color: "#000",
                    fontSize: 8, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {cartCount}
                  </span>
                )}
              </span>

              <span style={{
                fontSize: 10, fontWeight: active ? 700 : 400,
                color: active ? gold : mobText,
                letterSpacing: "0.01em", marginTop: 2,
                transition: "color 0.25s",
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}