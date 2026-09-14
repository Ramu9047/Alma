import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, X, Send, User } from 'lucide-react';

export default function ToastNotificationContainer({ toasts = [], onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onDismiss }) {
  const { id, title, message, type, recipient, timestamp, duration } = toast;

  // Styling maps based on type
  const configMap = {
    dispatch: {
      bgColor: 'bg-cobalt/10 border-cobalt/40',
      badgeBg: 'bg-cobalt text-white shadow-cobalt-glow',
      icon: Bell,
      iconColor: 'text-cobalt',
      progressColor: 'bg-cobalt',
      typeLabel: 'ACADEMIC ALERT DISPATCHED'
    },
    success: {
      bgColor: 'bg-emerald-500/10 border-emerald-500/40',
      badgeBg: 'bg-emerald-500 text-white shadow-emerald-500/30',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
      progressColor: 'bg-emerald-500',
      typeLabel: 'SUCCESS'
    },
    warning: {
      bgColor: 'bg-gold/15 border-gold/40',
      badgeBg: 'bg-gold text-slate-950 font-bold',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      progressColor: 'bg-gold',
      typeLabel: 'WARNING ALERT'
    },
    error: {
      bgColor: 'bg-risk/15 border-risk/40',
      badgeBg: 'bg-risk text-white shadow-risk/30',
      icon: ShieldAlert,
      iconColor: 'text-risk',
      progressColor: 'bg-risk',
      typeLabel: 'ACTION BLOCKED'
    },
    info: {
      bgColor: 'bg-sky-500/10 border-sky-500/40',
      badgeBg: 'bg-sky-500 text-white',
      icon: Sparkles,
      iconColor: 'text-sky-500',
      progressColor: 'bg-sky-500',
      typeLabel: 'SYSTEM NOTICE'
    }
  };

  const config = configMap[type] || configMap.info;
  const IconComponent = config.icon;

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border ${config.bgColor} bg-surface-glass/95 backdrop-blur-2xl p-4 shadow-warm-lg shadow-cobalt-glow/15 transition-all duration-300 transform translate-x-0 opacity-100 flex flex-col gap-2.5 group`}
      style={{
        animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Top Bar: Badge, Title, Dismiss Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className={`p-1.5 rounded-xl ${config.badgeBg} flex items-center justify-center flex-shrink-0`}>
            <IconComponent className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted truncate">
            {config.typeLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-mono text-ink-muted/70">{timestamp}</span>
          <button
            onClick={() => onDismiss(id)}
            className="p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-warm transition-colors"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Title & Message Body */}
      <div className="space-y-1 pl-0.5">
        <h4 className="text-xs font-serif font-bold text-ink leading-snug">{title}</h4>
        <p className="text-xs font-sans text-ink-muted leading-relaxed">{message}</p>
      </div>

      {/* Optional Recipient Pill */}
      {recipient && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-warm/80 border border-border text-[10px] font-mono text-cobalt font-semibold self-start">
          <User className="w-3 h-3 text-cobalt" />
          <span>Target: {recipient}</span>
        </div>
      )}

      {/* Auto-Dismiss Progress Bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border/40 overflow-hidden">
          <div
            className={`h-full ${config.progressColor} transition-all ease-linear`}
            style={{
              animation: `shrinkWidth ${duration}ms linear forwards`
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
