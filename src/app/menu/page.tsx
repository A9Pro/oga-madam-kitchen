"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";

/* ═══════════════════════════════════════════════════
   REAL MENU DATA — sourced from ogamadam.com/menu.php
═══════════════════════════════════════════════════ */
const MENU: Array<{
  id: number; name: string; price: string; note?: string;
  tag: string; cat: string;
  tagBg: string; tagC: string; tagBdr: string;
  desc: string; img: string; popular?: boolean;
}> = [
  /* ── APPETIZERS ── */
  { id:1,  name:"Meat Pie",               price:"$4.00",  cat:"Appetizers", tag:"Snack",         tagBg:"rgba(230,126,34,.15)", tagC:"#e67e22", tagBdr:"rgba(230,126,34,.4)",  desc:"Classic West African-style meat pie, golden-baked and stuffed with seasoned minced meat.",            img:"/images/suya.jpg" },
  { id:2,  name:"Puff Puff",              price:"$0.90",  cat:"Appetizers", tag:"Street Food",   tagBg:"rgba(212,168,67,.15)", tagC:"#D4A843", tagBdr:"rgba(212,168,67,.4)",  desc:"Fluffy deep-fried Nigerian dough balls — lightly sweet and utterly addictive.",                       img:"/images/jollof.jpg" },
  { id:3,  name:"Donuts",                 price:"$1.50",  cat:"Appetizers", tag:"Baked",         tagBg:"rgba(39,174,96,.12)",  tagC:"#27ae60", tagBdr:"rgba(39,174,96,.35)",  desc:"Soft, freshly made donuts. A simple crowd-pleaser.",                                                    img:"/images/jollof.jpg" },

  /* ── SOUPS ── */
  { id:4,  name:"Goat Meat Pepper Soup",  price:"$22.00", cat:"Soups",      tag:"Spicy 🔥",       tagBg:"rgba(192,57,43,.15)",  tagC:"#e74c3c", tagBdr:"rgba(192,57,43,.4)",   desc:"Rich native pepper soup with tender goat meat & aromatic spices. Add rice or fufu on request.", img:"/images/pepper-soup.jpg", popular:true,
    note:"Add instructions if you want it with rice or fufu" },
  { id:5,  name:"Catfish Pepper Soup",    price:"$20.99", cat:"Soups",      tag:"Fan Favourite", tagBg:"rgba(212,168,67,.15)", tagC:"#D4A843", tagBdr:"rgba(212,168,67,.4)",  desc:"Catfish slow-simmered in a fiery, aromatic pepper broth. Can be served with fufu or rice.",       img:"/images/pepper-soup.jpg",
    note:"Add instruction if you want it with fufu or rice" },
  { id:6,  name:"Tilapia Pepper Soup",    price:"$18.99", cat:"Soups",      tag:"Light & Fresh",  tagBg:"rgba(39,174,96,.12)",  tagC:"#27ae60", tagBdr:"rgba(39,174,96,.35)",  desc:"Tilapia pepper soup seasoned with native spices for a bold, clean finish.",                          img:"/images/pepper-soup.jpg" },
  { id:7,  name:"Ogbono Soup",            price:"$24.99", cat:"Soups",      tag:"Traditional",   tagBg:"rgba(155,89,182,.12)", tagC:"#9b59b6", tagBdr:"rgba(155,89,182,.3)",  desc:"Draw soup made from wild mango seeds — thick, hearty and deeply satisfying. Served with fufu or pounded yam.", img:"/images/egusi.jpg", popular:true },
  { id:8,  name:"Egusi Soup",             price:"$20.99", cat:"Soups",      tag:"Chef's Special", tagBg:"rgba(230,126,34,.15)", tagC:"#e67e22", tagBdr:"rgba(230,126,34,.4)",  desc:"Rich melon seed soup slow-cooked with assorted meat, leafy greens & palm oil. With pounded yam or fufu.", img:"/images/egusi.jpg", popular:true },
  { id:9,  name:"Okra & Fufu",            price:"$19.99", cat:"Soups",      tag:"Classic",       tagBg:"rgba(39,174,96,.12)",  tagC:"#27ae60", tagBdr:"rgba(39,174,96,.35)",  desc:"Slippery and satisfying okra soup served with smooth, freshly made fufu.",                            img:"/images/egusi.jpg" },
  { id:10, name:"Eforiro (Vegetable)",    price:"$23.99", cat:"Soups",      tag:"Healthy",       tagBg:"rgba(39,174,96,.12)",  tagC:"#27ae60", tagBdr:"rgba(39,174,96,.35)",  desc:"Nigerian vegetable soup with assorted meat. Served with pounded yam or fufu.",                        img:"/images/egusi.jpg" },
  { id:11, name:"Palm Butter Soup",       price:"$21.99", cat:"Soups",      tag:"West African",  tagBg:"rgba(192,57,43,.15)",  tagC:"#e74c3c", tagBdr:"rgba(192,57,43,.4)",   desc:"Silky palm butter soup with tender meat — a West African favourite through and through.",            img:"/images/pepper-soup.jpg" },

  /* ── MAINS ── */
  { id:12, name:"Jollof Rice & Chicken",  price:"$18.99", cat:"Mains",      tag:"Fan Favourite", tagBg:"rgba(212,168,67,.15)", tagC:"#D4A843", tagBdr:"rgba(212,168,67,.4)",  desc:"Smoky party-style jollof rice paired with perfectly seasoned chicken. The classic Nigerian combo.", img:"/images/jollof.jpg", popular:true },
  { id:13, name:"Fried Rice & Chicken",   price:"$18.99", cat:"Mains",      tag:"Classic",       tagBg:"rgba(39,174,96,.12)",  tagC:"#27ae60", tagBdr:"rgba(39,174,96,.35)",  desc:"Nigerian fried rice loaded with vegetables and protein, served with seasoned chicken.",             img:"/images/jollof.jpg" },
  { id:14, name:"Jollof Rice w/ Goat",    price:"$23.00", cat:"Mains",      tag:"Bestseller",    tagBg:"rgba(192,57,43,.15)",  tagC:"#e74c3c", tagBdr:"rgba(192,57,43,.4)",   desc:"Smoky jollof rice with slow-cooked, well-seasoned goat meat.",                                         img:"/images/jollof.jpg" },
  { id:15, name:"Fried Rice w/ Goat",     price:"$23.00", cat:"Mains",      tag:"Rich & Hearty", tagBg:"rgba(155,89,182,.12)", tagC:"#9b59b6", tagBdr:"rgba(155,89,182,.3)",  desc:"Nigerian fried rice with tender, peppered goat meat.",                                                 img:"/images/jollof.jpg" },
  { id:16, name:"Dry Rice & Fried Tilapia",price:"$24.99",cat:"Mains",      tag:"Seafood",       tagBg:"rgba(39,174,96,.12)",  tagC:"#27ae60", tagBdr:"rgba(39,174,96,.35)",  desc:"White rice served alongside perfectly fried whole tilapia fish.",                                       img:"/images/suya.jpg" },
  { id:17, name:"Baked Fish & Plantain",  price:"$19.99", cat:"Mains",      tag:"Healthy",       tagBg:"rgba(212,168,67,.15)", tagC:"#D4A843", tagBdr:"rgba(212,168,67,.4)",  desc:"Beautifully baked fish served with sweet plantain and roasted vegetables.",                            img:"/images/suya.jpg",
    note:"With plantain and roasted vegetables" },
  { id:18, name:"Suya Meat",              price:"$17.99", cat:"Mains",      tag:"Grilled",       tagBg:"rgba(192,57,43,.15)",  tagC:"#e74c3c", tagBdr:"rgba(192,57,43,.4)",   desc:"Spiced grilled beef with the iconic yaji spice rub — smoky, bold and irresistible.",                 img:"/images/suya.jpg", popular:true },
  { id:19, name:"Amala Ewedu & Gbegiri",  price:"$28.00", cat:"Mains",      tag:"Yoruba Classic", tagBg:"rgba(155,89,182,.12)", tagC:"#9b59b6", tagBdr:"rgba(155,89,182,.3)", desc:"Soft yam-flour swallow with jute leaf soup and bean soup. Served with assorted meat.",               img:"/images/pounded-yam.jpg",
    note:"With assorted meat" },
  { id:20, name:"Potato Greens & Rice",   price:"$20.99", cat:"Mains",      tag:"Sierra Leone",  tagBg:"rgba(39,174,96,.12)",  tagC:"#27ae60", tagBdr:"rgba(39,174,96,.35)",  desc:"West African potato leaf stew cooked with palm oil and assorted protein, served with rice.",         img:"/images/egusi.jpg" },
  { id:21, name:"Atieke w/ Tilapia",      price:"$24.99", cat:"Mains",      tag:"Ivorian",       tagBg:"rgba(230,126,34,.15)", tagC:"#e67e22", tagBdr:"rgba(230,126,34,.4)",  desc:"Fermented cassava couscous from Côte d'Ivoire, served with baked or fried tilapia.",                 img:"/images/suya.jpg" },
  { id:22, name:"Palace Sauce & Rice",    price:"$18.99", cat:"Mains",      tag:"House Special", tagBg:"rgba(212,168,67,.15)", tagC:"#D4A843", tagBdr:"rgba(212,168,67,.4)",  desc:"Our signature palace sauce paired with fluffy white rice.",                                             img:"/images/jollof.jpg" },
  { id:23, name:"Kidney Beans & Rice",    price:"$18.99", cat:"Mains",      tag:"Protein-Rich",  tagBg:"rgba(39,174,96,.12)",  tagC:"#27ae60", tagBdr:"rgba(39,174,96,.35)",  desc:"Stewed kidney beans with beef, chicken or smoked turkey, served with rice.",                          img:"/images/egusi.jpg",
    note:"Comes with rice" },
  { id:24, name:"Cassava Leaves & Rice",  price:"$19.99", cat:"Mains",      tag:"West African",  tagBg:"rgba(155,89,182,.12)", tagC:"#9b59b6", tagBdr:"rgba(155,89,182,.3)",  desc:"Slow-cooked cassava leaf stew — a beloved West African comfort dish served with rice.",              img:"/images/egusi.jpg" },
  { id:25, name:"Fried Chicken & Fries",  price:"$14.99", cat:"Mains",      tag:"4 Piece",       tagBg:"rgba(230,126,34,.15)", tagC:"#e67e22", tagBdr:"rgba(230,126,34,.4)",  desc:"4-piece crispy fried chicken with golden french fries.",                                               img:"/images/suya.jpg" },
  { id:26, name:"Fufu & Soup",            price:"$20.99", cat:"Mains",      tag:"Classic Combo", tagBg:"rgba(212,168,67,.15)", tagC:"#D4A843", tagBdr:"rgba(212,168,67,.4)",  desc:"Smooth, stretchy fufu paired with your choice of Nigerian soup.",                                       img:"/images/pounded-yam.jpg" },
  { id:27, name:"Tourbogee",              price:"$20.99", cat:"Mains",      tag:"Special",       tagBg:"rgba(192,57,43,.15)",  tagC:"#e74c3c", tagBdr:"rgba(192,57,43,.4)",   desc:"A rich and flavourful house specialty. Ask your server for today's preparation.",                    img:"/images/egusi.jpg" },
  { id:28, name:"Attieke w/ Cassava Fish",price:"$26.00", cat:"Mains",      tag:"Premium",       tagBg:"rgba(212,168,67,.15)", tagC:"#D4A843", tagBdr:"rgba(212,168,67,.4)",  desc:"Fermented cassava couscous served with dried cassava fish for a bold, authentic West African taste.", img:"/images/suya.jpg" },
  { id:29, name:"Dry Rice w/ Cassava Fish",price:"$25.50",cat:"Mains",      tag:"Unique",        tagBg:"rgba(230,126,34,.15)", tagC:"#e67e22", tagBdr:"rgba(230,126,34,.4)",  desc:"Perfectly cooked dry rice alongside smoky, seasoned cassava fish.",                                     img:"/images/jollof.jpg" },
  { id:30, name:"Pepper Roasted Turkey",  price:"$10.99", cat:"Mains",      tag:"Wings",         tagBg:"rgba(192,57,43,.15)",  tagC:"#e74c3c", tagBdr:"rgba(192,57,43,.4)",   desc:"Juicy turkey wings slow-roasted in a blend of native peppers and spices.",                            img:"/images/suya.jpg" },

  /* ── SIDES & EXTRAS ── */
  { id:31, name:"Moi Moi",               price:"$5.50",  cat:"Sides",      tag:"Nigerian Classic",tagBg:"rgba(39,174,96,.12)", tagC:"#27ae60", tagBdr:"rgba(39,174,96,.35)",  desc:"Steamed bean pudding blended with mackerel fish, egg and spices. A beloved Nigerian staple.",       img:"/images/egusi.jpg",
    note:"Grinding beans mixed with mackerel fish and egg" },
  { id:32, name:"Jollof Rice Only",       price:"$10.00", cat:"Sides",      tag:"Side",          tagBg:"rgba(212,168,67,.15)", tagC:"#D4A843", tagBdr:"rgba(212,168,67,.4)",  desc:"A generous portion of our signature smoky jollof rice on its own.",                                   img:"/images/jollof.jpg" },
  { id:33, name:"Fried Rice Only",        price:"$10.00", cat:"Sides",      tag:"Side",          tagBg:"rgba(212,168,67,.15)", tagC:"#D4A843", tagBdr:"rgba(212,168,67,.4)",  desc:"A portion of our savory Nigerian fried rice on its own.",                                              img:"/images/jollof.jpg" },
  { id:34, name:"White Rice Only",        price:"$6.99",  cat:"Sides",      tag:"Plain",         tagBg:"rgba(39,174,96,.12)",  tagC:"#27ae60", tagBdr:"rgba(39,174,96,.35)",  desc:"Plain steamed white rice. Perfect to pair with any soup or stew.",                                    img:"/images/jollof.jpg" },
  { id:35, name:"Fufu Only",              price:"$5.99",  cat:"Sides",      tag:"Swallow",       tagBg:"rgba(155,89,182,.12)", tagC:"#9b59b6", tagBdr:"rgba(155,89,182,.3)",  desc:"Smooth, freshly made fufu. Pair with any of our soups.",                                               img:"/images/pounded-yam.jpg" },
  { id:36, name:"Pounded Yam Only",       price:"$5.99",  cat:"Sides",      tag:"Swallow",       tagBg:"rgba(155,89,182,.12)", tagC:"#9b59b6", tagBdr:"rgba(155,89,182,.3)",  desc:"Silky smooth pounded yam. Perfect with any Nigerian soup.",                                             img:"/images/pounded-yam.jpg" },
  { id:37, name:"Fried Goat Meat (each)", price:"$3.50",  cat:"Sides",      tag:"Add-On",        tagBg:"rgba(192,57,43,.15)",  tagC:"#e74c3c", tagBdr:"rgba(192,57,43,.4)",   desc:"One piece of fried goat meat — crispy, spiced and incredibly satisfying.",                            img:"/images/suya.jpg" },
];

