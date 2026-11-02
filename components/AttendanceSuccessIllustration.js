'use client';

import AnimatedIcon from './AnimatedIcon';

/**
 * AttendanceSuccessIllustration
 * Confirmation card displayed when a student's attendance is marked.
 */
export default function AttendanceSuccessIllustration({ attendance, photoUrl, fallbackSvg }) {
    if (!attendance || !attendance.student) return null;

    const student = attendance.student;
    const isAlreadyMarked = attendance.alreadyMarked;

    return (
        <div
            className="flex-1 rounded-2xl sm:rounded-3xl overflow-hidden animate-scale-in"
            style={{
                background: 'linear-gradient(155deg, rgba(5, 150, 105, 0.12) 0%, rgba(10, 22, 45, 0.96) 60%, rgba(2, 6, 23, 0.98) 100%)',
                border: isAlreadyMarked ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(16, 185, 129, 0.45)',
                boxShadow: isAlreadyMarked
                    ? '0 30px 80px -12px rgba(0,0,0,0.8), 0 0 50px rgba(245,158,11,0.15)'
                    : '0 30px 80px -12px rgba(0,0,0,0.8), 0 0 50px rgba(16,185,129,0.2)',
            }}
        >
            {/* Header Status Bar */}
            <div
                className="px-4 sm:px-5 py-3 flex items-center justify-between"
                style={{
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(2, 6, 23, 0.7)',
                }}
            >
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAlreadyMarked ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isAlreadyMarked ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                    </span>
                    <span className={`text-xs font-black uppercase tracking-wider ${isAlreadyMarked ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {isAlreadyMarked ? 'Already Present Today' : 'Attendance Verified'}
                    </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                    {attendance.timestamp || 'Recorded'}
                </span>
            </div>

            {/* Student Details */}
            <div className="p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4">
                    <div className="relative flex-shrink-0">
                        <div
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 shadow-xl"
                            style={{
                                borderColor: isAlreadyMarked ? 'rgba(245, 158, 11, 0.6)' : 'rgba(16, 185, 129, 0.6)',
                            }}
                        >
                            <img
                                src={photoUrl(student.student_id)}
                                alt={student.full_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = fallbackSvg;
                                }}
                            />
                        </div>
                        <div
                            className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white shadow-lg"
                            style={{
                                background: isAlreadyMarked
                                    ? 'linear-gradient(135deg, #d97706, #b45309)'
                                    : 'linear-gradient(135deg, #10b981, #059669)',
                            }}
                        >
                            <AnimatedIcon type="check" size={14} />
                        </div>
                    </div>

                    <div className="min-w-0 text-center sm:text-left">
                        <h3 className="font-black text-lg sm:text-xl text-white truncate" style={{ fontFamily: 'var(--font-outfit)' }}>
                            {student.full_name}
                        </h3>
                        <p className="text-xs font-mono font-bold tracking-wider text-emerald-400 mt-0.5">
                            {student.student_id}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {student.department} · {student.year_intake || 'Current Session'}
                        </p>
                    </div>
                </div>

                {/* Confirmation Note */}
                <div className="relative rounded-xl sm:rounded-2xl p-3 flex items-center gap-3 overflow-hidden bg-slate-950/60 border border-emerald-500/20">
                    <div className="w-12 h-12 flex-shrink-0 relative">
                        <img
                            src="/illustrations/verified.svg"
                            alt="Attendance Verified"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white leading-tight">
                            {isAlreadyMarked ? 'Welcome back to class!' : 'Attendance Recorded'}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                            {isAlreadyMarked
                                ? 'Your attendance was already logged earlier today.'
                                : 'Your attendance has been recorded for today.'}
                        </p>
                    </div>
                </div>

                {/* Student Metadata Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                        { label: 'Student ID', val: student.student_id, mono: true },
                        { label: 'Class', val: student.department || '—' },
                        {
                            label: 'Term',
                            val: ['', '1st Term', '2nd Term', '3rd Term'][student.semester] || '1st Term',
                        },
                        { label: 'Session', val: student.year_intake || 'Current' },
                    ].map((d) => (
                        <div
                            key={d.label}
                            className="rounded-xl p-2.5"
                            style={{ background: 'rgba(2, 6, 23, 0.75)', border: '1px solid rgba(59, 130, 246, 0.12)' }}
                        >
                            <p className="text-[9px] uppercase font-bold tracking-wider text-slate-500">{d.label}</p>
                            <p className={`font-bold mt-0.5 text-xs truncate ${d.mono ? 'text-emerald-400 font-mono' : 'text-white'}`}>
                                {d.val}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
