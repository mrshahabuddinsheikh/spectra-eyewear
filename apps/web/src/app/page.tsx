import React from 'react';
import Link from 'next/link';
import { fetchProducts, fetchReels } from '../lib/api';
import { CustomizerUI } from '../components/3d/CustomizerUI';
import { ShoppableReels } from '../components/reels/ShoppableReels';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  Eye,
  Star,
  CheckCircle2,
  Play,
  RotateCw,
} from 'lucide-react';

export default async function HomePage() {
  const [products, reels] = await Promise.all([
    fetchProducts(),
    fetchReels(),
  ]);

  return (
    <div className="space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="pt-4 sm:pt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column Text (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <span>New · 2026 Procedural 3D Eyewear Atelier</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.03] text-ink">
            See flawlessly.<br />
            <span className="heading-gradient">Turn every head.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
            Architectural eyewear tailored for South Asian bridge profiles. Spin your custom frame in procedural 3D, tap to buy from TikTok reels, and pay <strong>Cash on Delivery</strong> across Pakistan.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/customizer"
              className="btn btn-primary h-14 px-8 text-base font-bold shadow-xl flex items-center gap-2"
            >
              <RotateCw className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Launch 3D Customizer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#reels"
              className="btn btn-glass h-14 px-6 text-sm font-semibold flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Watch Shoppable Reels</span>
            </Link>
          </div>

          {/* Quick Pakistan COD Trust Badges */}
          <div className="pt-4 flex flex-wrap items-center gap-2.5 text-xs font-semibold text-muted">
            <span className="glass flex items-center gap-1.5 rounded-full px-3.5 py-1.5">
              <Truck className="w-4 h-4 text-accent" /> Cash on Delivery Nationwide
            </span>
            <span className="glass flex items-center gap-1.5 rounded-full px-3.5 py-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Inspect Before Paying
            </span>
            <span className="glass flex items-center gap-1.5 rounded-full px-3.5 py-1.5">
              <RotateCcw className="w-4 h-4 text-accent-2" /> 7-Day Doorstep Swap
            </span>
          </div>
        </div>

        {/* Right Column: Hero Eyewear Spotlight (5 Cols) */}
        <div className="lg:col-span-5 relative">
          <div className="glass-strong rounded-[36px] p-6 shadow-2xl border border-white/60 dark:border-white/10 relative overflow-hidden text-center">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-full bg-accent/15 text-accent px-2.5 py-1 text-[11px] font-bold">
              <span>Featured Model</span>
            </div>

            {/* Product Image / 3D Teaser */}
            <div className="relative h-64 sm:h-72 w-full my-4 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
                alt="Wayfarer Bold Acetate"
                className="max-h-full max-w-full object-contain drop-shadow-2xl rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-ink">Wayfarer Bold Acetate</h3>
              <p className="text-xs text-muted">Italian Cellulose Acetate · Polarized UV400 Dark Optics</p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-2xl font-black text-ink">Rs. 2,999</span>
                <span className="text-sm line-through text-muted">Rs. 4,500</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Free COD
                </span>
              </div>

              <div className="pt-3 flex gap-2">
                <Link
                  href="/customizer"
                  className="btn btn-primary h-11 flex-1 text-xs font-bold"
                >
                  Customize in 3D
                </Link>
                <Link
                  href="/checkout"
                  className="btn btn-ghost h-11 px-4 text-xs font-semibold"
                >
                  ⚡ Fast COD
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Procedural 3D Frame & Lens Customizer Studio Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-widest text-accent uppercase">
            Optical Precision Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-ink">
            Procedural 3D Eyewear Studio
          </h2>
          <p className="text-sm text-muted">
            Configure shapes, titanium & acetate finishes, and smart prescription lens tech in real time with zero download latency.
          </p>
        </div>

        <CustomizerUI />
      </section>

      {/* 3. TikTok / Instagram Shoppable Reels Section */}
      <section id="reels" className="space-y-8 pt-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1 text-xs font-bold text-rose-500">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Viral on TikTok & Instagram PK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-ink">
            Shoppable Video Reels
          </h2>
          <p className="text-sm text-muted">
            Watch real Pakistani buyers unbox their frames in 4K. Tap <strong>⚡ Fast Buy COD</strong> to place an order in 1 tap without closing the video!
          </p>
        </div>

        <ShoppableReels reels={reels} />
      </section>

      {/* 4. Curated Bestselling Catalog Grid */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-accent uppercase">
              Handcrafted Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-ink">
              Bestselling Eyewear
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
          >
            <span>Explore All 7 Frame Silhouettes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product: any) => (
            <div
              key={product.id}
              className="glass rounded-[32px] p-5 flex flex-col justify-between border border-white/60 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-0.5 text-[11px] font-bold capitalize text-ink">
                    {product.frameShape}
                  </span>
                  {product.isBestseller && (
                    <span className="rounded-full bg-accent text-white px-2.5 py-0.5 text-[10px] font-bold">
                      Bestseller
                    </span>
                  )}
                </div>

                {/* Image */}
                <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 flex items-center justify-center p-3 mb-4 group-hover:scale-[1.03] transition-transform duration-300">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <h3 className="text-base font-black text-ink leading-snug">{product.name}</h3>
                <p className="text-xs text-muted line-clamp-2 mt-1">{product.tagline}</p>
              </div>

              {/* Price & Action */}
              <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-ink">
                    Rs. {product.basePrice.toLocaleString()}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-xs line-through text-muted ml-2">
                      Rs. {product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/product/${product.slug}`}
                    className="btn btn-ghost h-9 px-3 text-xs font-semibold"
                  >
                    Details
                  </Link>
                  <Link
                    href="/customizer"
                    className="btn btn-primary h-9 px-3 text-xs font-bold"
                  >
                    View in 3D
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Why Pakistani Buyers Love Spectra */}
      <section className="glass rounded-[36px] p-8 sm:p-12 border border-white/60 dark:border-white/10 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center font-black">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-ink">South Asian Bridge Ergonomics</h3>
            <p className="text-xs text-muted leading-relaxed">
              Standard western sunglasses slide down flatter nose bridges. Spectra frames incorporate custom-angled silicone pads and beveled acetate cheeks designed specifically for Pakistani face profiles.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-accent-2 text-white flex items-center justify-center font-black">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-ink">High-Index Blue-Cut Lenses</h3>
            <p className="text-xs text-muted leading-relaxed">
              Block 95% of screen glare from laptops and smartphones. Eliminates dry eyes and late-night insomnia for software engineers, freelancers, and remote workers.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-accent-3 text-white flex items-center justify-center font-black">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-ink">Frictionless 1-Page COD</h3>
            <p className="text-xs text-muted leading-relaxed">
              No credit card or online banking needed. Select your city (Karachi, Lahore, Islamabad, Multan, Faisalabad, etc.) and pay the rider cash when your glasses arrive.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
