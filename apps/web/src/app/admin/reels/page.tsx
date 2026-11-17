'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Play, Heart, MessageSquare, Video } from 'lucide-react';

export default function AdminReelsPage() {
  const [reels, setReels] = useState<any[]>([]);
  const [newReelModal, setNewReelModal] = useState(false);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [productName, setProductName] = useState('Wayfarer Bold Acetate');
  const [productPrice, setProductPrice] = useState(2999);
  const [likesCount, setLikesCount] = useState(2400);

  const token = typeof window !== 'undefined' ? localStorage.getItem('spectra_admin_token') : null;

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      const res = await fetch('/api/v1/reels');
      const data = await res.json();
      setReels(data.reels || []);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleCreateReel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/reels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          videoUrl,
          productName,
          productPrice,
          likesCount,
          badgeText: 'Trending on TikTok PK',
        }),
      });

      if (res.ok) {
        fetchReels();
        setNewReelModal(false);
        setTitle('');
        setVideoUrl('');
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-ink">Shoppable Reels Manager</h2>
          <p className="text-xs text-muted">Manage 9:16 vertical video carousels, customer review testimonials, and 1-tap COD bindings.</p>
        </div>

        <button
          onClick={() => setNewReelModal(true)}
          className="btn btn-primary h-10 px-4 text-xs font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Reel</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {reels.map((reel) => (
          <div
            key={reel.id}
            className="glass rounded-[28px] overflow-hidden border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between"
          >
            <div className="relative aspect-[9/16] bg-black">
              <video
                src={reel.videoUrl}
                muted
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white text-xs space-y-1">
                <span className="text-[10px] bg-rose-500 px-2 py-0.5 rounded-full font-bold">
                  {reel.badgeText}
                </span>
                <p className="font-bold line-clamp-2">{reel.title}</p>
                <p className="text-emerald-400 font-black">
                  {reel.productName} · Rs. {reel.productPrice?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="p-3.5 flex items-center justify-between text-xs text-muted">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> {reel.likesCount?.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-accent" /> {reel.reviews?.length || 0} reviews
              </span>
            </div>
          </div>
        ))}
      </div>

      {newReelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-strong relative w-full max-w-md rounded-[32px] p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-ink">Add Shoppable Video Reel</h3>

            <form onSubmit={handleCreateReel} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-muted block mb-1">Reel Title / Caption *</label>
                <input
                  type="text"
                  placeholder="e.g. Unboxing Aviator Titanium in Karachi ✨"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-muted block mb-1">Video Stream URL (MP4) *</label>
                <input
                  type="url"
                  placeholder="https://assets.mixkit.co/.../video.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted block mb-1">Linked Eyewear</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted block mb-1">COD Price (PKR)</label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary h-11 flex-1 text-xs font-bold"
                >
                  Publish Shoppable Reel
                </button>
                <button
                  type="button"
                  onClick={() => setNewReelModal(false)}
                  className="btn btn-ghost h-11 px-4 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
