import React, { useState, useEffect } from 'react';
import { apiService, mockStudents } from '../services/api';
import { usePulse } from '../context/PulseContext';
import { ClipboardCheck, CheckCircle2, XCircle, AlertTriangle, Send, WifiOff } from 'lucide-react';
import GrowthArc from '../components/common/GrowthArc';

export default function AttendanceModule() {
  const { pushPulseAlert } = usePulse();
  const [selectedDate, setSelectedDate] = useState('2026-07-21');
  const [selectedSubject, setSelectedSubject] = useState('CS301 (Data Structures)');
  const [records, setRecords] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadRegister = async () => {
    const studentsRes = await apiService.getStudents();
    const studentList = studentsRes.data || mockStudents;
    setIsOffline(studentsRes.offline);

    const subjectCode = selectedSubject.split(' ')[0];
    const regRes = await apiService.getAttendanceRegister(selectedDate, subjectCode);
    const existingReg = regRes.data || [];

    const mapped = studentList.map(s => {
      const sId = s.studentId || s.rollNumber || s.id;
      const found = existingReg.find(r => r.studentId === sId);
      const isPresent = found ? found.present : ((s.attendancePercent ?? s.attendancePct ?? 80) >= 75);
      return {
        ...s,
        studentId: sId,
        rollNumber: s.studentId || s.rollNumber || sId,
        attendancePct: s.attendancePercent ?? s.attendancePct ?? 80,
        present: isPresent
      };
    });

    setRecords(mapped);
  };

  useEffect(() => {
    loadRegister();
  }, [selectedDate, selectedSubject]);

  const toggleAttendance = (studentId) => {
    setRecords(prev =>
      prev.map(r => (r.studentId === studentId ? { ...r, present: !r.present } : r))
    );
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    const subjectCode = selectedSubject.split(' ')[0];
    const payloadRecords = records.map(r => ({
      studentId: r.studentId,
      present: r.present
    }));

    await apiService.submitAttendance(selectedDate, subjectCode, payloadRecords);

    const presentCount = records.filter(r => r.present).length;
    const total = records.length;
    const lowAttendanceCount = records.filter(r => !r.present && r.attendancePct < 75).length;

    setSubmitted(true);
    setSaving(false);
    pushPulseAlert(
      `Attendance marked for ${selectedSubject}: ${presentCount}/${total} present. ${lowAttendanceCount} low-attendance alerts generated.`
    );
    setTimeout(() => setSubmitted(false), 3000);
  };

  const totalPresent = records.filter(r => r.present).length;
  const overallPct = records.length > 0 ? Math.round((totalPresent / records.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-3 bg-warning/10 border border-warning/30 text-warning text-xs font-mono rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Backend offline — displaying cached demo dataset · DEMO MODE</span>
          </div>
          <span className="px-2 py-0.5 bg-warning/20 rounded text-[10px] font-bold">DEMO MODE</span>
        </div>
      )}

      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="command-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-ink-muted uppercase font-semibold">TODAY'S TURNOUT</span>
            <h3 className="text-2xl font-serif font-bold text-cobalt mt-1">{overallPct}%</h3>
            <span className="text-[10px] font-mono text-ink-muted">{totalPresent} of {records.length} Present</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cobalt/10 border border-cobalt/30 flex items-center justify-center text-cobalt">
            <ClipboardCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="command-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-ink-muted uppercase font-semibold">LOW ATTENDANCE WARNINGS</span>
            <h3 className="text-2xl font-serif font-bold text-risk mt-1">
              {records.filter(r => r.attendancePct < 75).length} Students
            </h3>
            <span className="text-[10px] font-mono text-ink-muted">&lt; 75% Threshold Alert</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-risk/10 border border-risk/30 flex items-center justify-center text-risk">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="command-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-ink-muted uppercase font-semibold">SESSION & SUBJECT</span>
            <h3 className="text-sm font-serif font-bold text-ink mt-1">{selectedSubject}</h3>
            <span className="text-[10px] font-mono text-success font-semibold">Verified Session</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/30 flex items-center justify-center text-success">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      <GrowthArc mode="divider" variant="cobalt" />

      {/* Attendance Marking Grid */}
      <div className="command-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-ink">Daily Attendance Register</h2>
            <p className="text-xs text-ink-muted">Toggle attendance status per student for real-time calculation</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 bg-surface-warm border border-border rounded-xl text-xs font-mono text-ink"
            />
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 bg-surface-warm border border-border rounded-xl text-xs font-mono text-ink"
            >
              <option value="CS301 (Data Structures)">CS301 (Data Structures)</option>
              <option value="CS302 (Operating Systems)">CS302 (Operating Systems)</option>
              <option value="EC201 (Analog Circuits)">EC201 (Analog Circuits)</option>
            </select>
          </div>
        </div>

        {submitted && (
          <div className="p-3 bg-success/10 border border-success/40 text-success text-xs font-mono rounded-xl flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Attendance successfully saved to MongoDB and broadcasted to Alma Campus Pulse strip!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {records.map(student => (
            <div
              key={student.studentId}
              onClick={() => toggleAttendance(student.studentId)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                student.present
                  ? 'bg-surface-warm/60 border-success/40 hover:border-success'
                  : 'bg-risk/5 border-risk/40 hover:border-risk'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-mono text-xs font-semibold text-cobalt">{student.rollNumber}</span>
                <span className="font-medium text-xs text-ink">{student.name}</span>
                <span className="text-[10px] font-mono text-ink-muted">Overall: {student.attendancePct}%</span>
              </div>

              <div className="flex items-center gap-2">
                {student.attendancePct < 75 && (
                  <span title="Low attendance alert" className="text-warning">
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                )}
                {student.present ? (
                  <span className="flex items-center gap-1 text-xs font-mono text-success font-semibold bg-success/10 px-2 py-1 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Present
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-mono text-risk font-semibold bg-risk/10 px-2 py-1 rounded-md">
                    <XCircle className="w-3.5 h-3.5" /> Absent
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <button
            onClick={handleSaveAttendance}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-cobalt text-xs font-semibold"
          >
            <Send className="w-4 h-4" />
            <span>{saving ? 'Submitting...' : 'Submit Attendance Register'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
