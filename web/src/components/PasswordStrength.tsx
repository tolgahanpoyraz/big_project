import { scorePassword, strengthBars } from '../lib/strength';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { label } = scorePassword(password);
  const bars = strengthBars(password ? scorePassword(password).score : 0);
  return (
    <>
      <div className="strength">
        {bars.map((c, i) => (
          <span key={i} style={{ background: c }} />
        ))}
      </div>
      {password && <div className="strength-hint">{label}</div>}
    </>
  );
}
