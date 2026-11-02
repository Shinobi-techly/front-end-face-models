'use client';

import { useState, useRef } from 'react';

/**
 * BiometricHeroIllustration
 * A cutting-edge, fully responsive biometric face-recognition illustration
 * for Salvation Heritage High School. Seamlessly scales across mobile phones (320px+),
 * tablets, and high-DPI desktop screens without horizontal overflow.
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
            {/* Outer Ambient Glow Blobs */}
            <div
                className="absolute inset-0 pointer-events-none rounded-full"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.16) 0%, rgba(59, 116, 247, 0.1) 40%, transparent 70%)',
                    filter: 'blur(30px)',
                    animation: 'glow-pulse 4s ease-in-out infinite',
                }}
            />

            {/* Orbiting Ring 1 - Desktop / Tablet Only (hidden on small mobile to prevent overflow) */}
            <div
                className="hidden sm:block absolute pointer-events-none rounded-full border border-blue-500/20"
                style={{
                    inset: -20,
                    animation: 'spin-slow 28s linear infinite',
                }}
            >
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6]" />
                <div className="absolute -bottom-1 left-1/4 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            </div>

            {/* Orbiting Ring 2 - Contained within viewport bounds */}
            <div
                className="hidden xs:block absolute pointer-events-none rounded-full border border-dashed border-emerald-500/25"
                style={{
                    inset: -8,
                    animation: 'spin-reverse 20s linear infinite',
                }}
            >
                <div className="absolute top-1/3 -right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
                <div className="absolute bottom-1/4 -left-1 w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#8b5cf6]" />
            </div>

            {/* Main Interactive Glass Holographic Platter */}
            <div
                className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.12)] transition-transform duration-300 ease-out p-3.5 sm:p-5 md:p-6"
                style={{
                    background: 'linear-gradient(155deg, rgba(10, 25, 48, 0.95) 0%, rgba(3, 10, 22, 0.98) 100%)',
                    backdropFilter: 'blur(20px)',
                    transform: `rotateY(${mousePos.x * 10}deg) rotateX(${-mousePos.y * 10}deg)`,
                }}
            >
                {/* Tech Grid Background Pattern */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(59, 130, 246, 0.15) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(59, 130, 246, 0.15) 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px',
                    }}
                />

                {/* 4 Tech Viewfinder Corner Brackets */}
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-l-2 border-emerald-400/90 rounded-tl-sm pointer-events-none" />
                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-r-2 border-blue-400/90 rounded-tr-sm pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-l-2 border-blue-400/90 rounded-bl-sm pointer-events-none" />
                <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-r-2 border-emerald-400/90 rounded-br-sm pointer-events-none" />

                {/* Top Telemetry Header */}
                <div className="relative z-10 flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[9px] sm:text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="tracking-wider font-bold text-emerald-400 uppercase truncate">
                            AI FACIAL MESH • READY
                        </span>
                    </div>
                    <span className="text-slate-400 hidden xs:inline">
                        60 FPS • 99.8% MATCH
                    </span>
                </div>

                {/* Illustration Body & Scanning Matrix */}
                <div className="relative w-full aspect-[4/3] xs:aspect-[5/4] flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl bg-slate-950/40 border border-blue-500/15">
                    {/* The Illustration */}
                    <div className="relative w-full h-full flex items-center justify-center p-2 animate-float-subtle">
                        <img
                            src="/illustrations/ai-face.svg"
                            alt="Salvation Heritage AI Biometric Scanning Illustration"
                            className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(59,116,247,0.25)]"
                        />
                    </div>

                    {/* Biometric Laser Scanning Line */}
                    <div
                        className="absolute left-0 right-0 h-1 pointer-events-none"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, #10b981 25%, #38bdf8 50%, #10b981 75%, transparent 100%)',
                            boxShadow: '0 0 16px #10b981, 0 0 32px #38bdf8',
                            animation: 'scan-line 3s ease-in-out infinite',
                        }}
                    />

                    {/* Pulsing Facial Landmark Nodes */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Eye Right */}
                        <div
                            className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-ping"
                            style={{ top: '42%', left: '46%', animationDuration: '2.5s' }}
                        />
                        <div
                            className="absolute w-1.5 h-1.5 rounded-full bg-white"
                            style={{ top: '42.5%', left: '46.5%' }}
                        />

                        {/* Eye Left */}
                        <div
                            className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-ping"
                            style={{ top: '41%', left: '55%', animationDuration: '2.8s', animationDelay: '0.4s' }}
                        />
                        <div
                            className="absolute w-1.5 h-1.5 rounded-full bg-white"
                            style={{ top: '41.5%', left: '55.5%' }}
                        />

                        {/* Nose Bridge */}
                        <div
                            className="absolute w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-pulse"
                            style={{ top: '48%', left: '51%' }}
                        />

                        {/* Mouth Line */}
                        <div
                            className="absolute w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_6px_#34d399] animate-pulse"
                            style={{ top: '56%', left: '50%', animationDelay: '0.8s' }}
                        />

                        {/* Jawline Target Box */}
                        <div
                            className="absolute border border-emerald-400/50 rounded-lg pointer-events-none animate-pulse"
                            style={{
                                top: '32%',
                                left: '38%',
                                width: '27%',
                                height: '36%',
                                boxShadow: 'inset 0 0 12px rgba(16,185,129,0.15)',
                            }}
                        />
                    </div>

                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Bottom Telemetry HUD Bar */}
                <div className="relative z-10 pt-2.5 mt-2 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-slate-400 border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-blue-300 font-semibold truncate">AWS REKOGNITION</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="px-1.5 sm:px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold whitespace-nowrap">
                            &lt; 2 SECONDS
                        </span>
                        <span className="text-slate-500 hidden xs:inline">ID: SAL-AUTO</span>
                    </div>
                </div>
            </div>

            {/* Floating Pill - Top Left */}
            <div
                className="absolute -top-2.5 left-2 sm:-top-3 sm:-left-3 z-20 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-900/95 border border-emerald-400/40 shadow-xl backdrop-blur-md animate-float"
            >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[9px] sm:text-[10px] font-bold text-emerald-300 font-mono tracking-wider whitespace-nowrap">
                    SECURE BIOMETRIC
                </span>
            </div>

            {/* Floating Pill - Bottom Right */}
            <div
                className="absolute -bottom-2.5 right-2 sm:-bottom-3 sm:-right-3 z-20 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-900/95 border border-blue-400/40 shadow-xl backdrop-blur-md"
                style={{ animation: 'float 4s ease-in-out infinite', animationDelay: '1.5s' }}
            >
                <span className="text-xs">⚡</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-blue-300 font-mono tracking-wider whitespace-nowrap">
                    CONTACTLESS
                </span>
            </div>
        </div>
    );
}
