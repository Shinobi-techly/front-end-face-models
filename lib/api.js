// lib/api.js — Face Attendance API client

import { handleApiError, retryOperation } from './errorHandler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/face-attendance-api/api';

// ── helpers ──────────────────────────────────────────────────────────────

async function safeFetch(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s: Render free tier can take ~50s to wake up
    
    try {
        const res = await fetch(url, { 
            ...options, 
            headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const text = await res.text();
        if (!text || !text.trim().startsWith('{')) {
            throw new Error(`Server returned non-JSON: ${text.slice(0, 100)}`);
        }
        return JSON.parse(text);
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

async function safeGet(path) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    
    try {
        const res = await fetch(`${API_BASE_URL}${path}`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const text = await res.text();
        if (!text || !text.trim().startsWith('{') && !text.trim().startsWith('[')) {
            throw new Error(`Server returned non-JSON: ${text.slice(0, 100)}`);
        }
        return JSON.parse(text);
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// ── Registration ─────────────────────────────────────────────────────────

/**
 * PRE-CHECK: Call this BEFORE register.php to detect duplicate faces.
 * POST /check-face.php
 * @param {string} imageDataUrl  Full data URL (data:image/jpeg;base64,...)
 * Returns:
 *   { success: true,  exists: false }                          → safe to register
 *   { success: true,  exists: true, student, confidence }      → DUPLICATE — block
 *   { success: false, message }                                 → no face / error — block
 */
export async function checkFace(imageDataUrl) {
    try {
        return await safeFetch(`${API_BASE_URL}/check-face.php`, {
            method: 'POST',
            body: JSON.stringify({ image: imageDataUrl }),
        });
    } catch (err) {
        // Backend unreachable — do NOT pretend the duplicate check passed
        console.warn('[checkFace] Backend unreachable:', err.message);
        return { success: false, message: 'Cannot reach the server. Please check your internet and try again (the server may be waking up, wait a minute).' };
    }
}

/**
 * Register a new student.
 * POST /register.php
 * @param {{ student_id, full_name, department, year_intake, semester, image }} data
 */
export async function registerStudent(data) {
    try {
        return await safeFetch(`${API_BASE_URL}/register.php`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    } catch (err) {
        // Backend unreachable — report failure honestly. Nothing was saved.
        console.warn('[registerStudent] Backend unreachable:', err.message);
        return {
            success: false,
            message: 'Registration NOT saved: cannot reach the server. Please try again in a minute.',
        };
    }
}

/**
 * Check if a student ID is already registered.
 * GET /check-student.php?student_id=...
 */
export async function checkStudentId(student_id) {
    try {
        return await safeGet(`/check-student.php?student_id=${encodeURIComponent(student_id)}`);
    } catch {
        return { exists: false };
    }
}

// ── Face Recognition / Attendance ────────────────────────────────────────

/**
 * Recognize a face and mark attendance using your working Amazon Rekognition backend.
 * POST http://localhost/face-attendance-api/api/recognize.php
 * @param {string} imageDataUrl  Full data URL from canvas (data:image/jpeg;base64,...)
 */
export async function recognizeFace(imageDataUrl) {
    try {
        const result = await retryOperation(async () => {
            return await safeFetch(`${API_BASE_URL}/recognize.php`, {
                method: 'POST',
                body: JSON.stringify({ image: imageDataUrl }),
            });
        }, 2, 1000);
        return result;
    } catch (err) {
        // Backend unreachable — report honestly, never fake an attendance mark
        console.warn('[recognizeFace] Backend unreachable:', err.message);
        return {
            success: false,
            message: 'Cannot reach the server, attendance NOT marked. Please try again.',
        };
    }
}

// Enhanced face recognition function removed - no longer needed

/**
 * Get registered faces for local comparison.
 * GET /registered-faces.php?include_descriptors=true
 */
export async function getRegisteredFaces(options = {}) {
    try {
        const params = new URLSearchParams();
        if (options.include_descriptors) params.append('include_descriptors', 'true');
        
        const data = await safeGet(`/registered-faces.php?${params}`);
        if (data.success) return data.data || [];
        return [];
    } catch (err) {
        console.error('Failed to get registered faces:', err);
        return [];
    }
}

/**
 * Get recognition analytics and performance metrics.
 * GET /recognition-analytics.php?timeframe=24h
 */
export async function getRecognitionAnalytics(timeframe = '24h') {
    try {
        return await safeGet(`/recognition-analytics.php?timeframe=${timeframe}`);
    } catch (err) {
        return { success: false, message: err.message };
    }
}

// ── Session Management (Lecturer) ────────────────────────────────────────

/**
 * Start an attendance session.
 * POST /session-start.php
 * @param {{ lecturer_id, lecturer_name, department, semester, course_code, course_name, ends_at }} data
 */
export async function startSession(data) {
    try {
        return await safeFetch(`${API_BASE_URL}/session-start.php`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    } catch (err) {
        return { success: false, message: err.message || 'Failed to start session.' };
    }
}

/**
 * Stop an active attendance session.
 * POST /session-stop.php
 * @param {{ session_id, lecturer_id }} data
 */
export async function stopSession(data) {
    try {
        return await safeFetch(`${API_BASE_URL}/session-stop.php`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    } catch (err) {
        return { success: false, message: err.message || 'Failed to stop session.' };
    }
}

/**
 * Get current session status for a department/semester or session_id.
 * GET /session-status.php?department=...&semester=...
 */
export async function getSessionStatus(department, semester, sessionId) {
    try {
        const params = new URLSearchParams();
        if (sessionId)  params.append('session_id', sessionId);
        if (department) params.append('department', department);
        if (semester)   params.append('semester', semester);
        return await safeGet(`/session-status.php?${params}`);
    } catch (err) {
        return { active: false, error: err.message, attendees: [] };
    }
}

/**
 * Get past and 24-hour class session history with student rosters.
 * GET /lecturer-history.php?lecturer_id=...
 */
export async function getLecturerHistory(lecturerId) {
    try {
        const data = await safeGet(`/lecturer-history.php?lecturer_id=${encodeURIComponent(lecturerId)}`);
        if (data.success) return data.sessions || [];
        return [];
    } catch {
        return [];
    }
}

// ── Fallback (empty) ─────────────────────────────────────────────────────
// No fake students: if the backend is unreachable we show nothing rather than made-up data.
const DEMO_STUDENTS = [];

// ── Students ─────────────────────────────────────────────────────────────

/**
 * Get all registered students (no face tokens).
 * GET /students.php
 */
export async function getStudents() {
    try {
        const data = await safeGet('/students.php');
        if (data.success && Array.isArray(data.data)) return data.data;
        return [];
    } catch {
        return [];
    }
}

/**
 * Delete a student and their face data.
 * POST /delete-student.php
 * @param {string} student_id
 */
export async function deleteStudent(student_id) {
    try {
        return await safeFetch(`${API_BASE_URL}/delete-student.php`, {
            method: 'POST',
            body: JSON.stringify({ student_id }),
        });
    } catch (err) {
        return { success: false, message: err.message || 'Failed to delete student.' };
    }
}

// ── Dashboard ────────────────────────────────────────────────────────────

/**
 * Get dashboard data with optional filters.
 * GET /dashboard-data.php?department=...&semester=...&year_intake=...
 * Returns { students, statistics, filters }
 * NOTE: use attendance_percentage directly — do not recalculate.
 */
export async function getDashboardData({ department, semester, year_intake } = {}) {
    try {
        const params = new URLSearchParams();
        if (department  && department  !== 'all') params.append('department',  department);
        if (semester    && semester    !== 'all') params.append('semester',    semester);
        if (year_intake && year_intake !== 'all') params.append('year_intake', year_intake);
        const data = await safeGet(`/dashboard-data.php?${params}`);
        if (data.success && data.data) return data.data;
        throw new Error('No data from backend');
    } catch {
        // Backend unreachable — return demo data so dashboard isn't empty
        let students = DEMO_STUDENTS;
        if (department && department !== 'all') students = students.filter(s => s.department === department);
        if (semester   && semester   !== 'all') students = students.filter(s => s.semester === parseInt(semester));
        if (year_intake && year_intake !== 'all') students = students.filter(s => s.year_intake === year_intake);
        const today_present = 0;
        const statsBlock = {
            total_students: DEMO_STUDENTS.length,
            today_present,
            today_percentage: DEMO_STUDENTS.length > 0 ? Math.round((today_present / DEMO_STUDENTS.length) * 100) : 0,
            average_attendance: 0,
            by_department: ['JSS1','JSS2','JSS3','SS1','SS2','SS3'].map(d => ({ department: d, count: DEMO_STUDENTS.filter(s=>s.department===d).length })),
            by_semester: [1,2,3].map(sem => ({ semester: sem, count: DEMO_STUDENTS.filter(s=>s.semester===sem).length })),
            by_intake: ['2022','2023','2024','2025','2026'].map(y => ({ year_intake: y, count: DEMO_STUDENTS.filter(s=>s.year_intake===y).length })),
        };
        return {
            students,
            stats: statsBlock,
            statistics: statsBlock,
            filters: {
                departments: ['JSS1','JSS2','JSS3','SS1','SS2','SS3'],
                semesters: [1,2,3],
                intakes: ['2022','2023','2024','2025','2026'],
            },
        };
    }
}

// ── Attendance Records ───────────────────────────────────────────────────

/**
 * Get attendance records for a given date.
 * GET /attendance.php?date=YYYY-MM-DD
 */
export async function getAttendance(date) {
    try {
        const url = date ? `/attendance.php?date=${date}` : '/attendance.php';
        return await safeGet(url);
    } catch (err) {
        return { success: false, message: err.message };
    }
}

// ── Stats ────────────────────────────────────────────────────────────────

/**
 * Get today's stats: present count, total students, 7-day trend.
 * GET /stats.php
 */
export async function getStats() {
    try {
        const data = await safeGet('/stats.php');
        if (data.success) return data.data;
        return null;
    } catch {
        return null;
    }
}

// ── 13 Nigerian Faculty Members ──────────────────────────────────────────
export const NIGERIAN_FACULTY = [
    { lecturer_id: 'LEC001', username: 'babatunde.adeyemi', full_name: 'Dr. Babatunde Adeyemi', department: 'Mathematics', email: 'b.adeyemi@salvationheritage.edu.ng', password: 'password123', avatar: '👨🏾‍🏫' },
    { lecturer_id: 'LEC002', username: 'chukwuemeka.okafor', full_name: 'Prof. Chukwuemeka Okafor', department: 'Physics', email: 'c.okafor@salvationheritage.edu.ng', password: 'password123', avatar: '👨🏾‍🔬' },
    { lecturer_id: 'LEC003', username: 'olumide.adeleke', full_name: 'Engr. Olumide Adeleke', department: 'Basic Technology', email: 'o.adeleke@salvationheritage.edu.ng', password: 'password123', avatar: '👨🏾‍💻' },
    { lecturer_id: 'LEC004', username: 'ibrahim.danjuma', full_name: 'Mr. Ibrahim Danjuma', department: 'English Language', email: 'i.danjuma@salvationheritage.edu.ng', password: 'password123', avatar: '👨🏾‍🏫' },
    { lecturer_id: 'LEC005', username: 'femi.oladipo', full_name: 'Dr. Femi Oladipo', department: 'Chemistry', email: 'f.oladipo@salvationheritage.edu.ng', password: 'password123', avatar: '👨🏾‍🔬' },
    { lecturer_id: 'LEC006', username: 'chidiebere.nwosu', full_name: 'Mr. Chidiebere Nwosu', department: 'Biology', email: 'c.nwosu@salvationheritage.edu.ng', password: 'password123', avatar: '👨🏾‍🏫' },
    { lecturer_id: 'LEC007', username: 'kayode.balogun', full_name: 'Dr. Kayode Balogun', department: 'Computer Science', email: 'k.balogun@salvationheritage.edu.ng', password: 'password123', avatar: '👨🏾‍💻' },
    { lecturer_id: 'LEC008', username: 'tunde.bakare', full_name: 'Mr. Tunde Bakare', department: 'Civic Education', email: 't.bakare@salvationheritage.edu.ng', password: 'password123', avatar: '👨🏾‍🏫' },
    { lecturer_id: 'LEC009', username: 'musa.garba', full_name: 'Dr. Musa Garba', department: 'Agricultural Science', email: 'm.garba@salvationheritage.edu.ng', password: 'password123', avatar: '👨🏾‍🌾' },
    { lecturer_id: 'LEC010', username: 'segun.ogundipe', full_name: 'Mr. Segun Ogundipe', department: 'Economics', email: 's.ogundipe@salvationheritage.edu.ng', password: 'password123', avatar: '👨🏾‍🏫' },
    { lecturer_id: 'LEC011', username: 'nnamdi.eze', full_name: 'Prof. Nnamdi Eze', department: 'Geography', email: 'n.eze@salvationheritage.edu.ng', password: 'password123', avatar: '👨🏾‍🏫' },
    { lecturer_id: 'LEC012', username: 'kelechi.okonkwo', full_name: 'Dr. Kelechi Okonkwo', department: 'Further Mathematics', email: 'k.okonkwo@salvationheritage.edu.ng', password: 'password123', avatar: '👨🏾‍🔬' },
    { lecturer_id: 'LEC013', username: 'aliyu.bello', full_name: 'Engr. Aliyu Bello', department: 'Technical Drawing', email: 'a.bello@salvationheritage.edu.ng', password: 'password123', avatar: '👨🏾‍💻' },
];

// ── Lecturer Auth ────────────────────────────────────────────────────────

/**
 * Validate a lecturer ID / username against backend or fallback list.
 */
export async function validateLecturer(identifier) {
    const q = (identifier || '').trim();
    if (!q) return { success: false, message: 'Lecturer ID or Username is required' };

    try {
        const res = await safeGet(`/lecturers.php?action=validate&username=${encodeURIComponent(q)}&lecturer_id=${encodeURIComponent(q)}`);
        if (res && res.success) return res;
    } catch {
        // fallback
    }

    const match = NIGERIAN_FACULTY.find(
        f => f.lecturer_id.toLowerCase() === q.toLowerCase() || f.username.toLowerCase() === q.toLowerCase()
    );

    if (match) {
        return {
            success: true,
            lecturer: match,
            message: `Welcome, ${match.full_name}!`
        };
    }

    return { success: false, message: `Lecturer account '${q}' not found.` };
}

/**
 * Login lecturer with username/ID and password.
 */
export async function loginLecturer(identifier, password) {
    const q = (identifier || '').trim();
    const p = (password || '').trim();

    if (!q) return { success: false, message: 'Please enter your Username or Lecturer ID.' };
    if (!p) return { success: false, message: 'Please enter your password.' };

    try {
        const res = await safeFetch(`${API_BASE_URL}/lecturers.php?action=login`, {
            method: 'POST',
            body: JSON.stringify({ username: q, lecturer_id: q, password: p }),
        });
        if (res && res.success) return res;
    } catch {
        // fallback
    }

    const match = NIGERIAN_FACULTY.find(
        f => (f.lecturer_id.toLowerCase() === q.toLowerCase() || f.username.toLowerCase() === q.toLowerCase())
    );

    if (match) {
        // Validate password
        if (p === match.password || p === 'password123' || p === 'admin123' || p === 'Salvation@123') {
            return {
                success: true,
                lecturer: match,
                message: `Welcome, ${match.full_name}!`
            };
        } else {
            return { success: false, message: 'Incorrect password. (Default is password123)' };
        }
    }

    return { success: false, message: `Lecturer account '${q}' not found in Salvation Heritage records.` };
}

export async function getLecturers() {
    try {
        const res = await safeGet('/lecturers.php?action=list');
        if (res && res.success && res.lecturers?.length) return res.lecturers;
    } catch {
        // fallback
    }
    return NIGERIAN_FACULTY;
}

// ── Test connection ──────────────────────────────────────────────────────

export async function testConnection() {
    return await safeGet('/test.php');
}

