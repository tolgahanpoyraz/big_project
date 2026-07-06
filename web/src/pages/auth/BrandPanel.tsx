import type { ReactNode } from 'react';
import { Icon } from '../../components/Icon';

interface BrandPanelProps {
  variant: 'coral' | 'green';
  headline: ReactNode;
  body?: ReactNode;
  showLogo?: boolean;
  showFoot?: boolean;
  features?: { icon: 'pin' | 'bell' | 'check'; text: string }[];
  align?: 'between' | 'center';
  mascotSize?: 'lg' | 'sm';
}

// The gradient marketing panel shared by every auth screen. Nutmeg (the mascot)
// art is TBD, so the circular slot shows a placeholder emoji.
export function BrandPanel({
  variant,
  headline,
  body,
  showLogo = false,
  showFoot = false,
  features,
  align = 'center',
  mascotSize = 'lg',
}: BrandPanelProps) {
  const blobs =
    variant === 'coral' ? (
      <>
        <span className="brand-blob" style={{ top: -80, right: -80, width: 320, height: 320, background: 'rgba(255,255,255,.09)' }} />
        <span className="brand-blob" style={{ bottom: -120, left: -60, width: 340, height: 340, background: 'rgba(255,255,255,.08)' }} />
      </>
    ) : (
      <>
        <span className="brand-blob" style={{ top: -90, left: -70, width: 320, height: 320, background: 'rgba(255,255,255,.09)' }} />
        <span className="brand-blob" style={{ bottom: -110, right: -70, width: 340, height: 340, background: 'rgba(255,255,255,.08)' }} />
      </>
    );

  const mascot = (
    <div className={`brand-mascot ${mascotSize === 'sm' ? 'sm' : ''}`}>
      <div className="slot" aria-hidden="true">
        🐿️
      </div>
    </div>
  );

  return (
    <aside className={`brand-panel ${variant}`} style={align === 'between' ? { justifyContent: 'space-between' } : undefined}>
      {blobs}

      {showLogo && (
        <div className="brand-top">
          <span className="brand-logo-sm">
            <Icon name="crumb" size={26} stroke="#fff" strokeWidth={1.8} />
          </span>
          <span className="brand-word">crumb</span>
        </div>
      )}

      <div style={{ position: 'relative' }}>
        {mascot}
        <div className="brand-headline">{headline}</div>
        {body && <div className="brand-body">{body}</div>}

        {features && (
          <div className="brand-features">
            {features.map((f, i) => (
              <div className="brand-feature" key={i}>
                <span className="ic">
                  <Icon name={f.icon} size={18} stroke="#fff" strokeWidth={2.2} />
                </span>
                <span className="tx">{f.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showFoot && <div className="brand-foot">Built for UCF · Free food, before it's gone</div>}
    </aside>
  );
}
