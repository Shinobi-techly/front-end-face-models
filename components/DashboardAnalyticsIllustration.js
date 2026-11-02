'use client';

/**
 * DashboardAnalyticsIllustration
 * Dynamic animated analytics illustration for the Salvation Heritage
 * Administrative & Management Dashboard.
 * Fully responsive across all devices from 320px mobile to ultra-wide displays.
 */
export default function DashboardAnalyticsIllustration({ className = '' }) {
    return (
        <div className={`relative select-none rounded-2xl sm:rounded-3xl overflow-hidden p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950/95 border border-blue-500/20 shadow-2xl ${className}`}>
            {/* Ambient Background Glow (contained) */}
            <div
                className="absolute top-0 right-0 w-36 h-36 rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
                    filter: 'blur(30px)',
                }}
            />
            <div
                className="absolute bottom-0 left-0 w-36 h-36 rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
                    filter: 'blur(30px)',
                }}
            />

            <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-6">
                {/* Illustration Graphic */}
                <div className="relative w-full max-w-[240px] sm:max-w-xs md:max-w-none md:w-64 aspect-[4/3] flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                    <img
                        src="/illustrations/analytics.svg"
                        alt="Salvation Heritage Analytics & Reporting Illustration"
                        className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(59,116,247,0.3)] animate-float-subtle"
                    />

                    {/* Animated Pulse on Analytics Bar */}
                    <div
                        className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-400/80 pointer-events-none animate-ping"
                        style={{ top: '35%', right: '32%', animationDuration: '3s' }}
                    />
                </div>

                {/* Information Callout */}
                <div className="flex-1 min-w-0 text-center md:text-left">
                    <div className="inline-flex md:flex items-center gap-1.5 sm:gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
                            AUTOMATED BIOMETRIC ANALYTICS
                        </span>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-black text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Smart Attendance Intelligence
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                        Continuous live tracking of student attendance across JSS1 to SS3. Data is automatically synchronized and analyzed in real-time.
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-1.5 sm:gap-2.5 mt-3 sm:mt-4">
                        <span className="px-2.5 sm:px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-[11px] sm:text-xs font-semibold">
                            📈 Daily Roll Call Trends
                        </span>
                        <span className="px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px] sm:text-xs font-semibold">
                            ⚡ Instant CSV Export
                        </span>
                        <span className="px-2.5 sm:px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-[11px] sm:text-xs font-semibold">
                            🛡️ Tamper-Proof Audit
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
