'use client';

import React, { useState } from 'react';
import { PAK_CITIES } from '../../lib/pak-cities';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, ShieldCheck, Truck, Zap, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface FastBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

export function FastBuyModal({ isOpen, onClose, product }: FastBuyModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [city, setCity] = useState('Lahore');
  const [shippingAddress, setShippingAddress] = useState('');
  const [frameColor, setFrameColor] = useState('Polished Piano Black');
  const [lensTint, setLensTint] = useState('Polarized UV400');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  if (!isOpen) return null;

  const shippingFee = product.price >= 3000 ? 0 : 200;
  const total = product.price + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setError('Please fill in your name, mobile, and delivery address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/reels/fast-buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          price: product.price,
          customerName,
          customerPhone,
          city,
          shippingAddress,
          frameColor,
          lensTint,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place Fast Buy order');
      }

      setCompletedOrder(data.order);
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="glass-strong relative w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] p-6 max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-muted transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* Order Confirmation View */
          <div className="py-6 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-ink mb-1">COD Order Confirmed!</h3>
            <p className="text-sm text-muted mb-4">
              Reference: <strong className="text-accent">{completedOrder.orderNumber}</strong>
            </p>

            <div className="w-full rounded-2xl bg-white/50 dark:bg-slate-900/50 p-4 border border-black/5 dark:border-white/5 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-muted">Item:</span>
                <span className="font-semibold text-ink">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Color & Lens:</span>
                <span className="font-semibold text-ink">{frameColor} · {lensTint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Deliver To:</span>
                <span className="font-semibold text-ink">{completedOrder.customerName}, {completedOrder.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Cash to Pay Rider:</span>
                <span className="font-bold text-ink text-sm">Rs. {completedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link
                href={`/order/${completedOrder.orderNumber}`}
                className="btn btn-primary h-12 flex-1 text-sm font-bold"
              >
                Track Live Order
              </Link>
              <button
                onClick={onClose}
                className="btn btn-ghost h-12 flex-1 text-sm font-semibold"
              >
                Back to Reels
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-accent text-white px-2.5 py-0.5 text-[11px] font-bold">
                <Zap className="w-3 h-3 fill-white" /> 1-Tap Fast Buy
              </span>
              <span className="text-xs text-muted">Cash on Delivery</span>
            </div>

            <h3 className="text-xl font-black text-ink">{product.name}</h3>
            <p className="text-lg font-bold text-accent mb-4">
              Rs. {total.toLocaleString()} <span className="text-xs text-muted font-normal">({shippingFee === 0 ? 'Free Delivery' : '+ Rs. 200 delivery'})</span>
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Variant Choices */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted block mb-1">Frame Color</label>
                  <select
                    value={frameColor}
                    onChange={(e) => setFrameColor(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
                  >
                    <option value="Polished Piano Black">Polished Piano Black</option>
                    <option value="Havana Tortoiseshell">Havana Tortoiseshell</option>
                    <option value="Royal Brushed Gold">Royal Brushed Gold</option>
                    <option value="Stealth Matte Black">Stealth Matte Black</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-muted block mb-1">Lens Technology</label>
                  <select
                    value={lensTint}
                    onChange={(e) => setLensTint(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
                  >
                    <option value="Polarized UV400">Polarized UV400 Anti-Glare</option>
                    <option value="Blue-Cut Computer Guard">Blue-Cut Computer Guard</option>
                    <option value="Photochromic Transition">Photochromic Transition</option>
                  </select>
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label className="font-semibold text-muted block mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Muhammad Ali"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Mobile Number & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted block mb-1">Mobile (WhatsApp) *</label>
                  <input
                    type="tel"
                    placeholder="0300 1234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="w-full h-11 px-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted block mb-1">City *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none focus:ring-2 focus:ring-accent"
                  >
                    {PAK_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.deliveryDays})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Complete Address */}
              <div>
                <label className="font-semibold text-muted block mb-1">Complete Delivery Address *</label>
                <textarea
                  placeholder="House / Flat #, Street, Phase / Block, Area"
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary h-12 w-full text-sm font-bold shadow-lg flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? (
                  <span>Dispatching Order...</span>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    <span>Confirm Cash on Delivery (Rs. {total.toLocaleString()})</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-muted pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Inspect Before Paying
                </span>
                <span>·</span>
                <span>7-Day Doorstep Replacement</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
