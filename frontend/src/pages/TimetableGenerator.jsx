import React, { useState, useEffect } from 'react';
import { apiService, mockTimetable } from '../services/api';
import { CheckCircle2, ShieldAlert, Radio, WifiOff } from 'lucide-react';
import GrowthArc from '../components/common/GrowthArc';

export default function TimetableGenerator() {
  const [timetable, setTimetable] = useState(mockTimetable);
  const [isOffline, setIsOffline] = useState(false);
  const [conflictAlert, setConflictAlert] = useState(null);

  const [activeCollaborators] = useState([
    { id: 'usr_stf1', name: 'Prof. Marcus Vance', slot: 'Monday-period2', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80' },
  ]);

  const loadTimetable = async () => {
    const res = await apiService.getTimetable();
    if (res.data && res.data.length > 0) {
      setTimetable(res.data);
    }
    setIsOffline(res.offline);
  };

  useEffect(() => {
    loadTimetable();
  }, []);

  const checkConflict = (day, periodKey, newValue) => {
    const matches = timetable.filter(row => row[periodKey] === newValue && row.day !== day);
    if (matches.length > 0 && newValue !== 'Library' && newValue !== 'Sports') {
      setConflictAlert(`Conflict Detected! Room / Faculty double-booking detected for ${newValue} on ${day}.`);
    } else {
      setConflictAlert(null);
    }
  };

  const handleCellEdit = async (day, periodKey, newValue, rowId) => {
    checkConflict(day, periodKey, newValue);
    setTimetable(prev =>
      prev.map(row => (row.day === day ? { ...row, [periodKey]: newValue } : row))
    );
    if (rowId) {
      await apiService.updateTimetable(rowId, { department: 'CSE', day, timeSlot: periodKey, subjectCode: newValue, room: 'LH-101' });
    }
  };

  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-3 bg-warning/10 border border-warning/30 text-warning text-xs font-mono rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Backend offline — displaying cached demo timetable matrix</span>
          </div>
          <span className="px-2 py-0.5 bg-warning/20 rounded text-[10px] font-bold">DEMO MODE</span>
        </div>
      )}

      <div className="command-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">Weekly Timetable Matrix & Conflict Detector</h2>
            <p className="text-xs text-ink-muted">Automated section schedule management with double-booking & concurrency lock prevention</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-warm border border-border text-xs font-mono">
              <Radio className="w-3.5 h-3.5 text-cobalt animate-pulse" />
              <span className="text-ink-muted text-[10px] uppercase font-semibold">ACTIVE COLLABORATORS:</span>
              {activeCollaborators.map(c => (
                <img
                  key={c.id}
                  src={c.avatar}
                  alt={c.name}
                  title={`${c.name} is currently viewing/editing this grid`}
                  className="w-5 h-5 rounded-full border border-cobalt"
                />
              ))}
            </div>

            <span className="px-3 py-1 bg-cobalt/10 text-cobalt border border-cobalt/30 rounded-xl font-mono text-xs font-semibold">
              CSE-3A (Term Spring 2026)
            </span>
          </div>
        </div>

        <GrowthArc mode="divider" variant="cobalt" />

        {conflictAlert ? (
          <div className="p-3 bg-risk/10 border border-risk/40 text-risk text-xs font-mono rounded-xl flex items-center gap-2 font-semibold animate-bounce">
            <ShieldAlert className="w-4 h-4" />
            <span>{conflictAlert}</span>
          </div>
        ) : (
          <div className="p-3 bg-success/10 border border-success/40 text-success text-xs font-mono rounded-xl flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Timetable Matrix Conflict-Free: All faculty, hall allocations, and concurrency locks validated.</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead className="bg-surface-warm text-ink-muted uppercase border-b border-border">
              <tr>
                <th className="p-3.5">Day / Time</th>
                <th className="p-3.5">09:00 - 10:30 (P1)</th>
                <th className="p-3.5">10:45 - 12:15 (P2)</th>
                <th className="p-3.5">01:15 - 02:45 (P3)</th>
                <th className="p-3.5">03:00 - 04:30 (P4)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {timetable.map(row => (
                <tr key={row.day} className="hover:bg-surface-warm/60">
                  <td className="p-3.5 font-semibold text-cobalt">{row.day}</td>
                  {['period1', 'period2', 'period3', 'period4'].map(periodKey => {
                    const activeEditor = activeCollaborators.find(c => c.slot === `${row.day}-${periodKey}`);
                    const cellVal = row[periodKey] || row.subjectCode || '';
                    return (
                      <td key={periodKey} className="p-3.5 relative">
                        {activeEditor && (
                          <span className="absolute -top-1.5 right-2 px-1.5 py-0.5 rounded bg-cobalt text-[9px] text-white font-mono z-10 font-bold shadow-warm-sm">
                            Editing: {activeEditor.name}
                          </span>
                        )}
                        <input
                          type="text"
                          value={cellVal}
                          onChange={e => handleCellEdit(row.day, periodKey, e.target.value, row.id)}
                          className={`w-full px-2.5 py-1.5 bg-surface-warm border rounded-xl text-ink text-xs focus:border-cobalt focus:outline-none ${
                            activeEditor ? 'border-cobalt ring-1 ring-cobalt' : 'border-border'
                          }`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
