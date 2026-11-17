'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  AlertCircle,
  Printer,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  Zap,
  Lock,
} from 'lucide-react';

export default function AdminOrderDeskPage() {
  const [token, setToken] = useState<string | null>(null);

  // Login form state
  const [email, setEmail] = useState('admin@spectra.pk');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected order for status update or invoice modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newCourier, setNewCourier] = useState('TCS');
  const [newTracking, setNewTracking] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<any | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('spectra_admin_token');
    if (savedToken) {
      setToken(savedToken);
      fetchOrders(savedToken);
    }
  }, []);

  const fetchOrders = async (jwtToken: string) => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/v1/admin/orders', {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.warn('Orders fetch error:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('spectra_admin_token', data.token);
      localStorage.setItem('spectra_admin_user', JSON.stringify(data.user));
      setToken(data.token);
      fetchOrders(data.token);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !newStatus) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/v1/admin/orders/${selectedOrder.orderNumber}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          courier: newCourier,
          trackingNumber: newTracking || undefined,
        }),
      });

      if (res.ok) {
        if (token) fetchOrders(token);
        setSelectedOrder(null);
      }
    } catch (e) {
      console.warn('Update status error:', e);
    } finally {
      setIsUpdating(false);
    }
  };

  // If not authenticated, render Admin Login Card
  if (!token) {
    return (
      <div className="max-w-md mx-auto py-16">
        <div className="glass-strong rounded-[36px] p-8 border border-white/60 dark:border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center font-black mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-ink">Admin Desk Login</h2>
            <p className="text-xs text-muted">
              Secure access for Spectra fulfillment, inventory & courier tracking.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-muted block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="font-semibold text-muted block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn btn-primary h-12 w-full text-sm font-bold shadow-lg"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Operations'}
            </button>
          </form>

          <div className="text-center text-[11px] text-muted p-2 rounded-xl bg-black/5 dark:bg-white/5">
            Default credentials: <strong>admin@spectra.pk</strong> / <strong>admin123</strong>
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      !search.trim() ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search) ||
      o.city.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const dispatchedCount = orders.filter((o) => ['shipped', 'delivered'].includes(o.status)).length;

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-[24px] p-5 shadow-sm">
          <p className="text-[11px] font-bold text-muted uppercase">Total Orders</p>
          <p className="text-2xl sm:text-3xl font-black text-ink mt-1">{orders.length}</p>
          <span className="text-[10px] text-muted">Across Pakistan</span>
        </div>

        <div className="glass rounded-[24px] p-5 shadow-sm">
          <p className="text-[11px] font-bold text-muted uppercase">Pending Verification</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">{pendingCount}</p>
          <span className="text-[10px] text-amber-500 font-semibold">Awaiting Courier Booking</span>
        </div>

        <div className="glass rounded-[24px] p-5 shadow-sm">
          <p className="text-[11px] font-bold text-muted uppercase">Dispatched / Delivered</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-500 mt-1">{dispatchedCount}</p>
          <span className="text-[10px] text-emerald-500 font-semibold">TCS / Leopards Milestones</span>
        </div>

        <div className="glass rounded-[24px] p-5 shadow-sm">
          <p className="text-[11px] font-bold text-muted uppercase">COD Volume</p>
          <p className="text-2xl sm:text-3xl font-black text-accent mt-1">
            Rs. {Math.round(totalRevenue / 1000)}k
          </p>
          <span className="text-[10px] text-muted">Total Gross Bookings</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass rounded-[28px] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order #, phone, customer, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-xs text-ink outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`chip text-xs capitalize ${statusFilter === status ? 'chip-active bg-ink text-white' : ''}`}
              data-active={statusFilter === status}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass rounded-[32px] overflow-hidden border border-white/60 dark:border-white/10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/10 text-muted uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">City</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Risk</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-black text-ink">{o.orderNumber}</td>
                  <td className="p-4">
                    <p className="font-bold text-ink">{o.customerName}</p>
                    <p className="text-[11px] text-muted font-mono">{o.customerPhone}</p>
                  </td>
                  <td className="p-4 font-semibold text-ink">{o.city}</td>
                  <td className="p-4 text-muted max-w-xs truncate">
                    {o.items?.map((it: any) => `${it.name} (${it.quantity})`).join(', ') || 'Custom Frame'}
                  </td>
                  <td className="p-4 font-bold text-ink">Rs. {o.total?.toLocaleString()}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        o.status === 'delivered'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : o.status === 'shipped'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : o.status === 'confirmed'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          : o.status === 'cancelled'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        o.riskScore === 'high'
                          ? 'bg-rose-500 text-white'
                          : o.riskScore === 'medium'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {o.riskScore || 'low'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(o);
                        setNewStatus(o.status);
                        setNewCourier(o.courier || 'TCS');
                        setNewTracking(o.trackingNumber || '');
                      }}
                      className="btn btn-ghost h-8 px-2.5 text-[11px] font-bold"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setInvoiceModalOrder(o)}
                      className="btn btn-ghost h-8 px-2.5 text-[11px] font-bold text-accent"
                      title="Print Thermal / A4 Packing Slip"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-strong relative w-full max-w-md rounded-[32px] p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-ink">
              Update Order #{selectedOrder.orderNumber}
            </h3>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-muted block mb-1">Order Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-muted block mb-1">Assigned Courier</label>
                <select
                  value={newCourier}
                  onChange={(e) => setNewCourier(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
                >
                  <option value="TCS">TCS Express</option>
                  <option value="Leopards">Leopards Courier</option>
                  <option value="Trax">Trax Logistics</option>
                  <option value="CallCourier">Call Courier</option>
                  <option value="PostEx">PostEx</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-muted block mb-1">Courier Tracking ID / Waybill</label>
                <input
                  type="text"
                  placeholder="e.g. TCS-89301928PK"
                  value={newTracking}
                  onChange={(e) => setNewTracking(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn btn-primary h-11 flex-1 text-xs font-bold"
                >
                  {isUpdating ? 'Saving...' : 'Save & Notify Rider'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="btn btn-ghost h-11 px-4 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Thermal Packing Slip / Shipping Label Modal */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white text-black p-6 rounded-2xl w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto print:m-0 print:p-0 print:shadow-none">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-xl font-black tracking-tight">SPECTRA EYEWEAR</h2>
                <p className="text-[10px] text-gray-500">COD Packing Slip & Shipping Manifest</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black font-mono">{invoiceModalOrder.orderNumber}</span>
                <p className="text-[10px] text-gray-500">Courier: {invoiceModalOrder.courier || 'TCS'}</p>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="border p-3 rounded-lg text-xs space-y-1 bg-gray-50">
              <p className="font-bold text-gray-700">SHIP TO:</p>
              <p className="font-black text-sm">{invoiceModalOrder.customerName}</p>
              <p className="font-mono">{invoiceModalOrder.customerPhone}</p>
              <p>{invoiceModalOrder.shippingAddress}</p>
              <p className="font-bold text-accent">{invoiceModalOrder.city}, Pakistan</p>
            </div>

            {/* COD Amount Banner */}
            <div className="bg-black text-white p-3 rounded-lg text-center font-mono">
              <p className="text-[10px] uppercase tracking-widest text-gray-300">CASH TO COLLECT (COD)</p>
              <p className="text-2xl font-black">PKR {invoiceModalOrder.total?.toLocaleString()}</p>
            </div>

            {/* Items Table */}
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-1">Description</th>
                  <th className="py-1 text-center">Qty</th>
                  <th className="py-1 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {invoiceModalOrder.items?.map((it: any, i: number) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">
                      <p className="font-bold">{it.name}</p>
                      <p className="text-[10px] text-gray-500">{it.frameColor} · {it.lensTint}</p>
                    </td>
                    <td className="py-2 text-center">{it.quantity}</td>
                    <td className="py-2 text-right">Rs. {(it.price * it.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Barcode Simulation */}
            <div className="text-center pt-2">
              <div className="h-10 bg-repeat-x bg-center mx-auto w-48 font-mono text-[9px] tracking-widest flex items-center justify-center border-t border-b border-black">
                ||| | |||| | ||| || ||||| | ||||
              </div>
              <p className="text-[9px] font-mono mt-1">{invoiceModalOrder.trackingNumber || invoiceModalOrder.orderNumber}</p>
            </div>

            {/* Print & Close Actions */}
            <div className="flex gap-2 pt-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="btn btn-primary h-10 flex-1 text-xs font-bold"
              >
                Print Slip
              </button>
              <button
                onClick={() => setInvoiceModalOrder(null)}
                className="btn btn-ghost h-10 px-4 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
