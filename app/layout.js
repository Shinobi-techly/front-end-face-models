import './globals.css';
import 'aos/dist/aos.css';
import ThemeWrapper from '../components/ThemeWrapper';
import { Outfit, Inter, JetBrains_Mono } from 'next/font/google';

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    weight: ['400', '500', '600', '700', '800', '900'],
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    weight: ['400', '500', '700'],
    display: 'swap',
});

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
