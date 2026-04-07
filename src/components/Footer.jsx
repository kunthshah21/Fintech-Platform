import { TrendingUp } from 'lucide-react';

const links = {
  Product: ['Features', 'How It Works', 'AI Advisor', 'Pricing'],
  Company: ['About Us', 'Careers', 'Blog', 'Press'],
  Legal: ['Terms of Service', 'Privacy Policy', 'Risk Disclosure', 'Refund Policy'],
};

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="#" className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
              <TrendingUp className="h-5 w-5 text-green" />
              YieldVest
            </a>
            <p className="mb-5 text-sm leading-relaxed text-text-secondary">
              India&apos;s trusted marketplace for alternative investments.
              Earn higher yields with AI-powered guidance.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-bg-alt px-3 py-1 text-xs text-text-muted">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green" />
              Made in India
            </div>
          </div>

          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} YieldVest. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Investments are subject to market risks. Please read all documents carefully.
          </p>
        </div>
      </div>
    </footer>
  );
}
