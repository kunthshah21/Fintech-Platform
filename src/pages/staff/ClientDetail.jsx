import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { useStaff } from '../../context/StaffContext';
import StatusBadge from '../../components/staff/StatusBadge';
import DataTable from '../../components/staff/DataTable';

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

function formatDateTime(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

const TABS = ['Overview', 'Investments', 'Tickets', 'Notes'];

const investmentColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'product_type', label: 'Type', sortable: true },
  {
    key: 'amount_invested',
    label: 'Invested',
    sortable: true,
    render: (val) => <span className="tabular-nums">{formatCurrency(val)}</span>,
  },
  {
    key: 'current_value',
    label: 'Current Value',
    sortable: true,
    render: (val) => <span className="tabular-nums">{formatCurrency(val)}</span>,
  },
  {
    key: 'return_percent',
    label: 'Return',
    sortable: true,
    render: (val) => (
      <span className={`tabular-nums font-medium ${Number(val) >= 0 ? 'text-green' : 'text-red'}`}>
        {val != null ? `${Number(val).toFixed(1)}%` : '—'}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (val) => <StatusBadge status={val} />,
  },
  {
    key: 'start_date',
    label: 'Start',
    sortable: true,
    render: (val) => formatDate(val),
  },
  {
    key: 'maturity_date',
    label: 'Maturity',
    sortable: true,
    render: (val) => formatDate(val),
  },
];

