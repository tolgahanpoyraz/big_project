// "4m ago", "1h ago", "2d ago". Posts are short-lived, so this stays small.
export function relativeTime(iso: string, now: number = Date.now()): string {
  const diff = now - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Compact time-left for the card badge: "47 min", "1h 46m", "gone".
export function timeLeftShort(iso: string, now: number = Date.now()): string {
  const mins = Math.max(0, Math.floor((new Date(iso).getTime() - now) / 60000));
  if (mins <= 0) return 'gone';
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem ? `${hours}h ${rem}m` : `${hours}h`;
}

// Verbose form for the detail panel: "Expires in 1h 46m".
export function expiresIn(iso: string, now: number = Date.now()): string {
  const short = timeLeftShort(iso, now);
  return short === 'gone' ? 'Expired' : `Expires in ${short}`;
}
