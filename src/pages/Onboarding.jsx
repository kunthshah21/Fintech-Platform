import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6">
      <div className="text-center">
        <div className="mb-8 inline-flex items-center gap-2 text-2xl font-semibold text-text-primary">
          <TrendingUp className="h-7 w-7 text-green" />
          YieldVest
        </div>
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Welcome aboard
        </h1>
        <p className="mb-8 text-lg text-text-secondary">
          Onboarding flow coming soon. We&apos;re building something great for you.
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
