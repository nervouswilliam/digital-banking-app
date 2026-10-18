// All demo data lives here. Everything is fictional and hard-coded so the demo
// behaves exactly the same every time.

export const BANK_NAME = 'Merlion Digital Bank';
export const PRODUCT_NAME = 'FlowScore';

export type PersonaId = 'ali' | 'meiling' | 'siti';

/** Last 12 months, oldest first (Nov 2025 – Oct 2026). */
export const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

export interface ConnectCard {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  doneText: string;
  icon: string;
  /** How the card behaves when tapped: a log-in, a live connection, or a file upload. */
  kind: 'login' | 'connect' | 'upload';
  /** Extra checks shown after an upload, e.g. that a statement hasn't been edited. */
  checks?: string[];
}

export interface LoanQuote {
  amount: number;
  months: number;
  monthly: number; // rounded to the nearest dollar, as quoted by the bank
  totalRepayable: number;
  costOfBorrowing: number;
  ratePerYear: number; // approx. % a year
}

/** Cash-flow summary for an individual (Ali, Mei Ling). */
export interface PersonalCashFlow {
  moneyIn: number;
  everydaySpending: number;
  existingCommitments: number;
  newLoanPayment: number | null; // null = no loan offered now
  monthlyIn: number[]; // 12 values; 0 = no history yet
  monthlyOut: number[];
}

export interface Persona {
  id: PersonaId;
  name: string;
  shortName: string;
  age: number;
  job: string;
  tenure: string;
  avatar: string;
  kind: 'individual' | 'business';
  requested: number;
  outcome: 'approved' | 'notyet';
  connectCards: ConnectCard[];
  /** Where the loan money would be paid (the account on the uploaded statement). */
  payoutAccount: string;
  earningsFileNote: string;
  reasons: { icon: string; text: string }[];
  tips?: string[];
  remindIn?: string;
  loan?: LoanQuote;
  cashFlow?: PersonalCashFlow;
  savings: number;
}

const singpassCard = (name: string): ConnectCard => ({
  id: 'singpass',
  title: 'Log in with Singpass (simulated)',
  description: 'Confirms your name and ID.',
  buttonLabel: 'Log in with Singpass (simulated)',
  doneText: `Confirmed: ${name} · S****567A`,
  icon: '🪪',
  kind: 'login',
});

