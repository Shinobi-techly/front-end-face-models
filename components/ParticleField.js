'use client';
import { useEffect, useRef } from 'react';

/**
 * Canvas-based particle field background.
 * Renders floating dots that drift and connect when near each other.
 * Completely GPU-accelerated via requestAnimationFrame.
 */
export default function ParticleField({ className = '', particleCount = 55, color = '#3b74f7', connectorColor = '#10b981' }) {
    const canvasRef = useRef(null);
    const animRef   = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Build particles
        const particles = Array.from({ length: particleCount }, () => ({
            x:  Math.random() * canvas.width,
            y:  Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r:  Math.random() * 1.8 + 0.6,
            opacity: Math.random() * 0.5 + 0.2,
        }));

        const hexToRgb = (hex) => {
            const m = hex.replace('#','').match(/.{2}/g);
            return m ? m.map(h => parseInt(h, 16)).join(',') : '59,116,247';
        };

        const pRgb = hexToRgb(color);
        const cRgb = hexToRgb(connectorColor);
        const CONNECT_DIST = 100;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update + draw particles
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height)  p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${pRgb}, ${p.opacity})`;
                ctx.fill();
            }

            // Draw connectors
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx   = particles[i].x - particles[j].x;
                    const dy   = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DIST) {
                        const alpha = (1 - dist / CONNECT_DIST) * 0.3;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${cRgb}, ${alpha})`;
                        ctx.lineWidth   = 0.7;
                        ctx.stroke();
                    }
                }
            }

            animRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [particleCount, color, connectorColor]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full ${className}`}
            style={{ pointerEvents: 'none' }}
            aria-hidden="true"
        />
    );
}
