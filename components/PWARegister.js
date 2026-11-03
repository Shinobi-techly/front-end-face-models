'use client';

import { useEffect, useState } from 'react';
import AnimatedIcon from './AnimatedIcon';

/**
 * PWARegister
 * Registers the Service Worker (/sw.js) and provides an install prompt banner
 * when the browser supports native PWA / Android app installation.
 */
export default function PWARegister() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [dismissed, setDismissed] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if already running as installed standalone APK / PWA
        const standalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
        setIsStandalone(standalone);

        // Register Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js', {
                    scope: '/',
                    updateViaCache: 'none',
                })
                .catch(() => {});
        }

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        const handleAppInstalled = () => {
            setDeferredPrompt(null);
            setIsStandalone(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice.catch(() => {});
        setDeferredPrompt(null);
    };

    if (isStandalone || dismissed || !deferredPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-20 md:bottom-5 right-4 left-4 sm:left-auto sm:w-96 z-50 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-emerald-500/35 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-black text-xs flex-shrink-0 shadow-md">
                    SH
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">
                        Install Salvation Heritage App
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                        Add to home screen for fast access
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                    type="button"
                    onClick={handleInstallClick}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-black text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-md cursor-pointer whitespace-nowrap"
                >
                    Install
                </button>
                <button
                    type="button"
                    onClick={() => setDismissed(true)}
                    aria-label="Dismiss install banner"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                    <AnimatedIcon type="refresh" size={12} />
                </button>
            </div>
        </div>
    );
}

