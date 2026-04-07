import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Store, Briefcase, ArrowLeftRight, User } from 'lucide-react';

const tabs = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home', end: true },
  { to: '/dashboard/marketplace', icon: Store, label: 'Explore' },
  { to: '/dashboard/portfolio', icon: Briefcase, label: 'Portfolio' },
  { to: '/dashboard/transactions', icon: ArrowLeftRight, label: 'Txns' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
];

export default function MobileTabBar() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-30 safe-area-pb">
      <div className="flex items-center justify-around h-14">
        {tabs.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-accent' : 'text-text-muted'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
