'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import AOSInit from '../../components/AOSInit';
import AnimatedIcon from '../../components/AnimatedIcon';
import StudentDirectoryIllustration from '../../components/StudentDirectoryIllustration';
import { getStudents, deleteStudent } from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';
import AdminGuard from '../../components/AdminGuard';

const PHOTO = (id) =>
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost/face-attendance-api/api'}/get-student-photo.php?student_id=${id}`;

function initials(name = '') {
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

function StudentCard({ student, onDelete }) {
    const [imgError, setImgError] = useState(false);
    const reg = student.registered_at
        ? new Date(student.registered_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Active';
    const termLabel =
        Number(student.semester) === 1
            ? '1st Term'
            : Number(student.semester) === 2
            ? '2nd Term'
            : Number(student.semester) === 3
            ? '3rd Term'
            : `Term ${student.semester || 1}`;

    return (
        <div className="group bento-card rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
            {/* Top Gradient Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-emerald-500 to-teal-400" />

            {/* Portrait Photo Viewport */}
            <div className="relative h-52 overflow-hidden bg-slate-950">
                {!imgError ? (
                    <img
                        src={PHOTO(student.student_id)}
                        alt={student.full_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-950">
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 border border-white/15">
                            {initials(student.full_name)}
                        </div>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Term Badge */}
                <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl text-emerald-300 bg-slate-950/85 backdrop-blur border border-emerald-500/30 whitespace-nowrap">
                        {termLabel}
                    </span>
                </div>

                {/* Class Badge */}
                <div className="absolute top-3 right-3 z-10">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-blue-600/90 text-white backdrop-blur border border-blue-400/40 whitespace-nowrap">
                        {student.department}
                    </span>
                </div>

                {/* Bottom ID Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-white/10 text-xs font-mono font-bold text-emerald-400">
                        {student.student_id}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-md">
                        ✓ Biometric ID
                    </span>
                </div>
            </div>

            {/* Student Details Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0 flex-1">
                        <h3 className="font-black text-white text-base truncate group-hover:text-emerald-400 transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>
                            {student.full_name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                            Enrolled: {reg}
                        </p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(student);
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition-all flex-shrink-0 cursor-pointer"
                        title="Delete Student Record"
                    >
                        🗑️
                    </button>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate">Salvation Heritage</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Active Roster
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterDept, setFilterDept] = useState('all');
    const [filterSem, setFilterSem] = useState('all');
    const [view, setView] = useState('grid');
    const [mobileOpen, setMobileOpen] = useState(false);

    const loadStudents = useCallback(() => {
        setLoading(true);
        getStudents()
            .then((data) => setStudents(data || []))
            .catch(() => toast.error('Failed to load students'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadStudents();
    }, [loadStudents]);

    const handleDelete = useCallback(async (student) => {
        if (!confirm(`Delete ${student.full_name}? This will remove them from the database and biometric face collection.`)) return;
        try {
            const data = await deleteStudent(student.student_id);
            if (data.success) {
                toast.success(`${student.full_name} removed.`);
                setStudents((prev) => prev.filter((s) => s.student_id !== student.student_id));
            } else {
                toast.error(data.message || 'Failed to delete');
            }
        } catch {
            toast.error('Network error');
        }
    }, []);

    const filtered = useMemo(() => {
        return students.filter((s) => {
            const q = search.toLowerCase();
            const matchSearch =
                !q ||
                s.full_name?.toLowerCase().includes(q) ||
                s.student_id?.toLowerCase().includes(q) ||
                s.department?.toLowerCase().includes(q);
            const matchDept = filterDept === 'all' || s.department === filterDept;
            const matchSem = filterSem === 'all' || String(s.semester) === String(filterSem);
            return matchSearch && matchDept && matchSem;
        });
    }, [students, search, filterDept, filterSem]);

    const departments = useMemo(() => {
        const set = new Set(['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3', ...students.map((s) => s.department).filter(Boolean)]);
        return Array.from(set);
    }, [students]);

    return (
        <AdminGuard title="Salvation Heritage Student Directory">
            <div
                className="min-h-screen text-slate-100 flex flex-col pb-24 md:pb-0"
                style={{
                    background: 'radial-gradient(ellipse 100% 55% at 50% 0%, #0b1930 0%, #020617 65%)',
                    fontFamily: 'var(--font-inter)',
                }}
            >
                <AOSInit />
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
                                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 whitespace-nowrap">
                                        Directory
                                    </span>
                                </div>
                                <span className="hidden md:block text-slate-400 text-xs truncate">
                                    Official Biometric Student Roster &amp; Digital IDs
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
                                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all no-underline flex items-center gap-1.5 whitespace-nowrap"
                            >
                                <AnimatedIcon type="dashboard" size={15} />
                                <span>Analytics</span>
                            </Link>
                            <Link
                                href="/students"
                                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-emerald-600 shadow-md no-underline flex items-center gap-1.5 whitespace-nowrap"
                            >
                                <AnimatedIcon type="users" size={15} />
                                <span>Directory</span>
                            </Link>
                            <Link
                                href="/register"
                                className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition-all no-underline flex items-center gap-1.5 whitespace-nowrap"
                            >
                                <AnimatedIcon type="register" size={15} />
                                <span>+ Enroll</span>
                            </Link>
                        </nav>

                        <div className="flex items-center gap-2.5 flex-shrink-0">
                            <Link
                                href="/register"
                                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-lg shadow-blue-600/25 no-underline whitespace-nowrap"
                            >
                                <span>+ Enroll Student</span>
                            </Link>
                            <button
                                onClick={() => setMobileOpen((v) => !v)}
                                aria-label="Toggle Menu"
                                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 text-slate-200 border border-slate-800 cursor-pointer"
                            >
                                {mobileOpen ? '✕' : '☰'}
                            </button>
                        </div>
                    </div>

                    {mobileOpen && (
                        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-1.5">
                            <Link href="/" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-900 no-underline">
                                📸 Attendance Kiosk
                            </Link>
                            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-900 no-underline">
                                📊 Admin Analytics
                            </Link>
                            <Link href="/students" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 no-underline">
                                👥 Student Directory
                            </Link>
                            <Link href="/register" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-400 hover:bg-slate-900 no-underline">
                                📝 Enroll Student
                            </Link>
                        </div>
                    )}
                </header>

                {/* ── Hero Section ── */}
                <section className="relative overflow-hidden py-10 sm:py-14 px-4 sm:px-6 border-b border-blue-500/15 cyber-grid-bg">
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                            <div className="lg:col-span-7 space-y-5" data-aos="fade-right">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        Biometric Student Registry
                                    </span>
                                    <span className="text-[11px] font-bold px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 whitespace-nowrap">
                                        Salvation Heritage
                                    </span>
                                </div>

                                <h1
                                    className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]"
                                    style={{ fontFamily: 'var(--font-outfit)' }}
                                >
                                    Official Student{' '}
                                    <span className="block mt-1 bg-gradient-to-r from-blue-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                                        Biometric Directory
                                    </span>
                                </h1>

                                <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                                    Browse, search, and manage enrolled students and their facial biometric credentials across all Salvation Heritage classes.
                                </p>

                                <div className="grid grid-cols-3 gap-3 pt-1">
                                    {[
                                        { icon: '👥', val: students.length, label: 'Enrolled IDs' },
                                        { icon: '🏫', val: 6, label: 'Active Classes' },
                                        { icon: '📚', val: 3, label: 'Academic Terms' },
                                    ].map((s, i) => (
                                        <div key={i} className="bento-card rounded-2xl p-3.5 sm:p-4 flex items-center gap-3">
                                            <span className="text-xl sm:text-2xl flex-shrink-0">{s.icon}</span>
                                            <div className="min-w-0">
                                                <p className="text-white font-black text-lg sm:text-2xl leading-none" style={{ fontFamily: 'var(--font-outfit)' }}>
                                                    {s.val}
                                                </p>
                                                <p className="text-emerald-300 text-[10px] sm:text-xs font-semibold mt-1 truncate">{s.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-5 flex items-center justify-center" data-aos="fade-left" data-aos-delay="150">
                                <StudentDirectoryIllustration />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Filter & Directory Content ── */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 w-full">
                    {/* Command Filter Bar */}
                    <div className="bento-card rounded-3xl p-4 sm:p-6 mb-8 space-y-4">
                        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center justify-between">
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by student name, SAL-XXXX ID, or class..."
                                    className="input-premium pl-10 py-3 text-xs sm:text-sm"
                                />
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                            </div>

                            {/* Term Filter & View Switcher */}
                            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                                <select
                                    value={filterSem}
                                    onChange={(e) => setFilterSem(e.target.value)}
                                    className="flex-1 sm:flex-initial px-4 py-3 rounded-xl text-xs font-bold bg-slate-950 text-white border border-blue-500/30 focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="all">All Academic Terms</option>
                                    <option value="1">1st Term</option>
                                    <option value="2">2nd Term</option>
                                    <option value="3">3rd Term</option>
                                </select>

                                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                                    <button
                                        onClick={() => setView('grid')}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            view === 'grid'
                                                ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        ⊞ Cards
                                    </button>
                                    <button
                                        onClick={() => setView('table')}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            view === 'table'
                                                ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        ☰ Table
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Class Filter Pills */}
                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10 flex-wrap">
                            <div className="flex items-center gap-2 overflow-x-auto py-1">
                                {['all', ...departments].map((cls) => {
                                    const active = filterDept === cls;
                                    return (
                                        <button
                                            key={cls}
                                            onClick={() => setFilterDept(cls)}
                                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                                active
                                                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-md'
                                                    : 'bg-slate-950/90 text-slate-400 hover:text-white border border-slate-800'
                                            }`}
                                        >
                                            {cls === 'all' ? 'All Classes' : cls}
                                        </button>
                                    );
                                })}
                            </div>
                            <span className="text-xs font-mono text-slate-400">
                                Showing <strong className="text-emerald-400">{filtered.length}</strong> of {students.length} students
                            </span>
                        </div>
                    </div>

                    {/* Directory Roster Display */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                <div key={n} className="bento-card rounded-3xl h-80 animate-pulse p-5 flex flex-col justify-between">
                                    <div className="h-44 rounded-2xl bg-slate-800/60" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-2/3 rounded bg-slate-800" />
                                        <div className="h-3 w-1/3 rounded bg-slate-800" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bento-card rounded-3xl p-12 text-center">
                            <div className="text-4xl mb-3">🔍</div>
                            <h3 className="text-lg font-black text-white">No Students Found</h3>
                            <p className="text-xs text-slate-400 mt-1 mb-5">
                                No enrolled student matches your current search or class filter.
                            </p>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-emerald-600 no-underline shadow-lg"
                            >
                                + Enroll New Student
                            </Link>
                        </div>
                    ) : view === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                            {filtered.map((student) => (
                                <StudentCard key={student.student_id || student.id} student={student} onDelete={handleDelete} />
                            ))}
                        </div>
                    ) : (
                        <div className="bento-card rounded-3xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            <th className="text-left py-4 px-5">Student</th>
                                            <th className="text-left py-4 px-5">Student ID</th>
                                            <th className="text-left py-4 px-5">Class</th>
                                            <th className="text-left py-4 px-5">Term</th>
                                            <th className="text-right py-4 px-5">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {filtered.map((s) => (
                                            <tr key={s.student_id || s.id} className="hover:bg-slate-900/60 transition-colors">
                                                <td className="py-3.5 px-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-950 border border-blue-500/30 flex-shrink-0 flex items-center justify-center font-bold text-xs text-emerald-400">
                                                            {initials(s.full_name)}
                                                        </div>
                                                        <span className="font-bold text-white">{s.full_name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-5 font-mono text-xs font-bold text-emerald-400">{s.student_id}</td>
                                                <td className="py-3.5 px-5">
                                                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold">
                                                        {s.department}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-5 text-xs text-slate-300">
                                                    {s.semester === 1 ? '1st Term' : s.semester === 2 ? '2nd Term' : s.semester === 3 ? '3rd Term' : `Term ${s.semester}`}
                                                </td>
                                                <td className="py-3.5 px-5 text-right">
                                                    <button
                                                        onClick={() => handleDelete(s)}
                                                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>

                {/* ── Footer ── */}
                <footer className="border-t border-blue-500/15 bg-slate-950/95 py-6 text-xs text-slate-400">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-black bg-gradient-to-tr from-blue-600 to-emerald-500">
                                SH
                            </div>
                            <span className="font-semibold text-slate-300">Salvation Heritage Student Registry</span>
                        </div>
                        <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 font-semibold no-underline">
                            ← Return to Analytics Dashboard
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
                        <span className="text-[10px] font-bold">Enroll</span>
                    </Link>
                    <Link href="/dashboard" className="flex flex-col items-center gap-1 py-1 px-3 text-slate-400 hover:text-white no-underline">
                        <AnimatedIcon type="dashboard" size={20} />
                        <span className="text-[10px] font-bold">Admin</span>
                    </Link>
                    <Link href="/students" className="flex flex-col items-center gap-1 py-1 px-3 text-emerald-400 font-black no-underline">
                        <AnimatedIcon type="users" size={20} />
                        <span className="text-[10px] font-bold">Students</span>
                    </Link>
                </div>
            </div>
        </AdminGuard>
    );
}
