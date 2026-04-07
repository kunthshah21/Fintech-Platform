import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, ArrowRight, ChevronLeft, Check, Loader2, Sparkles,
  Sprout, BarChart3, Rocket,
  PiggyBank, Wallet, Shield, Home,
  ShieldCheck, Scale, Flame,
  Clock, Timer, Calendar, Hourglass,
  DollarSign,
  Briefcase, Laptop, Building2, GraduationCap,
  LineChart, Landmark, Building, Bitcoin, Layers, Gem,
} from 'lucide-react';

const questions = [
  {
    id: 'experience',
    title: 'What is your investment experience level?',
    subtitle: 'This helps us tailor recommendations to your knowledge.',
    layout: 'cards',
    options: [
      { id: 'beginner', label: 'Beginner', description: 'New to investing', icon: Sprout },
      { id: 'intermediate', label: 'Intermediate', description: 'Some experience', icon: BarChart3 },
      { id: 'advanced', label: 'Advanced', description: 'Seasoned investor', icon: Rocket },
    ],
  },
  {
    id: 'goal',
    title: 'What is your primary investment goal?',
    subtitle: 'Choose the goal that matters most to you right now.',
    layout: 'list',
    options: [
      { id: 'wealth', label: 'Build Long-term Wealth', icon: TrendingUp },
      { id: 'retirement', label: 'Save for Retirement', icon: PiggyBank },
      { id: 'income', label: 'Generate Passive Income', icon: Wallet },
      { id: 'preserve', label: 'Preserve Capital', icon: Shield },
      { id: 'purchase', label: 'Save for a Major Purchase', icon: Home },
    ],
  },
  {
    id: 'risk',
    title: 'How much risk are you comfortable with?',
    subtitle: 'There are no wrong answers — this is about your comfort level.',
    layout: 'cards',
    options: [
      { id: 'conservative', label: 'Conservative', description: 'Prefer stability over high returns', icon: ShieldCheck },
      { id: 'moderate', label: 'Moderate', description: 'Balance of growth and safety', icon: Scale },
      { id: 'aggressive', label: 'Aggressive', description: 'Willing to take risks for growth', icon: Flame },
    ],
  },
  {
    id: 'horizon',
    title: 'What is your investment time horizon?',
    subtitle: 'How long do you plan to keep your money invested?',
    layout: 'list',
    options: [
      { id: 'short', label: 'Less than 2 years', icon: Clock },
      { id: 'medium', label: '2 to 5 years', icon: Timer },
      { id: 'long', label: '5 to 10 years', icon: Calendar },
      { id: 'very-long', label: 'More than 10 years', icon: Hourglass },
    ],
  },
  {
    id: 'amount',
    title: 'How much are you planning to invest initially?',
    subtitle: 'This helps us suggest the right portfolio size.',
    layout: 'list',
    options: [
      { id: 'under-1k', label: 'Under $1,000', icon: DollarSign },
      { id: '1k-10k', label: '$1,000 — $10,000', icon: DollarSign },
      { id: '10k-50k', label: '$10,000 — $50,000', icon: DollarSign },
      { id: '50k-100k', label: '$50,000 — $100,000', icon: DollarSign },
      { id: '100k-plus', label: '$100,000+', icon: DollarSign },
    ],
  },
  {
    id: 'situation',
    title: 'How would you describe your financial situation?',
    subtitle: 'This context helps our AI make better suggestions.',
    layout: 'cards-wide',
    options: [
      { id: 'salaried', label: 'Stable Salary', description: 'Regular, predictable income', icon: Briefcase },
      { id: 'freelance', label: 'Variable Income', description: 'Freelance or contract work', icon: Laptop },
      { id: 'business', label: 'Business Owner', description: 'Running your own business', icon: Building2 },
      { id: 'student', label: 'Student / Early Career', description: 'Just getting started', icon: GraduationCap },
    ],
  },
  {
    id: 'interests',
    title: 'Which investment areas interest you most?',
    subtitle: "Pick the one that excites you — we'll handle diversification.",
    layout: 'grid',
    options: [
      { id: 'stocks', label: 'Stocks & ETFs', icon: LineChart },
      { id: 'bonds', label: 'Bonds & Fixed Income', icon: Landmark },
      { id: 'real-estate', label: 'Real Estate', icon: Building },
      { id: 'crypto', label: 'Cryptocurrency', icon: Bitcoin },
      { id: 'mutual-funds', label: 'Mutual Funds', icon: Layers },
      { id: 'commodities', label: 'Commodities', icon: Gem },
    ],
  },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 160 : -160, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -160 : 160, opacity: 0 }),
};

