'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Clock, ExternalLink, Send, AlertTriangle, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';

interface StudentUser {
  id: string;
  full_name: string;
  reg_no: string;
  status: string;
}

export default function ContestRoomPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);

  // Contest config from database
  const [testActive, setTestActive] = useState(false);
  const [scenario, setScenario] = useState('');
  const [teacherDriveLink, setTeacherDriveLink] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Submission form states
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Session check
  useEffect(() => {
    const rawUser = localStorage.getItem('visospark_user');
    if (!rawUser) {
      router.push('/login');
      return;
    }
    const parsedUser: StudentUser = JSON.parse(rawUser);
    if (parsedUser.status !== 'approved') {
      router.push('/login');
      return;
    }
    setCurrentUser(parsedUser);

    const checkExistingSubmission = async () => {
      const { data } = await supabase
        .from('submissions')
        .select('id')
        .eq('student_id', parsedUser.id)
        .maybeSingle();

      if (data) {
        setAlreadySubmitted(true);
      }
    };

    checkExistingSubmission();
  }, [router]);

  // 2. Fetch test configuration & dynamic timestamp calculation
  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase
        .from('test_config')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error || !data) return;

      setScenario(data.scenario || '');
      setTeacherDriveLink(data.teacher_drive_link || '');
      setTestActive(data.is_active || false);

      if (data.is_active && data.start_time && data.duration_minutes) {
        const startMillis = new Date(data.start_time).getTime();
        const durationMillis = Number(data.duration_minutes) * 60 * 1000;
        const deadlineMillis = startMillis + durationMillis;

        const now = Date.now();
        const diffSeconds = Math.max(0, Math.floor((deadlineMillis - now) / 1000));

        setTimeLeft(diffSeconds);
        if (diffSeconds <= 0) {
          setIsTimeUp(true);
        }
      }
    };

    fetchConfig();
    const pollInterval = setInterval(fetchConfig, 10000);
    return () => clearInterval(pollInterval);
  }, []);

  // 3. Countdown timer
  useEffect(() => {
    if (timeLeft === null || !testActive) return;

    if (timeLeft <= 0) {
      setIsTimeUp(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, testActive]);

  // 4. Submission Handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent | null, isAuto = false) => {
      if (e) e.preventDefault();
      if (!currentUser) return;

      if (isTimeUp && !isAuto) {
        alert('Time is up! Submissions are closed.');
        return;
      }

      if (!videoUrl.trim()) {
        setErrorMessage('Please provide your video Google Drive submission link.');
        return;
      }

      setSubmitting(true);
      setErrorMessage('');

      try {
        const { error } = await supabase.from('submissions').insert([
          {
            student_id: currentUser.id,
            student_name: currentUser.full_name,
            reg_no: currentUser.reg_no,
            title: title.trim() || 'AI Prompt Engineering Submission',
            used_prompt: prompt.trim() || 'No prompt specified',
            video_url: videoUrl.trim(),
          },
        ]);

        if (error) throw error;
        setSubmittedSuccess(true);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Submission failed';
        setErrorMessage(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [currentUser, isTimeUp, title, prompt, videoUrl]
  );

  // Auto-submit on time expiry
  useEffect(() => {
    if (isTimeUp && !submittedSuccess && !alreadySubmitted && (videoUrl.trim() || prompt.trim())) {
      handleSubmit(null, true);
    }
  }, [isTimeUp, submittedSuccess, alreadySubmitted, videoUrl, prompt, handleSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs">
        Verifying student session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Contest Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base">Visospark Live Contest</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-blue-500/10 text-sky-400 border border-blue-500/30">
              Vehari Campus
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Student: <strong className="text-white">{currentUser.full_name}</strong> • Unique ID:{' '}
            <span className="font-mono text-sky-400 font-bold bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              {currentUser.reg_no}
            </span>
          </p>
        </div>

        {/* Dynamic Countdown */}
        <div className="flex items-center gap-4">
          {testActive && timeLeft !== null && (
            <div
              className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono text-sm font-bold shadow-lg ${
                isTimeUp
                  ? 'bg-red-950/60 border-red-500/50 text-red-400'
                  : timeLeft < 180
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-emerald-400'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{isTimeUp ? '00:00 - TIME EXPIRED' : `Time Remaining: ${formatTime(timeLeft)}`}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Contest Layout */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">
        {!testActive && (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <Clock className="w-12 h-12 text-blue-400 mx-auto mb-3 animate-spin" />
            <h2 className="text-lg font-bold text-white">Contest Has Not Started Yet</h2>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
              Please wait. As soon as <strong>Dr. Waseem Akram</strong> triggers the test start, your challenge details and reference drive link will activate.
            </p>
          </div>
        )}

        {(alreadySubmitted || submittedSuccess) && (
          <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white">Submission Successfully Received!</h2>
            <p className="text-xs text-slate-300 mt-2 max-w-lg mx-auto">
              Your prompt and video link have been securely logged under Registration No:{' '}
              <strong className="font-mono text-sky-300">{currentUser.reg_no}</strong>. Dr. Waseem Akram will evaluate your output on the admin dashboard.
            </p>
          </div>
        )}

        {testActive && !alreadySubmitted && !submittedSuccess && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Card: Problem Statement & Teacher Drive Link */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-sky-400 mb-2">Test Challenge & Scenario</h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 whitespace-pre-wrap">
                  {scenario || 'Review the reference visual prompts inside the Google Drive folder to construct your AI video prompt.'}
                </p>

                <div className="mt-6">
                  <h4 className="text-xs font-semibold text-slate-300 mb-1.5">Instructor Reference Drive Material:</h4>
                  {teacherDriveLink ? (
                    <a
                      href={teacherDriveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" /> Open Reference Drive Folder
                    </a>
                  ) : (
                    <div className="p-3 text-xs text-amber-300 bg-amber-950/30 rounded-xl border border-amber-500/30">
                      Drive link will be made available shortly by Dr. Waseem Akram.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Form locks automatically the instant timer hits 00:00.
              </div>
            </div>

            {/* Right Card: Submission Form */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-sky-400 mb-4">Your Video Submission</h3>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {isTimeUp ? (
                <div className="p-6 rounded-xl bg-red-950/30 border border-red-500/40 text-center">
                  <Lock className="w-10 h-10 text-red-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-red-300">Time Limit Reached</h4>
                  <p className="text-xs text-slate-400 mt-1">Timer has elapsed. Submissions are strictly closed.</p>
                </div>
              ) : (
                <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Submission Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AI Prompt Narrative #1"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Exact AI Prompt Used (Engineering Details)
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Paste the prompt you formulated to generate the video..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Your Video Link (Google Drive / Cloud Share)
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/file/d/your-video-id/view"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Ensure link access is set to <strong>"Anyone with the link can view"</strong>.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || isTimeUp}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-2 transition-all"
                  >
                    <Send className="w-4 h-4" /> {submitting ? 'Submitting to Portal...' : 'Submit Video Output'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}