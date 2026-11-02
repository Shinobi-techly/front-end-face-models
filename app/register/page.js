'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import AOSInit from '../../components/AOSInit';
import CameraCapture from '../../components/CameraCapture';
import AnimatedIcon from '../../components/AnimatedIcon';
import StudentRegisterIllustration from '../../components/StudentRegisterIllustration';
import FaceReferenceGuideIllustration from '../../components/FaceReferenceGuideIllustration';
import { registerStudent, checkStudentId, checkFace } from '../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

const DEPARTMENTS = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];

function generateStudentId() {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `SAL-${num}`;
}

const RULES = {
    student_id: {
        validate: (v) => /^SAL-\d{4}$/i.test(v.trim()),
        message: 'Student ID must be in SAL-XXXX format.',
        hint: 'Auto-generated unique Salvation Heritage ID',
    },
    full_name: {
        validate: (v) => /^[a-zA-Z\s''-]{3,}$/.test(v.trim()),
        message: 'Full name must be at least 3 letters.',
        hint: 'Enter your official full name.',
    },
    department: { validate: (v) => v !== '', message: 'Please select a class.', hint: '' },
    year_intake: { validate: (v) => v !== '', message: 'Intake year is required.', hint: '' },
    semester: { validate: (v) => Number(v) >= 1 && Number(v) <= 3, message: 'Please select a valid term.', hint: '' },
};

/* ── Duplicate Face Alert Modal ── */
function DuplicateFaceAlert({ duplicateInfo, onClose }) {
    if (!duplicateInfo) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="w-full max-w-md bento-card rounded-3xl overflow-hidden animate-scale-in">
                <div className="px-6 py-6 text-center bg-gradient-to-r from-blue-900/40 to-emerald-900/40 border-b border-blue-500/20">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <AnimatedIcon type="shield" size={28} />
                    </div>
                    <h3 className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Student Already Registered
                    </h3>
                    <p className="text-emerald-400 text-xs font-semibold mt-1">
                        Salvation Heritage Duplicate Check
                    </p>
                </div>
                <div className="p-6">
                    <p className="text-slate-400 text-sm mb-4 text-center">This face is already registered to:</p>
                    <div className="rounded-2xl p-4 mb-4 text-center bg-slate-950/90 border border-blue-500/30">
                        <p className="font-black text-white text-lg">{duplicateInfo.existing_student}</p>
                        <p className="text-xs text-slate-400 font-mono mt-1">Student ID: {duplicateInfo.existing_id}</p>
                    </div>
                    <p className="text-xs text-slate-400 text-center mb-5 leading-relaxed">
                        Each student may only be registered once in the school attendance records.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full py-3.5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-lg cursor-pointer"
                    >
                        Understood
                    </button>
                </div>
            </div>
        </div>
    );
}

function FieldError({ msg }) {
    if (!msg) return null;
    return (
        <div className="flex items-center gap-1.5 mt-1.5">
            <AnimatedIcon type="alert" size={13} className="text-rose-400 flex-shrink-0" />
            <p className="text-rose-400 text-xs font-semibold">{msg}</p>
        </div>
    );
}

function FieldHint({ text }) {
    if (!text) return null;
    return <p className="text-slate-400 text-xs mt-1">{text}</p>;
}

