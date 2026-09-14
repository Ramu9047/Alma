import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import CommandRail from './CommandRail';
import CampusPulseBar from './CampusPulseBar';
import ThemeToggle from './ThemeToggle';
import UserAvatar from '../common/UserAvatar';
import NexusOrbCopilot from '../copilot/NexusOrbCopilot';
import { useAuth, ROLES } from '../../context/AuthContext';
import { LogOut, ChevronDown, ShieldAlert, Sparkles } from 'lucide-react';

export default function Layout() {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const getBreadcrumb = () => {
    const path = location.pathname.substring(1);
    if (!path) return 'Predictive Risk Radar';
    const formatted = path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return formatted;
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-bg text-ink selection:bg-cobalt selection:text-white">
      {/* Ambient Background Gradient Orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-cobalt/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Alma Rail Sidebar */}
      <CommandRail />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden z-10">
        {/* Topbar Status Bar */}
        <header className="bg-surface-glass backdrop-blur-md border-b border-border z-20 flex flex-col shadow-warm-sm">
          <div className="h-16 px-6 flex items-center justify-between">
            {/* Breadcrumb Header */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-cobalt flex items-center gap-1.5 bg-cobalt/10 px-2.5 py-1 rounded-lg border border-cobalt/20">
                <Sparkles className="w-3 h-3 text-cobalt animate-pulse" />
                ALMA COMMAND
              </span>
              <span className="text-ink-muted/50 font-mono">/</span>
              <h1 className="font-serif font-bold text-lg text-ink tracking-tight flex items-center gap-2">
                {getBreadcrumb()}
              </h1>
            </div>

            {/* Topbar Controls */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle Button */}
              <ThemeToggle />

              {/* Demo View Role Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  title="Preview UI perspective (REST API actions remain strictly gated by your authenticated JWT session)"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-warm/80 border border-border hover:border-cobalt/40 text-xs font-mono text-ink-muted transition-all duration-150 shadow-sm"
                >
                  <span className="px-1.5 py-0.5 rounded bg-cobalt/15 text-cobalt font-mono text-[9px] font-bold tracking-widest border border-cobalt/30">
                    DEMO VIEW
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-ink-muted hidden md:inline">PREVIEW:</span>
                  <span className="font-semibold text-cobalt text-[11px]">{user?.role}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
                </button>

                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 alma-card bg-surface border border-border rounded-2xl shadow-2xl p-2.5 z-50 text-xs space-y-1.5">
                    <div className="px-2 py-1 font-mono text-[10px] text-ink-muted uppercase tracking-wider font-semibold border-b border-border">
                      Preview UI Perspective (Demo Mode)
                    </div>
                    <div className="px-2 py-1.5 text-[10px] font-mono text-ink-muted flex items-start gap-1.5 bg-surface-warm/80 rounded-xl border border-border">
                      <ShieldAlert className="w-3.5 h-3.5 text-cobalt flex-shrink-0 mt-0.5" />
                      <span>Non-elevating UI toggle. REST API writes remain strictly authorized by JWT authentication.</span>
                    </div>
                    {Object.values(ROLES).map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          switchRole(role);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                          user?.role === role
                            ? 'bg-cobalt/15 text-cobalt font-semibold border border-cobalt/20'
                            : 'text-ink-muted hover:bg-surface-warm hover:text-ink'
                        }`}
                      >
                        <span>{role}</span>
                        {user?.role === role && <span className="w-2 h-2 rounded-full bg-cobalt shadow-cobalt-glow" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Profile Pill */}
              <div className="flex items-center gap-3 pl-3 border-l border-border">
                <div className="relative">
                  <UserAvatar user={user} size="md" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-surface shadow-sm" />
                </div>
                <div className="hidden lg:flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-ink leading-tight truncate max-w-[180px]">{user?.name}</span>
                  <span className="text-[10px] text-ink-muted font-mono truncate max-w-[180px]">{user?.email}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-2 rounded-xl text-ink-muted hover:text-risk hover:bg-risk/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Signature Live Campus Pulse Strip */}
          <CampusPulseBar />
        </header>

        {/* Page Body Container */}
        <main className="flex-1 overflow-y-auto p-6 bg-bg/50">
          <Outlet />
        </main>
      </div>

      {/* Docked Glowing Alma AI Copilot Orb */}
      <NexusOrbCopilot />
    </div>
  );
}
