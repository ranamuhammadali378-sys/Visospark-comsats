'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Lock, User, FileText, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!fullName.trim() || !regNo.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const cleanReg = regNo.trim().toUpperCase();

      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('reg_no')
        .eq('reg_no', cleanReg)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingUser) {
        setError('This Registration Number has already registered.');
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from('profiles').insert([
        {
          full_name: fullName.trim(),
          reg_no: cleanReg,
          password_hash: password,
          role: 'student',
          status: 'pending',
        },
      ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating account.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl p-8 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-3 font-black text-lg">
            CUI
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Student Registration</h1>
          <p className="text-xs text-sky-400 mt-1">Visospark • COMSATS Vehari Campus</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Request Sent Successfully!</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Your registration request has been submitted to <strong>Dr. Waseem Akram</strong>. Once approved, you can enter the contest room.
            </p>
            <p className="text-xs text-slate-500 mt-4">Redirecting to login in 3 seconds...</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Ali"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Registration Number
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. FA21-BCS-045"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 uppercase focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password (Min 8 Characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Must be at least 8 characters long.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Submitting Registration...' : 'Send Registration Request'}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link href="/login" className="text-blue-400 hover:underline font-semibold">
            Log In here
          </Link>
        </div>
      </div>
    </div>
  );
}