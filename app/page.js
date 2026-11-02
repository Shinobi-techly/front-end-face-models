'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CameraCapture from '../components/CameraCapture';
import DebugConsole from '../components/DebugConsole';
import AOSInit from '../components/AOSInit';
import AnimatedIcon from '../components/AnimatedIcon';
import LottieAnimation from '../components/LottieAnimation';
import FaceScanIllustration from '../components/FaceScanIllustration';
import BiometricHeroIllustration from '../components/BiometricHeroIllustration';
import KioskGuideIllustration from '../components/KioskGuideIllustration';
import AttendanceSuccessIllustration from '../components/AttendanceSuccessIllustration';
import ParticleField from '../components/ParticleField';
import { recognizeFace, getStats, loginLecturer, NIGERIAN_FACULTY } from '../lib/api';
import toast, { Toaster } from 'react-hot-toast';

const PHOTO_URL = (id) =>
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost/face-attendance-api/api'}/get-student-photo.php?student_id=${id}`;

const FALLBACK_SVG = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230f172a"/><text x="50" y="58" text-anchor="middle" fill="%2334d399" font-size="38" font-family="sans-serif">?</text></svg>`;

/* ── Animated live clock ── */
function LiveClock() {
    const [time, setTime] = useState(null);
    useEffect(() => {
        setTime(new Date());
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    if (!time) return null;
    return (
        <div className="text-center">
            <p className="tabular-nums text-3xl xs:text-4xl sm:text-5xl font-black text-white tracking-tight"
               style={{ fontFamily: 'var(--font-mono)', letterSpacing: '-1px' }}>
                {time.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-emerald-400 text-[10px] sm:text-xs mt-1 font-semibold tracking-wider sm:tracking-widest uppercase">
                {time.toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
        </div>
    );
}

/* ── Animated counter ── */
function AnimatedCounter({ value, duration = 1200 }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        let start = 0;
        const step = value / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= value) { setDisplay(value); clearInterval(timer); }
            else setDisplay(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [value, duration]);
    return <>{display}</>;
}

/* ── Stat card ── */
function StatCard({ icon, value, label, color, delay = 0 }) {
    const colors = {
        emerald: { border: 'rgba(16,185,129,0.25)', glow: 'rgba(16,185,129,0.08)', icon: '#34d399', text: '#6ee7b7', bg: 'rgba(16,185,129,0.08)' },
        blue:    { border: 'rgba(59,116,247,0.25)', glow: 'rgba(59,116,247,0.08)', icon: '#60a5fa', text: '#93c5fd', bg: 'rgba(59,116,247,0.08)' },
        violet:  { border: 'rgba(139,92,246,0.25)', glow: 'rgba(139,92,246,0.08)', icon: '#a78bfa', text: '#c4b5fd', bg: 'rgba(139,92,246,0.08)' },
    };
    const c = colors[color] || colors.blue;
    return (
        <div data-aos="fade-up" data-aos-delay={delay}
            style={{
                background: `linear-gradient(145deg, rgba(10,18,35,0.95), rgba(8,15,28,0.9))`,
                border: `1px solid ${c.border}`,
                boxShadow: `0 8px 32px ${c.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
            }}
            className="rounded-2xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3.5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
            <div style={{
                background: c.bg, border: `1px solid ${c.border}`,
            }} className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0">
                <AnimatedIcon type={icon} size={18} style={{ color: c.icon }} />
            </div>
            <div className="min-w-0">
                <p className="text-white font-black text-lg sm:text-2xl leading-none" style={{ fontFamily: 'var(--font-outfit)' }}>
                    <AnimatedCounter value={value} />
                </p>
                <p className="text-[11px] sm:text-xs font-semibold mt-0.5 truncate" style={{ color: c.text }}>{label}</p>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════ */
export default function HomePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [lastAttendance, setLastAttendance] = useState(null);
    const [todayCount, setTodayCount] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [debugInfo, setDebugInfo] = useState(null);
    const [showDebugConsole, setShowDebugConsole] = useState(false);
    const [activeLecturer, setActiveLecturer] = useState(null);
    const [showFacultyModal, setShowFacultyModal] = useState(false);
    const [facultyUser, setFacultyUser] = useState('');
    const [facultyPass, setFacultyPass] = useState('');
    const [facultyLoading, setFacultyLoading] = useState(false);
    const [facultyError, setFacultyError] = useState('');
    const [showFacultyPicker, setShowFacultyPicker] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showPass, setShowPass] = useState(false);
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
        setDebugInfo({ status: 'Sending image to biometric engine...', time: new Date().toLocaleTimeString() });
        try {
            const result = await recognizeFace(imageDataUrl);
            if (!isMounted.current) return;
            setDebugInfo({ status: 'Response received', result, time: new Date().toLocaleTimeString() });

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
                    recognitionQuality: result.recognition_quality
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
            toast.error(error.message || 'Network error. Check backend connection.', { duration: 5000 });
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
        localStorage.removeItem('fa_lecturer');
        sessionStorage.removeItem('fa_session');
        setActiveLecturer(null);
        toast.success('Signed out from Faculty Terminal.', { duration: 3000 });
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
                setFacultyError(res.message || 'Invalid credentials.');
            }
        } catch (err) {
            setFacultyError(err.message || 'Login failed.');
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
        <div className="min-h-screen text-slate-100 flex flex-col" style={{
            background: 'radial-gradient(ellipse 100% 60% at 50% 0%, #0a1628 0%, #020617 60%)',
            fontFamily: 'var(--font-inter)',
        }}>
            <AOSInit />
            <Toaster position="top-center" toastOptions={{
                style: {
                    borderRadius: 14, fontSize: 13, fontWeight: 600,
                    background: '#0f172a', color: '#fff', border: '1px solid rgba(59,130,246,0.25)',
                    boxShadow: '0 20px 60px -12px rgba(0,0,0,0.8)',
                    fontFamily: 'var(--font-inter)',
                },
                success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            }} />

            {/* ── Announcement Banner ── */}
            <div style={{ background: 'linear-gradient(90deg, #030d1f, #0a1a38, #030d1f)', borderBottom: '1px solid rgba(59,130,246,0.12)' }}
                className="py-2 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-300 truncate">
                            Salvation Heritage High School &nbsp;<span className="text-emerald-400">·</span>&nbsp; Contactless Biometric Attendance Live
                        </span>
                    </div>
                    {activeLecturer ? (
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button onClick={handleFacultyAction}
                                className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold text-emerald-300 hover:text-white transition-colors"
                                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
                                <AnimatedIcon type="faculty" size={12} />
                                <span className="hidden xs:inline">{activeLecturer.full_name.split(' ')[0]}'s Portal</span>
                                <span className="xs:hidden">Portal</span> →
                            </button>
                            <button onClick={handleFacultySignOut} className="text-[10px] text-rose-400 hover:text-rose-300 px-2 py-1 rounded-full transition-colors"
                                style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleFacultyAction}
                            className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold text-white flex-shrink-0 transition-all hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg, #1e4bcc, #059669)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <AnimatedIcon type="faculty" size={12} />
                            Faculty Portal
                        </button>
                    )}
                </div>
            </div>

            {/* ── Main Navbar ── */}
            <nav style={{
                position: 'sticky', top: 0, zIndex: 40,
                background: 'rgba(2,6,23,0.92)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(59,130,246,0.1)',
                boxShadow: '0 4px 24px -4px rgba(0,0,0,0.6)',
            }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-18 flex items-center justify-between gap-3">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2.5 no-underline group flex-shrink-0">
                        <div style={{
                            width: 40, height: 40, borderRadius: '0.875rem',
                            background: 'linear-gradient(135deg, #1e4bcc, #059669)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(30,75,204,0.4)',
                            fontFamily: 'var(--font-outfit)', fontWeight: 900,
                            fontSize: 14, color: 'white',
                            transition: 'transform 0.3s ease',
                        }} className="group-hover:scale-110">SH</div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-black text-base md:text-lg text-white tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                                    Salvation Heritage
                                </span>
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full hidden sm:inline"
                                    style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)' }}>
                                    LIVE
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-500 hidden sm:block" style={{ fontFamily: 'var(--font-inter)' }}>
                                Smart Biometric Attendance System
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1 p-1.5 rounded-2xl"
                        style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(71,85,105,0.2)' }}>
                        {[
                            { href: '/',          label: 'Attendance Kiosk', icon: 'scan',      active: true },
                            { href: '/register',  label: 'Register Student', icon: 'register',  active: false },
                            { href: '/dashboard', label: 'Admin Portal',     icon: 'dashboard', active: false, badge: 'PIN' },
                        ].map(item => (
                            <Link key={item.href} href={item.href}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold no-underline transition-all"
                                style={item.active ? {
                                    background: 'linear-gradient(135deg, #1e4bcc, #0e7a5a)',
                                    color: 'white',
                                    boxShadow: '0 4px 16px rgba(30,75,204,0.3)',
                                } : { color: '#94a3b8' }}
                                onMouseOver={e => { if (!item.active) { e.currentTarget.style.background = 'rgba(30,41,59,0.8)'; e.currentTarget.style.color = 'white'; }}}
                                onMouseOut={e => { if (!item.active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}}>
                                <AnimatedIcon type={item.icon} size={15} />
                                {item.label}
                                {item.badge && <span className="text-[9px] px-1.5 py-0.5 rounded-md font-mono"
                                    style={{ background: 'rgba(51,65,85,0.8)', color: '#94a3b8' }}>{item.badge}</span>}
                            </Link>
                        ))}
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {activeLecturer ? (
                            <button onClick={handleFacultyAction}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg, #059669, #0d9488)', boxShadow: '0 4px 16px rgba(5,150,105,0.35)' }}>
                                <AnimatedIcon type="faculty" size={15} />
                                <span className="hidden md:inline">{activeLecturer.full_name.split(' ')[0]}'s Terminal</span>
                                <span className="md:hidden">Terminal</span>
                            </button>
                        ) : (
                            <button onClick={handleFacultyAction}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                                style={{ background: 'linear-gradient(135deg, #1e4bcc, #059669)', boxShadow: '0 4px 16px rgba(30,75,204,0.35)' }}>
                                <AnimatedIcon type="faculty" size={15} />
                                <span className="hidden md:inline">Faculty Sign In</span>
                                <span className="md:hidden">Faculty</span>
                            </button>
                        )}

                        <button onClick={() => setShowDebugConsole(true)} title="Diagnostics"
                            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:bg-slate-800 hover:text-white text-slate-400"
                            style={{ border: '1px solid rgba(71,85,105,0.3)' }}>
                            <AnimatedIcon type="settings" size={17} />
                        </button>

                        {/* Mobile hamburger */}
                        <button onClick={() => setMobileMenuOpen(v => !v)} aria-label="Menu"
                            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-all text-slate-300"
                            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(71,85,105,0.3)' }}>
                            {mobileMenuOpen
                                ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            }
                        </button>
                    </div>
                </div>

                {/* Mobile menu drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden animate-fade-in-down" style={{ borderTop: '1px solid rgba(59,130,246,0.1)', background: 'rgba(2,6,23,0.98)', padding: '1rem 1rem 1.5rem' }}>
                        <div className="space-y-1 mb-4">
                            {[
                                { href: '/',          label: 'Attendance Kiosk',  icon: 'scan',      active: true },
                                { href: '/register',  label: 'Register New Student', icon: 'register', color: '#60a5fa' },
                                { href: '/dashboard', label: 'Admin Dashboard',   icon: 'dashboard', color: '#34d399', badge: 'PIN' },
                                { href: '/students',  label: 'Student Directory', icon: 'users',     color: '#a78bfa', badge: 'PIN' },
                            ].map(item => (
                                <Link key={item.href} href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl no-underline transition-all"
                                    style={item.active ? {
                                        background: 'linear-gradient(135deg, rgba(30,75,204,0.2), rgba(5,150,105,0.15))',
                                        border: '1px solid rgba(59,116,247,0.25)', color: 'white',
                                    } : { color: '#cbd5e1', border: '1px solid transparent' }}
                                    onMouseOver={e => { if (!item.active) e.currentTarget.style.background = 'rgba(30,41,59,0.6)'; }}
                                    onMouseOut={e => { if (!item.active) e.currentTarget.style.background = 'transparent'; }}>
                                    <div className="flex items-center gap-3">
                                        <AnimatedIcon type={item.icon} size={18} style={{ color: item.active ? '#60a5fa' : (item.color || '#94a3b8') }} />
                                        <span className="text-sm font-semibold">{item.label}</span>
                                    </div>
                                    {item.badge && <span className="text-[9px] font-mono px-2 py-0.5 rounded-md"
                                        style={{ background: 'rgba(51,65,85,0.8)', color: '#64748b' }}>{item.badge}</span>}
                                </Link>
                            ))}
                        </div>
                        <div style={{ borderTop: '1px solid rgba(59,130,246,0.1)', paddingTop: '1rem' }}>
                            {activeLecturer ? (
                                <div className="space-y-2">
                                    <button onClick={() => { setMobileMenuOpen(false); router.push('/lecturer'); }}
                                        className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all"
                                        style={{ background: 'linear-gradient(135deg, #059669, #0d9488)', boxShadow: '0 8px 24px rgba(5,150,105,0.3)' }}>
                                        <AnimatedIcon type="faculty" size={18} />
                                        Resume Portal ({activeLecturer.full_name})
                                    </button>
                                    <button onClick={() => { setMobileMenuOpen(false); handleFacultySignOut(); }}
                                        className="w-full py-2.5 rounded-xl text-xs font-bold transition-all"
                                        style={{ color: '#fda4af', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}>
                                        Sign Out of Faculty Portal
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => { setMobileMenuOpen(false); handleFacultyAction(); }}
                                    className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                                    style={{ background: 'linear-gradient(135deg, #1e4bcc, #059669)', boxShadow: '0 8px 24px rgba(30,75,204,0.3)' }}>
                                    <AnimatedIcon type="faculty" size={18} />
                                    Faculty / Lecturer Login
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* ════════════════════════════════════════
                HERO SECTION  
                ════════════════════════════════════════ */}
            <div className="relative overflow-hidden" style={{
                background: 'linear-gradient(160deg, #03070f 0%, #0a1628 35%, #041a2e 65%, #020d18 100%)',
                borderBottom: '1px solid rgba(59,130,246,0.1)',
                paddingTop: '3rem',
                paddingBottom: '3rem',
            }}>
                {/* Particle field */}
                <ParticleField particleCount={45} color="#3b74f7" connectorColor="#10b981" />

                {/* Blurred blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: 400, height: 400, borderRadius: '50%', background: '#1e4bcc', opacity: 0.08, filter: 'blur(80px)' }} className="animate-float-slow" />
                    <div style={{ position: 'absolute', top: 60, right: '20%', width: 350, height: 350, borderRadius: '50%', background: '#10b981', opacity: 0.06, filter: 'blur(80px)', animationDelay: '2s' }} className="animate-float-slow" />
                    <div style={{ position: 'absolute', bottom: -60, right: -60, width: 400, height: 400, borderRadius: '50%', background: '#8b5cf6', opacity: 0.06, filter: 'blur(80px)', animationDelay: '4s' }} className="animate-float-slow" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">

                        {/* LEFT — Text content */}
                        <div className="flex-1 min-w-0" data-aos="fade-right">
                            {/* Badges */}
                            <div className="flex items-center gap-2.5 flex-wrap mb-5">
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                                    style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7' }}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Kiosk Active
                                </span>
                                <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                                    style={{ background: 'linear-gradient(135deg, rgba(30,75,204,0.25), rgba(5,150,105,0.2))', border: '1px solid rgba(59,116,247,0.3)', color: '#93c5fd' }}>
                                    Salvation Heritage
                                </span>
                                <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                                    style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', color: '#c4b5fd' }}>
                                    AWS Rekognition AI
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="font-black leading-none mb-5" style={{ fontFamily: 'var(--font-outfit)' }}>
                                <span className="block text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white">Smart Face</span>
                                <span className="block text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl" style={{
                                    background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 60%, #a78bfa 100%)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                }}>Attendance</span>
                            </h1>

                            <p className="text-sm sm:text-base text-slate-400 max-w-lg leading-relaxed mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
                                Step in front of the camera — our AWS-powered AI instantly identifies you and logs your attendance in under 2 seconds.
                                No cards, no PINs, just your face.
                            </p>

                            {/* Faculty callout */}
                            <div className="mb-6 rounded-2xl overflow-hidden" style={{
                                background: 'linear-gradient(145deg, rgba(10,22,45,0.95), rgba(8,15,28,0.9))',
                                border: '1px solid rgba(59,116,247,0.2)',
                                boxShadow: '0 20px 60px -12px rgba(0,0,0,0.5)',
                            }}>
                                <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(59,116,247,0.1)' }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: '0.75rem', flexShrink: 0,
                                        background: 'linear-gradient(135deg, rgba(30,75,204,0.3), rgba(5,150,105,0.2))',
                                        border: '1px solid rgba(59,116,247,0.3)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <AnimatedIcon type="faculty" size={20} style={{ color: '#60a5fa' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {activeLecturer ? (
                                            <>
                                                <p className="text-sm font-bold text-emerald-400">Welcome back, {activeLecturer.full_name}</p>
                                                <p className="text-[11px] text-slate-400">{activeLecturer.department} · Active Faculty Session</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-sm font-bold text-white">Faculty &amp; Lecturer Portal</p>
                                                <p className="text-[11px] text-slate-400">Open class session &amp; start roll call</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="px-4 py-3 flex items-center gap-2">
                                    <button onClick={handleFacultyAction}
                                        className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:-translate-y-0.5"
                                        style={{ background: 'linear-gradient(135deg, #1e4bcc, #059669)', boxShadow: '0 8px 24px rgba(30,75,204,0.3)' }}>
                                        {activeLecturer ? 'Enter Faculty Terminal →' : 'Open Faculty Terminal →'}
                                    </button>
                                    {activeLecturer && (
                                        <button onClick={handleFacultySignOut}
                                            className="py-2.5 px-3 rounded-xl text-xs font-bold transition-all"
                                            style={{ color: '#fda4af', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)' }}>
                                            Sign Out
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Live clock */}
                            <div className="inline-block rounded-2xl px-5 py-3.5 mb-6" style={{
                                background: 'rgba(2,6,23,0.8)',
                                border: '1px solid rgba(59,116,247,0.15)',
                                boxShadow: '0 0 40px rgba(59,116,247,0.05)',
                            }}>
                                <LiveClock />
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-1 xs:grid-cols-3 gap-2.5 sm:gap-3">
                                <StatCard icon="check" value={todayCount}    label="Present Today"   color="emerald" delay={0}   />
                                <StatCard icon="chart" value={percentage}    label="% Attendance"    color="blue"    delay={80}  />
                                <StatCard icon="users" value={totalStudents} label="Total Enrolled"  color="violet"  delay={160} />
                            </div>
                        </div>

                        {/* RIGHT — Biometric AI Hero Illustration */}
                        <div className="flex-shrink-0 flex items-center justify-center lg:justify-end" data-aos="fade-left" data-aos-delay="150">
                            <BiometricHeroIllustration />
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════
                KIOSK SECTION  
                ════════════════════════════════════════ */}
            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-8">

                    {/* Camera panel (3/5) */}
                    <div className="lg:col-span-3" data-aos="fade-up">
                        <div style={{
                            borderRadius: '1.75rem', overflow: 'hidden',
                            background: 'linear-gradient(145deg, rgba(10,22,45,0.95), rgba(8,15,28,0.9))',
                            border: '1px solid rgba(59,116,247,0.15)',
                            boxShadow: '0 30px 80px -12px rgba(0,0,0,0.7)',
                        }}>
                            {/* Panel header */}
                            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid rgba(59,116,247,0.1)', background: 'rgba(2,6,23,0.6)' }}>
                                <div className="flex items-center gap-2.5">
                                    <div style={{
                                        width: 34, height: 34, borderRadius: '0.625rem',
                                        background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} className="animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>Biometric Face Scanner</p>
                                        <p className="text-[10px] text-slate-500">Salvation Heritage High-Precision AI Engine</p>
                                    </div>
                                </div>
                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                                    style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7' }}>
                                    <AnimatedIcon type="live" size={11} />
                                    Active
                                </span>
                            </div>
                            <div className="p-4 sm:p-6">
                                <CameraCapture onCapture={handleCapture} isLoading={isLoading} />
                            </div>
                        </div>
                    </div>

                    {/* Info / Result panel (2/5) */}
                    <div className="lg:col-span-2 flex flex-col gap-5" data-aos="fade-up" data-aos-delay="100">

                        {lastAttendance && !lastAttendance.error ? (
                            /* ── SUCCESS CARD WITH CELEBRATORY ILLUSTRATION ── */
                            <AttendanceSuccessIllustration
                                attendance={lastAttendance}
                                photoUrl={PHOTO_URL}
                                fallbackSvg={FALLBACK_SVG}
                            />
                        ) : (
                            /* ── INFO CARD WITH KIOSK GUIDE ILLUSTRATION ── */
                            <div className="flex-1 rounded-3xl overflow-hidden" style={{
                                background: 'linear-gradient(145deg, rgba(10,22,45,0.95), rgba(8,15,28,0.9))',
                                border: '1px solid rgba(59,116,247,0.15)',
                                boxShadow: '0 30px 80px -12px rgba(0,0,0,0.7)',
                            }}>
                                <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(59,116,247,0.1)', background: 'rgba(2,6,23,0.6)' }}>
                                    <div className="flex items-center gap-2.5">
                                        <div style={{
                                            width: 34, height: 34, borderRadius: '0.625rem',
                                            background: 'linear-gradient(135deg, rgba(30,75,204,0.25), rgba(5,150,105,0.2))',
                                            border: '1px solid rgba(59,116,247,0.3)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontFamily: 'var(--font-outfit)', fontWeight: 900, fontSize: 12, color: 'white',
                                        }}>SH</div>
                                        <div>
                                            <p className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>Salvation Heritage Kiosk</p>
                                            <p className="text-[10px] text-slate-500">Automatic Biometric Verification</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                        READY
                                    </span>
                                </div>

                                <div className="p-5">
                                    <KioskGuideIllustration />
                                </div>
                            </div>
                        )}

                        {/* Error state mini card */}
                        {lastAttendance?.error && (
                            <div className="rounded-2xl p-4 animate-scale-in" style={{
                                background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)',
                            }}>
                                <p className="text-xs font-bold text-rose-400 mb-1">Recognition Failed</p>
                                <p className="text-[11px] text-slate-400">{lastAttendance.message}</p>
                                <p className="text-[10px] text-slate-500 mt-1">Make sure you are registered and facing the camera clearly.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════
                FACULTY LOGIN MODAL  
                ════════════════════════════════════════ */}
            {showFacultyModal && !activeLecturer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(2,6,23,0.88)', backdropFilter: 'blur(16px)' }}>
                    <div className="w-full max-w-md rounded-3xl overflow-hidden animate-scale-in" style={{
                        background: 'linear-gradient(145deg, rgba(10,22,45,0.99), rgba(5,10,20,0.98))',
                        border: '1px solid rgba(59,116,247,0.25)',
                        boxShadow: '0 50px 100px -20px rgba(0,0,0,0.9), 0 0 60px rgba(59,116,247,0.08)',
                    }}>
                        {/* Modal header */}
                        <div className="px-6 py-5 flex items-center justify-between" style={{
                            borderBottom: '1px solid rgba(59,116,247,0.1)',
                            background: 'linear-gradient(135deg, rgba(30,75,204,0.1), rgba(5,150,105,0.07))',
                        }}>
                            <div className="flex items-center gap-3">
                                <div style={{
                                    width: 44, height: 44, borderRadius: '0.875rem',
                                    background: 'linear-gradient(135deg, #1e4bcc, #059669)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 8px 24px rgba(30,75,204,0.4)',
                                }}>
                                    <AnimatedIcon type="faculty" size={24} style={{ color: 'white' }} />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-white" style={{ fontFamily: 'var(--font-outfit)' }}>Faculty Portal Login</h2>
                                    <p className="text-[11px] text-emerald-400">Salvation Heritage Instructors &amp; Staff</p>
                                </div>
                            </div>
                            <button onClick={() => setShowFacultyModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white transition-colors"
                                style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(71,85,105,0.3)' }}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="p-6 space-y-4">
                            {facultyError && (
                                <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold animate-fade-in"
                                    style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', color: '#fda4af' }}>
                                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    {facultyError}
                                </div>
                            )}

                            <form onSubmit={handleFacultyLogin} className="space-y-4">
                                <div>
                                    <label className="label-premium">Username or Lecturer ID</label>
                                    <input type="text" value={facultyUser} onChange={e => { setFacultyUser(e.target.value); setFacultyError(''); }}
                                        placeholder="e.g. babatunde.adeyemi or LEC001"
                                        className="input-premium" style={{ fontFamily: 'var(--font-mono)' }} />
                                </div>
                                <div>
                                    <label className="label-premium">Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input type={showPass ? 'text' : 'password'} value={facultyPass}
                                            onChange={e => { setFacultyPass(e.target.value); setFacultyError(''); }}
                                            placeholder="Enter your password" className="input-premium" style={{ paddingRight: '2.75rem' }} />
                                        <button type="button" onClick={() => setShowPass(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                                            {showPass
                                                ? <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                : <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            }
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" disabled={facultyLoading}
                                    className="w-full py-3.5 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                                    style={{ background: 'linear-gradient(135deg, #1e4bcc, #059669)', boxShadow: '0 12px 32px rgba(30,75,204,0.4)', fontFamily: 'var(--font-outfit)' }}>
                                    {facultyLoading
                                        ? <><svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Authenticating…</>
                                        : <>Sign In to Session Control →</>
                                    }
                                </button>
                            </form>

                            {/* Quick profile picker */}
                            <div style={{ borderTop: '1px solid rgba(59,116,247,0.1)', paddingTop: '1rem' }}>
                                <button type="button" onClick={() => setShowFacultyPicker(v => !v)}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all"
                                    style={{ color: '#94a3b8', background: 'rgba(2,6,23,0.6)', border: '1px solid rgba(71,85,105,0.2)' }}
                                    onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(59,116,247,0.35)'}
                                    onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(71,85,105,0.2)'}>
                                    <span className="flex items-center gap-2">
                                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                                        Quick-select from 13 Nigerian Faculty Profiles
                                    </span>
                                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: showFacultyPicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                </button>

                                {showFacultyPicker && (
                                    <div className="mt-2 max-h-52 overflow-y-auto space-y-1 pr-0.5 animate-fade-in">
                                        {NIGERIAN_FACULTY.map(lec => (
                                            <button key={lec.lecturer_id} type="button" onClick={() => selectFacultyProfile(lec)}
                                                className="w-full px-3 py-2.5 rounded-xl text-left transition-all flex items-center justify-between gap-2"
                                                style={{ border: '1px solid transparent', color: '#cbd5e1' }}
                                                onMouseOver={e => { e.currentTarget.style.background = 'rgba(30,75,204,0.12)'; e.currentTarget.style.borderColor = 'rgba(59,116,247,0.3)'; }}
                                                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}>
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <span className="text-xl flex-shrink-0">{lec.avatar}</span>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-white truncate">{lec.full_name}</p>
                                                        <p className="text-[10px] text-slate-500 truncate">{lec.department} · <span style={{ fontFamily: 'var(--font-mono)' }}>{lec.username}</span></p>
                                                    </div>
                                                </div>
                                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0"
                                                    style={{ background: 'rgba(59,116,247,0.12)', color: '#93c5fd', border: '1px solid rgba(59,116,247,0.25)' }}>
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

            {/* Diagnostic console */}
            {showDebugConsole && (
                <DebugConsole onClose={() => setShowDebugConsole(false)} lastAttendance={lastAttendance} debugInfo={debugInfo} />
            )}

            {/* ── Footer ── */}
            <footer style={{ borderTop: '1px solid rgba(59,116,247,0.1)', background: 'rgba(2,6,23,0.95)' }} className="py-5 pb-24 md:pb-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div style={{
                            width: 24, height: 24, borderRadius: '0.5rem',
                            background: 'linear-gradient(135deg, #1e4bcc, #059669)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 9, fontWeight: 900, color: 'white', fontFamily: 'var(--font-outfit)',
                        }}>SH</div>
                        <span className="text-[11px] font-semibold text-slate-400" style={{ fontFamily: 'var(--font-inter)' }}>
                            Salvation Heritage Biometric Attendance · Powered by AWS Rekognition
                        </span>
                    </div>
                    {activeLecturer ? (
                        <div className="flex items-center gap-3 text-[11px]">
                            <span className="text-emerald-400 font-medium">Signed in: {activeLecturer.full_name}</span>
                            <button onClick={handleFacultySignOut} className="text-rose-400 hover:text-rose-300 transition-colors">Sign Out</button>
                        </div>
                    ) : (
                        <button onClick={handleFacultyAction} className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors">Faculty Login</button>
                    )}
                </div>
            </footer>
        </div>
    );
}
