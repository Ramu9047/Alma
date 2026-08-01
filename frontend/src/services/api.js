// Campus Command API Service Engine
// Handles REST calls to backend Spring Boot service with instant fallback mock data

export const mockCourses = [
  { id: 'crs_101', code: 'CSE-BS', name: 'B.Tech Computer Science & Engineering', department: 'CSE', durationYears: 4, status: 'Active' },
  { id: 'crs_102', code: 'ECE-BS', name: 'B.Tech Electronics & Communication', department: 'ECE', durationYears: 4, status: 'Active' },
  { id: 'crs_103', code: 'MECH-BS', name: 'B.Tech Mechanical Engineering', department: 'MECH', durationYears: 4, status: 'Active' },
  { id: 'crs_104', code: 'AIDS-BS', name: 'B.Tech Artificial Intelligence & Data Science', department: 'CSE', durationYears: 4, status: 'Active' },
  { id: 'crs_105', code: 'MBA-MS', name: 'Master of Business Administration', department: 'MGMT', durationYears: 2, status: 'Active' },
];

export const mockStudents = [
  { id: 'std_001', rollNumber: 'CS2024-001', name: 'Aarav Sharma', course: 'CSE-BS', session: '2024-2028', email: 'aarav.s@campuscommand.edu', attendancePct: 94, feeStatus: 'Paid', status: 'Active' },
  { id: 'std_002', rollNumber: 'CS2024-042', name: 'Alex Rivera', course: 'CSE-BS', session: '2024-2028', email: 'alex.r@campuscommand.edu', attendancePct: 88, feeStatus: 'Paid', status: 'Active' },
  { id: 'std_003', rollNumber: 'EC2024-015', name: 'Ananya Patel', course: 'ECE-BS', session: '2024-2028', email: 'ananya.p@campuscommand.edu', attendancePct: 74, feeStatus: 'Pending', status: 'Active' },
  { id: 'std_004', rollNumber: 'AI2024-009', name: 'Rohan Mehta', course: 'AIDS-BS', session: '2024-2028', email: 'rohan.m@campuscommand.edu', attendancePct: 91, feeStatus: 'Paid', status: 'Active' },
  { id: 'std_005', rollNumber: 'ME2024-003', name: 'Vikram Singh', course: 'MECH-BS', session: '2024-2028', email: 'vikram.s@campuscommand.edu', attendancePct: 62, feeStatus: 'Overdue', status: 'Warning' }
];

export const mockStaff = [
  { id: 'stf_101', empId: 'EMP-901', name: 'Dr. Sarah Jenkins', department: 'CSE', email: 's.jenkins@campuscommand.edu', subjects: ['Data Structures', 'Algorithms'], designation: 'HoD & Professor' },
  { id: 'stf_102', empId: 'EMP-902', name: 'Prof. Marcus Vance', department: 'CSE', email: 'm.vance@campuscommand.edu', subjects: ['Operating Systems', 'System Design'], designation: 'Associate Professor' },
  { id: 'stf_103', empId: 'EMP-903', name: 'Dr. Priya Sundaram', department: 'ECE', email: 'p.sundaram@campuscommand.edu', subjects: ['Digital Signal Processing'], designation: 'Professor' },
];

export const mockSubjects = [
  { id: 'sbj_01', code: 'CS301', name: 'Data Structures & Algorithms', course: 'CSE-BS', credits: 4, staffAssigned: 'Dr. Sarah Jenkins' },
  { id: 'sbj_02', code: 'CS302', name: 'Operating Systems Architecture', course: 'CSE-BS', credits: 4, staffAssigned: 'Prof. Marcus Vance' },
  { id: 'sbj_03', code: 'EC201', name: 'Analog Circuits & Systems', course: 'ECE-BS', credits: 3, staffAssigned: 'Dr. Priya Sundaram' },
  { id: 'sbj_04', code: 'AI101', name: 'Machine Learning Foundations', course: 'AIDS-BS', credits: 4, staffAssigned: 'Dr. Sarah Jenkins' },
];

export const mockSessions = [
  { id: 'ses_01', year: '2024-2028', startYear: 2024, endYear: 2028, status: 'Active' },
  { id: 'ses_02', year: '2025-2029', startYear: 2025, endYear: 2029, status: 'Upcoming' },
];

