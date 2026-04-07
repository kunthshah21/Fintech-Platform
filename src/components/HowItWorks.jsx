import { motion } from 'framer-motion';
import { UserPlus, Brain, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Sign Up & KYC',
    description:
      'Create your account and complete a quick, paperless KYC verification in under 2 minutes.',
  },
  {
    icon: Brain,
    step: '02',
    title: 'Get Matched',
    description:
      'Our AI analyzes your financial goals, risk appetite, and investment horizon to curate perfect opportunities.',
  },
  {
    icon: TrendingUp,
    step: '03',
    title: 'Start Earning',
    description:
      'Invest with a single click and track your returns in real time on your personalized dashboard.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent-400">
            Simple Process
          </span>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-navy-400">
            Getting started takes just minutes — not hours. We&apos;ve streamlined every
            step so you can focus on growing your wealth.
          </p>
        </motion.div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-16 hidden h-px bg-gradient-to-r from-transparent via-accent-500/30 to-transparent md:block" />

          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-accent-500/20 bg-navy-900 shadow-lg shadow-accent-500/10">
                  <Icon className="h-7 w-7 text-accent-400" />
                </div>
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-accent-500">
                  Step {s.step}
                </span>
                <h3 className="mb-3 text-xl font-semibold text-white">{s.title}</h3>
                <p className="mx-auto max-w-xs text-sm leading-relaxed text-navy-400">
                  {s.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
