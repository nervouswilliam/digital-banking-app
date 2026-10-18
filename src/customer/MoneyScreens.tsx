import type { ReactNode } from 'react';
import { personas, sitiBusiness, type Persona } from '../data/mockData';
import {
  affordability,
  businessCashFlow,
  capitalRequirement,
  comfortLabel,
  personalCashFlow,
  pct,
  sgd,
} from '../lib/calculations';
import { Button, Card, FormulaRow } from '../components/ui';
import { DscrGauge, InOutBarChart } from '../components/Charts';
import { H1, Lead, Screen } from './Layout';

function Tile({ label, value, tone }: { label: string; value: string; tone: 'blue' | 'amber' | 'green' }) {
  const cls = {
    blue: 'bg-brand-50 text-brand-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-50 text-emerald-700',
  }[tone];
  return (
    <div className={`rounded-xl p-2.5 text-center ${cls}`}>
      <div className="text-[11px] font-semibold uppercase leading-tight">{label}</div>
      <div className="mt-1 text-lg font-extrabold">{value}</div>
    </div>
  );
}

function Explainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 rounded-xl bg-brand-50 p-3 text-sm text-brand-900">
      <span>💡</span>
      <span>{children}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Individuals: "Your money at a glance"
// ---------------------------------------------------------------------------

export function GlanceScreen({ persona, onNext }: { persona: Persona; onNext: () => void }) {
  const cf = persona.cashFlow!;
  const r = personalCashFlow(cf);
  const comfort = r.loanShareOfLeft !== null ? comfortLabel(r.loanShareOfLeft) : null;

  return (
    <Screen footer={<Button className="w-full py-4 text-lg" onClick={onNext}>See my result</Button>}>
      <H1>Your money at a glance</H1>
      <Lead>Your monthly average, worked out from your bank statement and earnings.</Lead>

      <div className="grid grid-cols-3 gap-2">
        <Tile label="Money in" value={sgd(cf.moneyIn)} tone="blue" />
        <Tile label="Money out" value={sgd(r.moneyOut)} tone="amber" />
        <Tile label="Money left" value={sgd(r.moneyLeft)} tone="green" />
      </div>

      <Card>
        <div className="mb-1 font-bold text-gray-900">How we worked it out</div>
        <FormulaRow label="Money in (average)" result={`${sgd(cf.moneyIn)}/month`} tone="blue" />
        <FormulaRow
          label="Money out"
          formula={`everyday spending ${sgd(cf.everydaySpending)} + existing commitments ${sgd(cf.existingCommitments)}`}
          result={sgd(r.moneyOut)}
          tone="amber"
        />
        <FormulaRow
          label="Money left each month"
          formula={`${sgd(cf.moneyIn)} – ${sgd(r.moneyOut)} = ${sgd(r.moneyLeft)}`}
          result={sgd(r.moneyLeft)}
          tone="green"
        />
        {cf.newLoanPayment !== null && comfort && (
          <>
            <FormulaRow
              label="New loan payment"
              formula={`${sgd(cf.newLoanPayment)} ÷ ${sgd(r.moneyLeft)} left = ${pct(r.loanShareOfLeft!)} of the money left`}
              result={
                <span>
                  {sgd(cf.newLoanPayment)} · {pct(r.loanShareOfLeft!)}
                </span>
              }
            />
            <div className="pb-1">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">✓ {comfort.label}</span>
            </div>
            <FormulaRow
              label="Total debt payments vs income"
              formula={`(${sgd(cf.newLoanPayment)} + ${sgd(cf.existingCommitments)}) ÷ ${sgd(cf.moneyIn)} = ${pct(r.debtToIncome)}`}
              result={pct(r.debtToIncome)}
              tone="green"
            />
          </>
        )}
        {cf.newLoanPayment === null && (
          <FormulaRow
            label="Debt payments vs income"
            formula={`${sgd(cf.existingCommitments)} ÷ ${sgd(cf.moneyIn)} = ${pct(r.debtToIncome)}`}
            result={pct(r.debtToIncome)}
          />
        )}
      </Card>

      {cf.newLoanPayment === null && (
        <Explainer>
          Only {sgd(r.moneyLeft)} is left each month, and your sales started just 8 months ago. That's a small cushion if a month goes badly.
        </Explainer>
      )}

      <Card>
        <div className="mb-2 font-bold text-gray-900">Last 12 months</div>
        <InOutBarChart moneyIn={cf.monthlyIn} moneyOut={cf.monthlyOut} />
        {persona.id === 'ali' && (
          <p className="mt-2 text-xs text-gray-500">Some months are higher, some lower – but the average stays steady at {sgd(cf.moneyIn)}.</p>
        )}
        {persona.id === 'meiling' && <p className="mt-2 text-xs text-gray-500">No bars = no sales yet (shop opened 8 months ago).</p>}
      </Card>
    </Screen>
  );
}

