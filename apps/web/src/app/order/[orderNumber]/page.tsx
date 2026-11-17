'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { trackOrder } from '../../../lib/api';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  ShieldCheck,
  Printer,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!orderNumber) return;
      try {
        const data = await trackOrder(orderNumber);
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'Unable to locate order');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center">
        <Truck className="w-10 h-10 animate-bounce text-accent mb-3" />
        <p className="text-sm font-bold text-ink">Retrieving Live Courier Status...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-20 text-center max-w-md mx-auto glass rounded-[32px] p-8 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-black text-ink">Order Not Found</h2>
        <p className="text-xs text-muted">
          We could not find an order matching <strong className="text-ink">{orderNumber}</strong>. Please check your order reference SMS.
        </p>
        <Link href="/track" className="btn btn-primary h-11 px-6 text-xs font-bold inline-flex">
          Search Again
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 pt-2">
      {/* Top Banner */}
      <div className="glass-strong rounded-[32px] p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-bold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Cash on Delivery Confirmed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-muted mt-1">
            Destination: <strong className="text-ink">{order.city}</strong> · Pay upon arrival
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="btn btn-ghost h-10 px-4 text-xs font-bold flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* Courier & Tracking Bar */}
      <div className="glass rounded-[28px] p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center font-black">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Assigned Courier</h3>
            <p className="text-base font-black text-ink">{order.courier || 'TCS Express Pakistan'}</p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Tracking Waybill #</h3>
          <p className="text-sm font-black text-accent font-mono">
            {order.trackingNumber || 'Tracking ID Assigned Upon Dispatch'}
          </p>
        </div>
      </div>

      {/* Courier Milestones Stepper */}
      <div className="glass rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-sm font-black text-ink uppercase tracking-wider">
          Delivery Milestones
        </h3>

        <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-black/10 dark:before:bg-white/10">
          {order.milestones?.map((m: any, idx: number) => (
            <div key={idx} className="relative flex items-start gap-4 text-xs">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                  m.completed
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 border-2 border-black/10 dark:border-white/10 text-muted'
                }`}
              >
                {m.completed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
              </div>
              <div className="pt-0.5">
                <p className={`font-bold ${m.completed ? 'text-ink' : 'text-muted'}`}>
                  {m.label}
                </p>
                <p className="text-[11px] text-muted">
                  {m.completed ? 'Completed' : 'Pending Milestone'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Items Summary & Total */}
      <div className="glass rounded-[28px] p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-ink uppercase tracking-wider">
          Package Contents
        </h3>

        <div className="space-y-3 pb-4 border-b border-black/5 dark:border-white/10">
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-ink">{item.name}</p>
                <p className="text-[11px] text-muted">
                  {item.frameColor} · {item.lensTint} × {item.quantity}
                </p>
              </div>
              <span className="font-bold text-ink">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-baseline pt-2">
          <span className="text-sm font-bold text-ink">Cash to Pay Rider (COD)</span>
          <span className="text-2xl font-black text-ink">
            Rs. {order.total?.toLocaleString()}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-900/40 text-xs text-muted flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
          <span>Please keep the exact cash amount ready for the delivery rider.</span>
        </div>
      </div>
    </div>
  );
}
