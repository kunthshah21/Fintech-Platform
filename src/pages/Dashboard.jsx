import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowLeft, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6">
      <div className="text-center">
        <div className="mb-8 inline-flex items-center gap-2 text-2xl font-semibold text-text-primary">
          <TrendingUp className="h-7 w-7 text-green" />
          YieldVest
        </div>
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft">
          <LayoutDashboard className="h-7 w-7 text-accent" />
        </div>
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Dashboard
        </h1>
        <p className="mb-8 text-lg text-text-secondary">
          Your personalized investment dashboard is coming soon.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-alt"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
      </div>
    </div>
  );
}
