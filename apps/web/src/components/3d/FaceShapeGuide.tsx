'use client';

import React from 'react';
import { FACE_SHAPES, FaceShapeRecommendation, FrameShapeType } from './MaterialsAndTints';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface FaceShapeGuideProps {
  selectedFaceShape: string;
  currentFrameShape: FrameShapeType;
  onSelectFaceShape: (shape: 'round' | 'oval' | 'square' | 'diamond') => void;
  onSelectRecommendedFrame: (shape: FrameShapeType) => void;
}

export function FaceShapeGuide({
  selectedFaceShape,
  currentFrameShape,
  onSelectFaceShape,
  onSelectRecommendedFrame,
}: FaceShapeGuideProps) {
  const activeRec = FACE_SHAPES.find((f) => f.shape === selectedFaceShape) || FACE_SHAPES[0];
  const isOptimalFit = activeRec.idealFrames.includes(currentFrameShape);

  return (
    <div className="glass rounded-[24px] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-bold tracking-tight">AI Face Shape Fit Guide</h3>
        </div>
        {isOptimalFit ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ideal Dimension Match
          </span>
        ) : (
          <span className="text-xs text-muted font-medium">Pick your shape</span>
        )}
      </div>

      {/* Face Shape Tabs */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {FACE_SHAPES.map((f) => {
          const isActive = f.shape === selectedFaceShape;
          return (
            <button
              key={f.shape}
              onClick={() => onSelectFaceShape(f.shape)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl border text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-accent text-white border-accent shadow-md scale-[1.02]'
                  : 'bg-white/40 dark:bg-slate-900/40 border-black/5 dark:border-white/10 hover:bg-white/80 dark:hover:bg-slate-800/80 text-muted'
              }`}
            >
              <span>{f.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Recommendation Card */}
      <div className="rounded-xl bg-white/60 dark:bg-slate-900/50 p-3 border border-black/5 dark:border-white/5 text-xs">
        <p className="text-muted leading-relaxed mb-2.5">{activeRec.description}</p>
        
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-ink">Recommended for you:</span>
          {activeRec.idealFrames.map((frameKey) => {
            const isCurrent = frameKey === currentFrameShape;
            return (
              <button
                key={frameKey}
                onClick={() => onSelectRecommendedFrame(frameKey)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                  isCurrent
                    ? 'bg-accent/15 text-accent border border-accent/30 font-bold'
                    : 'bg-black/5 dark:bg-white/10 text-muted hover:text-ink'
                }`}
              >
                {frameKey} {isCurrent && '✓'}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
