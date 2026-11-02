'use client';

import Link from 'next/link';
import AnimatedIcon from './AnimatedIcon';

/**
 * KioskGuideIllustration
 * Guides students through the attendance check-in process on the Home page
 * featuring the /home.webm animation.
 */
export default function KioskGuideIllustration() {
    return (
        <div className="flex flex-col h-full justify-between">
            {/* Animated Video Header (/home.webm) */}
            <div className="relative rounded-2xl overflow-hidden p-2.5 bg-gradient-to-b from-slate-950/80 to-slate-900/60 border border-blue-500/20 mb-3 sm:mb-4">
                <div className="relative w-full aspect-[16/10] flex items-center justify-center rounded-xl overflow-hidden bg-slate-950">
                    <video
                        src="/home.webm"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur border border-emerald-400/40 text-[9px] font-bold text-emerald-300 flex items-center gap-1.5 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        STUDENT CHECK-IN
                    </div>
                </div>
            </div>

            {/* 3 Simple Steps */}
            <div className="space-y-2 sm:space-y-2.5 mb-3 sm:mb-4">
                {[
                    { n: '1', title: 'Look at the Camera', desc: 'Stand clearly in front of the screen' },
                    { n: '2', title: 'Hold Steady', desc: 'Keep your face centered inside the box' },
                    { n: '3', title: 'Attendance Marked', desc: 'Your daily attendance is recorded automatically' },
                ].map((s) => (
                    <div
                        key={s.n}
                        className="flex items-center gap-2.5 sm:gap-3 p-2.5 rounded-xl transition-all duration-200"
                        style={{ background: 'rgba(2, 6, 23, 0.65)', border: '1px solid rgba(59, 130, 246, 0.12)' }}
                    >
                        <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #1e4bcc, #059669)' }}
                        >
                            {s.n}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-white leading-tight">{s.title}</p>
                            <p className="text-[11px] text-slate-400 leading-snug">{s.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Registration CTA button */}
            <Link
                href="/register"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold no-underline transition-all duration-300 hover:-translate-y-0.5 active:scale-95 text-center"
                style={{
                    color: '#6ee7b7',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 116, 247, 0.12))',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
            >
                <AnimatedIcon type="register" size={15} />
                <span>New Student? Register Here</span>
            </Link>
        </div>
    );
}
