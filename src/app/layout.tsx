import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/context/ThemeContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Oga Madam Kitchen | Authentic Nigerian Flavors in Minneapolis",
  description:
    "Experience bold, authentic Nigerian cuisine in Minneapolis, MN. Order online for pickup or local delivery. Fresh, bold, made with love.",
  keywords: [
    "Nigerian restaurant Minneapolis",
    "West African food MN",
    "jollof rice Minneapolis",
    "egusi soup",
    "Nigerian food delivery",
  ],
  openGraph: {
    title: "Oga Madam Kitchen",
    description: "Authentic Nigerian Flavors in Minneapolis, MN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" data-theme="dark">
      <body
        className={`${cormorant.variable} ${outfit.variable} antialiased`}
        style={{
          background: "#080706",
          color: "#fff",
          fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <ThemeProvider>
          <Navbar />
          {children}

          {/* ══ FOOTER ══ */}
          <footer
            style={{
              background: "#0E0C0A",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              padding: "72px 56px 40px",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.6fr 1fr 1fr",
                gap: 56,
                maxWidth: 1200,
                margin: "0 auto 52px",
              }}
              className="foot-grid"
            >
              {/* Brand */}
              <div>
                <span
                  style={{
                    color: "#D4A843",
                    fontSize: 9,
                    letterSpacing: "0.5em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  OGA
                </span>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 26,
                    color: "#fff",
                    fontWeight: 400,
                    display: "block",
                    marginBottom: 16,
                  }}
                >
                  Madam Kitchen
                </span>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.28)",
                    lineHeight: 1.85,
                    maxWidth: 260,
                  }}
                >
                  Bringing authentic Nigerian flavors to Minneapolis, MN. Every
                  dish tells a story of tradition, culture, and love.
                </p>
              </div>

              {/* Hours */}
              <div>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.45em",
                    textTransform: "uppercase",
                    color: "#D4A843",
                    fontWeight: 600,
                    marginBottom: 24,
                  }}
                >
                  Hours
                </div>
                {[
                  ["Sunday",    "12:00 – 6:00 PM"],
                  ["Mon – Fri", "11:00 AM – 7:30 PM"],
                  ["Saturday",  "11:00 AM – 8:00 PM"],
                ].map(([day, hours]) => (
                  <div
                    key={day}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.28)",
                      marginBottom: 10,
                    }}
                  >
                    <span>{day}</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.45em",
                    textTransform: "uppercase",
                    color: "#D4A843",
                    fontWeight: 600,
                    marginBottom: 24,
                  }}
                >
                  Contact
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.28)",
                    lineHeight: 2.1,
                  }}
                >
                  6000 Shingle Creek Pkwy
                  <br />
                  Minneapolis, MN 55430
                  <br />
                  <br />
                  <a
                    href="tel:7632005773"
                    style={{ color: "rgba(255,255,255,0.28)", textDecoration: "none" }}
                  >
                    (763) 200-5773
                  </a>
                  <br />
                  <a
                    href="mailto:joyceneuville@gmail.com"
                    style={{ color: "rgba(255,255,255,0.28)", textDecoration: "none" }}
                  >
                    joyceneuville@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div
              style={{
                maxWidth: 1200,
                margin: "0 auto",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                paddingTop: 26,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
                © {new Date().getFullYear()} Oga Madam Kitchen. All rights reserved.
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#22c55e",
                    display: "inline-block",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
                Now accepting online orders
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}