'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnimatedIcon from './AnimatedIcon';

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
            setError('Invalid Administrator Passcode.');
        }
    };

    const handleLock = () => {
        sessionStorage.removeItem('fa_admin_auth');
        setIsAuthenticated(false);
        setPin('');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div
                className="min-h-screen text-white flex flex-col justify-between p-4 sm:p-6 cyber-grid-bg"
                style={{
                    background: 'radial-gradient(ellipse 100% 55% at 50% 0%, #0b1930 0%, #020617 65%)',
                    fontFamily: 'var(--font-inter)',
                }}
            >
                {/* Top Header */}
                <div className="max-w-5xl mx-auto w-full flex items-center justify-between py-3 sm:py-4 border-b border-blue-500/15 gap-3">
                    <Link href="/" className="flex items-center gap-2.5 sm:gap-3 no-underline min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-600/30 flex-shrink-0">
                            SH
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-black text-sm sm:text-lg tracking-tight text-white truncate" style={{ fontFamily: 'var(--font-outfit)' }}>
                                Salvation Heritage
                            </h2>
                            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider truncate">
                                Administration Portal
                            </p>
                        </div>
                    </Link>
                    <Link
                        href="/"
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all no-underline whitespace-nowrap flex-shrink-0"
                    >
                        Back to Kiosk
                    </Link>
                </div>

                {/* Security PIN Vault Card */}
                <div className="max-w-md mx-auto w-full my-auto py-8">
                    <div className="bento-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-emerald-500 flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
                                <AnimatedIcon type="shield" size={30} />
                            </div>
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                STAFF ACCESS ONLY
                            </span>
                            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-3" style={{ fontFamily: 'var(--font-outfit)' }}>
                                Staff Authorization
                            </h1>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                                Enter your staff security passcode to access {title}.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="label-premium text-center">Staff Passcode</label>
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    placeholder="Enter passcode"
                                    autoFocus
                                    className="input-premium text-center tracking-widest font-mono text-base"
                                />
                            </div>

                            {error && (
                                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2">
                                    <AnimatedIcon type="alert" size={15} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <AnimatedIcon type="lock" size={16} />
                                <span>Unlock Portal</span>
                            </button>
                        </form>

                        <div className="mt-6 pt-5 border-t border-white/10 text-center">
                            <Link href="/" className="text-xs font-bold text-blue-400 hover:text-blue-300 no-underline">
                                Return to Student Attendance Kiosk
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-slate-500 py-3">
                    Salvation Heritage High School
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Top Admin Bar */}
            <div className="bg-slate-950/95 border-b border-emerald-500/20 px-4 py-1.5 flex items-center justify-between text-xs text-slate-300 relative z-30">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                    <span className="font-bold text-emerald-400 hidden sm:inline">Salvation Heritage</span>
                    <span className="text-slate-600 hidden sm:inline">·</span>
                    <span className="text-slate-200 font-semibold text-[11px] truncate">Staff Session Active</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors text-[11px] font-semibold flex items-center gap-1 no-underline whitespace-nowrap">
                        <AnimatedIcon type="scan" size={13} />
                        <span>Kiosk</span>
                    </Link>
                    <button
                        onClick={handleLock}
                        className="px-2.5 py-0.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold transition-all text-[11px] flex items-center gap-1 whitespace-nowrap cursor-pointer"
                    >
                        <AnimatedIcon type="lock" size={12} />
                        <span>Lock Portal</span>
                    </button>
                </div>
            </div>
            {children}
        </div>
    );
}
