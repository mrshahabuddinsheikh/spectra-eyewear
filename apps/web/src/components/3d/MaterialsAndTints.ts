import * as THREE from 'three';

export interface FrameMaterialConfig {
  id: string;
  name: string;
  category: 'acetate' | 'metal' | 'titanium';
  color: string;
  roughness: number;
  metalness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
}

export interface LensTintConfig {
  id: string;
  name: string;
  color: string;
  transmission: number;
  opacity: number;
  roughness: number;
  metalness: number;
  reflectiveCoat: string;
  badge: string;
  description: string;
}

export const FRAME_MATERIALS: Record<string, FrameMaterialConfig> = {
  'acetate-black': {
    id: 'acetate-black',
    name: 'Polished Black Acetate',
    category: 'acetate',
    color: '#111215',
    roughness: 0.08,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  },
  'acetate-tortoise': {
    id: 'acetate-tortoise',
    name: 'Havana Tortoiseshell',
    category: 'acetate',
    color: '#5c3317',
    roughness: 0.12,
    metalness: 0.05,
    clearcoat: 0.9,
    clearcoatRoughness: 0.15,
  },
  'matte-black': {
    id: 'matte-black',
    name: 'Stealth Matte Black',
    category: 'metal',
    color: '#1c1e24',
    roughness: 0.82,
    metalness: 0.1,
  },
  'brushed-titanium': {
    id: 'brushed-titanium',
    name: 'Brushed Titanium',
    category: 'titanium',
    color: '#8b929a',
    roughness: 0.38,
    metalness: 0.85,
  },
  'royal-gold': {
    id: 'royal-gold',
    name: 'Royal Gold Metal',
    category: 'metal',
    color: '#d4af37',
    roughness: 0.18,
    metalness: 0.95,
  },
  'silver-chrome': {
    id: 'silver-chrome',
    name: 'Silver Chrome',
    category: 'metal',
    color: '#e5e7eb',
    roughness: 0.15,
    metalness: 0.95,
  },
};

export const LENS_TINTS: Record<string, LensTintConfig> = {
  'polarized-uv400': {
    id: 'polarized-uv400',
    name: 'Polarized UV400 Dark',
    color: '#1a221f',
    transmission: 0.35,
    opacity: 0.82,
    roughness: 0.05,
    metalness: 0.2,
    reflectiveCoat: '#2a4d3a',
    badge: '100% Anti-Glare',
    description: 'Eliminates blinding road and water glare under Pakistan’s harsh sunlight.',
  },
  'blue-cut': {
    id: 'blue-cut',
    name: 'Blue-Cut Computer Guard',
    color: '#ebf4ff',
    transmission: 0.92,
    opacity: 0.32,
    roughness: 0.02,
    metalness: 0.05,
    reflectiveCoat: '#4361ee',
    badge: '95% HEV Screen Filter',
    description: 'Filters blue rays from laptops and mobiles to stop headaches and eye strain.',
  },
  'photochromic': {
    id: 'photochromic',
    name: 'Photochromic Smart Transition',
    color: '#374151',
    transmission: 0.55,
    opacity: 0.65,
    roughness: 0.03,
    metalness: 0.15,
    reflectiveCoat: '#6366f1',
    badge: 'Light-to-Dark Reaction',
    description: 'Clear indoors, darkens automatically into sunglasses when stepping into sunlight.',
  },
  'mirror-gradient': {
    id: 'mirror-gradient',
    name: 'Mirror Chrome Gradient',
    color: '#94a3b8',
    transmission: 0.2,
    opacity: 0.92,
    roughness: 0.01,
    metalness: 0.9,
    reflectiveCoat: '#e2e8f0',
    badge: 'VIP Chrome Reflective',
    description: 'High-fashion metallic one-way mirror reflection with privacy.',
  },
};

export type FrameShapeType =
  | 'aviator'
  | 'wayfarer'
  | 'round'
  | 'clubmaster'
  | 'cat-eye'
  | 'hexagonal'
  | 'rimless';

export interface FaceShapeRecommendation {
  shape: 'round' | 'oval' | 'square' | 'diamond';
  label: string;
  idealFrames: FrameShapeType[];
  description: string;
}

export const FACE_SHAPES: FaceShapeRecommendation[] = [
  {
    shape: 'round',
    label: 'Round Face',
    idealFrames: ['wayfarer', 'hexagonal', 'clubmaster'],
    description: 'Angular & geometric frames add sharp contrast to softer facial curves and define cheekbones.',
  },
  {
    shape: 'oval',
    label: 'Oval Face',
    idealFrames: ['wayfarer', 'aviator', 'cat-eye', 'round', 'hexagonal', 'rimless', 'clubmaster'],
    description: 'Naturally balanced proportions. Almost every frame shape complements your facial features!',
  },
  {
    shape: 'square',
    label: 'Square Face',
    idealFrames: ['round', 'aviator', 'cat-eye'],
    description: 'Curved, circular, and teardrop frames soften a strong angular jawline and broad forehead.',
  },
  {
    shape: 'diamond',
    label: 'Diamond Face',
    idealFrames: ['clubmaster', 'cat-eye', 'oval' as any],
    description: 'Browline and upswept frames balance dramatic cheekbones and bring subtle focus to the eyes.',
  },
];
