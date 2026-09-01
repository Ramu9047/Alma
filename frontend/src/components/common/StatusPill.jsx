import React from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Award,
  AlertOctagon,
  Minus,
  DollarSign,
  AlertCircle,
  Check,
  X,
  MessageSquare,
  BookOpen
} from 'lucide-react';

/**
 * StatusPill — Shared component for status indicators with category-specific visual hierarchy.
 *
 * Categories: 'fee' | 'grade' | 'leave' | 'course' | 'feedback' | 'general'
 */
export default function StatusPill({ status, category = 'general', size = 'sm' }) {
  if (!status) return null;

  const normalized = String(status).trim().toLowerCase();

  let icon = null;
  let bgClass = 'bg-surface-warm text-ink-muted border-border';
  let borderStyle = 'border-l-2';

  switch (category) {
    case 'fee':
      if (normalized.includes('paid') && !normalized.includes('unpaid') && !normalized.includes('partial')) {
        icon = <DollarSign className="w-3 h-3 text-success" />;
        bgClass = 'bg-success/10 text-success border-success/30';
        borderStyle = 'border-l-4 border-l-success';
      } else if (normalized.includes('partial') || normalized.includes('pending')) {
        icon = <AlertCircle className="w-3 h-3 text-warning" />;
        bgClass = 'bg-warning/10 text-warning border-warning/30';
        borderStyle = 'border-l-4 border-l-warning';
      } else {
        icon = <XCircle className="w-3 h-3 text-risk" />;
        bgClass = 'bg-risk/10 text-risk border-risk/30';
        borderStyle = 'border-l-4 border-l-risk';
      }
      break;

    case 'grade':
      if (normalized.includes('pass') || normalized.includes('distinction') || normalized === 'a+' || normalized === 'a' || normalized === 'b') {
        icon = <Award className="w-3 h-3 text-success" />;
        bgClass = 'bg-success/15 text-success border-success/40';
        borderStyle = 'border-l-4 border-l-success';
      } else if (normalized.includes('average') || normalized === 'c' || normalized === 'd') {
        icon = <Minus className="w-3 h-3 text-warning" />;
        bgClass = 'bg-warning/15 text-warning border-warning/40';
        borderStyle = 'border-l-4 border-l-warning';
      } else {
        icon = <AlertOctagon className="w-3 h-3 text-risk" />;
        bgClass = 'bg-risk/15 text-risk border-risk/40 font-bold';
        borderStyle = 'border-l-4 border-l-risk';
      }
      break;

    case 'leave':
      if (normalized.includes('approved')) {
        icon = <Check className="w-3 h-3 text-success" />;
        bgClass = 'bg-success/10 text-success border-success/30';
        borderStyle = 'border-l-4 border-l-success';
      } else if (normalized.includes('pending')) {
        icon = <Clock className="w-3 h-3 text-warning" />;
        bgClass = 'bg-warning/10 text-warning border-warning/30';
        borderStyle = 'border-l-4 border-l-warning';
      } else {
        icon = <X className="w-3 h-3 text-risk" />;
        bgClass = 'bg-risk/10 text-risk border-risk/30';
        borderStyle = 'border-l-4 border-l-risk';
      }
      break;

    case 'course':
      if (normalized.includes('active') || normalized.includes('operational')) {
        icon = <BookOpen className="w-3 h-3 text-cobalt" />;
        bgClass = 'bg-cobalt/10 text-cobalt border-cobalt/30';
        borderStyle = 'border-l-4 border-l-cobalt';
      } else if (normalized.includes('draft') || normalized.includes('pending')) {
        icon = <Clock className="w-3 h-3 text-warning" />;
        bgClass = 'bg-warning/10 text-warning border-warning/30';
        borderStyle = 'border-l-4 border-l-warning';
      } else {
        icon = <XCircle className="w-3 h-3 text-ink-muted" />;
        bgClass = 'bg-surface-warm text-ink-muted border-border';
        borderStyle = 'border-l-4 border-l-ink-muted';
      }
      break;

    case 'feedback':
      if (normalized.includes('resolved') || normalized.includes('closed')) {
        icon = <CheckCircle2 className="w-3 h-3 text-success" />;
        bgClass = 'bg-success/10 text-success border-success/30';
        borderStyle = 'border-l-4 border-l-success';
      } else if (normalized.includes('open') || normalized.includes('review')) {
        icon = <MessageSquare className="w-3 h-3 text-cobalt" />;
        bgClass = 'bg-cobalt/10 text-cobalt border-cobalt/30';
        borderStyle = 'border-l-4 border-l-cobalt';
      } else {
        icon = <AlertTriangle className="w-3 h-3 text-risk" />;
        bgClass = 'bg-risk/10 text-risk border-risk/30';
        borderStyle = 'border-l-4 border-l-risk';
      }
      break;

    default:
      if (normalized.includes('active') || normalized.includes('approved') || normalized.includes('paid') || normalized.includes('pass') || normalized.includes('operational') || normalized.includes('resolved')) {
        icon = <CheckCircle2 className="w-3 h-3 text-success" />;
        bgClass = 'bg-success/10 text-success border-success/30';
        borderStyle = 'border-l-4 border-l-success';
      } else if (normalized.includes('pending') || normalized.includes('warning') || normalized.includes('review') || normalized.includes('partial')) {
        icon = <Clock className="w-3 h-3 text-warning" />;
        bgClass = 'bg-warning/10 text-warning border-warning/30';
        borderStyle = 'border-l-4 border-l-warning';
      } else {
        icon = <XCircle className="w-3 h-3 text-risk" />;
        bgClass = 'bg-risk/10 text-risk border-risk/30';
        borderStyle = 'border-l-4 border-l-risk';
      }
      break;
  }

  const paddingClass = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded-lg border ${borderStyle} ${bgClass} ${paddingClass}`}
    >
      {icon}
      <span>{status}</span>
    </span>
  );
}
