import { useEffect, useState } from 'react';
import type { Coords } from '../lib/geo';

// Best-effort one-shot geolocation. Used to show distances and the "you're here"
// dot, and to power the "Near me" filter and nearest-place suggestions. Never
// blocks — if the user denies it, the app just omits distances.
export function useGeolocation(): Coords | null {
  const [coords, setCoords] = useState<Coords | null>(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    let active = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (active) setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      },
      () => {},
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
    return () => {
      active = false;
    };
  }, []);

  return coords;
}
