import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import CommandRail from './CommandRail';
import CampusPulseBar from './CampusPulseBar';
import ThemeToggle from './ThemeToggle';
import NexusOrbCopilot from '../copilot/NexusOrbCopilot';
import { useAuth, ROLES } from '../../context/AuthContext';
import { UserCheck, LogOut, ChevronDown, ShieldAlert } from 'lucide-react';

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
    <div className="relative flex h-screen w-screen overflow-hidden bg-bg text-ink">
      {/* Alma Rail Sidebar */}
      <CommandRail />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden z-10">
        {/* Topbar Status Bar */}
        <header className="bg-surface border-b border-border z-20 flex flex-col shadow-warm-sm">
          <div className="h-16 px-6 flex items-center justify-between">
            {/* Breadcrumb Header */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-semibold text-ink-muted">ALMA / ACADEMIC</span>
              <span className="text-ink-muted">/</span>
              <h1 className="font-serif font-bold text-lg text-ink tracking-tight flex items-center gap-2">
                {getBreadcrumb()}
              </h1>
            </div>

            {/* Topbar Controls */}
            <div className="flex items-center gap-4">
              <ThemeToggle />

              {/* Demo View Role Switcher Dropdown (Explicitly labeled as Demo View Preview) */}
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  title="Preview UI perspective (REST API actions remain strictly gated by your authenticated JWT session)"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-warm border border-border hover:border-cobalt/40 text-xs font-mono text-ink transition-all"
                >
                  <UserCheck className="w-3.5 h-3.5 text-cobalt" />
                  <span className="text-[10px] text-ink-muted uppercase font-semibold">PREVIEW VIEW:</span>
                  <span className="font-semibold text-cobalt">{user?.role}</span>
                  <ChevronDown className="w-3 h-3 text-ink-muted" />
                </button>

                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 command-card bg-surface border border-border rounded-2xl shadow-warm-lg p-2.5 z-50 text-xs space-y-1.5">
                    <div className="px-2 py-1 font-mono text-[10px] text-ink-muted uppercase tracking-wider font-semibold border-b border-border">
                      Preview UI as... (Demo View Only)
                    </div>
                    <div className="px-2 py-1 text-[10px] font-mono text-ink-muted flex items-start gap-1 bg-surface-warm/80 rounded-lg border border-border">
                      <ShieldAlert className="w-3 h-3 text-cobalt flex-shrink-0 mt-0.5" />
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
                          user?.role === role ? 'bg-cobalt/10 text-cobalt font-semibold' : 'text-ink-muted hover:bg-surface-warm hover:text-ink'
                        }`}
                      >
                        <span>{role}</span>
                        {user?.role === role && <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Profile Pill */}
              <div className="flex items-center gap-3 pl-2 border-l border-border">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full border border-cobalt/30 object-cover"
                />
                <div className="hidden lg:flex flex-col">
                  <span className="text-xs font-medium text-ink leading-tight">{user?.name}</span>
                  <span className="text-[10px] text-ink-muted font-mono">{user?.email}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-1.5 rounded-lg text-ink-muted hover:text-risk hover:bg-risk/10 transition-colors"
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
        <main className="flex-1 overflow-y-auto p-6 bg-bg">
          <Outlet />
        </main>
      </div>

      {/* Docked Glowing Alma AI Copilot Orb */}
      <NexusOrbCopilot />
    </div>
  );
}
