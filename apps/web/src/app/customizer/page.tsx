import React from 'react';
import { CustomizerUI } from '../../components/3d/CustomizerUI';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Interactive 3D Eyewear & Lens Customizer · Spectra PK',
  description: 'Design procedural 3D sunglasses and prescription glasses in real time. Customize frame shape, acetate or titanium material, and polarized or blue-cut lens technology.',
};

export default function CustomizerPage() {
  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <div className="inline-flex items-center gap-1.5 glass rounded-full px-3 py-1 text-xs font-bold text-accent mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero GLTF Download · Procedural Geometry Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-ink">
            3D Frame & Lens Customizer
          </h1>
          <p className="text-xs text-muted mt-1">
            Build your bespoke eyewear. Inspect every hinge in 3D or click <strong>📸 Live Camera Try-On</strong> to preview frames live on your face!
          </p>
        </div>

        <Link
          href="/"
          className="btn btn-ghost h-10 px-4 text-xs font-semibold self-start sm:self-auto flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main 3D Customizer Component */}
      <CustomizerUI />
    </div>
  );
}
