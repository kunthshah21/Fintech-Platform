import { useState, useMemo } from 'react';
import { Search, LayoutGrid, List, BellRing } from 'lucide-react';
import { opportunities } from '../data/mockData';
import OpportunityCard from '../components/dashboard/OpportunityCard';
import FilterSidebar from '../components/dashboard/FilterSidebar';

const defaultFilters = {
  productTypes: [],
  returnMin: '',
  returnMax: '',
  tenures: [],
  minInvestments: [],
  riskRatings: [],
  fundingStatuses: [],
  sectors: [],
};

const sortOptions = [
  { value: 'highest_returns', label: 'Highest Returns' },
  { value: 'closing_soon', label: 'Closing Soon' },
  { value: 'newest', label: 'Newest First' },
  { value: 'lowest_risk', label: 'Lowest Risk' },
  { value: 'min_investment', label: 'Min Investment (Low to High)' },
  { value: 'tenure_short', label: 'Tenure (Short to Long)' },
];

const riskOrder = { Low: 1, Medium: 2, High: 3 };

function tenureMatches(tenureMonths, filters) {
  if (filters.length === 0) return true;
  return filters.some((f) => {
    if (f === 'Under 3 months') return tenureMonths < 3;
    if (f === '3–6 months') return tenureMonths >= 3 && tenureMonths <= 6;
    if (f === '6–12 months') return tenureMonths > 6 && tenureMonths <= 12;
    if (f === '1–2 years') return tenureMonths > 12 && tenureMonths <= 24;
    if (f === '2+ years') return tenureMonths > 24;
    return true;
  });
}

function minInvestmentMatches(amount, filters) {
  if (filters.length === 0) return true;
  return filters.some((f) => {
    if (f === 'Under ₹10,000') return amount < 10000;
    if (f === '₹10,000–₹50,000') return amount >= 10000 && amount <= 50000;
    if (f === '₹50,000–₹2 Lakhs') return amount > 50000 && amount <= 200000;
    if (f === '₹2 Lakhs+') return amount > 200000;
    return true;
  });
}

function fundingMatches(opp, filters) {
  if (filters.length === 0) return true;
  const daysLeft = Math.ceil((new Date(opp.closingDate) - new Date()) / 86400000);
  return filters.some((f) => {
    if (f === 'Open') return opp.fundedPercent < 75;
    if (f === 'Almost Full') return opp.fundedPercent >= 75;
    if (f === 'Closing Soon') return daysLeft <= 2;
    return true;
  });
}

export default function Marketplace() {
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState('highest_returns');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const filtered = useMemo(() => {
    let result = opportunities.filter((opp) => {
      if (filters.productTypes.length && !filters.productTypes.includes(opp.productType)) return false;
      if (filters.returnMin && opp.returnRate < Number(filters.returnMin)) return false;
      if (filters.returnMax && opp.returnRate > Number(filters.returnMax)) return false;
      if (!tenureMatches(opp.tenureMonths, filters.tenures)) return false;
      if (!minInvestmentMatches(opp.minInvestment, filters.minInvestments)) return false;
      if (filters.riskRatings.length && !filters.riskRatings.includes(opp.riskRating)) return false;
      if (!fundingMatches(opp, filters.fundingStatuses)) return false;
      if (filters.sectors.length && !filters.sectors.includes(opp.sector)) return false;
      if (search) {
        const q = search.toLowerCase();
        return opp.issuer.toLowerCase().includes(q) || opp.productType.toLowerCase().includes(q) || opp.sector.toLowerCase().includes(q);
      }
      return true;
    });

    result.sort((a, b) => {
      switch (sort) {
        case 'highest_returns': return b.returnRate - a.returnRate;
        case 'closing_soon': return new Date(a.closingDate) - new Date(b.closingDate);
        case 'newest': return new Date(b.closingDate) - new Date(a.closingDate);
        case 'lowest_risk': return riskOrder[a.riskRating] - riskOrder[b.riskRating];
        case 'min_investment': return a.minInvestment - b.minInvestment;
        case 'tenure_short': return a.tenureMonths - b.tenureMonths;
        default: return 0;
      }
    });

    return result;
  }, [filters, sort, search]);

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">Investment opportunities</h1>
        <p className="mt-1 text-sm text-text-secondary">{filtered.length} opportunities available</p>
      </div>

      <div className="flex flex-wrap lg:flex-nowrap gap-4 lg:gap-6">
        <div className="w-full lg:w-auto">
          <FilterSidebar filters={filters} onChange={setFilters} onReset={() => setFilters(defaultFilters)} />
        </div>

        <div className="flex-1 min-w-0 w-full">
          <div data-tour="marketplace-search" className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by issuer, product type, or sector..."
                className="w-full rounded-lg border border-border bg-white pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              <div className="hidden sm:flex rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-accent text-white' : 'bg-white text-text-muted hover:bg-bg-alt'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-accent text-white' : 'bg-white text-text-muted hover:bg-bg-alt'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-white p-12 text-center">
              <Search className="h-10 w-10 text-text-muted mx-auto mb-4" />
              <h3 className="text-base font-semibold text-text-primary mb-2">No opportunities match your filters</h3>
              <p className="text-sm text-text-secondary mb-4">Try adjusting your filters or search query.</p>
              <button
                onClick={() => { setFilters(defaultFilters); setSearch(''); }}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-alt transition-colors"
              >
                Reset filters
              </button>
              <label className="flex items-center justify-center gap-2 mt-4 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-xs text-text-secondary">Notify me when new opportunities are added</span>
              </label>
            </div>
          ) : (
            <div data-tour="marketplace-cards" className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
                : 'space-y-3'
            }>
              {filtered.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} compact={viewMode === 'list'} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
