'use client';

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { PrescriptionUpload } from './PrescriptionUpload';
import { PAK_CITIES, calculateShippingFee } from '../../lib/pak-cities';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  Truck,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Tag,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

export function ExpressCheckoutForm() {
  const { items, subtotal, shippingFee, discount, discountCode, applyCoupon, removeCoupon, total, clearCart } = useCart();
  const router = useRouter();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [city, setCity] = useState('Lahore');
  const [shippingAddress, setShippingAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [prescriptionPayload, setPrescriptionPayload] = useState<{
    prescriptionUrl?: string;
    prescriptionData?: any;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const selectedCityObj = PAK_CITIES.find((c) => c.name === city) || PAK_CITIES[0];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponInput.trim()) return;

    const ok = applyCoupon(couponInput);
    if (!ok) {
      setCouponError('Invalid voucher code. Try "VIPCOD15" for 15% off.');
    } else {
      setCouponInput('');
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (items.length === 0) {
      setFormError('Your cart is empty. Please customize or select a frame first.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setFormError('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail: customerEmail || undefined,
          city,
          shippingAddress,
          specialInstructions: specialInstructions || undefined,
          prescriptionUrl: prescriptionPayload.prescriptionUrl,
          prescriptionData: prescriptionPayload.prescriptionData,
          items,
          discount,
          source: 'checkout',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Confetti celebration
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch (err) {}

      clearCart();
      router.push(`/order/${data.order.orderNumber}`);
    } catch (err: any) {
      setFormError(err.message || 'Something went wrong while placing your COD order.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Customer & Delivery Details (7 Cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* Step 1: Customer Contact */}
        <div className="glass rounded-[28px] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-black">
              1
            </span>
            <h2 className="text-base font-black text-ink">Contact Information</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-muted block mb-1.5">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Muhammad Bilal"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-muted block mb-1.5">
                  Mobile Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  placeholder="0300 1234567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="w-full h-11 px-4 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none focus:ring-2 focus:ring-accent"
                />
                <span className="text-[10px] text-muted mt-1 block">Rider will SMS/call prior to arrival</span>
              </div>

              <div>
                <label className="font-semibold text-muted block mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="bilal@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none focus:ring-2 focus:ring-accent"
                />
                <span className="text-[10px] text-muted mt-1 block">For digital PDF receipt & dispatch updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Shipping Destination */}
        <div className="glass rounded-[28px] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-black">
              2
            </span>
            <h2 className="text-base font-black text-ink">Delivery Destination (Pakistan)</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-muted block mb-1.5">Destination City *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none focus:ring-2 focus:ring-accent"
              >
                {PAK_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} — {c.province} (Est: {c.deliveryDays})
                  </option>
                ))}
              </select>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-accent font-semibold">
                <Truck className="w-3.5 h-3.5" />
                <span>Estimated Delivery to {city}: {selectedCityObj.deliveryDays} via TCS / Leopards</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-muted block mb-1.5">Complete Street Address *</label>
              <textarea
                placeholder="House #, Street / Lane #, Sector / Phase / Block, Landmark"
                rows={3}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
                className="w-full p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none focus:ring-2 focus:ring-accent leading-relaxed"
              />
            </div>

            <div>
              <label className="font-semibold text-muted block mb-1.5">Special Courier Instructions</label>
              <input
                type="text"
                placeholder="e.g. Call before delivery / leave with building security guard"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Prescription Details */}
        <PrescriptionUpload
          onPrescriptionChange={(data) => {
            setPrescriptionPayload({
              prescriptionUrl: data.prescriptionUrl,
              prescriptionData: data.prescriptionData,
            });
          }}
        />

        {/* Step 4: Payment Method (Locked to COD) */}
        <div className="glass rounded-[28px] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-black">
              3
            </span>
            <h2 className="text-base font-black text-ink">Payment Method</h2>
          </div>

          <div className="rounded-2xl p-4 bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-ink">Cash on Delivery (COD)</h4>
              <p className="text-[11px] text-muted leading-relaxed mt-0.5">
                Pay in cash directly to the courier rider upon delivery. Inspect your package before paying. 100% risk-free.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary & 1-Click Pay (5 Cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
        <div className="glass rounded-[28px] p-6 shadow-sm">
          <h2 className="text-base font-black text-ink mb-4">Order Summary</h2>

          {/* Items List */}
          <div className="space-y-3 pb-4 border-b border-black/5 dark:border-white/10 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-ink truncate">{item.name}</p>
                  <p className="text-[11px] text-muted">
                    {item.frameColor} · {item.lensTint} × {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-ink shrink-0">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon Code Input */}
          <div className="pt-4 pb-4 border-b border-black/5 dark:border-white/10">
            {discountCode ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <Tag className="w-3.5 h-3.5" /> Voucher "{discountCode}" Applied
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-[11px] text-rose-500 underline font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Discount Voucher (e.g. VIPCOD15)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-xs text-ink uppercase outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="btn btn-ghost h-10 px-4 text-xs font-bold"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-rose-500 mt-1.5">{couponError}</p>
                )}
              </div>
            )}
          </div>

          {/* Cost Breakdown */}
          <div className="pt-4 space-y-2.5 text-xs">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span className="font-semibold text-ink">Rs. {subtotal.toLocaleString()}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Voucher Discount</span>
                <span className="font-bold">- Rs. {discount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-muted">
              <span>Shipping Fee</span>
              {shippingFee === 0 ? (
                <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
              ) : (
                <span className="font-semibold text-ink">Rs. {shippingFee}</span>
              )}
            </div>

            <div className="pt-3 border-t border-black/5 dark:border-white/10 flex justify-between items-baseline">
              <span className="text-sm font-bold text-ink">Total to Pay (COD)</span>
              <span className="text-2xl font-black text-ink">Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          {formError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Place Order Button */}
          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className="btn btn-primary h-14 w-full text-base font-bold shadow-xl flex items-center justify-center gap-2 mt-6"
          >
            {isSubmitting ? (
              <span>Confirming Order...</span>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-white" />
                <span>Place Cash on Delivery Order (Rs. {total.toLocaleString()})</span>
              </>
            )}
          </button>

          {/* Trust Guarantees */}
          <div className="mt-4 space-y-2 text-[11px] text-muted pt-2 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
              <span>Open & Inspect Box Before Paying Delivery Rider</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-accent shrink-0" />
              <span>7-Day Hassle-Free Doorstep Exchange</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
