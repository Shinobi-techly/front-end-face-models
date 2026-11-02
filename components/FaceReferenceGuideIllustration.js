'use client';

import AnimatedIcon from './AnimatedIcon';

/**
 * FaceReferenceGuideIllustration
 * Shows students simple, clear instructions for capturing their photo.
 */
export default function FaceReferenceGuideIllustration({ studentName = 'Student' }) {
    return (
        <div className="rounded-2xl p-4 sm:p-5 bg-slate-950/90 border border-emerald-500/30 shadow-xl overflow-hidden relative">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                {/* Reference Portrait Frame */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-900 border-2 border-emerald-500/40 flex items-center justify-center shadow-lg">
                    <img
                        src="/face.jpg"
                        alt="Face Positioning Example"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
                </div>

                {/* Simple Checklist */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="inline-flex sm:flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
                            Photo Guidelines
                        </p>
                    </div>
                    <h4 className="text-sm font-black text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Center your face for {studentName}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        Position your face clearly inside the camera frame with good lighting.
                    </p>

                    <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-left">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <AnimatedIcon type="check" size={14} className="text-emerald-400 flex-shrink-0" />
                            <span>Look at camera</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <AnimatedIcon type="check" size={14} className="text-emerald-400 flex-shrink-0" />
                            <span>Clear lighting</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <AnimatedIcon type="check" size={14} className="text-emerald-400 flex-shrink-0" />
                            <span>Neutral pose</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
