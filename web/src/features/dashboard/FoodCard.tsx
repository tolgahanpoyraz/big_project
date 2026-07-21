import type { KeyboardEvent, MouseEvent } from 'react';
import type { Post, VoteType } from '../../api/types';
import { StatusBadge } from '../../components/StatusBadge';
import { FoodPhoto } from '../../components/FoodPhoto';
import { Icon } from '../../components/Icon';
import { relativeTime, timeLeftShort } from '../../lib/time';
import { formatMiles } from '../../lib/geo';

interface FoodCardProps {
  post: Post;
  variant: 'hero' | 'row';
  selected: boolean;
  mine: boolean;
  voted: boolean;
  distanceMi?: number;
  now: number;
  onSelect: () => void;
  onVote?: (type: VoteType) => void;
}

export function FoodCard({ post, variant, selected, mine, voted, distanceMi, now, onSelect, onVote }: FoodCardProps) {
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

  function vote(e: MouseEvent, type: VoteType) {
    e.stopPropagation();
    onVote?.(type);
  }

  if (variant === 'hero') {
    return (
      <div
        className={`food-card card-hero ${selected ? 'selected' : ''}`}
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        onClick={onSelect}
        onKeyDown={onKey}
      >
        <div className="photo">
          <FoodPhoto imageKey={post.imageKey} type={post.type} alt={post.foodName} height={132} />
          <div className="scrim" />
          <div className="overlay-tl">
            <StatusBadge status={post.status} confidence={post.confidence} showPct variant="tilt" />
          </div>
          <div className="overlay-tr">
            {mine ? (
              <span className="pill-time-dark">
                <Icon name="clock" size={12} stroke="#fff" strokeWidth={2} />
                {left}
              </span>
            ) : (
              dist && <span className="pill-distance">{dist}</span>
            )}
          </div>
          <div className="caption">
            <div className="title">{post.foodName}</div>
            <div className="sub">
              {post.location.name} · {ago}
            </div>
          </div>
        </div>

        {mine ? (
          <div style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '0 14px', height: 44 }}>
            <div className="mine-tally">
              <span className="present">✓ {post.tallies.present} still here</span>
              <span className="gone">✕ {post.tallies.gone} gone</span>
            </div>
          </div>
        ) : (
          <div className="votes">
            <button className="vote-cell present" disabled={voted || post.status === 'gone'} onClick={(e) => vote(e, 'present')}>
              <Icon name="check" size={15} stroke="#2f9d63" strokeWidth={2.6} />
              Still here {post.tallies.present}
            </button>
            <div className="vote-divider" />
            <button className="vote-cell gone" disabled={voted || post.status === 'gone'} onClick={(e) => vote(e, 'gone')}>
              Gone {post.tallies.gone}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Compact row — own drops get a richer layout (design: Feed · Mine).
  if (mine) {
    return (
      <div
        className={`food-card card-row-mine ${selected ? 'selected' : ''}`}
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        onClick={onSelect}
        onKeyDown={onKey}
        style={selected ? { borderColor: 'var(--coral)', borderWidth: 2 } : undefined}
      >
        <div className="top">
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
            <div className="sub">{[post.location.name, ago].filter(Boolean).join(' · ')}</div>
          </div>
        </div>
        <div className="mine-foot">
          <div className="mine-tally">
            <span className="present">✓ {post.tallies.present}</span>
            <span className="gone">✕ {post.tallies.gone}</span>
          </div>
        </div>
      </div>
    );
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
        <FoodPhoto imageKey={post.imageKey} type={post.type} alt={post.foodName} height={58} radius={13} />
      </div>
      <div className="body">
        <StatusBadge status={post.status} confidence={post.confidence} showPct variant="sm" />
        <div className="title" style={{ marginTop: 3 }}>
          {post.foodName}
        </div>
        <div className="sub">{locationLine}</div>
      </div>
    </div>
  );
}
