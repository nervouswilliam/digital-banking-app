# FlowScore – clickable MVP demo

A showcase-only demo for a university fintech hackathon. **No backend, no real APIs, no real data.**
Every screen uses hard-coded mock data, so the demo behaves exactly the same every time.

- **Merlion Digital Bank** is a fictional bank. It is always the lender.
- **FlowScore** is the helper behind the scenes: with the customer's permission it looks at how money
  actually flows through their accounts and gives the bank a score plus plain-English reasons.

## How to run

You need Node.js 18 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:5173. The app works offline: it makes no external network calls.

To make a production build: `npm run build` (output in `dist/`). Preview it with `npm run preview`.

## What's inside

| Path | What it holds |
| --- | --- |
| `src/data/mockData.ts` | All personas, loan quotes, applicants, chart data and dashboard numbers |
| `src/lib/calculations.ts` | Pure functions for every formula (money left, debt-to-income, DSCR, cash cycle, working capital, capital to hold, expected loss) |
| `src/customer/` | The customer journey inside the phone frame |
| `src/bank/BankDashboard.tsx` | The credit team dashboard |
| `src/HowItWorks.tsx` | The left-to-right diagram and benefit cards |

**Presenter menu** (top right): choose the persona (Ali, Siti's Kitchen, Mei Ling) or **Reset demo**.
Choosing a persona or resetting always returns the phone to the Welcome screen.

| Persona | Asks for | Result |
| --- | --- | --- |
| Ali Rahman, ride-hail driver | S$3,000 | Approved: S$260/month × 12, total S$3,115 |
| Siti's Kitchen (Siti Aminah), micro-SME | S$20,000 | Approved for S$16,000: S$724/month × 24, total S$17,368 |
| Mei Ling Tan, online seller | S$5,000 | Not yet, with reasons and tips |

Note: monthly payments are rounded to the nearest dollar, which is why S$260 × 12 isn't exactly S$3,115.
The result screen says so in small print.

---

## Demo script (about 2 minutes)

**Setup:** open the app on the **Customer App** tab. The Presenter menu shows **Ali**.

### 1. Ali, the gig worker (~40 s)
1. "Ali drives for a ride-hail app. He earns about S$3,000 a month, but he has no payslip, so banks say no."
2. **Start.** Point at the *Who is who* card: "The loan comes from Merlion Digital Bank. FlowScore only helps the bank understand his income."
3. **Your permission:** "He sees exactly what's shared and what isn't, and access ends after 30 days." Tick **I agree**, then **Continue**.
4. **Share your info:** tap all three. "Singpass for ID, then he uploads his bank statement – a PDF or just photos of the printed pages – and his earnings statement. No bank log-in needed. FlowScore reads the statement and checks it hasn't been edited." Then **Continue**.
5. **Your money at a glance:** "S$3,000 in, S$2,200 out, so S$800 is left. The new S$260 payment uses 33% of that, which is comfortable." Then **See my result**.
6. **Result:** "In plain words: you get S$3,000, you pay S$260 a month, and the cost of borrowing is S$115." Tap **Accept loan**.

### 2. Siti's Kitchen, the micro-business (~40 s)
1. Presenter → **Siti's Kitchen**. Run Start → I agree → complete all 4 (Singpass, business bank statements, sales platform, supplier invoices) → Continue.
2. **Business cash flow:** "S$20,000 in sales, S$18,000 in running costs, so S$2,000 is left from operations."
3. **How much do you need?:** "Her cash is tied up for 17 days, at S$600 a day, so she needs S$10,200 to keep running. She has S$6,200, which leaves a S$4,000 gap. Add the S$12,000 oven and she needs S$16,000, not the S$20,000 she asked for."
4. **Can you afford it?:** "Her safety score is 1.78, in the green zone."
5. **Result:** tap **I still want S$20,000** to show the comparison: "That's still affordable, but it costs her S$4,341 more in total." Tap **Take S$16,000 (recommended)**.

### 3. Mei Ling, not yet (~15 s)
1. Presenter → **Mei Ling**. Run through quickly to the result.
2. "This isn't a flat no. She sees why, gets 3 simple steps to take, and we'll remind her in 4 months." Tap **Remind me in 4 months**.

### 4. Bank Dashboard (~25 s)
1. Switch to the **Bank Dashboard** tab. "This is what the bank's credit team sees. Pilot results: 412 extra approvals and 96.8% on-time repayment."
2. Click **Siti's Kitchen**, then the **Cash flow** tab: "The same numbers the customer saw: DSCR 1.78, a S$4,000 working capital gap and a 17-day cash cycle."
3. Scroll to **Capital the bank must hold**: "For Siti's S$16,000 loan, the bank sets aside S$1,200 of its own money. Expected loss is S$180."
4. Click **Jason Lim**: "FlowScore also catches tricks. He moved money in and out between 2 accounts 14 times in 30 days to look like income." Click **Send for human review**.

Close on **How It Works** if time allows. Use **Presenter → Reset demo** before the next run.

---

*Demo only – fictional data. Not a real bank, product or credit decision. The capital figures are illustrative; actual requirements follow MAS Notice 637.*
