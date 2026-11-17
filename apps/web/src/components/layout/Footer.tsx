'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Award, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-black/5 dark:border-white/10 bg-white/20 dark:bg-slate-950/40 backdrop-blur-md">
      {/* Trust Badges Rail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-b border-black/5 dark:border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-ink">Nationwide COD</h4>
              <p className="text-[11px] text-muted">Free delivery over Rs. 3,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-ink">Inspect Before Paying</h4>
              <p className="text-[11px] text-muted">Open parcel with rider</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-ink">7-Day Swap Guarantee</h4>
              <p className="text-[11px] text-muted">Doorstep courier exchange</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-ink">100% UV400 Certified</h4>
              <p className="text-[11px] text-muted">German precision optical glass</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Intro (2 Cols) */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-black text-base shadow">
                S
              </div>
              <span className="text-lg font-black tracking-tight text-ink">
                SPECTRA<span className="text-accent">.PK</span>
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed max-w-sm">
              Pakistan's premier luxury eyewear atelier. Featuring zero-download procedural 3D customizer technology, high-index blue-light filters, and Cash on Delivery tailored for Karachi, Lahore, Islamabad, and nationwide.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-muted">
              <span>Delivery via TCS · Leopards · Trax</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-ink uppercase tracking-wider text-[11px]">3D Optical Tech</h4>
            <ul className="space-y-2 text-muted">
              <li><Link href="/customizer" className="hover:text-ink">3D Frame Customizer</Link></li>
              <li><Link href="/#reels" className="hover:text-ink">Shoppable Reels</Link></li>
              <li><Link href="/shop" className="hover:text-ink">Polarized Sunglasses</Link></li>
              <li><Link href="/shop" className="hover:text-ink">Blue-Cut Computer Optics</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-ink uppercase tracking-wider text-[11px]">Customer Care</h4>
            <ul className="space-y-2 text-muted">
              <li><Link href="/track" className="hover:text-ink">Track Your COD Order</Link></li>
              <li><Link href="/checkout" className="hover:text-ink">1-Page Express Checkout</Link></li>
              <li><span className="text-muted">7-Day Replacement Policy</span></li>
              <li><span className="text-muted">Prescription Guidance</span></li>
            </ul>
          </div>

          {/* Pakistan Contact Info */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-ink uppercase tracking-wider text-[11px]">Optics Studio PK</h4>
            <ul className="space-y-2.5 text-muted">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Sector Y, Phase 3, DHA, Lahore & Clifton Block 4, Karachi</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span>WhatsApp: +92 300 SPECTRA (7732872)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span>orders@spectra.pk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted gap-3">
          <p>© 2026 Spectra Eyewear PK. All rights reserved. Built for speed, high conversion & Cash on Delivery.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-ink">Admin Dashboard</Link>
            <span>·</span>
            <span>Made in Pakistan 🇵🇰</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
