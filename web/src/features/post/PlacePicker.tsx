import { useMemo, useRef, useState } from 'react';
import type { CampusLocation } from '../../api/types';
import { Icon } from '../../components/Icon';
import { useClickOutside } from '../../hooks/useClickOutside';

interface PlacePickerProps {
  locations: CampusLocation[];
  value: string | null;
  onChange: (id: string) => void;
}

export function PlacePicker({ locations, value, onChange }: PlacePickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  const selected = locations.find((l) => l.id === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? locations.filter((l) => l.name.toLowerCase().includes(q)) : locations;
  }, [locations, query]);

  return (
    <div className="picker-anchor" ref={ref}>
      <button type="button" className={`picker ${open ? 'open' : ''}`} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Icon name="pin" size={17} stroke="#F0653F" strokeWidth={2} />
        <span className={`val ${selected ? '' : 'placeholder'}`}>{selected ? selected.name : 'Choose a campus place'}</span>
        <Icon name="chevronDown" size={16} stroke="#c7a99e" strokeWidth={2.4} />
      </button>

      {open && (
        <div className="picker-list cw-scroll">
          <input
            className="picker-search"
            placeholder="Search places…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {filtered.length === 0 ? (
            <div className="picker-empty">No places match.</div>
          ) : (
            filtered.map((l) => (
              <div
                key={l.id}
                className={`picker-option ${l.id === value ? 'active' : ''}`}
                onClick={() => {
                  onChange(l.id);
                  setOpen(false);
                  setQuery('');
                }}
              >
                <Icon name="pin" size={14} strokeWidth={2} />
                {l.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
