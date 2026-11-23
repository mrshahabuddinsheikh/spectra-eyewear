'use client';

import React, { useState } from 'react';
import { ProceduralGlassesCanvas } from './ProceduralGlassesCanvas';
import { FaceShapeGuide } from './FaceShapeGuide';
import { FRAME_MATERIALS, LENS_TINTS, FrameShapeType } from './MaterialsAndTints';
import { VirtualTryOnModal } from '../try-on/VirtualTryOnModal';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Layers,
  RotateCw,
  Box,
  ShoppingCart,
  Zap,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Camera,
} from 'lucide-react';

const SHAPES: { key: FrameShapeType; label: string; icon: string }[] = [
  { key: 'wayfarer', label: 'Wayfarer', icon: '🕶️' },
  { key: 'aviator', label: 'Aviator', icon: '✈️' },
  { key: 'round', label: 'Round Classic', icon: '⭕' },
  { key: 'clubmaster', label: 'Clubmaster', icon: '🎩' },
  { key: 'cat-eye', label: 'Cat-Eye', icon: '🐱' },
  { key: 'hexagonal', label: 'Hexagonal', icon: '🔷' },
  { key: 'rimless', label: 'Rimless Titanium', icon: '✨' },
];

export function CustomizerUI() {
  const [frameShape, setFrameShape] = useState<FrameShapeType>('wayfarer');
  const [materialKey, setMaterialKey] = useState<string>('acetate-black');
  const [lensKey, setLensKey] = useState<string>('polarized-uv400');
  const [selectedFaceShape, setSelectedFaceShape] = useState<'round' | 'oval' | 'square' | 'diamond'>('round');
  const [isExploded, setIsExploded] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showTryOn, setShowTryOn] = useState(false);

  const { addItem } = useCart();
  const router = useRouter();

  // Price calculations
  const basePrices: Record<FrameShapeType, number> = {
    wayfarer: 2999,
    aviator: 3499,
    round: 3199,
    clubmaster: 3699,
    'cat-eye': 3899,
    hexagonal: 3599,
    rimless: 4499,
  };

  const materialUpgrades: Record<string, number> = {
    'acetate-black': 0,
    'acetate-tortoise': 300,
    'matte-black': 0,
    'brushed-titanium': 600,
    'royal-gold': 500,
    'silver-chrome': 400,
  };

  const lensUpgrades: Record<string, number> = {
    'polarized-uv400': 0,
    'blue-cut': 400,
    photochromic: 700,
    'mirror-gradient': 500,
  };

  const basePrice = basePrices[frameShape] || 2999;
  const matUpgrade = materialUpgrades[materialKey] || 0;
  const lensUpgrade = lensUpgrades[lensKey] || 0;
  const currentTotal = basePrice + matUpgrade + lensUpgrade;
  const compareAtPrice = Math.round(currentTotal * 1.45);

  const activeMaterial = FRAME_MATERIALS[materialKey];
  const activeLens = LENS_TINTS[lensKey];

  const handleAddToCart = () => {
    addItem({
      name: `Custom 3D ${frameShape.toUpperCase()} (${activeMaterial.name})`,
      frameShape,
      frameMaterial: activeMaterial.name,
      lensTint: activeLens.name,
      frameColor: activeMaterial.color,
      price: currentTotal,
      quantity: 1,
    });
  };

  const handleExpressBuy = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 3D Canvas Viewport (7 Cols) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="glass relative rounded-[32px] p-2 overflow-hidden border border-white/60 dark:border-white/10 shadow-2xl">
          {/* Live Camera Try-On Floating Pill */}
          <button
            onClick={() => setShowTryOn(true)}
            className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-purple-600 to-accent text-white px-4 py-2 text-xs font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <Camera className="w-4 h-4 animate-pulse" />
            <span>📸 Live Camera Try-On</span>
          </button>

          {/* Top Floating Controls */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 glass rounded-full p-1.5 shadow-md">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title="Toggle Auto Spin"
              className={`p-2 rounded-full transition-all text-xs font-semibold flex items-center gap-1 ${
                autoRotate ? 'bg-accent text-white shadow-sm' : 'hover:bg-black/5 dark:hover:bg-white/10 text-muted'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
              <span className="hidden sm:inline">Spin</span>
            </button>

            <button
              onClick={() => setIsExploded(!isExploded)}
              title="Toggle Exploded Technical Optics View"
              className={`p-2 rounded-full transition-all text-xs font-semibold flex items-center gap-1 ${
                isExploded ? 'bg-accent text-white shadow-sm' : 'hover:bg-black/5 dark:hover:bg-white/10 text-muted'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Explode</span>
            </button>

            <button
              onClick={() => setWireframe(!wireframe)}
              title="Toggle CAD Wireframe Mesh"
              className={`p-2 rounded-full transition-all text-xs font-semibold flex items-center gap-1 ${
                wireframe ? 'bg-accent text-white shadow-sm' : 'hover:bg-black/5 dark:hover:bg-white/10 text-muted'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CAD</span>
            </button>
          </div>

          {/* 3D Render Canvas */}
          <ProceduralGlassesCanvas
            frameShape={frameShape}
            materialKey={materialKey}
            lensKey={lensKey}
            isExploded={isExploded}
            wireframe={wireframe}
            autoRotate={autoRotate}
            className="h-[400px] sm:h-[480px] w-full"
          />

          {/* Bottom Live Specs Bar */}
          <div className="p-4 border-t border-black/5 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 rounded-b-[28px] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-ink">Specs:</span>
              <span className="text-muted">Shape: <strong className="text-ink capitalize">{frameShape}</strong></span>
              <span className="text-muted">Material: <strong className="text-ink">{activeMaterial.name}</strong></span>
              <span className="text-muted">Lenses: <strong className="text-ink">{activeLens.name}</strong></span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Hand-Crafted Optical Grade</span>
            </div>
          </div>
        </div>

        {/* Face Shape Fit Guide */}
        <FaceShapeGuide
          selectedFaceShape={selectedFaceShape}
          currentFrameShape={frameShape}
          onSelectFaceShape={setSelectedFaceShape}
          onSelectRecommendedFrame={setFrameShape}
        />
      </div>

      {/* Customizer Controls Panel (5 Cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Title & Dynamic Pricing */}
        <div className="glass rounded-[28px] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-full bg-accent/10 text-accent px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase">
              Procedural 3D Engine
            </span>
            <span className="text-xs text-muted">Zero GLTF Download Lag</span>
          </div>

          <h2 className="text-2xl font-black capitalize tracking-tight mt-1 text-ink">
            {frameShape} Signature Custom
          </h2>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-black text-ink">Rs. {currentTotal.toLocaleString()}</span>
            <span className="text-sm line-through text-muted">Rs. {compareAtPrice.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Save Rs. {(compareAtPrice - currentTotal).toLocaleString()}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
            <Truck className="w-3.5 h-3.5 text-accent" />
            <span>Eligible for <strong>Free Cash on Delivery</strong> across Pakistan</span>
          </div>
        </div>

        {/* 1. Frame Shape Selector */}
        <div className="glass rounded-[28px] p-6 shadow-sm">
          <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-3">
            Step 1: Choose Frame Silhouette
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SHAPES.map((s) => {
              const isSelected = frameShape === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setFrameShape(s.key)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-ink text-white border-ink shadow-md scale-[1.02]'
                      : 'bg-white/50 dark:bg-slate-900/40 border-black/5 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800 text-ink'
                  }`}
                >
                  <span className="text-base">{s.icon}</span>
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Frame Material Selector */}
        <div className="glass rounded-[28px] p-6 shadow-sm">
          <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-3">
            Step 2: Frame Material & Finish
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {Object.values(FRAME_MATERIALS).map((mat) => {
              const isSelected = materialKey === mat.id;
              const extra = materialUpgrades[mat.id] || 0;
              return (
                <button
                  key={mat.id}
                  onClick={() => setMaterialKey(mat.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-accent bg-accent/5 dark:bg-accent/10 ring-2 ring-accent/20'
                      : 'border-black/5 dark:border-white/10 bg-white/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-black/20 shrink-0 shadow-sm"
                    style={{ backgroundColor: mat.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-ink truncate">{mat.name}</p>
                    <p className="text-[11px] text-muted">{extra > 0 ? `+ Rs. ${extra}` : 'Included'}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Lens Technology Selector */}
        <div className="glass rounded-[28px] p-6 shadow-sm">
          <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-3">
            Step 3: Lens Tint & Protection Tech
          </label>
          <div className="space-y-2.5">
            {Object.values(LENS_TINTS).map((lens) => {
              const isSelected = lensKey === lens.id;
              const extra = lensUpgrades[lens.id] || 0;
              return (
                <div
                  key={lens.id}
                  onClick={() => setLensKey(lens.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-accent bg-accent/5 dark:bg-accent/10 ring-2 ring-accent/20'
                      : 'border-black/5 dark:border-white/10 bg-white/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: lens.color, border: '1px solid rgba(0,0,0,0.2)' }} />
                      <span className="text-xs font-bold text-ink">{lens.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-accent">
                      {extra > 0 ? `+ Rs. ${extra}` : 'Standard'}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">{lens.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full text-ink">
                      {lens.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowTryOn(true)}
            className="btn btn-glass h-13 w-full text-sm font-bold flex items-center justify-center gap-2 border-accent/40 text-accent hover:bg-accent/10 shadow-md"
          >
            <Camera className="w-4 h-4 text-accent animate-pulse" />
            <span>📸 Try on My Face in Real-Time (Live Camera)</span>
          </button>

          <button
            onClick={handleExpressBuy}
            className="btn btn-primary h-14 w-full text-base font-bold shadow-lg flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5 fill-white" />
            <span>⚡ Express Buy COD (Rs. {currentTotal.toLocaleString()})</span>
          </button>

          <button
            onClick={handleAddToCart}
            className="btn btn-glass h-12 w-full text-sm font-semibold flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart & Continue Shopping</span>
          </button>
        </div>
      </div>

      {/* Live AR Camera Virtual Try-On Modal */}
      <VirtualTryOnModal
        isOpen={showTryOn}
        onClose={() => setShowTryOn(false)}
        initialShape={frameShape}
        initialMaterial={materialKey}
        initialLens={lensKey}
      />
    </div>
  );
}
