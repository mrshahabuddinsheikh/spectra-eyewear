'use client';

import React, { useState, useEffect } from 'react';
import { fetchSocialProof } from '../../lib/api';
import { ShoppingBag, CheckCircle, X, ShieldCheck } from 'lucide-react';

interface SocialProofEvent {
  id: string;
  customerName: string;
  city: string;
  productName: string;
  timeAgo: string;
  isRealOrder?: boolean;
}

export function SocialProofToast() {
  const [events, setEvents] = useState<SocialProofEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let rotationInterval: NodeJS.Timeout;

    async function loadSocialProof() {
      try {
        const data = await fetchSocialProof();
        const evts = data.events || [];
        const settings = data.settings || {};

        if (!settings.isEnabled || evts.length === 0) return;

        setEvents(evts);

        const initialDelay = settings.initialDelayMs || 3000;
        const displayDuration = settings.displayDurationMs || 5000;
        const interval = settings.rotationIntervalMs || 9000;

        // Initial appearance
        timer = setTimeout(() => {
          setIsVisible(true);
          // Auto hide after duration
          setTimeout(() => setIsVisible(false), displayDuration);
        }, initialDelay);

        // Rotation timer
        rotationInterval = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % evts.length);
          setIsVisible(true);
          setTimeout(() => setIsVisible(false), displayDuration);
        }, interval);
      } catch (e) {
        console.warn('Social proof toast error:', e);
      }
    }

    loadSocialProof();

    return () => {
      clearTimeout(timer);
      clearInterval(rotationInterval);
    };
  }, []);

  if (isDismissed || events.length === 0 || !isVisible) return null;

  const current = events[currentIndex] || events[0];

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-sm transition-all duration-300 animate-slide-up select-none">
      <div className="glass-strong relative rounded-2xl p-3.5 pr-8 border border-white/40 dark:border-white/10 shadow-xl flex items-center gap-3">
        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-2 right-2 p-1 text-muted hover:text-ink transition-colors"
          aria-label="Dismiss Notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Eyewear Icon Avatar */}
        <div className="w-10 h-10 rounded-xl bg-accent/10 dark:bg-accent/20 text-accent flex items-center justify-center shrink-0">
          <ShoppingBag className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="min-w-0 text-xs">
          <p className="text-ink font-semibold leading-snug truncate">
            {current.customerName} in <strong className="text-accent">{current.city}</strong>
          </p>
          <p className="text-muted text-[11px] truncate">
            bought <strong>{current.productName}</strong>
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
            <CheckCircle className="w-3 h-3" />
            <span>{current.timeAgo} · Verified COD Order</span>
          </div>
        </div>
      </div>
    </div>
  );
}
