import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";                              // ← NEW
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";  // ← NEW
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  title: "Oga Madam Kitchen | Authentic African Flavors in Minneapolis",
  description:
    "Experience bold, authentic African cuisine in Minneapolis, MN. Order online for pickup or local delivery. Fresh, bold, made with love.",
  keywords: [
    "African restaurant Minneapolis",
    "African food MN",
    "jollof rice Minneapolis",
    "egusi soup",
  ],
  openGraph: {
    title: "Oga Madam Kitchen",
    description: "Authentic African Flavors in Minneapolis, MN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${outfit.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              {/*
               * NotificationProvider must wrap Navbar so the bell icon reads
               * from the same shared state as the rest of the app.
               * Previously Navbar had its own private useState(MOCK_NOTIFS)
               * which was completely disconnected from NotificationContext.
               */}
              <NotificationProvider>
                <Navbar />
                <main>{children}</main>
                <Footer />
              </NotificationProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}