// ---------------------------------------------------------------------------
// Siti's Kitchen – A: business cash flow
// ---------------------------------------------------------------------------

export function BizCashFlowScreen({ onNext }: { onNext: () => void }) {
  const b = sitiBusiness;
  const r = businessCashFlow(b);
  return (
    <Screen footer={<Button className="w-full py-4 text-lg" onClick={onNext}>Next: how much do you need?</Button>}>
      <div className="text-xs font-bold uppercase tracking-wide text-brand-600">Part 1 of 3</div>
      <H1>Your business cash flow</H1>
      <Lead>Monthly average over the last 12 months.</Lead>

      <Card className="!p-0">
        <div className="rounded-t-2xl bg-brand-50 px-4 py-2 text-xs font-bold uppercase text-brand-700">Money in</div>
        <div className="px-4">
          <FormulaRow label="Sales (platforms + corporate orders)" result={sgd(b.sales)} tone="blue" />
        </div>
        <div className="bg-amber-50 px-4 py-2 text-xs font-bold uppercase text-amber-700">Money out</div>
        <div className="px-4">
          {b.costs.map((c) => (
            <FormulaRow key={c.label} label={c.label} result={sgd(c.amount)} />
          ))}
          <FormulaRow
            label="Total running costs"
            formula={b.costs.map((c) => sgd(c.amount)).join(' + ')}
            result={sgd(r.runningCosts)}
            tone="amber"
            strong
          />
        </div>
        <div className="space-y-0 border-t-2 border-gray-200 px-4 pb-2">
          <FormulaRow
            label="Cash left from operations"
            formula={`${sgd(b.sales)} – ${sgd(r.runningCosts)} = ${sgd(r.cashFromOperations)}`}
            result={sgd(r.cashFromOperations)}
            tone="green"
          />
          <FormulaRow label="Existing loan repayment" result={`– ${sgd(b.existingLoanRepayment)}`} />
          <FormulaRow
            label="Cash left after existing loans"
            formula={`${sgd(r.cashFromOperations)} – ${sgd(b.existingLoanRepayment)} = ${sgd(r.cashAfterExistingLoans)}`}
            result={sgd(r.cashAfterExistingLoans)}
            tone="green"
            strong
          />
        </div>
      </Card>

      <Card>
        <div className="mb-2 font-bold text-gray-900">Last 12 months</div>
        <InOutBarChart moneyIn={b.monthlySales} moneyOut={b.monthlyCosts} inLabel="Sales" outLabel="Running costs" />
        <p className="mt-2 text-xs text-gray-500">
          Sales peak at festive times (Nov–Dec, Jan–Feb) and range from S$16,000 to S$25,000. Costs stay steadier.
        </p>
      </Card>
    </Screen>
  );
}

// ---------------------------------------------------------------------------
// Siti's Kitchen – B: capital requirement
// ---------------------------------------------------------------------------

