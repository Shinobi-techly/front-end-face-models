'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminGuard({ children, title = 'Administrative Portal' }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const auth = sessionStorage.getItem('fa_admin_auth');
            if (auth === 'true') {
                setIsAuthenticated(true);
            }
            setLoading(false);
        }
    }, []);

    const handleLogin = (e) => {
        e?.preventDefault();
        const trimmed = pin.trim().toLowerCase();
        const validCodes = ['admin123', '1234', 'salvation', 'heritage', 'admin', 'principal', '2026'];
        
        if (validCodes.includes(trimmed)) {
            sessionStorage.setItem('fa_admin_auth', 'true');
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Invalid Administrator Passcode. (Try default: admin123 or 1234)');
        }
    };

    const handleQuickUnlock = () => {
        sessionStorage.setItem('fa_admin_auth', 'true');
        setIsAuthenticated(true);
        setError('');
    };

    const handleLock = () => {
        sessionStorage.removeItem('fa_admin_auth');
        setIsAuthenticated(false);
        setPin('');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0B192C] to-[#042f2e] text-white flex flex-col justify-between p-4 sm:p-6" style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}>
                {/* Top Nav */}
                <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-3 sm:py-4 border-b border-white/10 gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-black text-xs sm:text-base shadow-lg shadow-blue-500/20 flex-shrink-0">
                            SH
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-extrabold text-sm sm:text-lg tracking-tight text-white truncate">Salvation Heritage</h2>
                            <p className="text-[9px] sm:text-[10px] text-emerald-400 font-semibold tracking-wider uppercase truncate">School Admin Portal</p>
                        </div>
                    </div>
                    <Link href="/" className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all whitespace-nowrap flex-shrink-0">
                        ← <span className="hidden sm:inline">Back to </span>Kiosk
                    </Link>
                </div>

                {/* Gate Card */}
                <div className="max-w-md mx-auto w-full my-auto py-6 sm:py-8">
                    <div className="relative rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-blue-500/30 p-5 sm:p-9 shadow-2xl backdrop-blur-xl">
                        {/* Glow effect */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>

                        {/* Icon Header */}
                        <div className="text-center mb-5 sm:mb-6">
                            <div className="w-13 h-13 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-emerald-400 flex items-center justify-center text-2xl sm:text-3xl shadow-xl shadow-blue-500/30">
                                🛡️
                            </div>
                            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Staff & Admin Access</h1>
                            <p className="text-xs text-slate-400 mt-1">
                                {title} is restricted to authorized school faculty, principal, and administrative staff.
                            </p>
                        </div>

                        {/* Passcode Form */}
                        <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 sm:mb-2">
                                    Admin Security PIN / Password
                                </label>
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    placeholder="Enter passcode (e.g. admin123)"
                                    autoFocus
                                    className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl bg-slate-950 border border-blue-500/40 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all text-center tracking-widest font-mono"
                                />
                            </div>

                            {error && (
                                <div className="p-2.5 sm:p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <span>🔐</span>
                                <span>Authorize & Enter</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleQuickUnlock}
                                className="w-full py-2 sm:py-2.5 rounded-xl text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
                            >
                                <span>⚡</span> Quick Staff Demo Unlock
                            </button>
                        </form>

                        <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-800 text-center">
                            <p className="text-[11px] text-slate-400">
                                Students can mark daily attendance or register freely from the main kiosk.
                            </p>
                            <Link href="/" className="inline-block mt-2 text-xs font-bold text-blue-400 hover:text-blue-300 underline">
                                Go to Student Attendance Kiosk →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-[11px] sm:text-xs text-slate-500 py-3 sm:py-4">
                    © {new Date().getFullYear()} Salvation Heritage — Biometric Attendance & School Management
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Top Admin Status Bar */}
            <div className="bg-slate-950/95 backdrop-blur-md border-b border-emerald-500/20 px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs text-slate-300 relative z-30">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
                    <span className="font-bold text-emerald-400 hidden sm:inline">Salvation Heritage</span>
                    <span className="text-slate-500 hidden sm:inline">•</span>
                    <span className="text-slate-200 font-medium text-[11px] sm:text-xs truncate">Admin Session Active</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors text-[11px] sm:text-xs flex items-center gap-1 whitespace-nowrap">
                        <span>📸</span>
                        <span className="hidden xs:inline">Student</span> Kiosk
                    </Link>
                    <button
                        onClick={handleLock}
                        className="px-2 sm:px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold transition-all text-[11px] sm:text-xs whitespace-nowrap flex items-center gap-1"
                    >
                        <span>🔒</span>
                        <span>Lock</span>
                    </button>
                </div>
            </div>
            {children}
        </div>
    );
}
