'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import AnimatedIcon from './AnimatedIcon';

export default function CameraCapture({
    onCapture,
    onClose,
    isLoading = false,
    buttonText = 'Capture & Submit'
}) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [facingMode, setFacingMode] = useState('user');
    const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
    const [uploadedPreview, setUploadedPreview] = useState(null);

    useEffect(() => {
        const checkDevices = async () => {
            try {
                if (navigator?.mediaDevices?.enumerateDevices) {
                    const devices = await navigator.mediaDevices.enumerateDevices();
                    const videoInputs = devices.filter(d => d.kind === 'videoinput');
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

    const initCamera = useCallback(async (targetFacingMode = facingMode) => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        setIsCameraReady(false);
        setError(null);

        if (!navigator?.mediaDevices?.getUserMedia) {
            setError('Camera is not available in this browser. You can upload a photo below.');
            return;
        }

        const withTimeout = (promise, ms = 10000) => Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => {
                const e = new Error('Camera took too long to start.');
                e.name = 'TimeoutError';
                reject(e);
            }, ms)),
        ]);

        try {
            let mediaStream = null;
            try {
                mediaStream = await withTimeout(navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: targetFacingMode },
                        width: { ideal: 1280, min: 480 },
                        height: { ideal: 720, min: 360 },
                    },
                    audio: false,
                }));
            } catch (constraintErr) {
                if (constraintErr.name === 'TimeoutError') throw constraintErr;
                mediaStream = await withTimeout(navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                }));
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
                errorMessage = 'No camera detected on this device. Please use Upload Photo below.';
            } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                errorMessage = 'Camera is currently in use by another application.';
            } else if (err.name === 'TimeoutError') {
                errorMessage = 'Camera did not start in time. Tap Retry Camera or use Upload Photo.';
            } else {
                errorMessage += err.message || 'Please check device permissions.';
            }
            setError(errorMessage);
            setIsCameraReady(false);
        }
    }, [facingMode]);

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            initCamera(facingMode);
        }
        return () => {
            mounted = false;
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
                streamRef.current = null;
            }
            setIsCameraReady(false);
        };
    }, [facingMode, initCamera]);

    const toggleCamera = () => {
        setUploadedPreview(null);
        const nextMode = facingMode === 'user' ? 'environment' : 'user';
        setFacingMode(nextMode);
    };

    const capture = useCallback(async () => {
        if (uploadedPreview) {
            onCapture(uploadedPreview);
            return;
        }

        if (!videoRef.current || !canvasRef.current || !isCameraReady || isLoading) return;

        try {
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

            onCapture(imageDataUrl);
        } catch (captureErr) {
            setError(`Capture failed: ${captureErr.message}`);
        }
    }, [isCameraReady, isLoading, onCapture, uploadedPreview, facingMode]);

    useEffect(() => {
        if (countdown === null) return;
        if (countdown === 0) {
            capture();
            setCountdown(null);
            return;
        }
        const timer = setTimeout(() => setCountdown(prev => (prev ? prev - 1 : null)), 1000);
        return () => clearTimeout(timer);
    }, [countdown, capture]);

    const startCountdown = useCallback(() => {
        if (uploadedPreview) {
            capture();
            return;
        }
        if (isCameraReady && !isLoading) {
            setCountdown(3);
        }
    }, [isCameraReady, isLoading, uploadedPreview, capture]);

    return (
        <div className="relative w-full max-w-md mx-auto">
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera / Preview container */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-blue-500/20">
                {uploadedPreview ? (
                    <div className="relative w-full aspect-video bg-slate-950 flex items-center justify-center">
                        <img
                            src={uploadedPreview}
                            alt="Selected preview"
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute top-3 left-3 bg-blue-900/80 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-400/30 flex items-center gap-1.5">
                            <AnimatedIcon type="check" size={12} />
                            <span>PHOTO READY</span>
                        </div>
                        <button
                            onClick={() => setUploadedPreview(null)}
                            className="absolute top-3 right-3 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer"
                        >
                            Clear
                        </button>
                    </div>
                ) : (
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
                )}

                {/* Face positioning guide overlay */}
                {isCameraReady && !isLoading && countdown === null && !uploadedPreview && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl border-2 border-dashed border-emerald-400/80 animate-pulse flex items-center justify-center shadow-lg shadow-emerald-500/10">
                            <span className="bg-slate-900/80 backdrop-blur text-emerald-300 text-[11px] px-3.5 py-1 rounded-full border border-emerald-500/30 font-semibold">
                                Align Face in Box
                            </span>
                        </div>
                    </div>
                )}

                {/* Flip camera button */}
                {!uploadedPreview && (hasMultipleCameras || isCameraReady) && (
                    <button
                        onClick={toggleCamera}
                        type="button"
                        title="Switch Camera"
                        className="absolute top-3 right-3 bg-slate-900/70 backdrop-blur hover:bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5 transition-all active:scale-95 shadow-md cursor-pointer"
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
                            <p className="text-white text-sm font-semibold">
                                Verifying Attendance...
                            </p>
                            <p className="text-emerald-400 text-xs mt-1">Salvation Heritage</p>
                        </div>
                    </div>
                )}

                {/* Countdown overlay */}
                {countdown !== null && countdown > 0 && (
                    <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center z-20">
                        <div className="text-8xl font-black text-white animate-ping drop-shadow-2xl">{countdown}</div>
                    </div>
                )}

                {/* Camera starting overlay */}
                {!isCameraReady && !error && !uploadedPreview && (
                    <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2" />
                            <p className="text-white text-xs font-medium">Starting camera...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Error or No Camera Fallback box */}
            {error && !uploadedPreview && (
                <div className="mt-3 p-4 bg-slate-900/90 border border-blue-500/30 rounded-2xl text-center">
                    <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                        {error}
                    </p>
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

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-2.5 justify-center">
                {/* Main Capture / Submit button */}
                <button
                    onClick={startCountdown}
                    disabled={(!isCameraReady && !uploadedPreview) || isLoading}
                    className={`
                        px-6 py-3 rounded-2xl font-bold text-white transition-all duration-200
                        flex items-center gap-2 shadow-lg text-xs sm:text-sm cursor-pointer
                        ${(!isCameraReady && !uploadedPreview) || isLoading
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                            : 'bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600 hover:from-blue-600 hover:to-emerald-500 active:scale-95 shadow-blue-600/25'
                        }
                    `}
                >
                    <AnimatedIcon type={uploadedPreview ? 'check' : 'camera'} size={17} />
                    <span>{isLoading ? 'Verifying...' : (uploadedPreview ? 'Submit Photo' : buttonText)}</span>
                </button>

                {/* File Upload Fallback Option */}
                <label className={`
                    px-4 py-3 rounded-2xl font-semibold text-white cursor-pointer transition-all duration-200
                    flex items-center gap-2 shadow-lg text-xs sm:text-sm border border-slate-700 bg-slate-900 hover:bg-slate-800 active:scale-95
                    ${isLoading ? 'opacity-50 pointer-events-none' : ''}
                `}>
                    <AnimatedIcon type="upload" size={16} />
                    <span>Upload Photo</span>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                const dataUrl = event.target?.result;
                                if (dataUrl) {
                                    setUploadedPreview(dataUrl);
                                    setError(null);
                                }
                            };
                            reader.readAsDataURL(file);
                        }}
                    />
                </label>

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
