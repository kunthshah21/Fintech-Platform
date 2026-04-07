import { Link } from 'react-router-dom';
import { Bookmark, Clock, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const riskColors = {
  Low: 'bg-green-soft text-green',
  Medium: 'bg-amber-soft text-amber',
  High: 'bg-red-soft text-red',
};

const productColors = {
  'Invoice Discounting': 'bg-accent-soft text-accent',
  'P2P Lending': 'bg-blue-soft text-blue',
  'Private Credit': 'bg-green-soft text-green',
  'Structured Debt': 'bg-amber-soft text-amber',
  'Revenue-Based Financing': 'bg-red-soft text-red',
};

export default function OpportunityCard({ opportunity, compact = false }) {
  const { watchlist, toggleWatchlist } = useApp();
  const o = opportunity;
  const isWatchlisted = watchlist.includes(o.id);

  const daysLeft = Math.max(0, Math.ceil((new Date(o.closingDate) - new Date()) / 86400000));

  return (
    <div className="rounded-xl border border-border bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-alt text-sm font-semibold text-text-secondary">
            {o.issuerLogo}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{o.issuer}</p>
            <span className={`inline-block mt-0.5 rounded-md px-2 py-0.5 text-[10px] font-semibold ${productColors[o.productType] || 'bg-bg-alt text-text-secondary'}`}>
              {o.productType}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); toggleWatchlist(o.id); }}
          className="p-1.5 rounded-lg hover:bg-bg-alt transition-colors shrink-0"
        >
          <Bookmark className={`h-4 w-4 ${isWatchlisted ? 'fill-accent text-accent' : 'text-text-muted'}`} />
        </button>
      </div>

      <div className="text-2xl font-semibold text-green tracking-tight">{o.returnRate}% <span className="text-sm font-medium text-text-muted">p.a.</span></div>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <span className="text-text-muted text-xs">Tenure</span>
          <p className="font-medium text-text-primary">{o.tenure}</p>
        </div>
        <div>
          <span className="text-text-muted text-xs">Min. investment</span>
          <p className="font-medium text-text-primary">₹{o.minInvestment.toLocaleString('en-IN')}</p>
        </div>
        {!compact && (
          <>
            <div>
              <span className="text-text-muted text-xs">Risk</span>
              <p className={`inline-block mt-0.5 rounded-md px-2 py-0.5 text-[10px] font-semibold ${riskColors[o.riskRating]}`}>{o.riskRating}</p>
            </div>
            <div>
              <span className="text-text-muted text-xs">Credit rating</span>
              <p className="font-medium text-text-primary">{o.creditRating}</p>
            </div>
          </>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-text-muted mb-1">
          <span>{o.fundedPercent}% funded</span>
          <span>{o.slotsRemaining} slots left</span>
        </div>
        <div className="h-1.5 rounded-full bg-border-light overflow-hidden">
          <div className="h-full rounded-full bg-green transition-all" style={{ width: `${o.fundedPercent}%` }} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {daysLeft <= 7 && (
          <span className="flex items-center gap-1 text-xs font-medium text-amber">
            <AlertTriangle className="h-3 w-3" />
            {daysLeft === 0 ? 'Closing today' : `${daysLeft}d left`}
          </span>
        )}
        {daysLeft > 7 && (
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Clock className="h-3 w-3" />
            Closes {new Date(o.closingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        )}
        <Link
          to={`/dashboard/opportunity/${o.id}`}
          className="rounded-lg bg-accent px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent/90"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
