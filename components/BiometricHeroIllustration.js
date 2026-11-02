'use client';

import { useState, useRef } from 'react';
import AnimatedIcon from './AnimatedIcon';

/**
 * BiometricHeroIllustration
 * Features the animated /camera.webm illustration on the Home Page
 * with clean, school-friendly styling and full responsiveness across all devices.
 */
export default function BiometricHeroIllustration({ className = '' }) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x, y });
    };

    const handleMouseLeave = () => {
        setMousePos({ x: 0, y: 0 });
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative select-none w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[420px] mx-auto flex items-center justify-center ${className}`}
            style={{ perspective: '1000px' }}
        >
            {/* Outer Ambient Glow */}
            <div
                className="absolute inset-0 pointer-events-none rounded-full"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.16) 0%, rgba(59, 116, 247, 0.1) 40%, transparent 70%)',
                    filter: 'blur(30px)',
                }}
            />

            {/* Main Showcase Card */}
            <div
                className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.12)] transition-transform duration-300 ease-out p-3.5 sm:p-5"
                style={{
                    background: 'linear-gradient(155deg, rgba(10, 25, 48, 0.95) 0%, rgba(3, 10, 22, 0.98) 100%)',
                    backdropFilter: 'blur(20px)',
                    transform: `rotateY(${mousePos.x * 8}deg) rotateX(${-mousePos.y * 8}deg)`,
                }}
            >
                {/* Header */}
                <div className="relative z-10 flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 text-[10px] font-semibold">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="tracking-wider font-bold text-emerald-400 uppercase truncate">
                            Attendance Kiosk
                        </span>
                    </div>
                    <span className="text-slate-400 hidden xs:inline">
                        Salvation Heritage
                    </span>
                </div>

                {/* Video Animation Container (/camera.webm) */}
                <div className="relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl bg-slate-950 border border-blue-500/15">
                    <video
                        src="/camera.webm"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Bottom Status Bar */}
                <div className="relative z-10 pt-2.5 mt-2.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                        <AnimatedIcon type="scan" size={13} className="text-blue-400" />
                        <span className="text-blue-300 font-semibold truncate">Face Attendance</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold whitespace-nowrap">
                        Fast Check-In
                    </span>
                </div>
            </div>
        </div>
    );
}
