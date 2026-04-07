import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

const productTypes = ['Invoice Discounting', 'P2P Lending', 'Private Credit', 'Structured Debt', 'Revenue-Based Financing'];
const tenures = ['Under 3 months', '3–6 months', '6–12 months', '1–2 years', '2+ years'];
const minInvestments = ['Under ₹10,000', '₹10,000–₹50,000', '₹50,000–₹2 Lakhs', '₹2 Lakhs+'];
const riskRatings = ['Low', 'Medium', 'High'];
const fundingStatuses = ['Open', 'Almost Full', 'Closing Soon'];
const sectors = ['Manufacturing', 'FMCG', 'Logistics', 'Healthcare', 'Technology', 'Real Estate', 'Agri & Food Processing'];

function CheckboxGroup({ title, options, selected, onChange }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-text-primary mb-2">{title}</h4>
      <div className="space-y-1.5">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => {
                onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
              }}
              className="rounded border-border text-accent"
            />
            <span className="text-sm text-text-secondary">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function FilterSidebar({ filters, onChange, onReset }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const updateFilter = (key, value) => onChange({ ...filters, [key]: value });

  const activeCount = Object.values(filters).reduce((c, v) => c + (Array.isArray(v) ? v.length : v ? 1 : 0), 0);

  const filterContent = (
    <div className="space-y-5">
      <CheckboxGroup title="Product type" options={productTypes} selected={filters.productTypes} onChange={(v) => updateFilter('productTypes', v)} />

      <div>
        <h4 className="text-xs font-semibold text-text-primary mb-2">Expected returns</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.returnMin}
            onChange={(e) => updateFilter('returnMin', e.target.value)}
            placeholder="8"
            className="w-20 rounded-lg border border-border bg-bg-alt px-3 py-1.5 text-sm text-text-primary"
            min={0}
            max={30}
          />
          <span className="text-xs text-text-muted">to</span>
          <input
            type="number"
            value={filters.returnMax}
            onChange={(e) => updateFilter('returnMax', e.target.value)}
            placeholder="20"
            className="w-20 rounded-lg border border-border bg-bg-alt px-3 py-1.5 text-sm text-text-primary"
            min={0}
            max={30}
          />
          <span className="text-xs text-text-muted">%</span>
        </div>
      </div>

      <CheckboxGroup title="Tenure" options={tenures} selected={filters.tenures} onChange={(v) => updateFilter('tenures', v)} />
      <CheckboxGroup title="Min investment" options={minInvestments} selected={filters.minInvestments} onChange={(v) => updateFilter('minInvestments', v)} />
      <CheckboxGroup title="Risk rating" options={riskRatings} selected={filters.riskRatings} onChange={(v) => updateFilter('riskRatings', v)} />
      <CheckboxGroup title="Funding status" options={fundingStatuses} selected={filters.fundingStatuses} onChange={(v) => updateFilter('fundingStatuses', v)} />
      <CheckboxGroup title="Sector" options={sectors} selected={filters.sectors} onChange={(v) => updateFilter('sectors', v)} />

      <button onClick={onReset} className="text-xs font-medium text-text-muted hover:text-text-secondary transition-colors">
        Reset all filters
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-alt transition-colors"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters {activeCount > 0 && <span className="bg-accent text-white text-[10px] rounded-full px-1.5 py-0.5">{activeCount}</span>}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-border overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-primary">Filters</h3>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg hover:bg-bg-alt"><X className="h-4 w-4" /></button>
            </div>
            {filterContent}
            <button
              onClick={() => setMobileOpen(false)}
              className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-60 shrink-0">
        <div className="sticky top-4 rounded-xl border border-border bg-white p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Filters</h3>
          {filterContent}
        </div>
      </div>
    </>
  );
}
