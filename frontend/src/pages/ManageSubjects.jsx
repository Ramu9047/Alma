import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import StatusPill from '../components/common/StatusPill';
import { apiService, mockSessions } from '../services/api';
import { Plus, WifiOff, X } from 'lucide-react';

export function ManageSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    subjectCode: '', name: '', department: 'CSE', credits: 4, assignedFacultyId: 'EMP-901'
  });

  const loadSubjects = async () => {
    setLoading(true);
    const res = await apiService.getSubjects();
    setSubjects(res.data || []);
    setIsOffline(res.offline);
    setLoading(false);
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setFormData({ subjectCode: `CS${Math.floor(100 + Math.random() * 800)}`, name: '', department: 'CSE', credits: 4, assignedFacultyId: 'EMP-901' });
    setModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingSubject(s);
    setFormData({
      subjectCode: s.subjectCode || s.code || '',
      name: s.name || '',
      department: s.department || s.course || 'CSE',
      credits: s.credits || 4,
      assignedFacultyId: s.assignedFacultyId || s.staffAssigned || 'EMP-901'
    });
    setModalOpen(true);
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Delete subject ${s.name}?`)) return;
    await apiService.deleteSubject(s.id || s.subjectCode);
    loadSubjects();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingSubject) {
      await apiService.updateSubject(editingSubject.id || editingSubject.subjectCode, formData);
    } else {
      await apiService.createSubject(formData);
    }
    setModalOpen(false);
    loadSubjects();
  };

  const columns = [
    { header: 'Subject Code', render: (r) => <span className="font-mono text-cobalt font-semibold">{r.subjectCode || r.code}</span> },
    { header: 'Subject Title', render: (r) => <span className="font-medium text-ink">{r.name}</span> },
    { header: 'Department', render: (r) => <span className="font-mono text-ink">{r.department || r.course}</span> },
    { header: 'Credits', render: (r) => <span className="font-mono text-ink-muted">{r.credits} Credits</span> },
    { header: 'Assigned Faculty', render: (r) => <span className="text-ink-muted">{r.assignedFacultyId || r.staffAssigned}</span> },
  ];

  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-3 bg-warning/10 border border-warning/30 text-warning text-xs font-mono rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Backend offline — displaying cached demo subject catalog</span>
          </div>
          <span className="px-2 py-0.5 bg-warning/20 rounded text-[10px] font-bold">DEMO MODE</span>
        </div>
      )}

      <DataTable
        title="Academic Subjects Catalog"
        subtitle={loading ? "Loading subject catalog..." : "Curriculum subjects, credit weightage, and faculty lead mapping"}
        columns={columns}
        data={subjects}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        actions={
          <button onClick={handleOpenAdd} className="flex items-center gap-2 px-3.5 py-2 rounded-xl btn-cobalt text-xs font-semibold">
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        }
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="command-card w-full max-w-md bg-surface p-6 shadow-warm-lg space-y-4 rounded-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-serif font-bold text-ink text-lg">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-ink-muted" /></button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-ink-muted mb-1">Subject Code:</label>
                <input type="text" required value={formData.subjectCode} onChange={e => setFormData({...formData, subjectCode: e.target.value})} className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-ink" />
              </div>
              <div>
                <label className="block text-ink-muted mb-1">Subject Title:</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-ink" />
              </div>
              <div>
                <label className="block text-ink-muted mb-1">Department:</label>
                <input type="text" required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-ink" />
              </div>
              <div>
                <label className="block text-ink-muted mb-1">Credits:</label>
                <input type="number" required value={formData.credits} onChange={e => setFormData({...formData, credits: Number(e.target.value)})} className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-ink" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl border border-border text-xs text-ink-muted">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl btn-cobalt font-semibold text-xs">Save Subject</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export function ManageSessions() {
  const [sessions, setSessions] = useState(mockSessions);

  const columns = [
    { header: 'Session Period', render: (r) => <span className="font-mono text-cobalt font-semibold">{r.year}</span> },
    { header: 'Start Year', render: (r) => <span className="font-mono text-ink">{r.startYear}</span> },
    { header: 'End Year', render: (r) => <span className="font-mono text-ink">{r.endYear}</span> },
    {
      header: 'Status',
      render: (r) => <StatusPill category="course" status={r.status || 'Active'} size="xs" />
    }
  ];

  return (
    <DataTable
      title="Academic Sessions"
      subtitle="Batch academic calendar sessions and active terms"
      columns={columns}
      data={sessions}
      onEdit={() => {}}
      onDelete={(item) => setSessions(s => s.filter(x => x.id !== item.id))}
      actions={
        <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl btn-cobalt text-xs font-semibold">
          <Plus className="w-4 h-4" />
          <span>New Session</span>
        </button>
      }
    />
  );
}
