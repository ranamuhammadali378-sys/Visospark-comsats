'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Lock, FileText, ArrowLeft, AlertCircle, Clock } from 'lucide-react';

export default function StudentLoginPage() {
  const router = useRouter();
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingNotice, setPendingNotice] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPendingNotice(false);
    setLoading(true);

    try {
      const cleanReg = regNo.trim().toUpperCase();

      const { data: user, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('reg_no', cleanReg)
        .eq('role', 'student')
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!user) {
        setError('No student account found with this Registration Number.');
        setLoading(false);
        return;
      }

      if (user.password_hash !== password) {
        setError('Incorrect password. Please try again.');
        setLoading(false);
        return;
      }

      if (user.status === 'pending') {
        setPendingNotice(true);
        setLoading(false);
        return;
      }

      if (user.status === 'rejected') {
        setError('Your registration was not approved by Dr. Waseem Akram.');
        setLoading(false);
        return;
      }

      localStorage.setItem('visospark_user', JSON.stringify(user));
      router.push('/contest');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error logging in.';
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
          <h1 className="text-2xl font-bold tracking-tight text-white">Student Sign In</h1>
          <p className="text-xs text-sky-400 mt-1">Visospark AI Prompt Contest Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {pendingNotice && (
          <div className="mb-6 p-5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
              <Clock className="w-4 h-4" /> Request Under Review
            </div>
            Your registration is currently pending approval by <strong>Dr. Waseem Akram</strong>. As soon as he accepts your request, your contest test will be unlocked.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
              Password
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
          Not registered yet?{' '}
          <Link href="/register" className="text-blue-400 hover:underline font-semibold">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}