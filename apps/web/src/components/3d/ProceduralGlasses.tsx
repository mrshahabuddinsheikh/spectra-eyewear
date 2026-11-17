'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { FRAME_MATERIALS, LENS_TINTS, FrameShapeType } from './MaterialsAndTints';

interface ProceduralGlassesProps {
  frameShape: FrameShapeType;
  materialKey: string;
  lensKey: string;
  isExploded?: boolean;
  wireframe?: boolean;
  autoRotate?: boolean;
}

export function ProceduralGlasses({
  frameShape,
  materialKey,
  lensKey,
  isExploded = false,
  wireframe = false,
  autoRotate = false,
}: ProceduralGlassesProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Auto rotation
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  const materialConfig = FRAME_MATERIALS[materialKey] || FRAME_MATERIALS['acetate-black'];
  const lensConfig = LENS_TINTS[lensKey] || LENS_TINTS['polarized-uv400'];

  // Frame Material
  const frameMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(materialConfig.color),
      roughness: materialConfig.roughness,
      metalness: materialConfig.metalness,
      wireframe,
    });
  }, [materialConfig, wireframe]);

  // Lens Material
  const lensMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(lensConfig.color),
      transmission: lensConfig.transmission,
      opacity: lensConfig.opacity,
      transparent: true,
      roughness: lensConfig.roughness,
      metalness: lensConfig.metalness,
      reflectivity: 0.9,
      ior: 1.52,
      wireframe,
      depthWrite: false,
    });
  }, [lensConfig, wireframe]);

  // Metallic Accents (Hinges, Bridge Screws)
  const accentMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(materialConfig.category === 'metal' ? materialConfig.color : '#d4af37'),
      roughness: 0.2,
      metalness: 0.95,
      wireframe,
    });
  }, [materialConfig, wireframe]);

  // Explode animation offsets
  const leftTempleOffset = isExploded ? [-1.2, 0, -0.6] : [-1.55, 0, -1.0];
  const rightTempleOffset = isExploded ? [1.2, 0, -0.6] : [1.55, 0, -1.0];
  const lensZOffset = isExploded ? 0.9 : 0.02;
  const bridgeYOffset = isExploded ? 0.6 : 0;

  // Render Frame Rim Geometry based on shape
  const renderRimsAndLenses = () => {
    const isRimless = frameShape === 'rimless';

    switch (frameShape) {
      case 'round':
        return (
          <>
            {/* Left Rim & Lens */}
            <group position={[-0.85, 0, 0]}>
              {!isRimless && (
                <mesh material={frameMaterial}>
                  <torusGeometry args={[0.65, 0.05, 16, 48]} />
                </mesh>
              )}
              <mesh material={lensMaterial} position={[0, 0, lensZOffset]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.62, 0.62, 0.02, 36]} />
              </mesh>
            </group>

            {/* Right Rim & Lens */}
            <group position={[0.85, 0, 0]}>
              {!isRimless && (
                <mesh material={frameMaterial}>
                  <torusGeometry args={[0.65, 0.05, 16, 48]} />
                </mesh>
              )}
              <mesh material={lensMaterial} position={[0, 0, lensZOffset]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.62, 0.62, 0.02, 36]} />
              </mesh>
            </group>
          </>
        );

      case 'hexagonal':
        return (
          <>
            {/* Left Rim & Lens */}
            <group position={[-0.88, 0, 0]}>
              <mesh material={frameMaterial} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
                <cylinderGeometry args={[0.68, 0.68, 0.05, 6, 1, true]} />
              </mesh>
              <mesh material={lensMaterial} position={[0, 0, lensZOffset]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
                <cylinderGeometry args={[0.66, 0.66, 0.02, 6]} />
              </mesh>
            </group>

            {/* Right Rim & Lens */}
            <group position={[0.88, 0, 0]}>
              <mesh material={frameMaterial} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
                <cylinderGeometry args={[0.68, 0.68, 0.05, 6, 1, true]} />
              </mesh>
              <mesh material={lensMaterial} position={[0, 0, lensZOffset]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
                <cylinderGeometry args={[0.66, 0.66, 0.02, 6]} />
              </mesh>
            </group>
          </>
        );

      case 'aviator':
        return (
          <>
            {/* Left Teardrop Rim & Lens */}
            <group position={[-0.88, -0.05, 0]} scale={[1, 1.15, 1]}>
              <mesh material={frameMaterial}>
                <torusGeometry args={[0.65, 0.035, 16, 48]} />
              </mesh>
              <mesh material={lensMaterial} position={[0, 0, lensZOffset]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.63, 0.63, 0.015, 36]} />
              </mesh>
            </group>

            {/* Right Teardrop Rim & Lens */}
            <group position={[0.88, -0.05, 0]} scale={[1, 1.15, 1]}>
              <mesh material={frameMaterial}>
                <torusGeometry args={[0.65, 0.035, 16, 48]} />
              </mesh>
              <mesh material={lensMaterial} position={[0, 0, lensZOffset]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.63, 0.63, 0.015, 36]} />
              </mesh>
            </group>

            {/* Aviator Brow Bar (Top bar) */}
            <mesh material={frameMaterial} position={[0, 0.48 + bridgeYOffset, 0]}>
              <boxGeometry args={[1.7, 0.035, 0.035]} />
            </mesh>
          </>
        );

      case 'cat-eye':
        return (
          <>
            {/* Left Flared Rim & Lens */}
            <group position={[-0.88, 0, 0]} rotation={[0, 0, 0.18]} scale={[1.1, 0.85, 1]}>
              <mesh material={frameMaterial}>
                <boxGeometry args={[1.3, 0.9, 0.08]} />
              </mesh>
              <mesh material={lensMaterial} position={[0, 0, lensZOffset]}>
                <boxGeometry args={[1.15, 0.75, 0.02]} />
              </mesh>
            </group>

            {/* Right Flared Rim & Lens */}
            <group position={[0.88, 0, 0]} rotation={[0, 0, -0.18]} scale={[1.1, 0.85, 1]}>
              <mesh material={frameMaterial}>
                <boxGeometry args={[1.3, 0.9, 0.08]} />
              </mesh>
              <mesh material={lensMaterial} position={[0, 0, lensZOffset]}>
                <boxGeometry args={[1.15, 0.75, 0.02]} />
              </mesh>
            </group>
          </>
        );

      case 'clubmaster':
        return (
          <>
            {/* Left Clubmaster */}
            <group position={[-0.88, 0, 0]}>
              {/* Upper Brow Acetate */}
              <mesh material={frameMaterial} position={[0, 0.32, 0]}>
                <boxGeometry args={[1.25, 0.22, 0.09]} />
              </mesh>
              {/* Lower Wire Frame */}
              <mesh material={accentMaterial} position={[0, -0.12, 0]} rotation={[0, 0, -Math.PI]}>
                <torusGeometry args={[0.55, 0.028, 12, 36, Math.PI]} />
              </mesh>
              {/* Lens */}
              <mesh material={lensMaterial} position={[0, 0.02, lensZOffset]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.52, 0.52, 0.02, 32]} />
              </mesh>
            </group>

            {/* Right Clubmaster */}
            <group position={[0.88, 0, 0]}>
              <mesh material={frameMaterial} position={[0, 0.32, 0]}>
                <boxGeometry args={[1.25, 0.22, 0.09]} />
              </mesh>
              <mesh material={accentMaterial} position={[0, -0.12, 0]} rotation={[0, 0, -Math.PI]}>
                <torusGeometry args={[0.55, 0.028, 12, 36, Math.PI]} />
              </mesh>
              <mesh material={lensMaterial} position={[0, 0.02, lensZOffset]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.52, 0.52, 0.02, 32]} />
              </mesh>
            </group>
          </>
        );

      case 'rimless':
        return (
          <>
            {/* Left Minimalist Floating Lens */}
            <group position={[-0.86, 0, 0]}>
              <mesh material={lensMaterial} position={[0, 0, lensZOffset]}>
                <boxGeometry args={[1.2, 0.8, 0.02]} />
              </mesh>
              {/* Micro Titanium Mounts */}
              <mesh material={accentMaterial} position={[0.55, 0.1, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.04, 12]} />
              </mesh>
              <mesh material={accentMaterial} position={[-0.55, 0.1, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.04, 12]} />
              </mesh>
            </group>

            {/* Right Minimalist Floating Lens */}
            <group position={[0.86, 0, 0]}>
              <mesh material={lensMaterial} position={[0, 0, lensZOffset]}>
                <boxGeometry args={[1.2, 0.8, 0.02]} />
              </mesh>
              {/* Micro Titanium Mounts */}
              <mesh material={accentMaterial} position={[-0.55, 0.1, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.04, 12]} />
              </mesh>
              <mesh material={accentMaterial} position={[0.55, 0.1, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.04, 12]} />
              </mesh>
            </group>
          </>
        );

      case 'wayfarer':
      default:
        return (
          <>
            {/* Left Wayfarer Rim & Lens */}
            <group position={[-0.88, 0, 0]}>
              <mesh material={frameMaterial}>
                <boxGeometry args={[1.28, 0.95, 0.08]} />
              </mesh>
              <mesh material={lensMaterial} position={[0, 0, lensZOffset]}>
                <boxGeometry args={[1.1, 0.78, 0.02]} />
              </mesh>
              {/* Silver Temple Accent Pin */}
              <mesh material={accentMaterial} position={[-0.56, 0.36, 0.045]}>
                <boxGeometry args={[0.06, 0.025, 0.01]} />
              </mesh>
            </group>

            {/* Right Wayfarer Rim & Lens */}
            <group position={[0.88, 0, 0]}>
              <mesh material={frameMaterial}>
                <boxGeometry args={[1.28, 0.95, 0.08]} />
              </mesh>
              <mesh material={lensMaterial} position={[0, 0, lensZOffset]}>
                <boxGeometry args={[1.1, 0.78, 0.02]} />
              </mesh>
              {/* Silver Temple Accent Pin */}
              <mesh material={accentMaterial} position={[0.56, 0.36, 0.045]}>
                <boxGeometry args={[0.06, 0.025, 0.01]} />
              </mesh>
            </group>
          </>
        );
    }
  };

  return (
    <group ref={groupRef} dispose={null}>
      {/* 1. Rims & Lenses */}
      {renderRimsAndLenses()}

      {/* 2. Center Bridge */}
      <group position={[0, 0.08 + bridgeYOffset, 0]}>
        <mesh material={frameShape === 'rimless' || frameShape === 'clubmaster' ? accentMaterial : frameMaterial}>
          <boxGeometry args={[0.45, 0.05, 0.04]} />
        </mesh>
      </group>

      {/* 3. Nose Pads */}
      <group position={[-0.2, -0.15, -0.08]}>
        <mesh material={accentMaterial} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.035, 0.035, 0.1, 12]} />
        </mesh>
      </group>
      <group position={[0.2, -0.15, -0.08]}>
        <mesh material={accentMaterial} rotation={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.035, 0.035, 0.1, 12]} />
        </mesh>
      </group>

      {/* 4. Left Temple (Stem) */}
      <group position={leftTempleOffset as any}>
        {/* Hinge */}
        <mesh material={accentMaterial} position={[0, 0.2, 0.95]}>
          <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} />
        </mesh>
        {/* Main Temple Arm */}
        <mesh material={frameMaterial} position={[0, 0.18, 0]}>
          <boxGeometry args={[0.04, 0.08, 1.9]} />
        </mesh>
        {/* Curved Ear Piece */}
        <mesh material={frameMaterial} position={[0, 0.02, -1.05]} rotation={[0.55, 0, 0]}>
          <boxGeometry args={[0.04, 0.07, 0.5]} />
        </mesh>
      </group>

      {/* 5. Right Temple (Stem) */}
      <group position={rightTempleOffset as any}>
        {/* Hinge */}
        <mesh material={accentMaterial} position={[0, 0.2, 0.95]}>
          <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} />
        </mesh>
        {/* Main Temple Arm */}
        <mesh material={frameMaterial} position={[0, 0.18, 0]}>
          <boxGeometry args={[0.04, 0.08, 1.9]} />
        </mesh>
        {/* Curved Ear Piece */}
        <mesh material={frameMaterial} position={[0, 0.02, -1.05]} rotation={[0.55, 0, 0]}>
          <boxGeometry args={[0.04, 0.07, 0.5]} />
        </mesh>
      </group>
    </group>
  );
}
