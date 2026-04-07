import { motion } from 'framer-motion';
import { UserPlus, Brain, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    num: '01',
    title: 'Create your account',
    description:
      'Sign up and complete a quick, paperless KYC verification in under two minutes.',
  },
  {
    icon: Brain,
    num: '02',
    title: 'Get matched',
    description:
      'Our AI analyzes your goals, risk appetite, and investment horizon to find the right opportunities.',
  },
  {
    icon: TrendingUp,
    num: '03',
    title: 'Start earning',
    description:
      'Invest with a single click and track your returns in real time from your dashboard.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-bg-alt py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="mb-2 text-sm font-medium text-text-muted">How It Works</p>
          <h2 className="mb-4 text-3xl font-semibold tracking-[-0.02em] text-text-primary sm:text-4xl">
            Three steps to get started
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-text-secondary">
            We&apos;ve streamlined every step so you can go from sign-up to investing
            in minutes.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl border border-border bg-white p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-alt">
                    <Icon className="h-5 w-5 text-text-secondary" />
                  </div>
                  <span className="text-2xl font-semibold tabular-nums text-border">
                    {s.num}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-semibold text-text-primary">{s.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">
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
