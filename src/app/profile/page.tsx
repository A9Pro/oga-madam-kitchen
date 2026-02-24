"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { useSpoonCursor } from "@/hooks/useSpoonCursor";

const GOLD = "#D4A843";
const GOLD2 = "#F0C060";

const BADGES = [
  { id: "first",    icon: "🥇", label: "First Order",    earned: true  },
  { id: "loyal",    icon: "👑", label: "Loyal Customer", earned: true  },
  { id: "spicy",    icon: "🔥", label: "Spice Lover",    earned: true  },
  { id: "bigorder", icon: "🎯", label: "Big Spender",    earned: false },
  { id: "reviewer", icon: "⭐", label: "Top Reviewer",   earned: false },
  { id: "vip",      icon: "💎", label: "VIP Member",     earned: false },
];

const ORDER_HISTORY = [
  { id: "#0041", date: "Feb 20, 2026", items: ["Jollof Rice & Chicken", "Puff Puff x4"],  total: "$22.59", status: "Delivered" },
  { id: "#0038", date: "Feb 14, 2026", items: ["Egusi Soup", "Pounded Yam Only"],          total: "$26.98", status: "Delivered" },
  { id: "#0031", date: "Jan 28, 2026", items: ["Suya Meat", "Goat Meat Pepper Soup"],     total: "$39.99", status: "Delivered" },
];

const FAVES = [
  { name: "Jollof Rice & Chicken", price: "$18.99", img: "/images/jollof.jpg"       },
  { name: "Goat Meat Pepper Soup", price: "$22.00", img: "/images/pepper-soup.jpg"  },
  { name: "Suya Meat",             price: "$17.99", img: "/images/suya.jpg"          },
];

const ADDRESSES = [
  { label: "Home",  addr: "142 Maple Street, Lagos, NG",      default: true  },
  { label: "Work",  addr: "34 Commerce Ave, Victoria Island", default: false },
];

type Tab = "overview" | "orders" | "favourites" | "addresses" | "settings";

