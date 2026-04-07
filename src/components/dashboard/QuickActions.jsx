import { useNavigate } from 'react-router-dom';
import { Plus, ArrowDownToLine, Users, FileText } from 'lucide-react';

const actions = [
  { icon: Plus, label: 'Add money', path: '/dashboard/transactions' },
  { icon: ArrowDownToLine, label: 'Withdraw', path: '/dashboard/transactions' },
  { icon: Users, label: 'Refer a friend', path: '/dashboard/profile' },
  { icon: FileText, label: 'Statement', path: '/dashboard/transactions' },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map(({ icon: Icon, label, path }) => (
        <button
          key={label}
          onClick={() => navigate(path)}
          className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-4 text-center transition-shadow hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-alt">
            <Icon className="h-[18px] w-[18px] text-text-secondary" />
          </div>
          <span className="text-xs font-medium text-text-secondary">{label}</span>
        </button>
      ))}
    </div>
  );
}
