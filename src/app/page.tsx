'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, UserPlus, LogIn, Award, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-sky-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> COMSATS University Islamabad • Vehari Campus
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Visospark AI Prompt <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
            Contest Portal
          </span>
        </h1>

        <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          Official platform for students to participate in live AI video prompt engineering challenges, evaluated by <strong>Dr. Waseem Akram</strong>.
        </p>

        {/* Portal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Student Registration
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <LogIn className="w-4 h-4" /> Student Sign In
          </Link>

          <Link
            href="/admin"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <ShieldCheck className="w-4 h-4" /> Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
}