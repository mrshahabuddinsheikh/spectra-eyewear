'use client';

import React, { useState } from 'react';
import { VirtualTryOnModal } from './VirtualTryOnModal';
import { FrameShapeType } from '../3d/MaterialsAndTints';
import { Camera } from 'lucide-react';

interface ProductTryOnButtonProps {
  product?: any;
  frameShape?: FrameShapeType;
  materialKey?: string;
  lensKey?: string;
  className?: string;
}

export function ProductTryOnButton({
  product,
  frameShape = 'wayfarer',
  materialKey = 'acetate-black',
  lensKey = 'polarized-uv400',
  className = 'btn btn-primary h-12 w-full text-xs font-bold flex items-center justify-center gap-2 shadow-lg',
}: ProductTryOnButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        <Camera className="w-4 h-4 text-white animate-pulse" />
        <span>📸 Live Camera & Selfie Try-On</span>
      </button>

      <VirtualTryOnModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialProduct={product}
        initialShape={product?.frameShape || frameShape}
        initialMaterial={materialKey}
        initialLens={lensKey}
      />
    </>
  );
}
