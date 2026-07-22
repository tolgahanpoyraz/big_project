import type { KeyboardEvent } from 'react';
import type { Post } from '../../api/types';
import { StatusBadge } from '../../components/StatusBadge';
import { FoodPhoto } from '../../components/FoodPhoto';
import { Icon } from '../../components/Icon';
import { relativeTime, timeLeftShort } from '../../lib/time';
import { formatMiles } from '../../lib/geo';

interface FoodCardProps {
  post: Post;
  selected: boolean;
  distanceMi?: number;
  now: number;
  onSelect: () => void;
}

export function FoodCard({ post, selected, distanceMi, now, onSelect }: FoodCardProps) {
  const ago = relativeTime(post.createdAt, now);
  const left = timeLeftShort(post.expiresAt, now);
  const dist = distanceMi !== undefined ? formatMiles(distanceMi) : null;
  const locationLine = [post.location.name, dist, ago].filter(Boolean).join(' · ');

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  }

  return (
    <div
      className={`food-card card-row ${selected ? 'selected' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={onKey}
      style={selected ? { borderColor: 'var(--coral)', borderWidth: 2 } : undefined}
    >
      <div className="thumb">
        <FoodPhoto imageKey={post.imageKey} type={post.type} alt={post.foodName} height={64} radius={14} />
      </div>
      <div className="body">
        <div className="head">
          <StatusBadge status={post.status} confidence={post.confidence} showPct variant="sm" />
          <span className="pill-time-amber">
            <Icon name="clock" size={11} stroke="var(--warn-icon)" strokeWidth={2} />
            {left}
          </span>
        </div>
        <div className="title">{post.foodName}</div>
        <div className="sub">{locationLine}</div>
      </div>
    </div>
  );
}
