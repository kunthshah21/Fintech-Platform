import { motion } from 'framer-motion';
import { Bot, Send, Sparkles, Target, MessageCircle } from 'lucide-react';

const chatMessages = [
  { role: 'user', text: "I have ₹5L to invest. I want moderate risk with good returns." },
  {
    role: 'ai',
    text: "Based on your profile, I'd recommend a split: 40% in Invoice Discounting (12% p.a.), 35% in P2P Lending (14% p.a.), and 25% in Private Credit (13% p.a.). This gives an estimated blended return of ~13% with moderate risk.",
  },
  { role: 'user', text: 'Can I start with a smaller amount first?' },
  {
    role: 'ai',
    text: 'Absolutely! You can start with as little as ₹10,000. I\'ll adjust the allocation proportionally. Would you like to proceed?',
  },
];

const benefits = [
  {
    icon: MessageCircle,
    title: 'Chat Naturally',
    description: 'Ask questions in plain language — no financial jargon required.',
  },
  {
    icon: Target,
    title: 'Personalized Picks',
    description: 'Get investment recommendations tailored to your risk appetite and goals.',
  },
  {
    icon: Sparkles,
    title: 'Smart Rebalancing',
    description: 'AI monitors your portfolio and suggests optimizations in real time.',
  },
];

export default function AIChat() {
  return (
    <section id="ai-advisor" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Copy side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent-400">
              AI-Powered Advisor
            </span>
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Your Personal Investment{' '}
              <span className="bg-gradient-to-r from-accent-400 to-emerald-400 bg-clip-text text-transparent">
                AI Guide
              </span>
            </h2>
            <p className="mb-10 text-lg leading-relaxed text-navy-400">
              Not sure where to start? Our AI advisor chats with you to understand your
              financial goals, risk tolerance, and investment horizon — then recommends
              the perfect portfolio mix, just for you.
            </p>

            <div className="space-y-6">
              {benefits.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-500/10">
                    <Icon className="h-5 w-5 text-accent-400" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold text-white">{title}</h4>
                    <p className="text-sm text-navy-400">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Chat mockup side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl border border-white/10 bg-navy-900/80 shadow-2xl backdrop-blur-xl">
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500/20">
                  <Bot className="h-5 w-5 text-accent-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">YieldVest AI</p>
                  <p className="text-xs text-emerald-400">Online</p>
                </div>
              </div>

              {/* Chat messages */}
              <div className="space-y-4 p-6">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'rounded-br-md bg-accent-500 text-white'
                          : 'rounded-bl-md border border-white/10 bg-white/5 text-navy-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat input */}
              <div className="border-t border-white/10 px-6 py-4">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="flex-1 text-sm text-navy-500">Ask about your investments...</span>
                  <Send className="h-4 w-4 text-accent-400" />
                </div>
              </div>
            </div>

            {/* Glow effect behind card */}
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-accent-500/5 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
