export default function StatCard({ label, value, subtext }) {
  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <p className="text-[11px] font-medium text-text-muted uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-semibold text-text-primary mt-1 tabular-nums">{value}</p>
      {subtext && (
        <p className="text-[11px] text-text-muted mt-1">{subtext}</p>
      )}
    </div>
  );
}
