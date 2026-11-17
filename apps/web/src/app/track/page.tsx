'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Truck, ShieldCheck, ArrowRight } from 'lucide-react';

export default function TrackPage() {
  const [orderQuery, setOrderQuery] = useState('');
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = orderQuery.trim().toUpperCase();
    if (!clean) return;
    router.push(`/order/${encodeURIComponent(clean)}`);
  };

  return (
    <div className="max-w-xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 glass rounded-full px-3 py-1 text-xs font-bold text-accent">
          <Truck className="w-3.5 h-3.5" />
          <span>Real-Time Courier Integration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-ink">
          Track Your COD Order
        </h1>
        <p className="text-xs text-muted max-w-md mx-auto">
          Enter your Spectra order reference number (e.g. <strong>SP-2026-8492</strong>) sent via SMS or WhatsApp confirmation.
        </p>
      </div>

      <div className="glass-strong rounded-[32px] p-8 shadow-xl border border-white/60 dark:border-white/10">
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">
              Order Reference Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="SP-2026-XXXX"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-base font-bold text-ink uppercase tracking-wider outline-none focus:ring-2 focus:ring-accent"
                required
              />
              <Search className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary h-14 w-full text-base font-bold shadow-lg flex items-center justify-center gap-2"
          >
            <span>Track Live Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo order quick links */}
        <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/10 text-xs text-muted flex items-center justify-between">
          <span>Quick Demo Orders:</span>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/order/SP-2026-8492')}
              className="text-accent hover:underline font-semibold"
            >
              SP-2026-8492
            </button>
            <span>·</span>
            <button
              onClick={() => router.push('/order/SP-2026-7821')}
              className="text-accent hover:underline font-semibold"
            >
              SP-2026-7821
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
