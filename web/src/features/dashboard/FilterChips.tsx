import { useRef, useState } from 'react';
import { Icon } from '../../components/Icon';
import { DIETARY_TAGS } from '../../lib/content';
import { useClickOutside } from '../../hooks/useClickOutside';
import type { DietaryTag } from '../../api/types';

export type PrimaryFilter = 'all' | 'fresh' | 'nearMe' | 'mine';

interface FilterChipsProps {
  filter: PrimaryFilter;
  onFilter: (f: PrimaryFilter) => void;
  dietary: DietaryTag[];
  onDietary: (tags: DietaryTag[]) => void;
}

export function FilterChips({ filter, onFilter, dietary, onDietary }: FilterChipsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  function toggleDiet(tag: DietaryTag) {
    onDietary(dietary.includes(tag) ? dietary.filter((t) => t !== tag) : [...dietary, tag]);
  }

  return (
    <div className="chip-row" style={{ marginTop: 12 }}>
      <button className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => onFilter('all')}>
        All
      </button>
      <button className={`chip ${filter === 'fresh' ? 'active' : ''}`} onClick={() => onFilter('fresh')}>
        <span className="dot" style={{ background: '#4FB783' }} />
        Fresh
      </button>
      <button className={`chip ${filter === 'nearMe' ? 'active' : ''}`} onClick={() => onFilter('nearMe')}>
        Near me
      </button>
      <button className={`chip ${filter === 'mine' ? 'active' : ''}`} onClick={() => onFilter('mine')}>
        <Icon name="user" size={12} strokeWidth={2} />
        Mine
      </button>

      <div className="picker-anchor" ref={ref} style={{ display: 'inline-flex' }}>
        <button className={`chip ${dietary.length ? 'active' : ''}`} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <Icon name="leaf" size={13} stroke={dietary.length ? '#fff' : '#2f9d63'} strokeWidth={2} />
          Dietary{dietary.length ? ` · ${dietary.length}` : ''}
          <Icon name="chevronDown" size={12} strokeWidth={2.4} />
        </button>
        {open && (
          <div className="picker-list" style={{ top: 40, minWidth: 190 }}>
            {DIETARY_TAGS.map((t) => {
              const on = dietary.includes(t.value);
              return (
                <div
                  key={t.value}
                  className={`picker-option ${on ? 'active' : ''}`}
                  onClick={() => toggleDiet(t.value)}
                >
                  <span className="box" style={boxStyle(on)}>
                    {on && <Icon name="check" size={11} stroke="#fff" strokeWidth={3} />}
                  </span>
                  {t.label}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <span className="info" tabIndex={0} aria-label="About dietary tags">
        <Icon name="info" size={16} stroke="#b8a89b" strokeWidth={2} />
        <span className="tip">
          Dietary tags come from whoever posted — double-check yourself if you have allergies.
        </span>
      </span>
    </div>
  );
}

function boxStyle(on: boolean) {
  return {
    width: 16,
    height: 16,
    borderRadius: 5,
    border: `1.5px solid ${on ? '#2f9d63' : '#f0dcd0'}`,
    background: on ? '#2f9d63' : '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 auto',
  } as const;
}
