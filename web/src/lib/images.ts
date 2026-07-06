const ASSET_BASE = (import.meta.env.VITE_ASSET_BASE_URL || '').replace(/\/$/, '');

// Avatar keys are deterministic (avatars/{userId}.jpg), so a re-upload lands at
// the same URL. Bump this after uploading to force browsers past the cache.
let avatarBust = 0;
export function bumpAvatarCache() {
  avatarBust = Date.now();
}

// Build a display URL from an S3 object key. Returns null when uploads aren't
// configured (VITE_ASSET_BASE_URL unset), so callers fall back to a placeholder.
export function assetUrl(key?: string | null): string | null {
  if (!key) return null;
  if (!ASSET_BASE) return null;
  const url = `${ASSET_BASE}/${key}`;
  if (avatarBust && key.startsWith('avatars/')) {
    return `${url}?v=${avatarBust}`;
  }
  return url;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
