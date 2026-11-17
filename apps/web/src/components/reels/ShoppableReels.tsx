'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FastBuyModal } from './FastBuyModal';
import { ReviewsDrawer } from './ReviewsDrawer';
import {
  Volume2,
  VolumeX,
  Heart,
  MessageSquare,
  Share2,
  Zap,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export interface Reel {
  id: string;
  title: string;
  videoUrl: string;
  posterUrl?: string;
  productId?: string;
  productName?: string;
  productPrice?: number;
  likesCount?: number;
  sharesCount?: number;
  badgeText?: string;
  reviews?: Array<{ author: string; city: string; comment: string; rating: number }>;
}

interface ShoppableReelsProps {
  reels: Reel[];
}

export function ShoppableReels({ reels }: ShoppableReelsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userLikedMap, setUserLikedMap] = useState<Record<string, boolean>>({});
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [fastBuyProduct, setFastBuyProduct] = useState<any | null>(null);
  const [reviewsProduct, setReviewsProduct] = useState<any | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Initialize likes from data
  useEffect(() => {
    const initialLikes: Record<string, number> = {};
    reels.forEach((r) => {
      initialLikes[r.id] = r.likesCount || 1200;
    });
    setLikesMap(initialLikes);
  }, [reels]);

  // Handle video auto-play on current reel
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleLike = (reelId: string) => {
    const isLiked = userLikedMap[reelId];
    setUserLikedMap((prev) => ({ ...prev, [reelId]: !isLiked }));
    setLikesMap((prev) => ({
      ...prev,
      [reelId]: (prev[reelId] || 0) + (isLiked ? -1 : 1),
    }));

    if (!isLiked) {
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 900);
      // Call like endpoint
      fetch(`/api/v1/reels/${reelId}/like`, { method: 'POST' }).catch(() => {});
    }
  };

  const currentReel = reels[currentIndex] || reels[0];
  if (!currentReel) return null;

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto relative select-none">
      {/* 9:16 Shoppable Video Frame */}
      <div className="relative aspect-[9/16] w-full rounded-[36px] overflow-hidden shadow-2xl bg-black border border-white/20">
        {/* Videos Container */}
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
            }`}
          >
            <video
              ref={(el) => { videoRefs.current[index] = el; }}
              src={reel.videoUrl}
              poster={reel.posterUrl}
              playsInline
              loop
              muted={isMuted}
              className="w-full h-full object-cover"
              onClick={() => handleLike(reel.id)}
            />
          </div>
        ))}

        {/* Video Gradient Overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 z-20" />

        {/* Floating Heart Tap Animation */}
        {showHeartAnim && (
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center animate-ping">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-lg" />
          </div>
        )}

        {/* Top Header Bar */}
        <div className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2 glass rounded-full px-3 py-1 text-white text-xs font-bold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Shoppable Reels</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-all"
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Arrows for Desktop / Quick Nav */}
        <div className="absolute top-1/2 -translate-y-1/2 right-3 z-30 flex flex-col gap-2">
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all"
              aria-label="Previous Reel"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          )}
          {currentIndex < reels.length - 1 && (
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all"
              aria-label="Next Reel"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Right Side Social Action Rail */}
        <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-4">
          {/* Like Button */}
          <button
            onClick={() => handleLike(currentReel.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div
              className={`p-3 rounded-full backdrop-blur-md transition-all ${
                userLikedMap[currentReel.id]
                  ? 'bg-rose-500 text-white scale-110'
                  : 'bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              <Heart
                className={`w-6 h-6 ${userLikedMap[currentReel.id] ? 'fill-white' : ''}`}
              />
            </div>
            <span className="text-white text-[11px] font-bold drop-shadow-md">
              {(likesMap[currentReel.id] || 0).toLocaleString()}
            </span>
          </button>

          {/* Reviews Button */}
          <button
            onClick={() =>
              setReviewsProduct({
                name: currentReel.productName || 'Spectra Eyewear',
                reviews: currentReel.reviews || [],
              })
            }
            className="flex flex-col items-center gap-1"
          >
            <div className="p-3 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-all">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-white text-[11px] font-bold drop-shadow-md">
              {currentReel.reviews?.length || 12}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: currentReel.title, url: window.location.href }).catch(() => {});
              }
            }}
            className="flex flex-col items-center gap-1"
          >
            <div className="p-3 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-all">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-white text-[11px] font-bold drop-shadow-md">
              {currentReel.sharesCount || 95}
            </span>
          </button>
        </div>

        {/* Bottom Reel Details & In-Modal "⚡ Fast Buy COD" Bar */}
        <div className="absolute bottom-5 left-4 right-4 z-20 flex flex-col gap-3">
          {/* Tag & Caption */}
          <div>
            <div className="inline-flex items-center gap-1 rounded-full bg-white/20 text-white px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-md mb-1.5">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{currentReel.badgeText || 'Verified Buyer Video'}</span>
            </div>
            <p className="text-white text-xs sm:text-sm font-semibold line-clamp-2 drop-shadow-md">
              {currentReel.title}
            </p>
          </div>

          {/* Shoppable Product Card & Fast Buy Button */}
          <div className="glass rounded-2xl p-2.5 backdrop-blur-xl border border-white/30 flex items-center justify-between gap-3 shadow-lg">
            <div className="min-w-0">
              <h4 className="text-white text-xs font-bold truncate">
                {currentReel.productName || 'Spectra Eyewear'}
              </h4>
              <p className="text-emerald-400 font-extrabold text-xs">
                Rs. {(currentReel.productPrice || 2999).toLocaleString()}{' '}
                <span className="text-[10px] text-white/70 font-normal">COD</span>
              </p>
            </div>

            <button
              onClick={() =>
                setFastBuyProduct({
                  id: currentReel.productId || 'prd-wayfarer-1',
                  name: currentReel.productName || 'Spectra Eyewear',
                  price: currentReel.productPrice || 2999,
                })
              }
              className="btn btn-primary h-9 px-4 text-xs font-bold shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>⚡ Fast Buy COD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fast Buy Modal */}
      {fastBuyProduct && (
        <FastBuyModal
          isOpen={Boolean(fastBuyProduct)}
          onClose={() => setFastBuyProduct(null)}
          product={fastBuyProduct}
        />
      )}

      {/* Verified Reviews Drawer */}
      {reviewsProduct && (
        <ReviewsDrawer
          isOpen={Boolean(reviewsProduct)}
          onClose={() => setReviewsProduct(null)}
          productName={reviewsProduct.name}
          reviews={reviewsProduct.reviews}
        />
      )}
    </div>
  );
}
