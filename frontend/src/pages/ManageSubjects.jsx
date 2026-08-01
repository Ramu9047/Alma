import React, { useState } from 'react';
import DataTable from '../components/common/DataTable';
import { mockSubjects, mockSessions } from '../services/api';
import { Plus } from 'lucide-react';

export function ManageSubjects() {
  const [subjects, setSubjects] = useState(mockSubjects);

  const columns = [
    { header: 'Subject Code', render: (r) => <span className="font-mono text-cobalt font-semibold">{r.code}</span> },
    { header: 'Subject Title', render: (r) => <span className="font-medium text-ink">{r.name}</span> },
    { header: 'Course', render: (r) => <span className="font-mono text-ink">{r.course}</span> },
    { header: 'Credits', render: (r) => <span className="font-mono text-ink-muted">{r.credits} Credits</span> },
    { header: 'Assigned Faculty', render: (r) => <span className="text-ink-muted">{r.staffAssigned}</span> },
  ];

  return (
    <DataTable
      title="Academic Subjects Catalog"
      subtitle="Curriculum subjects, credit weightage, and faculty lead mapping"
      columns={columns}
      data={subjects}
      onEdit={() => {}}
      onDelete={(item) => setSubjects(s => s.filter(x => x.id !== item.id))}
      actions={
        <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl btn-cobalt text-xs font-semibold">
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      }
    />
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
      render: (r) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${r.status === 'Active' ? 'bg-success/10 text-success border border-success/30' : 'bg-surface-warm text-ink-muted border border-border'}`}>
          {r.status}
        </span>
      )
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
