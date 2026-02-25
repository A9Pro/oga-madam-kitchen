// components/Footer.tsx
// Import this in your layout.tsx and place it after <main>
// e.g:  <main>{children}</main>  <Footer />

import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .site-footer {
          background: #0e0800;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── CTA strip ── */
        .footer-cta {
          background: linear-gradient(135deg, #c85a2b 0%, #e8a642 100%);
          padding: 56px 40px;
          text-align: center;
        }
        .footer-cta h3 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 3vw, 36px);
          color: #1a0a00;
          margin-bottom: 10px;
        }
        .footer-cta p {
          font-size: 15px;
          color: rgba(26,8,0,0.6);
          margin-bottom: 28px;
          font-weight: 300;
        }
        .footer-cta-btn {
          display: inline-block;
          background: #1a0a00;
          color: #e8a642;
          padding: 14px 36px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .footer-cta-btn:hover { background: #000; transform: translateY(-2px); }

        /* ── Body grid ── */
        .footer-grid {
          max-width: 1100px;
          margin: 0 auto;
          padding: 72px 40px 48px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
        }

        /* Brand */
        .f-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          color: #fff;
          margin-bottom: 4px;
        }
        .f-brand-name span { color: #e8a642; }
        .f-brand-sub {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #e8a642;
          display: block;
          margin-bottom: 18px;
        }
        .f-brand-desc {
          font-size: 14px;
          line-height: 1.85;
          color: rgba(255,255,255,0.38);
          font-weight: 300;
          margin-bottom: 28px;
          max-width: 260px;
        }
        .f-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(232,166,66,0.08);
          border: 1px solid rgba(232,166,66,0.2);
          padding: 8px 14px;
          border-radius: 4px;
          font-size: 12px;
          color: #e8a642;
          font-weight: 500;
        }

        /* Cols */
        .f-col h4 {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #e8a642;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .f-nav { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
        .f-nav a {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          font-weight: 300;
          transition: color 0.2s;
        }
        .f-nav a:hover { color: #fff; }

        /* Hours */
        .hour-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: rgba(255,255,255,0.32);
          padding: 7px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          gap: 16px;
        }
        .hour-row:last-child { border: none; }
        .hour-day { color: rgba(255,255,255,0.5); font-weight: 400; }

        /* Contact */
        .f-contact {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .f-contact-item {
          display: flex;
          gap: 10px;
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          font-weight: 300;
          line-height: 1.6;
        }
        .f-contact-item a { color: inherit; text-decoration: none; transition: color 0.2s; }
        .f-contact-item a:hover { color: #fff; }
        .f-contact-icon { flex-shrink: 0; margin-top: 2px; }

        /* Bottom */
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-copy { font-size: 12px; color: rgba(255,255,255,0.2); }
        .footer-bot-links { display: flex; gap: 24px; }
        .footer-bot-links a {
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-bot-links a:hover { color: rgba(255,255,255,0.55); }

        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr; padding: 48px 20px 32px; }
          .footer-cta { padding: 40px 20px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; padding: 20px; }
        }
      `}</style>

      <footer className="site-footer">

        {/* Order CTA */}
        <div className="footer-cta">
          <h3>Ready to Taste Africa?</h3>
          <p>Order directly — no middlemen, better prices, fresher food.</p>
          <Link href="/order" className="footer-cta-btn">Order Now →</Link>
        </div>

        {/* Grid */}
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <div className="f-brand-name">Oga <span>Madam</span></div>
            <span className="f-brand-sub">African Kitchen · Minneapolis</span>
            <p className="f-brand-desc">
              Authentic African food made fresh daily — with the same love, spices, and soul you'd find in an African home kitchen.
            </p>
            <span className="f-badge">🌍 African Owned &amp; Operated</span>
          </div>

          {/* Links */}
          <div className="f-col">
            <h4>Explore</h4>
            <ul className="f-nav">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/menu">Menu</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/order">Order Online</Link></li>
              <li><Link href="/orders">My Orders</Link></li>
            </ul>
          </div>

          {/* Hours */}
          <div className="f-col">
            <h4>Hours</h4>
            <div>
              <div className="hour-row"><span className="hour-day">Mon – Thu</span><span>11am – 9pm</span></div>
              <div className="hour-row"><span className="hour-day">Friday</span><span>11am – 10pm</span></div>
              <div className="hour-row"><span className="hour-day">Saturday</span><span>10am – 10pm</span></div>
              <div className="hour-row"><span className="hour-day">Sunday</span><span>12pm – 8pm</span></div>
            </div>
          </div>

          {/* Contact */}
          <div className="f-col">
            <h4>Find Us</h4>
            <div className="f-contact">
              <div className="f-contact-item">
                <span className="f-contact-icon">📍</span>
                <a href="https://www.google.com/maps/search/?api=1&query=6000+Shingle+Creek+Pkwy+Minneapolis+MN+55430" target="_blank" rel="noreferrer">
                  6000 Shingle Creek Pkwy,<br />Minneapolis, MN 55430
                </a>
              </div>
              <div className="f-contact-item">
                <span className="f-contact-icon">📞</span>
                <a href="tel:7632005773">(763) 200-5773</a>
              </div>
              <div className="f-contact-item">
                <span className="f-contact-icon">✉️</span>
                <a href="mailto:joyceneuville@gmail.com">joyceneuville@gmail.com</a>
              </div>
              <div className="f-contact-item">
                <span className="f-contact-icon">🚗</span>
                <span>Delivery within 10-mile radius</span>
              </div>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© {year} Oga Madam Kitchen. All rights reserved.</span>
          <div className="footer-bot-links">
            <Link href="/about">About</Link>
            <Link href="/menu">Menu</Link>
            <Link href="/order">Order</Link>
          </div>
        </div>

      </footer>
    </>
  )
}