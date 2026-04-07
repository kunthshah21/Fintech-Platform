import { motion } from 'framer-motion';
import { FileText, Users, Landmark, BarChart3, Coins } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Invoice Discounting',
    description: 'Finance verified business invoices with short tenures and low default rates for steady returns.',
    returns: '10–14%',
  },
  {
    icon: Users,
    title: 'P2P Lending',
    description: 'Lend directly to vetted borrowers and earn attractive interest with diversified risk profiles.',
    returns: '11–16%',
  },
  {
    icon: Landmark,
    title: 'Private Credit',
    description: 'Access institutional-grade credit opportunities previously reserved for large investors.',
    returns: '12–15%',
  },
  {
    icon: BarChart3,
    title: 'Structured Debt',
    description: 'Invest in carefully structured debt instruments designed for optimal risk-adjusted returns.',
    returns: '11–14%',
  },
  {
    icon: Coins,
    title: 'Revenue-Based Financing',
    description: 'Fund high-growth companies and earn returns linked to their revenue performance.',
    returns: '13–18%',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06 },
  }),
};

export default function Features() {
  return (
    <section id="features" className="bg-bg-alt py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="mb-2 text-sm font-medium text-text-muted">Investment Options</p>
          <h2 className="mb-4 text-3xl font-semibold tracking-[-0.02em] text-text-primary sm:text-4xl">
            One platform, every opportunity
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-text-secondary">
            A curated marketplace of alternative investments, each rigorously vetted
            and designed to help you earn beyond traditional fixed income.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-xl border border-border bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-lg bg-bg-alt p-2.5">
                  <Icon className="h-5 w-5 text-text-secondary" />
                </div>
                <h3 className="mb-1.5 text-base font-semibold text-text-primary">{feat.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                  {feat.description}
                </p>
                <span className="inline-flex rounded-md bg-green-soft px-2.5 py-0.5 text-sm font-medium text-green">
                  {feat.returns} p.a.
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
