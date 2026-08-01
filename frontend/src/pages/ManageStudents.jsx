import React, { useState } from 'react';
import DataTable from '../components/common/DataTable';
import { mockStudents } from '../services/api';
import { UserPlus } from 'lucide-react';

export default function ManageStudents() {
  const [students, setStudents] = useState(mockStudents);

  const columns = [
    {
      header: 'Roll Number',
      render: (row) => <span className="font-mono text-cobalt font-semibold">{row.rollNumber}</span>
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
      render: (row) => <span className="font-mono text-xs">{row.course} ({row.session})</span>
    },
    {
      header: 'Attendance %',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-surface-warm h-1.5 rounded-full overflow-hidden border border-border">
            <div
              className={`h-full ${row.attendancePct < 75 ? 'bg-risk' : 'bg-success'}`}
              style={{ width: `${row.attendancePct}%` }}
            />
          </div>
          <span className={`font-mono text-xs ${row.attendancePct < 75 ? 'text-risk font-bold' : 'text-ink'}`}>
            {row.attendancePct}%
          </span>
        </div>
      )
    },
    {
      header: 'Fee Status',
      render: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${
          row.feeStatus === 'Paid' ? 'bg-success/10 text-success border-success/30' :
          row.feeStatus === 'Pending' ? 'bg-warning/10 text-warning border-warning/30' :
          'bg-risk/10 text-risk border-risk/30'
        }`}>
          {row.feeStatus}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Student Registry & Enrolment"
        subtitle="Manage student profiles, academic progress, and status"
        columns={columns}
        data={students}
        onEdit={(student) => alert(`Editing student: ${student.name}`)}
        onDelete={(student) => setStudents(prev => prev.filter(s => s.id !== student.id))}
        actions={
          <button
            onClick={() => alert("Open Enrolment Form")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl btn-cobalt text-xs font-semibold"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enrol Student</span>
          </button>
        }
      />
    </div>
  );
}