const ticketColumns = [
  { key: 'ticket_number', label: 'Ticket', sortable: false },
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

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-border-light last:border-0">
      <span className="text-xs text-text-muted">{label}</span>
      <span className="text-xs font-medium text-text-primary text-right">{value || '—'}</span>
    </div>
  );
}

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchClientDetail, updateClientPriority, addStaffNote, updateTicketStatus } = useStaff();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Overview');
  const [priority, setPriority] = useState('');
  const [savingPriority, setSavingPriority] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const load = useCallback(async () => {
    const result = await fetchClientDetail(id);
    setData(result);
    setPriority(result.profile?.priority || '');
    setLoading(false);
  }, [id, fetchClientDetail]);

  useEffect(() => { load(); }, [load]);

  const handlePriorityChange = async (val) => {
    setPriority(val);
    setSavingPriority(true);
    await updateClientPriority(id, val);
    setSavingPriority(false);
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setAddingNote(true);
    const note = await addStaffNote(id, noteText.trim());
    if (note) {
      setData((prev) => ({ ...prev, notes: [note, ...prev.notes] }));
    }
    setNoteText('');
    setAddingNote(false);
  };

  const handleTicketStatusChange = async (ticketId, newStatus) => {
    const ok = await updateTicketStatus(ticketId, newStatus);
    if (ok) {
      setData((prev) => ({
        ...prev,
        tickets: prev.tickets.map((t) => t.id === ticketId ? { ...t, status: newStatus } : t),
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
      </div>
    );
  }

  if (!data?.profile) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-text-secondary">Client not found.</p>
        <button onClick={() => navigate('/staff/clients')} className="mt-2 text-xs text-accent hover:underline">
          Back to clients
        </button>
      </div>
    );
  }

  const { profile, investments, tickets, notes } = data;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/staff/clients')}
            className="h-8 w-8 rounded-md border border-border bg-white flex items-center justify-center hover:bg-bg-alt transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-text-primary">{profile.name || 'Unnamed'}</h1>
            <p className="text-xs text-text-muted">{profile.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] font-medium text-text-muted uppercase tracking-wide">Priority</label>
          <select
            value={priority}
            onChange={(e) => handlePriorityChange(e.target.value)}
            disabled={savingPriority}
            className="rounded-md border border-border bg-white px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/30 disabled:opacity-50"
          >
            <option value="">Unset</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-[13px] font-medium border-b-2 transition-colors ${
              tab === t ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text-secondary'
            }`}
          >
            {t}
            {t === 'Investments' && <span className="ml-1 text-[10px] text-text-muted">({investments.length})</span>}
            {t === 'Tickets' && <span className="ml-1 text-[10px] text-text-muted">({tickets.length})</span>}
            {t === 'Notes' && <span className="ml-1 text-[10px] text-text-muted">({notes.length})</span>}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="rounded-lg border border-border bg-white p-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Profile</h3>
            <InfoRow label="Name" value={profile.name} />
            <InfoRow label="Email" value={profile.email} />
            <InfoRow label="Mobile" value={profile.mobile} />
            <InfoRow label="Date of Birth" value={profile.dob} />
            <InfoRow label="Joined" value={formatDate(profile.joined_date)} />
            <InfoRow label="Referral Code" value={profile.referral_code} />
          </div>

          <div className="rounded-lg border border-border bg-white p-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">KYC & Onboarding</h3>
            <InfoRow label="KYC Status" value={<StatusBadge status={profile.kyc_status} />} />
            <InfoRow label="PAN" value={profile.pan_number ? '••••' + profile.pan_number.slice(-4) : '—'} />
            <InfoRow label="Aadhaar Verified" value={profile.aadhaar_verified ? 'Yes' : 'No'} />
            <InfoRow label="Bank Verified" value={profile.bank_verified ? 'Yes' : 'No'} />
            <InfoRow label="Onboarding" value={profile.onboarding_completed ? 'Completed' : 'Pending'} />
            <InfoRow label="Investor Quadrant" value={profile.investor_quadrant?.replace(/-/g, ' ')} />
            <InfoRow label="Risk Level" value={profile.risk_level} />
          </div>

          <div className="rounded-lg border border-border bg-white p-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Portfolio</h3>
            <InfoRow label="Total Invested" value={formatCurrency(profile.total_invested)} />
            <InfoRow label="Current Value" value={formatCurrency(profile.current_value)} />
            <InfoRow label="Total Returns" value={formatCurrency(profile.total_returns)} />
            <InfoRow label="Return %" value={profile.return_percent ? `${Number(profile.return_percent).toFixed(1)}%` : '—'} />
            <InfoRow label="Active Investments" value={profile.active_investments_count ?? 0} />
            <InfoRow label="XIRR" value={profile.xirr ? `${Number(profile.xirr).toFixed(1)}%` : '—'} />
            <InfoRow label="Wallet Balance" value={formatCurrency(profile.wallet_balance)} />
          </div>
        </div>
      )}

      {tab === 'Investments' && (
        <DataTable
          columns={investmentColumns}
          data={investments}
          emptyMessage="No investments found."
        />
      )}

      {tab === 'Tickets' && (
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="rounded-lg border border-border bg-white p-8 text-center">
              <p className="text-sm text-text-secondary">No tickets from this client.</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-lg border border-border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono text-text-muted">{ticket.ticket_number || ticket.id.slice(0, 8)}</span>
                      <StatusBadge status={ticket.status} />
                    </div>
                    <p className="text-sm font-medium text-text-primary">{ticket.subject}</p>
                    {ticket.description && (
                      <p className="text-xs text-text-secondary mt-1">{ticket.description}</p>
                    )}
                    <p className="text-[10px] text-text-muted mt-1.5">{ticket.category} &middot; {formatDateTime(ticket.created_at)}</p>
                  </div>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleTicketStatusChange(ticket.id, e.target.value)}
                    className="rounded-md border border-border bg-bg-alt px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/30 shrink-0"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'Notes' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-white p-4">
            <label className="block text-[11px] font-medium text-text-muted mb-1.5">Add a note</label>
            <div className="flex gap-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Type your note about this client..."
                rows={2}
                className="flex-1 rounded-md border border-border bg-bg-alt px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent/30 resize-none"
              />
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim() || addingNote}
                className="self-end rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:bg-border disabled:text-text-muted transition-colors inline-flex items-center gap-1.5"
              >
                {addingNote ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Add
              </button>
            </div>
          </div>

          {notes.length === 0 ? (
            <div className="rounded-lg border border-border bg-white p-8 text-center">
              <p className="text-sm text-text-secondary">No notes yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <div key={note.id} className="rounded-lg border border-border bg-white p-4">
                  <p className="text-sm text-text-primary whitespace-pre-wrap">{note.content}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-medium text-text-secondary">{note.profiles?.name || 'Staff'}</span>
                    <span className="text-[10px] text-text-muted">&middot;</span>
                    <span className="text-[10px] text-text-muted">{formatDateTime(note.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
