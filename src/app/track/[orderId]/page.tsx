"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
// Uncomment when Supabase is connected:
// import { createClient } from "@supabase/supabase-js";
// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const GOLD  = "#D4A843";
const GOLD2 = "#F0C060";
const GREEN = "#27ae60";
const RED   = "#C0392B";

/* ─── ORDER STATUS PIPELINE ─── */
const STAGES = [
  { key: "pending",          icon: "🕐", label: "Order Received",    desc: "We got your order!" },
  { key: "confirmed",        icon: "✅", label: "Order Confirmed",   desc: "Kitchen has been notified" },
  { key: "preparing",        icon: "👨‍🍳", label: "Preparing",          desc: "Chef is cooking your food" },
  { key: "ready",            icon: "📦", label: "Ready",             desc: "Your order is packed and ready" },
  { key: "out_for_delivery", icon: "🚗", label: "Out for Delivery",  desc: "Driver is on the way" },
  { key: "delivered",        icon: "🎉", label: "Delivered!",        desc: "Enjoy your meal!" },
] as const;

type OrderStatus = typeof STAGES[number]["key"] | "cancelled";

/* ─── MOCK ORDER DATA (replace with Supabase fetch) ─── */
const MOCK_ORDER = {
  id: "ord_8f2k9d",
  order_number: 42,
  status: "preparing" as OrderStatus,
  type: "delivery" as "delivery" | "pickup",
  items: [
    { name: "Jollof Rice & Chicken", qty: 2, price: 18.99, img: "/images/jollof.jpg" },
    { name: "Goat Meat Pepper Soup", qty: 1, price: 22.00, img: "/images/pepper-soup.jpg" },
    { name: "Puff Puff",             qty: 3, price:  0.90, img: "/images/jollof.jpg" },
  ],
  subtotal: 62.68,
  delivery_fee: 3.99,
  tax: 5.48,
  total: 72.15,
  address: "142 Maple Street, Minneapolis, MN 55430",
  estimated_ready: new Date(Date.now() + 18 * 60 * 1000), // 18 min from now
  created_at: new Date(Date.now() - 12 * 60 * 1000),
  driver: { name: "Kwame A.", phone: "763-555-0192", eta: "12 min" },
};

