import { MONTHS } from '../data/mockData';
import { sgd } from '../lib/calculations';

/** Round the axis up to a tidy number and return evenly spaced ticks. */
function niceAxis(rawMax: number) {
  const step = rawMax > 10000 ? 10000 : rawMax > 4000 ? 2000 : 1000;
  const max = Math.ceil(rawMax / step) * step;
  const ticks: number[] = [];
  for (let t = 0; t <= max; t += step) ticks.push(t);
  return { max, ticks };
}

const k = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `${n}`);

/** Grouped bar chart: money in vs money out over 12 months. */
export function InOutBarChart({
  moneyIn,
  moneyOut,
  inLabel = 'Money in',
  outLabel = 'Money out',
  height = 160,
}: {
  moneyIn: number[];
  moneyOut: number[];
  inLabel?: string;
  outLabel?: string;
  height?: number;
}) {
  const W = 320;
  const H = height;
  const pad = { l: 30, r: 4, t: 8, b: 18 };
  const { max, ticks } = niceAxis(Math.max(...moneyIn, ...moneyOut) * 1.05);
  const step = (W - pad.l - pad.r) / 12;
  const bw = step * 0.36;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / max);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${inLabel} vs ${outLabel} by month`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#E5E7EB" strokeWidth={1} />
            <text x={pad.l - 4} y={y(t) + 3} fontSize={8} textAnchor="end" fill="#6B7280">
              {k(t)}
            </text>
          </g>
        ))}
        {MONTHS.map((m, i) => {
          const x = pad.l + i * step + step * 0.12;
          const vi = moneyIn[i];
          const vo = moneyOut[i];
          return (
            <g key={m}>
              {vi > 0 && (
                <rect x={x} y={y(vi)} width={bw} height={y(0) - y(vi)} rx={1.5} fill="#0070C0">
                  <title>{`${m}: ${inLabel} ${sgd(vi)}`}</title>
                </rect>
              )}
              {vo > 0 && (
                <rect x={x + bw + 1} y={y(vo)} width={bw} height={y(0) - y(vo)} rx={1.5} fill="#F59E0B">
                  <title>{`${m}: ${outLabel} ${sgd(vo)}`}</title>
                </rect>
              )}
              <text x={x + bw} y={H - 5} fontSize={7.5} textAnchor="middle" fill="#6B7280">
                {m}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-brand-500" /> {inLabel}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-500" /> {outLabel}
        </span>
      </div>
    </div>
  );
}

/** Line chart of monthly income with a dashed average line. */
export function IncomeLineChart({ values, color = '#0070C0' }: { values: (number | null)[]; color?: string }) {
  const W = 560;
  const H = 200;
  const pad = { l: 44, r: 12, t: 12, b: 24 };
  const real = values.filter((v): v is number => v !== null);
  const { max, ticks } = niceAxis(Math.max(...real) * 1.05);
  const avg = real.reduce((a, b) => a + b, 0) / real.length;
  const step = (W - pad.l - pad.r) / 11;
  const x = (i: number) => pad.l + i * step;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const pts = values.map((v, i) => (v === null ? null : `${x(i)},${y(v)}`)).filter(Boolean) as string[];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Monthly income, last 12 months">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#E5E7EB" />
          <text x={pad.l - 6} y={y(t) + 4} fontSize={11} textAnchor="end" fill="#6B7280">
            {sgd(t)}
          </text>
        </g>
      ))}
      <line x1={pad.l} x2={W - pad.r} y1={y(avg)} y2={y(avg)} stroke="#10B981" strokeDasharray="6 4" strokeWidth={1.5} />
      <text x={W - pad.r} y={y(avg) - 5} fontSize={11} textAnchor="end" fill="#047857" fontWeight={600}>
        Average {sgd(avg)}
      </text>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
      {values.map((v, i) =>
        v === null ? null : (
          <circle key={i} cx={x(i)} cy={y(v)} r={3.5} fill="white" stroke={color} strokeWidth={2}>
            <title>{`${MONTHS[i]}: ${sgd(v)}`}</title>
          </circle>
        ),
      )}
      {MONTHS.map((m, i) => (
        <text key={m} x={x(i)} y={H - 6} fontSize={11} textAnchor="middle" fill={values[i] === null ? '#D1D5DB' : '#6B7280'}>
          {m}
        </text>
      ))}
    </svg>
  );
}

/** Semicircle gauge for the repayment safety score (DSCR). */
export function DscrGauge({ score }: { score: number }) {
  const min = 0;
  const max = 2.5;
  const cx = 120;
  const cy = 110;
  const r = 90;
  const angle = (v: number) => Math.PI * (1 - (Math.min(Math.max(v, min), max) - min) / (max - min));
  const pt = (v: number, rr = r) => [cx + rr * Math.cos(angle(v)), cy - rr * Math.sin(angle(v))];
  const arc = (a: number, b: number) => {
    const [x1, y1] = pt(a);
    const [x2, y2] = pt(b);
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  };
  const [nx, ny] = pt(score, r - 22);

  return (
    <svg viewBox="0 0 240 135" className="mx-auto w-full max-w-[260px]" role="img" aria-label={`Repayment safety score ${score}`}>
      <path d={arc(0, 1)} stroke="#EF4444" strokeWidth={18} fill="none" />
      <path d={arc(1, 1.25)} stroke="#F59E0B" strokeWidth={18} fill="none" />
      <path d={arc(1.25, 2.5)} stroke="#10B981" strokeWidth={18} fill="none" />
      {[0, 1, 1.25, 2.5].map((t) => {
        const [tx, ty] = pt(t, r + 16);
        return (
          <text key={t} x={tx} y={ty + 3} fontSize={9} textAnchor="middle" fill="#6B7280">
            {t}
          </text>
        );
      })}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#111827" strokeWidth={3} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={6} fill="#111827" />
      <text x={cx} y={cy + 22} fontSize={18} fontWeight={800} textAnchor="middle" fill="#111827">
        {score.toFixed(2)}
      </text>
    </svg>
  );
}
