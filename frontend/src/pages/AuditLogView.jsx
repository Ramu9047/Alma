import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import { apiService, mockAuditLogs } from '../services/api';
import { WifiOff, Filter } from 'lucide-react';

export default function AuditLogView() {
  const [logs, setLogs] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [collectionFilter, setCollectionFilter] = useState('ALL');
  const [actorFilter, setActorFilter] = useState('');

  const loadAuditLogs = async () => {
    setLoading(true);
    const res = await apiService.getAuditLogs();
    setLogs(res.data || mockAuditLogs);
    setIsOffline(res.offline);
    setLoading(false);
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const filteredLogs = logs.filter(r => {
    const colName = r.collectionName || r.collection || '';
    const actorName = r.actorUsername || r.user || '';
    const matchesCol = collectionFilter === 'ALL' || colName.toLowerCase() === collectionFilter.toLowerCase();
    const matchesActor = !actorFilter.trim() || actorName.toLowerCase().includes(actorFilter.toLowerCase());
    return matchesCol && matchesActor;
  });

  const columns = [
    { header: 'Timestamp', render: (r) => <span className="font-mono text-xs text-ink-muted">{r.timestamp ? new Date(r.timestamp).toLocaleString() : '—'}</span> },
    { header: 'Actor', render: (r) => <span className="font-mono text-cobalt font-semibold">{r.actorUsername || r.user || 'system'}</span> },
    { header: 'Role', render: (r) => <span className="font-mono text-[10px] bg-cobalt/10 text-cobalt px-2 py-0.5 rounded border border-cobalt/20">{r.actorRole || 'SYSTEM'}</span> },
    {
      header: 'Action',
      render: (r) => {
        const act = r.action || '';
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
            act.includes('CREATE') || act.includes('APPROVED') ? 'bg-success/10 text-success border-success/30' :
            act.includes('UPDATE') || act.includes('REPLIED') ? 'bg-warning/10 text-warning border-warning/30' :
            'bg-risk/10 text-risk border-risk/30'
          }`}>
            {act}
          </span>
        );
      }
    },
    { header: 'Collection', render: (r) => <span className="font-mono text-ink font-semibold">{r.collectionName || r.collection || '—'}</span> },
    { header: 'Record ID', render: (r) => <span className="font-mono text-xs text-ink-muted">{r.recordId || '—'}</span> }
  ];

  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-3 bg-warning/10 border border-warning/30 text-warning text-xs font-mono rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Backend offline — displaying cached demo audit logs · DEMO MODE</span>
          </div>
          <span className="px-2 py-0.5 bg-warning/20 rounded text-[10px] font-bold">DEMO MODE</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="command-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-ink-muted">
          <Filter className="w-4 h-4 text-cobalt" />
          <span className="font-semibold text-ink">Audit Log Filters:</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div>
            <label className="text-[10px] text-ink-muted mr-2">COLLECTION:</label>
            <select
              value={collectionFilter}
              onChange={e => setCollectionFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-surface-warm border border-border rounded-xl text-ink font-semibold focus:border-cobalt focus:outline-none"
            >
              <option value="ALL">All Collections</option>
              <option value="leaves">Leaves</option>
              <option value="students">Students</option>
              <option value="staff">Staff</option>
              <option value="fees">Fees</option>
              <option value="attendance">Attendance</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-ink-muted mr-2">ACTOR:</label>
            <input
              type="text"
              placeholder="Search username..."
              value={actorFilter}
              onChange={e => setActorFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-surface-warm border border-border rounded-xl text-ink focus:border-cobalt focus:outline-none w-36"
            />
          </div>
        </div>
      </div>

      <DataTable
        title="Security & System Audit Log"
        subtitle={loading ? "Loading audit transaction log..." : `Immutable transaction history (${filteredLogs.length} matching events)`}
        columns={columns}
        data={filteredLogs}
      />
    </div>
  );
}
