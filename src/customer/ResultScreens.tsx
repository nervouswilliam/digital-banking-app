import { useState } from 'react';
import { BANK_NAME, sitiBusiness, type LoanQuote, type Persona } from '../data/mockData';
import { affordability, compareLoans, sgd } from '../lib/calculations';
import { Button, Card, Toggle } from '../components/ui';
import { H1, Lead, Screen } from './Layout';

const fmtDate = (d: Date) => d.toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' });
const daysFromToday = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

function FromBank() {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-500 text-[10px] font-extrabold text-white">MD</span>
      <span className="text-gray-700">
        Loan from <b className="text-gray-900">{BANK_NAME}</b> · licensed by MAS
      </span>
    </div>
  );
}

export function LoanSummary({ loan }: { loan: LoanQuote }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-brand-500 bg-white">
      <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-3 p-4">
        <span className="text-sm font-semibold text-gray-500">You get</span>
        <span className="text-right text-2xl font-extrabold text-gray-900">{sgd(loan.amount)}</span>
        <span className="text-sm font-semibold text-gray-500">You pay</span>
        <span className="text-right text-lg font-bold text-gray-900">
          {sgd(loan.monthly)} a month <span className="font-medium text-gray-600">for {loan.months} months</span>
        </span>
        <span className="text-sm font-semibold text-gray-500">Total you pay back</span>
        <span className="text-right text-lg font-bold text-gray-900">{sgd(loan.totalRepayable)}</span>
      </div>
      <div className="bg-brand-50 px-4 py-2 text-sm text-brand-900">
        <b>{sgd(loan.costOfBorrowing)}</b> is the cost of borrowing (about {loan.ratePerYear}% a year).
      </div>
    </div>
  );
}

export function ApprovedScreen({
  persona,
  onAccept,
  onSecondary,
}: {
  persona: Persona;
  onAccept: () => void;
  onSecondary: () => void;
}) {
  const loan = persona.loan!;
  const isBiz = persona.kind === 'business';
  return (
    <Screen
      footer={
        <>
          <Button variant="success" className="w-full py-4 text-lg" onClick={onAccept}>
            {isBiz ? `Accept ${sgd(loan.amount)}` : 'Accept loan'}
          </Button>
          <Button variant={isBiz ? 'secondary' : 'ghost'} className="w-full" onClick={onSecondary}>
            {isBiz ? `I still want ${sgd(persona.requested)}` : 'Not now'}
          </Button>
        </>
      }
    >
      <div className="text-center">
        <div className="text-5xl">🎉</div>
        <H1>
          Good news! {BANK_NAME} can lend {isBiz ? persona.shortName : 'you'} {sgd(loan.amount)}
        </H1>
      </div>
      <FromBank />
      <LoanSummary loan={loan} />
      <p className="-mt-2 text-center text-[11px] text-gray-400">Monthly amount rounded to the nearest dollar.</p>

      <div>
        <div className="mb-2 font-bold text-gray-900">Why you were approved</div>
        <div className="space-y-2">
          {persona.reasons.map((r) => (
            <Card key={r.text} className="flex items-center gap-3 !py-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xl">{r.icon}</span>
              <span className="text-[15px] font-medium text-gray-900">{r.text}</span>
            </Card>
          ))}
        </div>
      </div>
    </Screen>
  );
}

