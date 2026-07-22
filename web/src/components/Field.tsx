import { useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

interface FieldProps {
  icon?: IconName;
  trailing?: ReactNode;
  error?: boolean;
  small?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

// The rounded input shell: leading icon + content + optional trailing element.
export function Field({ icon, trailing, error, small, disabled, className, children }: FieldProps) {
  return (
    <div
      className={[
        'field',
        small ? 'field-sm' : '',
        error ? 'field-error' : '',
        disabled ? 'is-disabled' : '',
        className || '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && (
        <span className="field-icon">
          <Icon name={icon} size={17} strokeWidth={2} />
        </span>
      )}
      {children}
      {trailing}
    </div>
  );
}

type PasswordInputProps = {
  icon?: IconName;
  small?: boolean;
  error?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

// Password field with a built-in show/hide toggle.
export function PasswordInput({ icon = 'lock', small, error, ...inputProps }: PasswordInputProps) {
  const [show, setShow] = useState(false);
  return (
    <Field
      icon={icon}
      small={small}
      error={error}
      trailing={
        <button
          type="button"
          className="trailing"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          <Icon name={show ? 'eyeOff' : 'eye'} size={18} strokeWidth={2} />
        </button>
      }
    >
      <input type={show ? 'text' : 'password'} {...inputProps} />
    </Field>
  );
}
