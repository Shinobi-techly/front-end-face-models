'use client';

import AnimatedIcon from './AnimatedIcon';

/**
 * DashboardAnalyticsIllustration
 * Clean analytics header card for the Salvation Heritage Admin Dashboard.
 */
export default function DashboardAnalyticsIllustration({ className = '' }) {
    return (
        <div className={`relative select-none rounded-2xl sm:rounded-3xl overflow-hidden p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950/95 border border-blue-500/20 shadow-2xl ${className}`}>
            <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-6">
                {/* Illustration Graphic */}
                <div className="relative w-full max-w-[220px] sm:max-w-xs md:w-60 aspect-[4/3] flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                    <img
                        src="/illustrations/analytics.svg"
                        alt="Salvation Heritage Attendance Overview"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Information Callout */}
                <div className="flex-1 min-w-0 text-center md:text-left">
                    <div className="inline-flex md:flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                            School Attendance Overview
                        </span>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-black text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Daily Attendance Records
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                        Live attendance tracking across JSS1 to SS3 classes for Salvation Heritage High School.
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-semibold">
                            <AnimatedIcon type="chart" size={13} />
                            <span>Daily Roll Call</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold">
                            <AnimatedIcon type="users" size={13} />
                            <span>JSS1 – SS3 Roster</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-semibold">
                            <AnimatedIcon type="check" size={13} />
                            <span>Verified Records</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
