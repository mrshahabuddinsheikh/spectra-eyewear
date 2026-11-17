'use client';

import React, { useState, useEffect } from 'react';
import { BellRing, Plus, Save, CheckCircle2, Clock } from 'lucide-react';

export default function AdminSocialProofPage() {
  const [settings, setSettings] = useState<any>({
    mode: 'hybrid',
    initialDelayMs: 3000,
    displayDurationMs: 5000,
    rotationIntervalMs: 8000,
    isEnabled: true,
  });
  const [events, setEvents] = useState<any[]>([]);
  const [newCity, setNewCity] = useState('Lahore (DHA)');
  const [newCustomer, setNewCustomer] = useState('Someone');
  const [newProduct, setNewProduct] = useState('Wayfarer Bold Acetate (Polarized)');
  const [newTimeAgo, setNewTimeAgo] = useState('2 minutes ago');
  const [isSaved, setIsSaved] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('spectra_admin_token') : null;

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/v1/admin/social-proof', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
        if (data.events) setEvents(data.events);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/social-proof/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/social-proof/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          city: newCity,
          customerName: newCustomer,
          productName: newProduct,
          timeAgo: newTimeAgo,
        }),
      });

      if (res.ok) {
        fetchSettings();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-ink">Social Proof & Trust Signals</h2>
        <p className="text-xs text-muted">
          Configure real-time floating buyer notifications, timing triggers, and curated regional highlights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings Panel (6 Cols) */}
        <div className="lg:col-span-6 glass rounded-[32px] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-ink uppercase tracking-wider">
              Trigger Configuration
            </h3>
            {isSaved && (
              <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-muted block mb-1">Notification Source Mode</label>
              <select
                value={settings.mode}
                onChange={(e) => setSettings({ ...settings, mode: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
              >
                <option value="hybrid">Hybrid Mode (Real DB Orders + Curated Highlights)</option>
                <option value="auto">Auto Mode (Real Orders Only)</option>
                <option value="custom">Custom Mode (Curated Highlights Only)</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-muted block mb-1">Initial Delay</label>
                <input
                  type="number"
                  value={settings.initialDelayMs}
                  onChange={(e) => setSettings({ ...settings, initialDelayMs: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
                />
                <span className="text-[10px] text-muted">ms</span>
              </div>

              <div>
                <label className="font-semibold text-muted block mb-1">Display Time</label>
                <input
                  type="number"
                  value={settings.displayDurationMs}
                  onChange={(e) => setSettings({ ...settings, displayDurationMs: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
                />
                <span className="text-[10px] text-muted">ms</span>
              </div>

              <div>
                <label className="font-semibold text-muted block mb-1">Rotation Gap</label>
                <input
                  type="number"
                  value={settings.rotationIntervalMs}
                  onChange={(e) => setSettings({ ...settings, rotationIntervalMs: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
                />
                <span className="text-[10px] text-muted">ms</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn btn-primary h-10 px-6 text-xs font-bold flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Timing Rules</span>
              </button>
            </div>
          </form>
        </div>

        {/* Add Custom Highlight (6 Cols) */}
        <div className="lg:col-span-6 glass rounded-[32px] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-ink uppercase tracking-wider">
            Add Custom Regional Notification
          </h3>

          <form onSubmit={handleAddEvent} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-muted block mb-1">City / Region</label>
                <input
                  type="text"
                  placeholder="e.g. Islamabad (F-7)"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-muted block mb-1">Customer Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Fatima"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-muted block mb-1">Product Model & Lens</label>
              <input
                type="text"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-muted block mb-1">Time Elapsed String</label>
              <input
                type="text"
                placeholder="e.g. 3 minutes ago"
                value={newTimeAgo}
                onChange={(e) => setNewTimeAgo(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
              />
            </div>

            <button
              type="submit"
              className="btn btn-ghost h-10 px-6 text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Notification</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
