import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Filter, ChevronDown, ChevronRight } from 'lucide-react';
import { useStaff } from '../../context/StaffContext';
import StatusBadge from '../../components/staff/StatusBadge';

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

export default function Tickets() {
  const navigate = useNavigate();
  const { fetchAllTickets, updateTicketStatus } = useStaff();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [resolutionDrafts, setResolutionDrafts] = useState({});

  useEffect(() => {
    let cancelled = false;
    fetchAllTickets().then((data) => {
      if (!cancelled) {
        setTickets(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [fetchAllTickets]);

  const categories = useMemo(() => {
    const set = new Set(tickets.map((t) => t.category).filter(Boolean));
    return [...set].sort();
  }, [tickets]);

  const filtered = useMemo(() => {
    let list = tickets;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        (t.ticket_number || '').toLowerCase().includes(q) ||
        (t.subject || '').toLowerCase().includes(q) ||
        (t.profiles?.name || '').toLowerCase().includes(q) ||
        (t.profiles?.email || '').toLowerCase().includes(q)
      );
    }

    if (statusFilter) {
      list = list.filter((t) => t.status === statusFilter);
    }

    if (categoryFilter) {
      list = list.filter((t) => t.category === categoryFilter);
    }

    return list;
  }, [tickets, search, statusFilter, categoryFilter]);

  const statusCounts = useMemo(() => {
    const counts = { open: 0, in_progress: 0, resolved: 0, closed: 0 };
    tickets.forEach((t) => { if (counts[t.status] !== undefined) counts[t.status]++; });
    return counts;
  }, [tickets]);

  const handleStatusChange = async (ticketId, newStatus) => {
    const ok = await updateTicketStatus(ticketId, newStatus, resolutionDrafts[ticketId]);
    if (ok) {
      setTickets((prev) => prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: newStatus, resolution_notes: resolutionDrafts[ticketId] || t.resolution_notes }
          : t
      ));
    }
  };

  const handleResolutionSave = async (ticketId) => {
    const notes = resolutionDrafts[ticketId];
    if (notes === undefined) return;
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;
    await updateTicketStatus(ticketId, ticket.status, notes);
    setTickets((prev) => prev.map((t) =>
      t.id === ticketId ? { ...t, resolution_notes: notes } : t
    ));
  };

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
        <h1 className="text-lg font-semibold text-text-primary">Tickets</h1>
        <div className="flex items-center gap-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
              className={`inline-flex items-center gap-1 text-[11px] font-medium transition-colors ${
                statusFilter === status ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <StatusBadge status={status} />
              <span className="tabular-nums">{count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket number, subject, or client..."
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
            <label className="block text-[10px] font-medium text-text-muted uppercase tracking-wide mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-border bg-bg-alt px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/30"
            >
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-text-muted uppercase tracking-wide mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border border-border bg-bg-alt px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/30"
            >
              <option value="">All</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {(statusFilter || categoryFilter) && (
            <button
              onClick={() => { setStatusFilter(''); setCategoryFilter(''); }}
              className="self-end text-[11px] font-medium text-accent hover:underline mb-1"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="text-xs text-text-muted">{filtered.length} ticket{filtered.length !== 1 ? 's' : ''}</div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-border bg-white p-8 text-center">
          <p className="text-sm text-text-secondary">No tickets match your filters.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((ticket) => {
            const isExpanded = expanded === ticket.id;
            return (
              <div key={ticket.id} className="rounded-lg border border-border bg-white overflow-hidden">
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-bg-alt/40 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : ticket.id)}
                >
                  {isExpanded
                    ? <ChevronDown className="h-3.5 w-3.5 text-text-muted shrink-0" />
                    : <ChevronRight className="h-3.5 w-3.5 text-text-muted shrink-0" />
                  }
                  <span className="text-[11px] font-mono text-text-muted w-16 shrink-0">{ticket.ticket_number || ticket.id.slice(0, 8)}</span>
                  <StatusBadge status={ticket.status} />
                  <span className="text-[13px] font-medium text-text-primary truncate flex-1">{ticket.subject}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/staff/clients/${ticket.user_id}`); }}
                    className="text-[11px] text-accent hover:underline shrink-0"
                  >
                    {ticket.profiles?.name || 'Unknown'}
                  </button>
                  <span className="text-[11px] text-text-muted shrink-0 hidden sm:block">{formatDate(ticket.created_at)}</span>
                </div>

                {isExpanded && (
                  <div className="border-t border-border-light px-4 py-3 bg-bg-alt/30 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-text-muted">Category:</span>
                        <span className="ml-1 text-text-primary">{ticket.category || '—'}</span>
                      </div>
                      <div>
                        <span className="text-text-muted">Client:</span>
                        <span className="ml-1 text-text-primary">{ticket.profiles?.name || '—'} ({ticket.profiles?.email || '—'})</span>
                      </div>
                      <div>
                        <span className="text-text-muted">Created:</span>
                        <span className="ml-1 text-text-primary">{formatDateTime(ticket.created_at)}</span>
                      </div>
                      <div>
                        <span className="text-text-muted">Updated:</span>
                        <span className="ml-1 text-text-primary">{formatDateTime(ticket.updated_at)}</span>
                      </div>
                    </div>

                    {ticket.description && (
                      <div>
                        <p className="text-[10px] font-medium text-text-muted uppercase tracking-wide mb-1">Description</p>
                        <p className="text-xs text-text-primary bg-white rounded-md border border-border-light p-3 whitespace-pre-wrap">{ticket.description}</p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-text-muted uppercase tracking-wide mb-1">Status</label>
                        <select
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          className="rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/30"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] font-medium text-text-muted uppercase tracking-wide mb-1">Resolution Notes</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={resolutionDrafts[ticket.id] ?? ticket.resolution_notes ?? ''}
                            onChange={(e) => setResolutionDrafts((d) => ({ ...d, [ticket.id]: e.target.value }))}
                            placeholder="Add resolution notes..."
                            className="flex-1 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent/30"
                          />
                          <button
                            onClick={() => handleResolutionSave(ticket.id)}
                            disabled={resolutionDrafts[ticket.id] === undefined}
                            className="rounded-md bg-accent px-2.5 py-1.5 text-xs font-medium text-white hover:bg-accent/90 disabled:bg-border disabled:text-text-muted transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
