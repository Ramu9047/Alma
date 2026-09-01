// Campus Command API Service Engine
// Handles REST calls to backend Spring Boot service with instant fallback mock data

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const mockCourses = [
  { id: 'crs_101', courseCode: 'CSE-BS', name: 'B.Tech Computer Science & Engineering', department: 'CSE', duration: 4, totalSeats: 120, enrolledCount: 98 },
  { id: 'crs_102', courseCode: 'ECE-BS', name: 'B.Tech Electronics & Communication', department: 'ECE', duration: 4, totalSeats: 90, enrolledCount: 72 },
  { id: 'crs_103', courseCode: 'MECH-BS', name: 'B.Tech Mechanical Engineering', department: 'MECH', duration: 4, totalSeats: 80, enrolledCount: 65 },
  { id: 'crs_104', courseCode: 'MBA-MS', name: 'Master of Business Administration', department: 'MGMT', duration: 2, totalSeats: 60, enrolledCount: 58 }
];

export const mockStudents = [
  { id: 'std_001', studentId: 'CS2024-001', name: 'Aarav Sharma', course: 'CSE-BS', batch: '2024-2028', email: 'aarav.s@alma.edu', attendancePercent: 94, feeStatus: 'Paid', gpa: 3.8, backlogs: 0, phone: '9900001111' },
  { id: 'std_002', studentId: 'CS2024-042', name: 'Alex Rivera', course: 'CSE-BS', batch: '2024-2028', email: 'alex.r@alma.edu', attendancePercent: 88, feeStatus: 'Paid', gpa: 3.6, backlogs: 0, phone: '9900002222' },
  { id: 'std_003', studentId: 'EC2024-015', name: 'Ananya Patel', course: 'ECE-BS', batch: '2024-2028', email: 'ananya.p@alma.edu', attendancePercent: 74, feeStatus: 'Partial', gpa: 2.9, backlogs: 1, phone: '9900003333' },
  { id: 'std_004', studentId: 'ME2024-003', name: 'Vikram Singh', course: 'MECH-BS', batch: '2024-2028', email: 'vikram.s@alma.edu', attendancePercent: 62, feeStatus: 'Overdue', gpa: 2.4, backlogs: 2, phone: '9900004444' }
];

export const mockStaff = [
  { id: 'stf_101', staffId: 'EMP-901', name: 'Dr. Sarah Jenkins', department: 'CSE', email: 's.jenkins@alma.edu', assignedCourses: ['CS301', 'CS302'], designation: 'HoD & Professor' },
  { id: 'stf_102', staffId: 'EMP-902', name: 'Prof. Marcus Vance', department: 'CSE', email: 'm.vance@alma.edu', assignedCourses: ['CS401'], designation: 'Associate Professor' },
  { id: 'stf_103', staffId: 'EMP-903', name: 'Dr. Priya Sundaram', department: 'ECE', email: 'p.sundaram@alma.edu', assignedCourses: ['EC201'], designation: 'Professor' }
];

export const mockSubjects = [
  { id: 'sbj_01', subjectCode: 'CS301', name: 'Data Structures & Algorithms', department: 'CSE', credits: 4, assignedFacultyId: 'EMP-901' },
  { id: 'sbj_02', subjectCode: 'CS302', name: 'Operating Systems Architecture', department: 'CSE', credits: 4, assignedFacultyId: 'EMP-902' },
  { id: 'sbj_03', subjectCode: 'EC201', name: 'Analog Circuits & Systems', department: 'ECE', credits: 3, assignedFacultyId: 'EMP-903' }
];

export const mockLeaves = [
  { id: 'lev_01', leaveId: 'lev_01', applicantName: 'Prof. Marcus Vance', applicantRole: 'Staff', leaveType: 'Medical Leave', startDate: '2026-07-25', endDate: '2026-07-27', reason: 'Medical appointment', status: 'PENDING' },
  { id: 'lev_02', leaveId: 'lev_02', applicantName: 'Alex Rivera', applicantRole: 'Student', leaveType: 'Casual Leave', startDate: '2026-07-22', endDate: '2026-07-22', reason: 'Personal Emergency', status: 'APPROVED' }
];

