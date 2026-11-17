import type { Metadata } from 'next';
import '../styles/globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { CartProvider } from '../context/CartContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/layout/CartDrawer';
import { SocialProofToast } from '../components/social-proof/SocialProofToast';
import { FloatingOpticianBot } from '../components/optician/FloatingOpticianBot';

export const metadata: Metadata = {
  title: 'Spectra Eyewear — Luxury 3D Frames, Shoppable Reels & Cash on Delivery Pakistan',
  description:
    'Customize procedural 3D eyewear, watch TikTok-style shoppable video reels, and pay Cash on Delivery anywhere in Pakistan. Hand-crafted Italian acetate and titanium frames with Blue-Cut and Polarized UV400 lenses.',
  keywords: [
    'eyewear pakistan',
    'sunglasses karachi',
    'glasses lahore',
    '3d glasses customizer',
    'shoppable reels',
    'cash on delivery eyewear',
    'blue-cut glasses pakistan',
    'polarized sunglasses pk',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <CartProvider>
            {/* Ambient Background Glow Effect */}
            <div className="ambient-glow" aria-hidden="true" />

            {/* Navigation Header */}
            <Navbar />

            {/* Main Page Body */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
              {children}
            </main>

            {/* Global E-Commerce Overlays */}
            <CartDrawer />
            <SocialProofToast />
            <FloatingOpticianBot />

            {/* Site Footer */}
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
