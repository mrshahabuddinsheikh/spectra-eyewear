'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { SpinWheelModal } from '../gamification/SpinWheelModal';
import {
  Sparkles,
  ShoppingBag,
  Sun,
  Moon,
  Gift,
  Compass,
  RotateCw,
  Search,
  Menu,
  X,
  Truck,
} from 'lucide-react';

export function Navbar() {
  const { totalCount, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Pakistani Market Announcement Bar */}
      <div className="bg-gradient-to-r from-accent via-purple-600 to-pink-600 text-white text-[11px] font-bold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Truck className="w-3.5 h-3.5" />
        <span>Cash on Delivery (COD) Available Nationwide · FREE Delivery on Orders Above Rs. 3,000!</span>
        <button
          onClick={() => setShowSpinWheel(true)}
          className="ml-2 underline font-extrabold hover:text-amber-200"
        >
          🎁 Spin for 15% OFF
        </button>
      </div>

      {/* Main Glass Navbar */}
      <header className="sticky top-0 z-40 w-full px-3 sm:px-6 pt-3">
        <nav className="mx-auto max-w-7xl glass rounded-full px-4 sm:px-6 h-16 flex items-center justify-between shadow-lg">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-ink">
                SPECTRA<span className="text-accent">.PK</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-muted -mt-1 font-semibold">
                Luxury Eyewear
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-muted">
            <Link
              href="/customizer"
              className="flex items-center gap-1.5 text-ink hover:text-accent transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5 text-accent animate-spin" style={{ animationDuration: '8s' }} />
              <span>3D Customizer</span>
            </Link>

            <Link href="/shop" className="hover:text-ink transition-colors">
              Frames Catalog
            </Link>

            <Link href="/#reels" className="hover:text-ink transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>TikTok Reels</span>
            </Link>

            <Link href="/track" className="hover:text-ink transition-colors">
              Track COD Order
            </Link>

            <Link href="/admin" className="hover:text-ink text-[11px] text-muted/70 transition-colors">
              Admin Portal
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Spin to Win Button */}
            <button
              onClick={() => setShowSpinWheel(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-accent/10 hover:bg-accent/20 text-accent px-3 py-1.5 text-xs font-bold transition-all"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Spin & Win</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted hover:text-ink transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-ink text-white hover:opacity-90 transition-all flex items-center justify-center shadow-md"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-black flex items-center justify-center shadow">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 glass-strong rounded-3xl p-5 shadow-2xl flex flex-col gap-3 text-xs font-bold text-ink animate-slide-down">
            <Link
              href="/customizer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2 rounded-xl bg-accent/10 text-accent"
            >
              <span>Procedural 3D Frame Customizer</span>
              <RotateCw className="w-4 h-4" />
            </Link>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="p-2">
              All Eyewear & Sunglasses
            </Link>
            <Link href="/#reels" onClick={() => setMobileMenuOpen(false)} className="p-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Shoppable Reels</span>
            </Link>
            <Link href="/track" onClick={() => setMobileMenuOpen(false)} className="p-2">
              Track COD Order (TCS / Leopards)
            </Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="p-2 text-muted">
              Admin Order Desk & Catalog
            </Link>
          </div>
        )}
      </header>

      {/* Gamified Spin Wheel Modal */}
      <SpinWheelModal isOpen={showSpinWheel} onClose={() => setShowSpinWheel(false)} />
    </>
  );
}
