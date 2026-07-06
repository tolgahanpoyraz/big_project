import type { CampusLocation } from '../api/types';

export interface Point {
  x: number; // percent 0-100 across the map
  y: number; // percent 0-100 down the map
}

interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

// The design's map is a stylized, key-free canvas (no external SDK). We project
// real UCF coordinates into it so pins land in the right relative positions.
// Bounds come from the full campus location set so a pin's spot is stable no
// matter which posts are currently live.
export function createProjector(locations: CampusLocation[], padding = 12) {
  const bounds = computeBounds(locations);
  const latSpan = bounds.maxLat - bounds.minLat || 1;
  const lngSpan = bounds.maxLng - bounds.minLng || 1;
  const usable = 100 - padding * 2;

  return function project(lat: number, lng: number): Point {
    const x = padding + ((lng - bounds.minLng) / lngSpan) * usable;
    // latitude grows northward (up), screen y grows downward — invert.
    const y = padding + ((bounds.maxLat - lat) / latSpan) * usable;
    return { x, y };
  };
}

function computeBounds(locations: CampusLocation[]): Bounds {
  if (locations.length === 0) {
    // UCF main campus fallback box.
    return { minLat: 28.5941, maxLat: 28.6096, minLng: -81.2044, maxLng: -81.1955 };
  }
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  for (const l of locations) {
    minLat = Math.min(minLat, l.latitude);
    maxLat = Math.max(maxLat, l.latitude);
    minLng = Math.min(minLng, l.longitude);
    maxLng = Math.max(maxLng, l.longitude);
  }
  return { minLat, maxLat, minLng, maxLng };
}