const CATS_FILTER = ["All", "Appetizers", "Soups", "Mains", "Sides"];

/* ═══════════════════════════════════════════════════
   SHARED SPOON CURSOR HOOK
   Works on any page — call once at top of component
═══════════════════════════════════════════════════ */
function useSpoonCursor() {
  const cur   = useRef<HTMLDivElement | null>(null);
  const mouse = useRef({ x:0, y:0 });
  const pos   = useRef({ x:0, y:0 });
  const last  = useRef(0);
  const raf   = useRef<number | undefined>(undefined);

  const GOLD = "#D4A843";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer:coarse)").matches) return;

    // Create cursor element
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
    cur.current = el;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      el.style.opacity = "1";
      const now = Date.now();
      if (now - last.current > 42) {
        last.current = now;
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
      pos.current.x += (mouse.current.x - pos.current.x) * 0.13;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.13;
      el.style.left = pos.current.x + "px";
      el.style.top  = pos.current.y + "px";
      raf.current = requestAnimationFrame(tick);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    raf.current = requestAnimationFrame(tick);

    const grow   = () => { el.style.transform = "translate(-8px,-36px) rotate(-35deg) scale(1.55)"; el.style.filter = "drop-shadow(0 5px 20px rgba(212,168,67,1))"; };
    const shrink = () => { el.style.transform = "translate(-8px,-36px) rotate(-35deg) scale(1)";    el.style.filter = "drop-shadow(0 2px 8px rgba(212,168,67,.6))"; };
    const hot = document.querySelectorAll("a,button,[role='button'],input,select,textarea");
    hot.forEach(h => { h.addEventListener("mouseenter", grow); h.addEventListener("mouseleave", shrink); });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
      hot.forEach(h => { h.removeEventListener("mouseenter", grow); h.removeEventListener("mouseleave", shrink); });
      document.getElementById("__spoon-cursor")?.remove();
    };
  }, []);
}

