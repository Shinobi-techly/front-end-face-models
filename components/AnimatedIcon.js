'use client';

/**
 * Professional Animated Icons Component
 * Replaces emojis with clean, animated SVG icons
 */

export default function AnimatedIcon({ type, className = "", size = 24 }) {
    const icons = {
        // Biometric / Face Recognition
        scan: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-pulse ${className}`} width={size} height={size}>
                <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10z"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
                <path d="M3 3h4m14 0h-4M3 21h4m14 0h-4" className="animate-ping-slow" opacity="0.5"/>
            </svg>
        ),

        // Camera
        camera: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4" className="animate-pulse"/>
            </svg>
        ),

        // Check / Success
        check: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
                <path d="M20 6 9 17l-5-5" className="animate-draw-check"/>
            </svg>
        ),

        // User / Student
        user: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
        ),

        // Users / Group
        users: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),

        // Faculty / Teacher
        faculty: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                <circle cx="12" cy="15" r="2" className="animate-pulse"/>
            </svg>
        ),

        // Clock / Time
        clock: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14" className="animate-rotate-slow"/>
            </svg>
        ),

        // Dashboard / Stats
        dashboard: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
        ),

        // Register / Edit
        register: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
        ),

        // Alert / Warning
        alert: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} animate-pulse`} width={size} height={size}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
        ),

        // Settings / Gear
        settings: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3" className="animate-spin-slow"/>
            </svg>
        ),

        // School / Building
        school: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
        ),

        // Success / Party
        success: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} animate-bounce-gentle`} width={size} height={size}>
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3"/>
                <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3"/>
            </svg>
        ),

        // Lock / Security
        lock: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
        ),

        // Live / Activity
        live: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
                <circle cx="12" cy="12" r="2" fill="currentColor" className="animate-pulse"/>
                <circle cx="12" cy="12" r="6" opacity="0.3" className="animate-ping-slow"/>
                <circle cx="12" cy="12" r="10" opacity="0.2" className="animate-ping"/>
            </svg>
        ),

        // Logout / Door
        logout: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
        ),
    };

    return icons[type] || icons.user;
}

// Animated Icon Grid Display Component
export function IconShowcase() {
    const iconTypes = ['scan', 'camera', 'check', 'user', 'users', 'faculty', 'clock', 'dashboard', 'register', 'alert', 'settings', 'school', 'success', 'lock', 'live', 'logout'];
    
    return (
        <div className="grid grid-cols-4 gap-4 p-6 bg-slate-900 rounded-2xl">
            {iconTypes.map(type => (
                <div key={type} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-950 hover:bg-slate-800 transition-colors">
                    <AnimatedIcon type={type} size={32} className="text-blue-400" />
                    <span className="text-xs text-slate-400">{type}</span>
                </div>
            ))}
        </div>
    );
}
