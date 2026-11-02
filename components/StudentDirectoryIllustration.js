

'use client';

/**
 * StudentDirectoryIllustration
 * Illustrated visual for the Salvation Heritage Student Directory page,
 * showing a vibrant group of high school students.
 */
export default function StudentDirectoryIllustration() {
    return (
        <div className="relative group w-80 sm:w-96 md:w-[26rem] mx-auto select-none">
            {/* Ambient Multi-Color Glow */}
            <div
                className="absolute -inset-4 rounded-3xl opacity-60 blur-3xl pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 80%)',
                }}
            />

            {/* Container Frame */}
            <div
                className="relative rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl p-6"
                style={{
                    background: 'linear-gradient(155deg, rgba(15, 23, 42, 0.95) 0%, rgba(3, 10, 22, 0.98) 100%)',
                    backdropFilter: 'blur(16px)',
                }}
            >
                {/* Tech Grid Pattern */}
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

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-emerald-400/40">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase">
                            STUDENT ROSTER • JSS1 - SS3
                        </span>
                    </div>
                </div>

                {/* The Illustration */}
                <div className="relative w-full aspect-[4/3] flex items-center justify-center rounded-2xl overflow-hidden bg-slate-950/40 border border-white/5 p-2">
                    <img
                        src="/illustrations/students-group.svg"
                        alt="Salvation Heritage Students Group Illustration"
                        className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(59,116,247,0.3)] animate-float-subtle"
                    />

                    {/* Shimmer Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Bottom Badge */}
                <div className="relative z-10 flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-[10px] font-mono text-slate-400">
                    <span className="text-emerald-400 font-bold">100% BIOMETRICALLY ENROLLED</span>
                    <span className="text-blue-300">SALVATION HERITAGE</span>
                </div>
            </div>
        </div>
    );
}
