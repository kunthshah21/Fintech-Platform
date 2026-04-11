import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Ticket, MessageSquare, LogOut, TrendingUp } from 'lucide-react';
import { useStaff } from '../../context/StaffContext';

const navItems = [
  { to: '/staff', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/staff/clients', icon: Users, label: 'Clients' },
  { to: '/staff/tickets', icon: Ticket, label: 'Tickets' },
  { to: '/staff/community', icon: MessageSquare, label: 'Community' },
];

export default function StaffSidebar() {
  const navigate = useNavigate();
  const { staffLogout } = useStaff();

  const handleLogout = async () => {
    await staffLogout();
    navigate('/staff/login');
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:fixed lg:inset-y-0 border-r border-border bg-white z-30">
      <div className="flex items-center gap-2 px-5 h-14 border-b border-border">
        <TrendingUp className="h-4 w-4 text-green" />
        <span className="text-sm font-semibold text-text-primary tracking-tight">YieldVest</span>
        <span className="ml-auto text-[10px] font-medium text-text-muted bg-bg-alt px-1.5 py-0.5 rounded">CRM</span>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:bg-bg-alt hover:text-text-primary'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 py-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium text-text-secondary hover:bg-bg-alt hover:text-text-primary transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
