'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Phone, MapPin, Eye } from 'lucide-react';

export default function AdminRiskAnalysisPage() {
  const [riskData, setRiskData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('spectra_admin_token') : null;

  useEffect(() => {
    fetchRiskAnalysis();
  }, []);

  const fetchRiskAnalysis = async () => {
    try {
      const res = await fetch('/api/v1/admin/orders/risk-analysis', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRiskData(data);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const summary = riskData?.summary || {
    totalOrders: 0,
    highRiskCount: 0,
    mediumRiskCount: 0,
    lowRiskCount: 0,
    fraudPreventionRate: '100%',
  };

  const flagged = riskData?.flaggedOrders || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-ink">COD Fraud & Risk Intelligence</h2>
        <p className="text-xs text-muted">
          Automated heuristic risk scoring for Cash on Delivery orders to eliminate return-to-origin (RTO) expenses.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-[24px] p-5 shadow-sm">
          <p className="text-[11px] font-bold text-muted uppercase">High Risk Flagged</p>
          <p className="text-3xl font-black text-rose-500 mt-1">{summary.highRiskCount}</p>
          <span className="text-[10px] text-rose-500 font-semibold">Immediate Phone Verification Advised</span>
        </div>

        <div className="glass rounded-[24px] p-5 shadow-sm">
          <p className="text-[11px] font-bold text-muted uppercase">Medium Attention</p>
          <p className="text-3xl font-black text-amber-500 mt-1">{summary.mediumRiskCount}</p>
          <span className="text-[10px] text-muted">Address Clarification Needed</span>
        </div>

        <div className="glass rounded-[24px] p-5 shadow-sm">
          <p className="text-[11px] font-bold text-muted uppercase">Safe Green Orders</p>
          <p className="text-3xl font-black text-emerald-500 mt-1">{summary.lowRiskCount}</p>
          <span className="text-[10px] text-muted">Approved for Instant Dispatch</span>
        </div>

        <div className="glass rounded-[24px] p-5 shadow-sm">
          <p className="text-[11px] font-bold text-muted uppercase">RTO Protection Score</p>
          <p className="text-3xl font-black text-accent mt-1">{summary.fraudPreventionRate}</p>
          <span className="text-[10px] text-muted">Courier Success Probability</span>
        </div>
      </div>

      {/* Flagged Orders List */}
      <div className="glass rounded-[32px] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <h3 className="text-sm font-black text-ink uppercase tracking-wider">
            Flagged High-Risk Orders
          </h3>
        </div>

        {flagged.length === 0 ? (
          <div className="p-8 text-center text-muted">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-ink">Zero high-risk orders pending.</p>
            <p className="text-[11px]">All current customer numbers and addresses meet safety thresholds.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {flagged.map((ord: any) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-ink text-sm">{ord.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase">
                      High Risk
                    </span>
                  </div>
                  <p className="text-ink font-semibold">
                    {ord.customerName} · <span className="font-mono">{ord.customerPhone}</span>
                  </p>
                  <p className="text-muted text-[11px]">Destination: {ord.shippingAddress}, {ord.city}</p>
                  <p className="text-rose-600 dark:text-rose-400 font-bold text-[11px] mt-1">
                    ⚠️ Reason: {ord.riskReason}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${ord.customerPhone}`}
                    className="btn btn-ghost h-9 px-3 text-xs font-bold text-ink"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Customer</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
