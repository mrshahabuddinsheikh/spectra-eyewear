'use client';

import React from 'react';
import { FrameShapeType, FRAME_MATERIALS, LENS_TINTS } from '../3d/MaterialsAndTints';

interface GlassesOverlayRendererProps {
  frameShape: FrameShapeType;
  materialKey: string;
  lensKey: string;
  width?: number; // base width in pixels
  className?: string;
  style?: React.CSSProperties;
}

export function GlassesOverlayRenderer({
  frameShape,
  materialKey,
  lensKey,
  width = 320,
  className = '',
  style = {},
}: GlassesOverlayRendererProps) {
  const mat = FRAME_MATERIALS[materialKey] || FRAME_MATERIALS['acetate-black'];
  const lens = LENS_TINTS[lensKey] || LENS_TINTS['polarized-uv400'];

  // Dimensions & scale ratio
  const height = width * 0.42;
  const frameColor = mat.color;
  const isMetal = mat.category === 'metal' || mat.category === 'titanium';
  const rimStroke = isMetal ? 3 : 7;
  const accentColor = isMetal ? mat.color : '#d4af37';

  // Lens opacity and color
  const lensFill = lens.color;
  const lensOpacity = lens.id === 'blue-cut' ? 0.35 : lens.id === 'mirror-gradient' ? 0.88 : 0.8;
  const glareColor = lens.id === 'blue-cut' ? 'rgba(67, 97, 238, 0.4)' : 'rgba(255, 255, 255, 0.35)';

  const renderShapePaths = () => {
    switch (frameShape) {
      case 'round':
        return (
          <>
            {/* Left Lens & Rim */}
            <circle cx="85" cy="50" r="36" fill={lensFill} fillOpacity={lensOpacity} />
            <circle cx="85" cy="50" r="36" fill="url(#glare-gradient)" fillOpacity={0.6} />
            <circle cx="85" cy="50" r="36" stroke={frameColor} strokeWidth={rimStroke} fill="none" />

            {/* Right Lens & Rim */}
            <circle cx="215" cy="50" r="36" fill={lensFill} fillOpacity={lensOpacity} />
            <circle cx="215" cy="50" r="36" fill="url(#glare-gradient)" fillOpacity={0.6} />
            <circle cx="215" cy="50" r="36" stroke={frameColor} strokeWidth={rimStroke} fill="none" />

            {/* Arched Keyhole Bridge */}
            <path d="M 121 48 Q 150 38 179 48" stroke={accentColor} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 124 53 Q 150 46 176 53" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        );

      case 'aviator':
        return (
          <>
            {/* Left Teardrop Lens & Rim */}
            <path
              d="M 48 30 C 75 22, 115 24, 122 36 C 128 46, 120 74, 92 78 C 65 80, 42 66, 44 48 Z"
              fill={lensFill}
              fillOpacity={lensOpacity}
            />
            <path
              d="M 48 30 C 75 22, 115 24, 122 36 C 128 46, 120 74, 92 78 C 65 80, 42 66, 44 48 Z"
              fill="url(#glare-gradient)"
              fillOpacity={0.6}
            />
            <path
              d="M 48 30 C 75 22, 115 24, 122 36 C 128 46, 120 74, 92 78 C 65 80, 42 66, 44 48 Z"
              stroke={frameColor}
              strokeWidth="3.5"
              fill="none"
              strokeLinejoin="round"
            />

            {/* Right Teardrop Lens & Rim */}
            <path
              d="M 252 30 C 225 22, 185 24, 178 36 C 172 46, 180 74, 208 78 C 235 80, 258 66, 256 48 Z"
              fill={lensFill}
              fillOpacity={lensOpacity}
            />
            <path
              d="M 252 30 C 225 22, 185 24, 178 36 C 172 46, 180 74, 208 78 C 235 80, 258 66, 256 48 Z"
              fill="url(#glare-gradient)"
              fillOpacity={0.6}
            />
            <path
              d="M 252 30 C 225 22, 185 24, 178 36 C 172 46, 180 74, 208 78 C 235 80, 258 66, 256 48 Z"
              stroke={frameColor}
              strokeWidth="3.5"
              fill="none"
              strokeLinejoin="round"
            />

            {/* Aviator Double Bridge (Top Brow Bar + Curved Lower Bridge) */}
            <line x1="110" y1="26" x2="190" y2="26" stroke={frameColor} strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 118 36 Q 150 30 182 36" stroke={frameColor} strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        );

      case 'clubmaster':
        return (
          <>
            {/* Left Clubmaster: Heavy Acetate Brow + Metal Lower Rim */}
            <path d="M 44 26 C 65 22, 110 24, 126 36 L 126 44 C 105 40, 60 38, 44 42 Z" fill={frameColor} />
            <path
              d="M 48 40 C 46 68, 85 78, 112 76 C 122 74, 126 60, 125 40 Z"
              fill={lensFill}
              fillOpacity={lensOpacity}
            />
            <path
              d="M 48 40 C 46 68, 85 78, 112 76 C 122 74, 126 60, 125 40 Z"
              stroke={accentColor}
              strokeWidth="2.5"
              fill="none"
            />
            {/* Left Temple Accent Pin */}
            <rect x="42" y="28" width="5" height="3" rx="1" fill={accentColor} />

            {/* Right Clubmaster */}
            <path d="M 256 26 C 235 22, 190 24, 174 36 L 174 44 C 195 40, 240 38, 256 42 Z" fill={frameColor} />
            <path
              d="M 252 40 C 254 68, 215 78, 188 76 C 178 74, 174 60, 175 40 Z"
              fill={lensFill}
              fillOpacity={lensOpacity}
            />
            <path
              d="M 252 40 C 254 68, 215 78, 188 76 C 178 74, 174 60, 175 40 Z"
              stroke={accentColor}
              strokeWidth="2.5"
              fill="none"
            />
            {/* Right Temple Accent Pin */}
            <rect x="253" y="28" width="5" height="3" rx="1" fill={accentColor} />

            {/* Vintage Golden Keyhole Bridge */}
            <path d="M 125 36 Q 150 28 175 36" stroke={accentColor} strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        );

      case 'cat-eye':
        return (
          <>
            {/* Left Flared Cat-Eye */}
            <path
              d="M 36 18 C 70 20, 112 25, 124 38 C 122 65, 80 78, 55 68 C 40 60, 32 40, 36 18 Z"
              fill={lensFill}
              fillOpacity={lensOpacity}
            />
            <path
              d="M 36 18 C 70 20, 112 25, 124 38 C 122 65, 80 78, 55 68 C 40 60, 32 40, 36 18 Z"
              fill="url(#glare-gradient)"
              fillOpacity={0.6}
            />
            <path
              d="M 36 18 C 70 20, 112 25, 124 38 C 122 65, 80 78, 55 68 C 40 60, 32 40, 36 18 Z"
              stroke={frameColor}
              strokeWidth={rimStroke + 1}
              fill="none"
              strokeLinejoin="round"
            />

            {/* Right Flared Cat-Eye */}
            <path
              d="M 264 18 C 230 20, 188 25, 176 38 C 178 65, 220 78, 245 68 C 260 60, 268 40, 264 18 Z"
              fill={lensFill}
              fillOpacity={lensOpacity}
            />
            <path
              d="M 264 18 C 230 20, 188 25, 176 38 C 178 65, 220 78, 245 68 C 260 60, 268 40, 264 18 Z"
              fill="url(#glare-gradient)"
              fillOpacity={0.6}
            />
            <path
              d="M 264 18 C 230 20, 188 25, 176 38 C 178 65, 220 78, 245 68 C 260 60, 268 40, 264 18 Z"
              stroke={frameColor}
              strokeWidth={rimStroke + 1}
              fill="none"
              strokeLinejoin="round"
            />

            {/* Center Bridge */}
            <path d="M 124 38 Q 150 32 176 38" stroke={frameColor} strokeWidth="4.5" fill="none" strokeLinecap="round" />
          </>
        );

      case 'hexagonal':
        return (
          <>
            {/* Left Hexagon */}
            <polygon
              points="85,16 118,32 118,68 85,84 52,68 52,32"
              fill={lensFill}
              fillOpacity={lensOpacity}
            />
            <polygon
              points="85,16 118,32 118,68 85,84 52,68 52,32"
              fill="url(#glare-gradient)"
              fillOpacity={0.6}
            />
            <polygon
              points="85,16 118,32 118,68 85,84 52,68 52,32"
              stroke={frameColor}
              strokeWidth="3.5"
              fill="none"
              strokeLinejoin="round"
            />

            {/* Right Hexagon */}
            <polygon
              points="215,16 248,32 248,68 215,84 182,68 182,32"
              fill={lensFill}
              fillOpacity={lensOpacity}
            />
            <polygon
              points="215,16 248,32 248,68 215,84 182,68 182,32"
              fill="url(#glare-gradient)"
              fillOpacity={0.6}
            />
            <polygon
              points="215,16 248,32 248,68 215,84 182,68 182,32"
              stroke={frameColor}
              strokeWidth="3.5"
              fill="none"
              strokeLinejoin="round"
            />

            {/* Laser-cut Bridge */}
            <path d="M 118 48 L 182 48" stroke={frameColor} strokeWidth="3.5" strokeLinecap="round" />
          </>
        );

      case 'rimless':
        return (
          <>
            {/* Left Floating Lens */}
            <rect x="52" y="24" width="70" height="52" rx="14" fill={lensFill} fillOpacity={lensOpacity} />
            <rect x="52" y="24" width="70" height="52" rx="14" fill="url(#glare-gradient)" fillOpacity={0.5} />
            <rect x="52" y="24" width="70" height="52" rx="14" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
            {/* Left Micro Titanium Mounts */}
            <circle cx="56" cy="38" r="2.5" fill={accentColor} />
            <circle cx="118" cy="38" r="2.5" fill={accentColor} />

            {/* Right Floating Lens */}
            <rect x="178" y="24" width="70" height="52" rx="14" fill={lensFill} fillOpacity={lensOpacity} />
            <rect x="178" y="24" width="70" height="52" rx="14" fill="url(#glare-gradient)" fillOpacity={0.5} />
            <rect x="178" y="24" width="70" height="52" rx="14" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
            {/* Right Micro Titanium Mounts */}
            <circle cx="182" cy="38" r="2.5" fill={accentColor} />
            <circle cx="244" cy="38" r="2.5" fill={accentColor} />

            {/* Arched Beta-Titanium Floating Bridge */}
            <path d="M 118 38 Q 150 28 182 38" stroke={accentColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        );

      case 'wayfarer':
      default:
        return (
          <>
            {/* Left Trapezoid Lens & Rim */}
            <path
              d="M 44 24 L 126 26 L 120 74 C 118 80, 56 80, 50 72 Z"
              fill={lensFill}
              fillOpacity={lensOpacity}
            />
            <path
              d="M 44 24 L 126 26 L 120 74 C 118 80, 56 80, 50 72 Z"
              fill="url(#glare-gradient)"
              fillOpacity={0.6}
            />
            <path
              d="M 44 24 L 126 26 L 120 74 C 118 80, 56 80, 50 72 Z"
              stroke={frameColor}
              strokeWidth={rimStroke}
              fill="none"
              strokeLinejoin="round"
            />
            {/* Silver Temple Accent Pin */}
            <rect x="38" y="28" width="6" height="3" rx="1" fill={accentColor} />

            {/* Right Trapezoid Lens & Rim */}
            <path
              d="M 256 24 L 174 26 L 180 74 C 182 80, 244 80, 250 72 Z"
              fill={lensFill}
              fillOpacity={lensOpacity}
            />
            <path
              d="M 256 24 L 174 26 L 180 74 C 182 80, 244 80, 250 72 Z"
              fill="url(#glare-gradient)"
              fillOpacity={0.6}
            />
            <path
              d="M 256 24 L 174 26 L 180 74 C 182 80, 244 80, 250 72 Z"
              stroke={frameColor}
              strokeWidth={rimStroke}
              fill="none"
              strokeLinejoin="round"
            />
            {/* Silver Temple Accent Pin */}
            <rect x="256" y="28" width="6" height="3" rx="1" fill={accentColor} />

            {/* Sculpted Bridge */}
            <path d="M 124 30 Q 150 24 176 30" stroke={frameColor} strokeWidth="7" fill="none" strokeLinecap="round" />
          </>
        );
    }
  };

  return (
    <div
      className={`relative select-none pointer-events-none filter drop-shadow-xl ${className}`}
      style={{ width: `${width}px`, height: `${height}px`, ...style }}
    >
      <svg
        viewBox="0 0 300 110"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Glass Glare Sheen Reflection Gradient */}
          <linearGradient id="glare-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={glareColor} stopOpacity="0.8" />
            <stop offset="30%" stopColor={glareColor} stopOpacity="0.2" />
            <stop offset="70%" stopColor="transparent" stopOpacity="0" />
            <stop offset="100%" stopColor={glareColor} stopOpacity="0.4" />
          </linearGradient>

          {/* Acetate Tortoise Specular */}
          <radialGradient id="tortoise-pat" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8a4b1f" />
            <stop offset="50%" stopColor="#4a260f" />
            <stop offset="100%" stopColor="#1e0f06" />
          </radialGradient>
        </defs>

        {/* 1. Left Temple (Stem Hinge) */}
        <path d="M 38 28 L 10 24" stroke={frameColor} strokeWidth="5.5" strokeLinecap="round" />

        {/* 2. Right Temple (Stem Hinge) */}
        <path d="M 262 28 L 290 24" stroke={frameColor} strokeWidth="5.5" strokeLinecap="round" />

        {/* 3. Main Rims, Lenses & Bridge */}
        {renderShapePaths()}

        {/* 4. Subtle Specular Highlight Pinpoint */}
        <circle cx="75" cy="35" r="2.5" fill="#ffffff" fillOpacity="0.75" />
        <circle cx="205" cy="35" r="2.5" fill="#ffffff" fillOpacity="0.75" />
      </svg>
    </div>
  );
}
