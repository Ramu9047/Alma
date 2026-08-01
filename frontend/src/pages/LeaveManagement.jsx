import React, { useState } from 'react';
import DataTable from '../components/common/DataTable';
import { mockLeaves } from '../services/api';
import { usePulse } from '../context/PulseContext';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function LeaveManagement() {
  const { pushPulseAlert } = usePulse();
  const [leaves, setLeaves] = useState(mockLeaves);

  const handleUpdateStatus = (id, newStatus) => {
    setLeaves(prev =>
      prev.map(l => (l.id === id ? { ...l, status: newStatus } : l))
    );
    pushPulseAlert(`Leave request ${id} updated to ${newStatus}`);
  };

  const columns = [
    { header: 'Applicant', render: (r) => <span className="font-medium text-ink">{r.applicantName} ({r.applicantRole})</span> },
    { header: 'Leave Type', render: (r) => <span className="font-mono text-cobalt font-semibold">{r.type}</span> },
    { header: 'Duration', render: (r) => <span className="font-mono text-xs text-ink-muted">{r.startDate} to {r.endDate}</span> },
    { header: 'Reason', render: (r) => <span className="text-ink-muted text-xs">{r.reason}</span> },
    {
      header: 'Decision Status',
      render: (r) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${
          r.status === 'Approved' ? 'bg-success/10 text-success border-success/30' :
          r.status === 'Rejected' ? 'bg-risk/10 text-risk border-risk/30' :
          'bg-warning/10 text-warning border-warning/30'
        }`}>
          {r.status}
        </span>
      )
    },
    {
      header: 'Workflow Action',
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.status === 'Pending' && (
            <>
              <button
                onClick={() => handleUpdateStatus(r.id, 'Approved')}
                className="px-2.5 py-1 rounded-xl bg-success/10 text-success border border-success/30 hover:bg-success hover:text-white transition-all text-xs font-mono font-semibold flex items-center gap-1"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Approve
              </button>
              <button
                onClick={() => handleUpdateStatus(r.id, 'Rejected')}
                className="px-2.5 py-1 rounded-xl bg-risk/10 text-risk border border-risk/30 hover:bg-risk hover:text-white transition-all text-xs font-mono font-semibold flex items-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="command-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-ink-muted uppercase font-semibold">PENDING APPROVALS</span>
            <h3 className="text-2xl font-serif font-bold text-warning mt-1">
              {leaves.filter(l => l.status === 'Pending').length} Requests
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-warning/10 border border-warning/30 flex items-center justify-center text-warning">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      <DataTable
        title="Leave Applications & Approval Workflow"
        subtitle="Departmental leave management with balance tracking and decision alerts"
        columns={columns}
        data={leaves}
      />
    </div>
  );
}
