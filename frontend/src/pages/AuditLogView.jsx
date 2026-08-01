import React, { useState } from 'react';
import DataTable from '../components/common/DataTable';
import { mockAuditLogs } from '../services/api';

export default function AuditLogView() {
  const [logs] = useState(mockAuditLogs);

  const columns = [
    { header: 'Timestamp', render: (r) => <span className="font-mono text-xs text-ink-muted">{r.timestamp}</span> },
    { header: 'User', render: (r) => <span className="font-mono text-cobalt font-semibold">{r.user}</span> },
    {
      header: 'Action',
      render: (r) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
          r.action === 'CREATE' ? 'bg-success/10 text-success border-success/30' :
          r.action === 'UPDATE' ? 'bg-warning/10 text-warning border-warning/30' :
          'bg-risk/10 text-risk border-risk/30'
        }`}>
          {r.action}
        </span>
      )
    },
    { header: 'Collection', render: (r) => <span className="font-mono text-ink font-semibold">{r.collection}</span> },
    { header: 'Before State', render: (r) => <span className="font-mono text-xs text-ink-muted truncate max-w-xs">{r.beforeState}</span> },
    { header: 'After State', render: (r) => <span className="font-mono text-xs text-success font-semibold truncate max-w-xs">{r.afterState}</span> },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Security & System Audit Log"
        subtitle="Immutable transaction history recording who, when, what, before, and after state changes"
        columns={columns}
        data={logs}
      />
    </div>
  );
}
