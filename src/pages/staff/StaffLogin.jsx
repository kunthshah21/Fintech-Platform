import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { TrendingUp, Loader2, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useStaff } from '../../context/StaffContext';

export default function StaffLogin() {
  const navigate = useNavigate();
  const { isStaff, loading: ctxLoading, staffLogin, staffSignUp } = useStaff();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (ctxLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-alt">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  if (isStaff) {
    return <Navigate to="/staff" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    if (isSignUp && !name.trim()) {
      setError('Please enter your name.');
      return;
    }
    setError('');
    setLoading(true);

    let result;
    if (isSignUp) {
      result = await staffSignUp(email.trim(), password, name.trim());
    } else {
      result = await staffLogin(email.trim(), password);
    }

    setLoading(false);
    if (result.success) {
      navigate('/staff', { replace: true });
    } else {
      setError(result.error || 'Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-alt flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-border w-full max-w-sm p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-base font-semibold text-text-primary mb-1">
            <TrendingUp className="h-4 w-4 text-green" />
            YieldVest
          </div>
          <p className="text-[11px] text-text-muted font-medium uppercase tracking-wide mt-1">Staff Portal</p>
          <p className="text-xs text-text-secondary mt-2">
            {isSignUp ? 'Create your staff account' : 'Sign in to the CRM dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-medium text-text-muted mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="Enter your name"
                className="w-full rounded-md border border-border bg-bg-alt px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-text-muted mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="staff@yieldvest.in"
              autoComplete="email"
              className="w-full rounded-md border border-border bg-bg-alt px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-text-muted mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="w-full rounded-md border border-border bg-bg-alt px-3 py-2 pr-9 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md bg-red-soft px-3 py-2 text-xs text-red">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:bg-border disabled:text-text-muted transition-colors inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> {isSignUp ? 'Creating...' : 'Signing in...'}</>
            ) : (
              <>{isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight className="h-3.5 w-3.5" /></>
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-text-secondary">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <button onClick={() => { setIsSignUp(false); setError(''); }} className="font-medium text-accent hover:underline">
                Sign In
              </button>
            </>
          ) : (
            <>
              Need a staff account?{' '}
              <button onClick={() => { setIsSignUp(true); setError(''); }} className="font-medium text-accent hover:underline">
                Create Account
              </button>
            </>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border-light text-center">
          <Link to="/login" className="text-[11px] text-text-muted hover:text-text-secondary transition-colors">
            Investor login &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
