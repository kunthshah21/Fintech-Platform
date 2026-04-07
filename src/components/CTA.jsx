import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-accent-600/20 via-navy-900 to-emerald-500/10 px-8 py-16 text-center sm:px-16 sm:py-24"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent-500/20 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-emerald-500/15 blur-[80px]" />

          <div className="relative z-10">
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Start Your Investment Journey Today
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg text-navy-300">
              Join thousands of investors earning higher yields through smarter
              alternative investments. No hidden fees, no complex paperwork.
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className="group inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-accent-500/25 transition-all hover:bg-accent-600 hover:shadow-accent-500/40"
            >
              Create Free Account
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
