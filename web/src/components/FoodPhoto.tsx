import type { CSSProperties } from 'react';
import type { PostType } from '../api/types';
import { assetUrl } from '../lib/images';
import { POST_TYPES } from '../lib/content';

const EMOJI = Object.fromEntries(POST_TYPES.map((t) => [t.value, t.emoji])) as Record<PostType, string | undefined>;

interface FoodPhotoProps {
  imageKey?: string | null;
  type: PostType;
  alt: string;
  height: number | string;
  radius?: number;
  className?: string;
  style?: CSSProperties;
}

// A post photo, or a warm gradient placeholder with the food-type emoji when no
// image was uploaded (or uploads aren't configured).
export function FoodPhoto({ imageKey, type, alt, height, radius, className, style }: FoodPhotoProps) {
  const url = assetUrl(imageKey);
  const base: CSSProperties = {
    width: '100%',
    height,
    borderRadius: radius,
    objectFit: 'cover',
    display: 'block',
    ...style,
  };

  if (url) {
    return <img src={url} alt={alt} className={className} style={base} loading="lazy" />;
  }

  return (
    <div
      className={className}
      style={{
        ...base,
        background: 'linear-gradient(135deg, #ffd9c9, #f7b79f)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: typeof height === 'number' ? Math.min(52, Math.max(22, height * 0.34)) : 40,
      }}
      aria-hidden="true"
    >
      {EMOJI[type] || '🍽️'}
    </div>
  );
}
