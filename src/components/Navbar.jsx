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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-text-primary">
          <TrendingUp className="h-5 w-5 text-green" />
          YieldVest
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => navigate('/onboarding')}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            Get Started
          </button>
        </div>

        <button
          className="text-text-primary md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-white px-6 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { setMobileOpen(false); navigate('/onboarding'); }}
              className="mt-2 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
