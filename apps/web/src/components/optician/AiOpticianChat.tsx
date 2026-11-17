'use client';

import React, { useState, useRef, useEffect } from 'react';
import { askOpticianAi } from '../../lib/api';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Search,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  recommendedFrames?: string[];
}

interface AiOpticianChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiOpticianChat({ isOpen, onClose }: AiOpticianChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Salam! I am **Spectra AI Optician**. How can I help you pick the perfect frames today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      const data = await askOpticianAi(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: data.reply || 'I am here to guide your optical choices.',
          recommendedFrames: data.recommendedFrames,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'I could not connect to optical servers right now. Please WhatsApp support at 0300-SPECTRA.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Which frame fits my face?',
    'Blue-Cut vs Polarized lenses',
    'Return & replacement policy',
    'Track my order SP-2026-8492',
  ];

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-full max-w-sm rounded-[32px] overflow-hidden glass-strong border border-white/30 shadow-2xl animate-slide-up flex flex-col h-[520px]">
      {/* Header */}
      <div className="p-4 border-b border-black/5 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-ink flex items-center gap-1.5">
              <span>Spectra AI Optician</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[10px] text-muted font-medium">Virtual Stylist & Prescription Guide</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-muted transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'bot' && (
              <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[82%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-accent text-white rounded-br-none'
                  : 'bg-white/80 dark:bg-slate-800/80 text-ink border border-black/5 dark:border-white/5 rounded-bl-none shadow-sm'
              }`}
            >
              <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />

              {/* Recommended Frames Link Pills */}
              {m.recommendedFrames && m.recommendedFrames.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/10 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold text-muted w-full">Try in 3D:</span>
                  {m.recommendedFrames.map((slug) => (
                    <Link
                      key={slug}
                      href={`/customizer`}
                      onClick={onClose}
                      className="px-2 py-0.5 rounded-full bg-accent/10 hover:bg-accent text-accent hover:text-white transition-all text-[10px] font-bold capitalize"
                    >
                      {slug.replace(/-/g, ' ')} →
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-muted text-xs">
            <Bot className="w-4 h-4 animate-bounce text-accent" />
            <span>Consulting optical database...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2 border-t border-black/5 dark:border-white/5 bg-white/20 dark:bg-slate-900/20 overflow-x-auto flex gap-1.5 scrollbar-none">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-full bg-white/70 dark:bg-slate-800/70 border border-black/5 dark:border-white/10 text-[11px] font-medium text-muted hover:text-ink hover:bg-white shrink-0 transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask anything or enter Order #..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 h-10 px-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-black/10 dark:border-white/10 text-xs text-ink outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center disabled:opacity-50 hover:bg-accent-hover transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