export function NotYetScreen({ persona, onNext }: { persona: Persona; onNext: () => void }) {
  const [reminded, setReminded] = useState(false);
  return (
    <Screen
      footer={
        <>
          <Button className="w-full py-4 text-lg" variant={reminded ? 'success' : 'primary'} onClick={() => setReminded(true)}>
            {reminded ? `✓ Reminder set for ${persona.remindIn}` : `Remind me in ${persona.remindIn}`}
          </Button>
          <Button variant="ghost" className="w-full" onClick={onNext}>
            See what I shared
          </Button>
        </>
      }
    >
      <div className="text-center">
        <div className="text-5xl">🌱</div>
        <H1>Not yet – but you're close</H1>
        <p className="mt-2 text-base text-gray-600">
          {BANK_NAME} can't offer a {sgd(persona.requested)} loan right now. Here's why, and how to get there.
        </p>
      </div>

      <Card>
        <div className="mb-2 font-bold text-gray-900">Why not yet</div>
        <ul className="space-y-2.5">
          {persona.reasons.map((r) => (
            <li key={r.text} className="flex items-center gap-3 text-[15px] text-gray-800">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-lg">{r.icon}</span>
              {r.text}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="border-emerald-200 bg-emerald-50/50">
        <div className="mb-2 font-bold text-emerald-900">What you can do</div>
        <ul className="space-y-2.5">
          {persona.tips!.map((t) => (
            <li key={t} className="flex gap-3 text-[15px] text-gray-800">
              <span className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-2 border-emerald-500 bg-white" />
              {t}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="flex items-center gap-3">
        <span className="text-2xl">🔔</span>
        <span className="text-[15px] font-medium text-gray-900">We'll remind you in {persona.remindIn}.</span>
      </Card>
    </Screen>
  );
}

export function SitiCompareScreen({
  recommended,
  onChoose,
}: {
  recommended: LoanQuote;
  onChoose: (loan: LoanQuote) => void;
}) {
  const requested = sitiBusiness.requestedLoan;
  const a16 = affordability(recommended);
  const a20 = affordability(requested);
  const diff = compareLoans(recommended, requested);
  const rows: [string, string, string][] = [
    ['Monthly payment', sgd(recommended.monthly), sgd(requested.monthly)],
    ['Months', `${recommended.months}`, `${requested.months}`],
    ['Safety score', a16.score.toFixed(2), a20.score.toFixed(2)],
    ['Total you pay back', sgd(recommended.totalRepayable), sgd(requested.totalRepayable)],
  ];
  return (
    <Screen
      footer={
        <>
          <Button variant="success" className="w-full py-4 text-lg" onClick={() => onChoose(recommended)}>
            Take {sgd(recommended.amount)} (recommended)
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => onChoose(requested)}>
            Take {sgd(requested.amount)} anyway
          </Button>
        </>
      }
    >
      <H1>Compare your options</H1>
      <Lead>Both are loans from {BANK_NAME}. Here's the difference.</Lead>

      <Card className="!p-0">
        <div className="grid grid-cols-3 border-b border-gray-200 text-center text-sm font-bold">
          <span className="p-3" />
          <span className="bg-emerald-50 p-3 text-emerald-800">{sgd(recommended.amount)}</span>
          <span className="p-3 text-gray-900">{sgd(requested.amount)}</span>
        </div>
        {rows.map(([label, x, y]) => (
          <div key={label} className="grid grid-cols-3 border-b border-gray-100 text-center text-sm last:border-0">
            <span className="p-3 text-left text-gray-600">{label}</span>
            <span className="bg-emerald-50/60 p-3 font-bold text-gray-900">{x}</span>
            <span className="p-3 font-bold text-gray-900">{y}</span>
          </div>
        ))}
      </Card>

      <div className="rounded-2xl bg-amber-50 p-4 text-[15px] text-amber-900">
        <b>Still affordable</b> (score {a20.score.toFixed(2)}), but it costs you <b>{sgd(diff.extraTotal)} more in total</b> and{' '}
        <b>{sgd(diff.extraMonthly)} more each month</b>.
      </div>
      <p className="text-sm text-gray-500">
        Your business needs about {sgd(recommended.amount)} for the oven and running costs. The extra {sgd(requested.amount - recommended.amount)} would mostly sit unused while you pay for it.
      </p>
    </Screen>
  );
}

export function AcceptedScreen({ persona, loan, onNext }: { persona: Persona; loan: LoanQuote; onNext: () => void }) {
  return (
    <Screen footer={<Button className="w-full py-4 text-lg" onClick={onNext}>Manage my data</Button>}>
      <div className="flex flex-col items-center pt-4 text-center">
        <span className="mb-4 flex h-20 w-20 animate-pop items-center justify-center rounded-full bg-emerald-500 text-4xl text-white">✓</span>
        <H1>Loan accepted!</H1>
        <p className="mt-2 text-base text-gray-600">
          {BANK_NAME} will send <b className="text-gray-900">{sgd(loan.amount)}</b> to your {persona.payoutAccount} within 1 working day.
        </p>
      </div>
      <LoanSummary loan={loan} />
      <Card className="space-y-1 text-sm text-gray-700">
        <div>
          📅 First payment: <b>{fmtDate(daysFromToday(30))}</b>
        </div>
        <div>📄 Your loan agreement has been sent to your {BANK_NAME} inbox.</div>
        <div>❓ Questions? Contact {BANK_NAME}, your lender.</div>
      </Card>
    </Screen>
  );
}

export function NotNowScreen({ persona, onNext }: { persona: Persona; onNext: () => void }) {
  return (
    <Screen footer={<Button className="w-full py-4 text-lg" onClick={onNext}>Manage my data</Button>}>
      <div className="flex flex-col items-center pt-6 text-center">
        <span className="mb-4 text-5xl">👍</span>
        <H1>No problem</H1>
        <p className="mt-2 text-base text-gray-600">
          Your offer of {sgd(persona.loan!.amount)} from {BANK_NAME} stays open until <b>{fmtDate(daysFromToday(7))}</b>. Nothing has been
          borrowed.
        </p>
      </div>
    </Screen>
  );
}

const SHARE_LABEL: Record<string, string> = {
  singpass: 'Singpass (name and ID)',
  statement: 'Bank statement (uploaded)',
  earnings: 'Earnings statement',
  platform: 'Sales platforms',
  invoices: 'Supplier invoices',
};

export function MyDataScreen({ persona, onFinish }: { persona: Persona; onFinish: () => void }) {
  const [sharing, setSharing] = useState<Record<string, boolean>>(() => Object.fromEntries(persona.connectCards.map((c) => [c.id, true])));
  const endDate = fmtDate(daysFromToday(30));
  return (
    <Screen footer={<Button variant="secondary" className="w-full" onClick={onFinish}>Done</Button>}>
      <H1>My data</H1>
      <Lead>What you're sharing with {BANK_NAME}. You're in control.</Lead>

      <div className="space-y-3">
        {persona.connectCards.map((c) => {
          const on = sharing[c.id];
          return (
            <Card key={c.id} className="flex items-center gap-3">
              <span className="text-2xl">{c.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{SHARE_LABEL[c.id] ?? c.doneText.replace('Connected: ', '')}</div>
                <div className={`text-xs font-medium ${on ? 'text-emerald-700' : 'text-gray-500'}`}>
                  {on ? 'Sharing' : 'Stopped – no longer shared'}
                </div>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Toggle on={on} onChange={(v) => setSharing((s) => ({ ...s, [c.id]: v }))} label={`Stop sharing ${c.title}`} />
                <span className="text-[10px] text-gray-500">{on ? 'Stop sharing' : 'Off'}</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="flex gap-3 bg-brand-50">
        <span className="text-2xl">🔒</span>
        <p className="text-[15px] text-gray-800">
          Access ends and uploaded files are deleted on <b>{endDate}</b>.
        </p>
      </Card>
    </Screen>
  );
}
