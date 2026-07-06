import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  onClose: () => void;
  className?: string;
  labelledBy?: string;
  children: ReactNode;
}

// Dimmed, blurred overlay with a centered card. Closes on Esc or backdrop click.
export function Modal({ onClose, className = '', labelledBy, children }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        {children}
      </div>
    </div>,
    document.body,
  );
}
