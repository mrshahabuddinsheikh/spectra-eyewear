'use client';

import React, { useState } from 'react';
import { AiOpticianChat } from './AiOpticianChat';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';

export function FloatingOpticianBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating 3D Bot Avatar Button */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 rounded-full glass-strong border border-white/60 dark:border-white/10 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
          aria-label="Open AI Optician Assistant"
        >
          {/* 3D-styled Glowing Avatar */}
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-purple-600 text-white flex items-center justify-center shadow-md animate-float">
            <Bot className="w-5 h-5 text-white" />
            {/* Glowing Lens Ring */}
            <span className="absolute -inset-1 rounded-full bg-accent/20 blur-sm group-hover:bg-accent/40 transition-all" />
            {/* Online Pulse */}
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black text-ink leading-tight flex items-center gap-1">
              <span>AI Optician</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </span>
            <span className="text-[10px] text-muted font-medium">Fit & Lens Advice</span>
          </div>
        </button>
      </div>

      {/* Chat Drawer */}
      <AiOpticianChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
