"use client";

import Link from "next/link";
import { useSpoonCursor } from "@/hooks/useSpoonCursor";

export default function AboutPage() {
  useSpoonCursor(); // ← fixes missing cursor on about page

  const GOLD  = "#D4A843";
  const AMBER = "#c85a2b";
  const CREAM = "#faf8f4";
  const DARK  = "#1a0a00";

  return (
    <main style={{ fontFamily:"'Outfit',sans-serif", background:CREAM, color:DARK, overflowX:"hidden" }}>
      <style>{`
        @keyframes heroUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes grain  { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-2%,-3%)} 75%{transform:translate(2%,1%)} }
        @media(pointer:fine){ body,a,button,[role='button']{ cursor:none !important; } }
        .ab-val:hover    { background:rgba(255,255,255,0.06)!important; border-color:rgba(212,168,67,0.3)!important; }
        .ab-btn-p:hover  { background:#000!important; transform:translateY(-2px)!important; box-shadow:0 12px 40px rgba(0,0,0,.4)!important; }
        .ab-btn-s:hover  { background:rgba(26,8,0,0.2)!important; }
        .ab-miss-img:hover img,.ab-own-img:hover img { transform:scale(1.04)!important; }
        @media(max-width:768px){
          .ab-intro-g,.ab-miss-g,.ab-vals-h,.ab-own-g { grid-template-columns:1fr!important; gap:40px!important; }
          .ab-vals-g { grid-template-columns:1fr!important; }
          .ab-own-img { order:-1; }
          .ab-badge   { right:12px!important; bottom:12px!important; max-width:155px!important; padding:12px 14px!important; font-size:12px!important; }
          .ab-sec     { padding:60px 20px!important; }
          .ab-cta-btns{ flex-direction:column!important; align-items:center!important; }
          .ab-cta-btns a { width:100%!important; max-width:320px!important; text-align:center!important; }
        }
      `}</style>

      {/* ══ HERO ══ */}
      <section style={{ position:"relative", minHeight:"70vh", display:"flex", alignItems:"flex-end", paddingBottom:80, overflow:"hidden" }}>
        <img src="/images/sa.jpg" alt=""
          style={{ position:"absolute", inset:0, width:"100%", height:"100%",
            objectFit:"cover", objectPosition:"center 38%",
            filter:"brightness(.3) saturate(1.1)", zIndex:0 }}/>
        <div style={{ position:"absolute", inset:0, zIndex:1,
          background:"linear-gradient(135deg,rgba(26,10,0,.92) 0%,rgba(61,26,0,.5) 55%,rgba(200,90,43,.18) 100%)" }}/>
        <div style={{ position:"absolute", inset:0, zIndex:2,
          background:"linear-gradient(to bottom,transparent 40%,rgba(26,10,0,.72) 100%)" }}/>
        <div style={{ position:"absolute", inset:"-50%", width:"200%", height:"200%", zIndex:3,
          pointerEvents:"none", opacity:.025,
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          animation:"grain .4s steps(2) infinite" }}/>
        <div style={{ position:"absolute", top:"-20%", right:"-8%", width:540, height:540,
          background:`radial-gradient(circle,rgba(212,168,67,.18) 0%,transparent 70%)`,
          borderRadius:"50%", zIndex:2, pointerEvents:"none" }}/>
        <div className="ab-sec" style={{ position:"relative", zIndex:10, maxWidth:1100, margin:"0 auto", padding:"0 56px", width:"100%" }}>
          <p style={{ fontSize:11, letterSpacing:".2em", textTransform:"uppercase", color:GOLD,
            marginBottom:20, fontWeight:600, display:"flex", alignItems:"center", gap:12,
            animation:"heroUp .8s ease .1s both" }}>
            <span style={{ width:32, height:1, background:GOLD, display:"inline-block" }}/>Our Story
          </p>
          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:"clamp(48px,9vw,96px)", fontWeight:300, color:"#fff",
            lineHeight:.95, marginBottom:28, animation:"heroUp 1s ease .25s both" }}>
            Where Africa<br/>
            <em style={{ fontStyle:"italic", color:GOLD }}>Comes Alive</em><br/>
            on a Plate.
          </h1>
          <p style={{ fontSize:17, color:"rgba(255,255,255,.62)", fontWeight:300,
            maxWidth:520, lineHeight:1.78, animation:"heroUp .8s ease .42s both" }}>
            More than a restaurant — a culinary journey through the rich and diverse flavors of the African continent. Good food. Good vibe.
          </p>
        </div>
      </section>

      {/* ══ INTRO STRIP ══ */}
      <section className="ab-sec" style={{ background:DARK, padding:"72px 56px" }}>
        <div className="ab-intro-g" style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
          <div>
            <p style={{ fontSize:11, letterSpacing:".2em", textTransform:"uppercase", color:GOLD, marginBottom:18, fontWeight:600 }}>
              Welcome to Oga Madam
            </p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
              fontSize:"clamp(26px,3vw,40px)", fontWeight:400, color:"#fff", lineHeight:1.25, marginBottom:22 }}>
              The Heart &amp; Soul of Africa —<br/>on Every Plate
            </h2>
            <p style={{ color:"rgba(255,255,255,.55)", fontSize:15, lineHeight:1.88, fontWeight:300 }}>
              We are more than just a restaurant; we are a{" "}
              <strong style={{ color:GOLD, fontWeight:500 }}>culinary journey</strong>{" "}
              that invites you to explore the rich and diverse flavors of the African continent. Oga Madam is a traditional African kitchen — here to serve you the very best.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2 }}>
            {[["50+","Authentic Dishes"],["4.5★","Customer Rating"],["100%","Fresh Daily"],["🌍","Taste of Africa"]].map(([n,l]) => (
              <div key={l} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", padding:"30px 26px" }}>
                <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                  fontSize: typeof n === "string" && n.startsWith("🌍") ? 38 : 44,
                  fontWeight:700, color:GOLD, display:"block", lineHeight:1, marginBottom:8 }}>{n}</span>
                <span style={{ fontSize:11, color:"rgba(255,255,255,.36)", textTransform:"uppercase", letterSpacing:".1em" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MISSION ══ */}
      <section className="ab-sec" style={{ padding:"110px 56px", maxWidth:1100, margin:"0 auto" }}>
        <div className="ab-miss-g" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"start" }}>

          {/* Image — egusi soup */}
          <div className="ab-miss-img" style={{ position:"relative" }}>
            <div style={{ borderRadius:8, overflow:"hidden", aspectRatio:"4/5", position:"relative" }}>
              <img
                src="/images/egusi.jpg"
                alt="Authentic egusi soup — made fresh daily at Oga Madam Kitchen"
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block",
                  filter:"brightness(.88) saturate(1.05)",
                  transition:"transform .7s cubic-bezier(.23,1,.32,1)" }}/>
              <div style={{ position:"absolute", inset:0,
                background:"linear-gradient(to top,rgba(26,10,0,.48) 0%,transparent 52%)" }}/>
            </div>
            <div className="ab-badge" style={{
              position:"absolute", bottom:-24, right:-24,
              background:GOLD, color:DARK,
              padding:"18px 22px", borderRadius:8,
              fontFamily:"'Cormorant Garamond',Georgia,serif",
              fontSize:14, fontWeight:700, lineHeight:1.45, maxWidth:180,
              boxShadow:"0 16px 48px rgba(212,168,67,.45)",
            }}>
              Authentic African Kitchen<br/>Minneapolis, MN
            </div>
          </div>

          {/* Text */}
          <div style={{ paddingTop:20 }}>
            <p style={{ fontSize:11, letterSpacing:".2em", textTransform:"uppercase", color:AMBER, marginBottom:18, fontWeight:600 }}>Our Mission</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
              fontSize:"clamp(28px,3vw,44px)", fontWeight:400, lineHeight:1.18, marginBottom:28, color:DARK }}>
              Bringing the{" "}
              <em style={{ fontStyle:"italic", color:AMBER }}>Taste of Africa</em>{" "}
              to the Heart of the Midwest
            </h2>
            <p style={{ fontSize:15, lineHeight:1.92, color:"#4a3828", fontWeight:300, marginBottom:18 }}>
              Nestled in Minneapolis, Minnesota, Oga Madam Kitchen was born from a{" "}
              <strong style={{ color:DARK, fontWeight:600 }}>deep love of African culture</strong>{" "}
              — the belief that authentic food has the power to bring people together, no matter where they are.
            </p>
            <p style={{ fontSize:15, lineHeight:1.92, color:"#4a3828", fontWeight:300, marginBottom:18 }}>
              To create an authentic African food experience that will make our guests feel right at home. At Oga Madam Kitchen, we want to ensure that every guest experiences the flavor and{" "}
              <strong style={{ color:DARK, fontWeight:600 }}>gets the taste of Africa</strong>.
            </p>
            <div style={{ borderLeft:`3px solid ${GOLD}`, padding:"18px 22px", margin:"30px 0",
              background:"rgba(212,168,67,.06)", borderRadius:"0 6px 6px 0" }}>
              <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                fontSize:19, fontStyle:"italic", color:DARK, lineHeight:1.62, margin:0 }}>
                &ldquo;Every dish is prepared with the same care, spices, and soul you&apos;d find in an African home kitchen.&rdquo;
              </p>
            </div>
            <p style={{ fontSize:15, lineHeight:1.92, color:"#4a3828", fontWeight:300 }}>
              From our smoky jollof rice to our hearty egusi soup — every bite tells a story of tradition, community, and the warmth of home.
            </p>
          </div>
        </div>
      </section>

      {/* ══ VALUES ══ */}
      <section className="ab-sec" style={{ background:DARK, padding:"100px 56px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="ab-vals-h" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"end", marginBottom:54 }}>
            <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
              fontSize:"clamp(30px,4vw,52px)", fontWeight:300, color:"#fff", lineHeight:1.1 }}>
              What We <em style={{ fontStyle:"italic", color:GOLD }}>Believe</em> In
            </h2>
            <p style={{ color:"rgba(255,255,255,.44)", fontSize:15, lineHeight:1.82, fontWeight:300 }}>
              Every choice we make — from our spices to our service — is guided by these principles.
            </p>
          </div>
          <div className="ab-vals-g" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
            {[
              { icon:"🌍", title:"Authentic Flavors",     body:"Spice blends imported directly from Africa. No shortcuts, no compromises — just genuine flavor that takes you home." },
              { icon:"🍳", title:"Made Fresh Daily",      body:"Every single dish is cooked from scratch each day. If it wasn't made fresh today, it doesn't leave our kitchen." },
              { icon:"❤️", title:"Family & Community",   body:"We are African-owned and community-driven. Every meal carries the love and warmth of a home-cooked family dinner." },
              { icon:"🤝", title:"Honest Service",        body:"Direct ordering, fair prices, no middlemen. We deliver ourselves because your experience matters to us personally." },
              { icon:"🌶️", title:"Bold & Unapologetic", body:"African food is bold by nature. We don't dilute our flavors to fit a mold — we invite you into ours." },
              { icon:"🏡", title:"Feel Right at Home",   body:"Whether it's your first time or your hundredth — every guest deserves to feel the warmth of an African welcome." },
            ].map(({ icon, title, body }) => (
              <div key={title} className="ab-val" style={{
                background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)",
                padding:"38px 30px", transition:"background .25s,border-color .25s",
              }}>
                <span style={{ fontSize:30, marginBottom:18, display:"block" }}>{icon}</span>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                  fontSize:20, fontWeight:600, color:"#fff", marginBottom:11 }}>{title}</div>
                <p style={{ fontSize:13.5, color:"rgba(255,255,255,.42)", lineHeight:1.78, fontWeight:300, margin:0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OWNER ══ */}
      <section className="ab-sec" style={{ padding:"110px 56px" }}>
        <div className="ab-own-g" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center", maxWidth:1100, margin:"0 auto" }}>
          {/* Copy */}
          <div>
            <p style={{ fontSize:11, letterSpacing:".2em", textTransform:"uppercase", color:AMBER, marginBottom:16, fontWeight:600 }}>
              The Person Behind It All
            </p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
              fontSize:"clamp(28px,3vw,42px)", fontWeight:400, color:DARK, lineHeight:1.2, marginBottom:24 }}>
              Meet Madam — The Heart of Our Kitchen
            </h2>
            <p style={{ fontSize:15, lineHeight:1.92, color:"#4a3828", fontWeight:300, marginBottom:16 }}>
              Oga Madam Kitchen exists because of one woman&apos;s unwavering belief that African food deserves a seat at every table. From a lifetime of cooking for family and community, she brought that same love, patience, and boldness to Minneapolis.
            </p>
            <p style={{ fontSize:15, lineHeight:1.92, color:"#4a3828", fontWeight:300, marginBottom:16 }}>
              Every recipe you taste carries years of tradition. Every spice blend tells a story. And every plate that leaves our kitchen is a piece of home — served with pride.
            </p>
            <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:28, fontStyle:"italic", color:AMBER, marginTop:28 }}>
              — Madam
            </p>
          </div>

          {/* Image — jollof rice (warm gold tones perfect for brand) */}
          <div className="ab-own-img" style={{ position:"relative" }}>
            <div style={{ position:"absolute", inset:0,
              background:`linear-gradient(145deg,${GOLD},${AMBER})`,
              borderRadius:8, transform:"translate(14px,14px)", zIndex:0 }}/>
            <div style={{ position:"relative", zIndex:1, borderRadius:8, overflow:"hidden", aspectRatio:"3/4" }}>
              <img
                src="/images/jollof.jpg"
                alt="Oga Madam Kitchen — food made with love and tradition"
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block",
                  filter:"brightness(.82) saturate(1.1)",
                  transition:"transform .7s cubic-bezier(.23,1,.32,1)" }}/>
              <div style={{ position:"absolute", inset:0,
                background:"linear-gradient(to top,rgba(26,10,0,.58) 0%,transparent 55%)" }}/>
              <div style={{
                position:"absolute", bottom:20, left:20,
                background:"rgba(0,0,0,.62)", backdropFilter:"blur(14px)",
                border:`1px solid rgba(212,168,67,.2)`,
                borderRadius:10, padding:"12px 18px",
              }}>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                  fontSize:15, fontStyle:"italic", color:GOLD, marginBottom:3 }}>
                  &ldquo;Made with love&rdquo;
                </div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", letterSpacing:".08em", textTransform:"uppercase" }}>
                  Every single day
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="ab-sec" style={{
        background:`linear-gradient(135deg,${GOLD} 0%,${AMBER} 100%)`,
        padding:"100px 56px", textAlign:"center",
      }}>
        <p style={{ fontSize:10, letterSpacing:".5em", textTransform:"uppercase", color:"rgba(26,8,0,.48)", fontWeight:700, marginBottom:16 }}>
          Ready to Eat?
        </p>
        <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
          fontSize:"clamp(36px,6vw,72px)", fontWeight:300, color:DARK, lineHeight:.95, marginBottom:20 }}>
          Come Taste<br/>
          <em style={{ fontStyle:"italic" }}>the Difference</em>
        </h2>
        <p style={{ fontSize:17, color:"rgba(26,8,0,.6)", fontWeight:300, maxWidth:420, margin:"0 auto 44px", lineHeight:1.75 }}>
          Dine in, pick up, or get it delivered. Authentic African flavors — just for you.
        </p>
        <div className="ab-cta-btns" style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <Link href="/order" className="ab-btn-p" style={{
            background:DARK, color:GOLD, padding:"15px 38px", borderRadius:999,
            fontWeight:700, fontSize:13, letterSpacing:".08em", textTransform:"uppercase",
            textDecoration:"none", transition:"all .3s", display:"inline-block", cursor:"none",
          }}>Order Now</Link>
          <Link href="/menu" className="ab-btn-s" style={{
            background:"rgba(26,8,0,.1)", color:DARK, padding:"15px 38px", borderRadius:999,
            fontWeight:700, fontSize:13, letterSpacing:".08em", textTransform:"uppercase",
            textDecoration:"none", transition:"all .3s",
            border:"1px solid rgba(26,8,0,.22)", display:"inline-block", cursor:"none",
          }}>View Full Menu</Link>
        </div>
      </section>
    </main>
  );
}