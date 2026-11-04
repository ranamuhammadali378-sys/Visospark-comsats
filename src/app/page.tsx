'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, UserPlus, LogIn, Award, Sparkles, Building2, GraduationCap, ChevronRight, Cpu } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#04060a] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-sky-500/30 selection:text-white">
      
      {/* Background Soft Blue Glow Elements */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-sky-600/15 via-blue-700/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -left-36 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 -right-36 w-[450px] h-[450px] bg-sky-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Top University Branding Bar */}
      <header className="border-b border-white/[0.08] bg-[#04060a]/80 backdrop-blur-2xl px-6 py-4 relative z-20 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 relative rounded-full bg-white/[0.04] border border-sky-400/30 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.2)] shrink-0 transition-transform duration-500 hover:scale-105">
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
              <h2 className="text-xs sm:text-sm font-semibold tracking-[0.16em] text-white/95 uppercase">
                COMSATS UNIVERSITY ISLAMABAD
              </h2>
              <p className="text-[11px] text-sky-400 font-normal tracking-wider">
                Vehari Campus • Department of Computer Science
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-light text-slate-300 backdrop-blur-lg">
            <Building2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="tracking-wide">Vehari Campus, Punjab</span>
          </div>
        </div>
      </header>

      {/* Main Professional Hero Showcase */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-10 text-center relative z-10 max-w-4xl mx-auto space-y-7">
        
        {/* Emblem Showcase */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-sky-500/20 via-blue-600/20 to-sky-400/20 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition duration-700" />
          <div className="w-24 h-24 relative rounded-full bg-[#080b14]/95 border border-sky-400/30 p-2 flex items-center justify-center shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <Image
              src="/comsats-logo.png"
              alt="COMSATS Emblem"
              width={90}
              height={90}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Professional Contest Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-sky-500/[0.08] border border-sky-400/30 text-sky-200 text-xs font-normal tracking-widest uppercase shadow-[0_0_20px_rgba(56,189,248,0.12)] backdrop-blur-md">
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          <span>Vspark Inter-Campus AI Evaluation 2026</span>
          <Sparkles className="w-3.5 h-3.5 text-sky-300" />
        </div>

        {/* Refined Unified Executive Headline (No harsh pink/yellow tones) */}
        <div className="space-y-2 select-none">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-tight">
            {/* Vspark in Deep Royal Ice-to-Azure Professional Blue */}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-100 via-sky-300 to-blue-500 drop-shadow-[0_2px_15px_rgba(56,189,248,0.35)]">
              Vspark
            </span>{' '}
            {/* AI Prompt in Crisp Platinum White */}
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 drop-shadow-[0_2px_15px_rgba(255,255,255,0.25)]">
              AI Prompt
            </span>
          </h1>

          {/* Contest Portal in Consistent Deep Blue Gradient */}
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-sans tracking-tight leading-tight">
            <span className="font-light text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-400 to-blue-500 drop-shadow-[0_0_25px_rgba(56,189,248,0.35)]">
              Contest{' '}
            </span>
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 drop-shadow-[0_0_30px_rgba(59,130,246,0.35)]">
              Portal
            </span>
          </h2>
        </div>

        {/* Narrative Description */}
        <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl mx-auto leading-relaxed tracking-wide">
          An institutional creative arena engineered for the prompt craft & synthetic media challenge at{' '}
          <span className="text-sky-300 font-normal">
            COMSATS University Islamabad (Vehari Campus)
          </span>.
        </p>

        {/* Mentor & Evaluator Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl w-full mx-auto pt-2">
          
          {/* Dr. Waseem Akram Card */}
          <div className="group p-4 rounded-2xl bg-white/[0.025] hover:bg-white/[0.05] border border-sky-400/20 hover:border-sky-400/40 text-left flex items-center gap-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-300 shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
              <Award className="w-5 h-5 stroke-[1.6]" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-[0.16em] text-sky-300/80">Contest Evaluator</p>
              <h3 className="text-xs sm:text-sm font-medium text-white tracking-wide">Dr. Waseem Akram</h3>
              <p className="text-[11px] text-slate-400 font-light">CUI Vehari Campus</p>
            </div>
          </div>

          {/* Sir MS Abdullah Card */}
          <div className="group p-4 rounded-2xl bg-white/[0.025] hover:bg-white/[0.05] border border-blue-400/20 hover:border-blue-400/40 text-left flex items-center gap-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <GraduationCap className="w-5 h-5 stroke-[1.6]" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-[0.16em] text-blue-300/80">Project Mentorship</p>
              <h3 className="text-xs sm:text-sm font-medium text-white tracking-wide">Sir MS Abdullah</h3>
              <p className="text-[11px] text-slate-400 font-light">COMSATS University Vehari</p>
            </div>
          </div>
        </div>

        {/* Standard Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium text-xs tracking-wide shadow-[0_0_25px_rgba(56,189,248,0.25)] flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Student Registration</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-sky-400/40 text-slate-200 font-light text-xs tracking-wide flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-lg shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5 text-sky-400" />
            <span>Student Sign In</span>
          </Link>

          <Link
            href="/admin"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 text-slate-300 font-light text-xs tracking-wide flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-lg"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] bg-[#04060a]/85 py-4 px-6 text-center relative z-20">
        <p className="text-[11px] text-slate-400 font-light tracking-wide">
          Designed & Developed by <strong className="text-white font-medium">Rana Muhammad Ali</strong> • COMSATS University Islamabad, Vehari Campus
        </p>
      </footer>
    </div>
  );
}