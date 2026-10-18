import { useState } from 'react';
import {
  BANK_NAME,
  applicants,
  capitalInputs,
  fairnessCheck,
  personas,
  pilotMetrics,
  portfolioSummary,
  sitiBusiness,
  type Applicant,
  type AppStatus,
  type RiskLevel,
} from '../data/mockData';
import {
  affordability,
  businessCashFlow,
  capitalRequirement,
  capitalToHold,
  personalCashFlow,
  pct,
  sgd,
} from '../lib/calculations';
import { Button, Card, FormulaRow, Pill, useToast } from '../components/ui';
import { IncomeLineChart } from '../components/Charts';

const riskTone: Record<RiskLevel, 'green' | 'amber' | 'red' | 'blue'> = {
  Low: 'green',
  'Low–Medium': 'blue',
  Medium: 'amber',
  High: 'red',
};
const statusTone: Record<AppStatus, 'green' | 'amber' | 'red' | 'gray' | 'blue'> = {
  Approved: 'green',
  'Not yet': 'amber',
  Flagged: 'red',
  Rejected: 'red',
  'In review': 'blue',
};

function scoreColor(s: number) {
  if (s >= 700) return 'text-emerald-700';
  if (s >= 550) return 'text-amber-700';
  return 'text-red-700';
}

