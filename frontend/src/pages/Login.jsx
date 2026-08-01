import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, AlertTriangle, KeyRound, GraduationCap } from 'lucide-react';
import ThemeToggle from '../components/layout/ThemeToggle';

export default function Login() {
  const navigate = useNavigate();
  const { login, isRateLimited, completeFirstLoginPasswordChange } = useAuth();
  const [username, setUsername] = useState('admin_hod');
  const [password, setPassword] = useState('admin123');
  const [newPassword, setNewPassword] = useState('');
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

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-bg p-4 relative overflow-hidden">
      {/* Theme Toggle Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="command-card w-full max-w-md bg-surface p-8 shadow-warm-lg space-y-6 relative border border-border rounded-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cobalt flex items-center justify-center text-white font-bold shadow-cobalt-glow mx-auto mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-ink">Alma</h1>
          <p className="text-xs font-mono text-ink-muted">The academic command center that actually feels like your campus.</p>
        </div>

        {error && (
          <div className="p-3 bg-risk/10 border border-risk/40 text-risk text-xs font-mono rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isRateLimited && (
          <div className="p-3 bg-warning/10 border border-warning/40 text-warning text-xs font-mono rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Authentication Rate Limited. Please wait 60s.</span>
          </div>
        )}

        {/* Forced Password Reset Step for First Login */}
        {isFirstLoginStep ? (
          <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
            <div className="p-3 bg-cobalt/10 border border-cobalt/30 text-cobalt text-xs font-mono rounded-xl flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              <span>First Login Security Mandate: Change your default password.</span>
            </div>

            <div>
              <label className="block text-xs font-mono text-ink-muted mb-1">NEW SECURE PASSWORD</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password..."
                className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-xs font-mono text-ink focus:border-cobalt focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl btn-cobalt text-xs font-semibold"
            >
              Update Password & Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-ink-muted mb-1">USERNAME / EMAIL</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-ink-muted" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username..."
                  className="w-full pl-9 pr-3 py-2.5 bg-surface-warm border border-border rounded-xl text-xs font-mono text-ink focus:border-cobalt focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-ink-muted mb-1">PASSWORD</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-ink-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-surface-warm border border-border rounded-xl text-xs font-mono text-ink focus:border-cobalt focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isRateLimited}
              className="w-full py-2.5 rounded-xl btn-cobalt text-xs font-semibold"
            >
              Sign In to Academic Command
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
