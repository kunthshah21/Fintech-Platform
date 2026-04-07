import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { upcomingRepayments } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const statusStyles = {
  on_track: { label: 'On track', classes: 'bg-green-soft text-green' },
  delayed: { label: 'Delayed', classes: 'bg-red-soft text-red' },
  received: { label: 'Received', classes: 'bg-accent-soft text-accent' },
};

export default function RepaymentWidget() {
  const { isNewUser } = useApp();

  if (isNewUser) {
    return (
      <div className="rounded-xl border border-border bg-white p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Upcoming repayments</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-alt mb-3">
            <Calendar className="h-5 w-5 text-text-muted" />
          </div>
          <p className="text-sm text-text-secondary">No upcoming repayments</p>
          <p className="text-xs text-text-muted mt-1">Repayment schedules appear here once you invest.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Upcoming repayments</h3>
        <Link to="/dashboard/transactions" className="text-xs font-medium text-text-muted hover:text-text-secondary transition-colors flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {upcomingRepayments.slice(0, 4).map((r) => {
          const s = statusStyles[r.status] || statusStyles.on_track;
          return (
            <div key={r.id} className="flex items-center justify-between py-2 border-b border-border-light last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-alt">
                  <Calendar className="h-4 w-4 text-text-muted" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{r.name}</p>
                  <p className="text-xs text-text-muted">{new Date(r.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-semibold text-text-primary">₹{r.amount.toLocaleString('en-IN')}</span>
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${s.classes}`}>{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