export const mockFees = [
  { id: 'fee_01', studentId: 'CS2024-001', studentName: 'Aarav Sharma', amount: 120000, paid: 120000, paymentStatus: 'Paid', dueDate: '2026-08-01', overdueDays: 0, semester: 'Spring 2026' },
  { id: 'fee_02', studentId: 'CS2024-042', studentName: 'Alex Rivera', amount: 120000, paid: 120000, paymentStatus: 'Paid', dueDate: '2026-08-01', overdueDays: 0, semester: 'Spring 2026' },
  { id: 'fee_03', studentId: 'EC2024-015', studentName: 'Ananya Patel', amount: 115000, paid: 57500, paymentStatus: 'Partial', dueDate: '2026-08-01', overdueDays: 15, semester: 'Spring 2026' },
  { id: 'fee_04', studentId: 'ME2024-003', studentName: 'Vikram Singh', amount: 118000, paid: 50000, paymentStatus: 'Overdue', dueDate: '2026-06-15', overdueDays: 36, semester: 'Spring 2026' }
];

export const mockTimetable = [
  { id: 'tt_01', department: 'CSE', day: 'Monday', timeSlot: '09:00-10:00', subjectCode: 'CS301', facultyId: 'EMP-901', room: 'LAB-A' },
  { id: 'tt_02', department: 'CSE', day: 'Monday', timeSlot: '10:00-11:00', subjectCode: 'CS401', facultyId: 'EMP-902', room: 'LH-101' },
  { id: 'tt_03', department: 'ECE', day: 'Monday', timeSlot: '09:00-10:00', subjectCode: 'EC201', facultyId: 'EMP-903', room: 'LH-201' }
];

export const mockAuditLogs = [
  { id: 'log_901', timestamp: '2026-07-21T21:40:12', actorUsername: 'admin_hod', actorRole: 'ADMIN_HOD', action: 'UPDATE', collectionName: 'courses', recordId: 'crs_101' },
  { id: 'log_902', timestamp: '2026-07-21T20:15:05', actorUsername: 'admin_hod', actorRole: 'ADMIN_HOD', action: 'CREATE', collectionName: 'subjects', recordId: 'sbj_04' }
];

export const mockSessions = [
  { id: 'ses_01', year: '2024-2028', startYear: 2024, endYear: 2028, status: 'Active' },
  { id: 'ses_02', year: '2025-2029', startYear: 2025, endYear: 2029, status: 'Upcoming' },
];

export const mockFeedback = [
  { id: 'fb_01', author: 'Alex Rivera', role: 'Student', subject: 'Lab Hardware Upgrade Request', content: 'The CS Lab 2 workstations need higher RAM for Deep Learning practicals.', status: 'Open', replies: [{ author: 'Dr. Sarah Jenkins', text: 'Approved. New RAM modules ordered for CS Lab 2.', date: '2026-07-20' }] }
];

/**
 * Shared fetch wrapper with response body/status guards and mock fallback.
 */
export async function apiFetch(endpoint, options = {}, mockFallback = null) {
  const token = localStorage.getItem('campus_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!res.ok) {
      const contentType = res.headers.get('content-type');
      let errText = `HTTP ${res.status} ${res.statusText}`;
      if (contentType && contentType.includes('application/json')) {
        const errJson = await res.json().catch(() => null);
        if (errJson?.error || errJson?.message) errText = errJson.error || errJson.message;
      }
      console.warn(`[apiFetch] Request to ${endpoint} failed: ${errText}`);
      if (mockFallback !== null) {
        return { data: mockFallback, offline: true, error: errText };
      }
      throw new Error(errText);
    }

    if (res.status === 204) {
      return { data: true, offline: false, error: null };
    }

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      return { data, offline: false, error: null };
    }

    return { data: true, offline: false, error: null };
  } catch (err) {
    console.warn(`[apiFetch] Network/Server exception calling ${endpoint}:`, err.message);
    if (mockFallback !== null) {
      return { data: mockFallback, offline: true, error: err.message };
    }
    return { data: null, offline: true, error: err.message };
  }
}

