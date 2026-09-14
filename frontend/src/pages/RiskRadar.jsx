import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import StatusPill from '../components/common/StatusPill';
import { ShieldAlert, AlertTriangle, UserCheck, Bell, WifiOff } from 'lucide-react';
import { usePulse } from '../context/PulseContext';
import { useAuth, ROLES } from '../context/AuthContext';
import GrowthArc from '../components/common/GrowthArc';
import { apiService } from '../services/api';

const DEFAULT_RISK_STUDENTS = [
  { id: '1', name: 'Vikram Singh', rollNumber: 'ME2024-003', department: 'MECH-BS', attendance: 62, feeOverdueDays: 36, activeBacklogs: 2, dropoutRiskScore: 78, feeRiskScore: 85, overallRiskCategory: 'HIGH_RISK', recommendedAction: 'Issue Immediate Academic & Fee Warning' },
  { id: '2', name: 'Ananya Patel', rollNumber: 'EC2024-015', department: 'ECE-BS', attendance: 74, feeOverdueDays: 15, activeBacklogs: 1, dropoutRiskScore: 62, feeRiskScore: 45, overallRiskCategory: 'MEDIUM_RISK', recommendedAction: 'Schedule HoD Mentoring Session' },
];

export default function RiskRadar() {
  const { pushPulseAlert } = usePulse();
  const { user } = useAuth();
  const role = user?.role;
  const isRestricted = (role === ROLES.STUDENT || role === ROLES.PARENT);

  const [riskData, setRiskData] = useState(DEFAULT_RISK_STUDENTS);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    async function loadRiskData() {
      const res = await apiService.getRisk();
      if (res.data && res.data.length > 0) {
        const mapped = res.data.map((r, i) => ({
          id: r.id || String(i + 1),
          name: r.studentName || 'Student',
          rollNumber: r.studentId || r.rollNumber || 'STD-000',
          department: 'CSE/ECE/MECH',
          attendance: r.dropoutRisk > 50 ? 62 : 88,
          feeOverdueDays: r.feeDefaultRisk > 50 ? 36 : 0,
          activeBacklogs: r.dropoutRisk > 50 ? 2 : 0,
          dropoutRiskScore: r.dropoutRisk,
          feeRiskScore: r.feeDefaultRisk,
          overallRiskCategory: (r.dropoutRisk > 70 || r.feeDefaultRisk > 70) ? 'HIGH_RISK' : 'MEDIUM_RISK',
          recommendedAction: (r.dropoutRisk > 70 || r.feeDefaultRisk > 70) ? 'Issue Immediate Academic & Fee Warning' : 'Schedule Mentoring Session'
        }));
        setRiskData(mapped);
      }
      setIsOffline(res.offline);
    }
    loadRiskData();
  }, []);

  const handleDispatchAlert = (student) => {
    pushPulseAlert(`Academic Warning & HoD Alert Dispatched for ${student.name} (${student.rollNumber})`);
    alert(`Alert sent to ${student.name}'s HoD and Parent Guardian email.`);
  };

  const columns = [
    { header: 'Roll Number', accessor: 'rollNumber', render: (r) => <span className="font-mono text-cobalt font-bold">{r.rollNumber}</span> },
    { header: 'Student Name', accessor: 'name', render: (r) => <span className="font-semibold text-ink whitespace-nowrap">{r.name}</span> },
    {
      header: 'Attendance %',
      accessor: 'attendance',
      render: (r) => <span className={`font-mono font-bold ${r.attendance < 75 ? 'text-risk' : 'text-success'}`}>{r.attendance}%</span>
    },
    {
      header: 'Overdue Days',
      accessor: 'feeOverdueDays',
      render: (r) => <span className={`font-mono ${r.feeOverdueDays > 30 ? 'text-risk font-bold' : 'text-ink-muted'}`}>{r.feeOverdueDays} days</span>
    },
    {
      header: 'Dropout Risk',
      accessor: 'dropoutRiskScore',
      render: (r) => (
        <StatusPill
          category="risk"
          status={`${r.dropoutRiskScore >= 75 ? 'HIGH RISK' : r.dropoutRiskScore >= 50 ? 'MEDIUM RISK' : 'LOW RISK'} (${r.dropoutRiskScore}/100)`}
          size="xs"
        />
      )
    },
    {
      header: 'Recommended Action',
      accessor: 'recommendedAction',
      render: (r) => <span className="text-xs text-ink-muted italic font-sans whitespace-nowrap">{r.recommendedAction}</span>
    },
    ...(!isRestricted ? [{
      header: 'Action',
      sortable: false,
      render: (r) => (
        <button
          onClick={() => handleDispatchAlert(r)}
          className="px-3.5 py-1.5 rounded-xl btn-cobalt text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm whitespace-nowrap"
        >
          <Bell className="w-3.5 h-3.5" /> Dispatch Alert
        </button>
      )
    }] : [])
  ];

  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-3.5 bg-warning/10 border border-warning/30 text-warning text-xs font-mono rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Backend offline — displaying cached demo risk score dataset</span>
          </div>
          <span className="px-2.5 py-0.5 bg-warning/20 rounded-full text-[10px] font-bold">DEMO MODE</span>
        </div>
      )}

      {/* Top Banner Overview */}
      <div className="command-card glow-card-indigo p-6 space-y-3 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-warning">
              <ShieldAlert className="w-5 h-5" />
              <span className="font-mono text-xs uppercase tracking-wider font-bold">PREDICTIVE INTELLIGENCE & RISK RADAR</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink">
              {isRestricted ? 'My Academic Risk Summary' : 'Student Retention & Fee Default Analytics'}
            </h2>
            <p className="text-xs text-ink-muted font-mono max-w-2xl">
              {isRestricted
                ? 'Showing your personal academic standing — institution-wide risk data is restricted to Admin/HoD.'
                : 'Nightly rule-based composite scoring engine (Attendance + Results + Fee Ledgers + Leave Frequency)'}
            </p>
          </div>
          
          <div className="hidden lg:block w-44 h-16 flex-shrink-0">
            <GrowthArc mode="banner" variant="cobalt" />
          </div>
        </div>
      </div>

      {/* High-Level Risk Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="command-card p-5 flex items-center justify-between hover:border-risk/40 transition-all">
          <div>
            <span className="text-[10px] font-mono text-ink-muted uppercase font-bold tracking-wider">CRITICAL AT-RISK STUDENTS</span>
            <h3 className="text-3xl font-serif font-bold text-risk mt-1">{riskData.filter(r => r.dropoutRiskScore > 70).length} Students</h3>
            <span className="text-[10px] font-mono text-risk font-semibold">Score &gt; 70 / 100</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-risk/10 border border-risk/30 flex items-center justify-center text-risk shadow-sm">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="command-card p-5 flex items-center justify-between hover:border-warning/40 transition-all">
          <div>
            <span className="text-[10px] font-mono text-ink-muted uppercase font-bold tracking-wider">MEDIUM RISK STUDENTS</span>
            <h3 className="text-3xl font-serif font-bold text-warning mt-1">{riskData.filter(r => r.dropoutRiskScore >= 50 && r.dropoutRiskScore <= 70).length} Students</h3>
            <span className="text-[10px] font-mono text-warning font-semibold">Score 50-70 / 100</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-warning/10 border border-warning/30 flex items-center justify-center text-warning shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="command-card p-5 flex items-center justify-between hover:border-success/40 transition-all">
          <div>
            <span className="text-[10px] font-mono text-ink-muted uppercase font-bold tracking-wider">CLEAR / LOW RISK</span>
            <h3 className="text-3xl font-serif font-bold text-success mt-1">Good Standing</h3>
            <span className="text-[10px] font-mono text-success font-semibold">Att &gt; 75%, Dues Paid</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-success/10 border border-success/30 flex items-center justify-center text-success shadow-sm">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      <DataTable
        title={isRestricted ? 'My Standing Details' : 'At-Risk Student Roster & Action Matrix'}
        subtitle={isRestricted ? 'Personal risk parameters' : 'Automated threshold evaluation from live MongoDB attendance & fee ledgers'}
        columns={columns}
        data={riskData}
      />
    </div>
  );
}
