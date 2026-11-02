'use client';

import { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';

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
    const lottieRef = useRef(null);

    useEffect(() => {
        if (animationPath && !animationData) {
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
    }, [animationPath, animationData]);

    const defaultStyle = {
        width: '100%',
        height: '100%',
        ...style,
    };

    if (loading) {
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
