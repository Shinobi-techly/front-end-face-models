'use client';

/**
 * FaceReferenceGuideIllustration
 * Interactive biometric facial enrollment guideline illustration
 * showing students the proper lighting, pose, and frame positioning.
 */
export default function FaceReferenceGuideIllustration({ studentName = 'Student' }) {
    return (
        <div className="rounded-2xl p-4 sm:p-5 bg-slate-950/90 border border-emerald-500/30 shadow-xl overflow-hidden relative">
            {/* Ambient Background Radial Glow */}
            <div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                }}
            />

            <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Animated Viewfinder Target Box */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-900 border-2 border-emerald-500/40 flex items-center justify-center shadow-lg group">
                    {/* Reference Face Image / Silhouette */}
                    <img
                        src="/face.jpg"
                        alt="Reference Face Positioning Standard"
                        className="w-full h-full object-cover filter contrast-105 brightness-105"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />

                    {/* Laser Scan Sweep Bar */}
                    <div
                        className="absolute left-0 right-0 h-1 pointer-events-none"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%)',
                            boxShadow: '0 0 12px #10b981',
                            animation: 'scan-line 2.5s ease-in-out infinite',
                        }}
                    />

                    {/* Viewfinder Corner Reticles */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />

                    {/* Center Crosshair */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                        <div className="w-6 h-0.5 bg-emerald-400" />
                        <div className="absolute h-6 w-0.5 bg-emerald-400" />
                    </div>

                    {/* Live Match Badge */}
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-950/85 border border-emerald-400/50 text-[8px] font-mono font-bold text-emerald-300">
                        ALIGN FACE
                    </div>
                </div>

                {/* Instruction Checklist */}
                <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <p className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                            BIOMETRIC REFERENCE STANDARD
                        </p>
                    </div>
                    <h4 className="text-sm font-black text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Center your face for {studentName}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        Salvation Heritage AI scans 106 facial landmarks to ensure instant, accurate attendance recognition.
                    </p>

                    {/* 3 Quick Tips */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>Direct eye contact</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>Good ambient light</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>Neutral expression</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
