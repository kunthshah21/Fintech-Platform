import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl bg-accent px-8 py-16 text-center sm:px-16 sm:py-20"
        >
          <h2 className="mb-4 text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
            Ready to invest smarter?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-white/70">
            Join thousands of investors earning higher yields through curated
            alternative investments. No hidden fees, no complex paperwork.
          </p>
          <button
            onClick={() => navigate('/onboarding')}
            className="group inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-white/90"
          >
            Create Free Account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