export default function BankDashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = applicants.find((a) => a.id === selectedId) ?? null;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-6 py-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-sm font-extrabold text-white">MD</span>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{BANK_NAME} – Credit Team</h1>
            <p className="text-sm text-gray-500">
              powered by <b className="text-emerald-700">FlowScore</b> · Pilot programme
            </p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {pilotMetrics.map((m) => (
          <Card key={m.label}>
            <div className="text-sm font-medium text-gray-500">{m.label}</div>
            <div className="mt-1 text-3xl font-extrabold text-gray-900">{m.value}</div>
            <div className="mt-1 text-xs text-gray-400">{m.note}</div>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_minmax(0,560px)]">
        <ApplicantTable selectedId={selectedId} onSelect={setSelectedId} />
        {selected ? (
          <DetailPanel key={selected.id} applicant={selected} onClose={() => setSelectedId(null)} />
        ) : (
          <Card className="flex min-h-[300px] flex-col items-center justify-center text-center text-gray-500">
            <span className="text-4xl">👈</span>
            <p className="mt-2 text-lg font-medium">Click an applicant to see the details</p>
            <p className="text-sm">Try Ali, Siti's Kitchen, Mei Ling or Jason.</p>
          </Card>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <CapitalCard />
        <div className="space-y-6">
          <PortfolioCard />
          <FairnessCard />
        </div>
      </div>
    </div>
  );
}

function ApplicantTable({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string) => void }) {
  return (
    <Card className="overflow-hidden !p-0">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-bold text-gray-900">Applicants</h2>
        <span className="text-sm text-gray-500">{applicants.length} this week</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-3 py-3">Job type</th>
              <th className="px-3 py-3 text-right">FlowScore</th>
              <th className="px-3 py-3">Risk</th>
              <th className="px-3 py-3 text-right">Suggested limit</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((a) => (
              <tr
                key={a.id}
                onClick={() => onSelect(a.id)}
                className={`cursor-pointer border-t border-gray-100 transition hover:bg-brand-50 ${selectedId === a.id ? 'bg-brand-50' : ''} ${a.flag ? 'bg-red-50/40' : ''}`}
              >
                <td className="px-5 py-3">
                  <div className="font-semibold text-gray-900">{a.name}</div>
                  {a.flag && <div className="mt-0.5 text-xs font-bold text-red-600">{a.flag}</div>}
                </td>
                <td className="px-3 py-3 text-gray-600">{a.jobType}</td>
                <td className={`px-3 py-3 text-right text-base font-extrabold ${scoreColor(a.score)}`}>{a.score}</td>
                <td className="px-3 py-3">
                  <Pill tone={riskTone[a.risk]}>{a.risk}</Pill>
                </td>
                <td className="px-3 py-3 text-right font-semibold text-gray-900">{a.suggestedLimit ? sgd(a.suggestedLimit) : '–'}</td>
                <td className="px-5 py-3">
                  <Pill tone={statusTone[a.status]}>{a.status}</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function SignalBar({ label, value, note }: { label: string; value: number; note: string }) {
  const color = value >= 70 ? 'bg-emerald-500' : value >= 45 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-800">{label}</span>
        <span className="text-gray-500">{note}</span>
      </div>
      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function DetailPanel({ applicant: a, onClose }: { applicant: Applicant; onClose: () => void }) {
  const [tab, setTab] = useState<'overview' | 'cashflow'>('overview');
  const toast = useToast();

  return (
    <Card className="animate-fadeIn space-y-5 !p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">{a.name}</h2>
          <p className="text-sm text-gray-500">{a.jobType}</p>
          <p className="mt-1 text-xs text-gray-500">🧾 Source: uploaded bank statement · ✓ checked for edits</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`text-2xl font-extrabold ${scoreColor(a.score)}`}>{a.score}</span>
            <span className="text-xs text-gray-400">/ 1000</span>
            <Pill tone={riskTone[a.risk]}>{a.risk} risk</Pill>
            <Pill tone={statusTone[a.status]}>{a.status}</Pill>
          </div>
        </div>
        <button onClick={onClose} className="rounded-lg px-2 py-1 text-xl text-gray-400 hover:bg-gray-100" aria-label="Close">
          ✕
        </button>
      </div>

      {a.flag && (
        <div className="rounded-xl border-2 border-red-300 bg-red-50 p-4">
          <div className="font-bold text-red-700">{a.flag}</div>
          <p className="mt-1 text-sm text-red-900">{a.flagDetail}</p>
          <Button variant="danger" className="mt-3 !py-2 text-sm" onClick={() => toast(`${a.name} sent for human review`, 'warning')}>
            Send for human review
          </Button>
        </div>
      )}

      <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
        {(['overview', 'cashflow'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${tab === t ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}
          >
            {t === 'overview' ? 'Overview' : 'Cash flow'}
          </button>
        ))}
      </div>

      {tab === 'overview' ? (
        <div className="space-y-5">
          <div>
            <h3 className="font-bold text-gray-900">{a.personaId === 'siti' ? 'Monthly sales' : 'Monthly income'} – last 12 months</h3>
            <p className="text-sm text-gray-500">{a.incomeLabel}</p>
            <IncomeLineChart values={a.monthlyIncome} color={a.flag ? '#DC2626' : '#0070C0'} />
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900">Signals</h3>
            {a.signals.map((s) => (
              <SignalBar key={s.label} {...s} />
            ))}
          </div>
          <div>
            <h3 className="mb-2 font-bold text-gray-900">Reason codes</h3>
            <ul className="space-y-1.5">
              {a.reasonCodes.map((r, i) => (
                <li key={r} className="flex gap-2 text-sm text-gray-800">
                  <span className="font-mono text-xs text-gray-400">R{i + 1}</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <CashFlowTab a={a} />
      )}

      <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
        <Button variant="success" className="!py-2" onClick={() => toast(`Approved ${a.name} (demo only – no real action)`, 'success')}>
          Approve
        </Button>
        <Button variant="danger" className="!py-2" onClick={() => toast(`Rejected ${a.name} (demo only – no real action)`, 'danger')}>
          Reject
        </Button>
        <Button variant="secondary" className="!py-2" onClick={() => toast(`${a.name} sent for human review`, 'warning')}>
          Send for human review
        </Button>
      </div>
    </Card>
  );
}

function Ratio({ label, value, tone = 'blue' }: { label: string; value: string; tone?: 'blue' | 'green' | 'amber' | 'red' }) {
  const cls = {
    blue: 'bg-brand-50 text-brand-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
  }[tone];
  return (
    <div className={`rounded-xl p-3 ${cls}`}>
      <div className="text-xs font-semibold uppercase">{label}</div>
      <div className="mt-0.5 text-2xl font-extrabold">{value}</div>
    </div>
  );
}

function CashFlowTab({ a }: { a: Applicant }) {
  if (a.personaId === 'ali' || a.personaId === 'meiling') {
    const cf = personas[a.personaId].cashFlow!;
    const r = personalCashFlow(cf);
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Ratio label="Money left each month" value={sgd(r.moneyLeft)} tone={r.moneyLeft >= 500 ? 'green' : 'amber'} />
          <Ratio label="Debt-to-income" value={pct(r.debtToIncome)} tone="green" />
        </div>
        <div>
          <FormulaRow label="Money in (average)" result={`${sgd(cf.moneyIn)}/month`} />
          <FormulaRow
            label="Money out"
            formula={`everyday spending ${sgd(cf.everydaySpending)} + existing commitments ${sgd(cf.existingCommitments)}`}
            result={sgd(r.moneyOut)}
          />
          <FormulaRow label="Money left each month" formula={`${sgd(cf.moneyIn)} – ${sgd(r.moneyOut)} = ${sgd(r.moneyLeft)}`} result={sgd(r.moneyLeft)} tone="green" />
          {cf.newLoanPayment !== null ? (
            <>
              <FormulaRow
                label="New loan payment vs money left"
                formula={`${sgd(cf.newLoanPayment)} ÷ ${sgd(r.moneyLeft)} = ${pct(r.loanShareOfLeft!)} (comfortable)`}
                result={pct(r.loanShareOfLeft!)}
              />
              <FormulaRow
                label="Total debt payments vs income"
                formula={`(${sgd(cf.newLoanPayment)} + ${sgd(cf.existingCommitments)}) ÷ ${sgd(cf.moneyIn)} = ${pct(r.debtToIncome)}`}
                result={pct(r.debtToIncome)}
                tone="green"
              />
            </>
          ) : (
            <FormulaRow
              label="Debt payments vs income (existing only)"
              formula={`${sgd(cf.existingCommitments)} ÷ ${sgd(cf.moneyIn)} = ${pct(r.debtToIncome)}`}
              result={pct(r.debtToIncome)}
            />
          )}
        </div>
      </div>
    );
  }

  if (a.personaId === 'siti') {
    const b = sitiBusiness;
    const cf = businessCashFlow(b);
    const cap = capitalRequirement(b);
    const aff = affordability(personas.siti.loan!);
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Ratio label="DSCR" value={aff.score.toFixed(2)} tone="green" />
          <Ratio label="Working capital gap" value={sgd(cap.workingCapitalGap)} tone="amber" />
          <Ratio label="Cash cycle" value={`${cap.cashCycleDays} days`} />
        </div>
        <div>
          <div className="text-xs font-bold uppercase text-gray-400">Cash flow (monthly average)</div>
          <FormulaRow label="Sales" result={sgd(b.sales)} />
          <FormulaRow label="Total running costs" formula={b.costs.map((c) => sgd(c.amount)).join(' + ')} result={sgd(cf.runningCosts)} />
          <FormulaRow label="Cash left from operations" formula={`${sgd(b.sales)} – ${sgd(cf.runningCosts)}`} result={sgd(cf.cashFromOperations)} tone="green" />
          <FormulaRow
            label="Cash left after existing loans"
            formula={`${sgd(cf.cashFromOperations)} – ${sgd(b.existingLoanRepayment)}`}
            result={sgd(cf.cashAfterExistingLoans)}
          />
        </div>
        <div>
          <div className="text-xs font-bold uppercase text-gray-400">Capital requirement</div>
          <FormulaRow
            label="Cash cycle"
            formula={`${b.stockDays} stock + ${b.payoutWaitDays} payout wait – ${b.supplierCreditDays} supplier credit`}
            result={`${cap.cashCycleDays} days`}
          />
          <FormulaRow label="Working capital" formula={`${cap.cashCycleDays} days × ${sgd(cap.costPerDay)}/day`} result={sgd(cap.workingCapital)} />
          <FormulaRow label="Working capital gap" formula={`${sgd(cap.workingCapital)} – ${sgd(b.cashOnHand)} cash on hand`} result={sgd(cap.workingCapitalGap)} />
          <FormulaRow label="Total need" formula={`${sgd(cap.workingCapitalGap)} + ${sgd(b.equipmentQuote)} oven`} result={sgd(cap.totalNeed)} tone="blue" />
        </div>
        <div>
          <div className="text-xs font-bold uppercase text-gray-400">Affordability</div>
          <FormulaRow
            label="DSCR"
            formula={`${sgd(aff.cashFromOperations)} ÷ (${sgd(b.existingLoanRepayment)} + ${sgd(personas.siti.loan!.monthly)})`}
            result={aff.score.toFixed(2)}
            tone="green"
          />
          <FormulaRow label="Cash left after all loans" formula={`${sgd(aff.cashFromOperations)} – ${sgd(aff.allPayments)}`} result={sgd(aff.cashLeftAfterLoans)} />
        </div>
      </div>
    );
  }

  const left = a.simpleCashFlow.moneyIn - a.simpleCashFlow.moneyOut;
  return (
    <div className="space-y-4">
      {a.simpleCashFlow.note && <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">⚠ {a.simpleCashFlow.note}</div>}
      <div className="grid grid-cols-3 gap-3">
        <Ratio label="Money in" value={sgd(a.simpleCashFlow.moneyIn)} />
        <Ratio label="Money out" value={sgd(a.simpleCashFlow.moneyOut)} tone="amber" />
        <Ratio label="Money left" value={sgd(left)} tone={left > 0 ? 'green' : 'red'} />
      </div>
      <FormulaRow
        label="Money left each month"
        formula={`${sgd(a.simpleCashFlow.moneyIn)} – ${sgd(a.simpleCashFlow.moneyOut)} = ${left < 0 ? '–' : ''}${sgd(Math.abs(left))}`}
        result={`${left < 0 ? '–' : ''}${sgd(Math.abs(left))}`}
        tone={left > 0 ? 'green' : 'red'}
      />
    </div>
  );
}

function CapitalCard() {
  const rows = [
    { name: 'Ali', loan: personas.ali.loan!.amount, pd: applicants.find((x) => x.id === 'ali')!.probabilityOfDefault },
    { name: "Siti's Kitchen", loan: personas.siti.loan!.amount, pd: applicants.find((x) => x.id === 'siti')!.probabilityOfDefault },
  ].map((r) => ({ ...r, ...capitalToHold(r.loan, r.pd) }));

  const lines: { label: string; cells: (r: (typeof rows)[number]) => string; strong?: boolean }[] = [
    { label: 'Loan amount', cells: (r) => sgd(r.loan) },
    { label: 'Risk weight (unsecured retail / small business)', cells: () => pct(capitalInputs.riskWeight) },
    { label: 'Risk-weighted amount', cells: (r) => sgd(r.riskWeighted) },
    { label: `Capital to hold (${pct(capitalInputs.minCapitalRatio)} minimum total capital ratio)`, cells: (r) => sgd(r.capital), strong: true },
    { label: 'Chance of not repaying (from FlowScore)', cells: (r) => `${r.pd}%` },
    { label: 'Loss if not repaid', cells: () => pct(capitalInputs.lossGivenDefault) },
    { label: 'Expected loss = chance × loss × amount', cells: (r) => sgd(r.expectedLoss), strong: true },
  ];

  return (
    <Card className="!p-5">
      <h2 className="text-lg font-bold text-gray-900">🏛️ Capital the bank must hold</h2>
      <p className="mt-1 text-sm text-gray-600">Banks must set aside some of their own money in case loans are not repaid.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
              <th className="py-2 pr-3" />
              {rows.map((r) => (
                <th key={r.name} className="px-3 py-2 text-right">
                  {r.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.label} className={`border-b border-gray-100 last:border-0 ${l.strong ? 'bg-brand-50/60' : ''}`}>
                <td className={`py-2.5 pr-3 ${l.strong ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{l.label}</td>
                {rows.map((r) => (
                  <td key={r.name} className={`px-3 py-2.5 text-right ${l.strong ? 'font-extrabold text-brand-700' : 'font-semibold text-gray-900'}`}>
                    {l.cells(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-gray-500">
        e.g. Ali: {sgd(3000)} × 75% = {sgd(rows[0].riskWeighted)} → × 10% = {sgd(rows[0].capital)} held. Expected loss: 1.8% × 45% × {sgd(3000)} ≈{' '}
        {sgd(rows[0].expectedLoss)}.
      </p>
      <p className="mt-2 text-xs italic text-gray-400">
        Illustrative only. Actual requirements follow MAS Notice 637 and include additional buffers.
      </p>
    </Card>
  );
}

function PortfolioCard() {
  return (
    <Card className="!p-5">
      <h2 className="text-lg font-bold text-gray-900">📊 Portfolio summary</h2>
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total lent via FlowScore (pilot)</span>
          <b className="text-gray-900">{portfolioSummary.totalLent}</b>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Capital held</span>
          <b className="text-gray-900">{portfolioSummary.capitalHeld}</b>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Expected loss</span>
          <b className="text-gray-900">{portfolioSummary.expectedLoss}</b>
        </div>
      </div>
    </Card>
  );
}

function FairnessCard() {
  return (
    <Card className="!p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">⚖️ Fairness check</h2>
        <Pill tone="green">✓ Passed</Pill>
      </div>
      <p className="mt-1 text-sm text-gray-600">Approval rates by age group look similar.</p>
      <div className="mt-3 space-y-2">
        {fairnessCheck.map((f) => (
          <div key={f.group} className="flex items-center gap-3 text-sm">
            <span className="w-14 text-gray-600">{f.group}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${f.rate * 2}%` }} />
            </div>
            <span className="w-10 text-right font-semibold text-gray-900">{f.rate}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
