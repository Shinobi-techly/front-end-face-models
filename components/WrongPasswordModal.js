'use client';

import AnimatedIcon from './AnimatedIcon';

/**
 * WrongPasswordModal
 * Responsive animated alert modal using /wrong.webm when an Admin or Lecturer
 * enters an incorrect password or passcode.
 */
export default function WrongPasswordModal({
    open,
    onClose,
    roleLabel = 'Portal',
}) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md rounded-3xl overflow-hidden border border-rose-500/40 bg-slate-900 shadow-[0_24px_80px_rgba(244,63,94,0.35)] p-5 sm:p-7 text-center"
                style={{
                    background: 'linear-gradient(155deg, rgba(15, 23, 42, 0.98) 0%, rgba(28, 10, 20, 0.98) 100%)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top Alert Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/35 text-rose-300 text-[11px] font-bold uppercase tracking-wider mb-4">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                    <span>{roleLabel} · Access Denied</span>
                </div>

                {/* Video Container (/wrong.webm) */}
                <div className="relative w-full max-w-[230px] sm:max-w-[260px] aspect-square mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-rose-500/30 shadow-2xl mb-5">
                    <video
                        src="/wrong.webm"
                        autoPlay
                        loop
                        muted
                        playsInline
                        onLoadedMetadata={(e) => {
                            e.currentTarget.play().catch(() => {});
                        }}
                        className="w-full h-full object-cover rounded-2xl"
                    />
                </div>

                {/* Title & Message */}
                <h3
                    className="text-xl sm:text-2xl font-black text-white tracking-tight"
                    style={{ fontFamily: 'var(--font-outfit)' }}
                >
                    Wrong Password
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-sm mx-auto">
                    Wrong password. Please try again or meet the Admin for assistance.
                </p>

                {/* Action Button */}
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-3.5 px-5 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <AnimatedIcon type="refresh" size={16} />
                        <span>Try Again</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
