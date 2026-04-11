import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Loader2, Fingerprint, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, signUp, loginWithDigiLocker, isAuthenticated } = useApp();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [digiLoading, setDigiLoading] = useState(false);
  const [digiEmail, setDigiEmail] = useState('');
  const [digiPassword, setDigiPassword] = useState('');
  const [showDigiForm, setShowDigiForm] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
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

    if (isSignUp) {
      const result = await signUp(email.trim(), password, name.trim());
      setLoading(false);
      if (result.success) {
        navigate('/onboarding', { replace: true });
      } else {
        setError(result.error || 'Sign up failed. Please try again.');
      }
    } else {
      const result = await login(email.trim(), password);
      setLoading(false);
      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error || 'Invalid credentials. Please check your email and password.');
      }
    }
  };

  const handleDigiLockerLogin = async () => {
    if (!showDigiForm) {
      setShowDigiForm(true);
      return;
    }
    if (!digiEmail.trim() || !digiPassword.trim()) {
      setError('Please enter email and password for DigiLocker sign up.');
      return;
    }
    setError('');
    setDigiLoading(true);

    const result = await loginWithDigiLocker('DigiLocker User', digiEmail.trim(), digiPassword);
    setDigiLoading(false);
    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.error || 'DigiLocker sign up failed.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-alt flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-bg rounded-2xl shadow-xl border border-border w-full max-w-md p-8 sm:p-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xl font-semibold text-text-primary mb-2">
            <TrendingUp className="h-6 w-6 text-green" />
            YieldVest
          </div>
          <p className="text-sm text-text-secondary">
            {isSignUp ? 'Create your investment account' : 'Sign in to your investment dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-text-muted mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="Enter your name"
                className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                autoFocus={isSignUp}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-text-muted mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              autoComplete="email"
              autoFocus={!isSignUp}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-text-muted mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 rounded-lg bg-red-soft px-3 py-2.5 text-sm text-red"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:bg-border disabled:text-text-muted inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> {isSignUp ? 'Creating account...' : 'Signing in...'}</>
            ) : (
              <>{isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-light" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-bg px-3 text-text-muted">or continue with</span>
          </div>
        </div>

        {showDigiForm && (
          <div className="space-y-3 mb-4">
            <input
              type="email"
              value={digiEmail}
              onChange={(e) => { setDigiEmail(e.target.value); setError(''); }}
              placeholder="Email for DigiLocker account"
              className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            />
            <input
              type="password"
              value={digiPassword}
              onChange={(e) => { setDigiPassword(e.target.value); setError(''); }}
              placeholder="Create a password"
              className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            />
          </div>
        )}

        <button
          onClick={handleDigiLockerLogin}
          disabled={digiLoading}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-alt disabled:bg-border disabled:text-text-muted inline-flex items-center justify-center gap-2"
        >
          {digiLoading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Connecting to DigiLocker...</>
          ) : (
            <><Fingerprint className="h-4 w-4 text-accent" /> Sign in with DigiLocker</>
          )}
        </button>
        <p className="mt-2 text-center text-[10px] text-text-muted">
          Securely authenticate via the government DigiLocker service
        </p>

        <div className="mt-6 text-center text-sm text-text-secondary">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <button onClick={() => { setIsSignUp(false); setError(''); }} className="font-medium text-accent hover:underline">
                Sign In
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <button onClick={() => { setIsSignUp(true); setError(''); }} className="font-medium text-accent hover:underline">
                Create Account
              </button>
              {' '}or{' '}
              <Link to="/onboarding" className="font-medium text-accent hover:underline">
                Get Started
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