export const mockLeaves = [
  { id: 'lev_01', applicantName: 'Prof. Marcus Vance', applicantRole: 'Staff', type: 'Medical Leave', startDate: '2026-07-25', endDate: '2026-07-27', reason: 'Attending IEEE Conference', status: 'Pending' },
  { id: 'lev_02', applicantName: 'Alex Rivera', applicantRole: 'Student', type: 'Casual Leave', startDate: '2026-07-22', endDate: '2026-07-22', reason: 'Personal Emergency', status: 'Approved' },
  { id: 'lev_03', applicantName: 'Ananya Patel', applicantRole: 'Student', type: 'Medical Leave', startDate: '2026-07-18', endDate: '2026-07-20', reason: 'Viral Fever', status: 'Rejected' },
];

export const mockFeedback = [
  { id: 'fb_01', author: 'Alex Rivera', role: 'Student', subject: 'Lab Hardware Upgrade Request', content: 'The CS Lab 2 workstations need higher RAM for Deep Learning practicals.', status: 'Open', replies: [{ author: 'Dr. Sarah Jenkins', text: 'Approved. New RAM modules ordered for CS Lab 2.', date: '2026-07-20' }] }
];

export const mockFees = [
  { id: 'fee_01', rollNumber: 'CS2024-001', studentName: 'Aarav Sharma', course: 'CSE-BS', totalAmount: 75000, paidAmount: 75000, status: 'Paid', dueDate: '2026-08-01' },
  { id: 'fee_02', rollNumber: 'CS2024-042', studentName: 'Alex Rivera', course: 'CSE-BS', totalAmount: 75000, paidAmount: 75000, status: 'Paid', dueDate: '2026-08-01' },
  { id: 'fee_03', rollNumber: 'EC2024-015', studentName: 'Ananya Patel', course: 'ECE-BS', totalAmount: 70000, paidAmount: 35000, status: 'Partial', dueDate: '2026-08-01' },
  { id: 'fee_04', rollNumber: 'ME2024-003', studentName: 'Vikram Singh', course: 'MECH-BS', totalAmount: 68000, paidAmount: 0, status: 'Overdue', dueDate: '2026-06-15' }
];

export const mockTimetable = [
  { day: 'Monday', period1: 'CS301 (Lab 1)', period2: 'CS302 (Room 201)', period3: 'EC201 (Room 102)', period4: 'Library' },
  { day: 'Tuesday', period1: 'AI101 (Room 304)', period2: 'CS301 (Room 201)', period3: 'CS302 (Lab 2)', period4: 'Sports' },
  { day: 'Wednesday', period1: 'CS302 (Room 201)', period2: 'AI101 (Room 304)', period3: 'Seminars', period4: 'Mentoring' },
];

export const mockAuditLogs = [
  { id: 'log_901', timestamp: '2026-07-21 21:40:12', user: 'admin_hod', action: 'UPDATE', collection: 'courses', recordId: 'crs_101', beforeState: 'CSE-BS (Legacy)', afterState: 'CSE-BS (Updated Syllabus)' },
  { id: 'log_902', timestamp: '2026-07-21 20:15:05', user: 'admin_hod', action: 'CREATE', collection: 'subjects', recordId: 'sbj_04', beforeState: 'null', afterState: 'AI101 Machine Learning' },
  { id: 'log_903', timestamp: '2026-07-21 18:30:00', user: 'm.vance', action: 'CREATE', collection: 'results', recordId: 'rst_402', beforeState: 'null', afterState: 'Midterm Marks CS302' },
  { id: 'log_904', timestamp: '2026-07-21 16:10:44', user: 'admin_hod', action: 'UPDATE', collection: 'fees', recordId: 'fee_01', beforeState: 'Paid: 0', afterState: 'Paid: 75000' }
];

export const apiService = {
  getCourses: async () => mockCourses,
  getStudents: async () => mockStudents,
  getStaff: async () => mockStaff,
  getSubjects: async () => mockSubjects,
  getSessions: async () => mockSessions,
  getLeaves: async () => mockLeaves,
  getFeedback: async () => mockFeedback,
  getFees: async () => mockFees,
  getTimetable: async () => mockTimetable,
  getAuditLogs: async () => mockAuditLogs,
};
