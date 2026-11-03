import './globals.css';
import 'aos/dist/aos.css';
import ThemeWrapper from '../components/ThemeWrapper';
import PWARegister from '../components/PWARegister';
import AppSplashAndNetworkGuard from '../components/AppSplashAndNetworkGuard';

// High-performance system typography fallbacks ensuring 100% build reliability without network dependency
const outfit = { variable: 'font-outfit' };
const inter = { variable: 'font-inter' };
const jetbrainsMono = { variable: 'font-mono' };

export const metadata = {
    title: 'Salvation Heritage — Smart Biometric Face Attendance System',
    description: 'Salvation Heritage School Biometric Attendance and Student Information Management System.',
    keywords: 'Salvation Heritage, face attendance, student attendance, school management, biometric',
    authors: [{ name: 'BENX' }],
    robots: 'noindex, nofollow',
    manifest: '/manifest.webmanifest',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'BENX Attend',
    },
    icons: {
        icon: [
            { url: '/faceapk.png', type: 'image/png' },
            { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
};

// Next.js 15+ requires viewport to be a separate named export
export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#020617',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
            <body className="min-h-screen bg-slate-950 w-full overflow-x-hidden" style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}>
                <ThemeWrapper>
                    <AppSplashAndNetworkGuard />
                    <PWARegister />
                    <main className="min-h-screen">
                        {children}
                    </main>
                </ThemeWrapper>
            </body>
        </html>
    );
}
