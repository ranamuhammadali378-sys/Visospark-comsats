'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { User, IdCard, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft, Phone } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validatePhone = (phone: string) => {
    const phoneRegex = /^((\+92)|(0092)|(0))?3[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, '').replace(/-/g, ''));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanRegNo = regNo.trim().toUpperCase();
    const cleanPhone = whatsappNo.trim().replace(/\s+/g, '').replace(/-/g, '');

    if (!validatePhone(cleanPhone)) {
      setErrorMsg('Please enter a valid Pakistani WhatsApp number (e.g., 03001234567 or +923001234567).');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      // 1. Check duplicate Reg No in profiles
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('reg_no')
        .eq('reg_no', cleanRegNo)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error(checkError.message);
      }

      if (existingUser) {
        setErrorMsg('This Registration Number is already registered.');
        setLoading(false);
        return;
      }

      // 2. Direct insert into profiles table
      const candidateId = crypto.randomUUID();

      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: candidateId,
          full_name: fullName.trim(),
          reg_no: cleanRegNo,
          whatsapp_no: cleanPhone,
          password_hash: password,
          role: 'student',
          status: 'pending',
        },
      ]);

      if (profileError) {
        throw new Error(profileError.message);
      }

      setSuccessMsg('Registration request submitted successfully! Please wait for Evaluator (Dr. Waseem Akram) approval.');
      setFullName('');
      setRegNo('');
      setWhatsappNo('');
      setPassword('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('An error occurred during registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 relative py-12">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-md">
        
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 relative rounded-full bg-white/5 border border-sky-400/30 p-1 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3 shrink-0">
            <Image
              src="/comsats-logo.png"
              alt="COMSATS Logo"
              width={48}
              height={48}
              className="object-contain rounded-full"
            />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Student Registration</h1>
          <p className="text-xs text-sky-400 mt-1">Vspark • COMSATS Vehari Campus</p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} autoComplete="off" className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                autoComplete="off"
                placeholder="e.g. Ali Raza"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
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
                placeholder="e.g. FA21-BCS-001"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-blue-500 transition-colors uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
              WhatsApp Phone Number (For Winner Contact)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                autoComplete="off"
                placeholder="03001234567"
                value={whatsappNo}
                onChange={(e) => setWhatsappNo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
              Password (Min 8 characters)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                name="new_student_password_field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all mt-1"
          >
            {loading ? 'Submitting Request...' : 'Send Registration Request'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Already registered?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold underline">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}