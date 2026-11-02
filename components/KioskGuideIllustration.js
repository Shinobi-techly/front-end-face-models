'use client';

import Link from 'next/link';
import AnimatedIcon from './AnimatedIcon';

/**
 * KioskGuideIllustration
 * Guides students through the facial recognition process with an engaging
 * animated illustration of a student checking in at the kiosk terminal.
 * Fully responsive across all screen sizes.
 */
export default function KioskGuideIllustration() {
    return (
        <div className="flex flex-col h-full justify-between">
            {/* Visual Header Illustration */}
            <div className="relative rounded-2xl overflow-hidden p-3 bg-gradient-to-b from-slate-950/80 to-slate-900/60 border border-blue-500/20 mb-3 sm:mb-4 group">
                {/* Background Ambient Glow */}
                <div
                    className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
                        filter: 'blur(20px)',
                    }}
                />

                <div className="relative w-full aspect-[16/10] flex items-center justify-center">
                    <img
                        src="/illustrations/confirmed-attendance.svg"
                        alt="Salvation Heritage Attendance Kiosk Verification Illustration"
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Animated Pulse Indicator over the Verification Terminal */}
                    <div
                        className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400/80 pointer-events-none animate-ping"
                        style={{ top: '38%', right: '28%', animationDuration: '3s' }}
                    />
                    <div
                        className="absolute w-2 h-2 rounded-full bg-emerald-300 pointer-events-none shadow-[0_0_8px_#10b981]"
                        style={{ top: '39%', right: '29%' }}
                    />

                    {/* Floating mini badge: Instant Check-In */}
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur border border-emerald-400/40 text-[9px] font-bold text-emerald-300 flex items-center gap-1.5 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        INSTANT CHECK-IN
                    </div>
                </div>
            </div>

            {/* 3 Step Instruction Pills */}
            <div className="space-y-2 sm:space-y-2.5 mb-3 sm:mb-4">
                {[
                    { n: '1', title: 'Position Your Face', desc: 'Look directly at camera in clear lighting' },
                    { n: '2', title: 'Hold Steady', desc: 'Keep a neutral expression inside frame' },
                    { n: '3', title: 'Instant Verification', desc: 'AI marks your attendance in under 2 seconds' },
                ].map((s) => (
                    <div
                        key={s.n}
                        className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl transition-all duration-200 hover:translate-x-1"
                        style={{ background: 'rgba(2, 6, 23, 0.65)', border: '1px solid rgba(59, 130, 246, 0.12)' }}
                    >
                        <div
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-black text-white flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #1e4bcc, #059669)', boxShadow: '0 2px 8px rgba(30,75,204,0.4)' }}
                        >
                            {s.n}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-white leading-tight">{s.title}</p>
                            <p className="text-[10px] text-slate-400 leading-snug">{s.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Registration CTA button */}
            <Link
                href="/register"
                className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-[11px] sm:text-xs font-bold no-underline transition-all duration-300 hover:-translate-y-0.5 active:scale-95 text-center"
                style={{
                    color: '#6ee7b7',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 116, 247, 0.12))',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.1)',
                }}
            >
                <AnimatedIcon type="register" size={15} />
                <span>New Student? Enroll your face here →</span>
            </Link>
        </div>
    );
}
