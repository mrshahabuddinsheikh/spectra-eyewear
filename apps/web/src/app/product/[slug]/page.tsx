import React from 'react';
import { fetchProductBySlug, fetchProducts } from '../../../lib/api';
import { notFound } from 'next/navigation';
import { ProceduralGlassesCanvas } from '../../../components/3d/ProceduralGlassesCanvas';
import { FRAME_MATERIALS, LENS_TINTS, FrameShapeType } from '../../../components/3d/MaterialsAndTints';
import { ProductTryOnButton } from '../../../components/try-on/ProductTryOnButton';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const frameShape = (product.frameShape as FrameShapeType) || 'wayfarer';
  const materialKey = 'acetate-black';
  const lensKey = 'polarized-uv400';

  return (
    <div className="space-y-12 pb-16 pt-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: 3D Live Viewport (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-strong rounded-[36px] p-2 border border-white/60 dark:border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 glass rounded-full px-3 py-1 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span>Real-Time 3D Procedural View</span>
            </div>

            <ProceduralGlassesCanvas
              frameShape={frameShape}
              materialKey={materialKey}
              lensKey={lensKey}
              autoRotate={true}
              className="h-[420px] sm:h-[480px] w-full"
            />
          </div>

          <div className="p-4 glass rounded-2xl flex items-center justify-between text-xs text-muted">
            <span>Drag around with your finger or mouse to inspect optical hinges and curvature.</span>
            <Link href="/customizer" className="text-accent font-bold hover:underline shrink-0">
              Open Full 3D Studio →
            </Link>
          </div>
        </div>

        {/* Right Column: Product Details & Purchase (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass rounded-[32px] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-accent text-white px-2.5 py-0.5 text-xs font-bold uppercase">
                {product.frameShape}
              </span>
              {product.isBestseller && (
                <span className="rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 text-xs font-bold">
                  Bestseller
                </span>
              )}
            </div>

            <h1 className="text-3xl font-black text-ink">{product.name}</h1>
            <p className="text-xs text-muted leading-relaxed">{product.tagline}</p>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-black text-ink">
                Rs. {product.basePrice.toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm line-through text-muted">
                  Rs. {product.compareAtPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Cash on Delivery Available
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-black/5 dark:border-white/5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted">Frame Silhouette:</span>
                <span className="font-bold text-ink capitalize">{product.frameShape}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Material Build:</span>
                <span className="font-bold text-ink capitalize">{product.frameMaterial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Face Shape Compatibility:</span>
                <span className="font-bold text-ink capitalize">{product.recommendedFaceShapes || 'Universal'}</span>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <ProductTryOnButton
                product={product}
                frameShape={frameShape}
                className="btn btn-primary h-14 w-full text-base font-bold shadow-lg flex items-center justify-center gap-2"
              />
              <Link
                href="/customizer"
                className="btn btn-glass h-12 w-full text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>Customize Colors & Lenses in 3D</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/checkout"
                className="btn btn-ghost h-11 w-full text-xs font-semibold flex items-center justify-center gap-2"
              >
                <span>⚡ Express 1-Page COD Checkout</span>
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="space-y-2 text-[11px] text-muted pt-3 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>Free delivery across Pakistan on orders over Rs. 3,000</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Open box inspection with rider before cash payment</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-accent-2 shrink-0" />
                <span>7-Day doorstep replacement guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
