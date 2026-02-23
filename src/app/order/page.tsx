"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

/* ═══════════════════════════════════════════════════
   REAL MENU ITEMS — from ogamadam.com/menu.php
═══════════════════════════════════════════════════ */
const ORDER_ITEMS = [
  /* ── POPULAR PICKS ── */
  { id:1,  name:"Jollof Rice & Chicken",    price:18.99, cat:"Mains",      img:"/images/jollof.jpg",                    popular:true },
  { id:2,  name:"Egusi Soup",               price:20.99, cat:"Soups",      img:"/images/egusi.jpg",                     popular:true },
  { id:3,  name:"Goat Meat Pepper Soup",    price:22.00, cat:"Soups",      img:"/images/pepper-soup.jpg",               popular:true },
  { id:4,  name:"Suya Meat",                price:17.99, cat:"Mains",      img:"/images/suya.jpg",                      popular:true },
  { id:5,  name:"Ogbono Soup",              price:24.99, cat:"Soups",      img:"/images/ogbono-soup.jpg",               popular:true },
  /* ── MAINS ── */
  { id:6,  name:"Fried Rice & Chicken",     price:18.99, cat:"Mains",      img:"/images/fried-rice.jpg" },
  { id:7,  name:"Jollof Rice w/ Goat",      price:23.00, cat:"Mains",      img:"/images/jollof-rice-goat.jpg" },
  { id:8,  name:"Fried Rice w/ Goat",       price:23.00, cat:"Mains",      img:"/images/friedriceg.jpg" },
  { id:9,  name:"Dry Rice & Fried Tilapia", price:24.99, cat:"Mains",      img:"/images/atieke.jpg" },
  { id:10, name:"Baked Fish & Plantain",    price:19.99, cat:"Mains",      img:"/images/bakedfish.jpg" },
  { id:11, name:"Amala Ewedu & Gbegiri",    price:28.00, cat:"Mains",      img:"/images/amala-ewedu.jpg" },
  { id:12, name:"Potato Greens & Rice",     price:20.99, cat:"Mains",      img:"/images/potato.jpg" },
  { id:13, name:"Atieke w/ Tilapia",        price:24.99, cat:"Mains",      img:"/images/attieke.jpg" },
  { id:14, name:"Palace Sauce & Rice",      price:18.99, cat:"Mains",      img:"/images/palace.jpg" },
  { id:15, name:"Kidney Beans & Rice",      price:18.99, cat:"Mains",      img:"/images/kidneyb.jpg" },
  { id:16, name:"Cassava Leaves & Rice",    price:19.99, cat:"Mains",      img:"/images/cassavaleave.jpg" },
  { id:17, name:"Fried Chicken & Fries",    price:14.99, cat:"Mains",      img:"/images/friedchicken-frenchfries.jpg" },
  { id:18, name:"Fufu & Soup",              price:20.99, cat:"Mains",      img:"/images/fufuandsoup.jpg" },
  { id:19, name:"Attieke w/ Cassava Fish",  price:26.00, cat:"Mains",      img:"/images/attieke-withcassavafish.jpg" },
  { id:20, name:"Pepper Roasted Turkey",    price:10.99, cat:"Mains",      img:"/images/peppereddd-roat.jpg" },
  /* ── SOUPS ── */
  { id:21, name:"Catfish Pepper Soup",      price:20.99, cat:"Soups",      img:"/images/cat-fish.jpg" },
  { id:22, name:"Tilapia Pepper Soup",      price:18.99, cat:"Soups",      img:"/images/tilapia-fish.jpg" },
  { id:23, name:"Okra & Fufu",              price:19.99, cat:"Soups",      img:"/images/okrafufu.jpg" },
  { id:24, name:"Eforiro (Vegetable)",      price:23.99, cat:"Soups",      img:"/images/efo-riro.jpg" },
  { id:25, name:"Palm Butter Soup",         price:21.99, cat:"Soups",      img:"/images/palm-buttersoup.jpg" },
  /* ── SIDES ── */
  { id:26, name:"Moi Moi",                  price:5.50,  cat:"Sides",      img:"/images/moi-moi.jpg" },
  { id:27, name:"Jollof Rice Only",         price:10.00, cat:"Sides",      img:"/images/jollofrice.jpg" },
  { id:28, name:"Fried Rice Only",          price:10.00, cat:"Sides",      img:"/images/friedrice.jpg" },
  { id:29, name:"White Rice Only",          price:6.99,  cat:"Sides",      img:"/images/whiterice.jpg" },
  { id:30, name:"Pounded Yam Only",         price:5.99,  cat:"Sides",      img:"/images/poounnded.jpg" },
  { id:31, name:"Fufu Only",                price:5.99,  cat:"Sides",      img:"/images/fufu.jpg" },
  { id:32, name:"Fried Goat Meat (each)",   price:3.50,  cat:"Sides",      img:"/images/fried-goat-meat.jpg" },
  /* ── APPETIZERS ── */
  { id:33, name:"Meat Pie",                 price:4.00,  cat:"Appetizers", img:"/images/meat-pie.jpg" },
  { id:34, name:"Puff Puff",                price:0.90,  cat:"Appetizers", img:"/images/puff-puff.jpg" },
  { id:35, name:"Donuts",                   price:1.50,  cat:"Appetizers", img:"/images/donut.jpg" },
];

