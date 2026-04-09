---
name: Fix marketplace data mismatches
overview: Cross-reference marketplace opportunity data in mockData.js against the Excel product research and fix all return rates, tenures, and investment amounts that fall outside the documented ranges.
todos:
  - id: fix-p2p-returns
    content: "Fix P2P Lending return rates: opp-007 (15.5 -> 14.5) and opp-012 (16.0 -> 14.0)"
    status: completed
  - id: fix-private-credit
    content: "Fix Private Credit issues: opp-008 return (13.5 -> 14.5) + tenure (9 -> 36 months), opp-003 tenure (18 -> 36 months)"
    status: completed
  - id: fix-invoice-discounting
    content: "Fix Invoice Discounting: opp-011 return (11.5 -> 12.0), opp-006 minInvestment (50000 -> 25000)"
    status: completed
  - id: fix-cascading
    content: Update inv-003 maturityDate from 2027-03-01 to 2028-09-01 to reflect new 36-month tenure
    status: completed
isProject: false
---

# Fix Marketplace Opportunity Data Against Product Research

## Research Reference Ranges (from Excel)

- **Invoice Discounting**: Marketed return 12%--17%, min investment ~10K--25K, tenure 30--120 days
- **P2P Lending**: Marketed return 10%--15% (gross), min investment ~500--1K per loan, tenure 6--36 months
- **Private Credit (AIF)**: Marketed return 14%--22% (gross IRR), min investment 1 Cr (SEBI AIF min), tenure 3--5 years
- **Structured Debt (SDI)**: Marketed return 11%--16%, min investment ~10K--1L, tenure 12--36 months
- **Revenue-Based Financing**: Marketed return 15%--25%+ (target IRR), min investment 5--10L+, tenure 12--36 months

## Identified Mismatches (7 total across 6 opportunities)

All changes are in [`src/data/mockData.js`](src/data/mockData.js).

### 1. opp-007 (Faircent P2P Lending) -- Return rate too high

- `returnRate: 15.5` exceeds P2P gross marketed max of **15%**
- Fix: `returnRate: 14.5`

### 2. opp-012 (i2iFunding P2P Lending) -- Return rate too high

- `returnRate: 16.0` exceeds P2P gross marketed max of **15%**
- Fix: `returnRate: 14.0`

### 3. opp-008 (Northern Arc Private Credit) -- Return rate too low AND tenure too short

- `returnRate: 13.5` is below Private Credit marketed min of **14%**
- Fix: `returnRate: 14.5`
- `tenure: '9 months'` / `tenureMonths: 9` is far below Private Credit typical **3--5 years**
- Fix: `tenure: '36 months'` / `tenureMonths: 36`
- Also update related fields: `lockIn: '3 months'` stays, but `paymentFrequency: 'Quarterly'` stays

### 4. opp-003 (Vivriti Private Credit) -- Tenure too short

- `tenure: '18 months'` / `tenureMonths: 18` is below Private Credit typical **3--5 years**
- Fix: `tenure: '36 months'` / `tenureMonths: 36`
- Cascading change: `activeInvestments[2]` (inv-003, "Vivriti Healthcare Credit") has `maturityDate: '2027-03-01'` (based on 18 months from start `2025-09-01`). Must update to `'2028-09-01'` (36 months from start).

### 5. opp-011 (Grip Invest Invoice Discounting) -- Return rate too low

- `returnRate: 11.5` is below Invoice Discounting marketed min of **12%**
- Fix: `returnRate: 12.0`

### 6. opp-006 (KredX Invoice Discounting) -- Min investment too high

- `minInvestment: 50000` exceeds Invoice Discounting research max of **~25,000**
- Fix: `minInvestment: 25000`

## Items NOT changed (intentional platform design choices)

- **Private Credit min investment** (25K--1L in app vs 1 Cr AIF minimum in research): The platform democratizes access through pooling/fractional structures; these lower minimums are a core product differentiator.
- **RBF min investment** (25K--50K in app vs 5--10L+ in research): Same rationale -- the platform's purpose is lowering barriers to entry.
- **P2P Lending min investment** (10K--15K per pool vs 500--1K per loan): The app sells diversified pool products, not individual loans, so a higher pool-level minimum is standard.

## Downstream impacts

- **FilterSidebar** ([`src/components/dashboard/FilterSidebar.jsx`](src/components/dashboard/FilterSidebar.jsx)): Tenure filter already has a "2+ years" bucket and min investment filters already cover the adjusted ranges -- no changes needed.
- **Active investment inv-003** (Vivriti): maturity date must shift to match the new 36-month tenure.
- **Completed investment inv-c02** (Northern Arc): This was a past deal with its own tenure, separate from the current listing opp-008 -- no change needed.
- **Upcoming repayment rep-5** (Vivriti): `dueDate: '2026-06-01'` is the next *quarterly* payment, not the maturity -- no change needed.