export const personas: Record<PersonaId, Persona> = {
  ali: {
    id: 'ali',
    name: 'Ali Rahman',
    shortName: 'Ali',
    age: 32,
    job: 'Ride-hail driver',
    tenure: '2 years',
    avatar: '🚗',
    kind: 'individual',
    requested: 3000,
    outcome: 'approved',
    savings: 4200,
    connectCards: [
      singpassCard('Ali Rahman'),
      {
        id: 'statement',
        title: 'Upload your bank statement',
        description: 'Last 12 months. A PDF, or photos of the printed pages.',
        buttonLabel: 'Upload PDF or photos',
        doneText: 'bank_statement.pdf ✓ – 12 months of transactions read',
        icon: '🧾',
        kind: 'upload',
        checks: ['Name matches your Singpass details', 'Account ending 1234 · Nov 2025 – Oct 2026', 'No signs of editing'],
      },
      {
        id: 'earnings',
        title: 'Upload your earnings statement',
        description: 'From your ride-hail or delivery app.',
        buttonLabel: 'Upload file',
        doneText: 'earnings_statement.pdf ✓ – 12 months of income found',
        icon: '📄',
        kind: 'upload',
      },
    ],
    payoutAccount: 'bank account ending 1234',
    earningsFileNote: '12 months of income found',
    reasons: [
      { icon: '📈', text: 'Steady income for 18+ months' },
      { icon: '✅', text: 'Bills always paid on time' },
      { icon: '🐷', text: 'Keeps savings of about 1.4 months of income' },
    ],
    loan: {
      amount: 3000,
      months: 12,
      monthly: 260,
      totalRepayable: 3115,
      costOfBorrowing: 115,
      ratePerYear: 7,
    },
    cashFlow: {
      moneyIn: 3000,
      everydaySpending: 2050,
      existingCommitments: 150,
      newLoanPayment: 260,
      // Varies between S$2,400 and S$3,600 – averages exactly S$3,000.
      monthlyIn: [2800, 3200, 2400, 3100, 3600, 2900, 2600, 3300, 3000, 2700, 3400, 3000],
      // Averages exactly S$2,200.
      monthlyOut: [2150, 2300, 2050, 2250, 2400, 2150, 2100, 2250, 2200, 2150, 2300, 2100],
    },
  },
  meiling: {
    id: 'meiling',
    name: 'Mei Ling Tan',
    shortName: 'Mei Ling',
    age: 26,
    job: 'Online seller',
    tenure: '8 months',
    avatar: '🛍️',
    kind: 'individual',
    requested: 5000,
    outcome: 'notyet',
    savings: 600,
    connectCards: [
      singpassCard('Mei Ling Tan'),
      {
        id: 'statement',
        title: 'Upload your bank statement',
        description: 'Last 12 months. A PDF, or photos of the printed pages.',
        buttonLabel: 'Upload PDF or photos',
        doneText: '8 photos ✓ – 8 months of transactions read',
        icon: '🧾',
        kind: 'upload',
        checks: ['Name matches your Singpass details', 'Account ending 5678 · Mar 2026 – Oct 2026', 'No signs of editing'],
      },
      {
        id: 'earnings',
        title: 'Upload your earnings statement',
        description: 'From your online shop or marketplace.',
        buttonLabel: 'Upload file',
        doneText: 'earnings_statement.pdf ✓ – 8 months of sales found',
        icon: '📄',
        kind: 'upload',
      },
    ],
    payoutAccount: 'bank account ending 5678',
    earningsFileNote: '8 months of sales found',
    reasons: [
      { icon: '📅', text: 'Less than 12 months of sales history' },
      { icon: '⏰', text: '2 late bill payments recently' },
      { icon: '🐷', text: 'Low savings buffer' },
    ],
    tips: [
      'Keep paying bills on time for 3 months',
      'Build savings to S$1,500',
      'Try again in 4 months – you may qualify for up to S$2,000',
    ],
    remindIn: '4 months',
    cashFlow: {
      moneyIn: 2500,
      everydaySpending: 2150,
      existingCommitments: 200,
      newLoanPayment: null,
      // Only 8 months of history (shop opened in March). Growing but irregular.
      monthlyIn: [0, 0, 0, 0, 1400, 1500, 2300, 2000, 2900, 2600, 3500, 3800],
      monthlyOut: [0, 0, 0, 0, 1500, 1600, 2200, 2100, 2600, 2500, 3000, 3300],
    },
  },
  siti: {
    id: 'siti',
    name: 'Siti Aminah',
    shortName: "Siti's Kitchen",
    age: 41,
    job: "Owner, Siti's Kitchen (home-based catering)",
    tenure: '2 years',
    avatar: '🍲',
    kind: 'business',
    requested: 20000,
    outcome: 'approved',
    savings: 6200,
    connectCards: [
      singpassCard('Siti Aminah'),
      {
        id: 'statement',
        title: 'Upload business bank statements',
        description: 'Last 12 months. A PDF, or photos of the printed pages.',
        buttonLabel: 'Upload PDF or photos',
        doneText: 'business_statements.pdf ✓ – 12 months of transactions read',
        icon: '🧾',
        kind: 'upload',
        checks: ["Business name matches Siti's Kitchen", 'Account ending 8890 · Nov 2025 – Oct 2026', 'No signs of editing'],
      },
      {
        id: 'platform',
        title: 'Connect sales platform (simulated)',
        description: 'Food-delivery and corporate order sales.',
        buttonLabel: 'Connect sales platform',
        doneText: 'Connected: 2 delivery platforms – 24 months of sales',
        icon: '🛵',
        kind: 'connect',
      },
      {
        id: 'invoices',
        title: 'Upload supplier invoices (simulated)',
        description: 'Ingredients, packaging and the oven quote.',
        buttonLabel: 'Upload invoices',
        doneText: 'supplier_invoices.zip ✓ – 36 invoices + oven quote',
        icon: '📦',
        kind: 'upload',
      },
    ],
    payoutAccount: 'business account ending 8890',
    earningsFileNote: '24 months of sales found',
    reasons: [
      { icon: '📈', text: 'Steady sales for 2 years' },
      { icon: '🧮', text: 'Running costs well controlled' },
      { icon: '🛡️', text: 'Can comfortably afford repayments (score 1.78)' },
    ],
    loan: {
      amount: 16000,
      months: 24,
      monthly: 724,
      totalRepayable: 17368,
      costOfBorrowing: 1368,
      ratePerYear: 8,
    },
  },
};

export const personaOrder: PersonaId[] = ['ali', 'siti', 'meiling'];

