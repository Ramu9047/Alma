import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import { apiService } from '../services/api';
import { UserPlus, WifiOff, X } from 'lucide-react';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '', name: '', email: '', course: '', batch: '2024-2028', attendancePercent: 90, gpa: 3.5, feeStatus: 'Paid'
  });

  const loadStudents = async () => {
    setLoading(true);
    const res = await apiService.getStudents();
    setStudents(res.data || []);
    setIsOffline(res.offline);
    setLoading(false);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({ studentId: `CS2024-${Math.floor(100 + Math.random() * 900)}`, name: '', email: '', course: 'CSE-BS', batch: '2024-2028', attendancePercent: 90, gpa: 3.5, feeStatus: 'Paid' });
    setModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingStudent(s);
    setFormData({
      studentId: s.studentId || s.rollNumber || '',
      name: s.name || '',
      email: s.email || '',
      course: s.course || '',
      batch: s.batch || s.session || '2024-2028',
      attendancePercent: s.attendancePercent ?? s.attendancePct ?? 90,
      gpa: s.gpa ?? 3.5,
      feeStatus: s.feeStatus || 'Paid'
    });
    setModalOpen(true);
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Delete student ${s.name}?`)) return;
    await apiService.deleteStudent(s.id || s.studentId);
    loadStudents();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingStudent) {
      await apiService.updateStudent(editingStudent.id || editingStudent.studentId, formData);
    } else {
      await apiService.createStudent(formData);
    }
    setModalOpen(false);
    loadStudents();
  };

  const columns = [
    {
      header: 'Roll Number',
      render: (row) => <span className="font-mono text-cobalt font-semibold">{row.studentId || row.rollNumber}</span>
    },
    {
      header: 'Student Name',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-ink">{row.name}</span>
          <span className="text-[10px] text-ink-muted font-mono">{row.email}</span>
        </div>
      )
    },
    {
      header: 'Course / Session',
      render: (row) => <span className="font-mono text-xs">{row.course} ({row.batch || row.session})</span>
    },
    {
      header: 'Attendance %',
      render: (row) => {
        const att = row.attendancePercent ?? row.attendancePct ?? 0;
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-surface-warm h-1.5 rounded-full overflow-hidden border border-border">
              <div
                className={`h-full ${att < 75 ? 'bg-risk' : 'bg-success'}`}
                style={{ width: `${att}%` }}
              />
            </div>
            <span className={`font-mono text-xs ${att < 75 ? 'text-risk font-bold' : 'text-ink'}`}>
              {att}%
            </span>
          </div>
        );
      }
    },
    {
      header: 'Fee Status',
      render: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${
          row.feeStatus === 'Paid' ? 'bg-success/10 text-success border-success/30' :
          row.feeStatus === 'Pending' || row.feeStatus === 'Partial' ? 'bg-warning/10 text-warning border-warning/30' :
          'bg-risk/10 text-risk border-risk/30'
        }`}>
          {row.feeStatus}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-3 bg-warning/10 border border-warning/30 text-warning text-xs font-mono rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Backend offline — displaying cached demo student dataset</span>
          </div>
          <span className="px-2 py-0.5 bg-warning/20 rounded text-[10px] font-bold">DEMO MODE</span>
        </div>
      )}

      <DataTable
        title="Student Registry & Enrolment"
        subtitle={loading ? "Loading live records..." : "Manage student profiles, academic progress, and status"}
        columns={columns}
        data={students}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        actions={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl btn-cobalt text-xs font-semibold"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enrol Student</span>
          </button>
        }
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="command-card w-full max-w-md bg-surface p-6 shadow-warm-lg space-y-4 rounded-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-serif font-bold text-ink text-lg">
                {editingStudent ? 'Edit Student Record' : 'Enrol New Student'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-ink-muted" /></button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-ink-muted mb-1">Roll / Student ID:</label>
                <input type="text" required value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-ink" />
              </div>
              <div>
                <label className="block text-ink-muted mb-1">Full Name:</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-ink" />
              </div>
              <div>
                <label className="block text-ink-muted mb-1">Email Address:</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-ink" />
              </div>
              <div>
                <label className="block text-ink-muted mb-1">Course Code:</label>
                <input type="text" required value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-ink" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl border border-border text-xs text-ink-muted">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl btn-cobalt font-semibold text-xs">Save Record</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