function ProgressBar({ current, total }) {
  return (
    <div className="w-full">
      <div className="flex gap-1.5 mb-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
              i < current
                ? 'bg-accent'
                : i === current
                  ? 'bg-accent/30'
                  : 'bg-border'
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-text-muted">
        <span>Step {Math.min(current + 1, total)} of {total}</span>
        <span>{Math.round((current / total) * 100)}%</span>
      </div>
    </div>
  );
}

function CardOption({ option, selected, onSelect }) {
  const Icon = option.icon;
  return (
    <motion.button
      onClick={() => onSelect(option.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex flex-col items-center gap-3 rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer ${
        selected
          ? 'bg-accent text-white shadow-lg ring-2 ring-accent ring-offset-2'
          : 'bg-white border border-border hover:border-text-muted hover:shadow-sm'
      }`}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3"
        >
          <Check className="h-4 w-4" />
        </motion.div>
      )}
      <div className={`rounded-full p-3.5 ${selected ? 'bg-white/15' : 'bg-bg-alt'}`}>
        <Icon className={`h-6 w-6 ${selected ? 'text-white' : 'text-text-secondary'}`} />
      </div>
      <div>
        <div className="font-semibold text-sm">{option.label}</div>
        {option.description && (
          <div className={`mt-1 text-xs leading-relaxed ${selected ? 'text-white/70' : 'text-text-muted'}`}>
            {option.description}
          </div>
        )}
      </div>
    </motion.button>
  );
}

function ListOption({ option, selected, onSelect }) {
  const Icon = option.icon;
  return (
    <motion.button
      onClick={() => onSelect(option.id)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`flex items-center gap-4 rounded-xl px-5 py-4 text-left transition-all duration-200 cursor-pointer ${
        selected
          ? 'bg-accent text-white shadow-md ring-2 ring-accent ring-offset-2'
          : 'bg-white border border-border hover:border-text-muted hover:shadow-sm'
      }`}
    >
      <div className={`flex-shrink-0 rounded-lg p-2.5 ${selected ? 'bg-white/15' : 'bg-bg-alt'}`}>
        <Icon className={`h-5 w-5 ${selected ? 'text-white' : 'text-text-secondary'}`} />
      </div>
      <span className="font-medium text-sm flex-1">{option.label}</span>
      {selected && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex-shrink-0">
          <Check className="h-4 w-4" />
        </motion.div>
      )}
    </motion.button>
  );
}

function GridOption({ option, selected, onSelect }) {
  const Icon = option.icon;
  return (
    <motion.button
      onClick={() => onSelect(option.id)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative flex flex-col items-center gap-2.5 rounded-xl p-5 text-center transition-all duration-200 cursor-pointer ${
        selected
          ? 'bg-accent text-white shadow-lg ring-2 ring-accent ring-offset-2'
          : 'bg-white border border-border hover:border-text-muted hover:shadow-sm'
      }`}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2.5 right-2.5"
        >
          <Check className="h-3.5 w-3.5" />
        </motion.div>
      )}
      <div className={`rounded-full p-2.5 ${selected ? 'bg-white/15' : 'bg-bg-alt'}`}>
        <Icon className={`h-5 w-5 ${selected ? 'text-white' : 'text-text-secondary'}`} />
      </div>
      <span className="font-medium text-sm">{option.label}</span>
    </motion.button>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);

  const totalSteps = questions.length;
  const isComplete = step >= totalSteps;
  const currentQuestion = questions[step];

  const selectOption = (optionId) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const goNext = () => {
    if (step < totalSteps - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else if (step === totalSteps - 1) {
      setDirection(1);
      setStep(totalSteps);
      setAnalyzing(true);
      localStorage.setItem('yieldvest_onboarding', JSON.stringify(answers));
      setTimeout(() => setAnalyzing(false), 3000);
    }
  };

  const goBack = () => {
    if (isComplete) {
      setDirection(-1);
      setStep(totalSteps - 1);
      setAnalyzing(false);
      return;
    }
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    } else {
      navigate('/');
    }
  };

  const canProceed = currentQuestion && answers[currentQuestion.id];

  const renderOptions = () => {
    if (!currentQuestion) return null;
    const selected = answers[currentQuestion.id];
    const { layout, options } = currentQuestion;

    if (layout === 'cards') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {options.map((opt) => (
            <CardOption key={opt.id} option={opt} selected={selected === opt.id} onSelect={selectOption} />
          ))}
        </div>
      );
    }

    if (layout === 'cards-wide') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          {options.map((opt) => (
            <CardOption key={opt.id} option={opt} selected={selected === opt.id} onSelect={selectOption} />
          ))}
        </div>
      );
    }

    if (layout === 'list') {
      return (
        <div className="flex flex-col gap-3 max-w-lg mx-auto">
          {options.map((opt) => (
            <ListOption key={opt.id} option={opt} selected={selected === opt.id} onSelect={selectOption} />
          ))}
        </div>
      );
    }

    if (layout === 'grid') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
          {options.map((opt) => (
            <GridOption key={opt.id} option={opt} selected={selected === opt.id} onSelect={selectOption} />
          ))}
        </div>
      );
    }

    return null;
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-bg-alt flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-bg rounded-2xl shadow-xl border border-border w-full max-w-md p-8 sm:p-10 text-center"
        >
          <div className="mb-8 inline-flex items-center gap-2 text-xl font-semibold text-text-primary">
            <TrendingUp className="h-6 w-6 text-green" />
            YieldVest
          </div>

          <AnimatePresence mode="wait">
            {analyzing ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
                  <Loader2 className="h-8 w-8 text-accent animate-spin" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-text-primary">Analyzing your profile…</h2>
                  <p className="mt-2 text-sm text-text-secondary">
                    Our AI is finding the best investment strategy for you.
                  </p>
                </div>
                <div className="flex justify-center gap-1.5 pt-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-2 w-2 rounded-full bg-accent"
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-soft">
                  <Sparkles className="h-8 w-8 text-green" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-text-primary">Your profile is ready!</h2>
                  <p className="mt-2 text-sm text-text-secondary">
                    We&apos;ve crafted a personalized investment strategy based on your answers.
                  </p>
                </div>
                <div className="rounded-xl bg-bg-alt border border-border-light p-4 text-left space-y-3">
                  {[
                    'Risk profile assessed',
                    'Investment goals analyzed',
                    'Portfolio recommendations generated',
                  ].map((text) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="flex-shrink-0 rounded-full bg-green-soft p-1">
                        <Check className="h-3 w-3 text-green" />
                      </div>
                      <span className="text-sm text-text-secondary">{text}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="group inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-alt flex items-center justify-center p-4 sm:p-6">
      <div className="bg-bg rounded-2xl shadow-xl border border-border w-full max-w-3xl flex flex-col overflow-hidden"
        style={{ minHeight: 'min(680px, calc(100vh - 3rem))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 pt-6 pb-2">
          <div className="flex items-center gap-2 text-lg font-semibold text-text-primary">
            <TrendingUp className="h-5 w-5 text-green" />
            YieldVest
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-xs font-medium text-text-muted hover:text-text-secondary transition-colors"
          >
            Exit
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 sm:px-8 py-4">
          <ProgressBar current={step} total={totalSteps} />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8 pb-4 overflow-y-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="w-full"
            >
              <div className="mb-8 text-center">
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary">
                  {currentQuestion.title}
                </h1>
                <p className="mt-2 text-sm text-text-secondary">
                  {currentQuestion.subtitle}
                </p>
              </div>
              {renderOptions()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="border-t border-border-light px-6 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-alt cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              {step === 0 ? 'Home' : 'Back'}
            </button>
            <button
              onClick={goNext}
              disabled={!canProceed}
              className={`inline-flex items-center gap-1.5 rounded-lg px-6 py-2 text-sm font-medium transition-all ${
                canProceed
                  ? 'bg-accent text-white hover:bg-accent/90 cursor-pointer'
                  : 'bg-border text-text-muted cursor-not-allowed'
              }`}
            >
              {step === totalSteps - 1 ? 'Finish' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
