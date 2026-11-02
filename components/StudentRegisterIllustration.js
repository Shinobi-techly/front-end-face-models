'use client';

import { useState } from 'react';

/**
 * StudentRegisterIllustration
 * A high-end animated illustration for the Student Registration page.
 * Features an interactive student digital ID enrollment illustration
 * with floating biometric security badges and holographic scanning effects.
 * Fully responsive from 320px mobile screens to large desktop monitors.
 */
export default function StudentRegisterIllustration() {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative select-none w-full max-w-sm sm:max-w-md mx-auto"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Ambient Background Glow (contained to prevent horizontal viewport overflow) */}
            <div
                className="absolute inset-0 rounded-3xl opacity-60 blur-2xl transition-opacity duration-700 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(30, 75, 204, 0.35) 0%, rgba(16, 185, 129, 0.25) 50%, transparent 80%)',
                }}
            />

            {/* Main Holographic Showcase Container */}
            <div
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-500/30 shadow-[0_30px_90px_rgba(0,0,0,0.85)] p-4 sm:p-6 md:p-8"
                style={{
                    background: 'linear-gradient(155deg, rgba(15, 28, 54, 0.95) 0%, rgba(3, 10, 22, 0.98) 100%)',
                    backdropFilter: 'blur(20px)',
                    transform: hovered ? 'scale(1.02) translateY(-4px)' : 'scale(1) translateY(0)',
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
            >
                {/* Tech Grid Background Lines */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(59, 130, 246, 0.2) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px',
                    }}
                />

                {/* Corner Frame Accents */}
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl pointer-events-none" />
                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-blue-400 rounded-tr pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-blue-400 rounded-bl pointer-events-none" />
                <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-emerald-400 rounded-br pointer-events-none" />

                {/* Top Badge Banner */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-1.5 mb-3 sm:mb-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-slate-950/80 border border-emerald-400/40 backdrop-blur-md shadow-md">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[9px] sm:text-[10px] font-mono font-black text-emerald-300 tracking-wider whitespace-nowrap">
                            STUDENT ENROLLMENT ID
                        </span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-mono text-blue-300 font-bold whitespace-nowrap">
                        SALVATION HERITAGE
                    </span>
                </div>

                {/* The Core Vector Illustration */}
                <div className="relative w-full aspect-[4/3] flex items-center justify-center rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950/50 border border-white/10 p-2 sm:p-3">
                    <img
                        src="/illustrations/id-card.svg"
                        alt="Student Digital ID Registration Illustration"
                        className="w-full h-full object-contain filter drop-shadow-[0_12px_28px_rgba(59,116,247,0.3)] animate-float-subtle"
                    />

                    {/* Holographic ID Scan Line */}
                    <div
                        className="absolute left-0 right-0 h-0.5 pointer-events-none"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, #38bdf8 50%, #34d399 100%)',
                            boxShadow: '0 0 12px #38bdf8, 0 0 24px #34d399',
                            animation: 'scan-line 3.2s ease-in-out infinite',
                        }}
                    />

                    {/* ID Card Floating Chip Highlight */}
                    <div
                        className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400/60 pointer-events-none animate-ping"
                        style={{ top: '48%', right: '35%', animationDuration: '2.5s' }}
                    />
                </div>

                {/* 3 Bottom Feature Tags */}
                <div className="relative z-10 grid grid-cols-3 gap-1.5 sm:gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
                    <div className="text-center p-1.5 sm:p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <p className="text-emerald-400 text-[11px] sm:text-xs font-black">100%</p>
                        <p className="text-[8px] sm:text-[9px] text-slate-400 font-semibold uppercase truncate">Contactless</p>
                    </div>
                    <div className="text-center p-1.5 sm:p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <p className="text-blue-400 text-[11px] sm:text-xs font-black">AWS</p>
                        <p className="text-[8px] sm:text-[9px] text-slate-400 font-semibold uppercase truncate">Facial AI</p>
                    </div>
                    <div className="text-center p-1.5 sm:p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <p className="text-violet-400 text-[11px] sm:text-xs font-black">Guard</p>
                        <p className="text-[8px] sm:text-[9px] text-slate-400 font-semibold uppercase truncate">Anti-Dup</p>
                    </div>
                </div>
            </div>

            {/* Orbiting Verification Pill */}
            <div
                className="absolute -bottom-2.5 left-2 sm:-bottom-3 sm:left-4 z-20 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-900/95 border border-emerald-400/50 shadow-xl backdrop-blur-md animate-float"
            >
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] sm:text-[10px] text-white font-bold">
                    ✓
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-white font-mono whitespace-nowrap">
                    Official Student Profile
                </span>
            </div>
        </div>
    );
}
