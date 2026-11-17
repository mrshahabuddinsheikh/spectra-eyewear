'use client';

import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Eye } from 'lucide-react';

interface PrescriptionUploadProps {
  onPrescriptionChange: (data: {
    type: 'none' | 'file' | 'manual';
    prescriptionUrl?: string;
    prescriptionData?: any;
  }) => void;
}

export function PrescriptionUpload({ onPrescriptionChange }: PrescriptionUploadProps) {
  const [tab, setTab] = useState<'none' | 'file' | 'manual'>('none');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [manualData, setManualData] = useState({
    sphereRight: '-1.00',
    cylinderRight: '-0.25',
    axisRight: '90',
    sphereLeft: '-1.25',
    cylinderLeft: '0.00',
    axisLeft: '0',
    pd: '63mm',
  });

  const handleTabChange = (newTab: 'none' | 'file' | 'manual') => {
    setTab(newTab);
    if (newTab === 'none') {
      onPrescriptionChange({ type: 'none' });
    } else if (newTab === 'file') {
      onPrescriptionChange({ type: 'file', prescriptionUrl: fileUrl || undefined });
    } else {
      onPrescriptionChange({ type: 'manual', prescriptionData: manualData });
    }
  };

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate client image preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setFileUrl(url);
        onPrescriptionChange({ type: 'file', prescriptionUrl: url });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualChange = (field: string, val: string) => {
    const updated = { ...manualData, [field]: val };
    setManualData(updated);
    onPrescriptionChange({ type: 'manual', prescriptionData: updated });
  };

  return (
    <div className="glass rounded-[28px] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-bold text-ink">Prescription & Power Details</h3>
        </div>
        <span className="text-xs text-muted">Optional</span>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-xs font-semibold">
        <button
          type="button"
          onClick={() => handleTabChange('none')}
          className={`py-2 px-2 rounded-xl border transition-all ${
            tab === 'none'
              ? 'bg-ink text-white border-ink'
              : 'bg-white/40 dark:bg-slate-900/40 border-black/5 dark:border-white/10 text-muted hover:text-ink'
          }`}
        >
          No Power (0.00)
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('file')}
          className={`py-2 px-2 rounded-xl border transition-all ${
            tab === 'file'
              ? 'bg-ink text-white border-ink'
              : 'bg-white/40 dark:bg-slate-900/40 border-black/5 dark:border-white/10 text-muted hover:text-ink'
          }`}
        >
          Upload Slip
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('manual')}
          className={`py-2 px-2 rounded-xl border transition-all ${
            tab === 'manual'
              ? 'bg-ink text-white border-ink'
              : 'bg-white/40 dark:bg-slate-900/40 border-black/5 dark:border-white/10 text-muted hover:text-ink'
          }`}
        >
          Enter Values
        </button>
      </div>

      {/* Tab: None */}
      {tab === 'none' && (
        <p className="text-xs text-muted leading-relaxed">
          Your glasses will be crafted with plano (zero-power) lenses with the coating you selected (e.g. Polarized UV400, Blue-Cut, or Transition).
        </p>
      )}

      {/* Tab: File Upload */}
      {tab === 'file' && (
        <div className="space-y-3">
          <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-black/15 dark:border-white/15 bg-white/30 dark:bg-slate-900/30 hover:bg-white/60 dark:hover:bg-slate-800/60 cursor-pointer transition-all">
            <UploadCloud className="w-8 h-8 text-accent mb-2" />
            <span className="text-xs font-bold text-ink">Upload Doctor Prescription Slip</span>
            <span className="text-[11px] text-muted mt-0.5">PNG, JPG, or PDF photo of your slip</span>
            <input type="file" accept="image/*,.pdf" onChange={handleSimulatedUpload} className="hidden" />
          </label>

          {fileUrl && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Prescription attached successfully
              </span>
              <button
                type="button"
                onClick={() => {
                  setFileUrl(null);
                  onPrescriptionChange({ type: 'file', prescriptionUrl: undefined });
                }}
                className="text-[11px] underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab: Manual Power Entry */}
      {tab === 'manual' && (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-4 gap-2 text-center font-bold text-muted text-[11px]">
            <span>Eye</span>
            <span>Sphere (SPH)</span>
            <span>Cylinder (CYL)</span>
            <span>Axis (deg)</span>
          </div>

          {/* Right Eye (OD) */}
          <div className="grid grid-cols-4 gap-2 items-center">
            <span className="font-bold text-ink">Right (OD)</span>
            <input
              type="text"
              value={manualData.sphereRight}
              onChange={(e) => handleManualChange('sphereRight', e.target.value)}
              placeholder="-1.00"
              className="h-9 px-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-center text-ink outline-none"
            />
            <input
              type="text"
              value={manualData.cylinderRight}
              onChange={(e) => handleManualChange('cylinderRight', e.target.value)}
              placeholder="-0.25"
              className="h-9 px-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-center text-ink outline-none"
            />
            <input
              type="text"
              value={manualData.axisRight}
              onChange={(e) => handleManualChange('axisRight', e.target.value)}
              placeholder="90"
              className="h-9 px-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-center text-ink outline-none"
            />
          </div>

          {/* Left Eye (OS) */}
          <div className="grid grid-cols-4 gap-2 items-center">
            <span className="font-bold text-ink">Left (OS)</span>
            <input
              type="text"
              value={manualData.sphereLeft}
              onChange={(e) => handleManualChange('sphereLeft', e.target.value)}
              placeholder="-1.25"
              className="h-9 px-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-center text-ink outline-none"
            />
            <input
              type="text"
              value={manualData.cylinderLeft}
              onChange={(e) => handleManualChange('cylinderLeft', e.target.value)}
              placeholder="0.00"
              className="h-9 px-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-center text-ink outline-none"
            />
            <input
              type="text"
              value={manualData.axisLeft}
              onChange={(e) => handleManualChange('axisLeft', e.target.value)}
              placeholder="0"
              className="h-9 px-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-center text-ink outline-none"
            />
          </div>

          {/* Pupil Distance (PD) */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-muted font-medium">Pupillary Distance (PD):</span>
            <input
              type="text"
              value={manualData.pd}
              onChange={(e) => handleManualChange('pd', e.target.value)}
              placeholder="63mm"
              className="w-24 h-9 px-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-center text-ink outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
