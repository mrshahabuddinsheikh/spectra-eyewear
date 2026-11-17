'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchProducts } from '../../lib/api';
import { Search, RotateCw, Filter, Sparkles, ArrowRight } from 'lucide-react';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedShape, setSelectedShape] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const shapes = ['all', 'wayfarer', 'aviator', 'round', 'clubmaster', 'cat-eye', 'hexagonal', 'rimless'];

  const filtered = products.filter((p) => {
    const matchesShape = selectedShape === 'all' || p.frameShape === selectedShape;
    const matchesQuery =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tagline && p.tagline.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesShape && matchesQuery;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
        <span className="text-xs font-bold tracking-widest text-accent uppercase">
          Artisanal Eyewear Catalog
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-ink">
          The Spectra Collection
        </h1>
        <p className="text-sm text-muted">
          All frames include complimentary hard leatherette case, microfiber cloth, and Cash on Delivery across Pakistan.
        </p>
      </div>

      {/* Search & Shape Filter Bar */}
      <div className="glass rounded-[28px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by frame or shape..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-full bg-white/70 dark:bg-slate-900/70 border border-black/10 dark:border-white/10 text-xs text-ink outline-none"
          />
        </div>

        {/* Shape Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
          {shapes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedShape(s)}
              className={`chip text-xs capitalize ${selectedShape === s ? 'chip-active bg-ink text-white' : ''}`}
              data-active={selectedShape === s}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center text-muted">
          <RotateCw className="w-8 h-8 animate-spin text-accent mb-2" />
          <span className="text-xs font-semibold">Loading frames catalog...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-muted glass rounded-[32px] p-8">
          <p className="text-sm font-bold text-ink">No frames matched your search.</p>
          <button
            onClick={() => { setSelectedShape('all'); setSearchQuery(''); }}
            className="btn btn-ghost h-9 px-4 text-xs font-semibold mt-3"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="glass rounded-[32px] p-5 flex flex-col justify-between border border-white/60 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-0.5 text-[11px] font-bold capitalize text-ink">
                    {product.frameShape}
                  </span>
                  {product.isBestseller && (
                    <span className="rounded-full bg-accent text-white px-2.5 py-0.5 text-[10px] font-bold">
                      Bestseller
                    </span>
                  )}
                  {product.isNew && (
                    <span className="rounded-full bg-purple-600 text-white px-2.5 py-0.5 text-[10px] font-bold">
                      New
                    </span>
                  )}
                </div>

                {/* Image */}
                <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 flex items-center justify-center p-3 mb-4 group-hover:scale-[1.03] transition-transform duration-300">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <h3 className="text-base font-black text-ink leading-snug">{product.name}</h3>
                <p className="text-xs text-muted line-clamp-2 mt-1">{product.tagline}</p>
              </div>

              {/* Price & Action */}
              <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-ink">
                    Rs. {product.basePrice.toLocaleString()}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-xs line-through text-muted ml-2">
                      Rs. {product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/product/${product.slug}`}
                    className="btn btn-ghost h-9 px-3 text-xs font-semibold"
                  >
                    Details
                  </Link>
                  <Link
                    href="/customizer"
                    className="btn btn-primary h-9 px-3 text-xs font-bold"
                  >
                    View in 3D
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
