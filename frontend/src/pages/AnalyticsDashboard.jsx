import React, { useState, useEffect } from 'react';
import { TrendingUp, Download, PieChart as PieIcon, Lock, WifiOff, Activity, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import GrowthArc from '../components/common/GrowthArc';
import { useAuth, ROLES } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/api';

const DEFAULT_ADMIN_KPIS = [
  { label: 'AVERAGE ATTENDANCE', value: '92.4%', delta: '↑ +2.1% from last term', deltaColor: 'text-success', valueColor: 'text-cobalt' },
  { label: 'PASS RATE',          value: '95.0%', delta: 'High Academic Standard',  deltaColor: 'text-success', valueColor: 'text-success' },
  { label: 'FEE RECOVERY',       value: '78.5%', delta: '₹1.4M pending',           deltaColor: 'text-ink-muted', valueColor: 'text-warning' },
  { label: 'ACTIVE STUDENTS',    value: '1,240', delta: '5 Departments',           deltaColor: 'text-ink-muted', valueColor: 'text-ink' },
];

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
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
    { name: 'Distinction (>85%)',    value: 45, color: '#10B981' },
    { name: 'First Class (70-85%)',  value: 38, color: '#4F46E5' },
    { name: 'Second Class (50-70%)', value: 12, color: '#F59E0B' },
    { name: 'Needs Support (<50%)',  value: 5,  color: '#EF4444' },
  ];

  const TOOLTIP_STYLE = {
    backgroundColor: 'var(--surface)',
    borderColor: 'var(--border-color)',
    borderRadius: '14px',
    fontSize: '12px',
    color: 'var(--ink)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    padding: '10px 14px'
  };

  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-3.5 bg-warning/10 border border-warning/30 text-warning text-xs font-mono rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Backend offline — displaying cached demo analytics dataset</span>
          </div>
          <span className="px-2.5 py-0.5 bg-warning/20 rounded-full text-[10px] font-bold">DEMO MODE</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="command-card glow-card-indigo p-6 space-y-3 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cobalt">
              <Activity className="w-4 h-4" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">EXECUTIVE INTELLIGENCE</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink">
              {isRestricted ? 'My Academic Progress Analytics' : 'Institutional Analytics Dashboard'}
            </h2>
            <p className="text-xs text-ink-muted font-sans">
              {isRestricted ? `Viewing personal standing for ${user?.name}` : 'Executive academic metrics & data intelligence engine — all departments'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isRestricted ? (
              <button
                onClick={() => toast.info('Generating & compiling executive PDF report for download...', 'Institutional Report Generator')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-warm border border-border text-ink text-xs font-mono hover:text-cobalt hover:border-cobalt/40 transition-all font-semibold shadow-sm"
              >
                <Download className="w-4 h-4" /> Export PDF Report
              </button>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-warm border border-border text-ink-muted text-xs font-mono">
                <Lock className="w-3.5 h-3.5" /> Scoped Student View
              </span>
            )}
            
            <div className="hidden lg:block w-36 h-14 flex-shrink-0">
              <GrowthArc mode="banner" variant="cobalt" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="command-card p-5 space-y-2 hover:border-cobalt/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-ink-muted uppercase font-bold tracking-wider">{kpi.label}</span>
              <Sparkles className="w-3.5 h-3.5 text-cobalt/40" />
            </div>
            <h3 className={`text-3xl font-serif font-bold ${kpi.valueColor}`}>{kpi.value}</h3>
            <span className={`text-[11px] font-mono font-semibold block ${kpi.deltaColor}`}>{kpi.delta}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="command-card p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cobalt" />
            <span>Weekly Attendance Trend</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" stroke="var(--ink-muted)" fontSize={11} />
                <YAxis stroke="var(--ink-muted)" fontSize={11} domain={[60, 100]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="attendance" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="command-card p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-gold" />
            <span>Grade Distribution</span>
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gradeDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={45} paddingAngle={4} label>
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
