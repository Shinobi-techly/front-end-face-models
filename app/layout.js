import './globals.css';
import 'aos/dist/aos.css';
import ThemeWrapper from '../components/ThemeWrapper';
// High-performance system typography fallbacks ensuring 100% build reliability without network dependency
const outfit = { variable: 'font-outfit' };
const inter = { variable: 'font-inter' };
const jetbrainsMono = { variable: 'font-mono' };

export const metadata = {
    title: 'Salvation Heritage — Smart Biometric Face Attendance System',
    description: 'Salvation Heritage School Biometric Attendance and Student Information Management System.',
    keywords: 'Salvation Heritage, face attendance, student attendance, school management, biometric',
    authors: [{ name: 'Salvation Heritage' }],
    robots: 'noindex, nofollow',
};

// Next.js 15+ requires viewport to be a separate named export
export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
            <body className="min-h-screen bg-slate-950 w-full overflow-x-hidden" style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}>
                <ThemeWrapper>
                    <main className="min-h-screen">
                        {children}
                    </main>
                </ThemeWrapper>
            </body>
        </html>
    );
}
