'use client';

import AnimatedIcon from './AnimatedIcon';

/**
 * Icon Demo Component - Shows all available professional icons
 * Use this to preview icons before replacing emojis
 */
export default function IconDemo() {
    const icons = [
        { type: 'scan', label: 'Biometric Scan', color: 'text-blue-400', description: 'Face recognition, attendance marking' },
        { type: 'camera', label: 'Camera', color: 'text-purple-400', description: 'Photo capture, registration' },
        { type: 'check', label: 'Success', color: 'text-green-400', description: 'Verified, completed, approved' },
        { type: 'user', label: 'Student', color: 'text-cyan-400', description: 'Individual profile, account' },
        { type: 'users', label: 'Students', color: 'text-indigo-400', description: 'Group, class roster, attendees' },
        { type: 'faculty', label: 'Faculty', color: 'text-emerald-400', description: 'Teacher, lecturer, instructor' },
        { type: 'clock', label: 'Time', color: 'text-amber-400', description: 'Schedule, duration, countdown' },
        { type: 'dashboard', label: 'Analytics', color: 'text-rose-400', description: 'Statistics, reports, charts' },
        { type: 'register', label: 'Register', color: 'text-yellow-400', description: 'Enroll, sign up, forms' },
        { type: 'alert', label: 'Alert', color: 'text-orange-400', description: 'Warning, error, attention' },
        { type: 'settings', label: 'Settings', color: 'text-slate-400', description: 'Configuration, preferences' },
        { type: 'school', label: 'Institution', color: 'text-blue-300', description: 'School, building, campus' },
        { type: 'success', label: 'Celebration', color: 'text-green-300', description: 'Achievement, milestone' },
        { type: 'lock', label: 'Security', color: 'text-red-400', description: 'PIN, password, protected' },
        { type: 'live', label: 'Live Status', color: 'text-emerald-500', description: 'Active, streaming, online' },
        { type: 'logout', label: 'Sign Out', color: 'text-rose-500', description: 'Exit, logout, disconnect' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black text-white mb-2">Professional Icon System</h1>
                    <p className="text-slate-400 text-sm">Animated SVG icons replacing emojis - Zero dependencies</p>
                </div>

                {/* Icon Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {icons.map(({ type, label, color, description }) => (
                        <div 
                            key={type}
                            className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all hover:scale-105 cursor-pointer group"
                        >
                            <div className="flex flex-col items-center text-center gap-3">
                                {/* Icon Display */}
                                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:bg-slate-800 transition-colors">
                                    <AnimatedIcon type={type} size={32} className={color} />
                                </div>

                                {/* Label */}
                                <div>
                                    <h3 className="text-white font-bold text-sm mb-1">{label}</h3>
                                    <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
                                </div>

                                {/* Usage Code */}
                                <code className="text-[10px] text-blue-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono w-full truncate">
                                    type=&quot;{type}&quot;
                                </code>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Examples Section */}
                <div className="mt-12 bg-slate-900 rounded-3xl p-8 border border-slate-800">
                    <h2 className="text-xl font-black text-white mb-6">Usage Examples</h2>
                    
                    <div className="space-y-6">
                        {/* Example 1: Button with Icon */}
                        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800">
                            <p className="text-xs text-slate-400 mb-3 font-mono">Button with Icon</p>
                            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl text-white font-bold text-sm hover:from-blue-500 hover:to-emerald-500 transition-all">
                                <AnimatedIcon type="scan" size={20} className="text-white" />
                                <span>Start Attendance Scan</span>
                            </button>
                        </div>

                        {/* Example 2: Status Indicator */}
                        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800">
                            <p className="text-xs text-slate-400 mb-3 font-mono">Live Status Indicator</p>
                            <div className="flex items-center gap-2">
                                <AnimatedIcon type="live" size={16} className="text-emerald-400" />
                                <span className="text-white font-semibold text-sm">Session Active</span>
                            </div>
                        </div>

                        {/* Example 3: Info Card */}
                        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800">
                            <p className="text-xs text-slate-400 mb-3 font-mono">Information Card</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                                    <AnimatedIcon type="users" size={24} className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">156 Students</p>
                                    <p className="text-slate-400 text-xs">Total Enrolled</p>
                                </div>
                            </div>
                        </div>

                        {/* Example 4: Navigation Item */}
                        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800">
                            <p className="text-xs text-slate-400 mb-3 font-mono">Navigation Menu Item</p>
                            <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all w-full">
                                <AnimatedIcon type="dashboard" size={20} className="text-blue-400" />
                                <span>Admin Dashboard</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Code Examples */}
                <div className="mt-8 bg-slate-900 rounded-3xl p-8 border border-slate-800">
                    <h2 className="text-xl font-black text-white mb-4">Quick Start Code</h2>
                    <pre className="bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-x-auto">
                        <code className="text-blue-300 text-xs font-mono">
{`import AnimatedIcon from '@/components/AnimatedIcon';

// Basic usage
<AnimatedIcon type="scan" size={24} className="text-blue-400" />

// With text
<div className="flex items-center gap-2">
  <AnimatedIcon type="faculty" size={20} className="text-emerald-400" />
  <span>Faculty Portal</span>
</div>

// In button
<button className="flex items-center gap-2">
  <AnimatedIcon type="camera" size={20} />
  <span>Take Photo</span>
</button>`}
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    );
}
