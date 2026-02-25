// app/about/page.tsx
// Drop this file into your Next.js app/about/ directory

import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'About Us | Oga Madam Kitchen',
  description: 'Welcome to Oga Madam Kitchen — where the heart and soul of Africa come together on a plate. Authentic African food experience in Minneapolis, MN.',
}

export default function AboutPage() {
  return (
    <main className="about-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .about-page {
          font-family: 'DM Sans', sans-serif;
          background: #faf8f4;
          color: #1a1208;
          overflow-x: hidden;
        }

        /* ── Hero ───────────────────────────────── */
        .about-hero {
          position: relative;
          min-height: 70vh;
          display: flex;
          align-items: flex-end;
          padding: 0 0 80px;
          overflow: hidden;
        }
        .about-hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            #1a0a00 0%,
            #3d1a00 40%,
            #6b2f00 70%,
            #c85a2b 100%
          );
        }
        .about-hero-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.06;
          background-image: repeating-linear-gradient(
            45deg,
            #fff 0, #fff 1px,
            transparent 0, transparent 50%
          );
          background-size: 20px 20px;
        }
        .about-hero-glow {
          position: absolute;
          top: -20%;
          right: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(232,166,66,0.25) 0%, transparent 70%);
          border-radius: 50%;
        }
        .about-hero-content {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 40px;
          width: 100%;
        }
        .about-eyebrow {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #e8a642;
          margin-bottom: 20px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .about-eyebrow::before {
          content: '';
          width: 32px;
          height: 1px;
          background: #e8a642;
        }
        .about-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(48px, 8vw, 96px);
          font-weight: 900;
          color: #fff;
          line-height: 1.0;
          margin-bottom: 28px;
        }
        .about-hero h1 em {
          font-style: italic;
          color: #e8a642;
        }
        .about-hero-tagline {
          font-size: 18px;
          color: rgba(255,255,255,0.7);
          font-weight: 300;
          max-width: 520px;
          line-height: 1.7;
        }

        /* ── Intro Strip ─────────────────────────── */
        .intro-strip {
          background: #1a0a00;
          padding: 64px 40px;
        }
        .intro-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .intro-label {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #e8a642;
          margin-bottom: 20px;
        }
        .intro-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 3vw, 42px);
          font-weight: 700;
          color: #fff;
          line-height: 1.25;
          margin-bottom: 24px;
        }
        .intro-body {
          color: rgba(255,255,255,0.6);
          font-size: 16px;
          line-height: 1.85;
          font-weight: 300;
        }
        .intro-body strong {
          color: #e8a642;
          font-weight: 500;
        }
        .intro-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
        }
        .stat-box {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 32px 28px;
        }
        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 900;
          color: #e8a642;
          display: block;
          line-height: 1;
          margin-bottom: 8px;
        }
        .stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* ── Mission ─────────────────────────────── */
        .mission-section {
          padding: 120px 40px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }
        .mission-image-wrap {
          position: relative;
        }
        .mission-img {
          width: 100%;
          aspect-ratio: 4/5;
          object-fit: cover;
          border-radius: 4px;
        }
        .mission-img-placeholder {
          width: 100%;
          aspect-ratio: 4/5;
          background: linear-gradient(145deg, #3d1a00, #c85a2b);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 80px;
        }
        .mission-badge {
          position: absolute;
          bottom: -24px;
          right: -24px;
          background: #e8a642;
          color: #1a0a00;
          padding: 20px 24px;
          border-radius: 4px;
          font-family: 'Playfair Display', serif;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.4;
          max-width: 180px;
        }
        .mission-content {
          padding-top: 20px;
        }
        .section-label {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c85a2b;
          margin-bottom: 20px;
          font-weight: 500;
        }
        .mission-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(30px, 3vw, 44px);
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 28px;
          color: #1a0a00;
        }
        .mission-content h2 em {
          font-style: italic;
          color: #c85a2b;
        }
        .mission-text {
          font-size: 16px;
          line-height: 1.9;
          color: #4a3828;
          font-weight: 300;
          margin-bottom: 20px;
        }
        .mission-text strong {
          color: #1a0a00;
          font-weight: 600;
        }
        .mission-pull {
          border-left: 3px solid #e8a642;
          padding: 20px 24px;
          margin: 36px 0;
          background: rgba(232,166,66,0.06);
          border-radius: 0 4px 4px 0;
        }
        .mission-pull p {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-style: italic;
          color: #1a0a00;
          line-height: 1.6;
          margin: 0;
        }

        /* ── Values ──────────────────────────────── */
        .values-section {
          background: #1a0a00;
          padding: 100px 40px;
        }
        .values-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .values-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: end;
          margin-bottom: 64px;
        }
        .values-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
        }
        .values-header h2 em {
          font-style: italic;
          color: #e8a642;
        }
        .values-header p {
          color: rgba(255,255,255,0.5);
          font-size: 16px;
          line-height: 1.8;
          font-weight: 300;
        }
        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        .value-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 40px 32px;
          transition: background 0.25s;
        }
        .value-card:hover {
          background: rgba(255,255,255,0.06);
        }
        .value-icon {
          font-size: 32px;
          margin-bottom: 20px;
          display: block;
        }
        .value-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 12px;
        }
        .value-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          line-height: 1.75;
          font-weight: 300;
        }

        /* ── Team/Owner ──────────────────────────── */
        .owner-section {
          padding: 120px 40px;
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .owner-text .section-label { margin-bottom: 16px; }
        .owner-text h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 3vw, 42px);
          font-weight: 700;
          color: #1a0a00;
          line-height: 1.2;
          margin-bottom: 24px;
        }
        .owner-text p {
          font-size: 16px;
          line-height: 1.9;
          color: #4a3828;
          font-weight: 300;
          margin-bottom: 16px;
        }
        .owner-signature {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-style: italic;
          color: #c85a2b;
          margin-top: 32px;
        }
        .owner-image-col {
          position: relative;
        }
        .owner-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 3/4;
        }
        .owner-frame-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(145deg, #e8a642, #c85a2b);
          border-radius: 4px;
          transform: translate(12px, 12px);
        }
        .owner-frame-img {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg, #3d1a00 0%, #8b3a10 100%);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 80px;
        }

        /* ── CTA ─────────────────────────────────── */
        .about-cta {
          background: linear-gradient(135deg, #e8a642 0%, #c85a2b 100%);
          padding: 100px 40px;
          text-align: center;
        }
        .about-cta h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 900;
          color: #1a0a00;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .about-cta p {
          font-size: 18px;
          color: rgba(26,8,0,0.7);
          margin-bottom: 40px;
          font-weight: 300;
        }
        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn-primary {
          background: #1a0a00;
          color: #e8a642;
          padding: 16px 36px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.2s;
          letter-spacing: 0.03em;
          display: inline-block;
        }
        .btn-primary:hover {
          background: #000;
          transform: translateY(-2px);
        }
        .btn-secondary {
          background: rgba(26,8,0,0.12);
          color: #1a0a00;
          padding: 16px 36px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.2s;
          border: 1px solid rgba(26,8,0,0.2);
          display: inline-block;
        }
        .btn-secondary:hover {
          background: rgba(26,8,0,0.2);
        }

        /* ── Responsive ──────────────────────────── */
        @media (max-width: 768px) {
          .intro-inner,
          .mission-grid,
          .values-header,
          .owner-section {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .values-grid {
            grid-template-columns: 1fr;
          }
          .intro-stats {
            grid-template-columns: 1fr 1fr;
          }
          .mission-badge {
            right: 16px;
            bottom: 16px;
          }
          .about-hero-content,
          .intro-strip,
          .mission-section,
          .values-section,
          .owner-section,
          .about-cta {
            padding-left: 20px;
            padding-right: 20px;
          }
          .values-section { padding: 60px 20px; }
          .about-cta { padding: 60px 20px; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="about-hero-bg" />
        <div className="about-hero-pattern" />
        <div className="about-hero-glow" />
        <div className="about-hero-content">
          <p className="about-eyebrow">Our Story</p>
          <h1>Where Africa<br /><em>Comes Alive</em><br />on a Plate.</h1>
          <p className="about-hero-tagline">
            More than a restaurant — a culinary journey through the rich and diverse flavors of the African continent. Good food. Good vibe.
          </p>
        </div>
      </section>

      {/* ── Intro Strip ── */}
      <section className="intro-strip">
        <div className="intro-inner">
          <div>
            <p className="intro-label">Welcome to Oga Madam</p>
            <h2 className="intro-heading">The Heart & Soul of Africa — on Every Plate</h2>
            <p className="intro-body">
              We are more than just a restaurant; we are a <strong>culinary journey</strong> that invites you to explore the rich and diverse flavors of the African continent. Oga Madam is a traditional African kitchen and we are here to serve you the very best of African dishes.
            </p>
          </div>
          <div className="intro-stats">
            <div className="stat-box">
              <span className="stat-num">50+</span>
              <span className="stat-label">Authentic Dishes</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">4.5★</span>
              <span className="stat-label">Customer Rating</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">100%</span>
              <span className="stat-label">Fresh Daily</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">1</span>
              <span className="stat-label">Mission: Taste of Africa</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="mission-section">
        <div className="mission-grid">
          <div className="mission-image-wrap">
            <div className="mission-img-placeholder">🍲</div>
            <div className="mission-badge">
              Authentic African Kitchen<br />Minneapolis, MN
            </div>
          </div>
          <div className="mission-content">
            <p className="section-label">Our Mission</p>
            <h2>Bringing the <em>Taste of Africa</em> to the Heart of the Midwest</h2>
            <p className="mission-text">
              Nestled in Minneapolis, Minnesota, Oga Madam Kitchen was born from a <strong>deep love of African culture</strong> — the belief that authentic food has the power to bring people together, no matter where they are.
            </p>
            <p className="mission-text">
              To create an authentic African food experience that will make our guests feel right at home. At Oga Madam Kitchen, we want to ensure that every guest experiences the flavor and <strong>gets the taste of Africa</strong>.
            </p>
            <div className="mission-pull">
              <p>"Every dish is prepared with the same care, spices, and soul you'd find in an African home kitchen."</p>
            </div>
            <p className="mission-text">
              From our smoky jollof rice to our hearty egusi soup — every bite tells a story of tradition, community, and the warmth of home.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="values-section">
        <div className="values-inner">
          <div className="values-header">
            <h2>What We <em>Believe</em> In</h2>
            <p>Every choice we make — from our spices to our service — is guided by these principles.</p>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <span className="value-icon">🌍</span>
              <div className="value-title">Authentic Flavors</div>
              <p className="value-desc">Spice blends imported directly from Africa. No shortcuts, no compromises — just genuine flavor that takes you home.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">🍳</span>
              <div className="value-title">Made Fresh Daily</div>
              <p className="value-desc">Every single dish is cooked from scratch each day. If it wasn't made fresh today, it doesn't leave our kitchen.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">❤️</span>
              <div className="value-title">Family & Community</div>
              <p className="value-desc">We are African-owned and community-driven. Every meal carries the love and warmth of a home-cooked family dinner.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">🤝</span>
              <div className="value-title">Honest Service</div>
              <p className="value-desc">Direct ordering, fair prices, no middlemen. We deliver ourselves because your experience matters to us personally.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">🌶️</span>
              <div className="value-title">Bold & Unapologetic</div>
              <p className="value-desc">African food is bold by nature. We don't dilute our flavors to fit a mold — we invite you into ours.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">🏡</span>
              <div className="value-title">Feel Right at Home</div>
              <p className="value-desc">Whether it's your first time or your hundredth — every guest deserves to feel the warmth of an African welcome.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Owner Section ── */}
      <section className="owner-section">
        <div className="owner-text">
          <p className="section-label">The Person Behind It All</p>
          <h2>Meet Madam — The Heart of Our Kitchen</h2>
          <p>Oga Madam Kitchen exists because of one woman's unwavering belief that African food deserves a seat at every table. From a lifetime of cooking for family and community, she brought that same love, patience, and boldness to Minneapolis.</p>
          <p>Every recipe you taste carries years of tradition. Every spice blend tells a story. And every plate that leaves our kitchen is a piece of home — served with pride.</p>
          <p className="owner-signature">— Madam</p>
        </div>
        <div className="owner-image-col">
          <div className="owner-frame">
            <div className="owner-frame-bg" />
            <div className="owner-frame-img">👩🏾‍🍳</div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta">
        <h2>Come Taste the Difference</h2>
        <p>Dine in, pick up, or get it delivered. Authentic African flavors — just for you.</p>
        <div className="cta-buttons">
          <Link href="/order" className="btn-primary">Order Now</Link>
          <Link href="/menu" className="btn-secondary">View Full Menu</Link>
        </div>
      </section>
    </main>
  )
}