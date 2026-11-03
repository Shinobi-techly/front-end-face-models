'use client';

import AnimatedIcon from './AnimatedIcon';

/**
 * StopSessionModal
 * Animated warning modal featuring /stop.webm when a lecturer attempts
 * to sign out, leave, or refresh while an attendance session is still active.
 */
export default function StopSessionModal({
    isOpen,
    session,
    isStopping = false,
    onStopSession,
    onClose,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in-down">
            <div
                className="w-full max-w-lg rounded-3xl overflow-hidden border border-rose-500/40 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(244,63,94,0.2)] animate-scale-in"
                style={{
                    background: 'linear-gradient(155deg, rgba(24, 15, 38, 0.98) 0%, rgba(8, 12, 26, 0.99) 100%)',
                }}
            >
                {/* Top Alert Ribbon */}
                <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-rose-950/90 via-slate-900 to-amber-950/80 border-b border-rose-500/30 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                        </span>
                        <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-rose-300 truncate">
                            Active Class Session Running
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer flex-shrink-0"
                    >
                        X
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    {/* Animated Video Showcase (/stop.webm) */}
                    <div className="relative w-full max-w-[280px] sm:max-w-[320px] mx-auto aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-rose-500/35 shadow-xl">
                        <video
                            src="/stop.webm"
                            autoPlay
                            loop
                            muted
                            playsInline
                            onLoadedMetadata={(e) => {
                                e.currentTarget.play().catch(() => {});
                            }}
                            className="w-full h-full object-cover rounded-2xl"
                        />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-3 py-1 rounded-xl bg-slate-950/85 backdrop-blur border border-rose-400/30 text-[10px] font-bold text-rose-300">
                            <span>ACTION REQUIRED</span>
                            <span className="text-amber-300">SESSION OPEN</span>
                        </div>
                    </div>

                    {/* Warning Message Text */}
                    <div className="text-center space-y-1.5">
                        <h3
                            className="text-lg sm:text-2xl font-black text-white tracking-tight"
                            style={{ fontFamily: 'var(--font-outfit)' }}
                        >
                            Please Stop Session First
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                            Please stop your active class session before ending class, refreshing the page, or signing out.
                        </p>
                    </div>

                    {/* Active Session Details Pill */}
                    {session && (
                        <div className="rounded-2xl p-3 sm:p-3.5 bg-slate-950/90 border border-rose-500/25 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 flex-shrink-0">
                                    <AnimatedIcon type="alert" size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-white truncate">
                                        {session.course_name || 'Active Class'}{' '}
                                        {session.course_code ? `(${session.course_code})` : ''}
                                    </p>
                                    <p className="text-[11px] text-slate-400 truncate">
                                        Class {session.department || '—'} ·{' '}
                                        {session.semester === 1
                                            ? '1st Term'
                                            : session.semester === 2
                                            ? '2nd Term'
                                            : '3rd Term'}
                                    </p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap flex-shrink-0">
                                LIVE
                            </span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                        {onStopSession && (
                            <button
                                type="button"
                                onClick={onStopSession}
                                disabled={isStopping}
                                className="flex-1 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg shadow-rose-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <AnimatedIcon type="alert" size={16} />
                                <span>{isStopping ? 'Stopping Session...' : 'Stop Session Now'}</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all active:scale-95 cursor-pointer"
                        >
                            Return to Active Class
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

