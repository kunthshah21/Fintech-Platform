import { motion } from 'framer-motion';
import { FileText, Users, Landmark, BarChart3, Coins } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Invoice Discounting',
    description: 'Earn steady returns by financing verified business invoices with short tenures and low default rates.',
    returns: '10–14%',
  },
  {
    icon: Users,
    title: 'P2P Lending',
    description: 'Lend directly to vetted borrowers and earn attractive interest rates with diversified risk.',
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
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent-400">
            Investment Options
          </span>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            One Platform, All Solutions
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-navy-400">
            Discover a curated marketplace of alternative investments, each vetted for
            quality and designed to maximize your returns.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-accent-500/30 hover:bg-white/[0.08]"
              >
                <div className="mb-4 inline-flex rounded-xl bg-accent-500/10 p-3">
                  <Icon className="h-6 w-6 text-accent-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">{feat.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-navy-400">
                  {feat.description}
                </p>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                  {feat.returns} p.a.
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