type CartItem = { id:number; name:string; price:number; qty:number; img:string; cat:string; };

/* ═══════════════════════════════════════════════════
   SPOON CURSOR HOOK — same as menu page
═══════════════════════════════════════════════════ */
function useSpoonCursor() {
  const raf = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer:coarse)").matches) return;

    const GOLD = "#D4A843";
    const el = document.createElement("div");
    el.id = "__spoon-cursor";
    el.innerHTML = `<svg viewBox="0 0 40 40" fill="none" style="width:100%;height:100%">
      <ellipse cx="20" cy="8" rx="7" ry="8" fill="${GOLD}" opacity=".95"/>
      <ellipse cx="20" cy="8" rx="5.5" ry="6.5" fill="#F0C060" opacity=".6"/>
      <rect x="18.5" y="14" width="3" height="22" rx="1.5" fill="${GOLD}"/>
      <rect x="19.2" y="15" width="1.6" height="20" rx=".8" fill="#F0C060" opacity=".5"/>
    </svg>`;
    el.style.cssText = `position:fixed;width:38px;height:38px;pointer-events:none;z-index:99999;
      top:0;left:0;opacity:0;transform:translate(-8px,-36px) rotate(-35deg);
      filter:drop-shadow(0 2px 8px rgba(212,168,67,.6));
      transition:transform .13s ease,opacity .3s,filter .13s;`;
    document.body.appendChild(el);

    const mouse = { x:0, y:0 };
    const pos   = { x:0, y:0 };
    let last = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      el.style.opacity = "1";
      const now = Date.now();
      if (now - last > 42) {
        last = now;
        const d = document.createElement("div");
        d.style.cssText = `position:fixed;border-radius:50%;background:${GOLD};pointer-events:none;
          left:${e.clientX}px;top:${e.clientY}px;width:4px;height:4px;z-index:99990;
          transform:translate(-50%,-50%);animation:trailFade .5s ease forwards;`;
        document.body.appendChild(d);
        setTimeout(() => d.remove(), 550);
      }
    };
    const onLeave = () => { el.style.opacity = "0"; };
    const tick = () => {
      pos.x += (mouse.x - pos.x) * 0.13;
      pos.y += (mouse.y - pos.y) * 0.13;
      el.style.left = pos.x + "px"; el.style.top = pos.y + "px";
      raf.current = requestAnimationFrame(tick);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    raf.current = requestAnimationFrame(tick);

    const grow   = () => { el.style.transform="translate(-8px,-36px) rotate(-35deg) scale(1.55)"; el.style.filter="drop-shadow(0 5px 20px rgba(212,168,67,1))"; };
    const shrink = () => { el.style.transform="translate(-8px,-36px) rotate(-35deg) scale(1)";    el.style.filter="drop-shadow(0 2px 8px rgba(212,168,67,.6))"; };
    const hot = document.querySelectorAll("a,button,[role='button'],input,select,textarea");
    hot.forEach(h => { h.addEventListener("mouseenter",grow); h.addEventListener("mouseleave",shrink); });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
      hot.forEach(h => { h.removeEventListener("mouseenter",grow); h.removeEventListener("mouseleave",shrink); });
      document.getElementById("__spoon-cursor")?.remove();
    };
  }, []);
}

