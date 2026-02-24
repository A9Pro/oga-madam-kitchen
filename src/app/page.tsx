"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const DISHES = [
  { id:12, name:"Jollof Rice & Chicken", price:"$18.99", priceNum:18.99, tag:"Fan Favourite",  tagBg:"rgba(212,168,67,.15)", tagC:"#D4A843", tagBdr:"rgba(212,168,67,.4)",  desc:"Smoky party-style jollof with a perfectly scorched base. Made fresh every single day.",                img:"/images/jollof.jpg",      cat:"Mains", col:7 },
  { id:18, name:"Suya Meat",            price:"$17.99", priceNum:17.99, tag:"Bestseller",     tagBg:"rgba(192,57,43,.15)",  tagC:"#e74c3c", tagBdr:"rgba(192,57,43,.4)",   desc:"Spiced grilled beef skewers with onions, tomatoes & the iconic yaji spice rub.",                         img:"/images/suya.jpg",        cat:"Mains", col:5 },
  { id:8,  name:"Egusi Soup",           price:"$20.99", priceNum:20.99, tag:"Chef's Special", tagBg:"rgba(230,126,34,.15)", tagC:"#e67e22", tagBdr:"rgba(230,126,34,.4)",  desc:"Rich melon seed soup slow-cooked with assorted meat, leafy greens & palm oil.",                           img:"/images/egusi.jpg",       cat:"Soups", col:4 },
  { id:26, name:"Pounded Yam & Soup",   price:"$20.99", priceNum:20.99, tag:"Comfort Food",   tagBg:"rgba(39,174,96,.12)",  tagC:"#27ae60", tagBdr:"rgba(39,174,96,.35)",  desc:"Silky smooth swallow with your choice of rich, hearty Nigerian soup.",                                    img:"/images/pounded-yam.jpg", cat:"Mains", col:4 },
  { id:4,  name:"Pepper Soup",          price:"$22.00", priceNum:22.00, tag:"Spicy 🔥",        tagBg:"rgba(155,89,182,.12)", tagC:"#9b59b6", tagBdr:"rgba(155,89,182,.3)",  desc:"Spicy native pepper soup with assorted proteins & aromatic spices.",                                      img:"/images/pepper-soup.jpg", cat:"Soups", col:4 },
];

const CATS = [
  { name:"Rice Dishes",      sub:"Jollof & More",  img:"/images/jollof.jpg" },
  { name:"Soups & Swallows", sub:"Rich & Hearty",  img:"/images/egusi.jpg" },
  { name:"Grills & Suya",    sub:"Smoky & Spiced", img:"/images/suya.jpg" },
  { name:"Pounded Yam",      sub:"Silky Smooth",   img:"/images/pounded-yam.jpg" },
  { name:"Pepper Soup",      sub:"Spicy & Bold",   img:"/images/pepper-soup.jpg" },
];

const REVIEWS = [
  { q:"Best jollof rice outside Lagos. I drive 30 minutes just for this. Worth every single mile.",              n:"Amara O.",    r:"Regular Customer" },
  { q:"Tried Nigerian food for the first time here. The egusi soup blew my mind. 100% coming back.",             n:"Marcus T.",   r:"First-Time Visitor" },
  { q:"Feels exactly like home. Pounded yam takes me straight back to Enugu. Never disappoints.",                n:"Chiamaka E.", r:"Loyal Customer" },
];

const WHY = [
  { icon:"🍳", title:"Made Fresh Daily",  body:"Every dish cooked from scratch — no frozen shortcuts, ever." },
  { icon:"🌶️", title:"Authentic Spices", body:"Spice blends imported directly from Africa for genuine flavor." },
  { icon:"🚗", title:"Direct Delivery",   body:"Skip DoorDash. We deliver ourselves — fresher, faster, cheaper." },
  { icon:"❤️", title:"Family Owned",      body:"Every bite made with the same love as a home-cooked African meal." },
];

/* ─────────────────────────────────────────
   TOAST
───────────────────────────────────────── */
function Toast({ msg, visible }: { msg: string; visible: boolean }) {
  const GOLD = "#D4A843";
  return (
    <div style={{
      position:"fixed", bottom:100, left:"50%",
      transform:`translateX(-50%) translateY(${visible ? 0 : 24}px)`,
      opacity: visible ? 1 : 0,
      background:"#111009", border:"1px solid rgba(212,168,67,.35)",
      borderRadius:999, padding:"12px 24px",
      display:"flex", alignItems:"center", gap:10,
      fontSize:13, fontWeight:600, color:"#fff",
      zIndex:9999, transition:"all .38s cubic-bezier(.23,1,.32,1)",
      boxShadow:"0 16px 48px rgba(0,0,0,.6)", pointerEvents:"none",
    }}>
      <span style={{ width:20, height:20, borderRadius:"50%", background:GOLD,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:11, color:"#000", fontWeight:800, flexShrink:0 }}>✓</span>
      {msg}
    </div>
  );
}

