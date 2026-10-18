import type { ReactNode } from 'react';

const sources = ['Bank statements (PDF / photo)', 'Singpass', 'Earnings statements', 'E-wallet records'];

function Box({ x, y, w, h, fill, stroke, children }: { x: number; y: number; w: number; h: number; fill: string; stroke: string; children: ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill={fill} stroke={stroke} strokeWidth={2} />
      {children}
    </g>
  );
}

export default function HowItWorks() {
  // Layout columns (x positions) for the left-to-right flow
  const colY = 60;
  const flowY = 200; // vertical centre of the main flow

  return (
    <div className="mx-auto max-w-[1300px] space-y-8 px-6 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">How FlowScore works</h1>
        <p className="mt-2 text-lg text-gray-600">The bank lends. FlowScore helps it see your real income – only with your permission.</p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
        <svg viewBox="0 0 1240 420" className="min-w-[900px]" role="img" aria-label="FlowScore data flow diagram">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#0070C0" />
            </marker>
            <marker id="arrowGreen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
            </marker>
          </defs>

          {/* 1. Data sources */}
          <text x={110} y={colY - 22} textAnchor="middle" fontSize={13} fontWeight={700} fill="#6B7280">
            1 · DATA SOURCES
          </text>
          {sources.map((s, i) => {
            const y = colY + i * 72;
            return (
              <g key={s}>
                <Box x={20} y={y} w={180} h={52} fill="#F8FAFC" stroke="#CBD5E1">
                  <text x={110} y={y + 31} textAnchor="middle" fontSize={14} fontWeight={600} fill="#1F2937">
                    {s}
                  </text>
                </Box>
                <path d={`M 200 ${y + 26} C 230 ${y + 26}, 225 ${flowY}, 252 ${flowY}`} fill="none" stroke="#94A3B8" strokeWidth={1.5} />
              </g>
            );
          })}

          {/* 2. Customer permission */}
          <text x={320} y={colY - 22} textAnchor="middle" fontSize={13} fontWeight={700} fill="#6B7280">
            2 · PERMISSION
          </text>
          <Box x={255} y={flowY - 55} w={130} h={110} fill="#ECFDF5" stroke="#10B981">
            <text x={320} y={flowY - 14} textAnchor="middle" fontSize={30}>🔒</text>
            <text x={320} y={flowY + 16} textAnchor="middle" fontSize={14} fontWeight={700} fill="#065F46">Customer</text>
            <text x={320} y={flowY + 34} textAnchor="middle" fontSize={14} fontWeight={700} fill="#065F46">permission</text>
          </Box>
          <line x1={385} y1={flowY} x2={425} y2={flowY} stroke="#0070C0" strokeWidth={2.5} markerEnd="url(#arrow)" />

          {/* 3. FlowScore */}
          <text x={600} y={colY - 22} textAnchor="middle" fontSize={13} fontWeight={700} fill="#6B7280">
            3 · FLOWSCORE (THE HELPER)
          </text>
          <rect x={430} y={flowY - 95} width={340} height={190} rx={20} fill="#E8F3FB" stroke="#0070C0" strokeWidth={2} strokeDasharray="6 4" />
          {[
            { t: 'Read & check', s: 'statements, edits', e: '🧾' },
            { t: 'Cash-flow signals', s: 'income, bills, savings', e: '📈' },
            { t: 'Score + reasons', s: 'in plain English', e: '📝' },
          ].map((step, i) => {
            const x = 445 + i * 108;
            return (
              <g key={step.t}>
                <rect x={x} y={flowY - 60} width={96} height={120} rx={12} fill="white" stroke="#99C9EB" strokeWidth={1.5} />
                <text x={x + 48} y={flowY - 22} textAnchor="middle" fontSize={26}>{step.e}</text>
                <text x={x + 48} y={flowY + 12} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="#004C82">{step.t}</text>
                <text x={x + 48} y={flowY + 30} textAnchor="middle" fontSize={10.5} fill="#4B5563">{step.s}</text>
                {i < 2 && <line x1={x + 96} y1={flowY} x2={x + 108} y2={flowY} stroke="#0070C0" strokeWidth={2} markerEnd="url(#arrow)" />}
              </g>
            );
          })}
          <line x1={770} y1={flowY} x2={815} y2={flowY} stroke="#0070C0" strokeWidth={2.5} markerEnd="url(#arrow)" />

          {/* 4. Bank loan system */}
          <text x={895} y={colY - 22} textAnchor="middle" fontSize={13} fontWeight={700} fill="#6B7280">
            4 · THE BANK (THE LENDER)
          </text>
          <Box x={820} y={flowY - 55} w={150} h={110} fill="#0070C0" stroke="#004C82">
            <text x={895} y={flowY - 14} textAnchor="middle" fontSize={28}>🏦</text>
            <text x={895} y={flowY + 16} textAnchor="middle" fontSize={14} fontWeight={700} fill="white">Bank loan</text>
            <text x={895} y={flowY + 34} textAnchor="middle" fontSize={14} fontWeight={700} fill="white">system</text>
          </Box>
          <line x1={970} y1={flowY} x2={1015} y2={flowY} stroke="#0070C0" strokeWidth={2.5} markerEnd="url(#arrow)" />

          {/* 5. Decision */}
          <text x={1120} y={colY - 22} textAnchor="middle" fontSize={13} fontWeight={700} fill="#6B7280">
            5 · DECISION
          </text>
          {[
            { t: '✓ Approve', c: '#10B981', bg: '#ECFDF5' },
            { t: '✕ Reject', c: '#EF4444', bg: '#FEF2F2' },
            { t: '⇅ Set limit', c: '#F59E0B', bg: '#FFFBEB' },
          ].map((d, i) => (
            <Box key={d.t} x={1020} y={flowY - 80 + i * 56} w={200} h={46} fill={d.bg} stroke={d.c}>
              <text x={1120} y={flowY - 51 + i * 56} textAnchor="middle" fontSize={15} fontWeight={700} fill="#1F2937">
                {d.t}
              </text>
            </Box>
          ))}

          {/* Feedback loop */}
          <path d={`M 1120 ${flowY + 88} C 1120 400, 600 400, 600 ${flowY + 100}`} fill="none" stroke="#10B981" strokeWidth={2.5} strokeDasharray="8 5" markerEnd="url(#arrowGreen)" />
          <rect x={735} y={355} width={250} height={34} rx={17} fill="#ECFDF5" stroke="#10B981" />
          <text x={860} y={377} textAnchor="middle" fontSize={14} fontWeight={700} fill="#065F46">
            ↺ Repayment results improve the model
          </text>
        </svg>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          {
            icon: '🙋',
            title: 'For customers',
            points: ['A fair decision even without a payslip', 'Clear reasons and tips, in plain English', 'You choose what to share – and can stop anytime'],
          },
          {
            icon: '🏦',
            title: 'For banks',
            points: ['Safely lend to people other models miss', 'Decisions in minutes, with reasons to explain', 'Spot fake income before it costs you'],
          },
          {
            icon: '🌏',
            title: 'For Singapore',
            points: ['Supports gig workers and micro-businesses', 'Works with documents people already have', 'Responsible lending – borrow only what you need'],
          },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-4xl">{c.icon}</div>
            <h3 className="mt-3 text-xl font-bold text-gray-900">{c.title}</h3>
            <ul className="mt-3 space-y-2 text-base text-gray-700">
              {c.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
