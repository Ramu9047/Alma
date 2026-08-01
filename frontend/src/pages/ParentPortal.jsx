import React from 'react';
import { Shield, Award, ClipboardCheck, DollarSign } from 'lucide-react';
import { mockStudents } from '../services/api';
import GrowthArc from '../components/common/GrowthArc';

export default function ParentPortal() {
  const student = mockStudents[1]; // Alex Rivera

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="command-card p-6 bg-gradient-to-r from-surface via-surface-warm to-surface border border-border space-y-2">
        <div className="flex items-center gap-2 text-cobalt">
          <Shield className="w-5 h-5" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold">ALMA PARENT PORTAL (READ-ONLY LINKED VIEW)</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink">Linked Student: {student.name}</h2>
        <p className="text-xs text-ink-muted font-mono">Roll No: {student.rollNumber} | Course: {student.course} | Term: Spring 2026</p>
      </div>

      <GrowthArc mode="divider" variant="gold" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="command-card p-5 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
            <span className="font-semibold">ATTENDANCE RECORD</span>
            <ClipboardCheck className="w-4 h-4 text-success" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-success">{student.attendancePct}%</h3>
          <span className="text-[10px] font-mono text-ink-muted">Good Academic Standing</span>
        </div>

        <div className="command-card p-5 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
            <span className="font-semibold">FEE STATUS</span>
            <DollarSign className="w-4 h-4 text-success" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-ink">PAID</h3>
          <span className="text-[10px] font-mono text-ink-muted">Receipt ALMA-REC-7712 Verified</span>
        </div>

        <div className="command-card p-5 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
            <span className="font-semibold">GPA CUMULATIVE</span>
            <Award className="w-4 h-4 text-gold" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-gold">9.2 / 10</h3>
          <span className="text-[10px] font-mono text-ink-muted">Top 5% of Batch</span>
        </div>
      </div>
    </div>
  );
}
