import { request } from './client';
import type { LocationsResponse } from './types';

export function getLocations(signal?: AbortSignal) {
  return request<LocationsResponse>('/locations', { signal });
}
