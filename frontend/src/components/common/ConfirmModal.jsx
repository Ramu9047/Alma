import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  const [confirmedOnce, setConfirmedOnce] = useState(false);

  if (!isOpen) return null;

  const handleAction = () => {
    if (!confirmedOnce) {
      setConfirmedOnce(true);
    } else {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm animate-stagger-fade">
      <div className="command-card w-full max-w-md bg-surface p-6 shadow-warm-lg space-y-4 relative border border-border rounded-2xl">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-ink-muted hover:text-ink p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-risk/10 border border-risk/30 flex items-center justify-center text-risk flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-ink text-base">{title}</h3>
            <p className="text-xs font-mono text-ink-muted mt-0.5">ACTION REQUIRES CONFIRMATION</p>
          </div>
        </div>

        <p className="text-xs text-ink leading-relaxed border-y border-border py-3">
          {message}
        </p>

        {confirmedOnce && (
          <div className="p-2 rounded.xl bg-risk/10 border border-risk/40 text-[11px] font-mono text-risk font-semibold animate-pulse">
            ⚠️ CLICK AGAIN TO PERMANENTLY CONFIRM DELETION
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            type="button"
            className="px-4 py-2 rounded-xl border border-border text-xs text-ink-muted hover:text-ink hover:bg-surface-warm transition-all font-medium"
          >
            Cancel
          </button>

          {/* Destructive Button: Outlined initially, fills solid red only on confirmation step */}
          <button
            onClick={handleAction}
            type="button"
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              confirmedOnce
                ? 'bg-risk text-white hover:bg-red-700 shadow-md font-semibold'
                : 'border border-risk text-risk hover:bg-risk/10'
            }`}
          >
            {confirmedOnce ? 'Confirm Permanent Delete' : 'Delete Record'}
          </button>
        </div>
      </div>
    </div>
  );
}
