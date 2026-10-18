import { useEffect, useRef, useState } from 'react';
import { BANK_NAME, type ConnectCard, type Persona } from '../data/mockData';
import { sgd } from '../lib/calculations';
import { Button, Card, Spinner } from '../components/ui';
import { H1, Lead, Screen } from './Layout';

/** setTimeout that is cleared automatically when the screen unmounts (e.g. Reset demo). */
function useSafeTimeout() {
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  return (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
}

export function WelcomeScreen({ persona, onNext }: { persona: Persona; onNext: () => void }) {
  const isBiz = persona.kind === 'business';
  return (
    <Screen footer={<Button className="w-full py-4 text-lg" onClick={onNext}>Start</Button>}>
      <div className="pt-2 text-5xl">👋</div>
      <H1>Get a fairer loan decision</H1>
      <Lead>
        No payslip? No problem. We look at how money really comes in and goes out, so your{' '}
        {isBiz ? 'business' : 'work'} gets judged fairly.
      </Lead>

      <Card className="flex items-center gap-3 bg-brand-50">
        <span className="text-3xl">{persona.avatar}</span>
        <div className="text-sm">
          <div className="font-bold text-gray-900">Hi {isBiz ? persona.name.split(' ')[0] : persona.shortName}!</div>
          <div className="text-gray-600">
            You're asking for <b className="text-gray-900">{sgd(persona.requested)}</b>
            {isBiz ? ` for ${persona.shortName}.` : '.'}
          </div>
        </div>
      </Card>

      <div>
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Who is who</div>
        <Card className="space-y-3 !p-0">
          <div className="flex gap-3 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-sm font-extrabold text-white">MD</span>
            <div>
              <div className="text-xs font-semibold uppercase text-brand-600">The lender</div>
              <p className="text-[15px] font-medium text-gray-900">
                Your loan is from <b>{BANK_NAME}</b> (licensed by MAS).
              </p>
            </div>
          </div>
          <div className="mx-4 border-t border-gray-100" />
          <div className="flex gap-3 p-4 pt-1">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl">🔎</span>
            <div>
              <div className="text-xs font-semibold uppercase text-emerald-700">The helper</div>
              <p className="text-[15px] font-medium text-gray-900">
                FlowScore helps the bank understand your real income.
              </p>
              <p className="mt-0.5 text-xs text-gray-500">FlowScore does not lend money.</p>
            </div>
          </div>
        </Card>
      </div>
    </Screen>
  );
}

export function PermissionScreen({ onNext }: { onNext: () => void }) {
  const [agreed, setAgreed] = useState(false);
  return (
    <Screen
      footer={
        <Button className="w-full py-4 text-lg" disabled={!agreed} onClick={onNext}>
          Continue
        </Button>
      }
    >
      <H1>Your permission</H1>
      <Lead>Here's exactly what {BANK_NAME} will look at – and what it won't.</Lead>

      <Card className="border-emerald-200 bg-emerald-50/60">
        <div className="mb-2 font-bold text-emerald-800">What we'll look at</div>
        <ul className="space-y-2 text-[15px] text-gray-800">
          {['Money coming in and out', 'Bills paid', 'Savings'].map((t) => (
            <li key={t} className="flex gap-2">
              <span>✅</span>
              {t}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="border-red-200 bg-red-50/60">
        <div className="mb-2 font-bold text-red-800">What we won't look at</div>
        <ul className="space-y-2 text-[15px] text-gray-800">
          {['Your passwords', 'Your messages', 'Your contacts'].map((t) => (
            <li key={t} className="flex gap-2">
              <span>❌</span>
              {t}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="flex gap-3">
        <span className="text-2xl">🔒</span>
        <p className="text-[15px] text-gray-800">
          <b>Access ends after 30 days</b> and your uploaded files are deleted. You can stop it anytime.
        </p>
      </Card>

      <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-brand-200 bg-white p-4">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="h-6 w-6 accent-[#0070C0]"
        />
        <span className="text-base font-semibold text-gray-900">I agree</span>
      </label>
    </Screen>
  );
}

type CardState = 'idle' | 'loading' | 'reading' | 'done';

export function ConnectScreen({ persona, onNext }: { persona: Persona; onNext: () => void }) {
  const [state, setState] = useState<Record<string, CardState>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const later = useSafeTimeout();
  const allDone = persona.connectCards.every((c) => state[c.id] === 'done');

  const start = (card: ConnectCard) => {
    const id = card.id;
    setState((s) => ({ ...s, [id]: 'loading' }));
    if (card.kind !== 'upload') {
      later(() => setState((s) => ({ ...s, [id]: 'done' })), 1300);
      return;
    }
    [20, 45, 70, 90, 100].forEach((p, i) => later(() => setProgress((x) => ({ ...x, [id]: p })), 180 * (i + 1)));
    if (card.checks) {
      // Bank statements are also read and checked for edits after uploading
      later(() => setState((s) => ({ ...s, [id]: 'reading' })), 1000);
      later(() => setState((s) => ({ ...s, [id]: 'done' })), 2000);
    } else {
      later(() => setState((s) => ({ ...s, [id]: 'done' })), 1100);
    }
  };

  return (
    <Screen
      footer={
        <Button className="w-full py-4 text-lg" disabled={!allDone} onClick={onNext}>
          {allDone ? 'Continue' : `Complete all ${persona.connectCards.length} to continue`}
        </Button>
      }
    >
      <H1>Share your info</H1>
      <Lead>Tap each one. No bank log-in needed – just upload your statement.</Lead>

      {persona.connectCards.map((c) => {
        const s = state[c.id] ?? 'idle';
        const isUpload = c.kind === 'upload';
        const loadingText =
          s === 'reading'
            ? 'Reading your statement and checking it…'
            : c.kind === 'login'
              ? 'Opening Singpass (simulated)…'
              : isUpload
                ? 'Uploading…'
                : 'Connecting securely…';
        return (
          <Card key={c.id} className={`transition ${s === 'done' ? 'border-emerald-300 bg-emerald-50/50' : ''}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{c.icon}</span>
              <div className="flex-1">
                <div className="font-bold text-gray-900">{c.title}</div>
                <div className="text-sm text-gray-600">{c.description}</div>
              </div>
              {s === 'done' && (
                <span className="flex h-7 w-7 animate-pop items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">✓</span>
              )}
            </div>
            <div className="mt-3">
              {s === 'idle' && (
                <Button variant="secondary" className="w-full !py-2.5" onClick={() => start(c)}>
                  {c.buttonLabel}
                </Button>
              )}
              {(s === 'loading' || s === 'reading') && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-brand-600">
                    <Spinner className="h-4 w-4" /> {loadingText}
                  </div>
                  {isUpload && s === 'loading' && (
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full bg-brand-500 transition-all duration-200" style={{ width: `${progress[c.id] ?? 5}%` }} />
                    </div>
                  )}
                </div>
              )}
              {s === 'done' && (
                <div className="animate-fadeIn">
                  <div className="text-sm font-semibold text-emerald-700">{c.doneText}</div>
                  {c.checks && (
                    <ul className="mt-2 space-y-1 rounded-lg bg-white/70 p-2 text-xs text-gray-700">
                      {c.checks.map((t) => (
                        <li key={t} className="flex gap-1.5">
                          <span className="text-emerald-600">✓</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </Screen>
  );
}

export function AnalysingScreen({ persona, onDone }: { persona: Persona; onDone: () => void }) {
  const items =
    persona.kind === 'business'
      ? ['Reading your bank statements…', 'Checking your sales…', 'Checking running costs…', 'Checking what your business needs…', 'Preparing your result…']
      : ['Reading your bank statement…', 'Checking your income…', 'Checking bills…', 'Checking savings…', 'Preparing your result…'];
  const [done, setDone] = useState(0);
  const later = useSafeTimeout();

  useEffect(() => {
    items.forEach((_, i) => later(() => setDone(i + 1), 450 * (i + 1)));
    later(onDone, 450 * items.length + 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen>
      <div className="flex flex-col items-center pt-8 text-center">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-100" />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 text-4xl text-white">🔎</span>
        </div>
        <H1>Looking at your money flow</H1>
        <p className="mt-2 text-base text-gray-600">FlowScore is helping {BANK_NAME} check your details.</p>
      </div>
      <Card className="space-y-4">
        {items.map((t, i) => {
          const isDone = i < done;
          const isActive = i === done;
          return (
            <div key={t} className={`flex items-center gap-3 text-base transition ${isDone ? 'text-gray-900' : isActive ? 'text-brand-600' : 'text-gray-400'}`}>
              {isDone ? (
                <span className="flex h-7 w-7 animate-pop items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">✓</span>
              ) : isActive ? (
                <span className="flex h-7 w-7 items-center justify-center">
                  <Spinner />
                </span>
              ) : (
                <span className="h-7 w-7 rounded-full border-2 border-gray-200" />
              )}
              <span className="font-medium">{t}</span>
            </div>
          );
        })}
      </Card>
    </Screen>
  );
}
