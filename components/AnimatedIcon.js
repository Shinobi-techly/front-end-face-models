'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Dynamically import Lottie with no SSR
const LottieAnimation = dynamic(() => import('./LottieAnimation'), { ssr: false });

/**
 * Professional Animated Icon Component
 * Replaces emojis with beautiful Lottie animations
 * 
 * Usage:
 *   <AnimatedIcon name="face-scan" size={40} />
 *   <AnimatedIcon name="student" size={60} loop={false} />
 */
export default function AnimatedIcon({
    name = 'face-scan',
    size = 32,
    loop = true,
    autoplay = true,
    className = '',
    style = {},
}) {
    // Animation path mapping
    const animationPath = useMemo(() => {
        const animations = {
            'face-scan': '/animations/face-scan.json',
            'student': '/animations/student-register.json',
            'success': '/animations/attendance-success.json',
            'dashboard': '/animations/dashboard-stats.json',
            'camera': '/animations/camera-scan.json',
        };
        return animations[name] || animations['face-scan'];
    }, [name]);

    const containerStyle = {
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style,
    };

    return (
        <div className={`animated-icon ${className}`} style={containerStyle}>
            <LottieAnimation
                animationPath={animationPath}
                loop={loop}
                autoplay={autoplay}
            />
        </div>
    );
}
