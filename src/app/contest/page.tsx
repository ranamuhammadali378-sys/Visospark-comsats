'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { 
  Trophy, Clock, Calendar, MapPin, CheckCircle2, AlertCircle, 
  ExternalLink, Send, Video, LogOut, ArrowRight, ShieldCheck 
} from 'lucide-react';

export default function ContestDashboardPage() {
  const [studentName, setStudentName] = useState('');
  const [studentReg, setStudentReg] = useState('');
  const [studentStatus, setStudentStatus] = useState<string>('approved');
  const [loading, setLoading] = useState(true);

  // Contest Info from Admin
  const [contestTitle, setContestTitle] = useState('Vspark AI Prompt Contest');
  const [eventDate, setEventDate] = useState('November 2026');
  const [eventVenue, setEventVenue] = useState('Computer Science Lab, CUI Vehari');
  const [scenario, setScenario] = useState('');
  const [teacherDriveLink, setTeacherDriveLink] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number | null>(null);

  // Submission Form State
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [usedPrompt, setUsedPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // 1. Get Logged in student info from session
    const reg = sessionStorage.getItem('Vspark_student_reg') || 'FA24-BCS-011';
    const name = sessionStorage.getItem('Vspark_student_name') || 'Student';
    setStudentReg(reg);
    setStudentName(name);

    // 2. Fetch fresh status & contest config from Supabase
    const fetchPortalData = async () => {
      try {
        // Fetch student status
        const { data: profile } = await supabase
          .from('profiles')
          .select('status, full_name')
          .eq('reg_no', reg)
          .maybeSingle();

        if (profile) {
          setStudentStatus(profile.status);
          if (profile.full_name) setStudentName(profile.full_name);
        }

        // Fetch Contest schedule and status
        const { data: config } = await supabase
          .from('test_config')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (config) {
          setContestTitle(config.title || 'Vspark AI Prompt Contest');
          setEventDate(config.event_date || 'Announced by Dr. Waseem Akram');
          setEventVenue(config.event_venue || 'Lab 1, Department of CS, CUI Vehari');
          setScenario(config.scenario || 'Prompt details will appear when contest is initiated by Dr. Waseem Akram.');
          setTeacherDriveLink(config.teacher_drive_link || '');
          setDurationMinutes(config.duration_minutes || 15);
          setIsActive(config.is_active || false);
          setStartTime(config.start_time || null);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortalData();

    // Setup periodic polling for real-time status update
    const interval = setInterval(fetchPortalData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Timer Countdown Calculation
  useEffect(() => {
    if (!isActive || !startTime) {
      setTimeLeftSeconds(null);
      return;
    }

    const calculateRemaining = () => {
      const startMs = new Date(startTime).getTime();
      const endMs = startMs + durationMinutes * 60 * 1000;
      const nowMs = Date.now();
      const diffSec = Math.floor((endMs - nowMs) / 1000);

      if (diffSec <= 0) {
        setTimeLeftSeconds(0);
      } else {
        setTimeLeftSeconds(diffSec);
      }
    };

    calculateRemaining();
    const timer = setInterval(calculateRemaining, 1000);
    return () => clearInterval(timer);
  }, [isActive, startTime, durationMinutes]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    try {
      const studentId = sessionStorage.getItem('Vspark_student_id') || crypto.randomUUID();

      const { error } = await supabase.from('submissions').insert([
        {
          student_id: studentId,
          student_name: studentName,
          reg_no: studentReg,
          title: submissionTitle.trim(),
          used_prompt: usedPrompt.trim(),
          video_url: videoUrl.trim(),
          submitted_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      setSubmitSuccess(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit project');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070d] text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 tracking-wider">Loading Vspark Student Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col justify-between selection:bg-sky-500/30">
      
      {/* Top Header */}
      <header className="border-b border-white/[0.08] bg-[#05070d]/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-sky-400/30 p-1 flex items-center justify-center bg-white/[0.03]">
            <Image
              src="/comsats-logo.png"
              alt="COMSATS Logo"
              width={36}
              height={36}
              className="object-contain rounded-full"
            />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-white tracking-wide">Vspark Candidate Portal</h1>
            <p className="text-[11px] text-sky-400 font-light">COMSATS University Islamabad, Vehari Campus</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs border border-red-500/30 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Student Profile & Approval Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400">Candidate Information</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{studentName}</h2>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="font-mono text-xs bg-sky-950/80 border border-sky-500/40 text-sky-300 px-2.5 py-0.5 rounded font-bold">
                {studentReg}
              </span>
              <span className="text-xs text-slate-400">• BS Software Engineering / CS</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {studentStatus === 'approved' ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Account Approved by Dr. Waseem Akram</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Approval Under Review</span>
              </div>
            )}
          </div>
        </div>

        {/* Contest Details & Schedule Box (Admin Controlled) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.08] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Contest Date & Time</p>
              <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">{eventDate}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.08] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Event Venue / Location</p>
              <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">{eventVenue}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.08] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Supervised by</p>
              <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">Dr. Waseem Akram</p>
            </div>
          </div>
        </div>

        {/* Live Contest Room & Challenge Section */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-sky-400 font-bold">Challenge Brief</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{contestTitle}</h3>
            </div>

            {/* Live Countdown Display */}
            {isActive && timeLeftSeconds !== null && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 font-mono text-sm font-bold shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                <Clock className="w-4 h-4 animate-pulse text-rose-400" />
                <span>Timer Left: {formatTimer(timeLeftSeconds)}</span>
              </div>
            )}
          </div>

          {/* Scenario / Instructions */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Problem Statement / Scenario:</p>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              {scenario}
            </div>
          </div>

          {teacherDriveLink && (
            <div>
              <a
                href={teacherDriveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-300 text-xs font-semibold transition-all"
              >
                <ExternalLink className="w-4 h-4" /> Open Teacher Reference Materials (Google Drive)
              </a>
            </div>
          )}

          {/* Final Submission Form */}
          {studentStatus === 'approved' && (
            <div className="pt-4 border-t border-white/[0.06] space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400" /> Submit Your AI Video & Prompt
              </h4>

              {submitSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Your project has been submitted successfully! Dr. Waseem Akram will evaluate it soon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitProject} className="space-y-3.5">
                  {submitError && (
                    <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Project / Video Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cinematic AI Agriculture Drone"
                      value={submissionTitle}
                      onChange={(e) => setSubmissionTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">AI Prompt Used</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Paste your exact prompt engineered for video generation..."
                      value={usedPrompt}
                      onChange={(e) => setUsedPrompt(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Generated Video Link (Google Drive / Public URL)</label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/file/d/..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Submitting Project...' : 'Submit Final Project to Evaluator'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] bg-[#05070d]/80 py-4 px-6 text-center">
        <p className="text-[11px] text-slate-400 font-light">
          Vspark AI Contest Portal • Evaluator: <strong className="text-slate-200">Dr. Waseem Akram</strong> • Mentor: <strong className="text-slate-200">Sir MS Abdullah</strong>
        </p>
      </footer>
    </div>
  );
}