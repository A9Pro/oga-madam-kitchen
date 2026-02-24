"use client";

import { useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { useSpoonCursor } from "@/hooks/useSpoonCursor";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const GOLD  = "#D4A843";
const GOLD2 = "#F0C060";
const RED   = "#C0392B";
const GREEN = "#27ae60";

const PROMOS: Record<string, { type: "pct" | "flat"; value: number; label: string }> = {
  OGA10:    { type: "pct",  value: 10,   label: "10% off your order"  },
  WELCOME5: { type: "flat", value: 5,    label: "$5 off your order"   },
  FREESHIP: { type: "flat", value: 3.99, label: "Free delivery"       },
};

const UPSELLS = [
  { id: 9001, name: "Moi Moi",         price: 5.50, img: "/images/moi-moi.jpg",         cat: "Sides"      },
  { id: 9002, name: "Fried Goat Meat", price: 3.50, img: "/images/fried-goat-meat.jpg", cat: "Sides"      },
  { id: 9003, name: "Puff Puff",       price: 0.90, img: "/images/puff-puff.jpg",        cat: "Appetizers" },
  { id: 9004, name: "Meat Pie",        price: 4.00, img: "/images/meat-pie.jpg",         cat: "Appetizers" },
  { id: 9005, name: "Donuts",          price: 1.25, img: "/images/donut.jpg",            cat: "Appetizers" },
];

export default function CartPage() {
  const { isDark } = useTheme();
  const { items, cartCount, subtotal, updateQty, removeItem, clearCart, addItem, isInCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  useSpoonCursor();

  const [promoCode,    setPromoCode]    = useState("");
  const [promoApplied, setPromoApplied] = useState<string | null>(null);
  const [promoError,   setPromoError]   = useState("");
  const [removingIds,  setRemovingIds]  = useState<Set<number>>(new Set());
  const [addedIds,     setAddedIds]     = useState<Set<number>>(new Set());
  const [step,         setStep]         = useState<"cart" | "processing" | "done">("cart");
  const [checkoutError, setCheckoutError] = useState("");
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const bg      = isDark ? "#080706"               : "#FAF7F2";
  const bg2     = isDark ? "#0E0C0A"               : "#F0EAE0";
  const fg      = isDark ? "#FFFFFF"               : "#0D0B09";
  const fg2     = isDark ? "rgba(255,255,255,.55)" : "rgba(13,11,9,.55)";
  const fg3     = isDark ? "rgba(255,255,255,.20)" : "rgba(13,11,9,.20)";
  const card    = isDark ? "#111009"               : "#FFFFFF";
  const cardBdr = isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)";
  const inputBg = isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)";

  const promo       = promoApplied ? PROMOS[promoApplied] : null;
  const discount    = promo ? (promo.type === "pct" ? (subtotal * promo.value) / 100 : promo.value) : 0;
  const rawDelivery = subtotal >= 30 ? 0 : 3.99;
  const delivery    = promoApplied === "FREESHIP" ? 0 : rawDelivery;
  const taxBase     = promo?.type === "pct" ? subtotal - discount : subtotal;
  const tax         = taxBase * 0.0875;
  const total       = subtotal - discount + delivery + tax;
  const toFreeShip  = Math.max(0, 30 - subtotal);
  const shipPct     = Math.min(100, (subtotal / 30) * 100);

  const handleRemove = (id: number) => {
    setRemovingIds(p => new Set(p).add(id));
    setTimeout(() => {
      removeItem(id);
      setRemovingIds(p => { const s = new Set(p); s.delete(id); return s; });
    }, 340);
  };

  const handleUpsell = (item: typeof UPSELLS[0]) => {
    addItem(item);
    setAddedIds(p => new Set(p).add(item.id));
    setTimeout(() => setAddedIds(p => { const s = new Set(p); s.delete(item.id); return s; }), 1500);
  };

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMOS[code]) { setPromoApplied(code); setPromoError(""); }
    else { setPromoError("Invalid code. Try OGA10"); setPromoApplied(null); }
  };

  // ── SUPABASE CHECKOUT ──────────────────────────────────────────────────────
  const handleCheckout = async () => {
    setCheckoutError("");
    setStep("processing");

    try {
      // 1. Insert the order row
      const orderPayload: Record<string, unknown> = {
        total:    parseFloat(total.toFixed(2)),
        subtotal: parseFloat(subtotal.toFixed(2)),
        delivery_fee: parseFloat(delivery.toFixed(2)),
        tax:      parseFloat(tax.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        promo_code: promoApplied ?? null,
        type:     "delivery",
        status:   "Pending",
      };

      // Attach user_id only when logged in
      if (user?.id) {
        orderPayload.user_id = user.id;
      }

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderPayload)
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert each cart item as an order_item row
      const orderItems = items.map(item => ({
        order_id:   order.id,
        dish_id:    item.id,
        dish_name:  item.name,
        quantity:   item.qty,
        unit_price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Success — store order id for receipt, clear cart, show done screen
      setPlacedOrderId(order.id);
      setStep("done");

    } catch (err: unknown) {
      console.error("Checkout error:", err);
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setCheckoutError(message);
      setStep("cart");
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  const visibleUpsells = UPSELLS.filter(u => !isInCart(u.id)).slice(0, 3);

  /* ── PROCESSING ── */
  if (step === "processing") {
    return (
      <>
        <style>{`
          @keyframes spin      { to { transform: rotate(360deg); } }
          @keyframes fadePulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        `}</style>
        <div style={{ minHeight:"100svh", display:"flex", alignItems:"center",
          justifyContent:"center", flexDirection:"column", gap:24,
          background:bg, transition:"background .5s" }}>
          <div style={{ width:60, height:60, borderRadius:"50%",
            border:"3px solid rgba(212,168,67,.18)",
            borderTop:`3px solid ${GOLD}`,
            animation:"spin 1s linear infinite" }}/>
          <div style={{ textAlign:"center" }}>
            <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
              fontSize:24, color:fg, marginBottom:6,
              animation:"fadePulse 1.8s ease infinite" }}>
              Placing your order…
            </p>
            <p style={{ fontSize:13, color:fg2 }}>Sending to the kitchen</p>
          </div>
        </div>
      </>
    );
  }

  /* ── SUCCESS ── */
  if (step === "done") {
    return (
      <>
        <style>{`
          @keyframes pop      { 0%{transform:scale(0) rotate(-15deg);opacity:0} 70%{transform:scale(1.1) rotate(2deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
          @keyframes confetti { 0%{transform:translateY(-8px) rotate(0);opacity:1} 100%{transform:translateY(100px) rotate(720deg);opacity:0} }
          @keyframes fadeUpS  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        `}</style>
        <div style={{ minHeight:"100svh", display:"flex", alignItems:"center",
          justifyContent:"center", background:bg, transition:"background .5s",
          padding:"40px 20px", flexDirection:"column",
          position:"relative", overflow:"hidden" }}>
          {[...Array(14)].map((_,i) => (
            <div key={i} style={{ position:"fixed",
              left:`${6 + i*6.5}%`, top:"-10px",
              width:8, height:8, borderRadius:"50%",
              background:[GOLD,"#e74c3c",GREEN,"#3498db"][i%4],
              animation:`confetti ${1.1+i*0.12}s ease-out ${i*0.06}s forwards`,
              pointerEvents:"none", zIndex:9999 }}/>
          ))}

          <div style={{ textAlign:"center", maxWidth:500, animation:"fadeUpS .65s ease both" }}>
            <div style={{ width:92, height:92, borderRadius:"50%",
              background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 26px", fontSize:38, color:"#000",
              animation:"pop .65s cubic-bezier(.34,1.56,.64,1) .15s both",
              boxShadow:`0 20px 60px rgba(212,168,67,.45)` }}>✓</div>

            <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
              fontSize:"clamp(2.4rem,6vw,4rem)", fontWeight:300,
              color:fg, marginBottom:10, lineHeight:.9 }}>
              Order <em style={{ color:GOLD }}>Placed!</em>
            </h1>
            <p style={{ color:fg2, fontSize:14, lineHeight:1.8, marginBottom:6 }}>
              We're preparing your food now.
            </p>
            <p style={{ color:fg3, fontSize:13, marginBottom:30 }}>
              Estimated time: <strong style={{ color:GOLD }}>30–45 minutes</strong>
            </p>

            {/* Order ID badge — links to profile orders tab */}
            {placedOrderId && (
              <div style={{ marginBottom:18 }}>
                <button
                  onClick={() => router.push("/profile?tab=orders")}
                  style={{ fontSize:12, color:GOLD, background:"rgba(212,168,67,.08)",
                    border:"1px solid rgba(212,168,67,.25)", borderRadius:999,
                    padding:"7px 18px", cursor:"pointer", transition:"all .25s" }}>
                  View in Order History →
                </button>
              </div>
            )}

            <div style={{ background:card, border:`1px solid ${cardBdr}`,
              borderRadius:20, padding:"18px 22px", marginBottom:24, textAlign:"left" }}>
              <div style={{ fontSize:10, letterSpacing:".14em", textTransform:"uppercase",
                color:GOLD, fontWeight:700, marginBottom:12 }}>Receipt</div>
              {items.map(c => (
                <div key={c.id} style={{ display:"flex", justifyContent:"space-between",
                  padding:"6px 0", borderBottom:`1px solid ${cardBdr}`, fontSize:13 }}>
                  <span style={{ color:fg }}>{c.qty}× {c.name}</span>
                  <span style={{ color:GOLD, fontWeight:700 }}>${(c.price*c.qty).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", paddingTop:12 }}>
                <span style={{ fontSize:15, fontWeight:700, color:fg }}>Total</span>
                <span style={{ color:GOLD, fontFamily:"'Cormorant Garamond',Georgia,serif",
                  fontSize:22, fontWeight:700 }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              <a href="tel:7632005773"
                style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:13,
                  color:fg2, textDecoration:"none",
                  border:`1px solid ${cardBdr}`, padding:"11px 22px",
                  borderRadius:999, transition:"all .3s" }}>
                📞 (763) 200-5773
              </a>
              <button onClick={() => { clearCart(); setStep("cart"); router.push("/menu"); }}
                style={{ background:GOLD, color:"#000", border:"none",
                  padding:"11px 28px", borderRadius:999, fontSize:13,
                  fontWeight:700, cursor:"pointer",
                  letterSpacing:".07em", textTransform:"uppercase" }}>
                Order Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── MAIN CART ── */
  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(22px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeOut { from{opacity:1;transform:translateX(0) scale(1)} to{opacity:0;transform:translateX(-18px) scale(.97)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes fillBar { from{width:0%} to{width:${shipPct}%} }

        .ci      { animation: fadeUp .4s ease both; }
        .ci.out  { animation: fadeOut .34s ease forwards !important; pointer-events:none; }

        .qty-btn:hover   { background:${GOLD} !important; color:#000 !important; }
        .rm-btn:hover    { background:rgba(192,57,43,.12) !important; color:${RED} !important; border-color:rgba(192,57,43,.3) !important; }
        .ups-c:hover     { border-color:rgba(212,168,67,.45) !important; transform:translateY(-5px) !important; box-shadow:0 18px 44px rgba(0,0,0,.3) !important; }
        .ups-c:hover img { transform:scale(1.08) !important; }
        .promo-btn:hover { background:${GOLD2} !important; }
        .cta:hover       { background:${GOLD2} !important; transform:translateY(-3px) !important; box-shadow:0 20px 56px rgba(212,168,67,.5) !important; animation:none !important; }
        .back-btn:hover  { color:${GOLD} !important; }
        .clr-btn:hover   { opacity:1 !important; }
        .add-more:hover  { border-color:rgba(212,168,67,.5) !important; color:${GOLD} !important; }
        .ship-bar        { height:4px; border-radius:99px; background:linear-gradient(90deg,${GOLD},${GOLD2}); animation:fillBar .85s cubic-bezier(.23,1,.32,1) .4s both; width:${shipPct}%; }
        .cta             { background:linear-gradient(90deg,${GOLD} 0%,${GOLD2} 50%,${GOLD} 100%); background-size:220% auto; animation:shimmer 3.5s linear infinite; }

        @media(max-width:768px){
          .cart-wrap  { flex-direction:column !important; padding:16px 16px 80px !important; gap:16px !important; }
          .cart-hero  { padding:100px 20px 30px !important; }
          .cart-sum   { position:static !important; width:100% !important; }
          .item-meta  { flex-direction:column !important; align-items:flex-start !important; gap:10px !important; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="cart-hero" style={{ background:bg2,
        borderBottom:`1px solid ${cardBdr}`,
        padding:"112px 56px 36px", transition:"background .5s" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <button className="back-btn" onClick={() => router.back()}
            style={{ display:"flex", alignItems:"center", gap:7, background:"none",
              border:"none", color:fg2, fontSize:13, cursor:"pointer",
              marginBottom:22, padding:0, transition:"color .3s",
              fontFamily:"'Outfit',sans-serif" }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            Back
          </button>

          <div style={{ display:"flex", alignItems:"flex-end",
            justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <div>
              <span style={{ fontSize:10, letterSpacing:".5em", textTransform:"uppercase",
                color:GOLD, fontWeight:700, display:"block", marginBottom:10 }}>
                Your Order
              </span>
              <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontWeight:300,
                fontSize:"clamp(2.2rem,5.5vw,4.4rem)", color:fg, lineHeight:.88,
                transition:"color .4s", margin:0 }}>
                {items.length === 0
                  ? "Your cart is empty"
                  : <><em style={{ color:GOLD }}>My</em> Cart</>}
              </h1>
              {items.length > 0 && (
                <p style={{ fontSize:13, color:fg2, marginTop:10 }}>
                  {cartCount} item{cartCount !== 1 ? "s" : ""} · Est. delivery 30–45 min
                </p>
              )}
            </div>
            {items.length > 0 && (
              <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:600, color:GOLD }}>
                ${subtotal.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="cart-wrap" style={{ maxWidth:1200, margin:"0 auto",
        padding:"32px 56px 80px", display:"flex", gap:28,
        alignItems:"flex-start", background:bg, transition:"background .5s",
        minHeight:"60vh" }}>

        {/* EMPTY STATE */}
        {items.length === 0 ? (
          <div style={{ flex:1, textAlign:"center", padding:"72px 0",
            animation:"fadeUp .6s ease both" }}>
            <div style={{ width:108, height:108, borderRadius:"50%",
              background:"rgba(212,168,67,.07)",
              border:"1px solid rgba(212,168,67,.16)",
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 24px", fontSize:44 }}>🛒</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
              fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:300,
              color:fg, marginBottom:12, transition:"color .4s" }}>
              Nothing here yet
            </h2>
            <p style={{ color:fg2, fontSize:14, lineHeight:1.75,
              maxWidth:300, margin:"0 auto 32px" }}>
              Browse our menu and add something delicious!
            </p>
            <button onClick={() => router.push("/menu")}
              style={{ background:GOLD, color:"#000", padding:"14px 40px",
                borderRadius:999, fontSize:13, fontWeight:700, border:"none",
                letterSpacing:".09em", textTransform:"uppercase", cursor:"pointer",
                boxShadow:"0 12px 36px rgba(212,168,67,.35)", transition:"all .3s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background=GOLD2; (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background=GOLD;  (e.currentTarget as HTMLElement).style.transform="translateY(0)"; }}>
              Browse Menu →
            </button>
          </div>
        ) : (
          <>
            {/* ── LEFT: ITEMS ── */}
            <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:0 }}>

              <div style={{ display:"flex", alignItems:"center",
                justifyContent:"space-between", marginBottom:16 }}>
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:".14em",
                  textTransform:"uppercase", color:fg3 }}>
                  {items.length} {items.length === 1 ? "Item" : "Items"}
                </span>
                <button className="clr-btn" onClick={clearCart}
                  style={{ fontSize:11, color:RED, background:"none", border:"none",
                    cursor:"pointer", letterSpacing:".08em", textTransform:"uppercase",
                    fontWeight:600, opacity:.6, transition:"opacity .25s" }}>
                  Clear All
                </button>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {items.map((item, idx) => (
                  <div key={item.id}
                    className={`ci ${removingIds.has(item.id) ? "out" : ""}`}
                    style={{ animationDelay:`${idx * 0.065}s`,
                      background:card, border:`1px solid ${cardBdr}`,
                      borderRadius:20, overflow:"hidden",
                      transition:"border-color .3s, box-shadow .3s" }}>
                    <div style={{ display:"flex" }}>
                      {/* Image */}
                      <div style={{ width:102, height:102, flexShrink:0,
                        overflow:"hidden", position:"relative" }}>
                        <img src={item.img} alt={item.name}
                          style={{ width:"100%", height:"100%", objectFit:"cover",
                            display:"block", filter:"brightness(.82)",
                            transition:"transform .5s cubic-bezier(.23,1,.32,1)" }}/>
                        <div style={{ position:"absolute", bottom:6, left:6,
                          fontSize:8, fontWeight:700, letterSpacing:".1em",
                          textTransform:"uppercase", padding:"3px 7px",
                          borderRadius:999, backdropFilter:"blur(8px)",
                          background:"rgba(0,0,0,.55)", color:"rgba(255,255,255,.75)" }}>
                          {item.cat}
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ flex:1, minWidth:0, padding:"14px 16px",
                        display:"flex", flexDirection:"column", justifyContent:"space-between" }}>

                        <div style={{ display:"flex", alignItems:"flex-start",
                          justifyContent:"space-between", gap:8, marginBottom:10 }}>
                          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                            fontSize:19, fontWeight:600, color:fg, margin:0,
                            lineHeight:1.15, transition:"color .4s",
                            overflow:"hidden", textOverflow:"ellipsis",
                            display:"-webkit-box", WebkitLineClamp:2,
                            WebkitBoxOrient:"vertical" as const }}>
                            {item.name}
                          </p>
                          <button className="rm-btn" onClick={() => handleRemove(item.id)}
                            title="Remove item"
                            style={{ width:28, height:28, borderRadius:"50%", flexShrink:0,
                              border:`1px solid ${cardBdr}`, background:"transparent",
                              color:fg3, cursor:"pointer",
                              display:"flex", alignItems:"center",
                              justifyContent:"center", transition:"all .25s" }}>
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24"
                              stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>

                        <div className="item-meta" style={{ display:"flex",
                          alignItems:"center", justifyContent:"space-between", gap:12 }}>
                          <div style={{ display:"inline-flex", alignItems:"center",
                            border:`1px solid ${cardBdr}`, borderRadius:12,
                            overflow:"hidden", flexShrink:0 }}>
                            <button className="qty-btn" onClick={() => updateQty(item.id, -1)}
                              style={{ width:34, height:34, border:"none",
                                borderRight:`1px solid ${cardBdr}`,
                                background:inputBg, color:fg2, fontSize:18, fontWeight:300,
                                cursor:"pointer", display:"flex", alignItems:"center",
                                justifyContent:"center", transition:"all .2s" }}>−</button>
                            <span style={{ width:38, textAlign:"center", fontSize:14,
                              fontWeight:700, color:fg, transition:"color .4s",
                              userSelect:"none" as const }}>{item.qty}</span>
                            <button className="qty-btn" onClick={() => updateQty(item.id, 1)}
                              style={{ width:34, height:34, border:"none",
                                borderLeft:`1px solid ${cardBdr}`,
                                background:inputBg, color:fg2, fontSize:18, fontWeight:300,
                                cursor:"pointer", display:"flex", alignItems:"center",
                                justifyContent:"center", transition:"all .2s" }}>+</button>
                          </div>

                          <span style={{ fontSize:12, color:fg3, flexShrink:0 }}>
                            ${item.price.toFixed(2)} ea
                          </span>

                          <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                            fontSize:22, fontWeight:700, color:GOLD,
                            flexShrink:0, marginLeft:"auto" }}>
                            ${(item.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="add-more" onClick={() => router.push("/menu")}
                style={{ marginTop:14, padding:"10px 20px", borderRadius:999,
                  border:`1.5px dashed ${cardBdr}`, background:"transparent",
                  color:fg3, fontSize:12, fontWeight:600, cursor:"pointer",
                  letterSpacing:".08em", textTransform:"uppercase",
                  transition:"all .3s", alignSelf:"flex-start" }}>
                + Add More Items
              </button>

              {/* Free delivery progress */}
              {toFreeShip > 0 && promoApplied !== "FREESHIP" && (
                <div style={{ marginTop:22, padding:"15px 17px",
                  background:"rgba(212,168,67,.06)",
                  border:"1px solid rgba(212,168,67,.15)",
                  borderRadius:16, animation:"fadeUp .5s ease .2s both" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:9 }}>
                    <span style={{ fontSize:12, color:fg2, fontWeight:500 }}>
                      🚚 <strong style={{ color:GOLD }}>${toFreeShip.toFixed(2)}</strong> away from free delivery
                    </span>
                    <span style={{ fontSize:11, color:fg3 }}>{Math.round(shipPct)}%</span>
                  </div>
                  <div style={{ height:4, borderRadius:99,
                    background:"rgba(212,168,67,.14)", overflow:"hidden" }}>
                    <div className="ship-bar"/>
                  </div>
                </div>
              )}
              {(toFreeShip === 0 || promoApplied === "FREESHIP") && (
                <div style={{ marginTop:18, padding:"11px 15px",
                  background:"rgba(39,174,96,.07)",
                  border:"1px solid rgba(39,174,96,.2)",
                  borderRadius:13, fontSize:12, color:GREEN, fontWeight:600 }}>
                  🎉 You've unlocked free delivery!
                </div>
              )}

              {/* Upsells */}
              {visibleUpsells.length > 0 && (
                <div style={{ marginTop:30 }}>
                  <p style={{ fontSize:10, letterSpacing:".2em", textTransform:"uppercase",
                    color:GOLD, fontWeight:700, marginBottom:14 }}>
                    Frequently added together
                  </p>
                  <div style={{ display:"flex", gap:10, overflowX:"auto",
                    scrollbarWidth:"none" as const,
                    paddingBottom:4 }}>
                    {visibleUpsells.map(u => (
                      <div key={u.id} className="ups-c"
                        style={{ flexShrink:0, width:148, background:card,
                          border:`1px solid ${cardBdr}`, borderRadius:16,
                          overflow:"hidden", cursor:"pointer",
                          transition:"all .38s cubic-bezier(.23,1,.32,1)" }}
                        onClick={() => handleUpsell(u)}>
                        <div style={{ height:88, overflow:"hidden", position:"relative" }}>
                          <img src={u.img} alt={u.name}
                            style={{ width:"100%", height:"100%", objectFit:"cover",
                              display:"block", filter:"brightness(.8)",
                              transition:"transform .5s cubic-bezier(.23,1,.32,1)" }}/>
                          {addedIds.has(u.id) && (
                            <div style={{ position:"absolute", inset:0,
                              background:"rgba(39,174,96,.82)",
                              display:"flex", alignItems:"center",
                              justifyContent:"center", fontSize:24,
                              animation:"fadeUp .3s ease both" }}>✓</div>
                          )}
                        </div>
                        <div style={{ padding:"9px 10px 11px" }}>
                          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                            fontSize:14.5, fontWeight:600, color:fg,
                            margin:"0 0 6px", lineHeight:1.2 }}>{u.name}</p>
                          <div style={{ display:"flex", alignItems:"center",
                            justifyContent:"space-between" }}>
                            <span style={{ fontSize:13, fontWeight:700, color:GOLD,
                              fontFamily:"'Cormorant Garamond',Georgia,serif" }}>
                              ${u.price.toFixed(2)}
                            </span>
                            <span style={{ width:21, height:21, borderRadius:7,
                              background:"rgba(212,168,67,.14)",
                              border:"1px solid rgba(212,168,67,.24)",
                              display:"flex", alignItems:"center",
                              justifyContent:"center", fontSize:14,
                              color:GOLD, fontWeight:300 }}>+</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT: ORDER SUMMARY ── */}
            <div className="cart-sum" style={{ width:340, flexShrink:0,
              position:"sticky", top:88,
              background:card, border:`1px solid ${cardBdr}`,
              borderRadius:24, overflow:"hidden",
              animation:"slideIn .5s ease .12s both" }}>

              <div style={{ height:3,
                background:`linear-gradient(90deg,${GOLD},${GOLD2},${GOLD})` }}/>

              <div style={{ padding:"24px 22px 26px" }}>
                <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                  fontSize:22, fontWeight:600, color:fg,
                  marginBottom:20, transition:"color .4s" }}>Order Summary</h3>

                <div style={{ display:"flex", flexDirection:"column", gap:11, marginBottom:4 }}>
                  {((): { label: string; val: string; green?: boolean; dim?: boolean }[] => [
                    { label:"Subtotal", val:`$${subtotal.toFixed(2)}` },
                    ...(promo ? [{
                      label:`${promoApplied} — ${promo.label}`,
                      val:`−$${discount.toFixed(2)}`, green:true as const,
                    }] : []),
                    {
                      label: delivery === 0 ? "Delivery (Free 🎉)" : "Delivery (free over $30)",
                      val:   delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`,
                      dim:   delivery === 0,
                    },
                    { label:"Tax (8.75%)", val:`$${tax.toFixed(2)}`, dim:true as const },
                  ])().map(row => (
                    <div key={row.label} style={{ display:"flex",
                      justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:13,
                        color: row.green ? GREEN : fg2,
                        lineHeight:1.4, maxWidth:185 }}>
                        {row.label}
                      </span>
                      <span style={{ fontSize:13, fontWeight:600, flexShrink:0,
                        color: row.green ? GREEN : row.dim ? fg3 : fg }}>
                        {row.val}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ height:1, background:cardBdr, margin:"18px 0" }}/>

                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", marginBottom:22 }}>
                  <span style={{ fontSize:15, fontWeight:700, color:fg }}>Total</span>
                  <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                    fontSize:28, fontWeight:700, color:GOLD }}>
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Promo */}
                <div style={{ marginBottom:18 }}>
                  <div style={{ display:"flex", gap:8 }}>
                    <input ref={inputRef}
                      value={promoCode}
                      onChange={e => { setPromoCode(e.target.value); setPromoError(""); }}
                      onKeyDown={e => e.key === "Enter" && applyPromo()}
                      placeholder="Promo code"
                      style={{ flex:1, padding:"10px 14px", borderRadius:12,
                        border:`1px solid ${promoError ? RED : promoApplied ? GREEN : cardBdr}`,
                        background:inputBg, color:fg, fontSize:13, outline:"none",
                        fontFamily:"'Outfit',sans-serif", transition:"border-color .3s" }}/>
                    <button className="promo-btn" onClick={applyPromo}
                      style={{ padding:"10px 15px", borderRadius:12,
                        background:GOLD, color:"#000", border:"none",
                        fontSize:12, fontWeight:700, cursor:"pointer",
                        transition:"all .25s", whiteSpace:"nowrap" }}>Apply</button>
                  </div>
                  {promoApplied ? (
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:7 }}>
                      <span style={{ fontSize:11, color:GREEN }}>✓ {promo?.label} applied!</span>
                      <button onClick={() => { setPromoApplied(null); setPromoCode(""); }}
                        style={{ fontSize:10, color:fg3, background:"none", border:"none",
                          cursor:"pointer", textDecoration:"underline", padding:0 }}>
                        Remove
                      </button>
                    </div>
                  ) : promoError ? (
                    <p style={{ fontSize:11, color:RED, marginTop:7 }}>✗ {promoError}</p>
                  ) : (
                    <p style={{ fontSize:10, color:fg3, marginTop:6 }}>
                      Try: OGA10 · WELCOME5 · FREESHIP
                    </p>
                  )}
                </div>

                {/* Checkout error */}
                {checkoutError && (
                  <div style={{ marginBottom:14, padding:"10px 14px", borderRadius:12,
                    background:"rgba(192,57,43,.08)", border:"1px solid rgba(192,57,43,.25)",
                    fontSize:12, color:RED, lineHeight:1.5 }}>
                    ⚠ {checkoutError}
                  </div>
                )}

                {/* Checkout */}
                <button className="cta" onClick={handleCheckout}
                  style={{ width:"100%", padding:"15px", color:"#000",
                    border:"none", borderRadius:14, fontSize:14, fontWeight:800,
                    letterSpacing:".08em", textTransform:"uppercase", cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                    transition:"all .32s cubic-bezier(.23,1,.32,1)",
                    boxShadow:"0 10px 36px rgba(212,168,67,.35)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  Proceed to Checkout
                </button>

                <div style={{ display:"flex", justifyContent:"center",
                  gap:18, marginTop:16, flexWrap:"wrap" }}>
                  {["🔒 Secure","⚡ Fast","🍽️ Fresh Daily"].map(b => (
                    <span key={b} style={{ fontSize:10.5, color:fg3 }}>{b}</span>
                  ))}
                </div>

                <div style={{ marginTop:14, paddingTop:14,
                  borderTop:`1px solid ${cardBdr}`, textAlign:"center" }}>
                  <a href="tel:7632005773"
                    style={{ fontSize:12, color:fg3, textDecoration:"none",
                      transition:"color .3s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                    onMouseLeave={e => (e.currentTarget.style.color = fg3)}>
                    📞 Prefer to call? (763) 200-5773
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}