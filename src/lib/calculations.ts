// Pure functions for every number the demo shows. Same inputs → same outputs.

import { capitalInputs, sitiBusiness, type PersonalCashFlow, type LoanQuote } from '../data/mockData';

export const sgd = (n: number) =>
  'S$' + Math.round(n).toLocaleString('en-SG', { maximumFractionDigits: 0 });

export const pct = (ratio: number) => `${Math.round(ratio * 100)}%`;

export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

// ---------------------------------------------------------------------------
// Individuals
// ---------------------------------------------------------------------------

export function personalCashFlow(cf: PersonalCashFlow) {
  const moneyOut = cf.everydaySpending + cf.existingCommitments;
  const moneyLeft = cf.moneyIn - moneyOut;
  const loanShareOfLeft = cf.newLoanPayment !== null ? cf.newLoanPayment / moneyLeft : null;
  const debtToIncome = ((cf.newLoanPayment ?? 0) + cf.existingCommitments) / cf.moneyIn;
  return { moneyOut, moneyLeft, loanShareOfLeft, debtToIncome };
}

/** Plain-English label for how much of the spare cash a new payment uses. */
export function comfortLabel(share: number): { label: string; tone: 'green' | 'amber' | 'red' } {
  if (share <= 0.4) return { label: 'comfortable', tone: 'green' };
  if (share <= 0.7) return { label: 'tight', tone: 'amber' };
  return { label: 'too much', tone: 'red' };
}

// ---------------------------------------------------------------------------
// Siti's Kitchen – business
// ---------------------------------------------------------------------------

export function businessCashFlow(b = sitiBusiness) {
  const runningCosts = sum(b.costs.map((c) => c.amount));
  const cashFromOperations = b.sales - runningCosts;
  const cashAfterExistingLoans = cashFromOperations - b.existingLoanRepayment;
  return { runningCosts, cashFromOperations, cashAfterExistingLoans };
}

export function capitalRequirement(b = sitiBusiness) {
  const { runningCosts } = businessCashFlow(b);
  const cashCycleDays = b.stockDays + b.payoutWaitDays - b.supplierCreditDays;
  const costPerDay = runningCosts / b.daysInMonth;
  const workingCapital = cashCycleDays * costPerDay;
  const workingCapitalGap = workingCapital - b.cashOnHand;
  const totalNeed = workingCapitalGap + b.equipmentQuote;
  return { runningCosts, cashCycleDays, costPerDay, workingCapital, workingCapitalGap, totalNeed };
}

/** Repayment safety score (DSCR) = cash from operations ÷ all loan payments. */
export function dscr(cashFromOperations: number, loanPayments: number[]) {
  return cashFromOperations / sum(loanPayments);
}

export const round2 = (n: number) => Math.round(n * 100) / 100;

export function dscrBand(score: number): { label: string; tone: 'green' | 'amber' | 'red' } {
  if (score < 1) return { label: "can't afford", tone: 'red' };
  if (score <= 1.25) return { label: 'tight', tone: 'amber' };
  return { label: 'comfortable', tone: 'green' };
}

export function affordability(loan: LoanQuote, b = sitiBusiness) {
  const { cashFromOperations } = businessCashFlow(b);
  const allPayments = b.existingLoanRepayment + loan.monthly;
  const score = round2(dscr(cashFromOperations, [b.existingLoanRepayment, loan.monthly]));
  const cashLeftAfterLoans = cashFromOperations - allPayments;
  return { cashFromOperations, allPayments, score, cashLeftAfterLoans, band: dscrBand(score) };
}

export function compareLoans(chosen: LoanQuote, requested: LoanQuote) {
  return {
    extraTotal: requested.totalRepayable - chosen.totalRepayable,
    extraMonthly: requested.monthly - chosen.monthly,
  };
}

// ---------------------------------------------------------------------------
// Bank capital (illustrative, simplified Basel-style)
// ---------------------------------------------------------------------------

export function capitalToHold(loanAmount: number, probabilityOfDefaultPct: number, c = capitalInputs) {
  const riskWeighted = loanAmount * c.riskWeight;
  const capital = riskWeighted * c.minCapitalRatio;
  const expectedLoss = (probabilityOfDefaultPct / 100) * c.lossGivenDefault * loanAmount;
  return { riskWeighted, capital, expectedLoss };
}
