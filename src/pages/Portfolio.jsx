import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IndianRupee, TrendingUp, PiggyBank, Percent, Download, LayoutGrid, List, Trash2, AlertTriangle, Briefcase, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  activeInvestments, completedInvestments, monthlyReturns,
  opportunities,
} from '../data/mockData';

const statusStyles = {
  on_track: { label: 'On Track', classes: 'bg-green-soft text-green' },
  delayed: { label: 'Delayed', classes: 'bg-amber-soft text-amber' },
  grace_period: { label: 'Grace Period', classes: 'bg-amber-soft text-amber' },
  default: { label: 'Default', classes: 'bg-red-soft text-red' },
  completed: { label: 'Completed', classes: 'bg-accent-soft text-accent' },
};

function PortfolioTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 shadow-md">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      <p className="text-sm font-medium text-green">₹{Number(payload[0].value).toLocaleString('en-IN')}</p>
    </div>
  );
}

export default function Portfolio() {
  const { watchlist, toggleWatchlist, portfolio, userInvestments } = useApp();
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState('table');

  const tabs = ['Active Investments', 'Completed', 'Watchlist', 'Cancelled'];
  const watchlistedOpps = opportunities.filter((o) => watchlist.includes(o.id));

  const hasInvestments = userInvestments.length > 0;
  const allocationMap = userInvestments.reduce((acc, inv) => {
    acc[inv.productType] = (acc[inv.productType] || 0) + inv.amountInvested;
    return acc;
  }, {});
  const dynamicAllocationData = Object.entries(allocationMap).map(([name, value], idx) => ({
    name,
    value,
    color: ['#18181B', '#6B7280', '#059669', '#9CA3AF', '#D1D5DB'][idx % 5],
  }));
  const total = dynamicAllocationData.reduce((s, d) => s + d.value, 0);
  const maxAlloc = total > 0 ? Math.max(...dynamicAllocationData.map((d) => d.value / total)) : 0;
  const concentrationWarning = maxAlloc > 0.4;

  if (!hasInvestments) {
    return (
      <div className="max-w-6xl space-y-6">
        <div data-tour="portfolio-summary" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: IndianRupee, label: 'Total invested', value: '₹0' },
            { icon: TrendingUp, label: 'Current value', value: '₹0' },
            { icon: PiggyBank, label: 'Total returns', value: '₹0' },
            { icon: Percent, label: 'XIRR', value: '0%' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-alt"><Icon className="h-4 w-4 text-text-secondary" /></div>
                <span className="text-xs font-medium text-text-muted">{label}</span>
              </div>
              <p className="text-xl font-semibold text-text-primary">{value}</p>
            </div>
          ))}
        </div>
        <div data-tour="portfolio-cta" className="rounded-xl border border-border bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-bg-alt mb-4">
            <Briefcase className="h-7 w-7 text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">No investments yet</h3>
          <p className="mt-2 text-sm text-text-secondary max-w-md mx-auto">
            You haven&apos;t made any investments yet. Explore the marketplace to find opportunities that match your risk profile.
          </p>
          <Link
            to="/dashboard/marketplace"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
          >
            Explore Marketplace <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: IndianRupee, label: 'Total invested', value: `₹${portfolio.totalInvested.toLocaleString('en-IN')}` },
          { icon: TrendingUp, label: 'Current value', value: `₹${portfolio.currentValue.toLocaleString('en-IN')}` },
          { icon: PiggyBank, label: 'Total returns', value: `₹${portfolio.totalReturns.toLocaleString('en-IN')}` },
          { icon: Percent, label: 'XIRR', value: `${portfolio.xirr}%` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-alt"><Icon className="h-4 w-4 text-text-secondary" /></div>
              <span className="text-xs font-medium text-text-muted">{label}</span>
            </div>
            <p className="text-xl font-semibold text-text-primary">{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-border">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === i ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab}
              {i === 2 && watchlist.length > 0 && (
                <span className="ml-1.5 bg-accent-soft text-accent text-[10px] font-semibold rounded-full px-1.5 py-0.5">{watchlist.length}</span>
              )}
            </button>
          ))}
        </div>
        {activeTab <= 1 && (
          <div className="hidden sm:flex rounded-lg border border-border overflow-hidden">
            <button onClick={() => setViewMode('table')} className={`p-1.5 transition-colors ${viewMode === 'table' ? 'bg-accent text-white' : 'text-text-muted hover:bg-bg-alt'}`}><List className="h-4 w-4" /></button>
            <button onClick={() => setViewMode('card')} className={`p-1.5 transition-colors ${viewMode === 'card' ? 'bg-accent text-white' : 'text-text-muted hover:bg-bg-alt'}`}><LayoutGrid className="h-4 w-4" /></button>
          </div>
        )}
      </div>

      {/* Active */}
      {activeTab === 0 && (
        <div>
          {viewMode === 'table' ? (
            <div className="rounded-xl border border-border bg-white overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-alt">
                    {['Opportunity', 'Type', 'Invested', 'Current', 'Returns', 'Next Repayment', 'Status'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {userInvestments.map((inv) => {
                    const s = statusStyles[inv.status] || statusStyles.on_track;
                    return (
                      <tr key={inv.id} className="hover:bg-bg-alt/50 transition-colors">
                        <td className="px-4 py-3">
                          <Link to={`/dashboard/opportunity/${inv.opportunityId}`} className="font-medium text-text-primary hover:underline">{inv.name}</Link>
                        </td>
                        <td className="px-4 py-3 text-text-secondary">{inv.productType}</td>
                        <td className="px-4 py-3 font-medium text-text-primary">₹{inv.amountInvested.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 font-medium text-text-primary">₹{inv.currentValue.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-green">+₹{inv.returnsEarned.toLocaleString('en-IN')}</span>
                          <span className="text-xs text-text-muted ml-1">({inv.returnPercent}%)</span>
                        </td>
                        <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                          {new Date(inv.nextRepayment).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${s.classes}`}>{s.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userInvestments.map((inv) => {
                const s = statusStyles[inv.status] || statusStyles.on_track;
                return (
                  <div key={inv.id} className="rounded-xl border border-border bg-white p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Link to={`/dashboard/opportunity/${inv.opportunityId}`} className="text-sm font-semibold text-text-primary hover:underline">{inv.name}</Link>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${s.classes}`}>{s.label}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-text-muted text-xs">Invested</span><p className="font-medium text-text-primary">₹{inv.amountInvested.toLocaleString('en-IN')}</p></div>
                      <div><span className="text-text-muted text-xs">Current</span><p className="font-medium text-text-primary">₹{inv.currentValue.toLocaleString('en-IN')}</p></div>
                      <div><span className="text-text-muted text-xs">Returns</span><p className="font-medium text-green">+₹{inv.returnsEarned.toLocaleString('en-IN')} ({inv.returnPercent}%)</p></div>
                      <div><span className="text-text-muted text-xs">Maturity</span><p className="font-medium text-text-primary">{new Date(inv.maturityDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</p></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Completed */}
      {activeTab === 1 && (
        <div className="rounded-xl border border-border bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-alt">
                {['Opportunity', 'Type', 'Invested', 'Final Value', 'Returns', 'Period', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {completedInvestments.map((inv) => (
                <tr key={inv.id} className="hover:bg-bg-alt/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-text-primary">{inv.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{inv.productType}</td>
                  <td className="px-4 py-3 font-medium text-text-primary">₹{inv.amountInvested.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-medium text-text-primary">₹{inv.finalValue.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-medium text-green">+₹{inv.totalReturns.toLocaleString('en-IN')} ({inv.returnPercent}%)</td>
                  <td className="px-4 py-3 text-text-secondary text-xs whitespace-nowrap">
                    {new Date(inv.startDate).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })} — {new Date(inv.maturityDate).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <Link to="/dashboard/marketplace" className="text-xs font-medium text-accent hover:underline">Reinvest</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Watchlist */}
      {activeTab === 2 && (
        <div>
          {watchlistedOpps.length === 0 ? (
            <div className="rounded-xl border border-border bg-white p-12 text-center">
              <p className="text-sm text-text-secondary mb-3">You haven&apos;t saved any opportunities yet.</p>
              <Link to="/dashboard/marketplace" className="text-sm font-medium text-accent hover:underline">Browse Marketplace</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {watchlistedOpps.map((opp) => (
                <div key={opp.id} className="rounded-xl border border-border bg-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-bg-alt flex items-center justify-center text-sm font-semibold text-text-secondary">{opp.issuerLogo}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{opp.issuer}</p>
                      <p className="text-xs text-text-muted">{opp.productType} · {opp.returnRate}% p.a. · {opp.tenure}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link to={`/dashboard/opportunity/${opp.id}`} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent/90">Invest</Link>
                    <button onClick={() => toggleWatchlist(opp.id)} className="p-1.5 rounded-lg hover:bg-bg-alt transition-colors"><Trash2 className="h-4 w-4 text-text-muted" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cancelled */}
      {activeTab === 3 && (
        <div className="rounded-xl border border-border bg-white p-12 text-center">
          <p className="text-sm text-text-secondary">No cancelled or failed investments.</p>
        </div>
      )}

      {/* Returns chart */}
      <div className="rounded-xl border border-border bg-white p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Monthly returns breakdown</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyReturns} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} width={50} />
            <Tooltip content={<PortfolioTooltip />} />
            <Bar dataKey="amount" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Diversification */}
      <div className="rounded-xl border border-border bg-white p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Diversification health check</h3>
        {concentrationWarning && (
          <div className="flex items-center gap-2 rounded-lg bg-amber-soft px-4 py-3 text-sm text-amber mb-4">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Over 40% of your portfolio is concentrated in a single product type. Consider diversifying.</span>
          </div>
        )}
        <div className="space-y-2">
          {dynamicAllocationData.map((d) => {
            const pct = ((d.value / total) * 100).toFixed(0);
            return (
              <div key={d.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-text-secondary">{d.name}</span>
                  <span className="font-medium text-text-primary">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-border-light overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
