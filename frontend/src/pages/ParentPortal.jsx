import React, { useState, useEffect } from 'react';
import { Shield, Award, ClipboardCheck, DollarSign, WifiOff } from 'lucide-react';
import { apiService, mockStudents } from '../services/api';
import GrowthArc from '../components/common/GrowthArc';

export default function ParentPortal() {
  const [student, setStudent] = useState(mockStudents[1]);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    async function loadChild() {
      const res = await apiService.getParentChild();
      if (res.data) {
        setStudent({
          ...res.data,
          rollNumber: res.data.studentId || res.data.rollNumber || 'CS2024-042',
          attendancePct: res.data.attendancePercent ?? res.data.attendancePct ?? 88
        });
      }
      setIsOffline(res.offline);
    }
    loadChild();
  }, []);

  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-3 bg-warning/10 border border-warning/30 text-warning text-xs font-mono rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Backend offline — displaying cached demo parent portal view · DEMO MODE</span>
          </div>
          <span className="px-2 py-0.5 bg-warning/20 rounded text-[10px] font-bold">DEMO MODE</span>
        </div>
      )}

      {/* Banner */}
      <div className="command-card p-6 bg-gradient-to-r from-surface via-surface-warm to-surface border border-border space-y-4">
        <div>
          <div className="flex items-center gap-2 text-cobalt">
            <Shield className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold">ALMA PARENT PORTAL (READ-ONLY LINKED VIEW)</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-ink mt-1">Linked Student: {student.name}</h2>
          <p className="text-xs text-ink-muted font-mono mt-0.5">Roll No: {student.rollNumber || student.studentId} | Course: {student.course} | Term: Spring 2026</p>
        </div>
        <GrowthArc mode="divider" variant="gold" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="command-card p-5 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
            <span className="font-semibold">ATTENDANCE RECORD</span>
            <ClipboardCheck className="w-4 h-4 text-success" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-success">{student.attendancePct ?? student.attendancePercent ?? 88}%</h3>
          <span className="text-[10px] font-mono text-ink-muted">Good Academic Standing</span>
        </div>

        <div className="command-card p-5 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
            <span className="font-semibold">FEE STATUS</span>
            <DollarSign className="w-4 h-4 text-success" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-ink">{(student.feeStatus || 'PAID').toUpperCase()}</h3>
          <span className="text-[10px] font-mono text-ink-muted">Account Verified</span>
        </div>

        <div className="command-card p-5 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
            <span className="font-semibold">GPA CUMULATIVE</span>
            <Award className="w-4 h-4 text-gold" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-gold">{student.gpa ?? 3.6} / 4.0</h3>
          <span className="text-[10px] font-mono text-ink-muted">Top Standing in Batch</span>
        </div>
      </div>
    </div>
  );
}
