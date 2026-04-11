import { useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useStaff } from '../../context/StaffContext';

const ROUTE_LABELS = {
  '/staff': 'Overview',
  '/staff/clients': 'Clients',
  '/staff/tickets': 'Tickets',
  '/staff/community': 'Community Moderation',
};

function getBreadcrumbs(pathname) {
  if (ROUTE_LABELS[pathname]) {
    return [ROUTE_LABELS[pathname]];
  }

  const clientMatch = pathname.match(/^\/staff\/clients\/(.+)$/);
  if (clientMatch) {
    return ['Clients', 'Client Detail'];
  }

  return ['Overview'];
}

export default function StaffHeader() {
  const { pathname } = useLocation();
  const { staff } = useStaff();
  const crumbs = getBreadcrumbs(pathname);

  return (
    <header className="h-14 border-b border-border bg-white flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-1.5 text-[13px]">
        <span className="text-text-muted">CRM</span>
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-text-muted" />
            <span className={i === crumbs.length - 1 ? 'text-text-primary font-medium' : 'text-text-muted'}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {staff && (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-medium">
            {(staff.name || staff.email || 'S').charAt(0).toUpperCase()}
          </div>
          <span className="text-[13px] text-text-secondary font-medium hidden sm:block">
            {staff.name || staff.email}
          </span>
        </div>
      )}
    </header>
  );
}
