'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { IdCard, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanRegNo = regNo.trim().toUpperCase();

    try {
      // 1. Fetch student profile by Registration Number (case-insensitive check)
      const { data: student, error: fetchErr } = await supabase
        .from('profiles')
        .select('*')
        .ilike('reg_no', cleanRegNo)
        .maybeSingle();

      if (fetchErr) {
        throw new Error(fetchErr.message);
      }

      if (!student) {
        setErrorMsg('No registered account found with registration number: ' + cleanRegNo);
        setLoading(false);
        return;
      }

      // 2. Check Approval Status
      if (student.status === 'pending') {
        setErrorMsg('Your registration is currently pending approval by Dr. Waseem Akram. Once approved, your contest room will unlock.');
        setLoading(false);
        return;
      }

      if (student.status === 'rejected') {
        setErrorMsg('Your registration request was rejected. Please contact your coordinator.');
        setLoading(false);
        return;
      }

      // 3. Verify Password
      if (student.password_hash && student.password_hash !== password) {
        setErrorMsg('Incorrect password. Please enter the correct password.');
        setLoading(false);
        return;
      }

      // 4. Save Session & Hard Navigate to Contest Room
      sessionStorage.setItem('Vspark_student_id', student.id);
      sessionStorage.setItem('Vspark_student_name', student.full_name);
      sessionStorage.setItem('Vspark_student_reg', student.reg_no);

      // Force full window navigation to avoid Next.js router silent freeze
      window.location.href = '/contest';
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('An unexpected error occurred during login. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 relative py-12">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-md">
        
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 relative rounded-full bg-white/5 border border-sky-400/30 p-1 flex items-center justify-center shadow-lg shadow-sky-500/20 mb-3 shrink-0">
            <Image
              src="/comsats-logo.png"
              alt="COMSATS Logo"
              width={48}
              height={48}
              className="object-contain rounded-full"
            />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Student Sign In</h1>
          <p className="text-xs text-sky-400 mt-1">Vspark • COMSATS Vehari Campus</p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-amber-950/50 border border-amber-500/50 text-amber-200 text-xs flex items-start gap-2.5 shadow-lg">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Registration Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <IdCard className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                autoComplete="off"
                placeholder="e.g. FA24-BCS-011"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-sky-500 transition-colors uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="Enter your password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                style={{ backgroundColor: '#020617', color: '#ffffff' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all mt-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Verifying Credentials...' : 'Sign In to Portal'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Not registered yet?{' '}
            <Link href="/register" className="text-sky-400 hover:text-sky-300 font-semibold underline">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}