/* ── Horizontal Step Wizard Indicator ── */
function StepIndicator({ current }) {
    const steps = [
        { n: 1, title: 'Student Info', sub: 'Name & Class' },
        { n: 2, title: 'Face Capture', sub: 'Take Photo' },
        { n: 3, title: 'Completed', sub: 'ID Ready' },
    ];
    return (
        <div className="bento-card rounded-2xl p-4 sm:p-5 mb-8">
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {steps.map((s) => {
                    const done = current > s.n;
                    const active = current === s.n;
                    return (
                        <div
                            key={s.n}
                            className={`flex items-center gap-2.5 sm:gap-3.5 p-2.5 sm:p-3 rounded-xl border transition-all ${
                                active
                                    ? 'bg-blue-600/15 border-blue-500/40 shadow-md'
                                    : done
                                    ? 'bg-emerald-500/10 border-emerald-500/30'
                                    : 'bg-slate-950/50 border-white/5 opacity-60'
                            }`}
                        >
                            <div
                                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black flex-shrink-0 ${
                                    done
                                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                                        : active
                                        ? 'bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-md shadow-blue-600/30'
                                        : 'bg-slate-800 text-slate-400'
                                }`}
                            >
                                {done ? <AnimatedIcon type="check" size={15} /> : s.n}
                            </div>
                            <div className="min-w-0">
                                <p className={`text-xs sm:text-sm font-bold truncate ${active || done ? 'text-white' : 'text-slate-400'}`}>
                                    {s.title}
                                </p>
                                <p className="text-[10px] text-slate-400 hidden sm:block truncate">{s.sub}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ── Live Digital Student ID Card Preview ── */
function LiveStudentIdPreview({ formData, step }) {
    const termLabel =
        Number(formData.semester) === 1
            ? 'First Term'
            : Number(formData.semester) === 2
            ? 'Second Term'
            : Number(formData.semester) === 3
            ? 'Third Term'
            : 'Select Term';

    return (
        <div className="bento-card rounded-3xl overflow-hidden relative">
            <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-emerald-500 to-violet-500" />
            <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                            SH
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-black text-white uppercase tracking-wider truncate">
                                Salvation Heritage
                            </p>
                            <p className="text-[10px] text-emerald-400 font-mono">STUDENT ID CARD</p>
                        </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                        {step === 3 ? 'ACTIVE' : 'PREVIEW'}
                    </span>
                </div>

                <div className="py-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-950 border-2 border-blue-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-inner">
                        <AnimatedIcon type={step === 3 ? 'check' : 'user'} size={26} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Student Name</p>
                        <p className="text-base font-black text-white truncate">
                            {formData.full_name.trim() || 'Your Full Name'}
                        </p>
                        <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                            {formData.student_id || 'SAL-0000'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-white/10 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Class</p>
                        <p className="font-black text-blue-300 mt-0.5 truncate">{formData.department || 'Not Selected'}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Academic Term</p>
                        <p className="font-black text-emerald-300 mt-0.5 truncate">{termLabel}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        student_id: generateStudentId(),
        full_name: '',
        department: '',
        intake_year: new Date().getFullYear().toString(),
        intake_month: 'September',
        semester: '',
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [registered, setRegistered] = useState(null);
    const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
    const [duplicateInfo, setDuplicateInfo] = useState(null);
    const [idStatus, setIdStatus] = useState('idle');
    const [idOwner, setIdOwner] = useState(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        const id = formData.student_id.trim().toUpperCase();
        if (!id || id.length < 3) {
            setIdStatus('idle');
            setIdOwner(null);
            return;
        }
        setIdStatus('checking');
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await checkStudentId(id);
                if (res.exists) {
                    const newId = generateStudentId();
                    setFormData((p) => ({ ...p, student_id: newId }));
                    setIdStatus('idle');
                    setIdOwner(null);
                } else {
                    setIdStatus('available');
                    setIdOwner(null);
                    setErrors((p) => ({ ...p, student_id: '' }));
                }
            } catch {
                setIdStatus('idle');
                setIdOwner(null);
            }
        }, 500);
        return () => clearTimeout(debounceRef.current);
    }, [formData.student_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const v = name === 'student_id' ? value.toUpperCase() : value;
        setFormData((p) => ({ ...p, [name]: v }));
        setTouched((p) => ({ ...p, [name]: true }));
        if (RULES[name]) setErrors((p) => ({ ...p, [name]: RULES[name].validate(v) ? '' : RULES[name].message }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((p) => ({ ...p, [name]: true }));
        if (RULES[name]) setErrors((p) => ({ ...p, [name]: RULES[name].validate(value) ? '' : RULES[name].message }));
    };

    const validateAll = () => {
        const yearIntake = formData.intake_year && formData.intake_month ? `${formData.intake_year} ${formData.intake_month}` : '';
        const checks = {
            student_id: formData.student_id,
            full_name: formData.full_name,
            department: formData.department,
            year_intake: yearIntake,
            semester: formData.semester,
        };
        const newErrors = {}, newTouched = {};
        let valid = true;
        Object.entries(checks).forEach(([k, v]) => {
            newTouched[k] = true;
            if (RULES[k] && !RULES[k].validate(v)) {
                newErrors[k] = RULES[k].message;
                valid = false;
            }
        });
        setErrors(newErrors);
        setTouched(newTouched);
        return valid;
    };

    const handleNext = () => {
        if (idStatus === 'taken') {
            toast.error(`ID already taken${idOwner?.full_name ? ` — ${idOwner.full_name}` : ''}.`, { duration: 6000 });
            return;
        }
        if (idStatus === 'checking') {
            toast.error('Verifying Student ID...');
            return;
        }
        if (!validateAll()) {
            toast.error('Please complete all required fields before continuing.');
            return;
        }
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCapture = useCallback(
        async (imageDataUrl) => {
            setIsLoading(true);
            try {
                toast.loading('Checking student records...', { id: 'face-check' });
                const faceCheck = await checkFace(imageDataUrl);
                toast.dismiss('face-check');

                if (faceCheck.exists) {
                    setDuplicateInfo({
                        existing_student: faceCheck.student_name,
                        existing_id: faceCheck.student_id,
                        similarity: faceCheck.similarity,
                    });
                    setShowDuplicateAlert(true);
                    toast.error(`This face is already registered as ${faceCheck.student_name} (${faceCheck.student_id}).`, {
                        duration: 6000,
                    });
                    setIsLoading(false);
                    return;
                }

                const result = await registerStudent({
                    student_id: formData.student_id.trim().toUpperCase(),
                    full_name: formData.full_name.trim(),
                    department: formData.department,
                    year_intake: `${formData.intake_year} ${formData.intake_month}`,
                    semester: parseInt(formData.semester),
                    image: imageDataUrl,
                });

                if (result.success) {
                    toast.success('Registration successful!', { duration: 4000 });
                    setRegistered({ ...formData, semester: parseInt(formData.semester) });
                    setStep(3);
                } else if (result.error === 'DUPLICATE_FACE') {
                    setDuplicateInfo(result.duplicate_info);
                    setShowDuplicateAlert(true);
                    toast.error(result.message, { duration: 6000 });
                } else if (result.error === 'DUPLICATE_ID') {
                    toast.error(result.message, { duration: 5000 });
                    setStep(1);
                    setErrors((p) => ({ ...p, student_id: result.message }));
                } else {
                    toast.error(result.message || 'Registration failed.');
                }
            } catch (err) {
                toast.dismiss('face-check');
                toast.error(err.message || 'Server error.');
            } finally {
                setIsLoading(false);
            }
        },
        [formData]
    );

    const handleReset = () => {
        setFormData({
            student_id: generateStudentId(),
            full_name: '',
            department: '',
            intake_year: new Date().getFullYear().toString(),
            intake_month: 'September',
            semester: '',
        });
        setErrors({});
        setTouched({});
        setRegistered(null);
        setStep(1);
    };

    return (
        <div
            className="min-h-screen text-slate-100 flex flex-col pb-24 md:pb-0"
            style={{
                background: 'radial-gradient(ellipse 100% 55% at 50% 0%, #0b1930 0%, #020617 65%)',
                fontFamily: 'var(--font-inter)',
            }}
        >
            <AOSInit />
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        borderRadius: 14,
                        fontSize: 13,
                        fontWeight: 600,
                        background: '#0f172a',
                        color: '#fff',
                        border: '1px solid rgba(59,130,246,0.3)',
                    },
                }}
            />

            {/* ── Top School Bar ── */}
            <div className="bg-slate-950/90 border-b border-blue-500/15 py-2 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                        <span className="font-bold text-slate-200 truncate">
                            Salvation Heritage High School · Student Registration
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Sticky Navigation Header ── */}
            <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-xl border-b border-blue-500/15 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
                    <Link href="/" className="flex items-center gap-3 no-underline flex-shrink-0 min-w-0">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm sm:text-base shadow-lg shadow-blue-600/30 bg-gradient-to-tr from-blue-600 to-emerald-500 flex-shrink-0">
                            SH
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-black text-white text-base sm:text-lg truncate" style={{ fontFamily: 'var(--font-outfit)' }}>
                                    Salvation Heritage
                                </span>
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                                    Registration
                                </span>
                            </div>
                            <span className="hidden md:block text-slate-400 text-xs truncate">
                                Student Registration Portal
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
                        <Link
                            href="/"
                            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all no-underline flex items-center gap-1.5 whitespace-nowrap"
                        >
                            <AnimatedIcon type="scan" size={15} />
                            <span>Attendance Kiosk</span>
                        </Link>
                        <Link
                            href="/register"
                            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-emerald-600 shadow-md no-underline flex items-center gap-1.5 whitespace-nowrap"
                        >
                            <AnimatedIcon type="register" size={15} />
                            <span>Register Student</span>
                        </Link>
                        <Link
                            href="/dashboard"
                            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all no-underline flex items-center gap-1.5 whitespace-nowrap"
                        >
                            <AnimatedIcon type="dashboard" size={15} />
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            href="/students"
                            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all no-underline flex items-center gap-1.5 whitespace-nowrap"
                        >
                            <AnimatedIcon type="users" size={15} />
                            <span>Directory</span>
                        </Link>
                    </nav>

                    <Link
                        href="/"
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white transition-all px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 no-underline whitespace-nowrap flex-shrink-0"
                    >
                        <span>Back to Kiosk</span>
                    </Link>
                </div>
            </header>

            {/* ── Hero Section ── */}
            <section className="relative overflow-hidden py-10 sm:py-14 px-4 sm:px-6 border-b border-blue-500/15 cyber-grid-bg">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        <div className="lg:col-span-7 space-y-5" data-aos="fade-right">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    Student Registration
                                </span>
                                <span className="text-[11px] font-bold px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 whitespace-nowrap">
                                    JSS1 – SS3 Classes
                                </span>
                            </div>

                            <h1
                                className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]"
                                style={{ fontFamily: 'var(--font-outfit)' }}
                            >
                                Student Identity &amp;{' '}
                                <span className="block mt-1 bg-gradient-to-r from-blue-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                                    Face Registration
                                </span>
                            </h1>

                            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                                Create your Salvation Heritage student ID and register your photo in 3 simple steps.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                {[
                                    { icon: 'user', t: 'Student ID', d: 'Auto SAL-XXXX ID' },
                                    { icon: 'camera', t: 'Quick Photo', d: 'Camera or Upload' },
                                    { icon: 'shield', t: 'Verified Profile', d: 'One ID Per Student' },
                                ].map((item, i) => (
                                    <div key={i} className="bento-card rounded-2xl p-3.5 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                                            <AnimatedIcon type={item.icon} size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white font-bold text-xs sm:text-sm truncate">{item.t}</p>
                                            <p className="text-emerald-400 text-[11px] font-medium truncate">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN — /facehero.webm Video Illustration */}
                        <div className="lg:col-span-5 flex items-center justify-center" data-aos="fade-left" data-aos-delay="150">
                            <StudentRegisterIllustration />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Main Enrollment Workspace ── */}
            <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex-1">
                <StepIndicator current={step} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Left Sidebar: Live ID Preview & Guidelines (4/12) */}
                    <div className="lg:col-span-4 space-y-5" data-aos="fade-right">
                        <LiveStudentIdPreview formData={formData} step={step} />

                        <div className="bento-card rounded-3xl p-5 sm:p-6">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white bg-gradient-to-r from-blue-600 to-emerald-600">
                                    <AnimatedIcon type="check" size={14} />
                                </div>
                                <p className="text-sm font-black text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
                                    Registration Instructions
                                </p>
                            </div>
                            <div className="space-y-3">
                                {[
                                    ['Unique Student ID', 'Your SAL-XXXX student ID is generated automatically.'],
                                    ['Full Name', 'Enter your surname and first name as on school records.'],
                                    ['Class & Academic Term', 'Select your current class (JSS1–SS3) and term.'],
                                    ['Clear Face Photo', 'Take a clear photo facing the camera directly.'],
                                ].map(([t, d]) => (
                                    <div key={t} className="flex gap-3">
                                        <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 bg-emerald-400" />
                                        <div>
                                            <p className="text-xs font-bold text-white">{t}</p>
                                            <p className="text-[11px] text-slate-400 leading-relaxed">{d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Main Form / Scanner / Completion (8/12) */}
                    <div className="lg:col-span-8" data-aos="fade-left" data-aos-delay="100">
                        <div className="bento-card rounded-3xl overflow-hidden">
                            {/* STEP 1 — Academic Information Form */}
                            {step === 1 && (
                                <>
                                    <div className="px-6 sm:px-8 py-5 flex items-center justify-between border-b border-blue-500/15 bg-slate-950/60 gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm bg-gradient-to-r from-blue-600 to-emerald-600">
                                                1
                                            </div>
                                            <div>
                                                <h2 className="font-black text-white text-base" style={{ fontFamily: 'var(--font-outfit)' }}>
                                                    Student Details
                                                </h2>
                                                <p className="text-xs text-slate-400">Fill in your class details below</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 whitespace-nowrap">
                                            STEP 1 OF 3
                                        </span>
                                    </div>

                                    <div className="p-6 sm:p-8 space-y-6">
                                        {/* Auto-Generated Student ID */}
                                        <div>
                                            <label className="label-premium">
                                                Student ID (Auto-Generated) <span className="text-emerald-400">*</span>
                                            </label>
                                            <div className="flex flex-col sm:flex-row gap-2.5">
                                                <div className="relative flex-1">
                                                    <input
                                                        type="text"
                                                        name="student_id"
                                                        value={formData.student_id}
                                                        readOnly
                                                        className="input-premium font-mono text-base font-bold tracking-widest text-emerald-300 cursor-default pr-24"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                                        {idStatus === 'checking' ? 'CHECKING...' : 'AVAILABLE'}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData((p) => ({ ...p, student_id: generateStudentId() }))}
                                                    className="px-4 py-3 rounded-xl text-xs font-bold text-blue-300 bg-blue-500/15 border border-blue-500/30 hover:bg-blue-500/25 transition-all whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    <AnimatedIcon type="refresh" size={14} />
                                                    <span>New ID</span>
                                                </button>
                                            </div>
                                            <FieldHint text={RULES.student_id.hint} />
                                        </div>

                                        {/* Full Name */}
                                        <div>
                                            <label className="label-premium">
                                                Student Full Name <span className="text-rose-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="e.g. Oluwaseun Adeyemi"
                                                className="input-premium"
                                            />
                                            <FieldError msg={touched.full_name && errors.full_name} />
                                            <FieldHint text={!errors.full_name ? RULES.full_name.hint : ''} />
                                        </div>

                                        {/* Interactive Class Selector Grid */}
                                        <div>
                                            <label className="label-premium">
                                                Select Class (JSS1 – SS3) <span className="text-rose-400">*</span>
                                            </label>
                                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                                                {DEPARTMENTS.map((cls) => {
                                                    const active = formData.department === cls;
                                                    return (
                                                        <button
                                                            key={cls}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData((p) => ({ ...p, department: cls }));
                                                                setErrors((p) => ({ ...p, department: '' }));
                                                            }}
                                                            className={`py-3 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                                                active
                                                                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg shadow-blue-600/30 border border-white/20'
                                                                    : 'bg-slate-950/90 text-slate-300 border border-slate-800 hover:border-blue-500/40 hover:text-white'
                                                            }`}
                                                        >
                                                            {cls}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <FieldError msg={touched.department && errors.department} />
                                        </div>

                                        {/* Academic Term Selector */}
                                        <div>
                                            <label className="label-premium">
                                                Academic Term <span className="text-rose-400">*</span>
                                            </label>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                                {[
                                                    { n: 1, label: '1st Term', sub: 'Sep – Dec' },
                                                    { n: 2, label: '2nd Term', sub: 'Jan – Apr' },
                                                    { n: 3, label: '3rd Term', sub: 'May – Jul' },
                                                ].map((t) => {
                                                    const active = Number(formData.semester) === t.n;
                                                    return (
                                                        <button
                                                            key={t.n}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData((p) => ({ ...p, semester: t.n }));
                                                                setErrors((p) => ({ ...p, semester: '' }));
                                                            }}
                                                            className={`p-3.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                                                                active
                                                                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-md'
                                                                    : 'bg-slate-950/90 border-slate-800 text-slate-300 hover:border-slate-700'
                                                            }`}
                                                        >
                                                            <div>
                                                                <p className="text-xs font-black text-white">{t.label}</p>
                                                                <p className="text-[10px] text-slate-400">{t.sub}</p>
                                                            </div>
                                                            <span
                                                                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                                                    active ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
                                                                }`}
                                                            >
                                                                <AnimatedIcon type="check" size={12} />
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <FieldError msg={touched.semester && errors.semester} />
                                        </div>

                                        {/* Intake Year & Month */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="label-premium">Admission Year</label>
                                                <select
                                                    name="intake_year"
                                                    value={formData.intake_year}
                                                    onChange={handleChange}
                                                    className="input-premium text-sm"
                                                >
                                                    {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i + 1).map((y) => (
                                                        <option key={y} value={y}>
                                                            {y} Session
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="label-premium">Admission Month</label>
                                                <select
                                                    name="intake_month"
                                                    value={formData.intake_month}
                                                    onChange={handleChange}
                                                    className="input-premium text-sm"
                                                >
                                                    {['January', 'May', 'September'].map((m) => (
                                                        <option key={m} value={m}>
                                                            {m}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="w-full py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-0.5 cursor-pointer"
                                        >
                                            Continue to Face Capture
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* STEP 2 — Camera Enrollment */}
                            {step === 2 && (
                                <>
                                    <div className="px-6 sm:px-8 py-5 flex items-center justify-between border-b border-blue-500/15 bg-slate-950/60 gap-2">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm bg-gradient-to-r from-emerald-600 to-teal-600 flex-shrink-0">
                                                2
                                            </div>
                                            <div className="min-w-0">
                                                <h2 className="font-black text-white text-base truncate" style={{ fontFamily: 'var(--font-outfit)' }}>
                                                    Face Capture
                                                </h2>
                                                <p className="text-xs text-slate-400 truncate">
                                                    Student: <span className="text-emerald-400 font-bold">{formData.full_name}</span> ({formData.student_id})
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setStep(1)}
                                            className="text-xs font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 whitespace-nowrap cursor-pointer"
                                        >
                                            Back
                                        </button>
                                    </div>

                                    <div className="p-6 sm:p-8 space-y-5">
                                        <FaceReferenceGuideIllustration studentName={formData.full_name || 'Student'} />

                                        <CameraCapture
                                            onCapture={handleCapture}
                                            isLoading={isLoading}
                                            onClose={() => setStep(1)}
                                            buttonText="Complete Registration"
                                        />
                                    </div>
                                </>
                            )}

                            {/* STEP 3 — Enrollment Complete */}
                            {step === 3 && registered && (
                                <div className="p-6 sm:p-10 flex flex-col items-center text-center">
                                    <div className="w-24 h-24 mb-4 relative flex items-center justify-center">
                                        <img
                                            src="/illustrations/verified.svg"
                                            alt="Registration Verified"
                                            className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(16,185,129,0.4)]"
                                        />
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-2">
                                        REGISTRATION COMPLETE
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
                                        Student Successfully Registered
                                    </h2>
                                    <p className="text-slate-400 text-sm mt-1 mb-6 max-w-md">
                                        Your student profile is now active for daily attendance check-in.
                                    </p>

                                    <div className="w-full rounded-2xl p-5 mb-6 text-left bg-slate-950/80 border border-blue-500/20">
                                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">
                                            STUDENT DETAILS
                                        </p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[
                                                ['Full Name', registered.full_name],
                                                ['Student ID', registered.student_id],
                                                ['Class', registered.department],
                                                ['Term', registered.semester === 1 ? '1st Term' : registered.semester === 2 ? '2nd Term' : '3rd Term'],
                                            ].map(([k, v]) => (
                                                <div key={k} className="rounded-xl p-3 bg-slate-900/90 border border-white/5">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{k}</p>
                                                    <p className="text-xs sm:text-sm font-black text-white truncate mt-0.5">{v}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                                        <button
                                            onClick={handleReset}
                                            className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-slate-900 text-emerald-400 border border-emerald-500/30 hover:bg-slate-800 transition-all cursor-pointer"
                                        >
                                            Register Another Student
                                        </button>
                                        <Link
                                            href="/"
                                            className="flex-1 py-3.5 rounded-xl font-black text-sm text-white text-center bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-lg shadow-blue-600/30 transition-all no-underline"
                                        >
                                            Go to Attendance Kiosk
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-blue-500/15 bg-slate-950/95 py-6 text-xs text-slate-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-black bg-gradient-to-tr from-blue-600 to-emerald-500">
                            SH
                        </div>
                        <span className="font-semibold text-slate-300">Salvation Heritage High School</span>
                    </div>
                    <Link href="/" className="text-blue-400 hover:text-blue-300 font-semibold no-underline">
                        Return to Attendance Kiosk
                    </Link>
                </div>
            </footer>

            {showDuplicateAlert && duplicateInfo && (
                <DuplicateFaceAlert
                    duplicateInfo={duplicateInfo}
                    onClose={() => {
                        setShowDuplicateAlert(false);
                        setDuplicateInfo(null);
                    }}
                />
            )}

            {/* ── Mobile Bottom Navigation Dock ── */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 py-2 px-3 flex items-center justify-around shadow-2xl">
                <Link href="/" className="flex flex-col items-center gap-1 py-1 px-3 text-slate-400 hover:text-white no-underline">
                    <AnimatedIcon type="scan" size={20} />
                    <span className="text-[10px] font-bold">Kiosk</span>
                </Link>
                <Link href="/register" className="flex flex-col items-center gap-1 py-1 px-3 text-emerald-400 font-black no-underline">
                    <AnimatedIcon type="register" size={20} />
                    <span className="text-[10px] font-bold">Register</span>
                </Link>
                <Link href="/dashboard" className="flex flex-col items-center gap-1 py-1 px-3 text-slate-400 hover:text-white no-underline">
                    <AnimatedIcon type="dashboard" size={20} />
                    <span className="text-[10px] font-bold">Admin</span>
                </Link>
                <Link href="/students" className="flex flex-col items-center gap-1 py-1 px-3 text-slate-400 hover:text-white no-underline">
                    <AnimatedIcon type="users" size={20} />
                    <span className="text-[10px] font-bold">Students</span>
                </Link>
            </div>
        </div>
    );
}
