import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 shadow-md text-left">
      {label && <p className="text-[10px] text-text-muted mb-0.5">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.dataKey || entry.name} className="text-xs font-medium" style={{ color: entry.color || entry.fill || '#18181B' }}>
          {entry.name}: {entry.value?.toLocaleString?.('en-IN') ?? entry.value}
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 shadow-md text-left">
      <p className="text-[10px] font-medium text-text-primary">{d.name}</p>
      <p className="text-xs font-semibold text-text-primary">₹{Number(d.value).toLocaleString('en-IN')}</p>
    </div>
  );
}

const xAxisProps = {
  tick: { fontSize: 10, fill: '#9CA3AF' },
  tickLine: false,
  axisLine: false,
  interval: 'preserveStartEnd',
  minTickGap: 40,
};

const yAxisProps = (fmt) => ({
  tick: { fontSize: 10, fill: '#9CA3AF' },
  tickLine: false,
  axisLine: false,
  width: 48,
  tickFormatter: fmt,
});

export default function ChatChart({ config }) {
  if (!config) return null;

  const { type, data } = config;
  const height = 200;

  if (type === 'line') {
    const { xKey, lines, yFormat } = config;
    return (
      <div className="mt-3 -mx-1">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey={xKey}
              {...xAxisProps}
              tickFormatter={(v) => {
                if (xKey === 'date') {
                  const d = new Date(v);
                  return `${d.toLocaleString('en', { month: 'short' })} ${d.getDate()}`;
                }
                return v;
              }}
            />
            <YAxis {...yAxisProps(yFormat)} />
            <Tooltip content={<ChartTooltip />} />
            {lines.map((l) => (
              <Line
                key={l.dataKey}
                type="monotone"
                dataKey={l.dataKey}
                stroke={l.stroke}
                strokeWidth={2}
                dot={false}
                name={l.name}
                strokeDasharray={l.strokeDasharray}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'bar') {
    const { xKey, bars, yFormat, colorByItem } = config;
    return (
      <div className="mt-3 -mx-1">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey={xKey} {...xAxisProps} />
            <YAxis {...yAxisProps(yFormat)} />
            <Tooltip content={<ChartTooltip />} />
            {bars.map((b) =>
              colorByItem ? (
                <Bar key={b.dataKey} dataKey={b.dataKey} name={b.name} radius={[4, 4, 0, 0]}>
                  {data.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill || b.fill || '#18181B'} />
                  ))}
                </Bar>
              ) : (
                <Bar key={b.dataKey} dataKey={b.dataKey} fill={b.fill || '#18181B'} name={b.name} radius={[4, 4, 0, 0]} />
              )
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'pie') {
    const total = data.reduce((s, d) => s + d.value, 0);
    return (
      <div className="mt-3">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value" strokeWidth={0}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-1 mt-1">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-text-secondary">{d.name}</span>
              </div>
              <span className="text-text-muted">{((d.value / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
