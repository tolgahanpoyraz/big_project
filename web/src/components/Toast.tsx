import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

type ToastKind = 'default' | 'success' | 'error';

interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  show: (message: string, kind?: ToastKind) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const remove = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, kind: ToastKind = 'default') => {
      const id = nextId.current++;
      setToasts((list) => [...list, { id, message, kind }]);
      setTimeout(() => remove(id), 3800);
    },
    [remove],
  );

  const value: ToastContextValue = {
    show,
    success: (m) => show(m, 'success'),
    error: (m) => show(m, 'error'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="toast-wrap">
          {toasts.map((t) => (
            <div key={t.id} className={`toast ${t.kind}`} role="status" onClick={() => remove(t.id)}>
              {t.kind === 'success' && <Icon name="check" size={16} stroke="#fff" strokeWidth={2.6} />}
              {t.kind === 'error' && <Icon name="info" size={16} stroke="#fff" strokeWidth={2} />}
              {t.message}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
