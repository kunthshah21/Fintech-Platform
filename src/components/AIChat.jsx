import { motion } from 'framer-motion';
import { Bot, Send, Sparkles, Target, MessageCircle } from 'lucide-react';

const chatMessages = [
  { role: 'user', text: "I have ₹5L to invest. I want moderate risk with good returns." },
  {
    role: 'ai',
    text: "Based on your profile, I'd recommend: 40% Invoice Discounting (12% p.a.), 35% P2P Lending (14% p.a.), and 25% Private Credit (13% p.a.). Blended return: ~13%.",
  },
  { role: 'user', text: 'Can I start with a smaller amount?' },
  {
    role: 'ai',
    text: "Of course — you can begin with as little as ₹10,000. I'll adjust the allocation proportionally. Ready to proceed?",
  },
];

const benefits = [
  {
    icon: MessageCircle,
    title: 'Natural language interface',
    description: 'Ask questions in plain language — no financial jargon required.',
  },
  {
    icon: Target,
    title: 'Personalized recommendations',
    description: 'Get investment picks tailored to your risk appetite and goals.',
  },
  {
    icon: Sparkles,
    title: 'Continuous optimization',
    description: 'AI monitors your portfolio and suggests rebalancing in real time.',
  },
];

export default function AIChat() {
  return (
    <section id="ai-advisor" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="mb-2 text-sm font-medium text-text-muted">AI Advisor</p>
            <h2 className="mb-4 text-3xl font-semibold tracking-[-0.02em] text-text-primary sm:text-4xl">
              Your personal investment guide
            </h2>
            <p className="mb-10 text-base leading-relaxed text-text-secondary">
              Our AI advisor understands your financial goals, risk tolerance,
              and time horizon — then builds the right portfolio for you.
            </p>

            <div className="space-y-5">
              {benefits.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-alt">
                    <Icon className="h-4 w-4 text-text-secondary" />
                  </div>
                  <div>
                    <h4 className="mb-0.5 text-sm font-semibold text-text-primary">{title}</h4>
                    <p className="text-sm leading-relaxed text-text-secondary">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-alt">
                  <Bot className="h-4 w-4 text-text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">YieldVest AI</p>
                  <p className="text-xs text-green">Online</p>
                </div>
              </div>

              <div className="space-y-3 p-5">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'rounded-br-md bg-accent text-white'
                          : 'rounded-bl-md bg-bg-alt text-text-secondary'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border px-5 py-3.5">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-alt px-4 py-2.5">
                  <span className="flex-1 text-sm text-text-muted">Ask about your investments...</span>
                  <Send className="h-4 w-4 text-text-muted" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
