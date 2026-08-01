import React, { useState } from 'react';
import { Building2, Clock } from 'lucide-react';
import GrowthArc from '../components/common/GrowthArc';

export default function LiveOccupancy() {
  const [rooms] = useState([
    { id: 'rm_101', name: 'CS Lab 1 (Data Structures)', building: 'Academic Block A', capacity: 40, occupied: 38, status: 'In Session', instructor: 'Dr. Sarah Jenkins' },
    { id: 'rm_102', name: 'CS Lab 2 (AI & Machine Learning)', building: 'Academic Block A', capacity: 40, occupied: 12, status: 'Open Study', instructor: 'Self Access' },
    { id: 'rm_201', name: 'Lecture Hall 201', building: 'Academic Block B', capacity: 120, occupied: 114, status: 'In Session', instructor: 'Prof. Marcus Vance' },
    { id: 'rm_304', name: 'Seminar Hall 304', building: 'Central Library', capacity: 80, occupied: 0, status: 'Vacant', instructor: 'None' },
  ]);

  return (
    <div className="space-y-6">
      <div className="command-card p-6 bg-gradient-to-r from-surface via-surface-warm to-surface border border-border space-y-2">
        <div className="flex items-center gap-2 text-cobalt">
          <Building2 className="w-5 h-5" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold">LIVE CAMPUS OCCUPANCY MONITOR</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink">Real-Time Hall & Laboratory Check-In Tracker</h2>
        <p className="text-xs text-ink-muted font-mono">Live WebSocket check-in feeds per building block</p>
      </div>

      <GrowthArc mode="divider" variant="cobalt" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map(room => (
          <div key={room.id} className="command-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div>
                <h3 className="font-serif font-bold text-ink text-base">{room.name}</h3>
                <span className="text-[10px] font-mono text-ink-muted">{room.building}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                room.status === 'In Session' ? 'bg-cobalt/10 text-cobalt border-cobalt/30' :
                room.status === 'Open Study' ? 'bg-success/10 text-success border-success/30' :
                'bg-surface-warm text-ink-muted border-border'
              }`}>
                {room.status}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-ink-muted">OCCUPANCY:</span>
                <span className="text-ink font-bold">{room.occupied} / {room.capacity}</span>
              </div>
              <div className="w-full bg-surface-warm h-2 rounded-full overflow-hidden border border-border">
                <div
                  className={`h-full ${room.occupied / room.capacity > 0.9 ? 'bg-risk' : 'bg-cobalt'}`}
                  style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] font-mono text-ink-muted flex items-center justify-between pt-1">
              <span>INSTRUCTOR: {room.instructor}</span>
              <span className="text-cobalt font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Live Check-In
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