// ---------------------------------------------------------------------------
// Siti's Kitchen – business cash flow (monthly average over 12 months)
// ---------------------------------------------------------------------------

export const sitiBusiness = {
  sales: 20000,
  costs: [
    { label: 'Ingredients & packaging (35% of sales)', amount: 7000 },
    { label: 'Platform fees (10% of sales)', amount: 2000 },
    { label: 'Rent', amount: 3000 },
    { label: 'Staff wages', amount: 5000 },
    { label: 'Utilities & other', amount: 1000 },
  ],
  existingLoanRepayment: 400,
  // Festive peaks in Nov/Dec and Jan/Feb. Averages exactly S$20,000.
  monthlySales: [23000, 25000, 25000, 23000, 18000, 16000, 18000, 17000, 18000, 19000, 18000, 20000],
  // Costs are steadier. Averages exactly S$18,000.
  monthlyCosts: [19000, 20000, 20000, 19000, 17000, 17000, 17500, 17000, 17500, 17000, 17000, 18000],
  // Capital requirement inputs
  stockDays: 10,
  payoutWaitDays: 14,
  supplierCreditDays: 7,
  daysInMonth: 30,
  cashOnHand: 6200,
  equipmentQuote: 12000,
  // What she asked for, as the bank would quote it
  requestedLoan: {
    amount: 20000,
    months: 24,
    monthly: 905,
    totalRepayable: 21709,
    costOfBorrowing: 1709,
    ratePerYear: 8,
  } as LoanQuote,
};

// ---------------------------------------------------------------------------
// Bank dashboard
// ---------------------------------------------------------------------------

export const pilotMetrics = [
  { label: 'Applicants re-checked', value: '1,240', note: 'previously rejected for no payslip' },
  { label: 'Approved by FlowScore', value: '412 (33%)', note: 'of re-checked applicants' },
  { label: 'On-time repayment', value: '96.8%', note: 'FlowScore-approved loans' },
  { label: 'Avg decision time', value: '3 min 40 s', note: 'from consent to decision' },
];

export const portfolioSummary = {
  totalLent: 'S$1.86M',
  capitalHeld: 'S$139,500',
  expectedLoss: 'S$41,000',
};

export type RiskLevel = 'Low' | 'Low–Medium' | 'Medium' | 'High';
export type AppStatus = 'Approved' | 'Not yet' | 'Flagged' | 'Rejected' | 'In review';

export interface Signal {
  label: string;
  value: number; // 0–100
  note: string;
}

export interface Applicant {
  id: string;
  name: string;
  jobType: string;
  score: number; // 0–1000
  risk: RiskLevel;
  suggestedLimit: number;
  status: AppStatus;
  personaId?: PersonaId;
  flag?: string;
  flagDetail?: string;
  monthlyIncome: (number | null)[]; // null = no history
  incomeLabel: string;
  signals: Signal[];
  reasonCodes: string[];
  simpleCashFlow: { moneyIn: number; moneyOut: number; note?: string };
  probabilityOfDefault: number; // %
}

