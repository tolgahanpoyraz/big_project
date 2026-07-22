import { Icon } from './Icon';

interface LogoProps {
  onClick?: () => void;
}

// Top-bar logo mark + "crumb" wordmark.
export function Logo({ onClick }: LogoProps) {
  const content = (
    <>
      <span className="brand-logo">
        <Icon name="crumb" size={23} stroke="#fff" strokeWidth={1.8} />
      </span>
      <span className="brand-word">crumb</span>
    </>
  );
  if (onClick) {
    return (
      <button className="brand" style={{ background: 'none', border: 'none', padding: 0 }} onClick={onClick}>
        {content}
      </button>
    );
  }
  return <div className="brand">{content}</div>;
}
