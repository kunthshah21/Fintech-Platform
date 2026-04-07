import { useState } from 'react';
import {
  Search, ShieldCheck, HelpCircle, IndianRupee, ArrowDownToLine,
  FileText, UserCog, Scale, ChevronDown, ChevronUp,
  Send, Paperclip, Mail, Phone, MessageCircle,
} from 'lucide-react';

const categories = [
  { id: 'kyc', label: 'KYC Help', icon: ShieldCheck },
  { id: 'investment', label: 'Investment Questions', icon: IndianRupee },
  { id: 'repayments', label: 'Repayments', icon: ArrowDownToLine },
  { id: 'withdrawals', label: 'Withdrawals', icon: ArrowDownToLine },
  { id: 'tax', label: 'Tax & Statements', icon: FileText },
  { id: 'account', label: 'Account Issues', icon: UserCog },
  { id: 'regulatory', label: 'Regulatory FAQs', icon: Scale },
];

const faqs = [
  { category: 'kyc', q: 'What documents are required for KYC?', a: 'You need your PAN card, Aadhaar card (or DigiLocker access), and a bank account with a cancelled cheque or penny-drop verification. The entire process takes about 3-5 minutes.' },
  { category: 'kyc', q: 'How long does KYC verification take?', a: 'KYC verification is usually completed within 2-5 minutes for digital verification. Manual document upload may take up to 24 hours for review.' },
  { category: 'kyc', q: 'Can I invest before completing KYC?', a: 'You can browse all investment opportunities and add them to your watchlist before KYC. However, you must complete KYC verification before making any actual investments.' },
  { category: 'investment', q: 'What is the minimum investment amount?', a: 'The minimum investment varies by opportunity, typically ranging from ₹10,000 to ₹1,00,000. Each opportunity listing clearly shows the minimum and maximum investment amounts.' },
  { category: 'investment', q: 'How are returns calculated?', a: 'Returns are calculated on an annualized basis. For example, a 12% p.a. return on a 6-month investment of ₹1,00,000 would yield approximately ₹6,000. Use the scenario calculator on each opportunity page for precise calculations.' },
  { category: 'investment', q: 'What types of investments are available?', a: 'We offer five types of alternative investments: Invoice Discounting, P2P Lending, Private Credit, Structured Debt, and Revenue-Based Financing. Each carries different risk-return profiles.' },
  { category: 'repayments', q: 'When will I receive repayments?', a: 'Repayment schedules depend on the investment type. Some pay monthly, some quarterly, and some at maturity. Your portfolio dashboard shows exact upcoming repayment dates.' },
  { category: 'repayments', q: 'What happens if a borrower defaults?', a: 'Default handling depends on the investment type and security structure. Most investments have mitigation measures like escrow accounts, collateral, and guarantees. The platform\'s historical default rate is displayed on each opportunity.' },
  { category: 'withdrawals', q: 'How do I withdraw money from my wallet?', a: 'Go to the Transactions page, click "Withdraw to Bank", enter the amount, and confirm. Withdrawals to your verified bank account are typically processed within 1-2 business days.' },
  { category: 'tax', q: 'Will I receive tax statements?', a: 'Yes, you can download monthly, quarterly, or annual statements from the Transactions page. We also provide TDS certificates at the end of each financial year.' },
  { category: 'account', q: 'How do I change my registered mobile number?', a: 'Go to Profile & Settings > Personal Information. You\'ll need to verify the new number via OTP before the change takes effect.' },
  { category: 'regulatory', q: 'Is YieldVest registered with SEBI/RBI?', a: 'Yes, YieldVest operates under the regulatory framework of SEBI and RBI. Our registration details are displayed in the footer of every page.' },
];

