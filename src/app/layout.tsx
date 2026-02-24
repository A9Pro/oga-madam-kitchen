import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${outfit.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              {children}
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}