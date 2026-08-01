import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  BookOpen, GraduationCap, Users, Calendar, ClipboardCheck, Award,
  FileText, MessageSquare, DollarSign, Clock, Bell, BarChart3,
  FileBadge, Shield, History, ChevronLeft, ChevronRight,
  ShieldAlert, Building2
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';

// ── Role-based nav visibility ──────────────────────────────────────────────
// Each nav item can have an `allowedRoles` array.
// If absent → visible to all authenticated users.
// If present → only shown when user.role is in the list.
const ADMIN_ROLES  = [ROLES.SUPER_ADMIN, ROLES.HOD_ADMIN];
const STAFF_UP     = [ROLES.SUPER_ADMIN, ROLES.HOD_ADMIN, ROLES.STAFF];
const STUDENT_ONLY = [ROLES.STUDENT];
const PARENT_ONLY  = [ROLES.PARENT];
const ADMIN_PARENT = [ROLES.SUPER_ADMIN, ROLES.HOD_ADMIN, ROLES.PARENT];

const NAV_SECTIONS = [
  {
    title: 'ACADEMIC INTELLIGENCE',
    items: [
      { name: 'Predictive Risk Radar',  path: '/risk-radar',  icon: ShieldAlert, badge: 'RISK RADAR', allowedRoles: STAFF_UP },
      { name: 'Live Room Occupancy',    path: '/occupancy',   icon: Building2 },
      { name: 'Analytics Dashboard',   path: '/analytics',   icon: BarChart3,   allowedRoles: STAFF_UP },
    ]
  },
  {
    title: 'ACADEMIC MANAGEMENT',
    items: [
      { name: 'Manage Courses',        path: '/courses',     icon: BookOpen,        allowedRoles: ADMIN_ROLES },
      { name: 'Subjects Catalog',      path: '/subjects',    icon: GraduationCap,   allowedRoles: STAFF_UP },
      { name: 'Academic Sessions',     path: '/sessions',    icon: Calendar,        allowedRoles: ADMIN_ROLES },
      { name: 'Daily Attendance',      path: '/attendance',  icon: ClipboardCheck,  allowedRoles: STAFF_UP },
      { name: 'Results & Transcripts', path: '/results',     icon: Award },
      { name: 'Timetable Matrix',      path: '/timetable',   icon: Clock,           allowedRoles: STAFF_UP },
    ]
  },
  {
    title: 'USER & FINANCE',
    items: [
      { name: 'Student Registry',  path: '/students',      icon: Users,       allowedRoles: ADMIN_ROLES },
      { name: 'Faculty & Staff',   path: '/staff',         icon: GraduationCap, allowedRoles: ADMIN_ROLES },
      { name: 'Leave Workflow',    path: '/leaves',        icon: FileText,    allowedRoles: STAFF_UP },
      { name: 'Fee & Finance',     path: '/fees',          icon: DollarSign,  allowedRoles: ADMIN_ROLES },
      { name: 'My Fee Account',    path: '/fees',          icon: DollarSign,  allowedRoles: STUDENT_ONLY },
      { name: 'Fee Statement',     path: '/fees',          icon: DollarSign,  allowedRoles: PARENT_ONLY },
      { name: 'Parent Portal',     path: '/parent-portal', icon: Shield,      allowedRoles: ADMIN_PARENT },
    ]
  },
  {
    title: 'COMMUNICATION & DOCS',
    items: [
      { name: 'Feedback Hub',       path: '/feedback',      icon: MessageSquare },
      { name: 'Live Pulse Stream',  path: '/notifications', icon: Bell },
      { name: 'Document Hub',       path: '/documents',     icon: FileBadge },
      { name: 'Security Audit Log', path: '/audit-log',     icon: History,     allowedRoles: ADMIN_ROLES },
    ]
  }
];

export default function CommandRail() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const role = user?.role;

  const isVisible = (item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(role);
  };

  return (
    <aside
      className={`alma-rail transition-all duration-300 flex flex-col z-30 bg-surface border-r border-border ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-cobalt flex items-center justify-center text-white font-bold shadow-warm-sm flex-shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-serif font-bold tracking-tight text-ink text-base leading-tight">Alma</span>
              <span className="text-[10px] font-sans text-ink-muted font-medium tracking-wide">Academic Command Center</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-warm transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {NAV_SECTIONS.map((section, idx) => {
          const visibleItems = section.items.filter(isVisible);
          if (visibleItems.length === 0) return null;
          return (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <h3 className="px-3 text-[10px] font-mono font-semibold text-ink-muted uppercase tracking-wider mb-2 select-none">
                  {section.title}
                </h3>
              )}
              {visibleItems.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path + item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                        isActive
                          ? 'text-cobalt font-medium bg-surface-warm border-l-4 border-cobalt'
                          : 'text-ink-muted hover:text-ink hover:bg-surface-warm/60'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3 truncate">
                          <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-cobalt' : 'text-ink-muted group-hover:text-ink'}`} />
                          {!collapsed && <span className="truncate">{item.name}</span>}
                        </div>
                        {!collapsed && item.badge && (
                          <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer Role Details */}
      {!collapsed && (
        <div className="p-3 border-t border-border text-xs font-mono text-ink-muted">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase">VIEWING AS:</span>
            <span className="text-cobalt font-semibold text-[11px] truncate">{role}</span>
          </div>
          {(role === ROLES.STUDENT || role === ROLES.PARENT) && (
            <p className="text-[10px] text-ink-muted/70 mt-0.5">Demo View Only</p>
          )}
        </div>
      )}
    </aside>
  );
}
