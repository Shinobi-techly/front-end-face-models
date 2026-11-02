'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { getDashboardData } from '../../lib/api';
import AdminGuard from '../../components/AdminGuard';
import AnimatedIcon from '../../components/AnimatedIcon';
import DashboardAnalyticsIllustration from '../../components/DashboardAnalyticsIllustration';

const PHOTO = (id) =>
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost/face-attendance-api/api'}/get-student-photo.php?student_id=${id}`;

const FALLBACK_AVATAR = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230f172a"/><text x="50" y="58" text-anchor="middle" fill="%2334d399" font-size="36" font-family="sans-serif">SH</text></svg>`;

/* ── Circular Progress Ring ── */
function Ring({ value, max = 100, size = 44, stroke = 4, color = '#10b981' }) {
    const r = (size - stroke * 2) / 2;
    const circ = 2 * Math.PI * r;
    const safeValue = isNaN(value) || value === null || value === undefined ? 0 : value;
    const offset = circ - (circ * Math.min(safeValue, max)) / max;
    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} className="flex-shrink-0">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={color}
                strokeWidth={stroke}
                strokeDasharray={circ}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 4px ${color}80)` }}
            />
        </svg>
    );
}

/* ── Attendance Status Badge ── */
function Badge({ pct }) {
    if (pct >= 90)
        return (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                Excellent
            </span>
        );
    if (pct >= 75)
        return (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 whitespace-nowrap">
                On Track
            </span>
        );
    if (pct >= 60)
        return (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                Fair
            </span>
        );
    return (
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 whitespace-nowrap">
            At Risk
        </span>
    );
}

export default function DashboardPage() {
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState(null);
    const [filters, setFilters] = useState({ department: 'all', semester: 'all', year_intake: 'all' });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [now, setNow] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setNow(new Date());
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getDashboardData(filters);
            if (data) {
                const loadedStudents = data.students || data.data?.students || [];
                const loadedStats = data.stats || data.statistics || data.data?.stats || data.data?.statistics || null;
                setStudents(loadedStudents);
                setStats(loadedStats);
            }
        } catch (error) {
            console.error('Dashboard load error:', error);
            toast.error('Failed to sync attendance records.');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const t = setInterval(fetchData, 60000);
        return () => clearInterval(t);
    }, [fetchData]);

    const filtered = students.filter((s) => {
        const q = search.toLowerCase();
        const matchSearch =
            !q ||
            s.full_name?.toLowerCase().includes(q) ||
            s.student_id?.toLowerCase().includes(q) ||
            s.department?.toLowerCase().includes(q);
        const matchDept = filters.department === 'all' || s.department === filters.department;
        const matchSem = filters.semester === 'all' || String(s.semester) === String(filters.semester);
        return matchSearch && matchDept && matchSem;
    });

    const totalCount = stats?.total_students || students.length || 0;
    const presentCount = stats?.today_present || 0;
    const absentCount = Math.max(0, totalCount - presentCount);
    const avgRate = Math.round(stats?.average_attendance || 0);
    const presentPct = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
    const absentPct = totalCount > 0 ? Math.round((absentCount / totalCount) * 100) : 0;

    return (
        <AdminGuard title="Salvation Heritage Attendance Dashboard">
            <div
                className="min-h-screen text-slate-100 flex flex-col pb-24 md:pb-0"
                style={{
                    background: 'radial-gradient(ellipse 100% 55% at 50% 0%, #0b1930 0%, #020617 65%)',
                    fontFamily: 'var(--font-inter)',
                }}
            >
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            borderRadius: 14,
                            fontSize: 13,
                            fontWeight: 600,
                            background: '#0f172a',
                            color: '#fff',
                            border: '1px solid rgba(59,130,246,0.3)',
                        },
                    }}
                />

                {/* ── Sticky Navigation Header ── */}
                <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-xl border-b border-blue-500/15 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
                        <Link href="/" className="flex items-center gap-3 no-underline flex-shrink-0 min-w-0">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm sm:text-base shadow-lg shadow-blue-600/30 bg-gradient-to-tr from-blue-600 to-emerald-500 flex-shrink-0">
                                SH
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-black text-white text-base sm:text-lg truncate" style={{ fontFamily: 'var(--font-outfit)' }}>
                                        Salvation Heritage
                                    </span>
                                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                                        Dashboard
                                    </span>
                                </div>
                                <span className="hidden md:block text-slate-400 text-xs truncate">
                                    School Attendance Records
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav Pill Dock */}
                        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
                            <Link
                                href="/"
                                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all no-underline flex items-center gap-1.5 whitespace-nowrap"
                            >
                                <AnimatedIcon type="scan" size={15} />
                                <span>Kiosk</span>
                            </Link>
                            <Link
                                href="/dashboard"
                                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-emerald-600 shadow-md no-underline flex items-center gap-1.5 whitespace-nowrap"
                            >
                                <AnimatedIcon type="dashboard" size={15} />
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                href="/students"
                                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all no-underline flex items-center gap-1.5 whitespace-nowrap"
                            >
                                <AnimatedIcon type="users" size={15} />
                                <span>Directory</span>
                            </Link>
                            <Link
                                href="/register"
                                className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition-all no-underline flex items-center gap-1.5 whitespace-nowrap"
                            >
                                <AnimatedIcon type="register" size={15} />
                                <span>Register</span>
                            </Link>
                        </nav>

                        {/* Right Controls */}
                        <div className="flex items-center gap-2.5 flex-shrink-0">
                            {now && (
                                <div className="hidden lg:block text-right">
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase">
                                        {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </p>
                                    <p className="text-xs font-mono font-bold text-emerald-400">{now.toLocaleTimeString()}</p>
                                </div>
                            )}
                            <button
                                onClick={fetchData}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-md transition-all whitespace-nowrap cursor-pointer"
                            >
                                <AnimatedIcon type="refresh" size={14} className={loading ? 'animate-spin' : ''} />
                                <span className="hidden xs:inline">Refresh</span>
                            </button>
                            <button
                                onClick={() => setMobileOpen((v) => !v)}
                                aria-label="Toggle Menu"
                                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 text-slate-200 border border-slate-800 cursor-pointer"
                            >
                                {mobileOpen ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {mobileOpen && (
                        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-1.5">
                            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-900 no-underline">
                                <AnimatedIcon type="scan" size={16} />
                                <span>Attendance Kiosk</span>
                            </Link>
                            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 no-underline">
                                <AnimatedIcon type="dashboard" size={16} />
                                <span>Admin Dashboard</span>
                            </Link>
                            <Link href="/students" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-900 no-underline">
                                <AnimatedIcon type="users" size={16} />
                                <span>Student Directory</span>
                            </Link>
                            <Link href="/register" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-400 hover:bg-slate-900 no-underline">
                                <AnimatedIcon type="register" size={16} />
                                <span>Register Student</span>
                            </Link>
                        </div>
                    )}
                </header>

                {/* ── Main Content ── */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 w-full space-y-6 sm:space-y-8">
                    <DashboardAnalyticsIllustration />

                    {/* ── 4 Bento KPI Cards ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
                        {/* Total Enrolled */}
                        <div className="bento-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden">
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                                    Total Enrolled
                                </span>
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-blue-500/15 border border-blue-500/30 flex-shrink-0">
                                    <AnimatedIcon type="users" size={18} style={{ color: '#60a5fa' }} />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
                                    {totalCount}
                                </span>
                                <span className="text-xs font-semibold text-blue-300 truncate">students</span>
                            </div>
                            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 w-full rounded-full" />
                            </div>
                        </div>

                        {/* Present Today */}
                        <div className="bento-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden">
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                                    Present Today
                                </span>
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-emerald-500/15 border border-emerald-500/30 flex-shrink-0">
                                    <AnimatedIcon type="check" size={18} style={{ color: '#34d399' }} />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl sm:text-4xl font-black text-emerald-400" style={{ fontFamily: 'var(--font-outfit)' }}>
                                    {presentCount}
                                </span>
                                <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                                    {presentPct}%
                                </span>
                            </div>
                            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${Math.max(8, presentPct)}%` }} />
                            </div>
                        </div>

                        {/* Absent Today */}
                        <div className="bento-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden">
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                                    Absent Today
                                </span>
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-amber-500/15 border border-amber-500/30 flex-shrink-0">
                                    <AnimatedIcon type="clock" size={18} style={{ color: '#fbbf24' }} />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl sm:text-4xl font-black text-amber-400" style={{ fontFamily: 'var(--font-outfit)' }}>
                                    {absentCount}
                                </span>
                                <span className="text-xs font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full">
                                    {absentPct}%
                                </span>
                            </div>
                            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full" style={{ width: `${Math.max(8, absentPct)}%` }} />
                            </div>
                        </div>

                        {/* Overall Rate */}
                        <div className="bento-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden">
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                                    Avg Attendance
                                </span>
                                <Ring value={avgRate} max={100} size={38} stroke={4} color="#06b6d4" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl sm:text-4xl font-black text-cyan-400" style={{ fontFamily: 'var(--font-outfit)' }}>
                                    {avgRate}%
                                </span>
                                <span className="text-xs font-semibold text-slate-400 truncate">overall</span>
                            </div>
                            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${Math.max(10, avgRate)}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* ── Student Attendance Roster Card ── */}
                    <div className="bento-card rounded-3xl p-4 sm:p-6 lg:p-8">
                        {/* Header & Search */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                                        ATTENDANCE RECORDS
                                    </span>
                                </div>
                                <h2 className="text-lg sm:text-2xl font-black text-white mt-0.5" style={{ fontFamily: 'var(--font-outfit)' }}>
                                    Student Attendance Roster ({filtered.length})
                                </h2>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                {/* Search Input */}
                                <div className="relative w-full sm:w-64 md:w-72">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search student name, ID, or class..."
                                        className="input-premium pl-9 py-2.5 text-xs"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <AnimatedIcon type="search" size={14} />
                                    </span>
                                </div>

                                {/* Term Filter */}
                                <select
                                    value={filters.semester}
                                    onChange={(e) => setFilters((p) => ({ ...p, semester: e.target.value }))}
                                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-950 text-white border border-blue-500/30 focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="all">All Academic Terms</option>
                                    <option value="1">1st Term</option>
                                    <option value="2">2nd Term</option>
                                    <option value="3">3rd Term</option>
                                </select>
                            </div>
                        </div>

                        {/* Quick Class Filter Pills */}
                        <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
                            {['all', 'JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'].map((cls) => {
                                const active = filters.department === cls;
                                return (
                                    <button
                                        key={cls}
                                        onClick={() => setFilters((p) => ({ ...p, department: cls }))}
                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                            active
                                                ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-md'
                                                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                                        }`}
                                    >
                                        {cls === 'all' ? 'All Classes' : cls}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Roster Content */}
                        {loading ? (
                            <div className="py-16 text-center">
                                <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3" />
                                <p className="text-slate-400 text-xs font-semibold">Loading attendance records...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="py-14 text-center">
                                <p className="text-slate-400 text-sm font-bold">No matching student records found.</p>
                                <p className="text-slate-500 text-xs mt-1">Try clearing your search or selecting another class filter.</p>
                            </div>
                        ) : (
                            <>
                                {/* Mobile & Small Screen Card Deck */}
                                <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {filtered.map((s) => {
                                        const pct = s.attendance_percentage ?? 0;
                                        return (
                                            <div key={s.student_id || s.id} className="p-4 rounded-2xl bg-slate-950/85 border border-blue-500/20 space-y-3">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-900 border border-blue-500/30 flex-shrink-0">
                                                            <img
                                                                src={PHOTO(s.student_id)}
                                                                alt={s.full_name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.src = FALLBACK_AVATAR;
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-white text-sm truncate">{s.full_name}</p>
                                                            <p className="text-xs text-emerald-400 font-mono">{s.student_id}</p>
                                                        </div>
                                                    </div>
                                                    <Badge pct={pct} />
                                                </div>

                                                <div className="flex items-center justify-between gap-2 text-xs pt-2 border-t border-slate-800/80">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-bold text-blue-300 px-2.5 py-0.5 rounded-lg bg-blue-500/15 border border-blue-500/25 text-[10px]">
                                                            {s.department}
                                                        </span>
                                                        <span className="font-bold text-slate-300 px-2 py-0.5 rounded-lg bg-slate-900 text-[10px]">
                                                            {s.semester === 1 ? '1st Term' : s.semester === 2 ? '2nd Term' : s.semester === 3 ? '3rd Term' : `Term ${s.semester}`}
                                                        </span>
                                                    </div>
                                                    <span className="font-mono font-bold text-emerald-400 text-xs">{pct}%</span>
                                                </div>

                                                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full"
                                                        style={{ width: `${Math.min(100, pct)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Desktop Data Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                <th className="text-left py-3.5 px-4">Student</th>
                                                <th className="text-left py-3.5 px-4">Class</th>
                                                <th className="text-left py-3.5 px-4">Term</th>
                                                <th className="text-left py-3.5 px-4">Attendance Progress</th>
                                                <th className="text-left py-3.5 px-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60">
                                            {filtered.map((s) => {
                                                const pct = s.attendance_percentage ?? 0;
                                                return (
                                                    <tr key={s.student_id || s.id} className="hover:bg-slate-900/60 transition-colors">
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-950 border border-blue-500/30 flex-shrink-0">
                                                                    <img
                                                                        src={PHOTO(s.student_id)}
                                                                        alt={s.full_name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.src = FALLBACK_AVATAR;
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-white text-sm">{s.full_name}</p>
                                                                    <p className="text-xs text-emerald-400 font-mono">{s.student_id}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold">
                                                                {s.department}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-4 text-xs font-semibold text-slate-300">
                                                            {s.semester === 1 ? '1st Term' : s.semester === 2 ? '2nd Term' : s.semester === 3 ? '3rd Term' : `Term ${s.semester}`}
                                                        </td>
                                                        <td className="py-3.5 px-4 w-64">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex-1 h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                                                                    <div
                                                                        className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full"
                                                                        style={{ width: `${Math.min(100, pct)}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-xs font-mono font-bold text-white w-10 text-right">
                                                                    {pct}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <Badge pct={pct} />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </main>

                {/* ── Footer ── */}
                <footer className="border-t border-blue-500/15 bg-slate-950/95 py-6 text-xs text-slate-400">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-black bg-gradient-to-tr from-blue-600 to-emerald-500">
                                SH
                            </div>
                            <span className="font-semibold text-slate-300">Salvation Heritage High School</span>
                        </div>
                        <Link href="/students" className="text-emerald-400 hover:text-emerald-300 font-semibold no-underline">
                            Open Student Directory
                        </Link>
                    </div>
                </footer>

                {/* ── Mobile Bottom Bar ── */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 py-2 px-3 flex items-center justify-around shadow-2xl">
                    <Link href="/" className="flex flex-col items-center gap-1 py-1 px-3 text-slate-400 hover:text-white no-underline">
                        <AnimatedIcon type="scan" size={20} />
                        <span className="text-[10px] font-bold">Kiosk</span>
                    </Link>
                    <Link href="/register" className="flex flex-col items-center gap-1 py-1 px-3 text-slate-400 hover:text-white no-underline">
                        <AnimatedIcon type="register" size={20} />
                        <span className="text-[10px] font-bold">Register</span>
                    </Link>
                    <Link href="/dashboard" className="flex flex-col items-center gap-1 py-1 px-3 text-emerald-400 font-black no-underline">
                        <AnimatedIcon type="dashboard" size={20} />
                        <span className="text-[10px] font-bold">Admin</span>
                    </Link>
                    <Link href="/students" className="flex flex-col items-center gap-1 py-1 px-3 text-slate-400 hover:text-white no-underline">
                        <AnimatedIcon type="users" size={20} />
                        <span className="text-[10px] font-bold">Students</span>
                    </Link>
                </div>
            </div>
        </AdminGuard>
    );
}
