'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import AnimatedIcon from './AnimatedIcon';

/**
 * Multi-Frame Biometric Liveness & Anti-Spoofing Analyzer
 * Evaluates 6 sequential frames captured during the 3-second countdown to block:
 * 1. Phone-on-phone screens (OLED/LCD blue backlight emission, specular screen glare, and sharp rectangular device bezels)
 * 2. Printed or static photos (lack of non-rigid facial micro-motion / eye blink)
 * 3. Non-face / covered camera frames (absence of natural facial skin chrominance & 3D shading)
 */
function analyzeBiometricLiveness(frames) {
    if (!frames || frames.length < 3) {
        return {
            passed: false,
            reason: 'Could not verify live camera stream. Please hold steady and face the camera directly.',
        };
    }

    const width = frames[0].width;
    const height = frames[0].height;

    // Center Face ROI (middle 50% width, middle 62% height)
    const roiX0 = Math.floor(width * 0.25);
    const roiX1 = Math.floor(width * 0.75);
    const roiY0 = Math.floor(height * 0.19);
    const roiY1 = Math.floor(height * 0.81);

    const lastFrame = frames[frames.length - 1].data;

    let roiPixels = 0;
    let skinPixels = 0;
    let blueScreenPixels = 0;
    let specularGlarePixels = 0;
    let lumaSum = 0;
    let lumaSqSum = 0;
    let sharpRectEdgeSpikes = 0;

    for (let y = roiY0; y < roiY1; y++) {
        for (let x = roiX0; x < roiX1; x++) {
            const idx = (y * width + x) * 4;
            const r = lastFrame[idx];
            const g = lastFrame[idx + 1];
            const b = lastFrame[idx + 2];

            roiPixels++;

            const luma = 0.299 * r + 0.587 * g + 0.114 * b;
            lumaSum += luma;
            lumaSqSum += luma * luma;

            // YCbCr chrominance for universal human skin tones (Fitzpatrick I - VI)
            const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
            const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

            const isSkinTone =
                r > 32 &&
                g > 20 &&
                b > 12 &&
                r >= b - 2 &&
                cr >= 130 &&
                cr <= 185 &&
                cb >= 75 &&
                cb <= 142;

            if (isSkinTone) {
                skinPixels++;
            }

            // Emissive LCD/OLED phone screen blue backlight signature
            if (b > 80 && b > r + 18 && b > g + 6) {
                blueScreenPixels++;
            }

            // Clipped white screen backlight / glass specular reflection
            if (r > 246 && g > 246 && b > 246) {
                specularGlarePixels++;
            }

            // High-frequency artificial screen step-edge / Moire check
            if (x > roiX0 && y > roiY0) {
                const prevXIdx = (y * width + (x - 1)) * 4;
                const prevYIdx = ((y - 1) * width + x) * 4;
                const dx = Math.abs(r - lastFrame[prevXIdx]) + Math.abs(b - lastFrame[prevXIdx + 2]);
                const dy = Math.abs(r - lastFrame[prevYIdx]) + Math.abs(b - lastFrame[prevYIdx + 2]);
                if (dx > 135 || dy > 135) {
                    sharpRectEdgeSpikes++;
                }
            }
        }
    }

    const skinRatio = skinPixels / Math.max(1, roiPixels);
    const blueScreenRatio = blueScreenPixels / Math.max(1, roiPixels);
    const glareRatio = specularGlarePixels / Math.max(1, roiPixels);
    const edgeSpikeRatio = sharpRectEdgeSpikes / Math.max(1, roiPixels);
    const meanLuma = lumaSum / Math.max(1, roiPixels);
    const lumaVariance = lumaSqSum / Math.max(1, roiPixels) - meanLuma * meanLuma;
    const lumaStdDev = Math.sqrt(Math.max(0, lumaVariance));

    // 1. Block Phone-on-Phone Screen Spoofing (Blue backlight emission, screen glare, or sharp bezel contrast)
    if (
        blueScreenRatio > 0.16 ||
        glareRatio > 0.16 ||
        (blueScreenRatio > 0.09 && glareRatio > 0.07) ||
        edgeSpikeRatio > 0.085
    ) {
        return {
            passed: false,
            reason: 'Phone screen or digital display reflection detected. Using a phone screen to mark attendance is restricted — only a real live face is permitted.',
        };
    }

    // 2. Block Non-Face / Covered Camera / Washed-out Flat Photo
    if (skinRatio < 0.13 || lumaStdDev < 9) {
        return {
            passed: false,
            reason: 'No real 3D live face detected inside the alignment frame. Please position your real face clearly in front of the camera.',
        };
    }

    // 3. Multi-Frame Temporal Liveness Analysis (Inner facial features vs. Outer frame)
    let maxInnerDiff = 0;
    let totalInnerDiff = 0;
    let totalOuterDiff = 0;
    let pairsCount = 0;

    for (let i = 1; i < frames.length; i++) {
        const prev = frames[i - 1].data;
        const curr = frames[i].data;

        let innerSum = 0;
        let innerCount = 0;
        let outerSum = 0;
        let outerCount = 0;

        for (let y = 0; y < height; y += 2) {
            for (let x = 0; x < width; x += 2) {
                const idx = (y * width + x) * 4;
                const diff =
                    (Math.abs(curr[idx] - prev[idx]) +
                        Math.abs(curr[idx + 1] - prev[idx + 1]) +
                        Math.abs(curr[idx + 2] - prev[idx + 2])) /
                    3;

                const inCenterFace = x >= roiX0 && x < roiX1 && y >= roiY0 && y < roiY1;
                if (inCenterFace) {
                    innerSum += diff;
                    innerCount++;
                } else {
                    outerSum += diff;
                    outerCount++;
                }
            }
        }

        const avgInner = innerSum / Math.max(1, innerCount);
        const avgOuter = outerSum / Math.max(1, outerCount);

        if (avgInner > maxInnerDiff) maxInnerDiff = avgInner;
        totalInnerDiff += avgInner;
        totalOuterDiff += avgOuter;
        pairsCount++;
    }

    const meanInnerMotion = totalInnerDiff / Math.max(1, pairsCount);
    const meanOuterMotion = totalOuterDiff / Math.max(1, pairsCount);

    // Block static / frozen photo (zero live micro-movement or blink during 3s scan)
    if (maxInnerDiff < 0.95 || meanInnerMotion < 0.65) {
        return {
            passed: false,
            reason: 'Static photo or frozen image detected. Please blink your eyes or slightly nod your head during the 3-second liveness scan.',
        };
    }

    // Block rigid handheld card / phone shaking (outer background/border moving violently while face card is rigid)
    if (meanOuterMotion > meanInnerMotion * 1.85 && meanOuterMotion > 6.5) {
        return {
            passed: false,
            reason: 'Handheld photo or phone movement detected. Please hold the device steady and scan your real live face directly.',
        };
    }

    return { passed: true };
}

