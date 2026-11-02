'use client';

import { useState } from 'react';
import AnimatedIcon from './AnimatedIcon';

/**
 * StudentRegisterIllustration
 * Features the /facehero.webm animated video on the Student Registration page.
 * Clean, responsive, and free of technical clutter.
 */
export default function StudentRegisterIllustration() {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative select-none w-full max-w-sm sm:max-w-md mx-auto"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Ambient Background Glow */}
            <div
                className="absolute inset-0 rounded-3xl opacity-60 blur-2xl transition-opacity duration-700 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(30, 75, 204, 0.35) 0%, rgba(16, 185, 129, 0.25) 50%, transparent 80%)',
                }}
            />

            {/* Main Showcase Container */}
            <div
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-500/30 shadow-[0_30px_90px_rgba(0,0,0,0.85)] p-4 sm:p-6"
                style={{
                    background: 'linear-gradient(155deg, rgba(15, 28, 54, 0.95) 0%, rgba(3, 10, 22, 0.98) 100%)',
                    backdropFilter: 'blur(20px)',
                    transform: hovered ? 'scale(1.01) translateY(-2px)' : 'scale(1) translateY(0)',
                    transition: 'transform 0.3s ease',
                }}
            >
                {/* Top Header */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-1.5 mb-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-emerald-400/40">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-300 tracking-wider uppercase whitespace-nowrap">
                            Student Registration
                        </span>
                    </div>
                    <span className="text-[10px] text-blue-300 font-bold whitespace-nowrap">
                        Salvation Heritage
                    </span>
                </div>

                {/* Animated Video (/facehero.webm) */}
                <div className="relative w-full aspect-[4/3] flex items-center justify-center rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
                    <video
                        src="/facehero.webm"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                    />
                </div>

                {/* 3 Simple Feature Tags */}
                <div className="relative z-10 grid grid-cols-3 gap-2 mt-3.5 pt-3.5 border-t border-white/10">
                    <div className="text-center p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <p className="text-emerald-400 text-xs font-black">Step 1</p>
                        <p className="text-[10px] text-slate-400 font-semibold truncate">Student Info</p>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <p className="text-blue-400 text-xs font-black">Step 2</p>
                        <p className="text-[10px] text-slate-400 font-semibold truncate">Face Capture</p>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <p className="text-violet-400 text-xs font-black">Step 3</p>
                        <p className="text-[10px] text-slate-400 font-semibold truncate">ID Ready</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