const ticketCategories = ['KYC Issue', 'Investment Query', 'Repayment Delay', 'Withdrawal Issue', 'Tax & Statements', 'Account Problem', 'Other'];

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('faq');
  const [ticketForm, setTicketForm] = useState({ category: '', subject: '', description: '' });

  const filteredFaqs = faqs.filter((f) => {
    if (activeCategory && f.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
    }
    return true;
  });

  const mockTickets = [
    { id: 'TKT-001', subject: 'KYC document re-upload', status: 'resolved', date: '2026-03-28' },
    { id: 'TKT-002', subject: 'Repayment not received', status: 'in_progress', date: '2026-04-05' },
  ];

  const ticketStatusStyles = {
    open: 'bg-blue-soft text-blue',
    in_progress: 'bg-amber-soft text-amber',
    resolved: 'bg-green-soft text-green',
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-xl font-semibold text-text-primary">Help & support</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="How can we help you?"
          className="w-full rounded-xl border border-border bg-white pl-12 pr-4 py-3.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
        />
      </div>

      {/* Category tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.slice(0, 8).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(activeCategory === id ? null : id)}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
              activeCategory === id ? 'border-accent bg-accent-soft' : 'border-border bg-white hover:shadow-md'
            }`}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${activeCategory === id ? 'bg-accent text-white' : 'bg-bg-alt'}`}>
              <Icon className={`h-4 w-4 ${activeCategory === id ? 'text-white' : 'text-text-secondary'}`} />
            </div>
            <span className="text-xs font-medium text-text-secondary">{label}</span>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: 'faq', label: 'FAQs' },
          { id: 'ticket', label: 'Raise a Ticket' },
          { id: 'my_tickets', label: 'My Tickets' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* FAQ */}
      {activeTab === 'faq' && (
        <div className="space-y-2">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-xl border border-border bg-white p-8 text-center">
              <p className="text-sm text-text-secondary">No FAQs match your search. Try a different query or raise a ticket.</p>
            </div>
          ) : (
            filteredFaqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-white overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-bg-alt/50 transition-colors"
                >
                  <span className="text-sm font-medium text-text-primary pr-4">{faq.q}</span>
                  {expandedFaq === i ? <ChevronUp className="h-4 w-4 text-text-muted shrink-0" /> : <ChevronDown className="h-4 w-4 text-text-muted shrink-0" />}
                </button>
                {expandedFaq === i && (
                  <div className="px-5 pb-4 border-t border-border-light pt-3">
                    <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Raise Ticket */}
      {activeTab === 'ticket' && (
        <div className="rounded-xl border border-border bg-white p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Category</label>
            <select
              value={ticketForm.category}
              onChange={(e) => setTicketForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="">Select a category</option>
              {ticketCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Subject</label>
            <input
              type="text"
              value={ticketForm.subject}
              onChange={(e) => setTicketForm((p) => ({ ...p, subject: e.target.value }))}
              placeholder="Brief description of your issue"
              className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Description</label>
            <textarea
              value={ticketForm.description}
              onChange={(e) => setTicketForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Describe your issue in detail..."
              rows={4}
              className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
            />
          </div>
          <div>
            <button className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-text-muted hover:bg-bg-alt transition-colors">
              <Paperclip className="h-4 w-4" /> Attach file
            </button>
          </div>
          <button
            disabled={!ticketForm.category || !ticketForm.subject}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:bg-border disabled:text-text-muted disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" /> Submit Ticket
          </button>
        </div>
      )}

      {/* My Tickets */}
      {activeTab === 'my_tickets' && (
        <div className="space-y-3">
          {mockTickets.map((ticket) => (
            <div key={ticket.id} className="rounded-xl border border-border bg-white p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-text-muted">{ticket.id}</span>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold capitalize ${ticketStatusStyles[ticket.status]}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm font-medium text-text-primary mt-1">{ticket.subject}</p>
                <p className="text-xs text-text-muted mt-0.5">{new Date(ticket.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <button className="text-xs font-medium text-accent hover:underline">View</button>
            </div>
          ))}
        </div>
      )}

      {/* Contact info */}
      <div className="rounded-xl border border-border bg-white p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Contact us</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-alt">
              <Mail className="h-4 w-4 text-text-secondary" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Email</p>
              <p className="text-sm font-medium text-text-primary">support@yieldvest.in</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-alt">
              <Phone className="h-4 w-4 text-text-secondary" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Phone</p>
              <p className="text-sm font-medium text-text-primary">1800-XXX-XXXX</p>
              <p className="text-[10px] text-text-muted">Mon–Sat, 9AM–6PM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-alt">
              <MessageCircle className="h-4 w-4 text-text-secondary" />
            </div>
            <div>
              <p className="text-xs text-text-muted">WhatsApp</p>
              <p className="text-sm font-medium text-text-primary">+91 98XXX XXXXX</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grievance */}
      <div className="rounded-xl border border-border bg-white p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-2">Grievance Redressal Officer</h3>
        <p className="text-sm text-text-secondary">Mr. Rajesh Kumar</p>
        <p className="text-xs text-text-muted mt-1">Email: grievance@yieldvest.in</p>
        <p className="text-xs text-text-muted">Address: YieldVest Financial Services Pvt Ltd, Mumbai, Maharashtra 400001</p>
        <p className="text-xs text-text-muted mt-2">If your complaint is not resolved within 30 days, you may escalate to SEBI through SCORES portal (scores.gov.in).</p>
      </div>
    </div>
  );
}