export default function ProfilePage() {
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();
  useSpoonCursor();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [userName, setUserName] = useState("Ricch A.");
  const [userEmail] = useState("ricch@example.com");
  const [notifOn, setNotifOn] = useState(true);
  const [emailOn, setEmailOn] = useState(true);

  const bg      = isDark ? "#080706"               : "#FAF7F2";
  const bg2     = isDark ? "#0E0C0A"               : "#F0EAE0";
  const fg      = isDark ? "#FFFFFF"               : "#0D0B09";
  const fg2     = isDark ? "rgba(255,255,255,.55)" : "rgba(13,11,9,.55)";
  const fg3     = isDark ? "rgba(255,255,255,.22)" : "rgba(13,11,9,.22)";
  const card    = isDark ? "#111009"               : "#FFFFFF";
  const cardBdr = isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)";
  const inputBg = isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)";

  const points = 1240;
  const nextTier = 2000;
  const progress = Math.round((points / nextTier) * 100);
  const tier = points >= 2000 ? "VIP" : points >= 1000 ? "Gold" : "Silver";
  const tierColor = tier === "VIP" ? "#9b59b6" : tier === "Gold" ? GOLD : "#95a5a6";

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "overview",   label: "Overview",   icon: "◉" },
    { id: "orders",     label: "Orders",     icon: "📦" },
    { id: "favourites", label: "Favourites", icon: "❤️" },
    { id: "addresses",  label: "Addresses",  icon: "📍" },
    { id: "settings",   label: "Settings",   icon: "⚙️" },
  ];

  const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
    <button onClick={onChange}
      style={{ width: 46, height: 26, borderRadius: 999,
        background: on ? GOLD : (isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.12)"),
        border: "none", cursor: "pointer", position: "relative",
        transition: "background .3s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: on ? 22 : 3,
        width: 20, height: 20, borderRadius: "50%", background: "#fff",
        transition: "left .3s cubic-bezier(.23,1,.32,1)",
        boxShadow: "0 1px 4px rgba(0,0,0,.3)" }}/>
    </button>
  );

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .tab-btn:hover { color: ${GOLD} !important; }
        .order-card:hover { border-color: rgba(212,168,67,.25) !important; }
        .fave-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 36px rgba(0,0,0,.25) !important; }
        .badge-earned { transition: transform .2s !important; }
        .badge-earned:hover { transform: scale(1.08) !important; }
        .logout-btn:hover { background: rgba(192,57,43,.12) !important; color: #e74c3c !important; border-color: rgba(192,57,43,.3) !important; }
        .save-btn:hover { background: ${GOLD2} !important; transform: translateY(-1px) !important; }
        @media(max-width:768px){
          .profile-hero { padding: 100px 20px 28px !important; }
          .profile-layout { flex-direction: column !important; padding: 16px 20px 80px !important; }
          .profile-sidebar { width: 100% !important; position: static !important; flex-direction: row !important; overflow-x: auto !important; gap: 6px !important; padding: 0 !important; }
          .tab-btn { flex-direction: column !important; padding: 10px 14px !important; font-size: 10px !important; white-space: nowrap !important; }
          .tab-icon { font-size: 16px !important; }
          .profile-content { min-width: 0 !important; }
          .loyalty-bar-label { flex-direction: column !important; align-items: flex-start !important; gap: 2px !important; }
          .badges-grid { grid-template-columns: repeat(3,1fr) !important; }
          .faves-grid { grid-template-columns: 1fr !important; }
          .order-meta { flex-direction: column !important; align-items: flex-start !important; gap: 6px !important; }
        }
      `}</style>

      <div className="profile-hero" style={{
        background: bg2, borderBottom: `1px solid ${cardBdr}`,
        padding: "110px 56px 36px", transition: "background .5s",
      }}>
        <button onClick={() => router.back()}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none",
            border: "none", color: fg2, fontSize: 13, cursor: "pointer",
            marginBottom: 20, padding: 0, transition: "color .3s" }}
          onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
          onMouseLeave={e => (e.currentTarget.style.color = fg2)}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%",
            background: `linear-gradient(135deg,${GOLD},#8B6914)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 700, color: "#000",
            border: `3px solid ${GOLD}`, flexShrink: 0 }}>
            {userName.charAt(0)}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 300,
                fontSize: "clamp(1.8rem,4vw,3rem)", color: fg, lineHeight: 1,
                transition: "color .4s" }}>{userName}</h1>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
                textTransform: "uppercase", padding: "4px 12px", borderRadius: 999,
                background: `${tierColor}22`, color: tierColor,
                border: `1px solid ${tierColor}55` }}>{tier} Member</span>
            </div>
            <p style={{ fontSize: 13, color: fg2, marginTop: 4, transition: "color .4s" }}>
              {userEmail} · Member since Jan 2025
            </p>
          </div>
        </div>
      </div>

      <div className="profile-layout" style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "32px 56px 80px",
        display: "flex", gap: 28, alignItems: "flex-start",
        background: bg, transition: "background .5s", minHeight: "60vh",
      }}>

        <div className="profile-sidebar" style={{
          width: 200, flexShrink: 0,
          position: "sticky", top: 90,
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          {TABS.map(t => (
            <button key={t.id} className="tab-btn"
              onClick={() => setActiveTab(t.id)}
              style={{ display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", borderRadius: 14, border: "none",
                background: activeTab === t.id ? `rgba(212,168,67,.12)` : "transparent",
                color: activeTab === t.id ? GOLD : fg2,
                fontSize: 13, fontWeight: activeTab === t.id ? 700 : 400,
                cursor: "pointer", textAlign: "left",
                borderLeft: activeTab === t.id ? `3px solid ${GOLD}` : "3px solid transparent",
                transition: "all .25s" }}>
              <span className="tab-icon" style={{ fontSize: 17 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}

          <div style={{ height: 1, background: cardBdr, margin: "8px 0" }}/>

          <button className="logout-btn"
            style={{ display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px", borderRadius: 14,
              border: `1px solid ${cardBdr}`, background: "transparent",
              color: fg2, fontSize: 13, fontWeight: 500, cursor: "pointer",
              transition: "all .25s" }}>
            <span style={{ fontSize: 17 }}>🚪</span> Log Out
          </button>
        </div>

        <div className="profile-content" style={{ flex: 1, minWidth: 0, animation: "fadeUp .4s ease both" }}>

          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: `linear-gradient(135deg,#1A1400,#2A1F00)`,
                border: `1px solid ${GOLD}33`, borderRadius: 22, padding: "26px 28px",
                position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -40, right: -40,
                  width: 180, height: 180, borderRadius: "50%",
                  background: `radial-gradient(circle,${GOLD}22,transparent 70%)`,
                  pointerEvents: "none" }}/>
                <div style={{ display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <span style={{ fontSize: 9, letterSpacing: ".5em", textTransform: "uppercase",
                      color: GOLD, fontWeight: 700 }}>Loyalty Rewards</span>
                    <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                      fontSize: 36, fontWeight: 600, color: "#fff", lineHeight: 1, marginTop: 6 }}>
                      {points.toLocaleString()} <span style={{ fontSize: 14, color: GOLD, fontWeight: 400 }}>pts</span>
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 11, color: GOLD, fontWeight: 700,
                      letterSpacing: ".1em", textTransform: "uppercase" }}>{tier}</span>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 3 }}>
                      {nextTier - points} pts to VIP
                    </p>
                  </div>
                </div>
                <div className="loyalty-bar-label" style={{ display: "flex",
                  justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.5)" }}>Progress to VIP</span>
                  <span style={{ fontSize: 11, color: GOLD, fontWeight: 700 }}>{progress}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 999,
                  background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progress}%`, borderRadius: 999,
                    background: `linear-gradient(90deg,${GOLD},${GOLD2})`,
                    transition: "width 1s ease", boxShadow: `0 0 12px ${GOLD}88` }}/>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
                  {[
                    { pts: 500,  reward: "Free Puff Puff"    },
                    { pts: 1000, reward: "10% off any order" },
                    { pts: 2000, reward: "Free Jollof Rice"  },
                  ].map(r => (
                    <div key={r.pts} style={{ flex: 1, minWidth: 120,
                      background: points >= r.pts ? `${GOLD}18` : "rgba(255,255,255,.05)",
                      border: `1px solid ${points >= r.pts ? `${GOLD}44` : "rgba(255,255,255,.08)"}`,
                      borderRadius: 12, padding: "10px 14px" }}>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".06em",
                        color: points >= r.pts ? GOLD : "rgba(255,255,255,.3)",
                        textTransform: "uppercase" }}>{r.pts} pts</p>
                      <p style={{ fontSize: 12, color: points >= r.pts ? "#fff" : "rgba(255,255,255,.3)",
                        marginTop: 3 }}>{r.reward}</p>
                      {points >= r.pts && (
                        <p style={{ fontSize: 10, color: "#27ae60", marginTop: 4, fontWeight: 700 }}>✓ Unlocked</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: card, border: `1px solid ${cardBdr}`,
                borderRadius: 22, padding: "24px 26px" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                  fontSize: 20, fontWeight: 600, color: fg, marginBottom: 18,
                  transition: "color .4s" }}>Your Badges</h3>
                <div className="badges-grid" style={{ display: "grid",
                  gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
                  {BADGES.map(b => (
                    <div key={b.id} className={b.earned ? "badge-earned" : ""}
                      style={{ textAlign: "center", padding: "14px 8px", borderRadius: 16,
                        background: b.earned ? `rgba(212,168,67,.08)` : inputBg,
                        border: `1px solid ${b.earned ? `${GOLD}33` : cardBdr}`,
                        opacity: b.earned ? 1 : .4, cursor: b.earned ? "default" : "not-allowed" }}>
                      <div style={{ fontSize: 26, marginBottom: 6,
                        filter: b.earned ? "none" : "grayscale(1)" }}>{b.icon}</div>
                      <p style={{ fontSize: 9.5, fontWeight: 600, color: b.earned ? GOLD : fg3,
                        letterSpacing: ".04em", lineHeight: 1.3, transition: "color .4s" }}>
                        {b.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {[
                  { label: "Total Orders", val: "12",    icon: "📦" },
                  { label: "Total Spent",  val: "$284",  icon: "💰" },
                  { label: "Fav Dish",     val: "Jollof", icon: "❤️" },
                ].map(s => (
                  <div key={s.label} style={{ background: card,
                    border: `1px solid ${cardBdr}`, borderRadius: 18,
                    padding: "20px 18px", textAlign: "center" }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                    <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                      fontSize: 22, fontWeight: 700, color: GOLD, marginBottom: 4 }}>{s.val}</p>
                    <p style={{ fontSize: 11, color: fg2, letterSpacing: ".06em",
                      textTransform: "uppercase", transition: "color .4s" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: 26, fontWeight: 300, color: fg,
                marginBottom: 8, transition: "color .4s" }}>Order History</h2>
              {ORDER_HISTORY.map((o, i) => (
                <div key={o.id} className="order-card"
                  style={{ background: card, border: `1px solid ${cardBdr}`,
                    borderRadius: 18, padding: "20px 22px",
                    animation: `fadeUp .4s ease ${i * .08}s both`,
                    transition: "border-color .3s" }}>
                  <div className="order-meta" style={{ display: "flex",
                    justifyContent: "space-between", alignItems: "center",
                    marginBottom: 12 }}>
                    <div>
                      <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                        fontSize: 18, fontWeight: 600, color: fg,
                        transition: "color .4s" }}>{o.id}</span>
                      <span style={{ fontSize: 12, color: fg2, marginLeft: 12,
                        transition: "color .4s" }}>{o.date}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em",
                        textTransform: "uppercase", padding: "4px 12px", borderRadius: 999,
                        background: "rgba(39,174,96,.12)", color: "#27ae60",
                        border: "1px solid rgba(39,174,96,.25)" }}>{o.status}</span>
                      <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                        fontSize: 20, fontWeight: 700, color: GOLD }}>{o.total}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {o.items.map(item => (
                      <span key={item} style={{ fontSize: 12, color: fg2,
                        background: inputBg, border: `1px solid ${cardBdr}`,
                        padding: "5px 12px", borderRadius: 999,
                        transition: "color .4s, background .4s" }}>{item}</span>
                    ))}
                  </div>
                  <button style={{ marginTop: 14, fontSize: 12, color: GOLD,
                    background: "none", border: `1px solid ${GOLD}44`,
                    padding: "7px 18px", borderRadius: 999, cursor: "pointer",
                    fontWeight: 600, transition: "all .25s" }}
                    onMouseEnter={e => { (e.currentTarget.style.background = `${GOLD}18`); }}
                    onMouseLeave={e => { (e.currentTarget.style.background = "none"); }}>
                    Reorder →
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "favourites" && (
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: 26, fontWeight: 300, color: fg,
                marginBottom: 20, transition: "color .4s" }}>Favourite Dishes</h2>
              <div className="faves-grid" style={{ display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
                {FAVES.map((f, i) => (
                  <div key={f.name} className="fave-card"
                    style={{ background: card, border: `1px solid ${cardBdr}`,
                      borderRadius: 18, overflow: "hidden",
                      animation: `fadeUp .4s ease ${i * .09}s both`,
                      transition: "transform .3s, box-shadow .3s" }}>
                    <div style={{ height: 150, overflow: "hidden", position: "relative" }}>
                      <img src={f.img} alt={f.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover",
                          filter: "brightness(.8)" }}/>
                      <div style={{ position: "absolute", inset: 0,
                        background: `linear-gradient(to top,${card} 0%,transparent 60%)` }}/>
                      <button style={{ position: "absolute", top: 10, right: 10,
                        width: 32, height: 32, borderRadius: "50%", border: "none",
                        background: "rgba(192,57,43,.85)", color: "#fff", fontSize: 14,
                        cursor: "pointer", display: "flex", alignItems: "center",
                        justifyContent: "center" }}>♥</button>
                    </div>
                    <div style={{ padding: "14px 16px 16px" }}>
                      <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                        fontSize: 17, fontWeight: 600, color: fg,
                        marginBottom: 10, transition: "color .4s" }}>{f.name}</p>
                      <div style={{ display: "flex", justifyContent: "space-between",
                        alignItems: "center" }}>
                        <span style={{ fontSize: 18, fontWeight: 700,
                          color: GOLD, fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
                          {f.price}
                        </span>
                        <button style={{ padding: "7px 16px", borderRadius: 999,
                          background: GOLD, color: "#000", border: "none",
                          fontSize: 11, fontWeight: 700, cursor: "pointer",
                          transition: "all .25s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = GOLD2)}
                          onMouseLeave={e => (e.currentTarget.style.background = GOLD)}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "addresses" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                  fontSize: 26, fontWeight: 300, color: fg, transition: "color .4s" }}>
                  Saved Addresses
                </h2>
                <button style={{ padding: "9px 20px", borderRadius: 999,
                  background: GOLD, color: "#000", border: "none",
                  fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all .25s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = GOLD2)}
                  onMouseLeave={e => (e.currentTarget.style.background = GOLD)}>
                  + Add New
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {ADDRESSES.map((a, i) => (
                  <div key={a.label}
                    style={{ background: card, border: `1px solid ${a.default ? `${GOLD}44` : cardBdr}`,
                      borderRadius: 18, padding: "20px 22px",
                      animation: `fadeUp .4s ease ${i * .08}s both`,
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%",
                        background: a.default ? `${GOLD}18` : inputBg,
                        border: `1px solid ${a.default ? `${GOLD}44` : cardBdr}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, flexShrink: 0 }}>
                        {a.label === "Home" ? "🏠" : "🏢"}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: fg,
                            transition: "color .4s" }}>{a.label}</span>
                          {a.default && (
                            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".1em",
                              textTransform: "uppercase", padding: "2px 8px", borderRadius: 999,
                              background: `${GOLD}22`, color: GOLD,
                              border: `1px solid ${GOLD}44` }}>Default</span>
                          )}
                        </div>
                        <p style={{ fontSize: 13, color: fg2, marginTop: 3,
                          transition: "color .4s" }}>{a.addr}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ padding: "7px 16px", borderRadius: 999,
                        background: inputBg, border: `1px solid ${cardBdr}`,
                        color: fg2, fontSize: 12, cursor: "pointer",
                        transition: "all .25s" }}>Edit</button>
                      {!a.default && (
                        <button style={{ padding: "7px 16px", borderRadius: 999,
                          background: "transparent", border: `1px solid rgba(192,57,43,.3)`,
                          color: "#e74c3c", fontSize: 12, cursor: "pointer",
                          transition: "all .25s" }}>Remove</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: 26, fontWeight: 300, color: fg,
                marginBottom: 8, transition: "color .4s" }}>Settings</h2>

              <div style={{ background: card, border: `1px solid ${cardBdr}`,
                borderRadius: 22, padding: "24px 26px" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".06em",
                  textTransform: "uppercase", color: fg2, marginBottom: 18,
                  transition: "color .4s" }}>Profile Information</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: "Display Name", val: userName,              editable: true  },
                    { label: "Email",        val: userEmail,             editable: false },
                    { label: "Phone",        val: "+234 800 000 0000",   editable: true  },
                  ].map(field => (
                    <div key={field.label}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: fg2,
                        letterSpacing: ".06em", textTransform: "uppercase",
                        display: "block", marginBottom: 6, transition: "color .4s" }}>
                        {field.label}
                      </label>
                      <input defaultValue={field.val} disabled={!field.editable}
                        style={{ width: "100%", padding: "11px 16px", borderRadius: 12,
                          border: `1px solid ${cardBdr}`,
                          background: field.editable ? inputBg : "transparent",
                          color: field.editable ? fg : fg2, fontSize: 14,
                          outline: "none", fontFamily: "'Outfit',sans-serif",
                          boxSizing: "border-box" as const, transition: "all .3s",
                          opacity: field.editable ? 1 : .6 }}
                        onFocus={e => (e.currentTarget.style.borderColor = `${GOLD}88`)}
                        onBlur={e => (e.currentTarget.style.borderColor = cardBdr)}/>
                    </div>
                  ))}
                  <button className="save-btn"
                    style={{ alignSelf: "flex-start", padding: "10px 28px",
                      borderRadius: 999, background: GOLD, color: "#000",
                      border: "none", fontSize: 13, fontWeight: 700,
                      cursor: "pointer", transition: "all .25s", marginTop: 4 }}>
                    Save Changes
                  </button>
                </div>
              </div>

              <div style={{ background: card, border: `1px solid ${cardBdr}`,
                borderRadius: 22, padding: "24px 26px" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".06em",
                  textTransform: "uppercase", color: fg2, marginBottom: 18,
                  transition: "color .4s" }}>Notifications</h3>
                {[
                  { label: "Push Notifications", desc: "Order updates & promotions", on: notifOn, toggle: () => setNotifOn(v => !v) },
                  { label: "Email Updates",       desc: "Newsletters & special offers", on: emailOn, toggle: () => setEmailOn(v => !v) },
                ].map(n => (
                  <div key={n.label} style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "center", padding: "12px 0",
                    borderBottom: `1px solid ${cardBdr}` }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: fg,
                        transition: "color .4s" }}>{n.label}</p>
                      <p style={{ fontSize: 12, color: fg2, marginTop: 2,
                        transition: "color .4s" }}>{n.desc}</p>
                    </div>
                    <Toggle on={n.on} onChange={n.toggle}/>
                  </div>
                ))}
              </div>

              <div style={{ background: card, border: `1px solid ${cardBdr}`,
                borderRadius: 22, padding: "24px 26px" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".06em",
                  textTransform: "uppercase", color: fg2, marginBottom: 18,
                  transition: "color .4s" }}>Appearance</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: fg,
                      transition: "color .4s" }}>Dark Mode</p>
                    <p style={{ fontSize: 12, color: fg2, marginTop: 2,
                      transition: "color .4s" }}>Switch between dark and light theme</p>
                  </div>
                  <Toggle on={isDark} onChange={toggleTheme}/>
                </div>
              </div>

              <div style={{ background: "rgba(192,57,43,.06)",
                border: "1px solid rgba(192,57,43,.18)",
                borderRadius: 22, padding: "24px 26px" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: ".06em",
                  textTransform: "uppercase", color: "#e74c3c", marginBottom: 14 }}>
                  Danger Zone
                </h3>
                <p style={{ fontSize: 13, color: fg2, marginBottom: 16,
                  transition: "color .4s" }}>
                  Permanently delete your account and all associated data.
                </p>
                <button style={{ padding: "10px 22px", borderRadius: 999,
                  background: "transparent", border: "1px solid rgba(192,57,43,.4)",
                  color: "#e74c3c", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all .25s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(192,57,43,.12)")}
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