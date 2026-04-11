import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useStaff } from '../../context/StaffContext';
import StatCard from '../../components/staff/StatCard';
import DataTable from '../../components/staff/DataTable';
import StatusBadge from '../../components/staff/StatusBadge';

function formatCurrency(n) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const ticketColumns = [
  { key: 'ticket_number', label: 'Ticket', sortable: false },
  {
    key: 'profiles',
    label: 'Client',
    sortable: false,
    render: (val) => val?.name || '—',
  },
  { key: 'subject', label: 'Subject', sortable: false },
  { key: 'category', label: 'Category', sortable: false },
  {
    key: 'status',
    label: 'Status',
    sortable: false,
    render: (val) => <StatusBadge status={val} />,
  },
  {
    key: 'created_at',
    label: 'Created',
    sortable: false,
    render: (val) => formatDate(val),
  },
];

const signupColumns = [
  { key: 'name', label: 'Name', sortable: false },
  { key: 'email', label: 'Email', sortable: false },
  {
    key: 'kyc_status',
    label: 'KYC',
    sortable: false,
    render: (val) => <StatusBadge status={val} />,
  },
  {
    key: 'onboarding_completed',
    label: 'Onboarded',
    sortable: false,
    render: (val) => (
      <span className={`text-[11px] font-medium ${val ? 'text-green' : 'text-text-muted'}`}>
        {val ? 'Yes' : 'No'}
      </span>
    ),
  },
  {
    key: 'created_at',
    label: 'Joined',
    sortable: false,
    render: (val) => formatDate(val),
  },
];

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { fetchDashboardStats, fetchAllTickets, fetchAllClients } = useStaff();
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [recentSignups, setRecentSignups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [s, tickets, clients] = await Promise.all([
        fetchDashboardStats(),
        fetchAllTickets(),
        fetchAllClients(),
      ]);
      if (cancelled) return;
      setStats(s);
      setRecentTickets(tickets.slice(0, 10));
      setRecentSignups(clients.slice(0, 10));
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [fetchDashboardStats, fetchAllTickets, fetchAllClients]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-text-primary">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Clients" value={stats?.totalClients ?? 0} />
        <StatCard label="Total AUM" value={formatCurrency(stats?.totalAum ?? 0)} />
        <StatCard label="Open Tickets" value={stats?.openTickets ?? 0} />
        <StatCard label="New Signups (7d)" value={stats?.newSignupsWeek ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">Recent Tickets</h2>
            <button
              onClick={() => navigate('/staff/tickets')}
              className="text-[11px] font-medium text-accent hover:underline"
            >
              View all
            </button>
          </div>
          <DataTable
            columns={ticketColumns}
            data={recentTickets}
            onRowClick={() => navigate('/staff/tickets')}
            emptyMessage="No tickets yet."
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">Recent Signups</h2>
            <button
              onClick={() => navigate('/staff/clients')}
              className="text-[11px] font-medium text-accent hover:underline"
            >
              View all
            </button>
          </div>
          <DataTable
            columns={signupColumns}
            data={recentSignups}
            onRowClick={(row) => navigate(`/staff/clients/${row.id}`)}
            emptyMessage="No clients yet."
          />
        </div>
      </div>
    </div>
  );
}
