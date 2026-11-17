'use client';

import React, { useState } from 'react';
import { Database, Download, CheckCircle2, ShieldCheck, FileCode } from 'lucide-react';

export default function AdminBackupPage() {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('spectra_admin_token') : null;

  const handleDownload = async (format: 'sql' | 'json') => {
    setDownloading(true);
    setDownloadSuccess(false);

    try {
      const res = await fetch(`/api/v1/admin/backup/download?format=${format}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Backup download failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spectra_eyewear_backup_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      setDownloadSuccess(true);
    } catch (e) {
      console.warn(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-black text-ink">Bit-for-Bit Database Snapshot</h2>
        <p className="text-xs text-muted">
          Download zero-loss SQL or JSON snapshots of orders, product catalogs, customer prescriptions, and reels.
        </p>
      </div>

      <div className="glass-strong rounded-[32px] p-8 shadow-xl border border-white/60 dark:border-white/10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center font-black">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-ink">MariaDB / MySQL Single-Click Dump</h3>
            <p className="text-xs text-muted">Full DDL & DML statements with foreign key integrity checks.</p>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Database backup snapshot downloaded successfully to your local machine!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* SQL Format */}
          <div className="rounded-2xl p-4 bg-white/50 dark:bg-slate-900/50 border border-black/5 dark:border-white/5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-xs text-ink mb-1">
                <FileCode className="w-4 h-4 text-accent" />
                <span>Standard SQL Script</span>
              </div>
              <p className="text-[11px] text-muted">
                Bit-for-bit MySQL table schema and record insertions. Ready to restore into phpMyAdmin or cPanel MariaDB.
              </p>
            </div>
            <button
              onClick={() => handleDownload('sql')}
              disabled={downloading}
              className="btn btn-primary h-11 w-full text-xs font-bold flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download .SQL Dump</span>
            </button>
          </div>

          {/* JSON Format */}
          <div className="rounded-2xl p-4 bg-white/50 dark:bg-slate-900/50 border border-black/5 dark:border-white/5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-xs text-ink mb-1">
                <Database className="w-4 h-4 text-purple-500" />
                <span>Structured JSON Dump</span>
              </div>
              <p className="text-[11px] text-muted">
                Raw JSON export of all operational state for analytical querying, migrations, or spreadsheet import.
              </p>
            </div>
            <button
              onClick={() => handleDownload('json')}
              disabled={downloading}
              className="btn btn-ghost h-11 w-full text-xs font-bold flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download .JSON Export</span>
            </button>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2 text-[11px] text-muted border-t border-black/5 dark:border-white/5">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Encrypted under admin JWT session. No sensitive unhashed passwords included.</span>
        </div>
      </div>
    </div>
  );
}
