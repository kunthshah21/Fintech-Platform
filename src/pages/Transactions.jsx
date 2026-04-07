import { useState, useMemo } from 'react';
import { Wallet, Plus, ArrowDownToLine, Download, FileText, ArrowLeftRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { transactions as mockTransactions } from '../data/mockData';

const typeLabels = {
  investment: { label: 'Investment', classes: 'bg-accent-soft text-accent' },
  repayment: { label: 'Repayment', classes: 'bg-green-soft text-green' },
  wallet_topup: { label: 'Top-Up', classes: 'bg-blue-soft text-blue' },
  withdrawal: { label: 'Withdrawal', classes: 'bg-amber-soft text-amber' },
  refund: { label: 'Refund', classes: 'bg-red-soft text-red' },
};

const statusStyles = {
  completed: { label: 'Completed', classes: 'bg-green-soft text-green' },
  pending: { label: 'Pending', classes: 'bg-amber-soft text-amber' },
  failed: { label: 'Failed', classes: 'bg-red-soft text-red' },
};

export default function Transactions() {
  const { walletBalance, isNewUser } = useApp();
  const transactions = isNewUser ? [] : mockTransactions;
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statementPeriod, setStatementPeriod] = useState('monthly');
  const [statementFormat, setStatementFormat] = useState('pdf');

  if (isNewUser) {
    return (
      <div className="max-w-6xl space-y-6">
        <h1 className="text-xl font-semibold text-text-primary">Transactions & statements</h1>
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-alt">
              <Wallet className="h-6 w-6 text-text-secondary" />
            </div>
            <div>
              <p className="text-xs font-medium text-text-muted">Wallet balance</p>
              <p className="text-2xl font-semibold text-text-primary">₹0</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-bg-alt mb-4">
            <ArrowLeftRight className="h-7 w-7 text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">No transactions yet</h3>
          <p className="mt-2 text-sm text-text-secondary max-w-md mx-auto">
            Your investment activity, repayments, and wallet transactions will appear here.
          </p>
        </div>
      </div>
    );
  }

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (dateFrom && t.date < dateFrom) return false;
      if (dateTo && t.date > dateTo) return false;
      return true;
    });
  }, [typeFilter, statusFilter, dateFrom, dateTo]);

  const recentWallet = transactions.filter((t) => t.type === 'wallet_topup' || t.type === 'withdrawal').slice(0, 5);

  return (
    <div className="max-w-6xl space-y-6">
      <h1 className="text-xl font-semibold text-text-primary">Transactions & statements</h1>

      {/* Wallet */}
      <div className="rounded-xl border border-border bg-white p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-alt">
              <Wallet className="h-6 w-6 text-text-secondary" />
            </div>
            <div>
              <p className="text-xs font-medium text-text-muted">Wallet balance</p>
              <p className="text-2xl font-semibold text-text-primary">₹{walletBalance.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors">
              <Plus className="h-4 w-4" /> Add Money
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-alt transition-colors">
              <ArrowDownToLine className="h-4 w-4" /> Withdraw
            </button>
          </div>
        </div>

        {recentWallet.length > 0 && (
          <div className="mt-4 border-t border-border-light pt-4">
            <p className="text-xs font-medium text-text-muted mb-2">Recent wallet activity</p>
            <div className="space-y-2">
              {recentWallet.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{t.description}</span>
                  <span className={`font-medium ${t.amount >= 0 ? 'text-green' : 'text-red'}`}>
                    {t.amount >= 0 ? '+' : ''}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="text-xs font-medium text-text-muted mb-1 block">From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-muted mb-1 block">To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-muted mb-1 block">Type</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20">
            <option value="all">All Types</option>
            <option value="investment">Investment</option>
            <option value="repayment">Repayment</option>
            <option value="wallet_topup">Wallet Top-Up</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="refund">Refund</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-text-muted mb-1 block">Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20">
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Transaction table */}
      <div className="rounded-xl border border-border bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-alt">
              {['Date', 'Transaction ID', 'Description', 'Type', 'Amount', 'Status', 'Reference', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {filtered.map((t) => {
              const tl = typeLabels[t.type] || typeLabels.investment;
              const sl = statusStyles[t.status] || statusStyles.completed;
              return (
                <tr key={t.id} className="hover:bg-bg-alt/50 transition-colors">
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                    {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-text-muted font-mono text-xs">{t.id}</td>
                  <td className="px-4 py-3 font-medium text-text-primary max-w-[200px] truncate">{t.description}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${tl.classes}`}>{tl.label}</span>
                  </td>
                  <td className={`px-4 py-3 font-semibold ${t.amount >= 0 ? 'text-green' : 'text-red'}`}>
                    {t.amount >= 0 ? '+' : ''}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${sl.classes}`}>{sl.label}</span>
                  </td>
                  <td className="px-4 py-3 text-text-muted text-xs font-mono">{t.reference}</td>
                  <td className="px-4 py-3">
                    <button className="p-1 rounded hover:bg-bg-alt transition-colors">
                      <Download className="h-3.5 w-3.5 text-text-muted" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-text-muted">No transactions match your filters.</div>
        )}
      </div>

      {/* Statement download */}
      <div className="rounded-xl border border-border bg-white p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Download statement</h3>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Period</label>
            <select value={statementPeriod} onChange={(e) => setStatementPeriod(e.target.value)} className="rounded-lg border border-border bg-bg-alt px-3 py-2 text-sm text-text-primary">
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Format</label>
            <select value={statementFormat} onChange={(e) => setStatementFormat(e.target.value)} className="rounded-lg border border-border bg-bg-alt px-3 py-2 text-sm text-text-primary">
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors">
            <FileText className="h-4 w-4" /> Generate Statement
          </button>
        </div>
      </div>
    </div>
  );
}
