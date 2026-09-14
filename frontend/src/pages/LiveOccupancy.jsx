import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Clock, ChevronRight, Users, BookOpen, CheckCircle2, XCircle, PieChart, Activity } from 'lucide-react';
import GrowthArc from '../components/common/GrowthArc';
import StatusPill from '../components/common/StatusPill';

export default function LiveOccupancy() {
  const navigate = useNavigate();
  const [rooms] = useState([
    { id: 'rm_101', name: 'CS Lab 1 (Data Structures)', building: 'Academic Block A', capacity: 40, occupied: 38, status: 'In Session', instructor: 'Dr. Sarah Jenkins' },
    { id: 'rm_102', name: 'CS Lab 2 (AI & Machine Learning)', building: 'Academic Block A', capacity: 40, occupied: 12, status: 'Open Study', instructor: 'Self Access' },
    { id: 'rm_201', name: 'Lecture Hall 201', building: 'Academic Block B', capacity: 120, occupied: 114, status: 'In Session', instructor: 'Prof. Marcus Vance' },
    { id: 'rm_304', name: 'Seminar Hall 304', building: 'Central Library', capacity: 80, occupied: 0, status: 'Vacant', instructor: 'None' },
  ]);

  // Aggregate Metrics
  const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const totalOccupied = rooms.reduce((acc, r) => acc + r.occupied, 0);
  const overallPct = Math.round((totalOccupied / totalCapacity) * 100);
  const inSessionCount = rooms.filter(r => r.status === 'In Session').length;
  const openStudyCount = rooms.filter(r => r.status === 'Open Study').length;
  const vacantCount = rooms.filter(r => r.status === 'Vacant').length;

  return (
    <div className="space-y-6">
      {/* Header Banner with Anchored GrowthArc */}
      <div className="command-card p-6 bg-gradient-to-r from-surface via-surface-warm to-surface border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="flex items-center gap-2 text-cobalt">
            <Building2 className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold">CAMPUS ROOM CAPACITY DIRECTORY</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-ink">Campus Hall & Laboratory Directory</h2>
          <p className="text-xs text-ink-muted font-mono">Live room capacity tracking & schedule reference · Campus spatial analysis</p>
        </div>
        <div className="w-44 h-16 opacity-75 shrink-0 z-10 hidden sm:block">
          <GrowthArc mode="banner" variant="cobalt" />
        </div>
      </div>

      {/* Building-Level Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="command-card p-4 border border-border space-y-1">
          <div className="flex items-center justify-between text-ink-muted text-xs font-mono">
            <span>TOTAL UTILIZATION</span>
            <PieChart className="w-4 h-4 text-cobalt" />
          </div>
          <div className="font-serif text-xl font-bold text-ink">
            {totalOccupied} <span className="text-xs font-mono font-normal text-ink-muted">/ {totalCapacity}</span>
          </div>
          <div className="text-[10px] font-mono text-cobalt font-semibold">{overallPct}% Average Occupancy</div>
        </div>

        <div className="command-card p-4 border border-border space-y-1">
          <div className="flex items-center justify-between text-ink-muted text-xs font-mono">
            <span>IN SESSION</span>
            <BookOpen className="w-4 h-4 text-cobalt" />
          </div>
          <div className="font-serif text-xl font-bold text-ink">{inSessionCount} <span className="text-xs font-mono font-normal text-ink-muted">Halls</span></div>
          <div className="text-[10px] font-mono text-ink-muted">Active classes running</div>
        </div>

        <div className="command-card p-4 border border-border space-y-1">
          <div className="flex items-center justify-between text-ink-muted text-xs font-mono">
            <span>OPEN STUDY</span>
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
          <div className="font-serif text-xl font-bold text-ink">{openStudyCount} <span className="text-xs font-mono font-normal text-ink-muted">Labs</span></div>
          <div className="text-[10px] font-mono text-success font-semibold">Available for self-access</div>
        </div>

        <div className="command-card p-4 border border-border space-y-1">
          <div className="flex items-center justify-between text-ink-muted text-xs font-mono">
            <span>VACANT HALLS</span>
            <XCircle className="w-4 h-4 text-ink-muted" />
          </div>
          <div className="font-serif text-xl font-bold text-ink">{vacantCount} <span className="text-xs font-mono font-normal text-ink-muted">Rooms</span></div>
          <div className="text-[10px] font-mono text-ink-muted">Unbooked / Available</div>
        </div>
      </div>

      {/* Directory Controls & Legend */}
      <div className="command-card p-4 bg-surface-warm/40 border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cobalt" />
          <span className="font-bold text-ink uppercase tracking-wider text-[11px]">Directory Legend & Scale</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-ink-muted">
          {/* Status Swatches */}
          <div className="flex items-center gap-3 border-r border-border pr-4">
            <span className="text-[10px] text-ink font-semibold">Status:</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cobalt" />
              <span>In Session</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span>Open Study</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-ink-muted/50" />
              <span>Vacant</span>
            </div>
          </div>

          {/* Utilization Scale Swatches */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-ink font-semibold">Capacity Scale:</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-surface-warm border border-border" />
              <span>0% Vacant</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-cobalt/60" />
              <span>1–39% Light</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-cobalt" />
              <span>40–89% Active</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-cobalt" />
              <span className="text-[9px] font-bold text-cobalt bg-cobalt/10 px-1 rounded border border-cobalt/20">AT CAPACITY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map(room => {
          const pct = Math.round((room.occupied / room.capacity) * 100);
          
          // Card border escalation based on status
          const cardAccent =
            room.status === 'In Session' ? 'border-l-4 border-l-cobalt' :
            room.status === 'Open Study' ? 'border-l-4 border-l-success' :
            'border-l-4 border-l-border';

          // Capacity bar color scale & badge
          let barBgClass = 'bg-cobalt';
          let badge = null;

          if (pct > 100) {
            barBgClass = 'bg-risk';
            badge = <span className="text-[9px] font-mono font-bold text-risk bg-risk/10 px-1.5 py-0.5 rounded border border-risk/20">OVER CAPACITY</span>;
          } else if (pct >= 90) {
            barBgClass = 'bg-cobalt';
            badge = <span className="text-[9px] font-mono font-bold text-cobalt bg-cobalt/10 px-1.5 py-0.5 rounded border border-cobalt/20">AT CAPACITY</span>;
          } else if (pct >= 40) {
            barBgClass = 'bg-cobalt';
            badge = <span className="text-[9px] font-mono font-medium text-cobalt bg-cobalt/10 px-1.5 py-0.5 rounded border border-cobalt/20">ACTIVE</span>;
          } else if (pct > 0) {
            barBgClass = 'bg-cobalt/60';
            badge = <span className="text-[9px] font-mono font-medium text-ink-muted bg-surface-warm px-1.5 py-0.5 rounded border border-border">LIGHT USE</span>;
          } else {
            barBgClass = 'bg-surface-warm';
            badge = <span className="text-[9px] font-mono font-medium text-ink-muted bg-surface-warm px-1.5 py-0.5 rounded border border-border">VACANT</span>;
          }

          return (
            <div
              key={room.id}
              className={`command-card p-5 space-y-4 hover:border-cobalt/40 transition-all duration-200 ${cardAccent}`}
            >
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div>
                  <h3 className="font-serif font-bold text-ink text-base">{room.name}</h3>
                  <span className="text-[10px] font-mono text-ink-muted">{room.building}</span>
                </div>
                <StatusPill category="occupancy" status={room.status} size="xs" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-ink-muted">CAPACITY REFERENCE:</span>
                  <div className="flex items-center gap-2">
                    {badge}
                    <span className="text-ink font-bold">{room.occupied} / {room.capacity}</span>
                  </div>
                </div>
                <div className="w-full bg-surface-warm h-2 rounded-full overflow-hidden border border-border">
                  <div
                    className={`h-full transition-all duration-300 ${barBgClass}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] font-mono text-ink-muted flex items-center justify-between pt-1 border-t border-border/60">
                <span className="truncate max-w-[200px]">INSTRUCTOR: {room.instructor}</span>
                
                {/* Resolved Timetable Quick Action */}
                <button
                  onClick={() => navigate('/timetable')}
                  className="text-cobalt hover:text-cobalt-dark font-semibold flex items-center gap-1 text-[10px] font-mono group transition-colors px-2 py-1 rounded hover:bg-cobalt/5 border border-transparent hover:border-cobalt/20"
                  title="View schedule in Timetable Matrix"
                >
                  <Clock className="w-3 h-3 text-cobalt group-hover:scale-110 transition-transform" />
                  <span>View Timetable</span>
                  <ChevronRight className="w-3 h-3 text-cobalt/60 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

