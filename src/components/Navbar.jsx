import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, TrendingUp } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'AI Advisor', href: '#ai-advisor' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-navy-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
          <TrendingUp className="h-7 w-7 text-accent-400" />
          YieldVest
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-navy-300 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => navigate('/onboarding')}
            className="rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-600 hover:shadow-lg hover:shadow-accent-500/25"
          >
            Get Started
          </button>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-navy-950/95 px-6 pb-6 pt-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-navy-300 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { setMobileOpen(false); navigate('/onboarding'); }}
              className="mt-2 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-600"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
