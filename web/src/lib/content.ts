import type { DietaryTag, PostType } from '../api/types';

export const POST_TYPES: { value: PostType; label: string; emoji?: string }[] = [
  { value: 'pizza', label: 'Pizza', emoji: '🍕' },
  { value: 'meal', label: 'Meal', emoji: '🍱' },
  { value: 'snacks', label: 'Snacks', emoji: '🍿' },
  { value: 'baked-goods', label: 'Baked goods', emoji: '🥐' },
  { value: 'drinks', label: 'Drinks', emoji: '☕' },
  { value: 'other', label: 'Other' },
];

export const DIETARY_TAGS: { value: DietaryTag; label: string }[] = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
  { value: 'gluten-free', label: 'Gluten-free' },
];

const TYPE_MAP = Object.fromEntries(POST_TYPES.map((t) => [t.value, t]));
const DIET_MAP = Object.fromEntries(DIETARY_TAGS.map((t) => [t.value, t]));

export function typeLabel(type: PostType): string {
  const t = TYPE_MAP[type];
  return t.emoji ? `${t.emoji} ${t.label}` : t.label;
}

export function dietaryLabel(tag: DietaryTag): string {
  return DIET_MAP[tag]?.label ?? tag;
}
