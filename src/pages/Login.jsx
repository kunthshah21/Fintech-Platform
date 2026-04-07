import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Loader2, Fingerprint, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithDigiLocker, isAuthenticated } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [digiLoading, setDigiLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleCredentialLogin = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both ID name and password.');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(username.trim(), password);
      setLoading(false);
      if (success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError('Invalid credentials. Please check your ID name and password.');
      }
    }, 800);
  };

  const handleDigiLockerLogin = () => {
    setError('');
    setDigiLoading(true);

    setTimeout(() => {
      loginWithDigiLocker('DigiLocker User');
      setDigiLoading(false);
      navigate('/dashboard', { replace: true });
    }, 2000);
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
          <p className="text-sm text-text-secondary">Sign in to your investment dashboard</p>
        </div>

        <form onSubmit={handleCredentialLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-xs font-medium text-text-muted mb-1.5">
              ID Name
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter your ID name"
              className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              autoComplete="username"
              autoFocus
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
                autoComplete="current-password"
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
              <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
            ) : (
              <>Sign In <ArrowRight className="h-4 w-4" /></>
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
          Don&apos;t have an account?{' '}
          <Link to="/onboarding" className="font-medium text-accent hover:underline">
            Get Started
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
