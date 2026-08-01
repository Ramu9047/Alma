import React, { useState } from 'react';
import DataTable from '../components/common/DataTable';
import { mockStaff } from '../services/api';
import { UserPlus } from 'lucide-react';

export default function ManageStaff() {
  const [staffList, setStaffList] = useState(mockStaff);

  const columns = [
    { header: 'Emp ID', render: (row) => <span className="font-mono text-cobalt font-semibold">{row.empId}</span> },
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
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.subjects.map((sub, i) => (
            <span key={i} className="text-[10px] font-mono px-2 py-0.5 bg-surface-warm border border-border rounded-md text-ink">
              {sub}
            </span>
          ))}
        </div>
      )
    }
  ];

  return (
    <DataTable
      title="Faculty & Staff Registry"
      subtitle="Departmental faculty allocation and subject assignments"
      columns={columns}
      data={staffList}
      onEdit={(staff) => alert(`Editing staff: ${staff.name}`)}
      onDelete={(staff) => setStaffList(prev => prev.filter(s => s.id !== staff.id))}
      actions={
        <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl btn-cobalt text-xs font-semibold">
          <UserPlus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      }
    />
  );
}
