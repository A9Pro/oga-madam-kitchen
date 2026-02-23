"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { useSpoonCursor } from "@/hooks/useSpoonCursor";

const GOLD = "#D4A843";
const GOLD2 = "#F0C060";

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  img: string;
  cat: string;
};

const INITIAL_CART: CartItem[] = [
  { id: 1,  name: "Jollof Rice & Chicken",  price: 18.99, qty: 1, img: "/images/jollof.jpg",       cat: "Mains"     },
  { id: 2,  name: "Goat Meat Pepper Soup",  price: 22.00, qty: 1, img: "/images/pepper-soup.jpg",   cat: "Soups"     },
  { id: 3,  name: "Puff Puff",              price: 0.90,  qty: 4, img: "/images/jollof.jpg",        cat: "Appetizers"},
];

export default function CartPage() {
  const { isDark } = useTheme();
  const router = useRouter();
  useSpoonCursor();
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  // Theme tokens
  const bg      = isDark ? "#080706"               : "#FAF7F2";
  const bg2     = isDark ? "#0E0C0A"               : "#F0EAE0";
  const fg      = isDark ? "#FFFFFF"               : "#0D0B09";
  const fg2     = isDark ? "rgba(255,255,255,.55)" : "rgba(13,11,9,.55)";
  const fg3     = isDark ? "rgba(255,255,255,.22)" : "rgba(13,11,9,.22)";
  const card    = isDark ? "#111009"               : "#FFFFFF";
  const cardBdr = isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)";
  const inputBg = isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)";

  const subtotal  = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount  = promoApplied ? subtotal * 0.1 : 0;
  const delivery  = subtotal > 30 ? 0 : 3.99;
  const tax       = (subtotal - discount) * 0.08;
  const total     = subtotal - discount + delivery + tax;

  const updateQty = (id: number, delta: number) => {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    ));
  };

  const removeItem = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      setItems(prev => prev.filter(i => i.id !== id));
      setRemovingId(null);
    }, 350);
  };

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === "OGA10") {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeOut{ from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(.95)} }
        .cart-item { animation: fadeUp .4s ease both; }
        .cart-item.removing { animation: fadeOut .35s ease forwards; }
        .qty-btn:hover { background: ${GOLD} !important; color: #000 !important; }
        .remove-btn:hover { background: rgba(192,57,43,.15) !important; color: #e74c3c !important; }
        .promo-btn:hover { background: ${GOLD2} !important; }
        .checkout-btn:hover { background: ${GOLD2} !important; transform: translateY(-2px) !important; box-shadow: 0 16px 48px rgba(212,168,67,.45) !important; }
        .continue-btn:hover { border-color: ${GOLD} !important; color: ${GOLD} !important; }
        .item-card:hover { border-color: rgba(212,168,67,.28) !important; box-shadow: 0 8px 32px rgba(0,0,0,.18) !important; }

        @media(max-width:768px){
          .cart-layout { flex-direction: column !important; }
          .cart-main { min-width: unset !important; }
          .cart-summary { position: static !important; width: 100% !important; }
          .cart-hero { padding: 100px 20px 32px !important; }
          .cart-body { padding: 20px !important; gap: 16px !important; }
          .item-inner { gap: 12px !important; }
          .item-img { width: 70px !important; height: 70px !important; border-radius: 12px !important; }
          .item-price-row { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <div className="cart-hero" style={{
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
        <span style={{ fontSize: 10, letterSpacing: ".5em", textTransform: "uppercase",
          color: GOLD, fontWeight: 700, display: "block", marginBottom: 10 }}>Your Order</span>
        <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 300,
          fontSize: "clamp(2.2rem,5vw,4.2rem)", color: fg, lineHeight: .9,
          transition: "color .4s" }}>
          {items.length === 0 ? "Your cart is empty" : <>My <em style={{ color: GOLD }}>Cart</em></>}
        </h1>
        {items.length > 0 && (
          <p style={{ fontSize: 13, color: fg2, marginTop: 10, transition: "color .4s" }}>
            {items.reduce((s, i) => s + i.qty, 0)} items · Est. delivery 30–45 min
          </p>
        )}
      </div>

      {/* ── BODY ── */}
      <div className="cart-body" style={{
        maxWidth: 1200, margin: "0 auto", padding: "32px 56px 80px",
        display: "flex", gap: 28, alignItems: "flex-start",
        background: bg, transition: "background .5s", minHeight: "60vh",
      }}>

        {/* ═══ EMPTY STATE ═══ */}
        {items.length === 0 ? (
          <div style={{ flex: 1, textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>🛒</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 28,
              fontWeight: 300, color: fg, marginBottom: 12, transition: "color .4s" }}>
              Nothing here yet
            </h2>
            <p style={{ color: fg2, fontSize: 14, marginBottom: 28, transition: "color .4s" }}>
              Browse our menu and add something delicious!
            </p>
            <button onClick={() => router.push("/menu")}
              style={{ background: GOLD, color: "#000", padding: "13px 36px",
                borderRadius: 999, fontSize: 13, fontWeight: 700, border: "none",
                letterSpacing: ".08em", textTransform: "uppercase", cursor: "pointer",
                transition: "all .3s" }}
              onMouseEnter={e => { (e.currentTarget.style.background = GOLD2); (e.currentTarget.style.transform = "translateY(-2px)"); }}
              onMouseLeave={e => { (e.currentTarget.style.background = GOLD); (e.currentTarget.style.transform = "translateY(0)"); }}>
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            {/* ═══ LEFT: CART ITEMS ═══ */}
            <div className="cart-main cart-layout" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em",
                  textTransform: "uppercase", color: fg3, transition: "color .4s" }}>
                  {items.length} {items.length === 1 ? "Item" : "Items"}
                </span>
                <button onClick={() => setItems([])}
                  style={{ fontSize: 11, color: "#e74c3c", background: "none", border: "none",
                    cursor: "pointer", letterSpacing: ".06em", textTransform: "uppercase",
                    fontWeight: 600, opacity: .75, transition: "opacity .2s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = ".75")}>
                  Clear All
                </button>
              </div>

              {items.map((item, idx) => (
                <div key={item.id}
                  className={`cart-item item-card ${removingId === item.id ? "removing" : ""}`}
                  style={{ animationDelay: `${idx * 0.07}s`,
                    background: card, border: `1px solid ${cardBdr}`,
                    borderRadius: 18, overflow: "hidden", padding: "16px 18px",
                    transition: "border-color .3s, box-shadow .3s" }}>
                  <div className="item-inner" style={{ display: "flex", gap: 16, alignItems: "center" }}>

                    {/* Image */}
                    <div className="item-img" style={{ width: 82, height: 82, borderRadius: 14,
                      overflow: "hidden", flexShrink: 0 }}>
                      <img src={item.img} alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover",
                          filter: "brightness(.85)" }}/>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase",
                        color: GOLD, fontWeight: 700 }}>{item.cat}</span>
                      <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                        fontSize: 18, fontWeight: 600, color: fg, margin: "3px 0 10px",
                        transition: "color .4s", whiteSpace: "nowrap",
                        overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.name}
                      </p>

                      <div className="item-price-row" style={{ display: "flex", alignItems: "center",
                        justifyContent: "space-between", gap: 12 }}>

                        {/* Qty controls */}
                        <div style={{ display: "flex", alignItems: "center", gap: 0,
                          border: `1px solid ${cardBdr}`, borderRadius: 999,
                          overflow: "hidden" }}>
                          <button className="qty-btn" onClick={() => updateQty(item.id, -1)}
                            style={{ width: 34, height: 34, border: "none", background: inputBg,
                              color: fg, fontSize: 18, cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all .2s", fontWeight: 300 }}>−</button>
                          <span style={{ width: 36, textAlign: "center", fontSize: 14,
                            fontWeight: 700, color: fg, transition: "color .4s" }}>{item.qty}</span>
                          <button className="qty-btn" onClick={() => updateQty(item.id, 1)}
                            style={{ width: 34, height: 34, border: "none", background: inputBg,
                              color: fg, fontSize: 18, cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all .2s", fontWeight: 300 }}>+</button>
                        </div>

                        {/* Price + remove */}
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                            fontSize: 20, fontWeight: 700, color: GOLD }}>
                            ${(item.price * item.qty).toFixed(2)}
                          </span>
                          <button className="remove-btn" onClick={() => removeItem(item.id)}
                            style={{ width: 32, height: 32, borderRadius: "50%",
                              border: `1px solid ${cardBdr}`, background: "transparent",
                              color: fg2, cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all .25s" }}>
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"
                              stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue shopping */}
              <button className="continue-btn" onClick={() => router.push("/menu")}
                style={{ marginTop: 8, padding: "12px 24px", borderRadius: 999,
                  border: `1px solid ${cardBdr}`, background: "transparent",
                  color: fg2, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  letterSpacing: ".08em", textTransform: "uppercase",
                  transition: "all .3s", alignSelf: "flex-start" }}>
                + Add More Items
              </button>
            </div>

            {/* ═══ RIGHT: ORDER SUMMARY ═══ */}
            <div className="cart-summary" style={{
              width: 340, flexShrink: 0,
              position: "sticky", top: 90,
              background: card, border: `1px solid ${cardBdr}`,
              borderRadius: 22, padding: "26px 24px",
              animation: "fadeUp .5s ease .15s both",
            }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: 22, fontWeight: 600, color: fg, marginBottom: 22,
                transition: "color .4s" }}>Order Summary</h3>

              {/* Line items */}
              {[
                { label: "Subtotal", val: `$${subtotal.toFixed(2)}` },
                ...(promoApplied ? [{ label: "Promo (OGA10 −10%)", val: `−$${discount.toFixed(2)}`, gold: true }] : []),
                { label: `Delivery ${delivery === 0 ? "(Free over $30)" : ""}`, val: delivery === 0 ? "Free" : `$${delivery.toFixed(2)}` },
                { label: "Tax (8%)", val: `$${tax.toFixed(2)}` },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: fg2, transition: "color .4s" }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600,
                    color: (row as any).gold ? "#27ae60" : fg,
                    transition: "color .4s" }}>{row.val}</span>
                </div>
              ))}

              {/* Divider */}
              <div style={{ height: 1, background: cardBdr, margin: "16px 0" }}/>

              {/* Total */}
              <div style={{ display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 22 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: fg,
                  transition: "color .4s" }}>Total</span>
                <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                  fontSize: 26, fontWeight: 700, color: GOLD }}>${total.toFixed(2)}</span>
              </div>

              {/* Promo code */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value); setPromoError(false); }}
                    placeholder="Promo code"
                    style={{ flex: 1, padding: "10px 14px", borderRadius: 999,
                      border: `1px solid ${promoError ? "#e74c3c" : promoApplied ? "#27ae60" : cardBdr}`,
                      background: inputBg, color: fg, fontSize: 13, outline: "none",
                      fontFamily: "'Outfit',sans-serif", transition: "border-color .3s" }}/>
                  <button className="promo-btn" onClick={applyPromo}
                    style={{ padding: "10px 16px", borderRadius: 999,
                      background: GOLD, color: "#000", border: "none",
                      fontSize: 12, fontWeight: 700, cursor: "pointer",
                      transition: "all .25s" }}>Apply</button>
                </div>
                {promoApplied && (
                  <p style={{ fontSize: 11, color: "#27ae60", marginTop: 6, paddingLeft: 4 }}>
                    ✓ 10% discount applied!
                  </p>
                )}
                {promoError && (
                  <p style={{ fontSize: 11, color: "#e74c3c", marginTop: 6, paddingLeft: 4 }}>
                    Invalid promo code. Try OGA10
                  </p>
                )}
              </div>

              {/* Free delivery notice */}
              {delivery > 0 && (
                <div style={{ background: "rgba(212,168,67,.08)",
                  border: "1px solid rgba(212,168,67,.2)",
                  borderRadius: 12, padding: "10px 14px", marginBottom: 16 }}>
                  <p style={{ fontSize: 11.5, color: GOLD, lineHeight: 1.55 }}>
                    🚚 Add <strong>${(30 - subtotal).toFixed(2)}</strong> more for free delivery!
                  </p>
                </div>
              )}

              {/* Checkout button */}
              <button className="checkout-btn"
                style={{ width: "100%", padding: "15px",
                  background: GOLD, color: "#000", border: "none",
                  borderRadius: 999, fontSize: 14, fontWeight: 800,
                  letterSpacing: ".08em", textTransform: "uppercase",
                  cursor: "pointer", transition: "all .32s cubic-bezier(.23,1,.32,1)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Proceed to Checkout
              </button>

              {/* Trust badges */}
              <div style={{ display: "flex", justifyContent: "center", gap: 18,
                marginTop: 16, flexWrap: "wrap" }}>
                {["🔒 Secure", "⚡ Fast", "✅ Fresh"].map(b => (
                  <span key={b} style={{ fontSize: 10.5, color: fg3,
                    letterSpacing: ".04em", transition: "color .4s" }}>{b}</span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}