export const applicants: Applicant[] = [
  {
    id: 'ali',
    name: 'Ali Rahman',
    jobType: 'Ride-hail driver',
    score: 742,
    risk: 'Low',
    suggestedLimit: 3000,
    status: 'Approved',
    personaId: 'ali',
    monthlyIncome: personas.ali.cashFlow!.monthlyIn,
    incomeLabel: 'Ups and downs month to month, but a steady S$3,000 average.',
    signals: [
      { label: 'Income stability', value: 82, note: 'Steady average for 18+ months' },
      { label: 'Bills on time', value: 100, note: '24 of 24 bills on time' },
      { label: 'Savings buffer', value: 70, note: 'S$4,200 ≈ 1.4 months of income' },
      { label: 'Spending vs income', value: 73, note: 'Spends S$2,200 of S$3,000' },
    ],
    reasonCodes: [
      'Steady income for 18+ months',
      'Bills always paid on time',
      'Keeps savings of about 1.4 months of income',
      'New loan uses 33% of money left each month – comfortable',
    ],
    simpleCashFlow: { moneyIn: 3000, moneyOut: 2200 },
    probabilityOfDefault: 1.8,
  },
  {
    id: 'siti',
    name: "Siti's Kitchen (Siti Aminah)",
    jobType: 'Micro-SME (catering)',
    score: 705,
    risk: 'Low–Medium',
    suggestedLimit: 16000,
    status: 'Approved',
    personaId: 'siti',
    monthlyIncome: sitiBusiness.monthlySales,
    incomeLabel: 'Festive peaks (Nov–Feb), quieter mid-year. Steady S$20,000 average sales.',
    signals: [
      { label: 'Income stability', value: 74, note: 'Seasonal, but repeats every year' },
      { label: 'Bills on time', value: 96, note: 'Suppliers & loan paid on time' },
      { label: 'Savings buffer', value: 55, note: 'S$6,200 cash on hand' },
      { label: 'Spending vs income', value: 62, note: 'Costs S$18,000 of S$20,000 sales' },
    ],
    reasonCodes: [
      'Steady sales for 2 years',
      'Running costs well controlled',
      'Can comfortably afford repayments (score 1.78)',
      'Loan sized to real need (S$16,000, not S$20,000)',
    ],
    simpleCashFlow: { moneyIn: 20000, moneyOut: 18000 },
    probabilityOfDefault: 2.5,
  },
  {
    id: 'meiling',
    name: 'Mei Ling Tan',
    jobType: 'Online seller',
    score: 585,
    risk: 'Medium',
    suggestedLimit: 0,
    status: 'Not yet',
    personaId: 'meiling',
    monthlyIncome: [null, null, null, null, 1400, 1500, 2300, 2000, 2900, 2600, 3500, 3800],
    incomeLabel: 'Only 8 months of sales. Growing, but irregular.',
    signals: [
      { label: 'Income stability', value: 45, note: 'Growing but irregular, 8 months only' },
      { label: 'Bills on time', value: 60, note: '2 late payments recently' },
      { label: 'Savings buffer', value: 20, note: 'S$600 ≈ 0.2 months of income' },
      { label: 'Spending vs income', value: 50, note: 'Spends S$2,350 of S$2,500' },
    ],
    reasonCodes: [
      'Less than 12 months of sales history',
      '2 late bill payments recently',
      'Low savings buffer',
      'Re-check in 4 months – may qualify for up to S$2,000',
    ],
    simpleCashFlow: { moneyIn: 2500, moneyOut: 2350 },
    probabilityOfDefault: 6.9,
  },
  {
    id: 'jason',
    name: 'Jason Lim',
    jobType: 'Freelance consultant',
    score: 410,
    risk: 'High',
    suggestedLimit: 0,
    status: 'Flagged',
    flag: '⚠ Possible fake income',
    flagDetail: 'Money moved in and out between 2 accounts 14 times in 30 days to look like income.',
    monthlyIncome: [2100, 2000, 2200, 2100, 2000, 2100, 2200, 2100, 2000, 6800, 7200, 7500],
    incomeLabel: 'Sudden jump in the last 3 months – mostly round-trip transfers.',
    signals: [
      { label: 'Income stability', value: 25, note: 'Sudden 3× jump in last 3 months' },
      { label: 'Bills on time', value: 80, note: '1 late payment' },
      { label: 'Savings buffer', value: 15, note: 'Balance drops right after each transfer' },
      { label: 'Spending vs income', value: 30, note: '"Income" leaves again within 48 hours' },
    ],
    reasonCodes: [
      'Income tripled in the last 3 months with no new source of work',
      'Same money moved between 2 accounts 14 times in 30 days',
      'Balance falls back to normal within 48 hours of each deposit',
      'Needs a person to check before any decision',
    ],
    simpleCashFlow: {
      moneyIn: 7167,
      moneyOut: 6950,
      note: 'Figures unreliable – most "money in" is the same money moving in circles.',
    },
    probabilityOfDefault: 18.0,
  },
  {
    id: 'priya',
    name: 'Priya Nair',
    jobType: 'Food delivery rider',
    score: 718,
    risk: 'Low',
    suggestedLimit: 2500,
    status: 'Approved',
    monthlyIncome: [2300, 2500, 2400, 2200, 2600, 2400, 2500, 2300, 2600, 2500, 2400, 2600],
    incomeLabel: 'Very consistent weekly payouts.',
    signals: [
      { label: 'Income stability', value: 88, note: 'Very consistent payouts' },
      { label: 'Bills on time', value: 95, note: '1 late payment in 2 years' },
      { label: 'Savings buffer', value: 60, note: 'About 1 month of income' },
      { label: 'Spending vs income', value: 70, note: 'Spends S$1,900 of S$2,400' },
    ],
    reasonCodes: ['Very consistent income', 'Bills paid on time', 'Healthy savings'],
    simpleCashFlow: { moneyIn: 2400, moneyOut: 1900 },
    probabilityOfDefault: 1.6,
  },
  {
    id: 'daniel',
    name: 'Daniel Tan',
    jobType: 'Freelance designer',
    score: 640,
    risk: 'Medium',
    suggestedLimit: 4000,
    status: 'In review',
    monthlyIncome: [5200, 1200, 4800, 900, 6100, 2500, 3900, 1000, 5600, 3000, 4200, 2800],
    incomeLabel: 'Project-based – big months and quiet months.',
    signals: [
      { label: 'Income stability', value: 48, note: 'Large swings between projects' },
      { label: 'Bills on time', value: 90, note: 'Mostly on time' },
      { label: 'Savings buffer', value: 75, note: 'About 2 months of income' },
      { label: 'Spending vs income', value: 65, note: 'Spends S$2,700 of S$3,400' },
    ],
    reasonCodes: ['Income swings a lot between projects', 'Good savings cushion', 'Bills mostly on time'],
    simpleCashFlow: { moneyIn: 3400, moneyOut: 2700 },
    probabilityOfDefault: 3.9,
  },
  {
    id: 'aisyah',
    name: 'Nur Aisyah',
    jobType: 'Private tutor',
    score: 781,
    risk: 'Low',
    suggestedLimit: 5000,
    status: 'Approved',
    monthlyIncome: [3800, 4000, 3500, 3900, 4200, 4100, 4300, 3600, 3900, 4200, 4400, 4100],
    incomeLabel: 'Steady with exam-season peaks.',
    signals: [
      { label: 'Income stability', value: 86, note: 'Steady, regular students' },
      { label: 'Bills on time', value: 100, note: 'Always on time' },
      { label: 'Savings buffer', value: 85, note: 'About 3 months of income' },
      { label: 'Spending vs income', value: 78, note: 'Spends S$2,800 of S$4,000' },
    ],
    reasonCodes: ['Steady income for 2+ years', 'Bills always paid on time', 'Strong savings'],
    simpleCashFlow: { moneyIn: 4000, moneyOut: 2800 },
    probabilityOfDefault: 1.2,
  },
  {
    id: 'ravi',
    name: 'Ravi Kumar',
    jobType: 'Private-hire driver',
    score: 498,
    risk: 'High',
    suggestedLimit: 0,
    status: 'Rejected',
    monthlyIncome: [2600, 2400, 2200, 2000, 1900, 1700, 1600, 1500, 1400, 1300, 1200, 1100],
    incomeLabel: 'Income falling steadily for a year.',
    signals: [
      { label: 'Income stability', value: 30, note: 'Falling for 12 months' },
      { label: 'Bills on time', value: 55, note: '4 late payments' },
      { label: 'Savings buffer', value: 10, note: 'Almost no savings' },
      { label: 'Spending vs income', value: 20, note: 'Spends more than earns' },
    ],
    reasonCodes: ['Income falling for 12 months', 'Spending more than income', '4 late bill payments'],
    simpleCashFlow: { moneyIn: 1700, moneyOut: 1850 },
    probabilityOfDefault: 12.5,
  },
  {
    id: 'grace',
    name: 'Grace Wong',
    jobType: 'Home baker (online)',
    score: 668,
    risk: 'Medium',
    suggestedLimit: 2000,
    status: 'Approved',
    monthlyIncome: [2600, 3400, 2900, 2500, 1800, 1700, 1900, 2000, 1800, 1900, 2100, 2400],
    incomeLabel: 'Seasonal – strong around festive periods.',
    signals: [
      { label: 'Income stability', value: 58, note: 'Seasonal pattern' },
      { label: 'Bills on time', value: 92, note: 'Mostly on time' },
      { label: 'Savings buffer', value: 45, note: 'About 0.8 months of income' },
      { label: 'Spending vs income', value: 60, note: 'Spends S$1,800 of S$2,250' },
    ],
    reasonCodes: ['Seasonal but repeating income', 'Bills mostly on time', 'Smaller limit while savings grow'],
    simpleCashFlow: { moneyIn: 2250, moneyOut: 1800 },
    probabilityOfDefault: 3.1,
  },
];

// Capital the bank must hold – illustrative, simplified Basel-style inputs.
export const capitalInputs = {
  riskWeight: 0.75, // unsecured retail / small business
  minCapitalRatio: 0.1, // 10% minimum total capital ratio
  lossGivenDefault: 0.45, // 45%
};

export const fairnessCheck = [
  { group: '21–30', rate: 34 },
  { group: '31–45', rate: 33 },
  { group: '46–60', rate: 32 },
];
