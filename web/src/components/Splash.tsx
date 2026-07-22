import { Icon } from './Icon';

// Full-screen loading state while the session hydrates.
export function Splash() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        background: 'var(--app-bg)',
      }}
    >
      <div className="brand-logo" style={{ width: 56, height: 56, borderRadius: 18 }}>
        <Icon name="crumb" size={30} stroke="#fff" strokeWidth={1.8} />
      </div>
      <div className="spinner dark" style={{ width: 24, height: 24 }} />
    </div>
  );
}
