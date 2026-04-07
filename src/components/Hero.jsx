import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Users, BadgeCheck, ArrowRight } from 'lucide-react';

const trustItems = [
  { icon: Users, label: '10,000+ Investors' },
  { icon: Shield, label: 'Bank-Grade Security' },
  { icon: BadgeCheck, label: 'RBI Compliant' },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center pt-16">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-alt px-3.5 py-1 text-xs font-medium text-text-secondary">
            AI-Powered Alternative Investments
          </span>
        </motion.div>

        <motion.h1
          className="mb-5 text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-text-primary"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          Higher yields, one{' '}
          <span className="text-green">trusted</span> platform
        </motion.h1>

        <motion.p
          className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-text-secondary"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          Access curated alternative investments — invoice discounting, P2P lending,
          and private credit — earning 10–18% annual returns, all with
          AI-guided portfolio recommendations.
        </motion.p>

        <motion.div
          className="mb-14 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
        >
          <button
            onClick={() => navigate('/onboarding')}
            className="group inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <a
            href="#features"
            className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-alt"
          >
            Learn More
          </a>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {trustItems.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-sm text-text-muted">
              <Icon className="h-3.5 w-3.5" />
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
