import { NavLink, useNavigate } from 'react-router-dom';
import {
  TrendingUp, LayoutDashboard, Store, Briefcase, ArrowLeftRight,
  ShieldCheck, User, HelpCircle, LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home', end: true },
  { to: '/dashboard/marketplace', icon: Store, label: 'Marketplace' },
  { to: '/dashboard/portfolio', icon: Briefcase, label: 'Portfolio' },
  { to: '/dashboard/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/dashboard/kyc', icon: ShieldCheck, label: 'KYC' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
  { to: '/dashboard/support', icon: HelpCircle, label: 'Support' },
];

const NAV_STEP_MAP = {
  3: '/dashboard/marketplace',
  6: '/dashboard/portfolio',
  9: '/dashboard/kyc',
};

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout, tourStep, advanceTour } = useApp();

  const tourNavTarget = NAV_STEP_MAP[tourStep] || null;
  const isTourActive = tourStep !== null;

  return (
    <aside className={`hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 border-r border-border bg-white transition-[z-index] ${tourNavTarget ? 'z-[55]' : 'z-30'}`}>
      <div className="flex items-center gap-2 px-6 h-16 border-b border-border">
        <TrendingUp className="h-5 w-5 text-green" />
        <span className="text-lg font-semibold text-text-primary">YieldVest</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => {
          const isHighlighted = tourNavTarget === to;

          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={(e) => {
                if (isTourActive && !isHighlighted) {
                  e.preventDefault();
                  return;
                }
                if (isHighlighted) {
                  setTimeout(() => advanceTour(), 100);
                }
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isHighlighted
                    ? 'ring-2 ring-accent ring-offset-2 animate-pulse bg-accent-soft text-accent relative z-[60]'
                    : isActive
                      ? 'bg-accent text-white'
                      : isTourActive
                        ? 'text-text-muted/50 cursor-not-allowed'
                        : 'text-text-secondary hover:bg-bg-alt hover:text-text-primary'
                }`
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={() => {
            if (isTourActive) return;
            logout();
            navigate('/');
          }}
          disabled={isTourActive}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-alt hover:text-text-primary transition-colors w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </aside>
  );
}
