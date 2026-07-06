import { assetUrl, initials } from '../lib/images';

interface AvatarProps {
  name: string;
  avatarKey?: string | null;
  size?: number;
  ring?: boolean;
}

// Renders the uploaded photo when available, else a generated initials avatar.
export function Avatar({ name, avatarKey, size = 38, ring = false }: AvatarProps) {
  const url = assetUrl(avatarKey);
  const inner = url ? (
    <img className="avatar" src={url} alt="" width={size} height={size} style={{ width: size, height: size }} />
  ) : (
    <span
      className="avatar-fallback"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );

  if (!ring) return inner;
  return (
    <span className="avatar-ring">
      <span className="inner">{inner}</span>
    </span>
  );
}