export default function CameraCapture({
    onCapture,
    onClose,
    isLoading = false,
    buttonText = 'Capture & Submit',
}) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const analysisCanvasRef = useRef(null);
    const livenessFramesRef = useRef([]);
    const streamRef = useRef(null);

    const [isCameraReady, setIsCameraReady] = useState(false);
    const [error, setError] = useState(null);
    const [spoofAlert, setSpoofAlert] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [facingMode, setFacingMode] = useState('user');
    const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

    useEffect(() => {
        const checkDevices = async () => {
            try {
                if (navigator?.mediaDevices?.enumerateDevices) {
                    const devices = await navigator.mediaDevices.enumerateDevices();
                    const videoInputs = devices.filter((d) => d.kind === 'videoinput');
                    if (videoInputs.length > 1) {
                        setHasMultipleCameras(true);
                    }
                }
            } catch {
                // Ignore enumeration errors
            }
        };
        checkDevices();
    }, []);

    const initCamera = useCallback(
        async (targetFacingMode = facingMode) => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop());
                streamRef.current = null;
            }
            setIsCameraReady(false);
            setError(null);

            if (!navigator?.mediaDevices?.getUserMedia) {
                setError('Live camera access is required for biometric anti-spoofing verification.');
                return;
            }

            const withTimeout = (promise, ms = 10000) =>
                Promise.race([
                    promise,
                    new Promise((_, reject) =>
                        setTimeout(() => {
                            const e = new Error('Camera took too long to start.');
                            e.name = 'TimeoutError';
                            reject(e);
                        }, ms)
                    ),
                ]);

            try {
                let mediaStream = null;
                try {
                    mediaStream = await withTimeout(
                        navigator.mediaDevices.getUserMedia({
                            video: {
                                facingMode: { ideal: targetFacingMode },
                                width: { ideal: 1280, min: 480 },
                                height: { ideal: 720, min: 360 },
                            },
                            audio: false,
                        })
                    );
                } catch (constraintErr) {
                    if (constraintErr.name === 'TimeoutError') throw constraintErr;
                    mediaStream = await withTimeout(
                        navigator.mediaDevices.getUserMedia({
                            video: true,
                            audio: false,
                        })
                    );
                }

                streamRef.current = mediaStream;
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    try {
                        await videoRef.current.play();
                    } catch {
                        // Ignore autoplay notice
                    }
                }
                setIsCameraReady(true);
                setError(null);
            } catch (err) {
                let errorMessage = 'Unable to access camera. ';
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.';
                } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                    errorMessage = 'No live camera detected on this device.';
                } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                    errorMessage = 'Camera is currently in use by another application.';
                } else if (err.name === 'TimeoutError') {
                    errorMessage = 'Camera did not start in time. Tap Retry Camera below.';
                } else {
                    errorMessage += err.message || 'Please check device permissions.';
                }
                setError(errorMessage);
                setIsCameraReady(false);
            }
        },
        [facingMode]
    );

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            initCamera(facingMode);
        }
        return () => {
            mounted = false;
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop());
                streamRef.current = null;
            }
            setIsCameraReady(false);
        };
    }, [facingMode, initCamera]);

    const toggleCamera = () => {
        setSpoofAlert(null);
        const nextMode = facingMode === 'user' ? 'environment' : 'user';
        setFacingMode(nextMode);
    };

    // Sample a low-res frame for multi-frame liveness & anti-spoofing analysis
    const sampleLivenessFrame = useCallback(() => {
        if (!videoRef.current || !analysisCanvasRef.current || !isCameraReady) return;
        const video = videoRef.current;
        if (video.readyState < 2) return;

        const aCanvas = analysisCanvasRef.current;
        const w = 160;
        const h = 120;
        aCanvas.width = w;
        aCanvas.height = h;
        const aCtx = aCanvas.getContext('2d', { willReadFrequently: true });
        if (!aCtx) return;

        aCtx.drawImage(video, 0, 0, w, h);
        const imgData = aCtx.getImageData(0, 0, w, h);
        livenessFramesRef.current.push(imgData);
    }, [isCameraReady]);

    const capture = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current || !isCameraReady || isLoading) return;

        try {
            // Capture final liveness sample and run Anti-Spoofing check
            sampleLivenessFrame();
            const livenessResult = analyzeBiometricLiveness(livenessFramesRef.current);
            livenessFramesRef.current = [];

            if (!livenessResult.passed) {
                setSpoofAlert(livenessResult.reason);
                return;
            }

            const video = videoRef.current;
            const canvas = canvasRef.current;

            const width = video.videoWidth || 640;
            const height = video.videoHeight || 480;

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Unable to get canvas context');
            }

            if (facingMode === 'user') {
                ctx.translate(width, 0);
                ctx.scale(-1, 1);
            }

            ctx.drawImage(video, 0, 0, width, height);

            const imageDataUrl = canvas.toDataURL('image/jpeg', 0.92);
            if (!imageDataUrl || imageDataUrl === 'data:,') {
                throw new Error('Failed to capture valid image');
            }

            setSpoofAlert(null);
            onCapture(imageDataUrl);
        } catch (captureErr) {
            setError(`Capture failed: ${captureErr.message}`);
        }
    }, [isCameraReady, isLoading, onCapture, facingMode, sampleLivenessFrame]);

    // Sample frames every 450ms while countdown is active
    useEffect(() => {
        if (countdown === null) return;

        sampleLivenessFrame();
        const sampleInterval = setInterval(sampleLivenessFrame, 450);

        if (countdown === 0) {
            clearInterval(sampleInterval);
            capture();
            setCountdown(null);
            return;
        }

        const timer = setTimeout(() => setCountdown((prev) => (prev ? prev - 1 : null)), 1000);
        return () => {
            clearInterval(sampleInterval);
            clearTimeout(timer);
        };
    }, [countdown, capture, sampleLivenessFrame]);

    const startCountdown = useCallback(() => {
        if (isCameraReady && !isLoading) {
            setSpoofAlert(null);
            livenessFramesRef.current = [];
            sampleLivenessFrame();
            setCountdown(3);
        }
    }, [isCameraReady, isLoading, sampleLivenessFrame]);

    return (
        <div className="relative w-full max-w-md mx-auto">
            <canvas ref={canvasRef} className="hidden" />
            <canvas ref={analysisCanvasRef} className="hidden" />

            {/* Camera / Preview container */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-blue-500/20">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    webkit-playsinline="true"
                    className={`w-full aspect-video object-cover bg-slate-950 ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                    onLoadedMetadata={() => {
                        if (videoRef.current) {
                            videoRef.current.play().catch(() => {});
                        }
                    }}
                    onCanPlay={() => {
                        if (videoRef.current && videoRef.current.paused) {
                            videoRef.current.play().catch(() => {});
                        }
                    }}
                />

                {/* Top-Left Live Anti-Spoofing Shield Badge */}
                {isCameraReady && (
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur border border-emerald-500/35 text-[10px] font-bold text-emerald-300 flex items-center gap-1.5 shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>LIVE ANTI-SPOOFING ACTIVE</span>
                    </div>
                )}

                {/* Face positioning guide overlay */}
                {isCameraReady && !isLoading && countdown === null && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl border-2 border-dashed border-emerald-400/80 animate-pulse flex flex-col items-center justify-end pb-3 shadow-lg shadow-emerald-500/10">
                            <span className="bg-slate-900/85 backdrop-blur text-emerald-300 text-[10px] px-3 py-1 rounded-full border border-emerald-500/30 font-bold">
                                Align Real Face in Box
                            </span>
                        </div>
                    </div>
                )}

                {/* Flip camera button */}
                {(hasMultipleCameras || isCameraReady) && (
                    <button
                        onClick={toggleCamera}
                        type="button"
                        title="Switch Camera"
                        className="absolute top-3 right-3 z-10 bg-slate-900/75 backdrop-blur hover:bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5 transition-all active:scale-95 shadow-md cursor-pointer"
                    >
                        <AnimatedIcon type="refresh" size={13} />
                        <span className="text-[10px] font-semibold">{facingMode === 'user' ? 'Front' : 'Back'}</span>
                    </button>
                )}

                {/* Processing overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-slate-950/85 flex items-center justify-center backdrop-blur-sm z-20">
                        <div className="text-center px-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-3" />
                            <p className="text-white text-sm font-semibold">Verifying Live Biometrics...</p>
                            <p className="text-emerald-400 text-xs mt-1">Anti-Spoofing &amp; Identity Check</p>
                        </div>
                    </div>
                )}

                {/* Countdown + Live Liveness Prompt overlay */}
                {countdown !== null && countdown > 0 && (
                    <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 p-4 text-center">
                        <div className="text-7xl sm:text-8xl font-black text-white animate-ping drop-shadow-2xl mb-4">
                            {countdown}
                        </div>
                        <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold">
                            Liveness Check: Blink or slightly nod your head
                        </div>
                    </div>
                )}

                {/* Camera starting overlay */}
                {!isCameraReady && !error && (
                    <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2" />
                            <p className="text-white text-xs font-medium">Starting live camera...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Anti-Spoofing Security Alert Box */}
            {spoofAlert && (
                <div className="mt-3 p-4 rounded-2xl bg-rose-950/90 border border-rose-500/50 text-left shadow-xl animate-fade-in">
                    <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-rose-500/40 flex-shrink-0">
                            <video
                                src="/wrong.webm"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-black uppercase tracking-wider text-rose-300">
                                Anti-Spoofing Security Restriction
                            </p>
                            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                                {spoofAlert}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error or No Camera Fallback box */}
            {error && (
                <div className="mt-3 p-4 bg-slate-900/90 border border-blue-500/30 rounded-2xl text-center">
                    <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">{error}</p>
                    <div className="mt-3 flex flex-wrap gap-2 justify-center">
                        <button
                            type="button"
                            onClick={() => initCamera(facingMode)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-900/40 text-blue-200 hover:bg-blue-800/60 transition-all border border-blue-500/30 flex items-center gap-1.5 cursor-pointer"
                        >
                            <AnimatedIcon type="refresh" size={13} />
                            <span>Retry Camera</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Action Buttons (Live Camera Capture Only — Photo Upload Restricted) */}
            <div className="mt-4 flex flex-wrap gap-2.5 justify-center">
                <button
                    onClick={startCountdown}
                    disabled={!isCameraReady || isLoading}
                    className={`
                        w-full sm:w-auto px-7 py-3.5 rounded-2xl font-black text-white transition-all duration-200
                        flex items-center justify-center gap-2 shadow-lg text-xs sm:text-sm cursor-pointer
                        ${
                            !isCameraReady || isLoading
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                                : 'bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600 hover:from-blue-600 hover:to-emerald-500 active:scale-95 shadow-blue-600/25'
                        }
                    `}
                >
                    <AnimatedIcon type="camera" size={17} />
                    <span>{isLoading ? 'Verifying Live Face...' : buttonText}</span>
                </button>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="px-4 py-3 rounded-2xl font-semibold bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-xs border border-slate-700 cursor-pointer"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}
