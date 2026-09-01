import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import GrowthArc from '../components/common/GrowthArc';
import StatusPill from '../components/common/StatusPill';
import { apiService, mockCourses } from '../services/api';
import { Plus, BookOpen, Layers, CheckCircle, WifiOff } from 'lucide-react';

export default function ManageCourses() {
  const [courses, setCourses] = useState(mockCourses);
  const [isOffline, setIsOffline] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({ code: '', name: '', department: 'CSE', durationYears: 4, status: 'Active' });

  const loadCourses = async () => {
    const res = await apiService.getCourses();
    if (res.data && res.data.length > 0) setCourses(res.data);
    setIsOffline(res.offline);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData({ code: '', name: '', department: 'CSE', durationYears: 4, status: 'Active' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      code: course.courseCode || course.code || '',
      name: course.name || '',
      department: course.department || 'CSE',
      durationYears: course.duration || course.durationYears || 4,
      status: course.status || 'Active'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete course ${course.name || course.courseCode}?`)) return;
    await apiService.deleteCourse(course.id || course.courseCode);
    loadCourses();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      courseCode: formData.code,
      name: formData.name,
      department: formData.department,
      durationYears: Number(formData.durationYears),
      status: formData.status || 'Active'
    };

    if (editingCourse) {
      await apiService.updateCourse(editingCourse.id || editingCourse.courseCode, payload);
    } else {
      await apiService.createCourse(payload);
    }
    setIsModalOpen(false);
    loadCourses();
  };

  const columns = [
    {
      header: 'Course Code',
      render: (row) => (
        <span className="font-mono font-semibold text-cobalt bg-cobalt/10 px-2 py-0.5 rounded-md border border-cobalt/20">
          {row.courseCode || row.code}
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
      render: (row) => <span className="font-mono text-ink">{row.duration || row.durationYears || 4} Years</span>
    },
    {
      header: 'Status',
      render: (row) => <StatusPill category="course" status={row.status || 'Active'} />
    }
  ];

  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-3 bg-warning/10 border border-warning/30 text-warning text-xs font-mono rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Backend offline — displaying cached demo course catalog</span>
          </div>
          <span className="px-2 py-0.5 bg-warning/20 rounded text-[10px] font-bold">DEMO MODE</span>
        </div>
      )}

      {/* Top Banner Overview with GrowthArc inside header away from KPI card grid */}
      <div className="command-card p-6 bg-gradient-to-r from-surface via-surface-warm to-surface border border-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-cobalt font-semibold">CURRICULUM MANAGEMENT</span>
            <h2 className="font-serif text-2xl font-bold text-ink mt-0.5">Course Catalog & Academic Offerings</h2>
          </div>
        </div>
        <GrowthArc mode="divider" variant="cobalt" />
      </div>

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
