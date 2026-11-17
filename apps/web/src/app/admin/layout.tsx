'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Package,
  Glasses,
  Play,
  BellRing,
  ShieldAlert,
  Database,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('spectra_admin_token');
    setToken(t);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('spectra_admin_token');
    localStorage.removeItem('spectra_admin_user');
    setToken(null);
    router.push('/admin');
  };

  const navItems = [
    { label: 'Order Desk', href: '/admin', icon: Package },
    { label: 'Product Catalog', href: '/admin/products', icon: Glasses },
    { label: 'Shoppable Reels', href: '/admin/reels', icon: Play },
    { label: 'Social Proof', href: '/admin/social-proof', icon: BellRing },
    { label: 'Risk Analysis', href: '/admin/risk', icon: ShieldAlert },
    { label: 'Database Backup', href: '/admin/backup', icon: Database },
  ];

  return (
    <div className="space-y-6 pb-20 pt-2">
      {/* Top Admin Header Bar */}
      <div className="glass-strong rounded-[28px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/60 dark:border-white/10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-ink text-white flex items-center justify-center font-black">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-ink">Spectra Executive Desk</h1>
              <span className="rounded-full bg-accent/10 text-accent px-2 py-0.5 text-[10px] font-bold">
                Operations v1.0
              </span>
            </div>
            <p className="text-xs text-muted">COD Order Processing & 3D Catalog Engine</p>
          </div>
        </div>

        {token && (
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs font-semibold text-muted hidden md:inline">
              Signed in as: <strong className="text-ink">admin@spectra.pk</strong>
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-ghost h-9 px-3.5 text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Admin Nav Tabs */}
      {token && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`chip text-xs font-bold flex items-center gap-2 shrink-0 ${
                  isActive ? 'bg-ink text-white' : ''
                }`}
                data-active={isActive}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Page Content */}
      {children}
    </div>
  );
}
