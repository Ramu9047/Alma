import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, ShieldAlert, Zap, Bell, Lock } from 'lucide-react';
import { usePulse } from '../context/PulseContext';
import { useAuth, ROLES } from '../context/AuthContext';
import GrowthArc from '../components/common/GrowthArc';

export default function RiskRadar() {
  const { pushPulseAlert } = usePulse();
  const { user } = useAuth();
  const role = user?.role;

  const [atRiskStudents] = useState([
    {
      id: 'std_005',
      name: 'Vikram Singh',
      rollNumber: 'ME2024-003',
      course: 'MECH-BS',
      dropoutRiskScore: 85,
      feeDefaultRiskScore: 90,
      status: 'CRITICAL',
      factors: [
        { label: 'Attendance Deficit (<65%)', weight: '40%', value: '62% Attendance' },
        { label: 'Overdue Fee Notice', weight: '30%', value: '₹68,000 Overdue (36 Days)' },
        { label: 'Midterm Marks Dip', weight: '20%', value: 'Grade: F in Thermodynamics' },
        { label: 'Unexcused Absences', weight: '10%', value: '5 Consecutive Days' }
      ]
    },
    {
      id: 'std_003',
      name: 'Ananya Patel',
      rollNumber: 'EC2024-015',
      course: 'ECE-BS',
      dropoutRiskScore: 72,
      feeDefaultRiskScore: 45,
      status: 'WARNING',
      factors: [
        { label: 'Attendance Threshold Warning', weight: '50%', value: '74% Attendance' },
        { label: 'Partial Fee Payment', weight: '30%', value: '₹35,000 Outstanding' },
        { label: 'Grade Trend Neutral', weight: '20%', value: 'Grade: B' }
      ]
    },
    {
      id: 'std_002',
      name: 'Alex Rivera',
      rollNumber: 'CS2024-042',
      course: 'CSE-BS',
      dropoutRiskScore: 28,
      feeDefaultRiskScore: 10,
      status: 'STABLE',
      factors: [
        { label: 'Strong Attendance Record', weight: '60%', value: '88% Attendance' },
        { label: 'Fee Account Settled', weight: '40%', value: 'Fully Paid' }
      ]
    }
  ]);

  // Role-scoped: Student and Parent see only their child's record
  const STUDENT_ID = 'std_002'; // Alex Rivera — matches the logged-in student demo
  const visibleStudents = (role === ROLES.STUDENT || role === ROLES.PARENT)
    ? atRiskStudents.filter(s => s.id === STUDENT_ID)
    : atRiskStudents;

  const canTriggerAlert = (role === ROLES.SUPER_ADMIN || role === ROLES.HOD_ADMIN || role === ROLES.STAFF);

  const handleTriggerAdvisorAlert = (student) => {
    pushPulseAlert(`HIGH RISK ALERT DISPATCHED: HoD Notification sent for ${student.name} (Risk Score: ${student.dropoutRiskScore}/100)`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Overview */}
      <div className="command-card p-6 bg-gradient-to-r from-surface via-surface-warm to-surface border border-border space-y-2">
        <div className="flex items-center gap-2 text-warning">
          <ShieldAlert className="w-5 h-5" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold">PREDICTIVE INTELLIGENCE & RISK RADAR</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-ink">
          {(role === ROLES.STUDENT || role === ROLES.PARENT)
            ? 'My Academic Risk Summary'
            : 'Student Retention & Fee Default Analytics'}
        </h2>
        <p className="text-xs text-ink-muted font-mono">
          {(role === ROLES.STUDENT || role === ROLES.PARENT)
            ? `Showing your personal academic standing — institution-wide risk data is restricted to Admin/HoD.`
            : 'Nightly rule-based composite scoring engine (Attendance + Results + Fee Ledgers + Leave Frequency)'}
        </p>
      </div>

      {/* Signature Growth Arc Divider */}
      <GrowthArc mode="divider" variant="cobalt" />

      {/* High-Level Risk Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="command-card p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">CRITICAL AT-RISK STUDENTS</span>
            <h3 className="text-2xl font-serif font-bold text-risk mt-1">1 Student</h3>
            <span className="text-[10px] font-mono text-risk font-semibold">Score &gt; 80 / 100</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-risk/10 border border-risk/30 flex items-center justify-center text-risk">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="command-card p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">EVALUATED METRICS</span>
            <h3 className="text-2xl font-serif font-bold text-cobalt mt-1">4 Rule Vectors</h3>
            <span className="text-[10px] font-mono text-ink-muted">Transparent Factor Model</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cobalt/10 border border-cobalt/30 flex items-center justify-center text-cobalt">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="command-card p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">RECALCULATION CYCLE</span>
            <h3 className="text-2xl font-serif font-bold text-success mt-1">Spring @Scheduled</h3>
            <span className="text-[10px] font-mono text-ink-muted">Nightly 00:00 Cron</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/30 flex items-center justify-center text-success">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Restricted notice for Student/Parent */}
      {(role === ROLES.STUDENT || role === ROLES.PARENT) && (
        <div className="command-card p-4 flex items-center gap-3 border-cobalt/20 bg-cobalt/5">
          <Lock className="w-4 h-4 text-cobalt flex-shrink-0" />
          <p className="text-xs text-ink-muted font-mono">
            Only your own academic risk profile is shown. Institution-wide student risk data is restricted to Admin/HoD/Staff roles.
          </p>
        </div>
      )}

      {/* Risk List Feed */}
      <div className="space-y-4">
        {visibleStudents.map(student => (
          <div key={student.id} className="command-card p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-4">
                {/* Growth Arc Trajectory Gauge Display */}
                <div className="flex flex-col items-center justify-center px-3 py-2 rounded-xl bg-surface-warm border border-border">
                  <GrowthArc
                    mode="gauge"
                    score={student.dropoutRiskScore}
                    size={64}
                    variant={student.dropoutRiskScore >= 80 ? "risk" : student.dropoutRiskScore >= 50 ? "gold" : "success"}
                  />
                  <span className={`font-mono text-xs font-bold mt-1 ${
                    student.dropoutRiskScore >= 80 ? 'text-risk' : student.dropoutRiskScore >= 50 ? 'text-gold' : 'text-success'
                  }`}>
                    {student.dropoutRiskScore} / 100 RISK
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-ink text-lg">{student.name}</h3>
                  <span className="text-xs font-mono text-ink-muted">{student.rollNumber} | Course: {student.course}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {canTriggerAlert && student.dropoutRiskScore >= 70 && (
                  <button
                    onClick={() => handleTriggerAdvisorAlert(student)}
                    className="px-3 py-2 rounded-xl bg-risk/10 border border-risk/30 text-risk font-mono text-xs font-semibold hover:bg-risk hover:text-white transition-all flex items-center gap-1.5 shadow-warm-sm"
                  >
                    <Bell className="w-3.5 h-3.5" /> Trigger HoD Alert
                  </button>
                )}
              </div>
            </div>

            {/* Transparent Factor Breakdown */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider font-semibold">
                TRANSPARENT RISK FACTOR DECOMPOSITION:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {student.factors.map((factor, idx) => (
                  <div key={idx} className="p-3 bg-surface-warm/80 border border-border rounded-xl space-y-1 font-mono text-xs">
                    <div className="flex justify-between text-[10px] text-ink-muted">
                      <span>{factor.label}</span>
                      <span className="text-cobalt font-semibold">{factor.weight}</span>
                    </div>
                    <p className="font-semibold text-ink">{factor.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
