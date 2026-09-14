import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, AlertTriangle, KeyRound, GraduationCap, ArrowRight, Sparkles, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import ThemeToggle from '../components/layout/ThemeToggle';

export default function Login() {
  const navigate = useNavigate();
  const { login, isRateLimited, completeFirstLoginPasswordChange } = useAuth();
  const [username, setUsername] = useState('admin_hod');
  const [password, setPassword] = useState('hod123');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [isFirstLoginStep, setIsFirstLoginStep] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const loggedInUser = await login(username, password);
      if (loggedInUser.isFirstLogin) {
        setIsFirstLoginStep(true);
      } else {
        navigate('/risk-radar');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    }
  };

  const handlePasswordResetSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    completeFirstLoginPasswordChange(newPassword);
    navigate('/risk-radar');
  };

  const setQuickCreds = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-bg p-4 relative overflow-hidden selection:bg-cobalt selection:text-white">
      {/* Background Animated Ambient Mesh */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cobalt/20 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gold/15 blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      {/* Theme Toggle Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="command-card glow-card-indigo w-full max-w-md bg-surface-glass backdrop-blur-xl p-8 shadow-warm-lg space-y-6 relative border border-border rounded-3xl z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-cobalt-deep via-cobalt to-indigo-500 flex items-center justify-center text-white font-bold shadow-cobalt-glow mx-auto mb-2">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cobalt/10 text-cobalt text-[10px] font-mono font-bold tracking-widest border border-cobalt/20">
            <Sparkles className="w-3 h-3 text-cobalt" /> ACADEMIC COMMAND PLATFORM
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-ink">Alma</h1>
          <p className="text-xs font-sans text-ink-muted leading-relaxed">
            Predictive institutional intelligence & modern academic management.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-risk/10 border border-risk/40 text-risk text-xs font-mono rounded-2xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isRateLimited && (
          <div className="p-3.5 bg-warning/10 border border-warning/40 text-warning text-xs font-mono rounded-2xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Authentication Rate Limited. Please wait 60s.</span>
          </div>
        )}

        {/* Forced Password Reset Step for First Login */}
        {isFirstLoginStep ? (
          <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
            <div className="p-3.5 bg-cobalt/10 border border-cobalt/30 text-cobalt text-xs font-mono rounded-2xl flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              <span>First Login Security Mandate: Change your default password.</span>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-ink-muted mb-1.5 uppercase">NEW SECURE PASSWORD</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password..."
                  className="w-full pl-4 pr-10 py-3 bg-surface-warm/80 border border-border rounded-xl text-xs font-mono text-ink focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-ink-muted hover:text-ink transition-colors p-0.5"
                  title={showNewPassword ? "Hide password" : "Reveal password"}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl btn-cobalt text-xs font-semibold flex items-center justify-center gap-2"
            >
              <span>Update Password & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-ink-muted mb-1.5 uppercase">USERNAME / EMAIL</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-ink-muted" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username..."
                  className="w-full pl-10 pr-4 py-3 bg-surface-warm/80 border border-border rounded-xl text-xs font-mono text-ink focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-ink-muted mb-1.5 uppercase">PASSWORD</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-ink-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-surface-warm/80 border border-border rounded-xl text-xs font-mono text-ink focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-ink-muted hover:text-ink transition-colors p-0.5"
                  title={showPassword ? "Hide password" : "Reveal password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Preset Credentials helper pills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-ink-muted uppercase">DEMO PRESETS:</span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setQuickCreds('super_admin', 'super123')}
                  className="px-2.5 py-1 rounded-lg bg-surface-warm hover:bg-cobalt/15 hover:text-cobalt border border-border transition-colors text-ink-muted font-medium flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3 text-gold" />
                  Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => setQuickCreds('admin_hod', 'hod123')}
                  className="px-2.5 py-1 rounded-lg bg-surface-warm hover:bg-cobalt/15 hover:text-cobalt border border-border transition-colors text-ink-muted font-medium"
                >
                  HoD Admin
                </button>
                <button
                  type="button"
                  onClick={() => setQuickCreds('staff_001', 'staff123')}
                  className="px-2.5 py-1 rounded-lg bg-surface-warm hover:bg-cobalt/15 hover:text-cobalt border border-border transition-colors text-ink-muted font-medium"
                >
                  Faculty
                </button>
                <button
                  type="button"
                  onClick={() => setQuickCreds('student_001', 'student123')}
                  className="px-2.5 py-1 rounded-lg bg-surface-warm hover:bg-cobalt/15 hover:text-cobalt border border-border transition-colors text-ink-muted font-medium"
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setQuickCreds('parent_001', 'parent123')}
                  className="px-2.5 py-1 rounded-lg bg-surface-warm hover:bg-cobalt/15 hover:text-cobalt border border-border transition-colors text-ink-muted font-medium"
                >
                  Parent
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isRateLimited}
              className="w-full py-3 rounded-xl btn-cobalt text-xs font-semibold flex items-center justify-center gap-2 mt-2"
            >
              <span>Sign In to Academic Command</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center border-t border-border/50">
              <p className="text-[11px] text-ink-muted font-sans">
                Need an account? New student, faculty, and staff profiles are provisioned directly by your <span className="font-semibold text-ink">Super Admin / HoD Office</span>.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
