'use client';

/**
 * LecturerSessionIllustration
 * Classroom teacher illustration for the Salvation Heritage Faculty Portal.
 * Features an animated teacher and student at the smart blackboard.
 * Fully responsive across all devices from 320px mobile to desktop.
 */
export default function LecturerSessionIllustration({ className = '' }) {
    return (
        <div className={`relative select-none w-full max-w-[280px] xs:max-w-xs sm:max-w-sm mx-auto overflow-hidden rounded-2xl p-3 sm:p-4 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-blue-500/25 shadow-xl ${className}`}>
            {/* Ambient Background Glow */}
            <div
                className="absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                }}
            />

            {/* Illustration */}
            <div className="relative w-full aspect-[16/10] flex items-center justify-center">
                <img
                    src="/illustrations/teacher-student.svg"
                    alt="Salvation Heritage Faculty Classroom Roll Call Illustration"
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(30,75,204,0.3)] animate-float-subtle"
                />

                {/* Floating session indicator badge */}
                <div className="absolute top-1 left-1 flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-slate-950/85 border border-emerald-400/40 text-[8px] sm:text-[9px] font-mono font-bold text-emerald-300 shadow-md whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    INSTRUCTOR TERMINAL
                </div>

                {/* Floating classroom badge */}
                <div className="absolute bottom-1 right-1 flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-slate-950/85 border border-blue-400/40 text-[8px] sm:text-[9px] font-mono font-bold text-blue-300 shadow-md whitespace-nowrap">
                    <span>📚</span>
                    <span>ROLL CALL ACTIVE</span>
                </div>
            </div>
        </div>
    );
}
