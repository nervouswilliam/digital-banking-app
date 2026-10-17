import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Toasts
// ---------------------------------------------------------------------------

type Tone = 'info' | 'success' | 'warning' | 'danger';
interface Toast {
  id: number;
  text: string;
  tone: Tone;
}

const ToastCtx = createContext<(text: string, tone?: Tone) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((text: string, tone: Tone = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);
  const toneCls: Record<Tone, string> = {
    info: 'bg-brand-700',
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    danger: 'bg-red-600',
  };
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div key={t.id} className={`animate-fadeIn rounded-xl px-5 py-3 text-base font-medium text-white shadow-lg ${toneCls[t.tone]}`}>
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

// ---------------------------------------------------------------------------
// Basic building blocks
// ---------------------------------------------------------------------------

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger' | 'warning';
  disabled?: boolean;
  className?: string;
}) {
  const styles = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm',
    secondary: 'bg-white text-brand-600 border-2 border-brand-200 hover:border-brand-500',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    warning: 'bg-amber-500 text-white hover:bg-amber-600',
  }[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-4 py-3 text-base font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}>{children}</div>;
}

/** One line of a calculation: label on the left, plain-English formula and result. */
export function FormulaRow({
  label,
  formula,
  result,
  strong,
  tone,
}: {
  label: ReactNode;
  formula?: ReactNode;
  result: ReactNode;
  strong?: boolean;
  tone?: 'green' | 'amber' | 'red' | 'blue';
}) {
  const toneCls = tone
    ? { green: 'text-emerald-700', amber: 'text-amber-700', red: 'text-red-700', blue: 'text-brand-600' }[tone]
    : 'text-gray-900';
  return (
    <div className={`py-2 ${strong ? '' : 'border-b border-dashed border-gray-200 last:border-0'}`}>
      <div className="flex items-baseline justify-between gap-3">
        <span className={`text-sm ${strong ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{label}</span>
        <span className={`whitespace-nowrap text-base font-bold ${toneCls}`}>{result}</span>
      </div>
      {formula && <div className="mt-0.5 font-mono text-xs text-gray-500">{formula}</div>}
    </div>
  );
}

export function Pill({ children, tone }: { children: ReactNode; tone: 'green' | 'amber' | 'red' | 'blue' | 'gray' }) {
  const cls = {
    green: 'bg-emerald-100 text-emerald-800',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-brand-100 text-brand-700',
    gray: 'bg-gray-100 text-gray-700',
  }[tone];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{children}</span>;
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? 'bg-emerald-500' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

export function Spinner({ className = 'h-5 w-5' }: { className?: string }) {
  return <span className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} />;
}
