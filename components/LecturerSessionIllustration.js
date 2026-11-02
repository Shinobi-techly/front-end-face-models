'use client';

import AnimatedIcon from './AnimatedIcon';

/**
 * LecturerSessionIllustration
 * Classroom illustration for the Salvation Heritage Faculty Portal.
 */
export default function LecturerSessionIllustration({ className = '' }) {
    return (
        <div className={`relative select-none w-full max-w-[280px] xs:max-w-xs sm:max-w-sm mx-auto overflow-hidden rounded-2xl p-3 sm:p-4 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-blue-500/25 shadow-xl ${className}`}>
            <div className="relative w-full aspect-[16/10] flex items-center justify-center">
                <img
                    src="/illustrations/teacher-student.svg"
                    alt="Salvation Heritage Classroom Roll Call"
                    className="w-full h-full object-contain"
                />

                <div className="absolute top-1 left-1 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/85 border border-emerald-400/40 text-[9px] font-bold text-emerald-300 shadow-md whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    FACULTY PORTAL
                </div>

                <div className="absolute bottom-1 right-1 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/85 border border-blue-400/40 text-[9px] font-bold text-blue-300 shadow-md whitespace-nowrap">
                    <AnimatedIcon type="faculty" size={12} />
                    <span>CLASS ROLL CALL</span>
                </div>
            </div>
        </div>
    );
}
