export interface Strength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
}

// Lightweight heuristic strength meter for the register / reset screens.
export function scorePassword(pw: string): Strength {
  if (!pw) return { score: 0, label: '', color: '#f0e0d6' };

  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[0-9]/.test(pw) && /[a-zA-Z]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  const clamped = Math.min(4, score) as Strength['score'];
  const meta: Record<number, { label: string; color: string }> = {
    0: { label: 'Too short', color: '#e8943a' },
    1: { label: 'Weak — add length', color: '#e8943a' },
    2: { label: 'Okay — add a number', color: '#8bc23f' },
    3: { label: 'Strong — 8+ characters with a number.', color: '#4FB783' },
    4: { label: 'Very strong.', color: '#4FB783' },
  };
  return { score: clamped, ...meta[clamped] };
}

// Colors for the 4 strength segments given a score (filled left-to-right).
export function strengthBars(score: number): string[] {
  const fill: Record<number, string> = {
    1: '#e8943a',
    2: '#8bc23f',
    3: '#4FB783',
    4: '#4FB783',
  };
  return [0, 1, 2, 3].map((i) => (i < score ? fill[score] || '#4FB783' : '#f0e0d6'));
}