/* ─────────────────────────────────────────
   CUSTOM SPOON CURSOR (desktop only)
───────────────────────────────────────── */
function SpoonCursor() {
  const cur   = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x:0, y:0 });
  const pos   = useRef({ x:0, y:0 });
  const last  = useRef(0);
  const raf   = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (window.matchMedia("(pointer:coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (cur.current) cur.current.style.opacity = "1";
      const now = Date.now();
      if (now - last.current > 40) {
        last.current = now;
        const d = document.createElement("div");
        d.style.cssText = `position:fixed;border-radius:50%;background:#D4A843;pointer-events:none;
          left:${e.clientX}px;top:${e.clientY}px;width:4px;height:4px;z-index:99990;
          transform:translate(-50%,-50%);animation:trailFade .5s ease forwards;`;
        document.body.appendChild(d);
        setTimeout(() => d.remove(), 550);
      }
    };
    const onLeave = () => { if (cur.current) cur.current.style.opacity = "0"; };
    const tick = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.13;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.13;
      if (cur.current) { cur.current.style.left = pos.current.x + "px"; cur.current.style.top = pos.current.y + "px"; }
      raf.current = requestAnimationFrame(tick);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    raf.current = requestAnimationFrame(tick);
    const grow   = () => { if (cur.current) { cur.current.style.transform = "translate(-8px,-36px) rotate(-35deg) scale(1.55)"; cur.current.style.filter = "drop-shadow(0 5px 20px rgba(212,168,67,1))"; }};
    const shrink = () => { if (cur.current) { cur.current.style.transform = "translate(-8px,-36px) rotate(-35deg) scale(1)";    cur.current.style.filter = "drop-shadow(0 2px 8px rgba(212,168,67,.6))"; }};
    const hot = document.querySelectorAll("a,button,[role='button']");
    hot.forEach(el => { el.addEventListener("mouseenter", grow); el.addEventListener("mouseleave", shrink); });
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
      hot.forEach(el => { el.removeEventListener("mouseenter", grow); el.removeEventListener("mouseleave", shrink); });
    };
  }, []);

  return (
    <div ref={cur} style={{
      position:"fixed", width:38, height:38, pointerEvents:"none", zIndex:99999,
      top:0, left:0, opacity:0,
      transform:"translate(-8px,-36px) rotate(-35deg)",
      filter:"drop-shadow(0 2px 8px rgba(212,168,67,.6))",
      transition:"transform .13s ease, opacity .3s, filter .13s",
    }}>
      <svg viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="8" rx="7"   ry="8"   fill="#D4A843" opacity=".95"/>
        <ellipse cx="20" cy="8" rx="5.5" ry="6.5" fill="#F0C060" opacity=".6"/>
        <rect x="18.5" y="14" width="3"   height="22" rx="1.5" fill="#D4A843"/>
        <rect x="19.2" y="15" width="1.6" height="20" rx=".8"  fill="#F0C060" opacity=".5"/>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function Home() {
  const { isDark } = useTheme();
  const { addItem, isInCart, cartCount } = useCart();
  const router = useRouter();
  const [heroImg, setHeroImg] = useState(false);
  const [toast, setToast] = useState({ msg:"", show:false });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const bg      = isDark ? "#080706"               : "#FAF7F2";
  const bg2     = isDark ? "#0E0C0A"               : "#F0EAE0";
  const fg      = isDark ? "#FFFFFF"               : "#0D0B09";
  const fg2     = isDark ? "rgba(255,255,255,.55)" : "rgba(13,11,9,.55)";
  const fg3     = isDark ? "rgba(255,255,255,.24)" : "rgba(13,11,9,.26)";
  const card    = isDark ? "#111009"               : "#FFFFFF";
  const cardBdr = isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)";
  const GOLD    = "#D4A843";
  const GOLD2   = "#F0C060";
  const RED     = "#C0392B";

  useEffect(() => {
    const items = document.querySelectorAll(".rv");
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add("vis"); io.unobserve(e.target); }
      }),
      { threshold: 0.07 }
    );
    items.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = useCallback((id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior:"smooth" }), []);

  const handleAddToCart = (dish: typeof DISHES[0]) => {
    addItem({ id: dish.id, name: dish.name, price: dish.priceNum, img: dish.img, cat: dish.cat });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg: `${dish.name} added to cart`, show: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2200);
  };

  const sLabel: React.CSSProperties = {
    fontSize:10, letterSpacing:".5em", textTransform:"uppercase",
    color:GOLD, fontWeight:700, display:"block", marginBottom:14,
  };
  const sH2: React.CSSProperties = {
    fontFamily:"'Cormorant Garamond',Georgia,serif", fontWeight:300,
    lineHeight:.9, color:fg, transition:"color .4s",
    fontSize:"clamp(2.4rem,6vw,5rem)",
  };

  return (
    <>
      <style>{`
        @keyframes heroUp    { from{opacity:0;transform:translateY(38px)} to{opacity:1;transform:translateY(0)} }
        @keyframes badge     { from{opacity:0;transform:scale(.88) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes ring      { 0%,100%{opacity:.4;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.85;transform:translate(-50%,-50%) scale(1.06)} }
        @keyframes scBar     { 0%,100%{opacity:.28;height:26px} 50%{opacity:1;height:44px} }
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:.1} }
        @keyframes marq      { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes trailFade { 0%{opacity:.7;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(0)} }
        @keyframes floatBob  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes grain     { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-2%,-3%)} 75%{transform:translate(2%,1%)} }
        @keyframes cartPop   { 0%{transform:scale(1)} 40%{transform:scale(1.4)} 100%{transform:scale(1)} }

        .rv{opacity:0;transform:translateY(28px);transition:opacity .8s ease,transform .8s ease}
        .rv.vis{opacity:1;transform:translateY(0)}
        .d1{transition-delay:.06s}.d2{transition-delay:.13s}.d3{transition-delay:.20s}
        .d4{transition-delay:.27s}.d5{transition-delay:.34s}

        .h-cat:hover{transform:translateY(-11px)!important;box-shadow:0 32px 70px rgba(0,0,0,.75)!important}
        .h-cat:hover .cat-img{transform:scale(1.1)!important;filter:brightness(.44)!important}
        .h-cat:hover .cat-bdr{border-color:rgba(212,168,67,.7)!important}
        .h-cat:hover .cat-nm{color:${GOLD}!important}

        .h-dish:hover{transform:translateY(-9px)!important;box-shadow:0 32px 80px rgba(0,0,0,.65)!important;border-color:rgba(212,168,67,.32)!important}
        .h-dish:hover .d-img{transform:scale(1.07)!important}
        .h-dish:hover .d-add{background:${GOLD}!important;color:#000!important;border-color:${GOLD}!important}

        .h-why:hover{transform:translateY(-7px)!important;border-color:rgba(212,168,67,.35)!important;box-shadow:0 22px 56px rgba(212,168,67,.08)!important}
        .h-rv:hover{transform:translateY(-6px)!important;border-color:rgba(212,168,67,.4)!important;box-shadow:0 22px 60px rgba(0,0,0,.52)!important}
        .h-oc-g:hover{border-color:rgba(212,168,67,.5)!important;transform:translateY(-7px)!important;box-shadow:0 28px 72px rgba(212,168,67,.1)!important}
        .h-oc-r:hover{border-color:rgba(192,57,43,.5)!important;transform:translateY(-7px)!important;box-shadow:0 28px 72px rgba(192,57,43,.1)!important}
        .h-stat:hover{border-color:rgba(212,168,67,.44)!important;transform:translateY(-4px)!important}
        .btn-g:hover{background:${GOLD2}!important;transform:translateY(-3px)!important;box-shadow:0 16px 48px rgba(212,168,67,.5)!important}
        .btn-o:hover{background:rgba(212,168,67,.1)!important;border-color:${GOLD}!important;transform:translateY(-2px)!important}
        .btn-r:hover{background:#d44030!important;transform:translateY(-2px)!important;box-shadow:0 12px 36px rgba(192,57,43,.45)!important}
        .lnk:hover{color:${GOLD}!important;border-color:${GOLD}!important}
        .skip:hover{background:rgba(212,168,67,.1)!important;border-color:${GOLD}!important}

        @media(hover:none){.h-cat:hover,.h-dish:hover,.h-why:hover,.h-rv:hover,.h-oc-g:hover,.h-oc-r:hover,.btn-g:hover,.btn-o:hover{transform:none!important;box-shadow:none!important}}

        .mob-scroll{display:flex;overflow-x:auto;gap:14px;padding:0 20px 8px;margin:0 -20px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none}
        .mob-scroll::-webkit-scrollbar{display:none}
        .mob-dish{flex:0 0 76vw;max-width:292px;scroll-snap-align:start}

        @media(max-width:768px){
          .desk{display:none!important}.mob{display:block!important}
          .sec{padding:60px 20px!important}.hero-w{padding:116px 20px 84px!important}
          .hero-btns{flex-direction:column!important;width:100%!important}
          .hero-btns>*{width:100%!important;justify-content:center!important}
          .stats{grid-template-columns:repeat(2,1fr)!important}
          .cat-g{grid-template-columns:repeat(2,1fr)!important;gap:10px!important}
          .ord-g{grid-template-columns:1fr!important}.sto-g{grid-template-columns:1fr!important;gap:44px!important}
          .rev-g{grid-template-columns:1fr!important;max-width:420px!important;margin-left:auto!important;margin-right:auto!important}
          .why-g{grid-template-columns:repeat(2,1fr)!important;gap:12px!important}
          .spl-g{grid-template-columns:1fr!important}.spl-i{min-height:240px!important;position:relative!important}
          .cta-btns{flex-direction:column!important;width:100%!important}
          .cta-btns>*{width:100%!important;justify-content:center!important}
          .vln{display:none!important}.oc-p{padding:28px 22px!important}
          .sto-vis{display:none!important}.sto-vm{display:block!important}.spl-txt{padding:44px 24px!important}
        }
        @media(min-width:769px){.mob{display:none!important}.sto-vm{display:none!important}}
      `}</style>

      <Toast msg={toast.msg} visible={toast.show} />
      <SpoonCursor />

      {/* ══ § 1 · HERO ══ */}
      <section id="hero" style={{ minHeight:"100svh", position:"relative",
        display:"flex", alignItems:"center", justifyContent:"center",
        overflow:"hidden", background:bg, transition:"background .5s" }}>
        <img src="/images/sa.jpg" alt="" onLoad={() => setHeroImg(true)}
          style={{ position:"absolute",inset:0,width:"100%",height:"100%",
            objectFit:"cover",objectPosition:"center 38%",
            filter:"brightness(.44) saturate(1.2)",
            zIndex:0,opacity:heroImg?1:0,transition:"opacity 1.6s ease" }}/>
        <div style={{ position:"absolute",inset:0,zIndex:1,background:"linear-gradient(145deg,rgba(8,7,6,.85) 0%,rgba(8,7,6,.06) 55%,rgba(8,7,6,.65) 100%)" }}/>
        <div style={{ position:"absolute",inset:0,zIndex:2,background:"linear-gradient(to bottom,rgba(8,7,6,.05) 0%,transparent 20%,rgba(8,7,6,.7) 78%,rgba(8,7,6,1) 100%)" }}/>
        <div style={{ position:"absolute",inset:0,zIndex:2,background:"radial-gradient(ellipse at 62% 38%,transparent 28%,rgba(8,7,6,.55) 100%)" }}/>
        <div style={{ position:"absolute",inset:"-50%",width:"200%",height:"200%",zIndex:3,pointerEvents:"none",opacity:.032,
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          animation:"grain .4s steps(2) infinite" }}/>
        {[460,730,1020].map((s,i) => (
          <div key={s} style={{ position:"absolute",width:s,height:s,borderRadius:"50%",
            border:"1px solid rgba(212,168,67,.06)",zIndex:4,pointerEvents:"none",
            top:"50%",left:"50%",transform:"translate(-50%,-50%)",
            animation:`ring ${10+i*3}s ease-in-out infinite`,animationDelay:`${i*3}s` }}/>
        ))}
        <div className="vln" style={{ position:"absolute",left:56,top:0,bottom:0,width:1,zIndex:4,background:"linear-gradient(to bottom,transparent,rgba(212,168,67,.24) 22%,rgba(212,168,67,.24) 78%,transparent)" }}/>
        <div className="vln" style={{ position:"absolute",right:56,top:0,bottom:0,width:1,zIndex:4,background:"linear-gradient(to bottom,transparent,rgba(212,168,67,.24) 22%,rgba(212,168,67,.24) 78%,transparent)" }}/>

        <div className="hero-w" style={{ position:"relative",zIndex:10,textAlign:"center",
          padding:"164px 24px 104px",maxWidth:1100,margin:"0 auto",width:"100%" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:10,
            border:"1px solid rgba(212,168,67,.48)",borderRadius:999,
            padding:"8px 22px",marginBottom:46,
            background:"rgba(212,168,67,.07)",backdropFilter:"blur(20px)",
            animation:"badge .9s cubic-bezier(.34,1.56,.64,1) .2s both" }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:GOLD,animation:"blink 2.3s ease-in-out infinite",flexShrink:0 }}/>
            <span style={{ color:GOLD,fontSize:11,letterSpacing:".44em",textTransform:"uppercase",fontWeight:600 }}>Minneapolis, MN</span>
          </div>

          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:300,lineHeight:.86,marginBottom:28,animation:"heroUp 1.1s ease .38s both" }}>
            <span style={{ display:"block",fontSize:"clamp(3.8rem,12.5vw,11rem)",color:"#fff",letterSpacing:"-.015em" }}>Oga Madam</span>
            <span style={{ display:"block",fontSize:"clamp(3.8rem,12.5vw,11rem)",color:GOLD,fontStyle:"italic",letterSpacing:"-.015em" }}>Kitchen</span>
          </h1>

          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginBottom:28,animation:"heroUp .8s ease .55s both" }}>
            <div style={{ flex:1,maxWidth:130,height:1,background:`linear-gradient(90deg,transparent,rgba(212,168,67,.7))` }}/>
            <span style={{ color:GOLD,fontSize:16,opacity:.85 }}>✦</span>
            <div style={{ flex:1,maxWidth:130,height:1,background:`linear-gradient(90deg,rgba(212,168,67,.7),transparent)` }}/>
          </div>

          <p style={{ fontSize:"clamp(.96rem,1.75vw,1.15rem)",color:"rgba(255,255,255,.58)",fontWeight:300,letterSpacing:".05em",lineHeight:1.9,marginBottom:52,animation:"heroUp .8s ease .68s both" }}>
            Authentic Flavors —{" "}
            <span style={{ color:"#fff",fontWeight:500 }}>Bold. Fresh. Unapologetic.</span>
            <br/>Made with Love in the Heart of Minneapolis.
          </p>

          <div className="hero-btns" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:13,flexWrap:"wrap",marginBottom:66,animation:"heroUp .8s ease .82s both" }}>
            {cartCount > 0 ? (
              <button onClick={() => router.push("/cart")} className="btn-g"
                style={{ display:"inline-flex",alignItems:"center",gap:10,
                  background:GOLD,color:"#000",padding:"16px 42px",borderRadius:999,
                  fontSize:13,fontWeight:700,letterSpacing:".09em",textTransform:"uppercase",
                  border:"none",transition:"all .32s cubic-bezier(.23,1,.32,1)",cursor:"none" }}>
                <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                View Cart ({cartCount})
              </button>
            ) : (
              <a href="#order-section" onClick={e=>{e.preventDefault();go("#order-section");}} className="btn-g"
                style={{ display:"inline-flex",alignItems:"center",gap:10,background:GOLD,color:"#000",padding:"16px 42px",borderRadius:999,fontSize:13,fontWeight:700,letterSpacing:".09em",textTransform:"uppercase",textDecoration:"none",border:"none",transition:"all .32s cubic-bezier(.23,1,.32,1)",cursor:"none" }}>
                <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Order Now
              </a>
            )}
            <a href="/menu" className="btn-o"
              style={{ display:"inline-flex",alignItems:"center",gap:8,border:"1.5px solid rgba(212,168,67,.5)",color:GOLD,padding:"16px 36px",borderRadius:999,fontSize:13,fontWeight:600,letterSpacing:".09em",textTransform:"uppercase",textDecoration:"none",backdropFilter:"blur(10px)",background:"rgba(212,168,67,.04)",transition:"all .32s cubic-bezier(.23,1,.32,1)",cursor:"none" }}>
              Explore Menu →
            </a>
          </div>

          <div className="stats" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,maxWidth:560,margin:"0 auto",animation:"heroUp .8s ease .97s both" }}>
            {[
              [cartCount > 0 ? `${cartCount} 🛒` : "4.5 ★", cartCount > 0 ? "In Cart" : "Rating"],
              ["50+","Dishes"],["30 min","Delivery"],["100%","Fresh Daily"]
            ].map(([v,l]) => (
              <div key={String(l)} className="h-stat"
                style={{ textAlign:"center",padding:"18px 8px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(212,168,67,.13)",borderRadius:16,backdropFilter:"blur(14px)",transition:"border-color .3s,transform .3s",cursor: l === "In Cart" ? "pointer" : "default" }}
                onClick={() => l === "In Cart" && router.push("/cart")}>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(1.3rem,3vw,1.9rem)",fontWeight:600,color:GOLD,lineHeight:1,marginBottom:5 }}>{v}</div>
                <div style={{ fontSize:9,letterSpacing:".26em",textTransform:"uppercase",color:"rgba(255,255,255,.24)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8,zIndex:10,animation:"heroUp .6s ease 1.6s both" }}>
          <span style={{ fontSize:9,letterSpacing:".42em",textTransform:"uppercase",color:"rgba(255,255,255,.2)" }}>Scroll</span>
          <div style={{ width:1,height:36,background:`linear-gradient(to bottom,${GOLD},transparent)`,animation:"scBar 2s ease-in-out infinite" }}/>
        </div>
      </section>

      {/* ══ § 2 · MARQUEE ══ */}
      <div style={{ padding:"18px 0",background:GOLD,overflow:"hidden",position:"relative",zIndex:10 }}>
        <div style={{ display:"flex",whiteSpace:"nowrap",animation:"marq 24s linear infinite" }}>
          {["Jollof Rice","Egusi Soup","Suya Platter","Pounded Yam","Pepper Soup","Fried Plantain","Ofe Onugbu","Moi Moi"].flatMap((item,i) =>
            [0,1].map(j => (
              <span key={`${i}${j}`} style={{ display:"inline-flex",alignItems:"center",gap:16,padding:"0 20px",fontSize:11.5,fontWeight:800,letterSpacing:".22em",textTransform:"uppercase",color:"#000" }}>
                {item}
                <span style={{ width:4,height:4,borderRadius:"50%",background:"rgba(0,0,0,.3)" }}/>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ══ § 3 · CATEGORIES ══ */}
      <section id="categories" className="sec" style={{ padding:"96px 56px",background:bg2,transition:"background .5s" }}>
        <div className="rv" style={{ maxWidth:1200,margin:"0 auto 50px",textAlign:"center" }}>
          <span style={sLabel}>What We Serve</span>
          <h2 style={sH2}>Explore Our Menu</h2>
        </div>
        <div className="cat-g" style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,maxWidth:1200,margin:"0 auto" }}>
          {CATS.map(({ name, sub, img }, i) => (
            <a key={name} href="/menu" className={`h-cat rv d${i+1}`}
              style={{ position:"relative",borderRadius:22,overflow:"hidden",textDecoration:"none",display:"block",transition:"transform .4s cubic-bezier(.23,1,.32,1),box-shadow .4s" }}>
              <img src={img} alt={name} className="cat-img" style={{ width:"100%",height:172,objectFit:"cover",display:"block",filter:"brightness(.7)",transition:"transform .6s cubic-bezier(.23,1,.32,1),filter .4s" }}/>
              <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.93) 0%,rgba(0,0,0,.08) 55%,transparent 100%)" }}/>
              <div className="cat-bdr" style={{ position:"absolute",inset:0,borderRadius:22,border:"1px solid rgba(255,255,255,.06)",pointerEvents:"none",transition:"border-color .35s" }}/>
              <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"16px 14px",textAlign:"center" }}>
                <span className="cat-nm" style={{ fontSize:13,fontWeight:600,color:"#fff",display:"block",transition:"color .3s" }}>{name}</span>
                <span style={{ fontSize:9,letterSpacing:".28em",textTransform:"uppercase",color:"rgba(255,255,255,.4)",marginTop:3,display:"block" }}>{sub}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ══ § 4 · FEATURED DISHES ══ */}
      <section id="featured" className="sec" style={{ padding:"96px 56px",background:bg,transition:"background .5s" }}>
        <div className="rv" style={{ maxWidth:1200,margin:"0 auto 52px",display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:16 }}>
          <div>
            <span style={sLabel}>Most Loved</span>
            <h2 style={sH2}>Fan Favourites</h2>
          </div>
          <a href="/menu" className="lnk" style={{ color:fg3,fontSize:11,letterSpacing:".2em",textTransform:"uppercase",textDecoration:"none",borderBottom:`1px solid ${cardBdr}`,paddingBottom:3,cursor:"none",transition:"color .3s,border-color .3s" }}>Full Menu →</a>
        </div>

        {/* Desktop bento grid */}
        <div className="desk" style={{ display:"grid",gridTemplateColumns:"repeat(12,1fr)",gap:16,maxWidth:1200,margin:"0 auto" }}>
          {DISHES.map((d, i) => {
            const big = i < 2;
            const inCart = isInCart(d.id);
            return (
              <div key={d.id} className={`h-dish rv d${i+1}`}
                style={{ gridColumn:`span ${d.col}`,background:card,border:`1px solid ${inCart ? "rgba(212,168,67,.35)" : cardBdr}`,borderRadius:24,overflow:"hidden" }}>
                <div style={{ position:"relative",overflow:"hidden",height:big?296:218 }}>
                  <img src={d.img} alt={d.name} className="d-img"
                    style={{ width:"100%",height:"100%",objectFit:"cover",display:"block",filter:"brightness(.76)",transition:"transform .7s cubic-bezier(.23,1,.32,1)" }}/>
                  <div style={{ position:"absolute",inset:0,background:`linear-gradient(to top,${card} 0%,transparent 55%)` }}/>
                  <span style={{ position:"absolute",top:14,left:14,fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",padding:"5px 14px",borderRadius:999,backdropFilter:"blur(10px)",background:d.tagBg,color:d.tagC,border:`1px solid ${d.tagBdr}` }}>{d.tag}</span>
                  <span style={{ position:"absolute",top:14,right:14,background:GOLD,color:"#000",fontSize:big?15:14,fontWeight:800,fontFamily:"'Cormorant Garamond',Georgia,serif",padding:"5px 14px",borderRadius:999 }}>{d.price}</span>
                  {inCart && <span style={{ position:"absolute",bottom:9,left:9,background:GOLD,color:"#000",fontSize:9,fontWeight:800,letterSpacing:".06em",textTransform:"uppercase",padding:"3px 9px",borderRadius:999 }}>✓ In cart</span>}
                </div>
                <div style={{ padding:big?"20px 24px 24px":"14px 18px 20px" }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:big?22:18,fontWeight:600,color:fg,display:"block",marginBottom:7,transition:"color .4s" }}>{d.name}</span>
                  <p style={{ fontSize:big?13:12,color:fg2,lineHeight:1.68,marginBottom:16,transition:"color .4s" }}>{d.desc}</p>
                  {inCart ? (
                    <button onClick={() => router.push("/cart")} className="d-add"
                      style={{ display:"flex",alignItems:"center",justifyContent:"center",width:"100%",padding:big?11:10,borderRadius:12,background:"rgba(212,168,67,.12)",border:"1px solid rgba(212,168,67,.3)",color:GOLD,fontSize:big?12:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",cursor:"pointer",transition:"all .3s" }}>
                      View Cart →
                    </button>
                  ) : (
                    <button onClick={() => handleAddToCart(d)} className="d-add"
                      style={{ display:"flex",alignItems:"center",justifyContent:"center",width:"100%",padding:big?11:10,borderRadius:12,border:"1px solid rgba(212,168,67,.18)",color:GOLD,fontSize:big?12:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",cursor:"pointer",transition:"all .3s",background:"transparent" }}>
                      Add to Cart +
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile snap scroll */}
        <div className="mob mob-scroll">
          {DISHES.map(d => {
            const inCart = isInCart(d.id);
            return (
              <div key={d.id} className="mob-dish" style={{ background:card,border:`1px solid ${inCart ? "rgba(212,168,67,.35)" : cardBdr}`,borderRadius:20,overflow:"hidden" }}>
                <div style={{ position:"relative",overflow:"hidden",height:178 }}>
                  <img src={d.img} alt={d.name} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block",filter:"brightness(.76)" }}/>
                  <div style={{ position:"absolute",inset:0,background:`linear-gradient(to top,${card} 0%,transparent 55%)` }}/>
                  <span style={{ position:"absolute",top:10,left:10,fontSize:9,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",padding:"4px 11px",borderRadius:999,backdropFilter:"blur(8px)",background:d.tagBg,color:d.tagC,border:`1px solid ${d.tagBdr}` }}>{d.tag}</span>
                  <span style={{ position:"absolute",top:10,right:10,background:GOLD,color:"#000",fontSize:13,fontWeight:800,fontFamily:"'Cormorant Garamond',Georgia,serif",padding:"4px 11px",borderRadius:999 }}>{d.price}</span>
                </div>
                <div style={{ padding:"15px 16px 18px" }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:18,fontWeight:600,color:fg,display:"block",marginBottom:5,transition:"color .4s" }}>{d.name}</span>
                  <p style={{ fontSize:12,color:fg2,lineHeight:1.62,marginBottom:12,transition:"color .4s" }}>{d.desc}</p>
                  {inCart ? (
                    <button onClick={() => router.push("/cart")}
                      style={{ display:"flex",alignItems:"center",justifyContent:"center",width:"100%",padding:10,borderRadius:10,background:"rgba(212,168,67,.12)",border:"1px solid rgba(212,168,67,.3)",color:GOLD,fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",cursor:"pointer" }}>
                      View Cart →
                    </button>
                  ) : (
                    <button onClick={() => handleAddToCart(d)}
                      style={{ display:"flex",alignItems:"center",justifyContent:"center",width:"100%",padding:10,borderRadius:10,border:"1px solid rgba(212,168,67,.22)",color:GOLD,fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",background:"transparent",cursor:"pointer" }}>
                      Add to Cart +
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ § 5 · SIGNATURE SPLIT ══ */}
      <section style={{ background:bg2,position:"relative",overflow:"hidden",transition:"background .5s" }}>
        <div className="spl-g" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:580 }}>
          <div className="spl-i" style={{ position:"relative",overflow:"hidden",minHeight:260 }}>
            <img src="/images/jollof.jpg" alt="Jollof" style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.62)",display:"block" }}/>
            <div style={{ position:"absolute",inset:0,background:`linear-gradient(to right,transparent 50%,${bg2} 100%)` }}/>
            <div style={{ position:"absolute",top:32,left:32,background:GOLD,color:"#000",padding:"11px 22px",borderRadius:999,fontSize:12,fontWeight:800,letterSpacing:".06em",textTransform:"uppercase",boxShadow:"0 8px 30px rgba(212,168,67,.55)",animation:"floatBob 4.5s ease-in-out infinite" }}>🏆 Signature Dish</div>
            <div style={{ position:"absolute",bottom:24,right:24,fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:120,fontWeight:700,color:"rgba(212,168,67,.07)",lineHeight:1,userSelect:"none",pointerEvents:"none" }}>01</div>
          </div>
          <div className="rv spl-txt" style={{ display:"flex",flexDirection:"column",justifyContent:"center",padding:"72px 64px",background:bg2,transition:"background .5s" }}>
            <span style={sLabel}>Signature Dish</span>
            <h2 style={{ ...sH2,fontSize:"clamp(2.6rem,4.8vw,4.8rem)",marginBottom:18 }}>Our Famous<br/>Jollof Rice</h2>
            <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"2.2rem",fontWeight:600,color:GOLD,marginBottom:22 }}>$18.99</div>
            <p style={{ fontSize:15,color:fg2,lineHeight:1.95,marginBottom:36,maxWidth:360,transition:"color .4s" }}>Slow-cooked, party-style jollof rice with a smoky, scorched base perfected over generations. The dish Minneapolis can&apos;t stop talking about — made from scratch every single day.</p>
            {isInCart(12) ? (
              <button onClick={() => router.push("/cart")} className="btn-g"
                style={{ alignSelf:"flex-start",display:"inline-flex",alignItems:"center",gap:10,background:GOLD,color:"#000",padding:"15px 36px",borderRadius:999,fontSize:13,fontWeight:700,letterSpacing:".09em",textTransform:"uppercase",border:"none",transition:"all .32s cubic-bezier(.23,1,.32,1)",cursor:"none" }}>
                View Cart →
              </button>
            ) : (
              <button onClick={() => handleAddToCart(DISHES[0])} className="btn-g"
                style={{ alignSelf:"flex-start",display:"inline-flex",alignItems:"center",gap:10,background:GOLD,color:"#000",padding:"15px 36px",borderRadius:999,fontSize:13,fontWeight:700,letterSpacing:".09em",textTransform:"uppercase",border:"none",transition:"all .32s cubic-bezier(.23,1,.32,1)",cursor:"none" }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ══ § 6 · ORDER — PICKUP & DELIVERY ══ */}
      <section id="order-section" className="sec" style={{ padding:"96px 56px",background:bg,transition:"background .5s" }}>
        <div className="rv" style={{ maxWidth:1200,margin:"0 auto 52px",textAlign:"center" }}>
          <span style={sLabel}>How To Get Your Food</span>
          <h2 style={sH2}>Pickup or Delivery</h2>
        </div>
        <div className="ord-g" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,maxWidth:1200,margin:"0 auto 20px" }}>
          <div className="h-oc-g rv d1 oc-p" style={{ borderRadius:28,padding:"46px 42px",position:"relative",overflow:"hidden",border:"1px solid rgba(212,168,67,.18)",background:card,transition:"all .45s cubic-bezier(.23,1,.32,1)" }}>
            <div style={{ position:"absolute",width:320,height:320,borderRadius:"50%",filter:"blur(90px)",background:"rgba(212,168,67,.055)",top:-100,right:-100,pointerEvents:"none" }}/>
            <div style={{ width:52,height:52,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:24,background:"rgba(212,168,67,.1)",border:"1px solid rgba(212,168,67,.2)" }}>🏪</div>
            <span style={{ ...sLabel,marginBottom:10 }}>In-Store</span>
            <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(1.9rem,2.8vw,2.8rem)",fontWeight:400,color:fg,marginBottom:14,transition:"color .4s" }}>Pickup</h3>
            <p style={{ fontSize:14,color:fg2,lineHeight:1.88,marginBottom:28,transition:"color .4s" }}>Order online and collect fresh from our kitchen. Your food is ready the moment you walk in — zero wait time.</p>
            {[["📍","6000 Shingle Creek Pkwy, Minneapolis, MN 55430"],["⏱","Ready in 15–25 minutes"],["📞","(763) 200-5773"]].map(([ic,t]) => (
              <div key={String(t)} style={{ display:"flex",alignItems:"flex-start",gap:12,marginBottom:12 }}>
                <span style={{ fontSize:14,flexShrink:0,marginTop:1 }}>{ic}</span>
                <span style={{ fontSize:13,color:fg2,lineHeight:1.6,transition:"color .4s" }}>{t}</span>
              </div>
            ))}
            <a href="/order" className="btn-g" style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"13px 30px",borderRadius:999,fontSize:13,fontWeight:700,letterSpacing:".07em",textTransform:"uppercase",textDecoration:"none",marginTop:22,cursor:"none",background:GOLD,color:"#000",border:"none",transition:"all .32s cubic-bezier(.23,1,.32,1)" }}>Order for Pickup</a>
          </div>
          <div className="h-oc-r rv d2 oc-p" style={{ borderRadius:28,padding:"46px 42px",position:"relative",overflow:"hidden",border:"1px solid rgba(192,57,43,.16)",background:card,transition:"all .45s cubic-bezier(.23,1,.32,1)" }}>
            <div style={{ position:"absolute",width:320,height:320,borderRadius:"50%",filter:"blur(90px)",background:"rgba(192,57,43,.055)",top:-100,left:-100,pointerEvents:"none" }}/>
            <div style={{ width:52,height:52,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:24,background:"rgba(192,57,43,.1)",border:"1px solid rgba(192,57,43,.2)" }}>🚗</div>
            <span style={{ ...sLabel,color:RED,marginBottom:10 }}>To Your Door</span>
            <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(1.9rem,2.8vw,2.8rem)",fontWeight:400,color:fg,marginBottom:14,transition:"color .4s" }}>Delivery</h3>
            <p style={{ fontSize:14,color:fg2,lineHeight:1.88,marginBottom:28,transition:"color .4s" }}>Direct delivery — no third-party cut. Lower fees, fresher food, faster to your door.</p>
            {[["🗺","Within 10-mile radius of Minneapolis"],["⏱","Estimated 30–45 minutes"],["💳","Card, Apple Pay & Google Pay accepted"]].map(([ic,t]) => (
              <div key={String(t)} style={{ display:"flex",alignItems:"flex-start",gap:12,marginBottom:12 }}>
                <span style={{ fontSize:14,flexShrink:0,marginTop:1 }}>{ic}</span>
                <span style={{ fontSize:13,color:fg2,lineHeight:1.6,transition:"color .4s" }}>{t}</span>
              </div>
            ))}
            <a href="/order" className="btn-r" style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"13px 30px",borderRadius:999,fontSize:13,fontWeight:700,letterSpacing:".07em",textTransform:"uppercase",textDecoration:"none",marginTop:22,cursor:"none",background:RED,color:"#fff",border:"none",transition:"all .32s cubic-bezier(.23,1,.32,1)" }}>Order for Delivery</a>
          </div>
        </div>
        <div className="rv" style={{ maxWidth:1200,margin:"0 auto",background:"rgba(212,168,67,.04)",border:"1px solid rgba(212,168,67,.11)",borderRadius:20,padding:"18px 30px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:20,flexWrap:"wrap" }}>
          <p style={{ fontSize:14,color:fg2,lineHeight:1.65,margin:0,transition:"color .4s" }}>
            <strong style={{ color:fg,transition:"color .4s" }}>Skip the 30% DoorDash cut.</strong>{" "}Order directly — better prices, faster delivery, and you support us directly.
          </p>
          <a href="/order" className="skip" style={{ fontSize:11,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:GOLD,textDecoration:"none",border:"1px solid rgba(212,168,67,.28)",padding:"9px 22px",borderRadius:999,whiteSpace:"nowrap",transition:"all .3s",cursor:"none",background:"transparent" }}>Order Direct →</a>
        </div>
      </section>

      {/* ══ § 7 · WHY US ══ */}
      <section className="sec" style={{ padding:"96px 56px",background:bg2,transition:"background .5s" }}>
        <div className="rv" style={{ maxWidth:1200,margin:"0 auto 52px",textAlign:"center" }}>
          <span style={sLabel}>Why Oga Madam</span>
          <h2 style={sH2}>What Sets Us Apart</h2>
        </div>
        <div className="why-g" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,maxWidth:1200,margin:"0 auto" }}>
          {WHY.map(({ icon, title, body }, i) => (
            <div key={title} className={`h-why rv d${i+1}`} style={{ background:card,border:`1px solid ${cardBdr}`,borderRadius:22,padding:"32px 26px",transition:"transform .4s cubic-bezier(.23,1,.32,1),border-color .3s,box-shadow .4s" }}>
              <div style={{ fontSize:32,marginBottom:18,display:"block" }}>{icon}</div>
              <h4 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:20,fontWeight:600,color:fg,marginBottom:10,transition:"color .4s" }}>{title}</h4>
              <p style={{ fontSize:13,color:fg2,lineHeight:1.8,transition:"color .4s" }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ § 8 · OUR STORY ══ */}
      <section id="story" className="sec" style={{ padding:"96px 56px",background:bg,transition:"background .5s" }}>
        <div className="sto-g" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center",maxWidth:1200,margin:"0 auto" }}>
          <div className="rv">
            <span style={sLabel}>Our Story</span>
            <h2 style={{ ...sH2,fontSize:"clamp(2.4rem,5.2vw,5.2rem)",marginBottom:36 }}>Born from<br/>Tradition.<br/><em style={{ color:GOLD }}>Served with Love.</em></h2>
            {["Oga Madam Kitchen was born from a deep love of African culture — the belief that authentic food has the power to bring people together, no matter where they are.","Nestled in Minneapolis, Minnesota, we bring the bold flavors of West Africa to the heart of the Midwest. Every dish is prepared with the same care, spices, and soul you'd find in a African home kitchen.","From our smoky jollof rice to our hearty egusi soup — every bite tells a story of tradition, community, and the warmth of home."].map((p,i) => (
              <p key={i} style={{ fontSize:15,color:fg2,lineHeight:1.95,marginBottom:18,transition:"color .4s" }}>{p}</p>
            ))}
            <a href="/about" className="lnk" style={{ display:"inline-flex",alignItems:"center",gap:8,color:GOLD,fontSize:12,fontWeight:700,textDecoration:"none",letterSpacing:".12em",textTransform:"uppercase",marginTop:24,borderBottom:"1px solid rgba(212,168,67,.3)",paddingBottom:4,transition:"all .3s",cursor:"none" }}>Learn Our Full Story →</a>
          </div>
          <div className="sto-vis rv d2" style={{ position:"relative" }}>
            <div style={{ borderRadius:26,overflow:"hidden",position:"relative",height:500 }}>
              <img src="/images/egusi.jpg" alt="Our Kitchen" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block",filter:"brightness(.68)",transition:"transform .9s cubic-bezier(.23,1,.32,1)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform="scale(1.05)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="scale(1)"; }}/>
              <div style={{ position:"absolute",inset:0,background:`linear-gradient(to top,${bg} 0%,transparent 48%)` }}/>
            </div>
            <div style={{ position:"absolute",bottom:26,left:26,right:26,background:isDark?"rgba(13,11,9,.94)":"rgba(238,232,220,.96)",backdropFilter:"blur(24px)",border:"1px solid rgba(212,168,67,.16)",borderRadius:20,padding:"20px 24px",transition:"background .4s" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:18,fontStyle:"italic",color:GOLD,marginBottom:8 }}>&quot;Madam&apos;s Secret&quot;</div>
              <p style={{ fontSize:13,color:fg2,lineHeight:1.72,margin:0,fontStyle:"italic",transition:"color .4s" }}>Every dish carries the one ingredient no recipe can teach — the love of a mother cooking for her family.</p>
            </div>
            <span style={{ position:"absolute",top:-14,right:-14,fontSize:11,fontWeight:700,padding:"7px 18px",borderRadius:999,background:GOLD,color:"#000" }}>🇳🇬 African Owned</span>
            <span style={{ position:"absolute",bottom:-14,left:-14,fontSize:11,fontWeight:700,padding:"7px 18px",borderRadius:999,background:card,border:`1px solid rgba(212,168,67,.15)`,color:GOLD,transition:"background .4s" }}>Minneapolis, MN</span>
          </div>
          <div className="sto-vm rv" style={{ borderRadius:20,overflow:"hidden" }}>
            <img src="/images/egusi.jpg" alt="Our Kitchen" style={{ width:"100%",height:230,objectFit:"cover",display:"block",filter:"brightness(.68)" }}/>
            <div style={{ background:isDark?"rgba(13,11,9,.94)":"rgba(238,232,220,.96)",border:`1px solid rgba(212,168,67,.15)`,borderTop:"none",padding:"16px 20px",transition:"background .4s" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:17,fontStyle:"italic",color:GOLD,marginBottom:6 }}>&quot;Madam&apos;s Secret&quot;</div>
              <p style={{ fontSize:13,color:fg2,lineHeight:1.7,margin:0,fontStyle:"italic",transition:"color .4s" }}>Every dish carries the one ingredient no recipe can teach.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ § 9 · REVIEWS ══ */}
      <section id="reviews" className="sec" style={{ padding:"96px 56px",background:bg2,transition:"background .5s" }}>
        <div className="rv" style={{ maxWidth:1200,margin:"0 auto 52px",textAlign:"center" }}>
          <span style={sLabel}>What People Say</span>
          <h2 style={sH2}>Customer Love</h2>
        </div>
        <div className="rev-g" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18,maxWidth:1200,margin:"0 auto" }}>
          {REVIEWS.map(({ q, n, r }, i) => (
            <div key={n} className={`h-rv rv d${i+1}`} style={{ background:card,border:`1px solid ${cardBdr}`,borderRadius:24,padding:"30px 28px",transition:"transform .38s cubic-bezier(.23,1,.32,1),border-color .3s,box-shadow .38s" }}>
              <div style={{ color:GOLD,fontSize:13,letterSpacing:3,marginBottom:20 }}>★★★★★</div>
              <p style={{ fontSize:14.5,color:fg2,lineHeight:1.85,fontStyle:"italic",marginBottom:24,transition:"color .4s" }}>&ldquo;{q}&rdquo;</p>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:38,height:38,borderRadius:"50%",background:"rgba(212,168,67,.12)",border:"1px solid rgba(212,168,67,.22)",display:"flex",alignItems:"center",justifyContent:"center",color:GOLD,fontWeight:700,fontSize:14,flexShrink:0 }}>{n[0]}</div>
                <div>
                  <div style={{ fontSize:14,fontWeight:600,color:fg,transition:"color .4s" }}>{n}</div>
                  <div style={{ fontSize:11,color:fg3,letterSpacing:".04em",marginTop:2,transition:"color .4s" }}>{r}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ § 10 · FINAL CTA ══ */}
      <section id="cta" className="sec" style={{ padding:"130px 56px",textAlign:"center",position:"relative",overflow:"hidden" }}>
        <img src="/images/sa.jpg" alt="" style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.14) saturate(.6)",display:"block",zIndex:0 }}/>
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(8,7,6,.25) 0%,rgba(8,7,6,.94) 68%)",zIndex:1 }}/>
        <div style={{ position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"32%",height:1,background:"linear-gradient(90deg,transparent,rgba(212,168,67,.6),transparent)",zIndex:2 }}/>
        <div className="rv" style={{ position:"relative",zIndex:10,maxWidth:680,margin:"0 auto" }}>
          <span style={{ ...sLabel,color:GOLD }}>Ready to Order?</span>
          <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:300,fontSize:"clamp(3.2rem,9.5vw,8.5rem)",lineHeight:.84,marginBottom:28,color:"#fff" }}>Taste the<br/><em style={{ color:GOLD }}>Tradition</em></h2>
          <p style={{ fontSize:"clamp(14px,1.7vw,17px)",color:"rgba(255,255,255,.46)",lineHeight:1.85,marginBottom:52,maxWidth:400,marginLeft:"auto",marginRight:"auto" }}>Skip the middlemen. Order directly from our kitchen — authentic African flavors delivered fresh or ready for pickup.</p>
          <div className="cta-btns" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:14,flexWrap:"wrap" }}>
            {cartCount > 0 ? (
              <button onClick={() => router.push("/cart")} className="btn-g"
                style={{ display:"inline-flex",alignItems:"center",gap:10,background:GOLD,color:"#000",padding:"17px 48px",borderRadius:999,fontSize:14,fontWeight:700,letterSpacing:".09em",textTransform:"uppercase",border:"none",transition:"all .32s cubic-bezier(.23,1,.32,1)",cursor:"none" }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                View Cart ({cartCount})
              </button>
            ) : (
              <a href="/order" className="btn-g" style={{ display:"inline-flex",alignItems:"center",gap:10,background:GOLD,color:"#000",padding:"17px 48px",borderRadius:999,fontSize:14,fontWeight:700,letterSpacing:".09em",textTransform:"uppercase",textDecoration:"none",border:"none",transition:"all .32s cubic-bezier(.23,1,.32,1)",cursor:"none" }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Start Your Order
              </a>
            )}
            <a href="tel:7632005773"
              style={{ display:"inline-flex",alignItems:"center",gap:8,border:"1.5px solid rgba(255,255,255,.15)",color:"rgba(255,255,255,.5)",padding:"17px 32px",borderRadius:999,fontSize:14,fontWeight:500,textDecoration:"none",transition:"all .3s",cursor:"none" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(212,168,67,.45)";(e.currentTarget as HTMLElement).style.color=GOLD;}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,.15)";(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.5)";}}>
              📞 (763) 200-5773
            </a>
          </div>
        </div>
      </section>
    </>
  );
}