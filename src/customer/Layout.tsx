import type { ReactNode } from 'react';
import { BANK_NAME } from '../data/mockData';

export const STEP_LABELS = ['Permission', 'Share info', 'Checking', 'Your money', 'Result'];

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto h-[800px] w-[390px] shrink-0 rounded-[52px] bg-gray-900 p-3 shadow-2xl ring-1 ring-black/20">
      {/* side buttons */}
      <span className="absolute -left-1 top-28 h-10 w-1 rounded-l bg-gray-800" />
      <span className="absolute -left-1 top-44 h-16 w-1 rounded-l bg-gray-800" />
      <span className="absolute -right-1 top-36 h-20 w-1 rounded-r bg-gray-800" />
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[42px] bg-slate-50">
        {/* status bar */}
        <div className="relative flex h-11 shrink-0 items-center justify-between px-7 text-[13px] font-semibold text-gray-900">
          <span>9:41</span>
          <span className="absolute left-1/2 top-2 h-7 w-28 -translate-x-1/2 rounded-full bg-gray-900" />
          <span className="flex items-center gap-1 text-xs">
            <span>▂▄▆</span>
            <span>5G</span>
            <span className="ml-1 inline-block h-3 w-6 rounded-[3px] border border-gray-900 p-[1px]">
              <span className="block h-full w-4/5 rounded-[1px] bg-gray-900" />
            </span>
          </span>
        </div>
        {children}
        {/* home indicator */}
        <div className="flex h-6 shrink-0 items-center justify-center bg-white">
          <span className="h-1 w-32 rounded-full bg-gray-900" />
        </div>
      </div>
    </div>
  );
}

/** The bank's app header inside the phone – makes "who is lending" obvious on every screen. */
export function AppHeader({ onBack, step }: { onBack?: () => void; step?: number }) {
  return (
    <div className="shrink-0 border-b border-gray-200 bg-white">
      <div className="flex h-12 items-center gap-2 px-4">
        {onBack ? (
          <button onClick={onBack} aria-label="Back" className="-ml-1 rounded-lg px-2 py-1 text-xl text-brand-600 hover:bg-brand-50">
            ‹
          </button>
        ) : (
          <span className="w-2" />
        )}
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-xs font-extrabold text-white">MD</span>
        <div className="leading-tight">
          <div className="text-sm font-bold text-gray-900">{BANK_NAME}</div>
          <div className="text-[10px] text-gray-500">Loan check with FlowScore</div>
        </div>
      </div>
      {step !== undefined && (
        <div className="px-4 pb-2.5">
          <div className="mb-1 flex justify-between text-[11px] font-medium text-gray-500">
            <span>
              Step {step} of 5 · <span className="text-brand-600">{STEP_LABELS[step - 1]}</span>
            </span>
          </div>
          <div className="flex gap-1">
            {STEP_LABELS.map((_, i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < step ? 'bg-brand-500' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Scrollable screen body with an optional sticky footer for the main action. */
export function Screen({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <>
      <div className="phone-scroll flex-1 overflow-y-auto px-5 py-5">
        <div className="animate-fadeIn space-y-4">{children}</div>
      </div>
      {footer && <div className="shrink-0 space-y-2 border-t border-gray-100 bg-white px-5 py-3">{footer}</div>}
    </>
  );
}

export function H1({ children }: { children: ReactNode }) {
  return <h1 className="text-[26px] font-extrabold leading-tight text-gray-900">{children}</h1>;
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="text-base leading-relaxed text-gray-600">{children}</p>;
}
