import { PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { allocationData } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-text-primary">{d.name}</p>
      <p className="text-sm font-semibold text-text-primary">₹{Number(d.value).toLocaleString('en-IN')}</p>
    </div>
  );
}

export default function AllocationDonut() {
  const { isNewUser } = useApp();
  const total = allocationData.reduce((s, d) => s + d.value, 0);

  if (isNewUser) {
    return (
      <div className="rounded-xl border border-border bg-white p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Asset allocation</h3>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-alt mb-3">
            <PieChartIcon className="h-6 w-6 text-text-muted" />
          </div>
          <p className="text-sm text-text-secondary">No allocation data yet</p>
          <p className="text-xs text-text-muted mt-1">Your asset breakdown will show here after your first investment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Asset allocation</h3>

      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={allocationData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {allocationData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="w-full space-y-2 mt-2">
          {allocationData.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-text-secondary">{d.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-text-muted text-xs">{((d.value / total) * 100).toFixed(0)}%</span>
                <span className="font-medium text-text-primary">₹{d.value.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
