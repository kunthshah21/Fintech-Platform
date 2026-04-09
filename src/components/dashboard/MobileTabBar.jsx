import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Store, Briefcase, ArrowLeftRight, ShieldCheck, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const BASE_TABS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home', end: true },
  { to: '/dashboard/marketplace', icon: Store, label: 'Explore' },
  { to: '/dashboard/portfolio', icon: Briefcase, label: 'Portfolio' },
  { to: '/dashboard/transactions', icon: ArrowLeftRight, label: 'Txns' },
];

const NAV_STEP_MAP = {
  3: '/dashboard/marketplace',
  6: '/dashboard/portfolio',
  9: '/dashboard/kyc',
};

export default function MobileTabBar() {
  const { tourStep, advanceTour, isKycVerified } = useApp();
  const tourNavTarget = NAV_STEP_MAP[tourStep] || null;
  const isTourActive = tourStep !== null;
  const tabs = [
    ...BASE_TABS,
    ...(!isKycVerified ? [{ to: '/dashboard/kyc', icon: ShieldCheck, label: 'KYC' }] : []),
    { to: '/dashboard/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-area-pb transition-[z-index] ${tourNavTarget ? 'z-[55]' : 'z-30'}`}>
      <div className="flex items-center justify-around h-14">
        {tabs.map(({ to, icon: Icon, label, end }) => {
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
                `flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-all duration-300 ${
                  isHighlighted
                    ? 'text-accent ring-2 ring-accent ring-offset-1 rounded-lg animate-pulse relative z-[60]'
                    : isActive
                      ? 'text-accent'
                      : isTourActive
                        ? 'text-text-muted/40 pointer-events-none'
                        : 'text-text-muted'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
