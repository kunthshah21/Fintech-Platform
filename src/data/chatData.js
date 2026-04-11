import {
  userPortfolio, activeInvestments, upcomingRepayments,
  monthlyReturns, allocationData, opportunities, transactions,
  portfolioHistory,
} from './mockData';

const last30 = portfolioHistory.slice(-30).filter((_, i, a) => i % Math.ceil(a.length / 15) === 0 || i === a.length - 1);

const riskBuckets = activeInvestments.reduce((acc, inv) => {
  const opp = opportunities.find((o) => o.id === inv.opportunityId);
  const risk = opp?.riskRating || 'Medium';
  acc[risk] = (acc[risk] || 0) + inv.amountInvested;
  return acc;
}, {});

const riskColors = { Low: '#059669', Medium: '#D97706', High: '#DC2626' };

const productReturns = activeInvestments.map((inv) => ({
  name: inv.name.split(' ').slice(0, 2).join(' '),
  returnPercent: inv.returnPercent,
}));

const topOpps = opportunities.slice(0, 6).map((o) => ({
  name: o.issuer.split(' ').slice(0, 2).join(' '),
  returnRate: o.returnRate,
  riskScore: o.riskAssessment.score,
}));

const txnSummary = transactions.reduce((acc, t) => {
  if (t.type === 'wallet_topup') acc.topups += t.amount;
  if (t.type === 'repayment') acc.repayments += t.amount;
  if (t.type === 'investment') acc.investments += Math.abs(t.amount);
  if (t.type === 'withdrawal') acc.withdrawals += Math.abs(t.amount);
  return acc;
}, { topups: 0, repayments: 0, investments: 0, withdrawals: 0 });

const txnChartData = [
  { name: 'Top-ups', value: txnSummary.topups, color: '#059669' },
  { name: 'Repayments', value: txnSummary.repayments, color: '#2563EB' },
  { name: 'Investments', value: txnSummary.investments, color: '#18181B' },
  { name: 'Withdrawals', value: txnSummary.withdrawals, color: '#DC2626' },
];

/** Assigned relationship manager (showcase — replace with live profile later). */
export const RELATIONSHIP_MANAGER_NAME = 'Rajesh Menon';

export const rmSuggestedQuestions = [
  { id: 'rm-annual-review', label: 'Schedule my portfolio review' },
  { id: 'rm-rebalance', label: 'Help me rebalance my allocation' },
  { id: 'rm-goals', label: 'Discuss my investment goals' },
  { id: 'rm-tax', label: 'Tax-efficient investing options' },
  { id: 'rm-exclusive', label: 'Any exclusive deals for me?' },
];

export const suggestedQuestions = [
  { id: 'portfolio', label: 'How is my portfolio performing?' },
  { id: 'allocation', label: 'Show my asset allocation' },
  { id: 'repayments', label: 'What are my upcoming repayments?' },
  { id: 'returns', label: 'Show monthly returns trend' },
  { id: 'marketplace', label: 'Best opportunities in marketplace?' },
  { id: 'risk', label: "What's my risk exposure?" },
  { id: 'compare', label: 'Compare returns vs FD rates' },
  { id: 'transactions', label: 'Summarise my transactions' },
  { id: 'product-returns', label: 'Which investments give the best returns?' },
  { id: 'overview', label: 'Give me a quick financial overview' },
];

