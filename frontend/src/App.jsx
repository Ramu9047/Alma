import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PulseProvider } from './context/PulseContext';
import Layout from './components/layout/Layout';
import RiskRadar from './pages/RiskRadar';
import LiveOccupancy from './pages/LiveOccupancy';
import ManageCourses from './pages/ManageCourses';
import ManageStudents from './pages/ManageStudents';
import ManageStaff from './pages/ManageStaff';
import { ManageSubjects, ManageSessions } from './pages/ManageSubjects';
import AttendanceModule from './pages/AttendanceModule';
import ResultsModule from './pages/ResultsModule';
import LeaveManagement from './pages/LeaveManagement';
import FeedbackModule from './pages/FeedbackModule';
import FeeManagement from './pages/FeeManagement';
import TimetableGenerator from './pages/TimetableGenerator';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import DocumentGenerator from './pages/DocumentGenerator';
import ParentPortal from './pages/ParentPortal';
import AuditLogView from './pages/AuditLogView';
import NotificationsCenter from './pages/NotificationsCenter';
import Login from './pages/Login';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PulseProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/risk-radar" replace />} />
                <Route path="risk-radar" element={<RiskRadar />} />
                <Route path="occupancy" element={<LiveOccupancy />} />
                <Route path="courses" element={<ManageCourses />} />
                <Route path="students" element={<ManageStudents />} />
                <Route path="staff" element={<ManageStaff />} />
                <Route path="subjects" element={<ManageSubjects />} />
                <Route path="sessions" element={<ManageSessions />} />
                <Route path="attendance" element={<AttendanceModule />} />
                <Route path="results" element={<ResultsModule />} />
                <Route path="leaves" element={<LeaveManagement />} />
                <Route path="feedback" element={<FeedbackModule />} />
                <Route path="fees" element={<FeeManagement />} />
                <Route path="timetable" element={<TimetableGenerator />} />
                <Route path="analytics" element={<AnalyticsDashboard />} />
                <Route path="documents" element={<DocumentGenerator />} />
                <Route path="parent-portal" element={<ParentPortal />} />
                <Route path="audit-log" element={<AuditLogView />} />
                <Route path="notifications" element={<NotificationsCenter />} />
              </Route>
              <Route path="*" element={<Navigate to="/risk-radar" replace />} />
            </Routes>
          </BrowserRouter>
        </PulseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