/* ═══════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════ */
export default function OrderPage() {
  const { isDark } = useTheme();
  useSpoonCursor(); // ← cursor works here now

  const [mode,  setMode]  = useState<"pickup"|"delivery">("pickup");
  const [cart,  setCart]  = useState<CartItem[]>([]);
  const [step,  setStep]  = useState<1|2|3>(1);
  const [toast, setToast] = useState<{msg:string;type:"ok"|"err"}|null>(null);
  const [catTab, setCatTab] = useState("All");
  const [form,  setForm]  = useState({ name:"",phone:"",email:"",address:"",notes:"",time:"asap" });

  const bg      = isDark ? "#080706"               : "#FAF7F2";
  const bg2     = isDark ? "#0E0C0A"               : "#F0EAE0";
  const fg      = isDark ? "#FFFFFF"               : "#0D0B09";
  const fg2     = isDark ? "rgba(255,255,255,.55)" : "rgba(13,11,9,.55)";
  const fg3     = isDark ? "rgba(255,255,255,.24)" : "rgba(13,11,9,.26)";
  const card    = isDark ? "#111009"               : "#FFFFFF";
  const cardBdr = isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)";
  const inputBg = isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)";
  const GOLD    = "#D4A843";
  const GOLD2   = "#F0C060";
  const RED     = "#C0392B";

  // Scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add("vis"); io.unobserve(e.target); }
      }),
      { threshold: 0.05 }
    );
    document.querySelectorAll(".rv").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [step, catTab]);

  const showToast = (msg: string, type: "ok"|"err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addItem = (item: typeof ORDER_ITEMS[0]) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id);
      if (ex) return prev.map(c => c.id===item.id ? {...c,qty:c.qty+1} : c);
      return [...prev, {...item, qty:1}];
    });
    showToast(`${item.name} added`);
  };

  const updateQty = (id: number, delta: number) =>
    setCart(prev => prev.map(c => c.id===id ? {...c,qty:c.qty+delta} : c).filter(c => c.qty > 0));

  const subtotal  = cart.reduce((s,c) => s + c.price * c.qty, 0);
  const delivFee  = mode === "delivery" ? 3 : 0;
  const total     = subtotal + delivFee;
  const itemCount = cart.reduce((s,c) => s + c.qty, 0);

  const catTabs = ["All","Mains","Soups","Sides","Appetizers"];
  const visItems = catTab === "All" ? ORDER_ITEMS : ORDER_ITEMS.filter(i => i.cat === catTab);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.phone.trim()) { showToast("Name and phone are required","err"); return; }
    if (mode==="delivery" && !form.address.trim()) { showToast("Delivery address is required","err"); return; }
    if (cart.length === 0) { showToast("Add at least one item","err"); return; }
    setStep(3);
  };

  const inputStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
    width:"100%", padding:"12px 16px",
    borderRadius:12, border:`1px solid ${cardBdr}`,
    background:inputBg, color:fg, fontSize:14,
    fontFamily:"'Outfit',sans-serif",
    outline:"none", boxSizing:"border-box",
    transition:"border-color .25s", ...extra,
  });

  return (
    <>
      <style>{`
        @keyframes heroUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn  { from{opacity:0;transform:translateY(-18px) scale(.94)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes trailFade{ 0%{opacity:.7;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(0)} }

        .rv     { opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease; }
        .rv.vis { opacity:1;transform:translateY(0); }

        .item-card:hover { border-color:rgba(212,168,67,.32) !important; }
        .add-btn:hover   { background:${GOLD} !important; color:#000 !important; }
        .qty-btn:hover   { background:rgba(212,168,67,.16) !important; color:${GOLD} !important; }
        .btn-g:hover     { background:${GOLD2} !important; transform:translateY(-2px) !important; box-shadow:0 12px 36px rgba(212,168,67,.45) !important; }
        .btn-o:hover     { background:rgba(212,168,67,.08) !important; border-color:${GOLD} !important; }
        .input-f:focus   { border-color:rgba(212,168,67,.55) !important; }
        .c-row:hover     { border-color:rgba(212,168,67,.28) !important; }
        .tab-pill:hover  { background:rgba(212,168,67,.08) !important; color:${GOLD} !important; border-color:rgba(212,168,67,.4) !important; }

        @media(max-width:768px) {
          .ord-layout { grid-template-columns:1fr !important; }
          .ord-hdr    { padding:96px 20px 40px !important; }
          .ord-body   { padding:20px 20px 64px !important; }
          .cart-panel { position:static !important; border-radius:20px !important; }
          .form-g2    { grid-template-columns:1fr !important; }
          .step-bar   { padding:14px 20px !important; }
          .mode-bar   { flex-direction:column !important; gap:10px !important; align-items:flex-start !important; }
        }
      `}</style>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position:"fixed",top:70,left:"50%",transform:"translateX(-50%)",
          zIndex:99998, animation:"toastIn .35s cubic-bezier(.34,1.56,.64,1) both",
          background:isDark?"rgba(17,16,9,.97)":"rgba(248,244,236,.98)",
          backdropFilter:"blur(20px)",
          border:`1px solid ${toast.type==="ok"?"rgba(212,168,67,.4)":"rgba(192,57,43,.4)"}`,
          borderLeft:`3px solid ${toast.type==="ok" ? GOLD : RED}`,
          borderRadius:14, padding:"12px 22px",
          display:"flex", alignItems:"center", gap:10,
          boxShadow:"0 16px 48px rgba(0,0,0,.45)",
          maxWidth:"calc(100vw - 40px)" }}>
          <span style={{ fontSize:15, color:toast.type==="ok" ? GOLD : RED }}>
            {toast.type==="ok" ? "✓" : "⚠"}
          </span>
          <span style={{ fontSize:13, fontWeight:600, color:fg, transition:"color .4s" }}>
            {toast.msg}
          </span>
        </div>
      )}

      {/* ── STEP PROGRESS BAR ── */}
      {step < 3 && (
        <div className="step-bar" style={{ position:"sticky",top:60,zIndex:200,
          padding:"13px 56px",
          background:isDark?"rgba(8,7,6,.97)":"rgba(250,247,242,.97)",
          backdropFilter:"blur(26px)",
          borderBottom:`1px solid ${cardBdr}`,
          display:"flex",alignItems:"center",
          transition:"background .4s" }}>
          {[{n:1,label:"Build Order"},{n:2,label:"Your Details"},{n:3,label:"Confirm"}].map((s,i) => (
            <div key={s.n} style={{ display:"flex",alignItems:"center",flex:i<2?1:"auto" }}>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <div style={{ width:28,height:28,borderRadius:"50%",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:12,fontWeight:700,
                  background:step>=s.n ? GOLD : "transparent",
                  color:step>=s.n ? "#000" : fg3,
                  border:`1.5px solid ${step>=s.n ? GOLD : cardBdr}`,
                  transition:"all .3s" }}>{step > s.n ? "✓" : s.n}</div>
                <span style={{ fontSize:12, fontWeight:step===s.n?700:400,
                  color:step>=s.n ? fg : fg3, letterSpacing:".03em",
                  transition:"color .3s" }}>{s.label}</span>
              </div>
              {i < 2 && (
                <div style={{ flex:1, height:1, margin:"0 16px",
                  background:step>s.n ? GOLD : cardBdr,
                  transition:"background .4s" }}/>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ════════ STEP 3 — CONFIRMATION ════════ */}
      {step === 3 && (
        <div style={{ minHeight:"70vh", display:"flex", alignItems:"center",
          justifyContent:"center", padding:"80px 24px",
          background:bg, transition:"background .5s" }}>
          <div style={{ textAlign:"center", maxWidth:520, animation:"heroUp .8s ease both" }}>
            <div style={{ width:76,height:76,borderRadius:"50%",
              background:"rgba(212,168,67,.1)",border:`2px solid ${GOLD}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:32,margin:"0 auto 22px",color:GOLD }}>✓</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
              fontSize:"clamp(2.2rem,5.5vw,3.8rem)",fontWeight:300,
              color:fg,marginBottom:12,transition:"color .4s" }}>
              Order Placed!
            </h2>
            <p style={{ fontSize:15,color:fg2,lineHeight:1.85,marginBottom:6,transition:"color .4s" }}>
              Thank you, <strong style={{ color:fg }}>{form.name}</strong>!
            </p>
            <p style={{ fontSize:13,color:fg3,marginBottom:30,transition:"color .4s" }}>
              {mode==="pickup"
                ? "Ready for pickup in 15–25 min · 6000 Shingle Creek Pkwy"
                : `Delivery to ${form.address} in approx 30–45 min`}
            </p>
            <div style={{ background:card,border:`1px solid ${cardBdr}`,
              borderRadius:20,padding:"20px 24px",marginBottom:26,textAlign:"left" }}>
              {cart.map(c => (
                <div key={c.id} style={{ display:"flex",justifyContent:"space-between",
                  alignItems:"center",padding:"8px 0",
                  borderBottom:`1px solid ${cardBdr}`,fontSize:13.5 }}>
                  <span style={{ color:fg,transition:"color .4s" }}>{c.qty}× {c.name}</span>
                  <span style={{ color:GOLD,fontWeight:700 }}>${(c.price*c.qty).toFixed(2)}</span>
                </div>
              ))}
              {mode==="delivery" && (
                <div style={{ display:"flex",justifyContent:"space-between",
                  padding:"8px 0",borderBottom:`1px solid ${cardBdr}`,
                  fontSize:13,color:fg2 }}>
                  <span>Delivery fee</span><span>$3.00</span>
                </div>
              )}
              <div style={{ display:"flex",justifyContent:"space-between",
                padding:"11px 0 0",fontSize:16,fontWeight:700 }}>
                <span style={{ color:fg,transition:"color .4s" }}>Total</span>
                <span style={{ color:GOLD,fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:20 }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
            <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
              <a href="tel:7632005773"
                style={{ display:"inline-flex",alignItems:"center",gap:8,
                  fontSize:13,color:fg2,textDecoration:"none",
                  border:`1px solid ${cardBdr}`,padding:"10px 22px",
                  borderRadius:999,transition:"all .3s" }}>
                📞 (763) 200-5773
              </a>
              <button onClick={() => { setCart([]); setStep(1); setForm({name:"",phone:"",email:"",address:"",notes:"",time:"asap"}); }}
                style={{ display:"inline-flex",alignItems:"center",gap:8,
                  fontSize:13,color:GOLD,border:`1px solid rgba(212,168,67,.3)`,
                  padding:"10px 22px",borderRadius:999,background:"transparent",
                  cursor:"pointer",transition:"all .3s" }}>
                Place Another Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ STEP 1 & 2 ════════ */}
      {step < 3 && (
        <>
          {/* ── HEADER ── */}
          <div style={{ background:bg2,borderBottom:`1px solid ${cardBdr}`,
            transition:"background .5s" }}>
            <div className="ord-hdr" style={{ maxWidth:1200,margin:"0 auto",
              padding:"108px 56px 44px" }}>
              <span style={{ fontSize:10,letterSpacing:".5em",textTransform:"uppercase",
                color:GOLD,fontWeight:700,display:"block",marginBottom:14,
                animation:"heroUp .8s ease .15s both" }}>
                {mode==="pickup" ? "In-Store Pickup" : "Home Delivery"}
              </span>
              <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:300,
                lineHeight:.88,color:fg,marginBottom:24,
                fontSize:"clamp(2.6rem,7vw,5.5rem)",transition:"color .4s",
                animation:"heroUp .95s ease .28s both" }}>
                {step===1 ? <>Build Your <em style={{ color:GOLD }}>Order</em></> : <>Your <em style={{ color:GOLD }}>Details</em></>}
              </h1>

              {/* Mode toggle */}
              <div className="mode-bar" style={{ display:"flex",alignItems:"center",gap:16 }}>
                <div style={{ display:"inline-flex",
                  background:isDark?"rgba(255,255,255,.05)":"rgba(0,0,0,.05)",
                  borderRadius:999,padding:4,gap:4 }}>
                  {[{k:"pickup",icon:"🏪",label:"Pickup",sub:"15–25 min · Free"},
                    {k:"delivery",icon:"🚗",label:"Delivery",sub:"30–45 min · $3"}].map(({k,icon,label,sub}) => (
                    <button key={k} onClick={() => setMode(k as "pickup"|"delivery")}
                      style={{ padding:"10px 22px",borderRadius:999,border:"none",
                        cursor:"pointer",fontSize:13,fontWeight:600,textAlign:"left",
                        background:mode===k ? GOLD : "transparent",
                        color:mode===k ? "#000" : fg2,
                        transition:"all .3s" }}>
                      {icon} {label}
                      <span style={{ display:"block",fontSize:10,fontWeight:400,
                        opacity:.7,marginTop:1 }}>{sub}</span>
                    </button>
                  ))}
                </div>
                {step===1 && itemCount>0 && (
                  <span style={{ fontSize:12,color:fg2,transition:"color .4s" }}>
                    {itemCount} item{itemCount>1?"s":""} · ${total.toFixed(2)} total
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="ord-body" style={{ maxWidth:1200,margin:"0 auto",
            padding:"32px 56px 80px" }}>
            <div className="ord-layout" style={{ display:"grid",
              gridTemplateColumns:"1fr 360px",gap:26,alignItems:"start" }}>

              {/* ── LEFT PANEL ── */}
              <div>

                {/* ── STEP 1: MENU PICKER ── */}
                {step === 1 && (
                  <>
                    {/* Category tabs */}
                    <div style={{ display:"flex",gap:8,marginBottom:22,overflowX:"auto",
                      scrollbarWidth:"none",WebkitOverflowScrolling:"touch" }}>
                      {catTabs.map(c => (
                        <button key={c}
                          className={catTab===c ? "" : "tab-pill"}
                          onClick={() => setCatTab(c)}
                          style={{ padding:"7px 18px",borderRadius:999,fontSize:11.5,
                            fontWeight:600,letterSpacing:".05em",textTransform:"uppercase",
                            border:`1px solid ${catTab===c ? GOLD : cardBdr}`,
                            background:catTab===c ? GOLD : "transparent",
                            color:catTab===c ? "#000" : fg2,
                            cursor:"pointer",whiteSpace:"nowrap",transition:"all .25s" }}>
                          {c}
                        </button>
                      ))}
                    </div>

                    <div style={{ display:"grid",
                      gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",
                      gap:12 }}>
                      {visItems.map(item => {
                        const inCart = cart.find(c => c.id===item.id);
                        return (
                          <div key={item.id} className="item-card rv"
                            style={{ background:card,
                              border:`1px solid ${inCart ? "rgba(212,168,67,.38)" : cardBdr}`,
                              borderRadius:17,overflow:"hidden",
                              transition:"border-color .25s",
                              display:"flex",alignItems:"center",gap:0 }}>
                            <img src={item.img} alt={item.name}
                              style={{ width:80,height:80,objectFit:"cover",
                                flexShrink:0,filter:"brightness(.82)" }}/>
                            <div style={{ padding:"10px 12px",flex:1,minWidth:0 }}>
                              <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                                fontSize:16,fontWeight:600,color:fg,display:"block",
                                marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",
                                textOverflow:"ellipsis",transition:"color .4s" }}>{item.name}</span>
                              <div style={{ display:"flex",alignItems:"center",
                                justifyContent:"space-between",gap:8,marginTop:4 }}>
                                <span style={{ color:GOLD,fontWeight:800,fontSize:15,
                                  fontFamily:"'Cormorant Garamond',Georgia,serif" }}>
                                  ${item.price.toFixed(2)}
                                </span>
                                {inCart ? (
                                  <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                                    <button className="qty-btn"
                                      onClick={() => updateQty(item.id,-1)}
                                      style={{ width:26,height:26,borderRadius:8,
                                        border:`1px solid ${cardBdr}`,background:"transparent",
                                        color:fg2,fontSize:15,cursor:"pointer",
                                        display:"flex",alignItems:"center",justifyContent:"center",
                                        transition:"all .2s" }}>−</button>
                                    <span style={{ fontSize:13,fontWeight:700,color:GOLD,
                                      minWidth:14,textAlign:"center" }}>{inCart.qty}</span>
                                    <button className="qty-btn"
                                      onClick={() => updateQty(item.id,1)}
                                      style={{ width:26,height:26,borderRadius:8,
                                        border:`1px solid ${cardBdr}`,background:"transparent",
                                        color:fg2,fontSize:15,cursor:"pointer",
                                        display:"flex",alignItems:"center",justifyContent:"center",
                                        transition:"all .2s" }}>+</button>
                                  </div>
                                ) : (
                                  <button className="add-btn"
                                    onClick={() => addItem(item)}
                                    style={{ width:30,height:30,borderRadius:9,
                                      border:`1px solid rgba(212,168,67,.3)`,
                                      background:"transparent",color:GOLD,fontSize:18,
                                      cursor:"pointer",display:"flex",
                                      alignItems:"center",justifyContent:"center",
                                      transition:"all .25s",fontWeight:300,lineHeight:1 }}>+</button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {cart.length > 0 && (
                      <div style={{ marginTop:28,display:"flex",justifyContent:"flex-end" }}>
                        <button className="btn-g"
                          onClick={() => setStep(2)}
                          style={{ display:"inline-flex",alignItems:"center",gap:10,
                            background:GOLD,color:"#000",padding:"14px 36px",
                            borderRadius:999,fontSize:13,fontWeight:700,
                            letterSpacing:".08em",textTransform:"uppercase",
                            border:"none",cursor:"pointer",
                            transition:"all .32s cubic-bezier(.23,1,.32,1)" }}>
                          Continue to Details →
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* ── STEP 2: DETAILS FORM ── */}
                {step === 2 && (
                  <div className="rv vis">
                    <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:22,
                      fontWeight:600,color:fg,marginBottom:24,transition:"color .4s" }}>
                      Your Contact Details
                    </h2>
                    <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
                      <div className="form-g2" style={{ display:"grid",
                        gridTemplateColumns:"1fr 1fr",gap:14 }}>
                        <div>
                          <label style={{ fontSize:11,letterSpacing:".18em",textTransform:"uppercase",
                            color:fg3,fontWeight:600,display:"block",marginBottom:8,
                            transition:"color .4s" }}>Full Name *</label>
                          <input className="input-f" type="text" value={form.name}
                            onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                            placeholder="Your name" style={inputStyle()}/>
                        </div>
                        <div>
                          <label style={{ fontSize:11,letterSpacing:".18em",textTransform:"uppercase",
                            color:fg3,fontWeight:600,display:"block",marginBottom:8,
                            transition:"color .4s" }}>Phone Number *</label>
                          <input className="input-f" type="tel" value={form.phone}
                            onChange={e=>setForm(f=>({...f,phone:e.target.value}))}
                            placeholder="(612) 555-0100" style={inputStyle()}/>
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize:11,letterSpacing:".18em",textTransform:"uppercase",
                          color:fg3,fontWeight:600,display:"block",marginBottom:8,
                          transition:"color .4s" }}>Email (optional)</label>
                        <input className="input-f" type="email" value={form.email}
                          onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                          placeholder="you@email.com" style={inputStyle()}/>
                      </div>
                      {mode==="delivery" && (
                        <div>
                          <label style={{ fontSize:11,letterSpacing:".18em",textTransform:"uppercase",
                            color:fg3,fontWeight:600,display:"block",marginBottom:8,
                            transition:"color .4s" }}>Delivery Address *</label>
                          <input className="input-f" type="text" value={form.address}
                            onChange={e=>setForm(f=>({...f,address:e.target.value}))}
                            placeholder="123 Main St, Minneapolis, MN" style={inputStyle()}/>
                        </div>
                      )}
                      <div>
                        <label style={{ fontSize:11,letterSpacing:".18em",textTransform:"uppercase",
                          color:fg3,fontWeight:600,display:"block",marginBottom:8,
                          transition:"color .4s" }}>Preferred Time</label>
                        <select className="input-f" value={form.time}
                          onChange={e=>setForm(f=>({...f,time:e.target.value}))}
                          style={{...inputStyle(),cursor:"pointer",appearance:"auto" as const}}>
                          <option value="asap">As soon as possible</option>
                          <option value="30">In 30 minutes</option>
                          <option value="60">In 1 hour</option>
                          <option value="custom">Custom time — call us</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize:11,letterSpacing:".18em",textTransform:"uppercase",
                          color:fg3,fontWeight:600,display:"block",marginBottom:8,
                          transition:"color .4s" }}>Special Instructions</label>
                        <textarea className="input-f" value={form.notes}
                          onChange={e=>setForm(f=>({...f,notes:e.target.value}))}
                          placeholder="Allergies, spice level, special requests…"
                          rows={3} style={{...inputStyle(),resize:"none" as const}}/>
                      </div>
                    </div>
                    <div style={{ display:"flex",gap:12,marginTop:28,flexWrap:"wrap" }}>
                      <button className="btn-o"
                        onClick={() => setStep(1)}
                        style={{ display:"inline-flex",alignItems:"center",gap:8,
                          padding:"13px 28px",borderRadius:999,fontSize:13,fontWeight:600,
                          letterSpacing:".07em",textTransform:"uppercase",
                          border:`1.5px solid rgba(212,168,67,.4)`,color:GOLD,
                          background:"transparent",cursor:"pointer",transition:"all .3s" }}>
                        ← Back
                      </button>
                      <button className="btn-g"
                        onClick={handleSubmit}
                        style={{ display:"inline-flex",alignItems:"center",gap:10,
                          padding:"14px 36px",borderRadius:999,fontSize:13,fontWeight:700,
                          letterSpacing:".08em",textTransform:"uppercase",
                          background:GOLD,color:"#000",border:"none",cursor:"pointer",
                          transition:"all .32s cubic-bezier(.23,1,.32,1)" }}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                        Confirm Order · ${total.toFixed(2)}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── RIGHT: CART SUMMARY ── */}
              <div className="cart-panel" style={{ position:"sticky",top:130,
                background:card,border:`1px solid ${cardBdr}`,
                borderRadius:24,padding:"24px",
                transition:"background .4s,border-color .4s" }}>
                <div style={{ display:"flex",alignItems:"center",
                  justifyContent:"space-between",marginBottom:20 }}>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                    fontSize:20,fontWeight:600,color:fg,transition:"color .4s" }}>
                    Your Order
                  </h3>
                  {itemCount > 0 && (
                    <span style={{ fontSize:11,fontWeight:700,padding:"3px 10px",
                      borderRadius:999,background:GOLD,color:"#000" }}>
                      {itemCount} item{itemCount>1?"s":""}
                    </span>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div style={{ textAlign:"center",padding:"32px 0",color:fg3,transition:"color .4s" }}>
                    <div style={{ fontSize:36,marginBottom:12 }}>🛒</div>
                    <p style={{ fontSize:13 }}>Add dishes from the menu above.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display:"flex",flexDirection:"column",gap:9,marginBottom:16,
                      maxHeight:320,overflowY:"auto" }}>
                      {cart.map(c => (
                        <div key={c.id} className="c-row"
                          style={{ display:"flex",alignItems:"center",gap:10,
                            padding:"9px 11px",borderRadius:13,
                            border:`1px solid ${cardBdr}`,transition:"border-color .25s" }}>
                          <img src={c.img} alt={c.name}
                            style={{ width:40,height:40,borderRadius:9,
                              objectFit:"cover",flexShrink:0,filter:"brightness(.85)" }}/>
                          <div style={{ flex:1,minWidth:0 }}>
                            <span style={{ fontSize:12.5,fontWeight:600,color:fg,
                              display:"block",overflow:"hidden",textOverflow:"ellipsis",
                              whiteSpace:"nowrap",transition:"color .4s" }}>{c.name}</span>
                            <span style={{ fontSize:12,color:GOLD,fontWeight:700 }}>
                              ${(c.price*c.qty).toFixed(2)}
                            </span>
                          </div>
                          <div style={{ display:"flex",alignItems:"center",gap:5,flexShrink:0 }}>
                            <button className="qty-btn"
                              onClick={() => updateQty(c.id,-1)}
                              style={{ width:22,height:22,borderRadius:7,
                                border:`1px solid ${cardBdr}`,background:"transparent",
                                color:fg2,fontSize:13,cursor:"pointer",
                                display:"flex",alignItems:"center",justifyContent:"center",
                                transition:"all .2s" }}>−</button>
                            <span style={{ fontSize:13,fontWeight:700,color:fg,
                              minWidth:14,textAlign:"center",transition:"color .4s" }}>{c.qty}</span>
                            <button className="qty-btn"
                              onClick={() => updateQty(c.id,1)}
                              style={{ width:22,height:22,borderRadius:7,
                                border:`1px solid ${cardBdr}`,background:"transparent",
                                color:fg2,fontSize:13,cursor:"pointer",
                                display:"flex",alignItems:"center",justifyContent:"center",
                                transition:"all .2s" }}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div style={{ borderTop:`1px solid ${cardBdr}`,paddingTop:14,
                      display:"flex",flexDirection:"column",gap:7 }}>
                      <div style={{ display:"flex",justifyContent:"space-between",fontSize:13,color:fg2 }}>
                        <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                      </div>
                      {mode==="delivery" && (
                        <div style={{ display:"flex",justifyContent:"space-between",fontSize:13,color:fg2 }}>
                          <span>Delivery fee</span><span>$3.00</span>
                        </div>
                      )}
                      <div style={{ display:"flex",justifyContent:"space-between",
                        paddingTop:8,borderTop:`1px solid ${cardBdr}`,marginTop:4 }}>
                        <span style={{ fontSize:16,fontWeight:700,color:fg,transition:"color .4s" }}>Total</span>
                        <span style={{ color:GOLD,fontFamily:"'Cormorant Garamond',Georgia,serif",
                          fontSize:20,fontWeight:600 }}>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Mode pill */}
                    <div style={{ marginTop:14,padding:"10px 14px",borderRadius:11,
                      background:mode==="pickup"?"rgba(212,168,67,.07)":"rgba(192,57,43,.07)",
                      border:`1px solid ${mode==="pickup"?"rgba(212,168,67,.2)":"rgba(192,57,43,.2)"}`,
                      fontSize:12,color:fg2,display:"flex",alignItems:"center",gap:8,
                      transition:"color .4s" }}>
                      <span style={{ fontSize:15 }}>{mode==="pickup"?"🏪":"🚗"}</span>
                      <span>
                        <strong style={{ color:fg,transition:"color .4s" }}>
                          {mode==="pickup" ? "Pickup" : "Delivery"}
                        </strong>
                        {" · "}
                        {mode==="pickup" ? "Ready in 15–25 min" : "30–45 min to your door"}
                      </span>
                    </div>

                    {/* CTA on step 1 */}
                    {step === 1 && (
                      <button className="btn-g"
                        onClick={() => setStep(2)}
                        style={{ width:"100%",display:"flex",alignItems:"center",
                          justifyContent:"center",gap:8,marginTop:14,
                          padding:"13px",borderRadius:13,fontSize:13,fontWeight:700,
                          letterSpacing:".07em",textTransform:"uppercase",
                          background:GOLD,color:"#000",border:"none",cursor:"pointer",
                          transition:"all .32s cubic-bezier(.23,1,.32,1)" }}>
                        Proceed to Details →
                      </button>
                    )}
                  </>
                )}

                <div style={{ marginTop:16,textAlign:"center" }}>
                  <a href="tel:7632005773"
                    style={{ fontSize:12,color:fg3,textDecoration:"none",transition:"color .3s" }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color=GOLD;}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color=fg3;}}>
                    📞 Prefer to call? (763) 200-5773
                  </a>
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </>
  );
}