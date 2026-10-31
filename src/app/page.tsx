'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, UserPlus, LogIn, Award, Sparkles, Building2, GraduationCap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top University Branding Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-3.5 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Official COMSATS University Circular Logo */}
            <div className="w-12 h-12 relative rounded-full bg-white/5 border border-sky-400/30 p-1 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Image
                src="/comsats-logo.png"
                alt="COMSATS University Islamabad Logo"
                width={44}
                height={44}
                className="object-contain rounded-full"
                priority
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide leading-tight">
                COMSATS UNIVERSITY ISLAMABAD
              </h2>
              <p className="text-[11px] text-sky-400 font-medium">
                Vehari Campus • Department of Computer Science
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-[11px] text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Vehari Campus, Punjab</span>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-10 text-center relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Prominent Center Emblem */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-full bg-gradient-to-b from-blue-900/40 to-slate-900/80 border-2 border-sky-400/40 p-2 flex items-center justify-center shadow-2xl shadow-blue-600/30">
          <Image
            src="/comsats-logo.png"
            alt="COMSATS Emblem"
            width={96}
            height={96}
            className="object-contain"
            priority
          />
        </div>

        {/* Institutional Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-sky-400 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5" /> Visospark Inter-Campus AI Evaluation 2026
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Visospark AI Prompt <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
            Contest Portal
          </span>
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Official institutional platform engineered for the AI Prompt Engineering and Video Synthesis challenge at{' '}
          <strong className="text-slate-200">COMSATS University Islamabad (Vehari Campus)</strong>.
        </p>

        {/* Mentorship & Evaluator Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl w-full mx-auto pt-1">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Contest Evaluator</p>
              <h3 className="text-xs font-bold text-white">Dr. Waseem Akram</h3>
              <p className="text-[10px] text-sky-400">CUI Vehari Campus</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Project Mentorship</p>
              <h3 className="text-xs font-bold text-white">Sir MS Abdullah</h3>
              <p className="text-[10px] text-sky-400">COMSATS University Vehari</p>
            </div>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
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
      </main>

      {/* Footer Credentials */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 px-6 text-center relative z-10">
        <p className="text-[11px] text-slate-500">
          Engineered & Maintained by <strong className="text-slate-300">Rana Muhammad Ali</strong> • COMSATS University Islamabad, Vehari Campus
        </p>
      </footer>
    </div>
  );
}