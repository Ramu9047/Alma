import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import GrowthArc from '../components/common/GrowthArc';
import { apiService, mockCourses } from '../services/api';
import { Plus, BookOpen, Layers, CheckCircle } from 'lucide-react';

export default function ManageCourses() {
  const [courses, setCourses] = useState(mockCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({ code: '', name: '', department: 'CSE', durationYears: 4, status: 'Active' });

  useEffect(() => {
    apiService.getCourses().then(data => setCourses(data));
  }, []);

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData({ code: '', name: '', department: 'CSE', durationYears: 4, status: 'Active' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({ ...course });
    setIsModalOpen(true);
  };

  const handleDelete = (course) => {
    setCourses(prev => prev.filter(c => c.id !== course.id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCourse) {
      setCourses(prev => prev.map(c => (c.id === editingCourse.id ? { ...c, ...formData } : c)));
    } else {
      const newCrs = { ...formData, id: `crs_${Date.now()}` };
      setCourses(prev => [...prev, newCrs]);
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      header: '#',
      render: (row) => <span className="text-ink-muted font-mono">#{row.id.replace('crs_', '')}</span>
    },
    {
      header: 'Course Code',
      render: (row) => (
        <span className="font-mono font-semibold text-cobalt bg-cobalt/10 px-2 py-0.5 rounded-md border border-cobalt/20">
          {row.code}
        </span>
      )
    },
    {
      header: 'Course Name',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-ink">{row.name}</span>
          <span className="text-[10px] text-ink-muted font-mono">Department: {row.department}</span>
        </div>
      )
    },
    {
      header: 'Duration',
      render: (row) => <span className="font-mono text-ink">{row.durationYears} Years</span>
    },
    {
      header: 'Status',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-success/10 text-success border border-success/30 font-semibold">
          <CheckCircle className="w-3 h-3" />
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="command-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-ink-muted uppercase tracking-wider font-semibold">TOTAL COURSES</span>
            <h3 className="text-2xl font-serif font-bold text-ink mt-1">{courses.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cobalt/10 border border-cobalt/30 flex items-center justify-center text-cobalt">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="command-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-ink-muted uppercase tracking-wider font-semibold">DEPARTMENTS</span>
            <h3 className="text-2xl font-serif font-bold text-cobalt mt-1">4 Active</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cobalt/10 border border-cobalt/30 flex items-center justify-center text-cobalt">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="command-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-ink-muted uppercase tracking-wider font-semibold">ACADEMIC STATUS</span>
            <h3 className="text-2xl font-serif font-bold text-success mt-1">100% Operational</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/30 flex items-center justify-center text-success">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      <GrowthArc mode="divider" variant="cobalt" />

      {/* Alma Modernized Data Table */}
      <DataTable
        title="Manage Academic Courses"
        subtitle="Full course catalog management for HoD & Admin staff"
        columns={columns}
        data={courses}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        searchPlaceholder="Filter courses by code, name..."
        actions={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl btn-cobalt text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Course</span>
          </button>
        }
      />

      {/* Add / Edit Drawer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm">
          <div className="command-card w-full max-w-lg bg-surface p-6 shadow-warm-lg space-y-4 rounded-2xl border border-border">
            <h3 className="font-serif font-bold text-ink text-lg border-b border-border pb-3">
              {editingCourse ? 'Edit Course Record' : 'Register New Course'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-ink-muted mb-1">COURSE CODE</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. CSE-BS"
                  className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-xs font-mono text-ink focus:border-cobalt focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-ink-muted mb-1">COURSE NAME</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-xs text-ink focus:border-cobalt focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-ink-muted mb-1">DEPARTMENT</label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-xs text-ink focus:border-cobalt focus:outline-none"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="MECH">MECH</option>
                    <option value="MGMT">MGMT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-ink-muted mb-1">DURATION (YEARS)</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={formData.durationYears}
                    onChange={e => setFormData({ ...formData, durationYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-xs text-ink focus:border-cobalt focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs text-ink-muted hover:text-ink hover:bg-surface-warm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl btn-cobalt text-xs font-semibold"
                >
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
