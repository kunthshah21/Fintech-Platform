import { TrendingUp } from 'lucide-react';

const links = {
  Product: ['Features', 'How It Works', 'AI Advisor', 'Pricing'],
  Company: ['About Us', 'Careers', 'Blog', 'Press'],
  Legal: ['Terms of Service', 'Privacy Policy', 'Risk Disclosure', 'Refund Policy'],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="#" className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
              <TrendingUp className="h-6 w-6 text-accent-400" />
              YieldVest
            </a>
            <p className="mb-6 text-sm leading-relaxed text-navy-400">
              India&apos;s trusted marketplace for alternative investments. Earn higher
              yields with AI-powered guidance.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-navy-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Made in India
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                {heading}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-navy-400 transition-colors hover:text-white"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-navy-500">
            &copy; {new Date().getFullYear()} YieldVest. All rights reserved.
          </p>
          <p className="text-xs text-navy-500">
            Investments are subject to market risks. Please read all documents carefully
            before investing.
          </p>
        </div>
      </div>
    </footer>
  );
}
