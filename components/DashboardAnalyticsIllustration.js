'use client';

import AnimatedIcon from './AnimatedIcon';

/**
 * DashboardAnalyticsIllustration
 * Prominently displays the /dashboard.webm animation on the Admin Dashboard page,
 * always playing and responsive across mobile, tablet, and desktop screens.
 */
export default function DashboardAnalyticsIllustration({ className = '' }) {
    return (
        <div className={`relative select-none rounded-2xl sm:rounded-3xl overflow-hidden p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950/95 border border-blue-500/25 shadow-2xl ${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
                {/* Video Animation (/dashboard.webm) */}
                <div className="md:col-span-5 lg:col-span-5">
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-emerald-500/30 shadow-[0_16px_40px_rgba(0,0,0,0.75)]">
                        <video
                            src="/dashboard.webm"
                            autoPlay
                            loop
                            muted
                            playsInline
                            onLoadedMetadata={(e) => {
                                e.currentTarget.play().catch(() => {});
                            }}
                            className="w-full h-full object-cover rounded-2xl"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur border border-emerald-400/40 text-[9px] font-bold text-emerald-300 flex items-center gap-1.5 shadow-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            LIVE DASHBOARD
                        </div>
                    </div>
                </div>

                {/* Information Callout */}
                <div className="md:col-span-7 lg:col-span-7 min-w-0 text-center md:text-left">
                    <div className="inline-flex md:flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] sm:text-xs font-bold tracking-wider text-emerald-400 uppercase">
                            Salvation Heritage Attendance Overview
                        </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Daily School Attendance Records
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-xl mx-auto md:mx-0">
                        Live attendance tracking across JSS1 to SS3 classes for Salvation Heritage High School. View present students, class summaries, and term progress in real time.
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2.5 mt-4">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-semibold">
                            <AnimatedIcon type="chart" size={14} />
                            <span>Daily Roll Call</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold">
                            <AnimatedIcon type="users" size={14} />
                            <span>JSS1 – SS3 Roster</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-semibold">
                            <AnimatedIcon type="check" size={14} />
                            <span>Verified Records</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
