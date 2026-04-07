import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-950 px-6">
      <div className="text-center">
        <div className="mb-8 inline-flex items-center gap-2 text-2xl font-bold text-white">
          <TrendingUp className="h-8 w-8 text-accent-400" />
          YieldVest
        </div>
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Welcome Aboard
        </h1>
        <p className="mb-8 text-lg text-navy-400">
          Onboarding flow coming soon. We&apos;re building something great for you.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-medium text-white transition-all hover:border-white/40 hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
      </div>
    </div>
  );
}
