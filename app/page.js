'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CameraCapture from '../components/CameraCapture';
import AOSInit from '../components/AOSInit';
import AnimatedIcon from '../components/AnimatedIcon';
import BiometricHeroIllustration from '../components/BiometricHeroIllustration';
import KioskGuideIllustration from '../components/KioskGuideIllustration';
import AttendanceSuccessIllustration from '../components/AttendanceSuccessIllustration';
import StopSessionModal from '../components/StopSessionModal';
import WrongPasswordModal from '../components/WrongPasswordModal';
import ParticleField from '../components/ParticleField';
import { recognizeFace, getStats, loginLecturer, stopSession, NIGERIAN_FACULTY } from '../lib/api';
import toast, { Toaster } from 'react-hot-toast';

const PHOTO_URL = (id) =>
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost/face-attendance-api/api'}/get-student-photo.php?student_id=${id}`;

const FALLBACK_SVG = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230f172a"/><text x="50" y="58" text-anchor="middle" fill="%2334d399" font-size="38" font-family="sans-serif">SH</text></svg>`;

/* ── Live School Clock ── */
function LiveClock() {
    const [time, setTime] = useState(null);
    useEffect(() => {
        setTime(new Date());
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    if (!time) {
        return (
            <div className="h-14 flex items-center justify-center">
                <span className="text-xs font-mono text-slate-500 animate-pulse">Loading clock...</span>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Current Time
                </span>
            </div>
            <p
                className="tabular-nums text-2xl sm:text-3xl font-black text-white tracking-tight leading-none my-1"
                style={{ fontFamily: 'var(--font-mono)' }}
            >
                {time.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-emerald-400 text-[11px] font-semibold tracking-wide truncate">
                {time.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
        </div>
    );
}

/* ── Animated Counter ── */
function AnimatedCounter({ value, duration = 1000 }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        let start = 0;
        const target = Number(value) || 0;
        if (target === 0) {
            setDisplay(0);
            return;
        }
        const step = Math.max(1, target / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setDisplay(target);
                clearInterval(timer);
            } else {
                setDisplay(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value, duration]);
    return <>{display}</>;
}

/* ── Bento KPI Card ── */
function StatCard({ icon, value, suffix = '', label, sublabel, color, delay = 0 }) {
    const themes = {
        emerald: {
            border: 'rgba(16, 185, 129, 0.3)',
            bg: 'linear-gradient(155deg, rgba(6, 34, 36, 0.85) 0%, rgba(4, 13, 26, 0.95) 100%)',
            iconBg: 'rgba(16, 185, 129, 0.14)',
            iconColor: '#34d399',
            textColor: '#6ee7b7',
            bar: 'from-emerald-500 to-teal-400',
        },
        blue: {
            border: 'rgba(59, 130, 246, 0.3)',
            bg: 'linear-gradient(155deg, rgba(12, 28, 58, 0.85) 0%, rgba(4, 13, 26, 0.95) 100%)',
            iconBg: 'rgba(59, 130, 246, 0.14)',
            iconColor: '#60a5fa',
            textColor: '#93c5fd',
            bar: 'from-blue-500 to-cyan-400',
        },
        violet: {
            border: 'rgba(139, 92, 246, 0.3)',
            bg: 'linear-gradient(155deg, rgba(28, 19, 58, 0.85) 0%, rgba(4, 13, 26, 0.95) 100%)',
            iconBg: 'rgba(139, 92, 246, 0.14)',
            iconColor: '#a78bfa',
            textColor: '#c4b5fd',
            bar: 'from-violet-500 to-blue-400',
        },
    };
    const t = themes[color] || themes.blue;

    return (
        <div
            data-aos="fade-up"
            data-aos-delay={delay}
            style={{
                background: t.bg,
                border: `1px solid ${t.border}`,
                boxShadow: '0 16px 40px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
            }}
            className="rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
        >
            <div className="flex items-center gap-3.5">
                <div
                    style={{ background: t.iconBg, border: `1px solid ${t.border}` }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                >
                    <AnimatedIcon type={icon} size={20} style={{ color: t.iconColor }} />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1">
                        <p className="text-white font-black text-2xl sm:text-3xl leading-none tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                            <AnimatedCounter value={value} />
                            {suffix}
                        </p>
                    </div>
                    <p className="text-xs font-bold mt-1 whitespace-nowrap truncate" style={{ color: t.textColor }}>
                        {label}
                    </p>
                    {sublabel && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{sublabel}</p>
                    )}
                </div>
            </div>
            <div className="mt-3 h-1 w-full rounded-full bg-slate-900/90 overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${t.bar} w-3/4 opacity-80`} />
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN ATTENDANCE KIOSK PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [lastAttendance, setLastAttendance] = useState(null);
    const [todayCount, setTodayCount] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [activeLecturer, setActiveLecturer] = useState(null);
    const [showFacultyModal, setShowFacultyModal] = useState(false);
    const [facultyUser, setFacultyUser] = useState('');
    const [facultyPass, setFacultyPass] = useState('');
    const [facultyLoading, setFacultyLoading] = useState(false);
    const [facultyError, setFacultyError] = useState('');
    const [showFacultyPicker, setShowFacultyPicker] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showStopWarning, setShowStopWarning] = useState(false);
    const [activeSessionToStop, setActiveSessionToStop] = useState(null);
    const [stoppingSession, setStoppingSession] = useState(false);
    const [showWrongModal, setShowWrongModal] = useState(false);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        try {
            const saved = localStorage.getItem('fa_lecturer');
            if (saved) setActiveLecturer(JSON.parse(saved));
        } catch { /* ignore */ }
        return () => { isMounted.current = false; };
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const stats = await getStats();
            if (stats && isMounted.current) {
                setTodayCount(stats.today?.present ?? stats.present ?? 0);
                setTotalStudents(stats.today?.total_students ?? stats.total_students ?? 0);
            }
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        fetchStats();
        const t = setInterval(fetchStats, 30000);
        return () => clearInterval(t);
    }, [fetchStats]);

    const handleCapture = useCallback(async (imageDataUrl) => {
        if (!isMounted.current) return;
        setIsLoading(true);
        try {
            const result = await recognizeFace(imageDataUrl);
            if (!isMounted.current) return;

            if (result.success && result.student) {
                const studentName = result.student.full_name || result.student.name || 'Student';
                const isAlreadyMarked = result.already_marked === true || result.attendance_marked === false;

                if (isAlreadyMarked) {
                    toast(`Welcome back, ${studentName}! Attendance already recorded.`, {
                        duration: 5000,
                        style: { border: '1px solid rgba(245,158,11,0.4)', background: '#0f172a', color: '#fef3c7', fontWeight: 600 },
                    });
                } else {
                    toast.success(result.message || `Attendance marked for ${studentName}!`, { duration: 4000 });
                }

                setLastAttendance({
                    student: result.student,
                    confidence: result.confidence,
                    timestamp: result.timestamp || new Date().toLocaleTimeString(),
                    alreadyMarked: isAlreadyMarked,
                    recognitionQuality: result.recognition_quality,
                });
                fetchStats();
                setTimeout(() => { if (isMounted.current) setLastAttendance(null); }, 6000);
            } else {
                const msg = result.message || 'Face not recognized. Please try again.';
                toast.error(msg, { duration: 4000 });
                setLastAttendance({ error: true, message: msg, timestamp: new Date().toLocaleTimeString() });
            }
        } catch (error) {
            if (!isMounted.current) return;
            toast.error(error.message || 'Network error. Check connection.', { duration: 5000 });
            setLastAttendance({ error: true, message: error.message || 'Network error.', timestamp: new Date().toLocaleTimeString() });
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    }, [fetchStats]);

    const handleFacultyAction = () => {
        try {
            const saved = localStorage.getItem('fa_lecturer');
            if (saved) { router.push('/lecturer'); return; }
        } catch { /* ignore */ }
        setShowFacultyModal(true);
    };

    const handleFacultySignOut = (e) => {
        if (e) e.stopPropagation();
        try {
            const savedSess = sessionStorage.getItem('fa_session');
            if (savedSess) {
                const parsed = JSON.parse(savedSess);
                if (parsed && parsed.id) {
                    setActiveSessionToStop(parsed);
                    setShowStopWarning(true);
                    return;
                }
            }
        } catch { /* ignore */ }
        localStorage.removeItem('fa_lecturer');
        sessionStorage.removeItem('fa_session');
        setActiveLecturer(null);
        toast.success('Signed out from Faculty Portal.', { duration: 3000 });
    };

    const handleStopSessionFromHome = async () => {
        if (!activeSessionToStop) return;
        setStoppingSession(true);
        try {
            await stopSession({
                session_id: activeSessionToStop.id,
                lecturer_id: activeLecturer?.lecturer_id,
            });
            sessionStorage.removeItem('fa_session');
            localStorage.removeItem('fa_lecturer');
            setActiveSessionToStop(null);
            setShowStopWarning(false);
            setActiveLecturer(null);
            toast.success('Class session stopped and signed out.', { duration: 3500 });
        } catch (err) {
            toast.error(err.message || 'Could not stop session. Opening Faculty Portal...');
            router.push('/lecturer');
        } finally {
            setStoppingSession(false);
        }
    };

    const handleFacultyLogin = async (e) => {
        if (e) e.preventDefault();
        setFacultyError('');
        if (!facultyUser.trim()) { setFacultyError('Please enter your Username or Lecturer ID'); return; }
        if (!facultyPass.trim()) { setFacultyError('Please enter your password'); return; }
        setFacultyLoading(true);
        try {
            const res = await loginLecturer(facultyUser.trim(), facultyPass.trim());
            if (res.success && res.lecturer) {
                localStorage.setItem('fa_lecturer', JSON.stringify(res.lecturer));
                setActiveLecturer(res.lecturer);
                toast.success(res.message || `Welcome, ${res.lecturer.full_name}!`, { duration: 3000 });
                setShowFacultyModal(false);
                router.push('/lecturer');
            } else {
                setFacultyError('Wrong password. Please try again or meet the Admin.');
                setShowWrongModal(true);
            }
        } catch (err) {
            setFacultyError(err.message || 'Login failed.');
            setShowWrongModal(true);
        } finally {
            setFacultyLoading(false);
        }
    };

    const selectFacultyProfile = (lec) => {
        setFacultyUser(lec.username);
        setFacultyPass(lec.password);
        setFacultyError('');
        setShowFacultyPicker(false);
    };

    const percentage = totalStudents > 0 ? Math.round((todayCount / totalStudents) * 100) : 0;

    return (
        <div
            className="min-h-screen text-slate-100 flex flex-col pb-24 md:pb-0"
            style={{
                background: 'radial-gradient(ellipse 100% 55% at 50% 0%, #0b1930 0%, #020617 65%)',
                fontFamily: 'var(--font-inter)',
            }}
        >
            <AOSInit />
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        borderRadius: 14,
                        fontSize: 13,
                        fontWeight: 600,
                        background: '#0f172a',
                        color: '#fff',
                        border: '1px solid rgba(59,130,246,0.3)',
                        boxShadow: '0 20px 60px -12px rgba(0,0,0,0.85)',
                    },
                    success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                }}
            />

            {/* ── Top School Bar ── */}
            <div className="bg-slate-950/90 border-b border-blue-500/15 py-2 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <span className="relative flex h-2 w-2 flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-[11px] font-bold text-slate-200 truncate">
                            Salvation Heritage High School
                        </span>
                    </div>

                    {activeLecturer ? (
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={handleFacultyAction}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all whitespace-nowrap cursor-pointer"
                            >
                                <AnimatedIcon type="faculty" size={13} />
                                <span className="hidden sm:inline">{activeLecturer.full_name.split(' ')[0]}&apos;s</span>
                                <span>Portal</span>
                            </button>
                            <button
                                onClick={handleFacultySignOut}
                                className="text-[11px] font-bold text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 transition-colors whitespace-nowrap cursor-pointer"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleFacultyAction}
                            className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 border border-white/15 shadow-sm transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
                        >
                            <AnimatedIcon type="faculty" size={13} />
                            <span>Faculty Portal</span>
                        </button>
                    )}
                </div>
            </div>

            {/* ── Main Navigation Bar ── */}
            <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-blue-500/15 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
                    {/* Brand Identity */}
                    <Link href="/" className="flex items-center gap-3 no-underline group flex-shrink-0 min-w-0">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-emerald-500 flex items-center justify-center text-white font-black text-sm sm:text-base shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform flex-shrink-0">
                            SH
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-black text-base sm:text-lg text-white tracking-tight truncate" style={{ fontFamily: 'var(--font-outfit)' }}>
                                    Salvation Heritage
                                </span>
                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    KIOSK
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400 hidden sm:block truncate">
                                Student Attendance System
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation Pill Dock */}
                    <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                        {[
                            { href: '/',          label: 'Attendance Kiosk', icon: 'scan',      active: true },
                            { href: '/register',  label: 'Register Student', icon: 'register',  active: false },
                            { href: '/dashboard', label: 'Dashboard',        icon: 'dashboard', active: false },
                            { href: '/students',  label: 'Directory',        icon: 'users',     active: false },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold no-underline transition-all whitespace-nowrap ${
                                    item.active
                                        ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-md shadow-blue-600/25'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                                }`}
                            >
                                <AnimatedIcon type={item.icon} size={15} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Right Action Controls */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={handleFacultyAction}
                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                        >
                            <AnimatedIcon type="faculty" size={15} />
                            <span>{activeLecturer ? `${activeLecturer.full_name.split(' ')[0]}'s Session` : 'Faculty Sign In'}</span>
                        </button>

                        <button
                            onClick={() => setMobileMenuOpen((v) => !v)}
                            aria-label="Toggle Menu"
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            {mobileMenuOpen ? (
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

                {/* Mobile Dropdown Drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-800 bg-slate-950/98 px-4 py-4 space-y-2 animate-fade-in-down">
                        {[
                            { href: '/',          label: 'Attendance Kiosk',     icon: 'scan',      active: true },
                            { href: '/register',  label: 'Register New Student', icon: 'register',  color: '#60a5fa' },
                            { href: '/dashboard', label: 'Admin Dashboard',      icon: 'dashboard', color: '#34d399' },
                            { href: '/students',  label: 'Student Directory',    icon: 'users',     color: '#a78bfa' },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl no-underline transition-all ${
                                    item.active
                                        ? 'bg-gradient-to-r from-blue-600/25 to-emerald-600/20 border border-blue-500/30 text-white'
                                        : 'text-slate-300 hover:bg-slate-900'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <AnimatedIcon type={item.icon} size={18} style={{ color: item.active ? '#60a5fa' : item.color || '#94a3b8' }} />
                                    <span className="text-sm font-bold">{item.label}</span>
                                </div>
                            </Link>
                        ))}
                        <div className="pt-2 border-t border-slate-800">
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    handleFacultyAction();
                                }}
                                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-emerald-600 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                            >
                                <AnimatedIcon type="faculty" size={18} />
                                <span>{activeLecturer ? `Open ${activeLecturer.full_name}'s Portal` : 'Faculty / Lecturer Sign In'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* ════════════════════════════════════════════════════════════════
                HERO SECTION
                ════════════════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden border-b border-blue-500/15 py-10 sm:py-14 lg:py-16 cyber-grid-bg">
                <ParticleField particleCount={30} color="#3b82f6" connectorColor="#10b981" />

                {/* Ambient Radial Glow Cones */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl animate-float-slow" />
                    <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl animate-float-slow" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        {/* LEFT COLUMN (7/12) */}
                        <div className="lg:col-span-7 space-y-6" data-aos="fade-right">
                            {/* Status Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    Attendance Kiosk Active
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-300 border border-blue-500/30 whitespace-nowrap">
                                    <AnimatedIcon type="school" size={13} />
                                    <span>Salvation Heritage</span>
                                </span>
                            </div>

                            {/* Hero Display Headline */}
                            <div>
                                <h1
                                    className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]"
                                    style={{ fontFamily: 'var(--font-outfit)' }}
                                >
                                    Salvation Heritage{' '}
                                    <span className="block mt-1 bg-gradient-to-r from-blue-400 via-emerald-300 to-violet-400 bg-clip-text text-transparent">
                                        Face Attendance
                                    </span>
                                </h1>
                                <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                                    Step in front of the camera to mark your daily school attendance quickly and easily.
                                </p>
                            </div>

                            {/* Bento Command Row: Clock Widget + Faculty Terminal Widget */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Live Clock Bento */}
                                <div className="bento-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                                    <LiveClock />
                                </div>

                                {/* Faculty Session Command Bento */}
                                <div className="bento-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/30 to-emerald-600/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
                                            <AnimatedIcon type="faculty" size={20} style={{ color: '#60a5fa' }} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            {activeLecturer ? (
                                                <>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                                                        INSTRUCTOR SIGNED IN
                                                    </span>
                                                    <p className="text-sm font-black text-white truncate mt-0.5">
                                                        {activeLecturer.full_name}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 truncate">
                                                        {activeLecturer.department} · Roll Call Ready
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                                                        TEACHERS &amp; STAFF
                                                    </span>
                                                    <p className="text-sm font-black text-white mt-0.5">
                                                        Faculty Portal
                                                    </p>
                                                    <p className="text-[11px] text-slate-400">
                                                        Start class sessions &amp; roll call
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                                        <button
                                            onClick={handleFacultyAction}
                                            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-md transition-all whitespace-nowrap cursor-pointer"
                                        >
                                            {activeLecturer ? 'Enter Class Portal' : 'Open Faculty Portal'}
                                        </button>
                                        {activeLecturer && (
                                            <button
                                                onClick={handleFacultySignOut}
                                                className="py-2 px-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 transition-all whitespace-nowrap cursor-pointer"
                                            >
                                                Exit
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 3-Column Bento KPI Strip */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                <StatCard
                                    icon="check"
                                    value={todayCount}
                                    label="Present Today"
                                    sublabel="Checked in today"
                                    color="emerald"
                                    delay={0}
                                />
                                <StatCard
                                    icon="chart"
                                    value={percentage}
                                    suffix="%"
                                    label="Attendance Rate"
                                    sublabel="Daily school rate"
                                    color="blue"
                                    delay={80}
                                />
                                <StatCard
                                    icon="users"
                                    value={totalStudents}
                                    label="Total Enrolled"
                                    sublabel="Registered students"
                                    color="violet"
                                    delay={160}
                                />
                            </div>
                        </div>

                        {/* RIGHT COLUMN (5/12) — Hero Video Illustration (/camera.webm) */}
                        <div className="lg:col-span-5 flex items-center justify-center" data-aos="fade-left" data-aos-delay="150">
                            <BiometricHeroIllustration />
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                KIOSK SCANNER WORKSPACE
                ════════════════════════════════════════════════════════════════ */}
            <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
                {/* Workspace Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                                STUDENT CHECK-IN
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white mt-1" style={{ fontFamily: 'var(--font-outfit)' }}>
                            Attendance Kiosk
                        </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href="/register"
                            className="px-4 py-2 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 no-underline transition-all whitespace-nowrap flex items-center gap-1.5"
                        >
                            <AnimatedIcon type="register" size={14} />
                            <span>Register New Student</span>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
                    {/* Left: Camera Terminal (3/5) */}
                    <div className="lg:col-span-3" data-aos="fade-up">
                        <div className="bento-card rounded-3xl overflow-hidden">
                            {/* Terminal Header Bar */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-blue-500/15 bg-slate-950/70 gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-black text-white truncate" style={{ fontFamily: 'var(--font-outfit)' }}>
                                            Face Scanner
                                        </p>
                                        <p className="text-[11px] text-slate-400 truncate">
                                            Align your face inside the frame below
                                        </p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap flex-shrink-0">
                                    <AnimatedIcon type="live" size={11} />
                                    READY
                                </span>
                            </div>

                            {/* Camera Viewport */}
                            <div className="p-4 sm:p-6">
                                <CameraCapture onCapture={handleCapture} isLoading={isLoading} buttonText="Scan Face & Mark Attendance" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Recognition Result or Kiosk Guide (2/5) */}
                    <div className="lg:col-span-2 flex flex-col gap-5" data-aos="fade-up" data-aos-delay="100">
                        {lastAttendance && !lastAttendance.error ? (
                            <AttendanceSuccessIllustration
                                attendance={lastAttendance}
                                photoUrl={PHOTO_URL}
                                fallbackSvg={FALLBACK_SVG}
                            />
                        ) : (
                            <div className="flex-1 bento-card rounded-3xl overflow-hidden flex flex-col">
                                <div className="px-5 py-4 flex items-center justify-between border-b border-blue-500/15 bg-slate-950/70 gap-2">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                                            SH
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-black text-white truncate" style={{ fontFamily: 'var(--font-outfit)' }}>
                                                How to Check In
                                            </p>
                                            <p className="text-[11px] text-slate-400 truncate">
                                                Simple 3-step guide
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    <KioskGuideIllustration />
                                </div>
                            </div>
                        )}

                        {/* Recognition Error Alert */}
                        {lastAttendance?.error && (
                            <div className="rounded-2xl p-4 bg-rose-500/10 border border-rose-500/30 animate-scale-in">
                                <div className="flex items-center gap-2 mb-1">
                                    <AnimatedIcon type="alert" size={16} className="text-rose-400 flex-shrink-0" />
                                    <p className="text-xs font-bold text-rose-300">Face Not Recognized</p>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">{lastAttendance.message}</p>
                                <p className="text-[11px] text-slate-400 mt-1.5">
                                    Ensure your face is clearly lit or{' '}
                                    <Link href="/register" className="text-emerald-400 font-bold underline">
                                        register as a new student
                                    </Link>
                                    .
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                FACULTY LOGIN MODAL
                ════════════════════════════════════════════════════════════════ */}
            {showFacultyModal && !activeLecturer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
                    <div className="w-full max-w-md bento-card rounded-3xl overflow-hidden animate-scale-in">
                        <div className="px-6 py-5 flex items-center justify-between border-b border-blue-500/20 bg-slate-950/60">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                                    <AnimatedIcon type="faculty" size={22} style={{ color: 'white' }} />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
                                        Faculty Portal Sign In
                                    </h2>
                                    <p className="text-xs text-emerald-400">Salvation Heritage Teachers &amp; Staff</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowFacultyModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-bold"
                            >
                                X
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {facultyError && (
                                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                                    <AnimatedIcon type="alert" size={15} className="text-rose-400 flex-shrink-0" />
                                    <span>{facultyError}</span>
                                </div>
                            )}

                            <form onSubmit={handleFacultyLogin} className="space-y-4">
                                <div>
                                    <label className="label-premium">Username or Lecturer ID</label>
                                    <input
                                        type="text"
                                        value={facultyUser}
                                        onChange={(e) => { setFacultyUser(e.target.value); setFacultyError(''); }}
                                        placeholder="e.g. babatunde.adeyemi or LEC001"
                                        className="input-premium font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="label-premium">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            value={facultyPass}
                                            onChange={(e) => { setFacultyPass(e.target.value); setFacultyError(''); }}
                                            placeholder="Enter your password"
                                            className="input-premium pr-10 text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass((v) => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                                        >
                                            <AnimatedIcon type={showPass ? 'eye-off' : 'eye'} size={16} />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={facultyLoading}
                                    className="w-full py-3.5 rounded-xl text-sm font-black text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {facultyLoading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </form>

                            {/* Quick Profile Selector */}
                            <div className="pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowFacultyPicker((v) => !v)}
                                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-950 border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer"
                                >
                                    <span>Select Faculty Profile (13)</span>
                                    <span>{showFacultyPicker ? 'Hide' : 'Show'}</span>
                                </button>

                                {showFacultyPicker && (
                                    <div className="mt-2 max-h-48 overflow-y-auto space-y-1 pr-1">
                                        {NIGERIAN_FACULTY.map((lec) => (
                                            <button
                                                key={lec.lecturer_id}
                                                type="button"
                                                onClick={() => selectFacultyProfile(lec)}
                                                className="w-full px-3 py-2 rounded-xl text-left hover:bg-blue-600/15 border border-transparent hover:border-blue-500/30 transition-all flex items-center justify-between gap-2 cursor-pointer"
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <span className="w-7 h-7 rounded-lg bg-slate-800 text-emerald-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                                        {lec.avatar}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-white truncate">{lec.full_name}</p>
                                                        <p className="text-[10px] text-slate-400 truncate">
                                                            {lec.department} · <span className="font-mono">{lec.username}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 flex-shrink-0">
                                                    Select
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <StopSessionModal
                open={showStopWarning}
                courseName={activeSessionToStop?.course}
                onClose={() => {
                    setShowStopWarning(false);
                    router.push('/lecturer');
                }}
                onStopSession={handleStopSessionFromHome}
                loading={stoppingSession}
            />

            <WrongPasswordModal
                open={showWrongModal}
                roleLabel="Faculty Portal"
                onClose={() => setShowWrongModal(false)}
            />

            {/* ── Footer ── */}
            <footer className="border-t border-blue-500/15 bg-slate-950/95 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white text-[10px] font-black">
                            SH
                        </div>
                        <span className="text-xs font-semibold text-slate-400">
                            Salvation Heritage High School · Attendance System
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <Link href="/register" className="text-slate-400 hover:text-white no-underline transition-colors">
                            Student Registration
                        </Link>
                        <Link href="/dashboard" className="text-slate-400 hover:text-white no-underline transition-colors">
                            Admin Dashboard
                        </Link>
                        <button onClick={handleFacultyAction} className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer">
                            Faculty Portal
                        </button>
                    </div>
                </div>
            </footer>

            {/* ── Floating Mobile Bottom Navigation Bar ── */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 py-2 px-3 flex items-center justify-around shadow-2xl">
                <Link href="/" className="flex flex-col items-center gap-1 py-1 px-3 text-emerald-400 font-black no-underline">
                    <AnimatedIcon type="scan" size={20} />
                    <span className="text-[10px] font-bold">Kiosk</span>
                </Link>
                <Link href="/register" className="flex flex-col items-center gap-1 py-1 px-3 text-slate-400 hover:text-white no-underline">
                    <AnimatedIcon type="register" size={20} />
                    <span className="text-[10px] font-bold">Register</span>
                </Link>
                <button
                    onClick={handleFacultyAction}
                    className="flex flex-col items-center gap-1 py-1 px-3 text-slate-400 hover:text-white bg-transparent border-0 cursor-pointer"
                >
                    <AnimatedIcon type="faculty" size={20} />
                    <span className="text-[10px] font-bold">Faculty</span>
                </button>
                <Link href="/dashboard" className="flex flex-col items-center gap-1 py-1 px-3 text-slate-400 hover:text-white no-underline">
                    <AnimatedIcon type="dashboard" size={20} />
                    <span className="text-[10px] font-bold">Admin</span>
                </Link>
                <Link href="/students" className="flex flex-col items-center gap-1 py-1 px-3 text-slate-400 hover:text-white no-underline">
                    <AnimatedIcon type="users" size={20} />
                    <span className="text-[10px] font-bold">Students</span>
                </Link>
            </div>
        </div>
    );
}
