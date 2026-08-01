import React from 'react';
import { TrendingUp, Download, PieChart as PieIcon, Lock } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import GrowthArc from '../components/common/GrowthArc';
import { useAuth, ROLES } from '../context/AuthContext';

// ── Role-scoped data sets ─────────────────────────────────────────────────────

const ADMIN_DATA = {
  title: 'Institutional Analytics Dashboard',
  subtitle: 'Executive academic metrics & data intelligence engine — all departments',
  kpis: [
    { label: 'AVERAGE ATTENDANCE', value: '92.4%', delta: '↑ +2.1% from last term', deltaColor: 'text-success', valueColor: 'text-cobalt' },
    { label: 'PASS RATE',          value: '95.0%', delta: 'High Academic Standard',  deltaColor: 'text-success', valueColor: 'text-success' },
    { label: 'FEE RECOVERY',       value: '78.5%', delta: '₹1.4M pending',           deltaColor: 'text-ink-muted', valueColor: 'text-warning' },
    { label: 'ACTIVE STUDENTS',    value: '1,240', delta: '5 Departments',           deltaColor: 'text-ink-muted', valueColor: 'text-ink' },
  ],
  attendanceTrend: [
    { week: 'W1', attendance: 89 }, { week: 'W2', attendance: 91 },
    { week: 'W3', attendance: 94 }, { week: 'W4', attendance: 88 },
    { week: 'W5', attendance: 92 }, { week: 'W6', attendance: 95 },
  ],
  gradeDist: [
    { name: 'Distinction (>85%)',    value: 45, color: '#2F9E63' },
    { name: 'First Class (70-85%)',  value: 38, color: '#2450C4' },
    { name: 'Second Class (50-70%)', value: 12, color: '#D4A017' },
    { name: 'Needs Support (<50%)',  value: 5,  color: '#D64545' },
  ],
  chartTitle: 'Weekly Attendance Trend — All Departments',
  pieTitle: 'Grade Distribution — All Departments',
  showExport: true,
};

const STAFF_DATA = {
  title: 'My Courses — Analytics Overview',
  subtitle: 'CS2024 & EC2024 sections you are assigned to — this term',
  kpis: [
    { label: 'CSE SECTION AVG ATT.',  value: '88.7%', delta: '↓ -1.2% from last week', deltaColor: 'text-risk',    valueColor: 'text-cobalt' },
    { label: 'ECE SECTION AVG ATT.',  value: '91.2%', delta: '↑ +0.8% from last week', deltaColor: 'text-success', valueColor: 'text-cobalt' },
    { label: 'PASS RATE (MY CLASSES)',value: '93.5%', delta: 'Within target',           deltaColor: 'text-success', valueColor: 'text-success' },
    { label: 'AT-RISK STUDENTS',      value: '3',     delta: 'Needs follow-up',         deltaColor: 'text-risk',    valueColor: 'text-risk' },
  ],
  attendanceTrend: [
    { week: 'W1', attendance: 85 }, { week: 'W2', attendance: 87 },
    { week: 'W3', attendance: 91 }, { week: 'W4', attendance: 84 },
    { week: 'W5', attendance: 89 }, { week: 'W6', attendance: 88 },
  ],
  gradeDist: [
    { name: 'A (>85%)',  value: 32, color: '#2F9E63' },
    { name: 'B (70-85%)',value: 41, color: '#2450C4' },
    { name: 'C (50-70%)',value: 20, color: '#D4A017' },
    { name: 'D (<50%)',  value: 7,  color: '#D64545' },
  ],
  chartTitle: 'Weekly Attendance — My Assigned Sections',
  pieTitle: 'Grade Distribution — My Sections',
  showExport: true,
};

const STUDENT_DATA = {
  title: 'My Academic Progress',
  subtitle: 'Alex Rivera (CS2024-042) — B.Tech Computer Science & Engineering',
  kpis: [
    { label: 'MY ATTENDANCE',  value: '88.0%', delta: '↑ Above 75% threshold',      deltaColor: 'text-success', valueColor: 'text-cobalt' },
    { label: 'MY GPA',         value: '3.6 / 4.0', delta: 'First Class standing',   deltaColor: 'text-success', valueColor: 'text-success' },
    { label: 'FEE STATUS',     value: 'Paid',  delta: 'No outstanding balance',      deltaColor: 'text-success', valueColor: 'text-success' },
    { label: 'ACTIVE BACKLOGS',value: '0',     delta: 'All subjects cleared',        deltaColor: 'text-success', valueColor: 'text-ink' },
  ],
  attendanceTrend: [
    { week: 'W1', attendance: 80 }, { week: 'W2', attendance: 85 },
    { week: 'W3', attendance: 90 }, { week: 'W4', attendance: 88 },
    { week: 'W5', attendance: 92 }, { week: 'W6', attendance: 88 },
  ],
  gradeDist: [
    { name: 'Data Structures',    value: 91, color: '#2F9E63' },
    { name: 'OS Fundamentals',    value: 84, color: '#2450C4' },
    { name: 'Computer Networks',  value: 78, color: '#D4A017' },
    { name: 'DBMS',               value: 88, color: '#2450C4' },
  ],
  chartTitle: 'My Weekly Attendance — This Semester',
  pieTitle: 'My Subject-wise Scores',
  showExport: false,
};

