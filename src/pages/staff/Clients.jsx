import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Filter } from 'lucide-react';
import { useStaff } from '../../context/StaffContext';
import DataTable from '../../components/staff/DataTable';
import StatusBadge from '../../components/staff/StatusBadge';

function formatCurrency(n) {
  if (!n) return '₹0';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  {
    key: 'kyc_status',
    label: 'KYC',
    sortable: true,
    render: (val) => <StatusBadge status={val} />,
  },
  {
    key: 'priority',
    label: 'Priority',
    sortable: true,
    render: (val) => val ? <StatusBadge status={val} /> : <span className="text-text-muted text-[11px]">—</span>,
  },
  {
    key: 'total_invested',
    label: 'Invested',
    sortable: true,
    render: (val) => <span className="tabular-nums">{formatCurrency(val)}</span>,
  },
  {
    key: 'active_investments_count',
    label: 'Active',
    sortable: true,
    render: (val) => val ?? 0,
  },
  {
    key: 'onboarding_completed',
    label: 'Onboarded',
    sortable: true,
    render: (val) => (
      <span className={`text-[11px] font-medium ${val ? 'text-green' : 'text-text-muted'}`}>
        {val ? 'Yes' : 'No'}
      </span>
    ),
  },
  {
    key: 'joined_date',
    label: 'Joined',
    sortable: true,
    render: (val) => formatDate(val),
  },
];

export default function Clients() {
  const navigate = useNavigate();
  const { fetchAllClients } = useStaff();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAllClients().then((data) => {
      if (!cancelled) {
        setClients(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [fetchAllClients]);

  const filtered = useMemo(() => {
    let list = clients;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q)
      );
    }

    if (kycFilter) {
      list = list.filter((c) => c.kyc_status === kycFilter);
    }

    if (priorityFilter) {
      if (priorityFilter === 'unset') {
        list = list.filter((c) => !c.priority);
      } else {
        list = list.filter((c) => c.priority === priorityFilter);
      }
    }

    return list;
  }, [clients, search, kycFilter, priorityFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-text-primary">Clients</h1>
        <span className="text-xs text-text-muted">{filtered.length} of {clients.length}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-md border border-border bg-white pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
            showFilters ? 'border-accent bg-accent-soft text-accent' : 'border-border bg-white text-text-secondary hover:bg-bg-alt'
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 p-3 rounded-md border border-border bg-white">
          <div>
            <label className="block text-[10px] font-medium text-text-muted uppercase tracking-wide mb-1">KYC Status</label>
            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="rounded-md border border-border bg-bg-alt px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/30"
            >
              <option value="">All</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="verified">Verified</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-text-muted uppercase tracking-wide mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-md border border-border bg-bg-alt px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/30"
            >
              <option value="">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="unset">Unset</option>
            </select>
          </div>
          {(kycFilter || priorityFilter) && (
            <button
              onClick={() => { setKycFilter(''); setPriorityFilter(''); }}
              className="self-end text-[11px] font-medium text-accent hover:underline mb-1"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => navigate(`/staff/clients/${row.id}`)}
        emptyMessage="No clients match your filters."
      />
    </div>
  );
}
