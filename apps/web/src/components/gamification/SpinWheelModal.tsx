'use client';

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import confetti from 'canvas-confetti';
import { X, Gift, Sparkles, CheckCircle2 } from 'lucide-react';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIZES = [
  { label: '15% OFF First Order', code: 'VIPCOD15' },
  { label: 'Free Express Delivery', code: 'FREESHIP' },
  { label: '10% OFF Instant', code: 'SPECTRA10' },
  { label: 'Free Microfiber & Hard Case', code: 'LUCKY15' },
];

export function SpinWheelModal({ isOpen, onClose }: SpinWheelModalProps) {
  const { applyCoupon } = useCart();
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<{ label: string; code: string } | null>(null);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning || wonPrize) return;

    setIsSpinning(true);
    // Spin 4 to 6 full turns + pick index 0 (15% OFF)
    const prizeIndex = 0;
    const turns = 5;
    const finalAngle = turns * 360 + prizeIndex * 90 + 45;
    setRotation(finalAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = PRIZES[prizeIndex];
      setWonPrize(prize);
      applyCoupon(prize.code);

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }, 3200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="glass-strong relative w-full max-w-sm rounded-[36px] p-6 text-center border border-white/20 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-muted transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {wonPrize ? (
          /* Won Voucher View */
          <div className="py-4 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-ink">Congratulations!</h3>
            <p className="text-sm font-semibold text-accent mt-1 mb-4">{wonPrize.label}</p>
            <div className="w-full rounded-2xl bg-white/60 dark:bg-slate-900/60 p-3.5 border border-dashed border-accent/40 mb-5">
              <p className="text-[11px] text-muted mb-1">Your exclusive discount code:</p>
              <p className="text-xl font-black tracking-widest text-ink">{wonPrize.code}</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                ✓ Auto-applied to your cart!
              </p>
            </div>
            <button
              onClick={onClose}
              className="btn btn-primary h-12 w-full text-sm font-bold shadow-lg"
            >
              Shop with Discount Now
            </button>
          </div>
        ) : (
          /* Spin Wheel View */
          <div className="py-2 flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-bold mb-2">
              <Gift className="w-3.5 h-3.5" /> Lucky Lens Voucher
            </div>
            <h3 className="text-xl font-black text-ink mb-1">Spin & Win Up to 15% OFF</h3>
            <p className="text-xs text-muted mb-6">
              Unlock instant discounts on your first Cash on Delivery order!
            </p>

            {/* Simulated Wheel Graphic */}
            <div className="relative w-48 h-48 mb-6">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 w-4 h-6 bg-rose-500 clip-triangle shadow-md" />
              {/* Spinning Disc */}
              <div
                className="w-full h-full rounded-full border-4 border-white/60 dark:border-white/20 shadow-xl overflow-hidden transition-all duration-[3200ms] cubic-bezier(0.15, 0.9, 0.2, 1) flex items-center justify-center"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  background: 'conic-gradient(#3653ff 0deg 90deg, #7c3aed 90deg 180deg, #e11d74 180deg 270deg, #0f9d58 270deg 360deg)',
                }}
              >
                <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-900 shadow-md flex items-center justify-center font-black text-xs text-ink">
                  SPIN
                </div>
              </div>
            </div>

            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="btn btn-primary h-12 w-full text-sm font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>{isSpinning ? 'Spinning Wheel...' : 'Spin for My Voucher'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
