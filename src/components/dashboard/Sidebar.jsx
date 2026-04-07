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

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useApp();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 border-r border-border bg-white z-30">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-border">
        <TrendingUp className="h-5 w-5 text-green" />
        <span className="text-lg font-semibold text-text-primary">YieldVest</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:bg-bg-alt hover:text-text-primary'
              }`
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-alt hover:text-text-primary transition-colors w-full"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </aside>
  );
}