function useCountdown(targetDate: Date) {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, Math.floor((targetDate.getTime() - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return { remaining, formatted: `${m}:${s.toString().padStart(2, "0")}` };
}

export default function TrackPage({ params }: { params: { orderId?: string } }) {
  const { isDark } = useTheme();
  const router = useRouter();

  // ─── STATE ───
  const [order, setOrder] = useState(MOCK_ORDER);
  const [connected, setConnected] = useState(true); // set false when Supabase offline
  const [pulsing, setPulsing] = useState<string | null>(null);
  const prevStatus = useRef(order.status);

  // ─── THEME TOKENS ───
  const bg      = isDark ? "#080706"               : "#FAF7F2";
  const bg2     = isDark ? "#0E0C0A"               : "#F0EAE0";
  const fg      = isDark ? "#FFFFFF"               : "#0D0B09";
  const fg2     = isDark ? "rgba(255,255,255,.55)" : "rgba(13,11,9,.55)";
  const fg3     = isDark ? "rgba(255,255,255,.20)" : "rgba(13,11,9,.20)";
  const card    = isDark ? "#111009"               : "#FFFFFF";
  const cardBdr = isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)";

  const countdown = useCountdown(order.estimated_ready);
  const stageIdx  = STAGES.findIndex(s => s.key === order.status);
  const isDone    = order.status === "delivered";
  const isCancelled = order.status === "cancelled";
  const isDelivery  = order.type === "delivery";

  /* ─── SUPABASE REALTIME (uncomment when ready) ───────────────────────
  useEffect(() => {
    const channel = supabase
      .channel(`order-${params.orderId}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "orders",
        filter: `id=eq.${params.orderId}`,
      }, (payload) => {
        const newStatus = payload.new.status as OrderStatus;
        if (newStatus !== prevStatus.current) {
          setPulsing(newStatus);
          setTimeout(() => setPulsing(null), 2000);
          prevStatus.current = newStatus;
        }
        setOrder(prev => ({ ...prev, status: newStatus }));
      })
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });
    return () => { supabase.removeChannel(channel); };
  }, [params.orderId]);
  ─────────────────────────────────────────────────────────────────────── */

  /* ─── DEV: simulate status progression ─── */
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const stages: OrderStatus[] = ["pending","confirmed","preparing","ready","out_for_delivery","delivered"];
    let i = stages.indexOf(order.status);
    const interval = setInterval(() => {
      i = (i + 1) % stages.length;
      setPulsing(stages[i]);
      setTimeout(() => setPulsing(null), 2000);
      setOrder(prev => ({ ...prev, status: stages[i] }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const progressPct = isDone ? 100 : Math.round(((stageIdx + 1) / STAGES.length) * 100);

  return (
    <>
      <style>{`
        @keyframes statusPop  { 0%{transform:scale(1)} 40%{transform:scale(1.28)} 100%{transform:scale(1)} }
        @keyframes pulse      { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.9;transform:scale(1.05)} }
        @keyframes slideUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes confetti   { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(120px) rotate(720deg);opacity:0} }
        @keyframes checkmark  { 0%{transform:scale(0) rotate(-45deg)} 60%{transform:scale(1.2) rotate(8deg)} 100%{transform:scale(1) rotate(0deg)} }
        @keyframes trackPulse { 0%,100%{box-shadow:0 0 0 0 rgba(212,168,67,.4)} 50%{box-shadow:0 0 0 14px rgba(212,168,67,0)} }
        @keyframes shimmer    { 0%{background-position:200% center} 100%{background-position:-200% center} }

        .stage-done  { opacity:1 !important; }
        .stage-curr  { animation: trackPulse 2.4s ease infinite; }
        .stage-pop   { animation: statusPop .45s cubic-bezier(.34,1.56,.64,1); }

        @media(max-width:768px) {
          .track-layout { grid-template-columns:1fr !important; }
          .track-inner  { padding:94px 18px 100px !important; }
        }
      `}</style>

      {/* ─── Confetti on delivery ─── */}
      {isDone && (
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999, overflow:"hidden" }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} style={{
              position:"absolute",
              left: `${5 + (i * 5.2) % 90}%`,
              top: `-${10 + (i * 3) % 20}px`,
              width: 10, height: 10, borderRadius: i % 3 === 0 ? "50%" : 3,
              background: [GOLD, GOLD2, "#27ae60", "#C0392B", "#fff"][i % 5],
              animation: `confetti ${2.2 + (i % 4) * 0.4}s ease ${i * 0.12}s both`,
            }}/>
          ))}
        </div>
      )}

      <div className="track-inner" style={{
        minHeight: "100vh", background: bg, transition: "background .5s",
        padding: "108px 24px 80px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* ─── HEADER ─── */}
          <div style={{ marginBottom: 36, animation: "slideUp .6s ease" }}>
            <button onClick={() => router.back()}
              style={{ background: "none", border: `1px solid ${cardBdr}`, color: fg2,
                borderRadius: 999, padding: "8px 18px", fontSize: 12, cursor: "pointer",
                marginBottom: 20, display: "flex", alignItems: "center", gap: 8,
                transition: "all .25s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = GOLD; (e.currentTarget as HTMLElement).style.color = GOLD; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = cardBdr; (e.currentTarget as HTMLElement).style.color = fg2; }}>
              ← Back
            </button>

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              flexWrap: "wrap", gap: 12 }}>
              <div>
                <span style={{ fontSize: 10, letterSpacing: ".5em", textTransform: "uppercase",
                  color: GOLD, fontWeight: 700, display: "block", marginBottom: 8 }}>
                  Live Order Tracking
                </span>
                <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                  fontSize: "clamp(2rem,5vw,3.8rem)", fontWeight: 300, color: fg,
                  lineHeight: 1, margin: 0, transition: "color .4s" }}>
                  Order <em style={{ color: GOLD }}>#{order.order_number.toString().padStart(4,"0")}</em>
                </h1>
              </div>

              {/* Live indicator */}
              <div style={{ display: "flex", alignItems: "center", gap: 10,
                padding: "10px 20px", borderRadius: 999,
                background: connected ? "rgba(39,174,96,.08)" : "rgba(255,255,255,.04)",
                border: `1px solid ${connected ? "rgba(39,174,96,.3)" : cardBdr}` }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%",
                  background: connected ? GREEN : fg3,
                  animation: connected ? "pulse 2s ease-in-out infinite" : "none" }}/>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em",
                  textTransform: "uppercase", color: connected ? GREEN : fg3 }}>
                  {connected ? "Live Updates" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          {/* ─── MAIN LAYOUT ─── */}
          <div className="track-layout" style={{ display: "grid",
            gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>

            {/* LEFT — STATUS + PROGRESS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Current status hero card */}
              <div style={{ background: card, border: `1px solid ${cardBdr}`,
                borderRadius: 24, padding: "32px 28px",
                animation: "slideUp .65s ease .1s both",
                position: "relative", overflow: "hidden" }}>

                {/* BG glow */}
                <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%",
                  filter: "blur(80px)", pointerEvents: "none", top: -100, right: -100,
                  background: isDone ? "rgba(39,174,96,.06)" : isCancelled ? "rgba(192,57,43,.06)" : "rgba(212,168,67,.05)" }}/>

                {/* Progress bar */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: fg2, letterSpacing: ".1em",
                      textTransform: "uppercase", fontWeight: 600 }}>Progress</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: isDone ? GREEN : GOLD }}>
                      {progressPct}%
                    </span>
                  </div>
                  <div style={{ height: 8, background: isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)",
                    borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 999,
                      background: isDone
                        ? `linear-gradient(90deg,${GREEN},#2ecc71)`
                        : `linear-gradient(90deg,${GOLD},${GOLD2})`,
                      width: `${progressPct}%`,
                      transition: "width 1.2s cubic-bezier(.23,1,.32,1)",
                      backgroundSize: "200% auto",
                      animation: !isDone ? "shimmer 2.5s linear infinite" : "none",
                    }}/>
                  </div>
                </div>

                {/* Current stage display */}
                {!isCancelled && (
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <div style={{ fontSize: 64, marginBottom: 12,
                      animation: pulsing ? "statusPop .45s cubic-bezier(.34,1.56,.64,1)" : "none" }}>
                      {isDone ? "🎉" : STAGES[stageIdx]?.icon}
                    </div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                      fontSize: "2.2rem", fontWeight: 600, color: isDone ? GREEN : fg,
                      marginBottom: 8, transition: "color .4s" }}>
                      {isDone ? "Order Delivered!" : STAGES[stageIdx]?.label}
                    </h2>
                    <p style={{ fontSize: 14, color: fg2, transition: "color .4s" }}>
                      {STAGES[stageIdx]?.desc}
                    </p>
                  </div>
                )}

                {isCancelled && (
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <div style={{ fontSize: 56, marginBottom: 12 }}>❌</div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
                      fontSize: "2rem", fontWeight: 600, color: RED, marginBottom: 8 }}>
                      Order Cancelled
                    </h2>
                    <p style={{ fontSize: 14, color: fg2 }}>
                      This order was cancelled. Any payment will be refunded within 3–5 days.
                    </p>
                  </div>
                )}

                {/* ETA chip */}
                {!isDone && !isCancelled && countdown.remaining > 0 && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 10, padding: "14px 24px", borderRadius: 16,
                    background: "rgba(212,168,67,.06)", border: `1px solid rgba(212,168,67,.18)`,
                    marginTop: 8 }}>
                    <span style={{ fontSize: 22, fontWeight: 800,
                      fontFamily: "'Cormorant Garamond',Georgia,serif", color: GOLD,
                      fontVariantNumeric: "tabular-nums" }}>
                      {countdown.formatted}
                    </span>
                    <span style={{ fontSize: 12, color: fg2, letterSpacing: ".05em" }}>
                      {isDelivery && order.status === "out_for_delivery"
                        ? "ETA to your door"
                        : "Estimated time"}
                    </span>
                  </div>
                )}
              </div>

              {/* Stage timeline */}
              <div style={{ background: card, border: `1px solid ${cardBdr}`,
                borderRadius: 24, padding: "26px 28px",
                animation: "slideUp .65s ease .2s both" }}>
                <p style={{ fontSize: 10, letterSpacing: ".4em", textTransform: "uppercase",
                  color: GOLD, fontWeight: 700, marginBottom: 20 }}>Order Timeline</p>

                {STAGES.map((stage, i) => {
                  const done    = i <= stageIdx;
                  const current = i === stageIdx;
                  const isPop   = pulsing === stage.key;
                  return (
                    <div key={stage.key} style={{ display: "flex", gap: 16, position: "relative",
                      paddingBottom: i < STAGES.length - 1 ? 24 : 0,
                      opacity: done ? 1 : 0.3, transition: "opacity .5s" }}>

                      {/* Connector line */}
                      {i < STAGES.length - 1 && (
                        <div style={{ position: "absolute", left: 19, top: 42,
                          width: 2, height: "calc(100% - 18px)",
                          background: done ? `linear-gradient(to bottom,${GOLD},rgba(212,168,67,.3))` : fg3,
                          transition: "background .6s" }}/>
                      )}

                      {/* Stage dot */}
                      <div className={current ? "stage-curr" : ""} style={{
                        width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18,
                        background: done
                          ? (current ? GOLD : "rgba(212,168,67,.15)")
                          : "rgba(255,255,255,.04)",
                        border: `2px solid ${done ? GOLD : fg3}`,
                        transition: "all .4s",
                        animation: isPop ? "statusPop .45s cubic-bezier(.34,1.56,.64,1)" : "none",
                        zIndex: 1, position: "relative",
                      }}>
                        {done && !current ? "✓" : stage.icon}
                      </div>

                      {/* Stage info */}
                      <div style={{ paddingTop: 6 }}>
                        <div style={{ fontSize: 14, fontWeight: current ? 700 : 500,
                          color: current ? GOLD : done ? fg : fg3,
                          transition: "color .4s" }}>{stage.label}</div>
                        {current && (
                          <div style={{ fontSize: 12, color: fg2, marginTop: 2 }}>{stage.desc}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Driver card — only shown during delivery */}
              {isDelivery && order.status === "out_for_delivery" && (
                <div style={{ background: card, border: `1px solid ${cardBdr}`,
                  borderRadius: 24, padding: "22px 26px",
                  animation: "slideUp .5s ease" }}>
                  <p style={{ fontSize: 10, letterSpacing: ".4em", textTransform: "uppercase",
                    color: GOLD, fontWeight: 700, marginBottom: 16 }}>Your Driver</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 16,
                    justifyContent: "space-between", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 52, height: 52, borderRadius: "50%",
                        background: "rgba(212,168,67,.12)", border: `1px solid rgba(212,168,67,.25)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22 }}>🏍️</div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: fg }}>{order.driver.name}</div>
                        <div style={{ fontSize: 12, color: GOLD, marginTop: 2 }}>
                          ETA: {order.driver.eta}
                        </div>
                      </div>
                    </div>
                    <a href={`tel:${order.driver.phone}`}
                      style={{ display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "10px 22px", borderRadius: 999,
                        background: "rgba(212,168,67,.08)", border: `1px solid rgba(212,168,67,.25)`,
                        color: GOLD, fontSize: 13, fontWeight: 700, textDecoration: "none",
                        transition: "all .25s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = GOLD; (e.currentTarget as HTMLElement).style.color = "#000"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,168,67,.08)"; (e.currentTarget as HTMLElement).style.color = GOLD; }}>
                      📞 Call Driver
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT — ORDER SUMMARY */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Items */}
              <div style={{ background: card, border: `1px solid ${cardBdr}`,
                borderRadius: 24, padding: "24px 22px",
                animation: "slideUp .65s ease .15s both" }}>
                <p style={{ fontSize: 10, letterSpacing: ".4em", textTransform: "uppercase",
                  color: GOLD, fontWeight: 700, marginBottom: 18 }}>Your Items</p>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center",
                    paddingBottom: i < order.items.length - 1 ? 14 : 0,
                    marginBottom: i < order.items.length - 1 ? 14 : 0,
                    borderBottom: i < order.items.length - 1 ? `1px solid ${cardBdr}` : "none" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, overflow: "hidden",
                      flexShrink: 0, border: `1px solid ${cardBdr}` }}>
                      <img src={item.img} alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover",
                          filter: "brightness(.8)" }}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: fg,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>
                        × {item.qty}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, flexShrink: 0 }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ background: card, border: `1px solid ${cardBdr}`,
                borderRadius: 24, padding: "22px 22px",
                animation: "slideUp .65s ease .25s both" }}>
                <p style={{ fontSize: 10, letterSpacing: ".4em", textTransform: "uppercase",
                  color: GOLD, fontWeight: 700, marginBottom: 16 }}>Order Summary</p>
                {[
                  { label: "Subtotal",     val: `$${order.subtotal.toFixed(2)}` },
                  { label: isDelivery ? "Delivery" : "Pickup", val: isDelivery ? `$${order.delivery_fee.toFixed(2)}` : "Free" },
                  { label: "Tax",          val: `$${order.tax.toFixed(2)}` },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between",
                    marginBottom: 10, fontSize: 13 }}>
                    <span style={{ color: fg2 }}>{row.label}</span>
                    <span style={{ color: fg, fontWeight: 500 }}>{row.val}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: cardBdr, margin: "14px 0" }}/>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: fg }}>Total</span>
                  <span style={{ fontSize: 18, fontWeight: 800,
                    fontFamily: "'Cormorant Garamond',Georgia,serif", color: GOLD }}>
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Delivery address */}
              {isDelivery && (
                <div style={{ background: card, border: `1px solid ${cardBdr}`,
                  borderRadius: 20, padding: "18px 20px",
                  animation: "slideUp .65s ease .3s both" }}>
                  <p style={{ fontSize: 10, letterSpacing: ".4em", textTransform: "uppercase",
                    color: GOLD, fontWeight: 700, marginBottom: 10 }}>Delivering To</p>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>📍</span>
                    <span style={{ fontSize: 13, color: fg2, lineHeight: 1.6 }}>{order.address}</span>
                  </div>
                </div>
              )}

              {/* Help / contact */}
              <div style={{ background: "rgba(212,168,67,.04)", border: `1px solid rgba(212,168,67,.12)`,
                borderRadius: 20, padding: "18px 20px",
                animation: "slideUp .65s ease .35s both" }}>
                <p style={{ fontSize: 12, color: fg2, marginBottom: 12, lineHeight: 1.6 }}>
                  Need help with your order?
                </p>
                <a href="tel:7632005773"
                  style={{ display: "flex", alignItems: "center", gap: 8,
                    color: GOLD, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                  📞 (763) 200-5773
                </a>
              </div>

              {/* Reorder CTA — only on delivered */}
              {isDone && (
                <button
                  onClick={() => router.push("/menu")}
                  style={{ width: "100%", padding: "14px", borderRadius: 16,
                    background: GOLD, color: "#000", border: "none",
                    fontSize: 14, fontWeight: 700, letterSpacing: ".06em",
                    textTransform: "uppercase", cursor: "pointer",
                    transition: "all .32s cubic-bezier(.23,1,.32,1)",
                    animation: "slideUp .5s ease .4s both" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = GOLD2; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = GOLD; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                  🍽️ Order Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}