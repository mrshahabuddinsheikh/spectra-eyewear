import React from 'react';
import { ExpressCheckoutForm } from '../../components/checkout/ExpressCheckoutForm';
import { ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: '1-Page Express Cash on Delivery Checkout · Spectra Eyewear PK',
  description: 'Fast, frictionless Cash on Delivery (COD) checkout across Pakistan. Order your custom frames with free shipping over Rs. 3,000.',
};

export default function CheckoutPage() {
  return (
    <div className="space-y-8 pb-16 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-bold mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Frictionless COD Checkout · Pakistan Nationwide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-ink">
            Express 1-Page Checkout
          </h1>
          <p className="text-xs text-muted mt-1">
            No credit card or online payment required. Pay cash to the courier upon delivery.
          </p>
        </div>

        <Link
          href="/"
          className="btn btn-ghost h-10 px-4 text-xs font-semibold self-start sm:self-auto flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Express Checkout Form Component */}
      <ExpressCheckoutForm />
    </div>
  );
}
