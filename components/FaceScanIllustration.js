'use client';
import { useEffect, useRef } from 'react';

/**
 * Pure CSS/SVG animated face-scan illustration.
 * Zero external dependencies — works offline, loads instantly.
 * Used on the home page attendance kiosk section.
 */
export default function FaceScanIllustration({ size = 220, color = '#10b981', className = '' }) {
    const svgRef = useRef(null);

    useEffect(() => {
        // Randomise particle timing so they don't all move in sync
        const particles = svgRef.current?.querySelectorAll('.fp');
        particles?.forEach((p, i) => {
            p.style.animationDelay = `${(i * 0.37) % 2.1}s`;
            p.style.animationDuration = `${2.2 + (i * 0.3) % 1.5}s`;
        });
    }, []);

    const c = color;
    const dim = size;

    return (
        <svg
            ref={svgRef}
            width={dim} height={dim}
            viewBox="0 0 220 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Face scan biometric illustration"
            role="img"
        >
            <defs>
                <linearGradient id="faceGrad" x1="0" y1="0" x2="220" y2="220" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#3b74f7" stopOpacity="0.9" />
                    <stop offset="100%" stopColor={c} stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="scanGrad" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"   stopColor={c} stopOpacity="0" />
                    <stop offset="50%"  stopColor={c} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={c} stopOpacity="0" />
                </linearGradient>
                <radialGradient id="bgGrad" cx="50%" cy="50%">
                    <stop offset="0%"   stopColor="#0a1628" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#020617" stopOpacity="1" />
                </radialGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <clipPath id="faceClip">
                    <ellipse cx="110" cy="100" rx="52" ry="62" />
                </clipPath>
                <style>{`
                    @keyframes face-scan {
                        0%, 5%   { transform: translateY(0px);   opacity: 0; }
                        10%      { opacity: 1; }
                        50%      { transform: translateY(120px); opacity: 1; }
                        90%      { opacity: 1; }
                        95%, 100%{ transform: translateY(120px); opacity: 0; }
                    }
                    @keyframes ring-pulse {
                        0%,100% { opacity: 0.3; r: 80; }
                        50%     { opacity: 0.7; r: 84; }
                    }
                    @keyframes ring2-pulse {
                        0%,100% { opacity: 0.15; r: 100; }
                        50%     { opacity: 0.4;  r: 104; }
                    }
                    @keyframes corner-blink {
                        0%,100% { opacity: 0.5; }
                        50%     { opacity: 1; }
                    }
                    @keyframes dot-float {
                        0%   { transform: translateY(0); opacity: 0; }
                        20%  { opacity: 1; }
                        80%  { opacity: 0.6; }
                        100% { transform: translateY(-28px); opacity: 0; }
                    }
                    @keyframes data-flash {
                        0%,100%{ opacity: 0.3; }
                        50%    { opacity: 1; }
                    }
                    .scan-line  { animation: face-scan 2.8s ease-in-out infinite; }
                    .ring-1     { animation: ring-pulse 2.2s ease-in-out infinite; }
                    .ring-2     { animation: ring2-pulse 2.2s ease-in-out infinite; animation-delay: 0.5s; }
                    .corner-g   { animation: corner-blink 1.5s ease-in-out infinite; }
                    .fp         { animation: dot-float 2s ease-in infinite; }
                    .data-txt   { animation: data-flash 1.8s ease-in-out infinite; }
                `}</style>
            </defs>

            {/* Background circle */}
            <circle cx="110" cy="110" r="105" fill="url(#bgGrad)" />

            {/* Outer pulsing rings */}
            <circle className="ring-2" cx="110" cy="110" r="100" stroke={c} strokeWidth="1" fill="none" strokeOpacity="0.2" />
            <circle className="ring-1" cx="110" cy="110" r="80"  stroke={c} strokeWidth="1.5" fill="none" strokeOpacity="0.4" />

            {/* Face outline */}
            <ellipse cx="110" cy="100" rx="52" ry="62" stroke="url(#faceGrad)" strokeWidth="1.5" fill="rgba(10,20,40,0.6)" />

            {/* Forehead hairline */}
            <path d="M 68 85 Q 80 55 110 50 Q 140 55 152 85" stroke={c} strokeWidth="1" fill="none" strokeOpacity="0.5" />

            {/* Eyes */}
            <ellipse cx="93"  cy="96" rx="10" ry="7" fill="none" stroke={c} strokeWidth="1.5" filter="url(#glow)" />
            <ellipse cx="127" cy="96" rx="10" ry="7" fill="none" stroke={c} strokeWidth="1.5" filter="url(#glow)" />
            <circle  cx="93"  cy="96" r="3.5" fill={c} opacity="0.8" />
            <circle  cx="127" cy="96" r="3.5" fill={c} opacity="0.8" />
            {/* Eye shine */}
            <circle cx="90" cy="94" r="1.2" fill="white" opacity="0.9" />
            <circle cx="124" cy="94" r="1.2" fill="white" opacity="0.9" />

            {/* Nose bridge lines */}
            <line x1="105" y1="103" x2="102" y2="115" stroke={c} strokeWidth="1" strokeOpacity="0.4" />
            <line x1="115" y1="103" x2="118" y2="115" stroke={c} strokeWidth="1" strokeOpacity="0.4" />

            {/* Smile */}
            <path d="M 96 128 Q 110 138 124 128" stroke={c} strokeWidth="1.5" fill="none" filter="url(#glow)" />

            {/* Measurement grid lines */}
            <line x1="68" y1="96"  x2="83"  y2="96"  stroke={c} strokeWidth="0.75" strokeOpacity="0.35" />
            <line x1="137" y1="96" x2="152" y2="96"  stroke={c} strokeWidth="0.75" strokeOpacity="0.35" />
            <line x1="110" y1="38" x2="110" y2="48"  stroke={c} strokeWidth="0.75" strokeOpacity="0.35" />
            <line x1="110" y1="152" x2="110" y2="162" stroke={c} strokeWidth="0.75" strokeOpacity="0.35" />

            {/* Biometric dots on face */}
            {[
                [93,88],[127,88],[110,78],[93,104],[127,104],
                [110,112],[96,120],[124,120],[110,132],[82,96],[138,96]
            ].map(([x,y], i) => (
                <circle key={i} cx={x} cy={y} r="1.5" fill={c} opacity="0.6" />
            ))}

            {/* Scan line (clipped to face) */}
            <g clipPath="url(#faceClip)">
                <rect className="scan-line" x="58" y="38" width="104" height="3"
                    fill="url(#scanGrad)"
                    style={{ filter: `drop-shadow(0 0 6px ${c})` }}
                />
            </g>

            {/* Corner brackets */}
            {/* TL */}
            <g className="corner-g" filter="url(#glow)">
                <path d="M 18 42 L 18 24 L 36 24" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* TR */}
                <path d="M 184 42 L 184 24 L 166 24" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* BL */}
                <path d="M 18 178 L 18 196 L 36 196" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* BR */}
                <path d="M 184 178 L 184 196 L 166 196" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>

            {/* Floating data particles */}
            {[
                { cx: 32,  cy: 120, delay: 0 },
                { cx: 188, cy: 90,  delay: 0.7 },
                { cx: 55,  cy: 75,  delay: 1.4 },
                { cx: 170, cy: 145, delay: 0.3 },
                { cx: 40,  cy: 160, delay: 1.0 },
            ].map((p, i) => (
                <circle key={i} className="fp" cx={p.cx} cy={p.cy} r="2.5"
                    fill={c} opacity="0"
                    style={{ animationDelay: `${p.delay}s` }}
                />
            ))}

            {/* Data text overlays */}
            <text className="data-txt" x="18" y="142" fill={c} fontSize="7" fontFamily="var(--font-mono, monospace)" opacity="0.6">ID:SAL</text>
            <text className="data-txt" x="170" y="78"  fill={c} fontSize="7" fontFamily="var(--font-mono, monospace)" opacity="0.6" style={{ animationDelay: '0.9s' }}>98.7%</text>
            <text className="data-txt" x="18"  y="78"  fill={c} fontSize="7" fontFamily="var(--font-mono, monospace)" opacity="0.6" style={{ animationDelay: '1.6s' }}>LIVE</text>

            {/* Bottom status bar */}
            <rect x="55" y="200" width="110" height="14" rx="7" fill="rgba(16,185,129,0.1)" stroke={c} strokeWidth="0.75" strokeOpacity="0.4" />
            <rect x="57" y="202" width="70" height="10" rx="5" fill={c} opacity="0.6">
                <animate attributeName="width" values="0;70;70;0" dur="2.8s" repeatCount="indefinite" />
            </rect>
            <text x="110" y="210" textAnchor="middle" fill={c} fontSize="7" fontFamily="var(--font-mono, monospace)" opacity="0.9">SCANNING…</text>
        </svg>
    );
}
