import { type VoteType, type PostStatus } from './models/Post.js';

export const PRIOR = 0.88;

// P(this vote | food is present), P(this vote | food is gone).
const LIKELIHOOD: Record<VoteType, { present: number; gone: number }> = {
    present: { present: 0.8, gone: 0.3 },
    gone: { present: 0.2, gone: 0.7 },
};

export function updateConfidence(p: number, type: VoteType): number {
    const L = LIKELIHOOD[type];
    const stillThere = L.present * p;
    const isGone = L.gone * (1 - p);
    return stillThere / (stillThere + isGone);
}

export function statusFromConfidence(p: number): PostStatus {
    return p >= 0.65 ? 'fresh' : p >= 0.5 ? 'likely' : p > 0.15 ? 'fading' : 'gone';
}
