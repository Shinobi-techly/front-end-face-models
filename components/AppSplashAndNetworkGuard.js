'use client';

import { useState, useEffect } from 'react';
import AnimatedIcon from './AnimatedIcon';

/**
 * AppSplashAndNetworkGuard
 * 1. Displays a 5.5-second animated welcome splash screen using /loading.webm and /faceapk.png when entering the app.
 * 2. Monitors internet connectivity (online / offline) and displays a responsive warning modal when disconnected.
 */
export default function AppSplashAndNetworkGuard() {
    const [showSplash, setShowSplash] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isOffline, setIsOffline] = useState(false);
    const [checkingConnection, setCheckingConnection] = useState(false);

    // 1. Welcome Splash Screen (5.5 seconds on app entry)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // If already shown in this active tab session, skip repeat on route navigation
        const alreadyShown = sessionStorage.getItem('fa_welcome_splash_done');
        if (alreadyShown === 'true') {
            setShowSplash(false);
            return;
        }

        const durationMs = 5500; // 5.5 seconds
        const intervalMs = 50;
        const startTime = Date.now();

        const progressTimer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
            setProgress(pct);
            if (pct >= 100) {
                clearInterval(progressTimer);
            }
        }, intervalMs);

        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, durationMs - 450);

        const doneTimer = setTimeout(() => {
            sessionStorage.setItem('fa_welcome_splash_done', 'true');
            setShowSplash(false);
        }, durationMs);

        return () => {
            clearInterval(progressTimer);
            clearTimeout(fadeTimer);
            clearTimeout(doneTimer);
        };
    }, []);

    // 2. Live Internet Connection Monitor
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateStatus = () => {
            setIsOffline(!navigator.onLine);
        };

        updateStatus();

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);

        return () => {
            window.removeEventListener('online', updateStatus);
            window.removeEventListener('offline', updateStatus);
        };
    }, []);

    const handleRetryConnection = async () => {
        setCheckingConnection(true);
        try {
            await fetch('/manifest.json', { cache: 'no-store' });
            if (navigator.onLine) {
                setIsOffline(false);
            }
        } catch {
            setIsOffline(true);
        } finally {
            setTimeout(() => setCheckingConnection(false), 500);
        }
    };

    return (
        <>
            {/* ── 5.5-Second Welcome Loading Screen (/loading.webm) ── */}
            {showSplash && (
                <div
                    className={`fixed inset-0 z-[200] flex flex-col items-center justify-between p-6 bg-slate-950 text-white transition-opacity duration-500 select-none ${
                        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                    style={{
                        background: 'radial-gradient(ellipse 100% 60% at 50% 0%, #0b1930 0%, #020617 70%)',
                        fontFamily: 'var(--font-inter)',
                    }}
                >
                    {/* Top Brand Pill */}
                    <div className="pt-2 flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 shadow-lg">
                        <img
                            src="/faceapk.png"
                            alt="App Icon"
                            className="w-6 h-6 rounded-lg object-cover"
                        />
                        <span className="text-[11px] font-black tracking-wider uppercase text-emerald-300">
                            BENX VisionX · Smart Attendance
                        </span>
                    </div>

                    {/* Center Video (/loading.webm) + Welcome Message */}
                    <div className="w-full max-w-sm mx-auto flex flex-col items-center text-center my-auto py-4">
                        <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden bg-slate-900/90 border border-blue-500/35 shadow-[0_24px_80px_rgba(37,99,235,0.3)] mb-6 p-1.5">
                            <video
                                src="/loading.webm"
                                autoPlay
                                loop
                                muted
                                playsInline
                                onLoadedMetadata={(e) => {
                                    e.currentTarget.play().catch(() => {});
                                }}
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        </div>

                        <h1
                            className="text-2xl sm:text-3xl font-black text-white tracking-tight"
                            style={{ fontFamily: 'var(--font-outfit)' }}
                        >
                            Welcome
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xs leading-relaxed">
                            Preparing smart face recognition &amp; attendance portal...
                        </p>

                        {/* Smooth 5.5s Progress Bar */}
                        <div className="w-full max-w-xs mt-6">
                            <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                                <span className="text-emerald-400 uppercase tracking-wider">
                                    {progress < 40
                                        ? 'Loading Modules...'
                                        : progress < 80
                                        ? 'Connecting Camera & Portal...'
                                        : 'Ready! Welcome In'}
                                </span>
                                <span className="font-mono text-blue-300">{progress}%</span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-blue-600 via-emerald-500 to-teal-400 transition-all duration-100 ease-linear"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="pb-2 text-center">
                        <p className="text-[11px] font-semibold text-slate-500">
                            Powered by BENX VisionX
                        </p>
                    </div>
                </div>
            )}

            {/* ── Offline / No Internet Connection Warning Modal ── */}
            {isOffline && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
                    <div
                        className="relative w-full max-w-md rounded-3xl overflow-hidden border border-amber-500/45 bg-slate-900 shadow-[0_24px_80px_rgba(245,158,11,0.3)] p-6 sm:p-8 text-center"
                        style={{
                            background: 'linear-gradient(155deg, rgba(15, 23, 42, 0.98) 0%, rgba(28, 18, 8, 0.98) 100%)',
                        }}
                    >
                        {/* Top Alert Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-5">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                            <span>Connection Lost</span>
                        </div>

                        {/* App Icon + Alert Ring */}
                        <div className="relative w-24 h-24 mx-auto mb-5 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-3xl bg-amber-500/20 animate-pulse border border-amber-500/40" />
                            <img
                                src="/faceapk.png"
                                alt="BENX App"
                                className="relative z-10 w-16 h-16 rounded-2xl object-cover shadow-xl"
                            />
                        </div>

                        <h3
                            className="text-xl sm:text-2xl font-black text-white tracking-tight"
                            style={{ fontFamily: 'var(--font-outfit)' }}
                        >
                            No Internet Connection
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-sm mx-auto">
                            You are currently not connected to the internet. Please reconnect your Wi-Fi or mobile data to continue using the app.
                        </p>

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={handleRetryConnection}
                                disabled={checkingConnection}
                                className="w-full py-3.5 px-5 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                            >
                                <AnimatedIcon type="refresh" size={16} />
                                <span>{checkingConnection ? 'Checking Connection...' : 'Please Reconnect & Try Again'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

