'use client';

/**
 * StudentDirectoryIllustration
 * Illustrated visual for the Salvation Heritage Student Directory page.
 */
export default function StudentDirectoryIllustration() {
    return (
        <div className="relative group w-full max-w-[20rem] sm:max-w-sm md:max-w-md mx-auto select-none">
            <div
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 shadow-2xl p-4 sm:p-6"
                style={{
                    background: 'linear-gradient(155deg, rgba(15, 23, 42, 0.95) 0%, rgba(3, 10, 22, 0.98) 100%)',
                    backdropFilter: 'blur(16px)',
                }}
            >
                <div className="relative z-10 flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-emerald-400/40">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wide">
                            Student Roster · JSS1 – SS3
                        </span>
                    </div>
                </div>

                <div className="relative w-full aspect-[4/3] flex items-center justify-center rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950/40 border border-white/5 p-2">
                    <img
                        src="/illustrations/students-group.svg"
                        alt="Salvation Heritage Students"
                        className="w-full h-full object-contain"
                    />
                </div>

                <div className="relative z-10 flex flex-wrap items-center justify-between gap-1.5 pt-3 mt-3 border-t border-white/10 text-[10px] text-slate-400">
                    <span className="text-emerald-400 font-bold whitespace-nowrap">ENROLLED STUDENTS</span>
                    <span className="text-blue-300 font-semibold whitespace-nowrap">SALVATION HERITAGE</span>
                </div>
            </div>
        </div>
    );
}