/* ═══════════════════════════════════════════════════
   DISH CARD
═══════════════════════════════════════════════════ */
function DishCard({
  dish, card, cardBdr, fg, fg2, GOLD,
}: {
  dish: typeof MENU[0]; card:string; cardBdr:string; fg:string; fg2:string; GOLD:string;
}) {
  return (
    <div className="h-dish rv"
      style={{ background:card, border:`1px solid ${cardBdr}`, borderRadius:22,
        overflow:"hidden",
        transition:"transform .45s cubic-bezier(.23,1,.32,1),box-shadow .45s,border-color .3s",
        display:"flex", flexDirection:"column" }}>
      <div style={{ position:"relative", overflow:"hidden", height:180, flexShrink:0 }}>
        <img src={dish.img} alt={dish.name} className="d-img"
          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block",
            filter:"brightness(.76)",
            transition:"transform .7s cubic-bezier(.23,1,.32,1)" }}/>
        <div style={{ position:"absolute", inset:0,
          background:`linear-gradient(to top,${card} 0%,transparent 55%)` }}/>
        <span style={{ position:"absolute", top:11, left:11, fontSize:9, fontWeight:700,
          letterSpacing:".1em", textTransform:"uppercase", padding:"4px 11px",
          borderRadius:999, backdropFilter:"blur(10px)",
          background:dish.tagBg, color:dish.tagC, border:`1px solid ${dish.tagBdr}` }}>
          {dish.tag}
        </span>
        <span style={{ position:"absolute", top:11, right:11, background:GOLD, color:"#000",
          fontSize:14, fontWeight:800,
          fontFamily:"'Cormorant Garamond',Georgia,serif",
          padding:"4px 13px", borderRadius:999 }}>{dish.price}</span>
        {dish.popular && (
          <span style={{ position:"absolute", bottom:9, right:9,
            background:"rgba(212,168,67,.92)", color:"#000",
            fontSize:8.5, fontWeight:800, letterSpacing:".1em", textTransform:"uppercase",
            padding:"3px 9px", borderRadius:999 }}>🔥 Popular</span>
        )}
      </div>
      <div style={{ padding:"15px 17px 18px", flex:1, display:"flex", flexDirection:"column" }}>
        <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
          fontSize:19, fontWeight:600, color:fg, display:"block", marginBottom:5,
          transition:"color .4s" }}>{dish.name}</span>
        <p style={{ fontSize:12.5, color:fg2, lineHeight:1.64, marginBottom:dish.note?8:14,
          flex:1, transition:"color .4s" }}>{dish.desc}</p>
        {dish.note && (
          <p style={{ fontSize:11, color:GOLD, lineHeight:1.5, marginBottom:12,
            fontStyle:"italic", opacity:.85 }}>* {dish.note}</p>
        )}
        <a href="/order" className="d-add"
          style={{ display:"flex", alignItems:"center", justifyContent:"center",
            padding:"10px", borderRadius:11,
            border:"1px solid rgba(212,168,67,.2)", color:GOLD,
            fontSize:11.5, fontWeight:700, letterSpacing:".08em",
            textTransform:"uppercase", textDecoration:"none",
            transition:"all .3s", cursor:"none", background:"transparent" }}>
          Add to Order +
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════ */
export default function MenuPage() {
  const { isDark } = useTheme();
  useSpoonCursor(); // ← cursor works here now

  const [active,  setActive]  = useState("All");
  const [search,  setSearch]  = useState("");
  const [visible, setVisible] = useState(12);

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

  const filtered = useMemo(() => {
    let list = MENU;
    if (active !== "All") list = list.filter(d => d.cat === active);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q));
    }
    return list;
  }, [active, search]);

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
  }, [filtered, visible]);

  useEffect(() => { setVisible(12); }, [active, search]);

  return (
    <>
      <style>{`
        @keyframes heroUp   { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes trailFade{ 0%{opacity:.7;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(0)} }

        .rv     { opacity:0;transform:translateY(26px);transition:opacity .75s ease,transform .75s ease; }
        .rv.vis { opacity:1;transform:translateY(0); }
        .d1{transition-delay:.04s}.d2{transition-delay:.09s}.d3{transition-delay:.14s}.d4{transition-delay:.19s}

        /* Dish hover */
        .h-dish:hover { transform:translateY(-9px) !important; box-shadow:0 28px 72px rgba(0,0,0,.62) !important; border-color:rgba(212,168,67,.32) !important; }
        .h-dish:hover .d-img { transform:scale(1.07) !important; }
        .h-dish:hover .d-add { background:${GOLD} !important; color:#000 !important; border-color:${GOLD} !important; }

        /* Filter pill */
        .pill-inactive:hover { background:rgba(212,168,67,.08) !important; border-color:rgba(212,168,67,.4) !important; color:${GOLD} !important; }

        /* Buttons */
        .btn-g:hover { background:${GOLD2} !important; transform:translateY(-2px) !important; box-shadow:0 12px 36px rgba(212,168,67,.45) !important; }

        /* Search input */
        .srch-i:focus { border-color:rgba(212,168,67,.55) !important; }

        /* No hover on touch */
        @media(hover:none) { .h-dish:hover { transform:none !important; box-shadow:none !important; } }

        /* Mobile */
        @media(max-width:768px) {
          .hdr-inner { padding:92px 20px 40px !important; }
          .fbar-inner { padding:12px 20px !important; flex-wrap:nowrap !important; }
          .fbar-pills  { flex-wrap:nowrap !important; }
          .srch-w { display:none !important; }
          .grid-w { padding:20px 20px 48px !important; grid-template-columns:1fr !important; }
          .load-w { padding:0 20px 48px !important; }
          .cta-bot { padding:40px 20px !important; }
          .res-w  { padding:14px 20px 0 !important; }
        }
      `}</style>

      {/* ── HERO HEADER ── */}
      <div style={{ position:"relative", overflow:"hidden", background:bg2,
        transition:"background .5s", paddingBottom:0 }}>
        <img src="/images/jollof.jpg" alt=""
          style={{ position:"absolute", inset:0, width:"100%", height:"100%",
            objectFit:"cover", filter:"brightness(.12) saturate(.4)",
            zIndex:0, display:"block" }}/>
        <div style={{ position:"absolute", inset:0, zIndex:1,
          background:`linear-gradient(to bottom,rgba(8,7,6,.75) 0%,${isDark?"#0E0C0A":"#F0EAE0"} 100%)`,
          transition:"background .5s" }}/>
        {/* Gold top line */}
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
          width:"26%", height:1,
          background:"linear-gradient(90deg,transparent,rgba(212,168,67,.6),transparent)",
          zIndex:2 }}/>

        <div className="hdr-inner rv" style={{ position:"relative", zIndex:10,
          padding:"112px 56px 56px", maxWidth:1200, margin:"0 auto" }}>
          <span style={{ fontSize:10, letterSpacing:".5em", textTransform:"uppercase",
            color:GOLD, fontWeight:700, display:"block", marginBottom:14,
            animation:"heroUp .8s ease .15s both" }}>Full Menu</span>
          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontWeight:300,
            lineHeight:.88, color:fg, marginBottom:16, transition:"color .4s",
            fontSize:"clamp(2.8rem,7.5vw,7rem)",
            animation:"heroUp .95s ease .28s both" }}>
            Everything on the<br/><em style={{ color:GOLD }}>Menu</em>
          </h1>
          <p style={{ fontSize:15, color:fg2, lineHeight:1.82, maxWidth:520,
            transition:"color .4s", animation:"heroUp .8s ease .44s both" }}>
            From smoky jollof rice to hearty egusi soup — every dish made fresh, every day.
            <br/>Browse below or search for your favourite.
          </p>
        </div>
      </div>

      {/* ── STICKY FILTER BAR ── */}
      <div style={{ position:"sticky", top:60, zIndex:200,
        background:isDark?"rgba(8,7,6,.97)":"rgba(250,247,242,.97)",
        backdropFilter:"blur(26px) saturate(180%)",
        borderBottom:`1px solid ${cardBdr}`,
        transition:"background .4s" }}>
        <div className="fbar-inner" style={{ maxWidth:1200, margin:"0 auto",
          padding:"13px 56px", display:"flex", alignItems:"center", gap:14,
          overflowX:"auto", scrollbarWidth:"none" }}>

          {/* Category pills */}
          <div className="fbar-pills" style={{ display:"flex", gap:8,
            overflowX:"auto", scrollbarWidth:"none",
            WebkitOverflowScrolling:"touch", flexShrink:0 }}>
            {CATS_FILTER.map(cat => (
              <button key={cat}
                className={active === cat ? "" : "pill-inactive"}
                onClick={() => setActive(cat)}
                style={{ padding:"7px 18px", borderRadius:999, fontSize:11.5,
                  fontWeight:600, letterSpacing:".06em", textTransform:"uppercase",
                  border:`1px solid ${active===cat ? GOLD : cardBdr}`,
                  background:active===cat ? GOLD : "transparent",
                  color:active===cat ? "#000" : fg2,
                  cursor:"pointer", whiteSpace:"nowrap",
                  transition:"all .25s" }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="srch-w" style={{ marginLeft:"auto", position:"relative",
            flexShrink:0 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
              stroke={fg3} strokeWidth="2"
              style={{ position:"absolute", left:13, top:"50%",
                transform:"translateY(-50%)", pointerEvents:"none" }}>
              <circle cx="11" cy="11" r="8"/>
              <path strokeLinecap="round" d="m21 21-4.35-4.35"/>
            </svg>
            <input type="search" placeholder="Search dishes…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="srch-i"
              style={{ paddingLeft:36, paddingRight:16, paddingTop:8, paddingBottom:8,
                borderRadius:999, border:`1px solid ${cardBdr}`,
                background:inputBg, color:fg, fontSize:13, width:210,
                outline:"none", transition:"border-color .25s",
                fontFamily:"'Outfit',sans-serif" }}/>
          </div>
        </div>
      </div>

      {/* ── RESULTS COUNT ── */}
      <div className="res-w" style={{ maxWidth:1200, margin:"0 auto",
        padding:"16px 56px 0" }}>
        <span style={{ fontSize:12, color:fg3, transition:"color .4s" }}>
          Showing {Math.min(visible, filtered.length)} of {filtered.length}{" "}
          {filtered.length === 1 ? "dish" : "dishes"}
          {active !== "All" ? ` · ${active}` : ""}
          {search ? ` · "${search}"` : ""}
        </span>
      </div>

      {/* ── GRID ── */}
      <div className="grid-w" style={{ maxWidth:1200, margin:"0 auto",
        padding:"22px 56px 56px",
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",
        gap:18, minHeight:320,
        background:bg, transition:"background .5s" }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn:"1/-1", textAlign:"center",
            padding:"80px 0", color:fg3, transition:"color .4s" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🍽️</div>
            <p style={{ fontSize:16, fontFamily:"'Cormorant Garamond',Georgia,serif",
              color:fg2, transition:"color .4s" }}>
              No dishes found — try a different search or filter.
            </p>
          </div>
        ) : (
          filtered.slice(0, visible).map((d, i) => (
            <DishCard key={d.id} dish={d}
              card={card} cardBdr={cardBdr} fg={fg} fg2={fg2} GOLD={GOLD}/>
          ))
        )}
      </div>

      {/* ── LOAD MORE ── */}
      {visible < filtered.length && (
        <div className="load-w" style={{ textAlign:"center",
          padding:"0 56px 60px",
          background:bg, transition:"background .5s" }}>
          <button className="btn-g"
            onClick={() => setVisible(v => v + 12)}
            style={{ display:"inline-flex", alignItems:"center", gap:10,
              background:GOLD, color:"#000", padding:"14px 40px",
              borderRadius:999, fontSize:13, fontWeight:700,
              letterSpacing:".08em", textTransform:"uppercase",
              border:"none", cursor:"pointer",
              transition:"all .32s cubic-bezier(.23,1,.32,1)" }}>
            Load {Math.min(12, filtered.length - visible)} More Dishes
          </button>
        </div>
      )}

      {/* ── BOTTOM CTA ── */}
      <div className="cta-bot" style={{ background:bg2, borderTop:`1px solid ${cardBdr}`,
        padding:"52px 56px", textAlign:"center", transition:"background .5s" }}>
        <span style={{ fontSize:10, letterSpacing:".5em", textTransform:"uppercase",
          color:GOLD, fontWeight:700, display:"block", marginBottom:14 }}>
          Ready to Eat?
        </span>
        <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontWeight:300,
          fontSize:"clamp(1.8rem,4vw,3rem)", color:fg, marginBottom:16,
          lineHeight:.95, transition:"color .4s" }}>
          Order Pickup or Delivery
        </h2>
        <p style={{ fontSize:14, color:fg2, marginBottom:26, maxWidth:420,
          marginLeft:"auto", marginRight:"auto", lineHeight:1.78,
          transition:"color .4s" }}>
          Skip the third-party fees. Order directly from us — better prices, faster service.
        </p>
        <a href="/order" className="btn-g"
          style={{ display:"inline-flex", alignItems:"center", gap:10,
            background:GOLD, color:"#000", padding:"14px 38px",
            borderRadius:999, fontSize:13, fontWeight:700,
            letterSpacing:".08em", textTransform:"uppercase",
            textDecoration:"none", border:"none",
            transition:"all .32s cubic-bezier(.23,1,.32,1)", cursor:"none" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          Place Your Order
        </a>
      </div>
    </>
  );
}