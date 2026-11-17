'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Glasses, Save } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('spectra_admin_token') : null;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch('/api/v1/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        fetchProducts();
        setEditingProduct(null);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this frame?')) return;
    try {
      await fetch(`/api/v1/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-ink">Product & Variant Catalog</h2>
          <p className="text-xs text-muted">Configure procedural 3D eyewear parameters, inventory, and retail pricing.</p>
        </div>

        <button
          onClick={() =>
            setEditingProduct({
              name: '',
              slug: '',
              tagline: '',
              description: '',
              basePrice: 3200,
              compareAtPrice: 4800,
              frameShape: 'wayfarer',
              frameMaterial: 'acetate',
              recommendedFaceShapes: 'round,oval',
              stock: 30,
              isBestseller: false,
              isNew: true,
              images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'],
            })
          }
          className="btn btn-primary h-10 px-4 text-xs font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Frame</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="glass rounded-[32px] overflow-hidden border border-white/60 dark:border-white/10 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/10 text-muted uppercase font-bold text-[10px] tracking-wider">
            <tr>
              <th className="p-4">Frame Model</th>
              <th className="p-4">3D Shape</th>
              <th className="p-4">Material</th>
              <th className="p-4">Base Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-white/40 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-ink">
                  {p.name}
                  <span className="block text-[11px] text-muted font-normal">{p.tagline}</span>
                </td>
                <td className="p-4 capitalize font-semibold">{p.frameShape}</td>
                <td className="p-4 capitalize text-muted">{p.frameMaterial}</td>
                <td className="p-4 font-bold text-ink">Rs. {p.basePrice?.toLocaleString()}</td>
                <td className="p-4 font-semibold">{p.stock} units</td>
                <td className="p-4">
                  {p.isBestseller && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold">
                      Bestseller
                    </span>
                  )}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => setEditingProduct(p)}
                    className="btn btn-ghost h-8 px-2.5 text-[11px] font-bold"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="btn btn-ghost h-8 px-2.5 text-[11px] font-bold text-rose-500 hover:text-rose-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Frame Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-strong relative w-full max-w-lg rounded-[32px] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-ink">
              {editingProduct.id ? 'Edit Frame' : 'Add New Eyewear Model'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-muted block mb-1">Model Name *</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                  className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-muted block mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingProduct.tagline}
                  onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted block mb-1">3D Frame Shape *</label>
                  <select
                    value={editingProduct.frameShape}
                    onChange={(e) => setEditingProduct({ ...editingProduct, frameShape: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none capitalize"
                  >
                    <option value="wayfarer">Wayfarer</option>
                    <option value="aviator">Aviator</option>
                    <option value="round">Round Classic</option>
                    <option value="clubmaster">Clubmaster</option>
                    <option value="cat-eye">Cat-Eye</option>
                    <option value="hexagonal">Hexagonal</option>
                    <option value="rimless">Rimless</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-muted block mb-1">Material Base *</label>
                  <select
                    value={editingProduct.frameMaterial}
                    onChange={(e) => setEditingProduct({ ...editingProduct, frameMaterial: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none capitalize"
                  >
                    <option value="acetate">Polished Acetate</option>
                    <option value="matte-black">Matte Black</option>
                    <option value="titanium">Brushed Titanium</option>
                    <option value="gold-metal">Gold Metal</option>
                    <option value="silver-metal">Silver Metal</option>
                    <option value="tortoiseshell">Havana Tortoiseshell</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted block mb-1">Retail Price (PKR) *</label>
                  <input
                    type="number"
                    value={editingProduct.basePrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: Number(e.target.value) })}
                    required
                    className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-muted block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-ink outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary h-11 flex-1 text-xs font-bold"
                >
                  Save Frame to Catalog
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="btn btn-ghost h-11 px-4 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
