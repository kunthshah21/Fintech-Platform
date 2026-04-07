import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, Clock, Download, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { opportunities } from '../data/mockData';
import { useApp } from '../context/AppContext';
import InvestmentWidget from '../components/dashboard/InvestmentWidget';

const riskColors = { Low: 'bg-green-soft text-green', Medium: 'bg-amber-soft text-amber', High: 'bg-red-soft text-red' };
const severityColors = { low: 'text-green', medium: 'text-amber', high: 'text-red' };
const tabs = ['Overview', 'Borrower Profile', 'Documents', 'Risk Assessment', 'FAQs'];

function ScenarioCalculator({ opportunity }) {
  const [calcAmount, setCalcAmount] = useState(opportunity.minInvestment);
  const o = opportunity;
  const returns = Math.round(calcAmount * (o.returnRate / 100) * (o.tenureMonths / 12));
  const maturity = calcAmount + returns;
  const monthly = o.paymentFrequency === 'Monthly' ? Math.round(returns / o.tenureMonths) : 0;

  return (
    <div className="rounded-xl border border-border p-5 mt-5">
      <h4 className="text-sm font-semibold text-text-primary mb-3">Scenario calculator</h4>
      <div className="mb-3">
        <label className="text-xs text-text-muted mb-1 block">If I invest</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted">₹</span>
          <input
            type="range"
            min={o.minInvestment}
            max={o.maxInvestment}
            step={o.minInvestment <= 25000 ? 5000 : 25000}
            value={calcAmount}
            onChange={(e) => setCalcAmount(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-medium text-text-primary w-24 text-right">₹{calcAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-bg-alt p-3 text-center">
          <p className="text-[10px] text-text-muted mb-1">Total returns</p>
          <p className="text-sm font-semibold text-green">₹{returns.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-lg bg-bg-alt p-3 text-center">
          <p className="text-[10px] text-text-muted mb-1">Maturity value</p>
          <p className="text-sm font-semibold text-text-primary">₹{maturity.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-lg bg-bg-alt p-3 text-center">
          <p className="text-[10px] text-text-muted mb-1">{monthly ? 'Monthly income' : 'At maturity'}</p>
          <p className="text-sm font-semibold text-text-primary">₹{(monthly || returns).toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
}

export default function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { watchlist, toggleWatchlist } = useApp();
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const opportunity = useMemo(() => opportunities.find((o) => o.id === id), [id]);

  if (!opportunity) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary mb-4">Opportunity not found</p>
        <Link to="/dashboard/marketplace" className="text-sm text-accent underline">Back to Marketplace</Link>
      </div>
    );
  }

  const o = opportunity;
  const daysLeft = Math.max(0, Math.ceil((new Date(o.closingDate) - new Date()) / 86400000));
  const isWatchlisted = watchlist.includes(o.id);

  return (
    <div className="max-w-6xl">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors mb-4">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="rounded-xl border border-border bg-white p-5 mb-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bg-alt text-base font-semibold text-text-secondary">
                {o.issuerLogo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-semibold text-text-primary">{o.issuer}</h1>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${riskColors[o.riskRating]}`}>{o.riskRating} Risk</span>
                </div>
                <p className="text-sm text-text-secondary mt-0.5">{o.industry} · {o.productType}</p>
              </div>
              <button onClick={() => toggleWatchlist(o.id)} className="p-2 rounded-lg border border-border hover:bg-bg-alt transition-colors shrink-0">
                <Bookmark className={`h-4 w-4 ${isWatchlisted ? 'fill-accent text-accent' : 'text-text-muted'}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs text-text-muted">Expected return</p>
                <p className="text-xl font-semibold text-green">{o.returnRate}%</p>
                <p className="text-[10px] text-text-muted">p.a.</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Tenure</p>
                <p className="text-xl font-semibold text-text-primary">{o.tenure}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Min. investment</p>
                <p className="text-xl font-semibold text-text-primary">₹{(o.minInvestment / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Credit rating</p>
                <p className="text-xl font-semibold text-text-primary">{o.creditRating}</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                <span>₹{(o.fundedAmount / 100000).toFixed(1)}L raised of ₹{(o.targetAmount / 100000).toFixed(1)}L</span>
                <span>{o.fundedPercent}% funded</span>
              </div>
              <div className="h-2 rounded-full bg-border-light overflow-hidden">
                <div className="h-full rounded-full bg-green transition-all" style={{ width: `${o.fundedPercent}%` }} />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-text-muted">{o.slotsRemaining} slots remaining</span>
                {daysLeft <= 7 ? (
                  <span className="flex items-center gap-1 font-medium text-amber"><AlertTriangle className="h-3 w-3" />{daysLeft}d left</span>
                ) : (
                  <span className="flex items-center gap-1 text-text-muted"><Clock className="h-3 w-3" />Closes {new Date(o.closingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-5 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === i ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="rounded-xl border border-border bg-white p-5">
            {activeTab === 0 && (
              <div>
                <p className="text-sm text-text-secondary leading-relaxed mb-5">{o.description}</p>
                <h4 className="text-sm font-semibold text-text-primary mb-3">Key terms</h4>
                <div className="rounded-lg border border-border divide-y divide-border-light">
                  {[
                    ['Investment Type', o.productType],
                    ['Expected Return', `${o.returnRate}% p.a.`],
                    ['Payment Frequency', o.paymentFrequency],
                    ['Tenure', o.tenure],
                    ['Min Investment', `₹${o.minInvestment.toLocaleString('en-IN')}`],
                    ['Max Investment', `₹${o.maxInvestment.toLocaleString('en-IN')}`],
                    ['Lock-in Period', o.lockIn],
                    ['Collateral', o.collateral],
                    ['Platform Fee', o.platformFee],
                  ].map(([key, val]) => (
                    <div key={key} className="flex justify-between py-2.5 px-4 text-sm">
                      <span className="text-text-muted">{key}</span>
                      <span className="font-medium text-text-primary">{val}</span>
                    </div>
                  ))}
                </div>
                <ScenarioCalculator opportunity={o} />
                <p className="mt-4 text-xs text-text-muted leading-relaxed">Investments in alternative assets are subject to market and credit risks. Past performance does not guarantee future results. Please read all scheme-related documents carefully.</p>
              </div>
            )}

            {activeTab === 1 && (
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-1">{o.borrowerProfile.companyName}</h4>
                  <p className="text-xs text-text-muted">Est. {o.borrowerProfile.foundingYear} · {o.borrowerProfile.industry}</p>
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed">{o.borrowerProfile.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-3">Key financials</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['Revenue', o.borrowerProfile.revenue],
                      ['EBITDA', o.borrowerProfile.ebitda],
                      ['Debt-to-Equity', o.borrowerProfile.debtToEquity],
                      ['Credit Utilization', o.borrowerProfile.creditUtilization],
                    ].map(([key, val]) => (
                      <div key={key} className="rounded-lg bg-bg-alt p-3">
                        <p className="text-[10px] text-text-muted">{key}</p>
                        <p className="text-sm font-semibold text-text-primary">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-2">Management team</h4>
                  <div className="space-y-2">
                    {o.borrowerProfile.managementTeam.map((m) => (
                      <div key={m.name} className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-bg-alt flex items-center justify-center text-xs font-semibold text-text-secondary">{m.name[0]}</div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{m.name}</p>
                          <p className="text-xs text-text-muted">{m.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-2">Banking relationships</h4>
                  <div className="flex flex-wrap gap-2">
                    {o.borrowerProfile.bankingRelationships.map((b) => (
                      <span key={b} className="rounded-md bg-bg-alt px-3 py-1 text-xs font-medium text-text-secondary">{b}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Geographic presence: {o.borrowerProfile.geographicPresence}</p>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div>
                <p className="text-xs text-text-muted mb-4">Download available documents. Some documents are only available after investment commitment.</p>
                <div className="space-y-2">
                  {o.documents.map((doc) => (
                    <div key={doc.name} className="flex items-center justify-between py-3 px-4 rounded-lg border border-border hover:bg-bg-alt transition-colors">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{doc.name}</p>
                        <p className="text-xs text-text-muted">{doc.type} · Uploaded {new Date(doc.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-bg-alt transition-colors">
                        <Download className="h-4 w-4 text-text-muted" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-3">Risk score</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 rounded-full bg-border-light overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${o.riskAssessment.score * 10}%`,
                        backgroundColor: o.riskAssessment.score <= 3 ? '#059669' : o.riskAssessment.score <= 6 ? '#D97706' : '#DC2626',
                      }} />
                    </div>
                    <span className="text-lg font-semibold text-text-primary">{o.riskAssessment.score}/10</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-3">Risk factors</h4>
                  <div className="space-y-2">
                    {o.riskAssessment.factors.map((f) => (
                      <div key={f.name} className="flex items-center justify-between py-2 border-b border-border-light last:border-0">
                        <div>
                          <p className="text-sm font-medium text-text-primary">{f.name}</p>
                          <p className="text-xs text-text-secondary">{f.description}</p>
                        </div>
                        <span className={`text-xs font-semibold capitalize ${severityColors[f.severity]}`}>{f.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-bg-alt p-4">
                  <p className="text-xs text-text-muted">Historical default rate for similar products: <span className="font-semibold text-text-primary">{o.riskAssessment.defaultRate}</span></p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-2">Mitigations</h4>
                  <ul className="space-y-1.5">
                    {o.riskAssessment.mitigations.map((m) => (
                      <li key={m} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-green mt-0.5">•</span> {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 4 && (
              <div>
                {o.faqs.length === 0 ? (
                  <p className="text-sm text-text-muted py-8 text-center">No FAQs available for this opportunity yet.</p>
                ) : (
                  <div className="space-y-2">
                    {o.faqs.map((faq, i) => (
                      <div key={i} className="border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-bg-alt transition-colors"
                        >
                          <span className="text-sm font-medium text-text-primary">{faq.q}</span>
                          {expandedFaq === i ? <ChevronUp className="h-4 w-4 text-text-muted shrink-0" /> : <ChevronDown className="h-4 w-4 text-text-muted shrink-0" />}
                        </button>
                        {expandedFaq === i && (
                          <div className="px-4 pb-3">
                            <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Investment sidebar */}
        <div className="lg:w-72 shrink-0">
          <InvestmentWidget opportunity={o} />
        </div>
      </div>
    </div>
  );
}
