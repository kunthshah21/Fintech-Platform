import { Link } from 'react-router-dom';
import { IndianRupee, TrendingUp, PiggyBank, BarChart3, ArrowRight, MessageSquare, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { opportunities } from '../data/mockData';
import StatCard from '../components/dashboard/StatCard';
import KYCBanner from '../components/dashboard/KYCBanner';
import PortfolioChart from '../components/dashboard/PortfolioChart';
import AllocationDonut from '../components/dashboard/AllocationDonut';
import RepaymentWidget from '../components/dashboard/RepaymentWidget';
import OpportunityCard from '../components/dashboard/OpportunityCard';
import QuickActions from '../components/dashboard/QuickActions';
import RoboChat from '../components/dashboard/RoboChat';

export default function DashboardHome() {
  const { portfolio, viewMode, setViewMode } = useApp();

  const featured = opportunities.slice(0, 3);
  const isChat = viewMode === 'chat';

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {isChat ? (
            <MessageSquare className="h-4 w-4 text-green" />
          ) : (
            <LayoutGrid className="h-4 w-4 text-text-muted" />
          )}
          <span className="text-sm font-medium text-text-secondary">
            {isChat ? 'AI Assistant' : 'Dashboard'}
          </span>
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-bg-alt border border-border">
          <button
            onClick={() => setViewMode('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              isChat ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Chat
          </button>
          <button
            onClick={() => setViewMode('standard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              !isChat ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Dashboard
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isChat ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <RoboChat />
          </motion.div>
        ) : (
          <motion.div
            key="standard"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
