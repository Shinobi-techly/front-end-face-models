'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

/**
 * Professional Lottie Animation Component
 * Supports autoplay, loop, and custom styling
 * Optimized for performance with lazy loading
 */
export default function LottieAnimation({
    animationData,
    animationPath,
    loop = true,
    autoplay = true,
    className = '',
    style = {},
    speed = 1,
    onComplete,
}) {
    const [animation, setAnimation] = useState(animationData || null);
    const [loading, setLoading] = useState(!animationData);
    const [mounted, setMounted] = useState(false);
    const lottieRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (animationPath && !animationData && mounted) {
            fetch(animationPath)
                .then(res => res.json())
                .then(data => {
                    setAnimation(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to load animation:', err);
                    setLoading(false);
                });
        }
    }, [animationPath, animationData, mounted]);

    const defaultStyle = {
        width: '100%',
        height: '100%',
        ...style,
    };

    if (!mounted || loading) {
        return (
            <div className={`flex items-center justify-center ${className}`} style={defaultStyle}>
                <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!animation) {
        return null;
    }

    return (
        <Lottie
            lottieRef={lottieRef}
            animationData={animation}
            loop={loop}
            autoplay={autoplay}
            speed={speed}
            className={className}
            style={defaultStyle}
            onComplete={onComplete}
        />
    );
}
