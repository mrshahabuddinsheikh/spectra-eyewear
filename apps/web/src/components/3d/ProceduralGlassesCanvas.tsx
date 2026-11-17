'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { ProceduralGlasses } from './ProceduralGlasses';
import { FrameShapeType } from './MaterialsAndTints';
import { Sparkles, Rotate3d, Layers, Eye } from 'lucide-react';

interface ProceduralGlassesCanvasProps {
  frameShape: FrameShapeType;
  materialKey: string;
  lensKey: string;
  isExploded?: boolean;
  wireframe?: boolean;
  autoRotate?: boolean;
  className?: string;
}

export function ProceduralGlassesCanvas({
  frameShape,
  materialKey,
  lensKey,
  isExploded = false,
  wireframe = false,
  autoRotate = true,
  className = 'h-[380px] sm:h-[460px] w-full',
}: ProceduralGlassesCanvasProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${className} glass relative flex flex-col items-center justify-center rounded-[28px] overflow-hidden`}>
        <div className="flex items-center gap-2 text-sm font-medium text-muted animate-pulse">
          <Rotate3d className="w-5 h-5 animate-spin text-accent" />
          <span>Synthesizing Procedural 3D Eyewear...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative rounded-[28px] overflow-hidden`}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0.3, 3.4], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.9} color="#88aaff" />
        <pointLight position={[0, -2, 2]} intensity={0.5} />

        <Suspense fallback={null}>
          <group position={[0, -0.1, 0]}>
            <ProceduralGlasses
              frameShape={frameShape}
              materialKey={materialKey}
              lensKey={lensKey}
              isExploded={isExploded}
              wireframe={wireframe}
              autoRotate={autoRotate}
            />
          </group>

          <ContactShadows
            position={[0, -0.85, 0]}
            opacity={0.45}
            scale={5}
            blur={2.4}
            far={1.6}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.8}
          maxDistance={5.5}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 4}
          dampingFactor={0.06}
        />
      </Canvas>

      {/* Floating 3D Interaction Badge */}
      <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-md">
        <Rotate3d className="w-3.5 h-3.5 text-accent animate-spin" style={{ animationDuration: '6s' }} />
        <span>Drag to rotate 360° · Pinch to zoom</span>
      </div>

      {isExploded && (
        <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 rounded-full bg-accent/90 text-white px-3.5 py-1 text-xs font-bold shadow-lg animate-pulse">
          <Layers className="w-3.5 h-3.5" />
          <span>Exploded Optics View Active</span>
        </div>
      )}
    </div>
  );
}
