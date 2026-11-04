'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { 
  Users, CheckCircle2, XCircle, Clock, ExternalLink, 
  Settings, LogOut, RefreshCw, Save, Video, Trophy, Play,
  Lock, ShieldAlert, KeyRound, Eye, EyeOff, MessageSquare,
  Calendar, MapPin, Trash2
} from 'lucide-react';

interface StudentProfile {
  id: string;
  full_name: string;
  reg_no: string;
  whatsapp_no?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface Submission {
  id: string;
  student_id: string;
  student_name: string;
  reg_no: string;
  title: string;
  used_prompt: string;
  video_url: string;
  submitted_at: string;
  score: number | null;
  feedback: string;
}

export default function AdminDashboardPage() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const authSession = sessionStorage.getItem('Vspark_admin_auth');
    if (authSession === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === 'Dr_404.') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('Vspark_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect Password. Please enter valid Dr. Waseem Akram key.');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('Vspark_admin_auth');
    setIsAdminAuthenticated(false);
    setAdminPasswordInput('');
  };

  const [activeTab, setActiveTab] = useState<'approvals' | 'testConfig' | 'submissions' | 'leaderboard'>('approvals');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Contest Info & Event Schedule States
  const [testTitle, setTestTitle] = useState('');
  const [eventDate, setEventDate] = useState('02 November 2026 - 10:00 AM');
  const [eventVenue, setEventVenue] = useState('Computer Lab 01, CS Department, CUI Vehari');
  const [scenario, setScenario] = useState('');
  const [teacherDriveLink, setTeacherDriveLink] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [configSaving, setConfigSaving] = useState(false);
  const [configMessage, setConfigMessage] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: studentsData, error: stuErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (stuErr) throw stuErr;
      setStudents(studentsData || []);

      const { data: configData, error: cfgErr } = await supabase
        .from('test_config')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (cfgErr) throw cfgErr;
      if (configData) {
        setTestTitle(configData.title || '');
        setEventDate(configData.event_date || '02 November 2026 - 10:00 AM');
        setEventVenue(configData.event_venue || 'Computer Lab 01, CS Department, CUI Vehari');
        setScenario(configData.scenario || '');
        setTeacherDriveLink(configData.teacher_drive_link || '');
        setDurationMinutes(configData.duration_minutes || 15);
        setIsActive(configData.is_active || false);
        setStartTime(configData.start_time || null);
      }

      const { data: subData, error: subErr } = await supabase
        .from('submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (subErr) throw subErr;
      setSubmissions(subData || []);
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'Error fetching admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchData();
    }
  }, [isAdminAuthenticated]);

  const handleUpdateStatus = async (studentId: string, newStatus: 'approved' | 'rejected') => {
    setActionLoading(studentId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', studentId);

      if (error) throw error;
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, status: newStatus } : s))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update student status');
    } finally {
      setActionLoading(null);
    }
  };

  // Student Delete Handler (Standard English Dialogs)
  const handleDeleteStudent = async (studentId: string, studentName: string, regNo: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete student "${studentName}" (${regNo})?\n\nThis record will be permanently removed from the portal database.`
    );
    if (!confirmDelete) return;

    setActionLoading(studentId);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', studentId);

      if (error) throw error;

      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      alert(`Student record for "${studentName}" (${regNo}) has been deleted successfully.`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete student record. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigSaving(true);
    setConfigMessage('');
    try {
      const { error } = await supabase
        .from('test_config')
        .update({
          title: testTitle,
          event_date: eventDate,
          event_venue: eventVenue,
          scenario,
          teacher_drive_link: teacherDriveLink,
          duration_minutes: durationMinutes,
          is_active: isActive,
        })
        .eq('id', 1);

      if (error) throw error;
      setConfigMessage('Contest schedule and configuration saved successfully!');
    } catch (err) {
      setConfigMessage(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setConfigSaving(false);
    }
  };

  const handleStartContestNow = async () => {
    if (!confirm(`Start contest now for ${durationMinutes} minutes?`)) return;

    setConfigSaving(true);
    try {
      const currentUtcTimestamp = new Date().toISOString();
      const { error } = await supabase
        .from('test_config')
        .update({
          title: testTitle,
          event_date: eventDate,
          event_venue: eventVenue,
          scenario,
          teacher_drive_link: teacherDriveLink,
          duration_minutes: durationMinutes,
          start_time: currentUtcTimestamp,
          is_active: true,
        })
        .eq('id', 1);

      if (error) throw error;
      setIsActive(true);
      setStartTime(currentUtcTimestamp);
      alert(`Contest is LIVE! Duration: ${durationMinutes} minutes.`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error starting contest');
    } finally {
      setConfigSaving(false);
    }
  };

  const handleScoreUpdate = async (subId: string, scoreVal: number, feedbackVal: string) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ score: scoreVal, feedback: feedbackVal })
        .eq('id', subId);

      if (error) throw error;
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === subId ? { ...sub, score: scoreVal, feedback: feedbackVal } : sub))
      );
      alert('Marks saved successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error saving marks');
    }
  };

  const rankedSubmissions = [...submissions]
    .filter((s) => s.score !== null)
    .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));

  const filteredStudents = students.filter((student) => {
    if (statusFilter === 'all') return true;
    return student.status === statusFilter;
  });

  const pendingCount = students.filter((s) => s.status === 'pending').length;
  const approvedCount = students.filter((s) => s.status === 'approved').length;
  const rejectedCount = students.filter((s) => s.status === 'rejected').length;

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-md">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3 shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Admin Gatekeeper</h2>
            <p className="text-xs text-sky-400 mt-1">Dr. Waseem Akram • COMSATS Vehari</p>
          </div>

          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} autoComplete="off" className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Enter admin password..."
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                  autoFocus
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
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all mt-2"
            >
              Verify & Unlock Portal
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              ← Go Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
            CUI
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white leading-tight">Vspark Admin Evaluation</h1>
            <p className="text-[11px] text-sky-400 truncate max-w-[200px] sm:max-w-none">Dr. Waseem Akram • Vehari Campus</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs border border-red-500/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock & Exit</span>
          </button>
        </div>
      </header>

      <div className="border-b border-slate-800 bg-slate-900/40 px-4 sm:px-6 py-2 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'approvals'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" /> Approvals ({pendingCount})
          </button>

          <button
            onClick={() => setActiveTab('testConfig')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'testConfig'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-4 h-4" /> Test Setup & Schedule
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'submissions'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Video className="w-4 h-4" /> Submissions ({submissions.length})
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Trophy className="w-4 h-4" /> Top-3 Leaderboard
          </button>
        </div>
      </div>

      <main className="flex-1 p-3 sm:p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'approvals' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Student Registration Approvals</h2>
                <p className="text-xs text-slate-400 mt-0.5">Filter registration status and manage students directly.</p>
              </div>

              <div className="inline-flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    statusFilter === 'all'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({students.length})
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    statusFilter === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'text-slate-400 hover:text-amber-300'
                  }`}
                >
                  <Clock className="w-3 h-3" /> Pending ({pendingCount})
                </button>
                <button
                  onClick={() => setStatusFilter('approved')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    statusFilter === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'text-slate-400 hover:text-emerald-300'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" /> Approved ({approvedCount})
                </button>
                <button
                  onClick={() => setStatusFilter('rejected')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    statusFilter === 'rejected'
                      ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/40'
                      : 'text-slate-400 hover:text-red-300'
                  }`}
                >
                  <XCircle className="w-3 h-3" /> Rejected ({rejectedCount})
                </button>
              </div>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs sm:text-sm">
                No students found under this filter ({statusFilter.toUpperCase()}).
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Reg No</th>
                      <th className="py-3 px-4">WhatsApp Contact</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-semibold text-white">{student.full_name}</td>
                        <td className="py-3 px-4 font-mono font-bold text-sky-400">
                          <span className="bg-blue-950/60 border border-blue-500/30 px-2 py-0.5 rounded text-[11px]">
                            {student.reg_no}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {student.whatsapp_no ? (
                            <a
                              href={`https://wa.me/${student.whatsapp_no.replace('+', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-500/40 text-[11px] font-mono font-bold"
                            >
                              <MessageSquare className="w-3 h-3 text-emerald-400" />
                              {student.whatsapp_no}
                            </a>
                          ) : (
                            <span className="text-slate-500 italic">No number</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {student.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          )}
                          {student.status === 'approved' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" /> Approved
                            </span>
                          )}
                          {student.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-300 border border-red-500/30">
                              <XCircle className="w-3 h-3" /> Rejected
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          {student.status !== 'approved' && (
                            <button
                              disabled={actionLoading === student.id}
                              onClick={() => handleUpdateStatus(student.id, 'approved')}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-xs shadow-sm"
                            >
                              Approve
                            </button>
                          )}
                          {student.status !== 'rejected' && (
                            <button
                              disabled={actionLoading === student.id}
                              onClick={() => handleUpdateStatus(student.id, 'rejected')}
                              className="px-2.5 py-1 rounded bg-amber-600/30 hover:bg-amber-600/50 disabled:opacity-40 text-amber-300 border border-amber-500/30 font-semibold text-xs"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            disabled={actionLoading === student.id}
                            onClick={() => handleDeleteStudent(student.id, student.full_name, student.reg_no)}
                            title="Delete Student Record"
                            className="p-1 rounded bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 border border-red-500/30 text-xs inline-flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'testConfig' && (
          <div className="max-w-2xl bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <h2 className="text-base sm:text-lg font-bold text-white mb-1">Test Setup & Schedule Notice</h2>
            <p className="text-xs text-slate-400 mb-6">Contest schedule, drive materials and duration settings.</p>

            {configMessage && (
              <div className="mb-4 p-3 rounded-xl bg-blue-950/40 border border-blue-500/40 text-blue-300 text-xs">
                {configMessage}
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Test / Challenge Title</label>
                <input
                  type="text"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="e.g. Vspark AI Video Prompt Challenge 2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" /> Contest Date & Time (Student Notice)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 05 November 2026 - 11:00 AM"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Event Venue / Location (Student Notice)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS Lab 01, Academic Block, CUI Vehari"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Teacher Google Drive Link (Reference Prompts / Assets)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={teacherDriveLink}
                  onChange={(e) => setTeacherDriveLink(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Scenario / Problem Statement</label>
                <textarea
                  rows={3}
                  value={scenario}
                  placeholder="Write the challenge statement for students..."
                  onChange={(e) => setScenario(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Duration in Minutes</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                  />
                </div>

                <div className="flex items-center">
                  <label className="inline-flex items-center gap-2 cursor-pointer pt-2 sm:pt-4">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <span className="text-xs font-semibold text-slate-300">Enable Test Visibility</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={configSaving}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Schedule & Settings
                </button>
                <button
                  type="button"
                  onClick={handleStartContestNow}
                  disabled={configSaving}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-white" /> Start Live Contest ({durationMinutes} Min)
                </button>
              </div>

              {startTime && (
                <div className="text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 p-2.5 rounded-lg text-center font-mono">
                  Active Server Timestamp: {new Date(startTime).toLocaleTimeString()}
                </div>
              )}
            </form>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <h2 className="text-base sm:text-lg font-bold text-white mb-1">Student Video Submissions & Evaluation</h2>
            <p className="text-xs text-slate-400 mb-4">Prompt details verify karein aur marks assign karein.</p>

            {submissions.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs sm:text-sm">No submissions received yet.</div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => {
                  const studentProfile = students.find((s) => s.reg_no === sub.reg_no);

                  return (
                    <div
                      key={sub.id}
                      className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col lg:flex-row gap-4 justify-between items-start"
                    >
                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-white">{sub.student_name}</span>
                          <span className="px-2 py-0.5 rounded bg-blue-900/50 border border-blue-500/40 text-blue-300 font-mono text-xs font-bold">
                            {sub.reg_no}
                          </span>
                          
                          {studentProfile?.whatsapp_no && (
                            <a
                              href={`https://wa.me/${studentProfile.whatsapp_no.replace('+', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono"
                            >
                              <MessageSquare className="w-3 h-3 text-emerald-400" />
                              {studentProfile.whatsapp_no}
                            </a>
                          )}

                          <span className="text-[11px] text-slate-500 ml-auto">
                            {new Date(sub.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300">
                          <span className="text-slate-500">Theme: </span>
                          <strong>{sub.title}</strong>
                        </div>

                        <div className="text-xs bg-slate-900 p-3 rounded-lg border border-slate-800">
                          <span className="text-sky-400 font-semibold block mb-1">Used AI Prompt:</span>
                          <p className="font-mono text-[11px] text-slate-300 whitespace-pre-wrap break-words">
                            {sub.used_prompt}
                          </p>
                        </div>

                        <div className="pt-1">
                          <a
                            href={sub.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                          >
                            <Video className="w-3.5 h-3.5" /> Watch Video Submission <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      <div className="w-full lg:w-64 bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2.5">
                        <div className="text-xs font-bold text-slate-300 uppercase">Grading Panel</div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Score (0 - 100)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            defaultValue={sub.score ?? ''}
                            id={`score-${sub.id}`}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            placeholder="85"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Feedback</label>
                          <input
                            type="text"
                            defaultValue={sub.feedback || ''}
                            id={`feedback-${sub.id}`}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            placeholder="Feedback..."
                          />
                        </div>
                        <button
                          onClick={() => {
                            const scoreInput = document.getElementById(`score-${sub.id}`) as HTMLInputElement;
                            const feedbackInput = document.getElementById(`feedback-${sub.id}`) as HTMLInputElement;
                            handleScoreUpdate(sub.id, Number(scoreInput.value), feedbackInput.value);
                          }}
                          className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg"
                        >
                          Save Marks
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <h2 className="text-base sm:text-lg font-bold text-white mb-1">Vspark Top Performers Leaderboard</h2>
            <p className="text-xs text-slate-400 mb-6">Dr. Waseem Akram ke marks se live ranking aur winner contact details.</p>

            {rankedSubmissions.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs sm:text-sm">No students graded yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {rankedSubmissions.slice(0, 3).map((sub, index) => {
                  const medals = ['🥇 1st Place', '🥈 2nd Place', '🥉 3rd Place'];
                  const borders = [
                    'border-amber-500/60 bg-amber-950/20',
                    'border-slate-400/60 bg-slate-900/40',
                    'border-amber-700/60 bg-amber-950/10',
                  ];

                  const studentProfile = students.find((s) => s.reg_no === sub.reg_no);

                  return (
                    <div
                      key={sub.id}
                      className={`p-5 sm:p-6 rounded-2xl border ${borders[index]} flex flex-col items-center text-center`}
                    >
                      <div className="text-2xl font-black mb-1">{medals[index]}</div>
                      <div className="text-base sm:text-lg font-bold text-white">{sub.student_name}</div>
                      <div className="font-mono text-xs font-bold text-sky-400 mt-1 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                        {sub.reg_no}
                      </div>

                      {studentProfile?.whatsapp_no && (
                        <a
                          href={`https://wa.me/${studentProfile.whatsapp_no.replace('+', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          Chat: {studentProfile.whatsapp_no}
                        </a>
                      )}

                      <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-3">
                        {sub.score} <span className="text-xs text-slate-400">/ 100</span>
                      </div>

                      {sub.feedback && (
                        <p className="text-xs text-slate-300 italic mt-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 w-full">
                          "{sub.feedback}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}