export const chatResponses = {
  portfolio: {
    text: `Your portfolio is looking healthy! You've invested **₹${userPortfolio.totalInvested.toLocaleString('en-IN')}** and the current value stands at **₹${userPortfolio.currentValue.toLocaleString('en-IN')}** — that's a return of **₹${userPortfolio.totalReturns.toLocaleString('en-IN')}** (+${userPortfolio.returnPercent}%). Your XIRR is **${userPortfolio.xirr}%**, which comfortably beats FD rates. Here's how your portfolio has trended over the last 30 days:`,
    chart: {
      type: 'line',
      data: last30,
      xKey: 'date',
      lines: [{ dataKey: 'value', stroke: '#059669', name: 'Portfolio Value' }],
      yFormat: (v) => `₹${(v / 1000).toFixed(0)}K`,
    },
  },

  allocation: {
    text: `Your capital is spread across **${allocationData.length} asset classes**. Private Credit holds the largest share at ₹2,50,000 (28.6%), followed by Invoice Discounting. This is a well-diversified allocation. Here's the visual breakdown:`,
    chart: {
      type: 'pie',
      data: allocationData,
    },
  },

  repayments: {
    text: (() => {
      const total = upcomingRepayments.reduce((s, r) => s + r.amount, 0);
      const delayed = upcomingRepayments.filter((r) => r.status === 'delayed');
      let msg = `You have **${upcomingRepayments.length} upcoming repayments** totalling **₹${total.toLocaleString('en-IN')}**.`;
      if (delayed.length > 0) {
        msg += ` ⚠ **${delayed.length}** ${delayed.length === 1 ? 'is' : 'are'} currently delayed (${delayed.map((d) => d.name).join(', ')}).`;
      }
      msg += ' Here\'s the schedule:';
      return msg;
    })(),
    chart: {
      type: 'bar',
      data: upcomingRepayments.map((r) => ({
        name: r.name.split(' ').slice(0, 2).join(' '),
        amount: r.amount,
        fill: r.status === 'delayed' ? '#DC2626' : '#059669',
      })),
      xKey: 'name',
      bars: [{ dataKey: 'amount', name: 'Amount' }],
      yFormat: (v) => `₹${(v / 1000).toFixed(0)}K`,
      colorByItem: true,
    },
  },

  returns: {
    text: `Here's your monthly returns trend. You earned the most in **March 2026** (₹${monthlyReturns[10].amount.toLocaleString('en-IN')}). Total cumulative returns so far: **₹${userPortfolio.totalReturns.toLocaleString('en-IN')}**.`,
    chart: {
      type: 'bar',
      data: monthlyReturns,
      xKey: 'month',
      bars: [{ dataKey: 'amount', name: 'Returns', fill: '#059669' }],
      yFormat: (v) => `₹${(v / 1000).toFixed(0)}K`,
    },
  },

  marketplace: {
    text: `There are **${opportunities.length} open opportunities** right now. The highest return on offer is **${Math.max(...opportunities.map((o) => o.returnRate))}% p.a.** (GetVantage Revenue-Based Financing). For low risk, look at **KredX Invoice Discounting** (13% return, AA rated). Here's a risk vs return comparison of the top picks:`,
    chart: {
      type: 'bar',
      data: topOpps,
      xKey: 'name',
      bars: [
        { dataKey: 'returnRate', name: 'Return %', fill: '#059669' },
        { dataKey: 'riskScore', name: 'Risk Score', fill: '#D97706' },
      ],
      yFormat: (v) => `${v}`,
    },
  },

  risk: {
    text: (() => {
      const entries = Object.entries(riskBuckets);
      const lines = entries.map(([k, v]) => `• **${k} risk**: ₹${v.toLocaleString('en-IN')}`);
      return `Here's how your investments break down by risk level:\n\n${lines.join('\n')}\n\nThe majority of your capital is in low-risk instruments, which is a conservative and well-balanced approach.`;
    })(),
    chart: {
      type: 'pie',
      data: Object.entries(riskBuckets).map(([name, value]) => ({
        name: `${name} Risk`,
        value,
        color: riskColors[name] || '#9CA3AF',
      })),
    },
  },

  compare: {
    text: `Let's compare your portfolio performance against a Fixed Deposit benchmark (7% p.a.). Your portfolio has significantly outperformed with an XIRR of **${userPortfolio.xirr}%** vs 7% for FDs. Here's the chart:`,
    chart: {
      type: 'line',
      data: last30,
      xKey: 'date',
      lines: [
        { dataKey: 'value', stroke: '#059669', name: 'Portfolio' },
        { dataKey: 'fd', stroke: '#9CA3AF', name: 'FD Benchmark', strokeDasharray: '4 4' },
      ],
      yFormat: (v) => `₹${(v / 1000).toFixed(0)}K`,
    },
  },

  transactions: {
    text: `Here's a breakdown of all your transactions:\n\n• **Wallet top-ups**: ₹${txnSummary.topups.toLocaleString('en-IN')}\n• **Repayments received**: ₹${txnSummary.repayments.toLocaleString('en-IN')}\n• **Invested**: ₹${txnSummary.investments.toLocaleString('en-IN')}\n• **Withdrawals**: ₹${txnSummary.withdrawals.toLocaleString('en-IN')}\n\nYour total inflows (top-ups + repayments) comfortably cover your investments. Here's the visual:`,
    chart: {
      type: 'pie',
      data: txnChartData,
    },
  },

  'product-returns': {
    text: `Here's how each of your active investments is performing return-wise. Your best performer is **Vivriti Healthcare Credit** at 9.0%, while the D2C revenue deal is at 7.1% but has a delayed repayment flag.`,
    chart: {
      type: 'bar',
      data: productReturns,
      xKey: 'name',
      bars: [{ dataKey: 'returnPercent', name: 'Return %', fill: '#18181B' }],
      yFormat: (v) => `${v}%`,
    },
  },

  overview: {
    text: `Here's your financial snapshot:\n\n• **Total invested**: ₹${userPortfolio.totalInvested.toLocaleString('en-IN')}\n• **Current value**: ₹${userPortfolio.currentValue.toLocaleString('en-IN')}\n• **Returns**: ₹${userPortfolio.totalReturns.toLocaleString('en-IN')} (+${userPortfolio.returnPercent}%)\n• **XIRR**: ${userPortfolio.xirr}%\n• **Wallet balance**: ₹${userPortfolio.walletBalance.toLocaleString('en-IN')}\n• **Active investments**: ${userPortfolio.activeInvestments}\n\nYou're in a strong position. Consider exploring new opportunities in the marketplace to deploy your wallet balance!`,
    chart: null,
  },

  fallback: {
    text: "I'm still learning! I can help you with portfolio performance, asset allocation, repayments, returns, marketplace opportunities, risk exposure, FD comparisons, and transaction summaries. Try picking one of the suggested questions below.",
    chart: null,
  },

  'rm-annual-review': {
    text: `Hi — it's ${RELATIONSHIP_MANAGER_NAME.split(' ')[0]} here. I've reviewed your portfolio notes and I'd be happy to walk through a full annual review on a quick call. I'll look at performance vs your risk band, any concentration risk, and what's maturing in the next quarter. Shall we lock a 20-minute slot this week?`,
    chart: null,
  },

  'rm-rebalance': {
    text: `Good question. Based on your current mix, I'd trim a little from the highest-yield (and higher-risk) tranches and redeploy toward shorter-tenor invoice discounting to bring volatility down. I can send a one-page proposal before you confirm — want me to prioritise **safety** or **yield** for the rebalance?`,
    chart: null,
  },

  'rm-goals': {
    text: `Let's align on horizons: are you optimising for a **near-term goal** (1–2 yrs), **wealth build** (5+ yrs), or **regular income**? Once I know that, I'll map products on the platform to each bucket and we can stress-test a 10% market dip scenario together.`,
    chart: null,
  },

  'rm-tax': {
    text: `For tax efficiency we usually look at holding period, instrument type, and whether you're booking gains this FY. I can't give personal tax advice here, but I can outline how repayments are typically treated and flag structures clients often review with their CA — happy to share a short checklist.`,
    chart: null,
  },

  'rm-exclusive': {
    text: `We occasionally reserve capacity on oversubscribed deals for active clients. Nothing guaranteed, but I'll flag the next **private credit** and **revenue-based** windows that fit your ticket size. I'll also note if any early-access tranche opens this month.`,
    chart: null,
  },

  'rm-fallback': {
    text: `Thanks for the message — I'll read this in detail and reply properly. In the meantime, feel free to ask about **reviews**, **rebalancing**, **goals**, **tax-aware investing**, or **exclusive allocations**, or tell me if you'd prefer a call.`,
    chart: null,
  },
};
