import React, { useState, useEffect } from 'react';
import { TrendingUp, Download, PieChart as PieIcon, Lock, WifiOff } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import GrowthArc from '../components/common/GrowthArc';
import { useAuth, ROLES } from '../context/AuthContext';
import { apiService } from '../services/api';

const DEFAULT_ADMIN_KPIS = [
  { label: 'AVERAGE ATTENDANCE', value: '92.4%', delta: '↑ +2.1% from last term', deltaColor: 'text-success', valueColor: 'text-cobalt' },
  { label: 'PASS RATE',          value: '95.0%', delta: 'High Academic Standard',  deltaColor: 'text-success', valueColor: 'text-success' },
  { label: 'FEE RECOVERY',       value: '78.5%', delta: '₹1.4M pending',           deltaColor: 'text-ink-muted', valueColor: 'text-warning' },
  { label: 'ACTIVE STUDENTS',    value: '1,240', delta: '5 Departments',           deltaColor: 'text-ink-muted', valueColor: 'text-ink' },
];

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const role = user?.role;
  const isRestricted = (role === ROLES.STUDENT || role === ROLES.PARENT);

  const [analytics, setAnalytics] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    async function loadAnalytics() {
      const res = await apiService.getAnalytics();
      if (res.data) {
        setAnalytics(res.data);
      }
      setIsOffline(res.offline);
    }
    loadAnalytics();
  }, []);

  const kpis = analytics ? [
    { label: 'AVERAGE ATTENDANCE', value: `${analytics.avgAttendance}%`, delta: 'Calculated from MongoDB', deltaColor: 'text-success', valueColor: 'text-cobalt' },
    { label: 'PASS RATE',          value: `${analytics.passRate}%`, delta: 'Zero Backlogs Ratio', deltaColor: 'text-success', valueColor: 'text-success' },
    { label: 'FEE RECOVERY',       value: `${analytics.feeRecovery}%`, delta: `₹${(analytics.totalFeeOutstanding / 1000).toFixed(1)}k pending`, deltaColor: 'text-ink-muted', valueColor: 'text-warning' },
    { label: 'ACTIVE STUDENTS',    value: `${analytics.totalStudents}`, delta: `${analytics.atRiskCount} At-Risk`, deltaColor: 'text-risk', valueColor: 'text-ink' },
  ] : DEFAULT_ADMIN_KPIS;

  const attendanceTrend = [
    { week: 'W1', attendance: 89 }, { week: 'W2', attendance: 91 },
    { week: 'W3', attendance: 94 }, { week: 'W4', attendance: 88 },
    { week: 'W5', attendance: 92 }, { week: 'W6', attendance: Math.round(analytics?.avgAttendance || 92) },
  ];

  const gradeDist = [
    { name: 'Distinction (>85%)',    value: 45, color: '#2F9E63' },
    { name: 'First Class (70-85%)',  value: 38, color: '#2450C4' },
    { name: 'Second Class (50-70%)', value: 12, color: '#D4A017' },
    { name: 'Needs Support (<50%)',  value: 5,  color: '#D64545' },
  ];

  const TOOLTIP_STYLE = {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(36,80,196,0.15)',
    borderRadius: '12px',
    fontSize: '12px',
    color: '#1B2430'
  };

  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-3 bg-warning/10 border border-warning/30 text-warning text-xs font-mono rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Backend offline — displaying cached demo analytics dataset</span>
          </div>
          <span className="px-2 py-0.5 bg-warning/20 rounded text-[10px] font-bold">DEMO MODE</span>
        </div>
      )}

      {/* Top Banner Header with GrowthArc moved away from KPI grid per Item 13 */}
      <div className="command-card p-5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">
              {isRestricted ? 'My Academic Progress Analytics' : 'Institutional Analytics Dashboard'}
            </h2>
            <p className="text-xs text-ink-muted">
              {isRestricted ? `Viewing personal standing for ${user?.name}` : 'Executive academic metrics & data intelligence engine — all departments'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isRestricted ? (
              <>
                <button onClick={() => alert('Exporting PDF...')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-warm border border-border text-ink text-xs font-mono hover:text-cobalt transition-all font-semibold">
                  <Download className="w-3.5 h-3.5" /> Export PDF
                </button>
              </>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-warm border border-border text-ink-muted text-xs font-mono">
                <Lock className="w-3 h-3" /> Scoped Student View
              </span>
            )}
          </div>
        </div>

        {/* GrowthArc header placement */}
        <GrowthArc mode="divider" variant="cobalt" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="command-card p-5">
            <span className="text-[10px] font-mono text-ink-muted uppercase font-semibold">{kpi.label}</span>
            <h3 className={`text-2xl font-serif font-bold mt-1 ${kpi.valueColor}`}>{kpi.value}</h3>
            <span className={`text-[10px] font-mono font-semibold ${kpi.deltaColor}`}>{kpi.delta}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="command-card p-6 space-y-4">
          <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cobalt" />
            <span>Weekly Attendance Trend</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend}>
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

        <div className="command-card p-6 space-y-4">
          <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-gold" />
            <span>Grade Distribution</span>
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gradeDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>
                  {gradeDist.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
