import type { PostStatus } from '../api/types';
import { STATUS_META, confidencePct } from '../lib/freshness';

interface StatusBadgeProps {
  status: PostStatus;
  confidence?: number;
  showPct?: boolean;
  variant?: 'pill' | 'sm' | 'tilt';
}

// The freshness pill — dot + label (+ optional "· 96%"). Colors come from the ramp.
export function StatusBadge({ status, confidence, showPct = false, variant = 'pill' }: StatusBadgeProps) {
  const meta = STATUS_META[status];
  const label =
    showPct && confidence !== undefined ? `${meta.label} · ${confidencePct(confidence)}%` : meta.label;

  if (variant === 'tilt') {
    return (
      <span className="status-badge tilt" style={{ background: meta.dot }}>
        <span aria-hidden="true">●</span> {label}
      </span>
    );
  }

  return (
    <span className={`status-badge ${variant === 'sm' ? 'sm' : ''}`} style={{ background: meta.bg, color: meta.text }}>
      <span className="dot" style={{ background: meta.dot }} />
      {label}
    </span>
  );
}