export function CapitalNeedScreen({ onNext }: { onNext: () => void }) {
  const b = sitiBusiness;
  const r = capitalRequirement(b);
  const requested = personas.siti.requested;
  return (
    <Screen footer={<Button className="w-full py-4 text-lg" onClick={onNext}>Next: can you afford it?</Button>}>
      <div className="text-xs font-bold uppercase tracking-wide text-brand-600">Part 2 of 3</div>
      <H1>How much does your business really need?</H1>
      <Explainer>
        Before customers pay you, you must pay for ingredients and staff. This is the cash you need to keep the business running smoothly.
      </Explainer>

      <Card>
        <div className="mb-1 font-bold text-gray-900">1. Cash to keep running</div>
        <FormulaRow
          label="Days your money is tied up (cash cycle)"
          formula={`stock kept ${b.stockDays} days + waiting for platform payouts ${b.payoutWaitDays} days – days before you pay suppliers ${b.supplierCreditDays} days = ${r.cashCycleDays} days`}
          result={`${r.cashCycleDays} days`}
        />
        <FormulaRow
          label="Running costs per day"
          formula={`${sgd(r.runningCosts)} ÷ ${b.daysInMonth} = ${sgd(r.costPerDay)}`}
          result={sgd(r.costPerDay)}
        />
        <FormulaRow
          label="Cash needed to run smoothly (working capital)"
          formula={`${r.cashCycleDays} days × ${sgd(r.costPerDay)} = ${sgd(r.workingCapital)}`}
          result={sgd(r.workingCapital)}
          tone="blue"
        />
        <FormulaRow label="Cash you already have" result={`– ${sgd(b.cashOnHand)}`} />
        <FormulaRow
          label="Working capital gap"
          formula={`${sgd(r.workingCapital)} – ${sgd(b.cashOnHand)} = ${sgd(r.workingCapitalGap)}`}
          result={sgd(r.workingCapitalGap)}
          tone="amber"
        />
      </Card>

      <Card>
        <div className="mb-1 font-bold text-gray-900">2. Equipment</div>
        <FormulaRow label="Second oven & equipment (from supplier quote)" result={sgd(b.equipmentQuote)} tone="amber" />
      </Card>

      <Card className="border-2 border-brand-500">
        <FormulaRow
          label="TOTAL YOU NEED"
          formula={`${sgd(r.workingCapitalGap)} + ${sgd(b.equipmentQuote)} = ${sgd(r.totalNeed)}`}
          result={<span className="text-2xl text-brand-600">{sgd(r.totalNeed)}</span>}
          strong
        />
      </Card>

      <div className="rounded-2xl bg-emerald-50 p-4 text-[15px] text-emerald-900">
        🙌 You asked for <b>{sgd(requested)}</b>, but you need about <b>{sgd(r.totalNeed)}</b>. Borrowing only what you need saves you money.
      </div>
    </Screen>
  );
}

// ---------------------------------------------------------------------------
// Siti's Kitchen – C: affordability
// ---------------------------------------------------------------------------

export function AffordabilityScreen({ onNext }: { onNext: () => void }) {
  const loan = personas.siti.loan!;
  const a = affordability(loan);
  const b = sitiBusiness;
  return (
    <Screen footer={<Button className="w-full py-4 text-lg" onClick={onNext}>See my result</Button>}>
      <div className="text-xs font-bold uppercase tracking-wide text-brand-600">Part 3 of 3</div>
      <H1>Can your business afford it?</H1>

      <Card>
        <div className="mb-1 font-bold text-gray-900">The new loan</div>
        <FormulaRow
          label="Loan"
          formula={`${sgd(loan.amount)} over ${loan.months} months at about ${loan.ratePerYear}% a year`}
          result={`${sgd(loan.monthly)}/month`}
          tone="blue"
        />
        <FormulaRow
          label="Total repaid"
          formula={`${sgd(loan.costOfBorrowing)} is the cost of borrowing`}
          result={sgd(loan.totalRepayable)}
        />
      </Card>

      <Card>
        <div className="font-bold text-gray-900">Repayment safety score</div>
        <p className="text-xs text-gray-500">Also called DSCR. How many times your spare cash covers all loan payments.</p>
        <DscrGauge score={a.score} />
        <div className="mt-1 flex justify-center">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">✓ {a.band.label}</span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[11px]">
          <span className="rounded bg-red-50 py-1 text-red-700">below 1.0<br />can't afford</span>
          <span className="rounded bg-amber-50 py-1 text-amber-700">1.0–1.25<br />tight</span>
          <span className="rounded bg-emerald-50 py-1 text-emerald-700">above 1.25<br />comfortable</span>
        </div>
        <div className="mt-3">
          <FormulaRow
            label="Score = cash left from operations ÷ all loan payments"
            formula={`${sgd(a.cashFromOperations)} ÷ (${sgd(b.existingLoanRepayment)} + ${sgd(loan.monthly)}) = ${a.score.toFixed(2)}`}
            result={a.score.toFixed(2)}
            tone="green"
          />
          <FormulaRow
            label="Cash left each month after all loans"
            formula={`${sgd(a.cashFromOperations)} – ${sgd(a.allPayments)} = ${sgd(a.cashLeftAfterLoans)}`}
            result={sgd(a.cashLeftAfterLoans)}
            tone="green"
          />
        </div>
      </Card>
    </Screen>
  );
}
