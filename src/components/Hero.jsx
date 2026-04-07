import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Users, BadgeCheck } from 'lucide-react';

const trustItems = [
  { icon: Users, label: '10,000+ Investors' },
  { icon: Shield, label: 'Bank-Grade Security' },
  { icon: BadgeCheck, label: 'RBI Compliant' },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      {/* Abstract animated background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] animate-[spin_25s_linear_infinite] rounded-full bg-accent-500/20 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 h-[500px] w-[500px] animate-[spin_30s_linear_infinite_reverse] rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-accent-400/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-navy-950)_70%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="mb-6 inline-block rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-sm font-medium text-accent-300">
            Alternative Investments Made Simple
          </span>
        </motion.div>

        <motion.h1
          className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          Unlock Higher Yields with{' '}
          <span className="bg-gradient-to-r from-accent-400 to-emerald-400 bg-clip-text text-transparent">
            Smarter Investments
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-navy-300 sm:text-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Access curated alternative investment opportunities — from invoice discounting
          and P2P lending to private credit — earning{' '}
          <span className="font-semibold text-emerald-400">10–18% annual returns</span>,
          all on a single trusted platform.
        </motion.p>

        <motion.div
          className="mb-16 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <button
            onClick={() => navigate('/onboarding')}
            className="group relative rounded-xl bg-accent-500 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-accent-500/25 transition-all hover:bg-accent-600 hover:shadow-accent-500/40"
          >
            Get Started — It's Free
            <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
          <a
            href="#features"
            className="rounded-xl border border-white/20 px-8 py-4 text-lg font-medium text-white transition-all hover:border-white/40 hover:bg-white/5"
          >
            Explore Options
          </a>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          {trustItems.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-navy-400">
              <Icon className="h-4 w-4 text-emerald-400" />
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
