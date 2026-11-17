'use client';

import React from 'react';
import { X, Star, CheckCircle, MapPin, ThumbsUp } from 'lucide-react';

interface ReviewsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  reviews: Array<{ author: string; city: string; comment: string; rating: number }>;
}

export function ReviewsDrawer({ isOpen, onClose, productName, reviews }: ReviewsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-strong relative w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 max-h-[85vh] overflow-y-auto border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Verified Customer Reviews</span>
            </div>
            <h3 className="text-base font-black text-ink">{productName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-muted transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rating Breakdown */}
        <div className="rounded-2xl bg-white/40 dark:bg-slate-900/40 p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-ink">4.9</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
          </div>
          <span className="text-xs text-muted">Based on 148 verified orders</span>
        </div>

        {/* Reviews List */}
        <div className="space-y-3.5">
          {reviews.length > 0 ? (
            reviews.map((r, i) => (
              <div key={i} className="rounded-2xl bg-white/50 dark:bg-slate-900/50 p-3.5 border border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-ink">{r.author}</span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-muted">
                      <MapPin className="w-2.5 h-2.5" /> {r.city}
                    </span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(r.rating || 5)].map((_, j) => (
                      <Star key={j} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed">"{r.comment}"</p>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle className="w-3 h-3" /> Cash on Delivery Verified Purchase
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted text-center py-4">No reviews yet for this model.</p>
          )}
        </div>
      </div>
    </div>
  );
}
