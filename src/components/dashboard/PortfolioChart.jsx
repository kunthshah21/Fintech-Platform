import { useState, useMemo } from 'react';
import { LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/AppContext';

const ranges = [
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
  { label: 'All', days: Infinity },
];

function toDateKey(input) {
  return new Date(input).toISOString().split('T')[0];
}

function buildLiveHistory({ portfolio, userInvestments, userTransactions }) {
  const todayKey = toDateKey(new Date());
  const investmentTransactions = (userTransactions || [])
    .filter((t) => t.type === 'investment' && t.status === 'completed')
    .map((t) => ({ date: toDateKey(t.date), amount: Math.abs(Number(t.amount) || 0) }));

  const repaymentsByDate = (userTransactions || [])
    .filter((t) => t.type === 'repayment' && t.status === 'completed' && (Number(t.amount) || 0) > 0)
    .reduce((acc, t) => {
      const key = toDateKey(t.date);
      acc[key] = (acc[key] || 0) + Number(t.amount);
      return acc;
    }, {});

  if (investmentTransactions.length === 0 && (!userInvestments || userInvestments.length === 0)) {
    return [{ date: todayKey, value: portfolio.currentValue || 0, fd: portfolio.currentValue || 0 }];
  }

  const inferredInvestments = (userInvestments || []).map((inv) => ({
    date: toDateKey(inv.startDate),
    amount: Number(inv.amountInvested) || 0,
  }));

  const mergedInvestments = [...investmentTransactions, ...inferredInvestments].sort((a, b) => a.date.localeCompare(b.date));
  const firstDate = mergedInvestments[0]?.date || todayKey;

  const investedByDate = mergedInvestments.reduce((acc, item) => {
    acc[item.date] = (acc[item.date] || 0) + item.amount;
    return acc;
  }, {});

  const start = new Date(firstDate);
  const end = new Date(todayKey);
  const totalDays = Math.max(1, Math.round((end - start) / 86400000));
  const totalInvested = Math.max(0, Number(portfolio.totalInvested) || 0);
  const totalReturns = Number(portfolio.totalReturns) || 0;
  const totalRepayments = Object.values(repaymentsByDate).reduce((sum, amount) => sum + amount, 0);

  let runningInvested = 0;
  let runningRepayments = 0;
  const history = [];

  for (let i = 0; i <= totalDays; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = toDateKey(d);

    runningInvested += investedByDate[key] || 0;
    runningRepayments += repaymentsByDate[key] || 0;

    const timeProgress = i / totalDays;
    const investedProgress = totalInvested > 0 ? Math.min(1, runningInvested / totalInvested) : 1;
    const repaymentProgress = totalRepayments > 0 ? Math.min(1, runningRepayments / totalRepayments) : 0;
    const returnProgress = Math.min(1, (0.65 * investedProgress) + (0.25 * timeProgress) + (0.1 * repaymentProgress));

    const value = Math.round(runningInvested + (totalReturns * returnProgress));
    history.push({
      date: key,
      value: i === totalDays ? Math.round(portfolio.currentValue || value) : value,
      fd: Math.round(runningInvested + (runningInvested * 0.07 * timeProgress)),
    });
  }

  return history;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 shadow-md">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm font-medium" style={{ color: entry.color }}>
          ₹{Number(entry.value).toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  );
}

export default function PortfolioChart() {
  const { isNewUser, portfolio, userInvestments, userTransactions } = useApp();
  const [range, setRange] = useState('1Y');
  const [showBenchmark, setShowBenchmark] = useState(false);

  const liveHistory = useMemo(
    () => buildLiveHistory({ portfolio, userInvestments, userTransactions }),
    [portfolio, userInvestments, userTransactions]
  );

  if (isNewUser) {
    return (
      <div className="rounded-xl border border-border bg-white p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Portfolio performance</h3>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-alt mb-3">
            <LineChartIcon className="h-6 w-6 text-text-muted" />
          </div>
          <p className="text-sm text-text-secondary">No performance data yet</p>
          <p className="text-xs text-text-muted mt-1">Your portfolio chart will appear here once you start investing.</p>
        </div>
      </div>
    );
  }

  const data = useMemo(() => {
    const r = ranges.find((r) => r.label === range);
    const sliced = r.days === Infinity ? liveHistory : liveHistory.slice(-r.days);
    return sliced.filter((_, i) => {
      if (sliced.length <= 60) return true;
      return i % Math.ceil(sliced.length / 60) === 0 || i === sliced.length - 1;
    });
  }, [range, liveHistory]);

  const pnl = data.length >= 2 ? data[data.length - 1].value - data[0].value : 0;
  const pnlPercent = data.length >= 2 ? ((pnl / data[0].value) * 100).toFixed(1) : 0;

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Portfolio performance</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-sm font-medium ${pnl >= 0 ? 'text-green' : 'text-red'}`}>
              {pnl >= 0 ? '+' : ''}₹{Math.abs(pnl).toLocaleString('en-IN')} ({pnlPercent}%)
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          {ranges.map((r) => (
            <button
              key={r.label}
              onClick={() => setRange(r.label)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                range === r.label ? 'bg-accent text-white' : 'text-text-muted hover:bg-bg-alt'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => {
              const d = new Date(v);
              return `${d.toLocaleString('en', { month: 'short' })} ${String(d.getDate()).padStart(2, '0')}`;
            }}
            interval="preserveStartEnd"
            minTickGap={50}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} dot={false} name="Portfolio" />
          {showBenchmark && (
            <Line type="monotone" dataKey="fd" stroke="#9CA3AF" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="FD Rate" />
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-3 flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={showBenchmark}
            onChange={(e) => setShowBenchmark(e.target.checked)}
            className="rounded border-border"
          />
          Compare with FD rate
        </label>
      </div>
    </div>
  );
}