export const apiService = {
  // Reads
  getCourses: () => apiFetch('/api/courses', {}, mockCourses),
  getStudents: () => apiFetch('/api/student', {}, mockStudents),
  getStaff: () => apiFetch('/api/staff', {}, mockStaff),
  getSubjects: () => apiFetch('/api/admin/subjects', {}, mockSubjects),
  getLeaves: () => apiFetch('/api/leaves', {}, mockLeaves),
  getFees: () => apiFetch('/api/admin/fees', {}, mockFees),
  getTimetable: () => apiFetch('/api/admin/timetable', {}, mockTimetable),
  getAuditLogs: () => apiFetch('/api/admin/notifications', {}, mockAuditLogs),
  getAnalytics: () => apiFetch('/api/admin/analytics', {}, null),
  getResults: () => apiFetch('/api/student/results', {}, null),
  getRisk: () => apiFetch('/api/admin/risk', {}, null),

  // Mutations
  createStudent: (s) => apiFetch('/api/student', { method: 'POST', body: JSON.stringify(s) }),
  updateStudent: (id, s) => apiFetch(`/api/student/${id}`, { method: 'PUT', body: JSON.stringify(s) }),
  deleteStudent: (id) => apiFetch(`/api/student/${id}`, { method: 'DELETE' }),

  createStaff: (s) => apiFetch('/api/staff', { method: 'POST', body: JSON.stringify(s) }),
  updateStaff: (id, s) => apiFetch(`/api/staff/${id}`, { method: 'PUT', body: JSON.stringify(s) }),
  deleteStaff: (id) => apiFetch(`/api/staff/${id}`, { method: 'DELETE' }),

  createCourse: (c) => apiFetch('/api/courses', { method: 'POST', body: JSON.stringify(c) }),
  updateCourse: (id, c) => apiFetch(`/api/courses/${id}`, { method: 'PUT', body: JSON.stringify(c) }),
  deleteCourse: (id) => apiFetch(`/api/courses/${id}`, { method: 'DELETE' }),

  createSubject: (s) => apiFetch('/api/admin/subjects', { method: 'POST', body: JSON.stringify(s) }),
  updateSubject: (id, s) => apiFetch(`/api/admin/subjects/${id}`, { method: 'PUT', body: JSON.stringify(s) }),
  deleteSubject: (id) => apiFetch(`/api/admin/subjects/${id}`, { method: 'DELETE' }),

  createTimetable: (t) => apiFetch('/api/admin/timetable', { method: 'POST', body: JSON.stringify(t) }),
  updateTimetable: (id, t) => apiFetch(`/api/admin/timetable/${id}`, { method: 'PUT', body: JSON.stringify(t) }),
  deleteTimetable: (id) => apiFetch(`/api/admin/timetable/${id}`, { method: 'DELETE' }),

  decideLeave: (leaveId, decision) => apiFetch(`/api/leaves/${leaveId}/decision`, { method: 'PUT', body: JSON.stringify({ decision }) }),
  payFee: (feeId, amount) => apiFetch(`/api/admin/fees/${feeId}/pay`, { method: 'PUT', body: JSON.stringify({ amount }) }),

  // Attendance
  submitAttendance: (date, subjectCode, records) => apiFetch('/api/attendance/bulk', { method: 'POST', body: JSON.stringify({ date, subjectCode, records }) }),
  getAttendanceRegister: (date, subjectCode) => apiFetch(`/api/attendance?date=${date}&subjectCode=${subjectCode}`, {}, []),
  getAttendanceSummary: (studentId) => apiFetch(`/api/attendance/student/${studentId}/summary`, {}, null),
  getMyAttendanceSummary: () => apiFetch('/api/attendance/me/summary', {}, null),

  // Feedback
  getFeedback: () => apiFetch('/api/feedback', {}, mockFeedback),
  createFeedback: (f) => apiFetch('/api/feedback', { method: 'POST', body: JSON.stringify(f) }),
  replyFeedback: (id, text) => apiFetch(`/api/feedback/${id}/reply`, { method: 'POST', body: JSON.stringify({ text }) }),

  // Parent Portal
  getParentChild: () => apiFetch('/api/parent/me/child', {}, null)
};
