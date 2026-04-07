import { Link } from 'react-router-dom';
import { IndianRupee, TrendingUp, PiggyBank, BarChart3, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { opportunities } from '../data/mockData';
import StatCard from '../components/dashboard/StatCard';
import KYCBanner from '../components/dashboard/KYCBanner';
import PortfolioChart from '../components/dashboard/PortfolioChart';
import AllocationDonut from '../components/dashboard/AllocationDonut';
import RepaymentWidget from '../components/dashboard/RepaymentWidget';
import OpportunityCard from '../components/dashboard/OpportunityCard';
import QuickActions from '../components/dashboard/QuickActions';

export default function DashboardHome() {
  const { portfolio } = useApp();

  const featured = opportunities.slice(0, 3);

  return (
    <div className="space-y-6 max-w-6xl">
      <KYCBanner />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={IndianRupee}
          label="Total invested"
          value={`₹${portfolio.totalInvested.toLocaleString('en-IN')}`}
          to="/dashboard/portfolio"
        />
        <StatCard
          icon={TrendingUp}
          label="Current value"
          value={`₹${portfolio.currentValue.toLocaleString('en-IN')}`}
          to="/dashboard/portfolio"
        />
        <StatCard
          icon={PiggyBank}
          label="Total returns"
          value={`₹${portfolio.totalReturns.toLocaleString('en-IN')}`}
          subValue={`+${portfolio.returnPercent}%`}
          positive
          to="/dashboard/portfolio"
        />
        <StatCard
          icon={BarChart3}
          label="Active investments"
          value={portfolio.activeInvestments}
          to="/dashboard/portfolio"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PortfolioChart />
        </div>
        <AllocationDonut />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RepaymentWidget />
        <div className="rounded-xl border border-border bg-white p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Quick actions</h3>
          <QuickActions />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-primary">Recommended for you</h3>
          <Link to="/dashboard/marketplace" className="text-xs font-medium text-text-muted hover:text-text-secondary transition-colors flex items-center gap-1">
            Explore all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </div>
    </div>
  );
}
