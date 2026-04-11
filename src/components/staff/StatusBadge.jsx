const variants = {
  green: 'bg-green-soft text-green',
  red: 'bg-red-soft text-red',
  amber: 'bg-amber-soft text-amber',
  blue: 'bg-blue-soft text-blue',
  gray: 'bg-gray-100 text-gray-500',
};

const STATUS_MAP = {
  verified: 'green',
  on_track: 'green',
  resolved: 'green',
  high: 'red',
  defaulted: 'red',
  open: 'blue',
  in_progress: 'amber',
  pending_verification: 'amber',
  medium: 'amber',
  delayed: 'amber',
  not_started: 'gray',
  closed: 'gray',
  low: 'green',
  matured: 'blue',
};

export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;
  const variant = STATUS_MAP[status] || 'gray';
  const colorClasses = variants[variant];
  const label = status.replace(/_/g, ' ');

  return (
    <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold capitalize leading-tight ${colorClasses} ${className}`}>
      {label}
    </span>
  );
}
