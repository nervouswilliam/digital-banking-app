import { useEffect, useRef, useState } from 'react';
import { personaOrder, personas, type PersonaId } from './data/mockData';
import { sgd } from './lib/calculations';
import { ToastProvider, useToast } from './components/ui';
import CustomerApp from './customer/CustomerApp';
import BankDashboard from './bank/BankDashboard';
import HowItWorks from './HowItWorks';

type Tab = 'customer' | 'bank' | 'how';
const TABS: { id: Tab; label: string }[] = [
  { id: 'customer', label: 'Customer App' },
  { id: 'bank', label: 'Bank Dashboard' },
  { id: 'how', label: 'How It Works' },
];

function PresenterMenu({ personaId, onPersona, onReset }: { personaId: PersonaId; onPersona: (p: PersonaId) => void; onReset: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:border-brand-500"
      >
        🎤 Presenter <span className="text-gray-400">·</span> <span className="text-brand-600">{personas[personaId].shortName}</span> ▾
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 animate-fadeIn rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
          <div className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-gray-400">Choose persona</div>
          {personaOrder.map((id) => {
            const p = personas[id];
            const active = id === personaId;
            return (
              <button
                key={id}
                onClick={() => {
                  onPersona(id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-brand-50 ${active ? 'bg-brand-50' : ''}`}
              >
                <span className="text-2xl">{p.avatar}</span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-gray-900">
                    {p.kind === 'business' ? `${p.shortName} (${p.name})` : p.name}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {p.kind === 'business' ? 'Micro-SME catering' : p.job} · asks {sgd(p.requested)} ·{' '}
                    <span className={p.outcome === 'approved' ? 'text-emerald-700' : 'text-amber-700'}>
                      {p.outcome === 'approved' ? 'Approved' : 'Not yet'}
                    </span>
                  </span>
                </span>
                {active && <span className="text-brand-600">✓</span>}
              </button>
            );
          })}
          <div className="my-2 border-t border-gray-100" />
          <button
            onClick={() => {
              onReset();
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            ↺ Reset demo
          </button>
        </div>
      )}
    </div>
  );
}

function Shell() {
  const [tab, setTab] = useState<Tab>('customer');
  const [personaId, setPersonaId] = useState<PersonaId>('ali');
  const [demoKey, setDemoKey] = useState(0);
  const toast = useToast();

  const choosePersona = (id: PersonaId) => {
    setPersonaId(id);
    setDemoKey((k) => k + 1);
    setTab('customer');
    toast(`Persona: ${personas[id].name}`, 'info');
  };
  const reset = () => {
    setDemoKey((k) => k + 1);
    setTab('customer');
    toast('Demo reset', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-amber-400 py-1 text-center text-xs font-bold tracking-wide text-amber-950">Demo only – fictional data</div>
      <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-4 px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-emerald-500 text-lg text-white">≋</span>
            <span className="text-xl font-extrabold text-gray-900">
              Flow<span className="text-brand-500">Score</span>
            </span>
          </div>
          <div className="flex flex-1 justify-center gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-xl px-4 py-2 text-base font-semibold transition ${tab === t.id ? 'bg-brand-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <PresenterMenu personaId={personaId} onPersona={choosePersona} onReset={reset} />
        </div>
      </nav>

      <main key={demoKey}>
        {/* Customer app stays mounted so switching tabs mid-journey doesn't lose progress */}
        <div className={tab === 'customer' ? 'block' : 'hidden'}>
          <div className="flex justify-center px-4 py-6">
            <CustomerApp personaId={personaId} />
          </div>
        </div>
        {tab === 'bank' && <BankDashboard />}
        {tab === 'how' && <HowItWorks />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  );
}
