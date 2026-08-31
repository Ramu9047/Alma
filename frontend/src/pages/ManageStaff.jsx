import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import { apiService } from '../services/api';
import { UserPlus, WifiOff, X } from 'lucide-react';

export default function ManageStaff() {
  const [staffList, setStaffList] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    staffId: '', name: '', email: '', department: 'CSE', designation: 'Assistant Professor', assignedCourses: []
  });

  const loadStaff = async () => {
    setLoading(true);
    const res = await apiService.getStaff();
    setStaffList(res.data || []);
    setIsOffline(res.offline);
    setLoading(false);
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFormData({ staffId: `EMP-${Math.floor(900 + Math.random() * 90)}`, name: '', email: '', department: 'CSE', designation: 'Assistant Professor', assignedCourses: ['CS301'] });
    setModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingStaff(s);
    setFormData({
      staffId: s.staffId || s.empId || '',
      name: s.name || '',
      email: s.email || '',
      department: s.department || 'CSE',
      designation: s.designation || 'Assistant Professor',
      assignedCourses: s.assignedCourses || s.subjects || []
    });
    setModalOpen(true);
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Delete faculty member ${s.name}?`)) return;
    await apiService.deleteStaff(s.id || s.staffId);
    loadStaff();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingStaff) {
      await apiService.updateStaff(editingStaff.id || editingStaff.staffId, formData);
    } else {
      await apiService.createStaff(formData);
    }
    setModalOpen(false);
    loadStaff();
  };

  const columns = [
    { header: 'Emp ID', render: (row) => <span className="font-mono text-cobalt font-semibold">{row.staffId || row.empId}</span> },
    {
      header: 'Faculty Name',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-ink">{row.name}</span>
          <span className="text-[10px] text-ink-muted font-mono">{row.email}</span>
        </div>
      )
    },
    { header: 'Department', render: (row) => <span className="font-mono text-ink">{row.department}</span> },
    { header: 'Designation', render: (row) => <span className="text-ink font-medium">{row.designation}</span> },
    {
      header: 'Assigned Subjects',
      render: (row) => {
        const subs = row.assignedCourses || row.subjects || [];
        return (
          <div className="flex flex-wrap gap-1">
            {subs.map((sub, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 bg-surface-warm border border-border rounded-md text-ink">
                {sub}
              </span>
            ))}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-3 bg-warning/10 border border-warning/30 text-warning text-xs font-mono rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Backend offline — displaying cached demo faculty dataset</span>
          </div>
          <span className="px-2 py-0.5 bg-warning/20 rounded text-[10px] font-bold">DEMO MODE</span>
        </div>
      )}

      <DataTable
        title="Faculty & Staff Registry"
        subtitle={loading ? "Loading faculty records..." : "Departmental faculty allocation and subject assignments"}
        columns={columns}
        data={staffList}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        actions={
          <button onClick={handleOpenAdd} className="flex items-center gap-2 px-3.5 py-2 rounded-xl btn-cobalt text-xs font-semibold">
            <UserPlus className="w-4 h-4" />
            <span>Add Faculty Member</span>
          </button>
        }
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="command-card w-full max-w-md bg-surface p-6 shadow-warm-lg space-y-4 rounded-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-serif font-bold text-ink text-lg">
                {editingStaff ? 'Edit Faculty Record' : 'Add New Faculty Member'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-ink-muted" /></button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-ink-muted mb-1">Emp ID:</label>
                <input type="text" required value={formData.staffId} onChange={e => setFormData({...formData, staffId: e.target.value})} className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-ink" />
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
                <label className="block text-ink-muted mb-1">Department:</label>
                <input type="text" required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-ink" />
              </div>
              <div>
                <label className="block text-ink-muted mb-1">Designation:</label>
                <input type="text" required value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-ink" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl border border-border text-xs text-ink-muted">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl btn-cobalt font-semibold text-xs">Save Faculty</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
