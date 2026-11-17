'use client';

import React from 'react';
import { useCart } from '../../context/CartContext';
import { FREE_SHIPPING_THRESHOLD } from '../../lib/pak-cities';
import Link from 'next/link';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Truck,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    shippingFee,
    discount,
    discountCode,
    total,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-strong relative w-full max-w-md h-full flex flex-col border-l border-white/20 shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="p-5 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-accent" />
            <h3 className="text-base font-black text-ink">Your Shopping Bag</h3>
            <span className="text-xs font-bold rounded-full bg-accent/10 text-accent px-2 py-0.5">
              {items.length}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-muted transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-4 bg-white/40 dark:bg-slate-900/40 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="flex items-center gap-1.5 text-ink">
              <Truck className="w-4 h-4 text-accent" />
              {remainingForFree === 0
                ? '🎉 You unlocked FREE Shipping across Pakistan!'
                : `Add Rs. ${remainingForFree.toLocaleString()} more for FREE shipping`}
            </span>
            <span className="text-muted">{Math.round(freeShippingProgress)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted">
              <ShoppingBag className="w-12 h-12 text-muted/40 mb-3" />
              <p className="text-sm font-bold text-ink">Your bag is empty</p>
              <p className="text-xs text-muted mt-1 max-w-xs">
                Explore our procedural 3D customizer or shop bestselling frames.
              </p>
              <Link
                href="/customizer"
                onClick={() => setIsCartOpen(false)}
                className="btn btn-primary h-11 px-6 text-xs font-bold mt-5"
              >
                Launch 3D Customizer
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl p-3.5 bg-white/60 dark:bg-slate-900/60 border border-black/5 dark:border-white/5 flex gap-3 text-xs"
              >
                {/* Visual Swatch */}
                <div
                  className="w-16 h-16 rounded-xl border border-black/10 dark:border-white/10 shrink-0 flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: item.frameColor || '#111' }}
                >
                  <span className="text-white text-[10px] font-bold opacity-80 uppercase">
                    {item.frameShape?.slice(0, 3)}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-ink truncate">{item.name}</h4>
                    <p className="text-[11px] text-muted truncate">
                      {item.frameMaterial} · {item.lensTint}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-black/10 dark:border-white/10 rounded-lg overflow-hidden bg-white/50 dark:bg-slate-800/50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-black/5 text-muted hover:text-ink"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold text-ink">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-black/5 text-muted hover:text-ink"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-ink text-sm">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-rose-500 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Action */}
        {items.length > 0 && (
          <div className="p-5 border-t border-black/5 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount ({discountCode})</span>
                  <span className="font-bold">- Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-black text-ink pt-2 border-t border-black/5 dark:border-white/10">
                <span>Total (COD)</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="btn btn-primary h-12 w-full text-sm font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <span>Proceed to 1-Page COD Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[10px] text-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>Cash on Delivery · Inspect before paying rider</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