const PARENT_DATA = {
  title: "Alex's Academic Summary",
  subtitle: 'Alex Rivera (CS2024-042) — Viewing as: Elena Rivera (Parent)',
  kpis: [
    { label: "ALEX'S ATTENDANCE", value: '88.0%', delta: 'Good standing (>75%)',      deltaColor: 'text-success', valueColor: 'text-cobalt' },
    { label: 'CURRENT GPA',       value: '3.6 / 4.0', delta: 'First Class',          deltaColor: 'text-success', valueColor: 'text-success' },
    { label: 'FEE STATUS',        value: 'Cleared', delta: 'No pending dues',         deltaColor: 'text-success', valueColor: 'text-success' },
    { label: 'NEXT EXAM IN',      value: '12 days', delta: 'Semester End Exams',      deltaColor: 'text-ink-muted', valueColor: 'text-ink' },
  ],
  attendanceTrend: [
    { week: 'W1', attendance: 80 }, { week: 'W2', attendance: 85 },
    { week: 'W3', attendance: 90 }, { week: 'W4', attendance: 88 },
    { week: 'W5', attendance: 92 }, { week: 'W6', attendance: 88 },
  ],
  gradeDist: [
    { name: 'Data Structures',    value: 91, color: '#2F9E63' },
    { name: 'OS Fundamentals',    value: 84, color: '#2450C4' },
    { name: 'Computer Networks',  value: 78, color: '#D4A017' },
    { name: 'DBMS',               value: 88, color: '#2450C4' },
  ],
  chartTitle: "Alex's Weekly Attendance",
  pieTitle: "Alex's Subject-wise Scores",
  showExport: false,
};

function getRoleData(role) {
  switch (role) {
    case ROLES.SUPER_ADMIN:
    case ROLES.HOD_ADMIN:
      return ADMIN_DATA;
    case ROLES.STAFF:
      return STAFF_DATA;
    case ROLES.STUDENT:
      return STUDENT_DATA;
    case ROLES.PARENT:
      return PARENT_DATA;
    default:
      return ADMIN_DATA;
  }
}

const TOOLTIP_STYLE = {
  backgroundColor: '#FFFFFF',
  borderColor: 'rgba(36,80,196,0.15)',
  borderRadius: '12px',
  fontSize: '12px',
  color: '#1B2430'
};

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const data = getRoleData(user?.role);

  const exportReport = (format) => {
    alert(`Exporting ${data.title} as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="command-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-ink">{data.title}</h2>
          <p className="text-xs text-ink-muted">{data.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {data.showExport ? (
            <>
              <button onClick={() => exportReport('pdf')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-warm border border-border text-ink text-xs font-mono hover:text-cobalt transition-all font-semibold">
                <Download className="w-3.5 h-3.5" /> Export PDF
              </button>
              <button onClick={() => exportReport('excel')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-warm border border-border text-ink text-xs font-mono hover:text-cobalt transition-all font-semibold">
                <Download className="w-3.5 h-3.5" /> Export Excel
              </button>
            </>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-warm border border-border text-ink-muted text-xs font-mono">
              <Lock className="w-3 h-3" /> Export restricted to Admin/Staff
            </span>
          )}
        </div>
      </div>

      <GrowthArc mode="divider" variant="cobalt" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {data.kpis.map((kpi, i) => (
          <div key={i} className="command-card p-5">
            <span className="text-[10px] font-mono text-ink-muted uppercase font-semibold">{kpi.label}</span>
            <h3 className={`text-2xl font-serif font-bold mt-1 ${kpi.valueColor}`}>{kpi.value}</h3>
            <span className={`text-[10px] font-mono font-semibold ${kpi.deltaColor}`}>{kpi.delta}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="command-card p-6 space-y-4">
          <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cobalt" />
            <span>{data.chartTitle}</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.attendanceTrend}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2450C4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2450C4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" stroke="#6B7280" fontSize={10} />
                <YAxis stroke="#6B7280" fontSize={10} domain={[60, 100]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="attendance" stroke="#2450C4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAtt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade / Score Distribution */}
        <div className="command-card p-6 space-y-4">
          <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-gold" />
            <span>{data.pieTitle}</span>
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.gradeDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>
                  {data.gradeDist.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-1">
            {data.gradeDist.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Restricted data notice for non-admin roles */}
      {(user?.role === ROLES.STUDENT || user?.role === ROLES.PARENT) && (
        <div className="command-card p-4 flex items-center gap-3 border-cobalt/20 bg-cobalt/5">
          <Lock className="w-4 h-4 text-cobalt flex-shrink-0" />
          <p className="text-xs text-ink-muted font-mono">
            Institution-wide metrics (fee recovery totals, aggregate enrollment) are restricted to Admin/HoD roles.
            This view shows data scoped to the student record.
          </p>
        </div>
      )}
    </div>
  );
}
