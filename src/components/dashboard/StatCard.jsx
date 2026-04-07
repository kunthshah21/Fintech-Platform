import { Link } from 'react-router-dom';

export default function StatCard({ icon: Icon, label, value, subValue, to, positive }) {
  const Wrapper = to ? Link : 'div';
  const wrapperProps = to ? { to } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="rounded-xl border border-border bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-alt">
          <Icon className="h-[18px] w-[18px] text-text-secondary" />
        </div>
        <span className="text-sm font-medium text-text-muted">{label}</span>
      </div>
      <div className="text-2xl font-semibold tracking-tight text-text-primary">{value}</div>
      {subValue && (
        <div className={`mt-1 text-sm font-medium ${positive === false ? 'text-red' : positive ? 'text-green' : 'text-text-muted'}`}>
          {subValue}
        </div>
      )}
    </Wrapper>
  );
}
