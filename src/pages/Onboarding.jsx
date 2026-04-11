import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, ArrowRight, ChevronLeft, Check, Loader2, Sparkles,
  Sprout, BarChart3, Rocket,
  Wallet, Shield,
  ShieldCheck, Scale, Flame,
  Clock, Timer, Calendar, Hourglass,
  Briefcase, Building2, Landmark, Layers,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const SCORE_MAP = {};

const questions = [
  {
    id: 'name',
    title: 'What should we call you?',
    subtitle: 'Enter your name so we can personalize your experience.',
    layout: 'input',
    placeholder: 'Your name',
    icon: User,
  },
  {
    id: 'sophistication',
    title: 'Where does your investing stand today?',
    subtitle: 'We ask this to show you products that match your experience level.',
    layout: 'list',
    options: [
      { id: 'fd', label: 'FDs and savings accounts only', description: 'Haven\'t explored beyond fixed deposits yet', icon: Sprout, score: 1 },
      { id: 'mf-stocks', label: 'Mutual funds or stocks', description: 'Invest in MFs/stocks but haven\'t tried lending platforms', icon: BarChart3, score: 2 },
      { id: 'p2p-tried', label: 'Tried P2P or invoice products', description: 'Have experience with alternative lending', icon: Rocket, score: 3 },
      { id: 'aif-structured', label: 'Unlisted / AIF / structured products', description: 'Actively invest in advanced instruments', icon: Layers, score: 4 },
    ],
  },
  {
    id: 'emotionalRisk',
    title: '\u20B91 lakh invested. After 6 months it shows \u20B988,000. What do you do?',
    subtitle: 'We ask this to understand how you react to short-term losses.',
    layout: 'cards',
    options: [
      { id: 'exit', label: 'Exit immediately', description: 'I can\'t afford to lose more', icon: ShieldCheck, score: 1 },
      { id: 'hold', label: 'Hold and wait', description: 'I believe it will recover', icon: Scale, score: 2 },
      { id: 'buy-more', label: 'Invest more', description: 'Lower price is a better entry point', icon: Flame, score: 3 },
    ],
  },
  {
    id: 'riskCapacity',
    title: 'How much of your savings are you comfortable putting into this?',
    subtitle: 'We ask this to ensure we never recommend more than you can afford.',
    layout: 'cards',
    options: [
      { id: 'less-10', label: 'Less than 10%', description: 'Purely exploratory allocation', icon: Shield, score: 1 },
      { id: '10-25', label: '10\u201325%', description: 'Meaningful alongside existing portfolio', icon: Wallet, score: 2 },
      { id: 'more-25', label: 'More than 25%', description: 'Actively shifting toward higher yield', icon: TrendingUp, score: 3 },
    ],
  },
  {
    id: 'horizon',
    title: 'When might you realistically need this money back?',
    subtitle: 'We ask this to match you with products that fit your timeline.',
    layout: 'list',
    options: [
      { id: 'under-3m', label: 'Within 3 months', description: 'Short-term capital', icon: Clock, score: 1 },
      { id: '6-12m', label: '6\u201312 months', description: 'Medium-term with some flexibility', icon: Timer, score: 2 },
      { id: '1-3y', label: '1\u20133 years', description: 'Can commit without early exit', icon: Calendar, score: 3 },
      { id: '3y-plus', label: '3+ years', description: 'Long-term wealth building', icon: Hourglass, score: 4 },
    ],
  },
  {
    id: 'stability',
    title: 'What is your income situation like?',
    subtitle: 'We ask this to gauge your ability to absorb potential delays.',
    layout: 'cards',
    options: [
      { id: 'salaried', label: 'Salaried', description: 'Stable monthly income', icon: Briefcase, score: 3 },
      { id: 'self-employed', label: 'Self-employed', description: 'Business owner \u2014 income varies', icon: Building2, score: 2 },
      { id: 'retired', label: 'Retired / Passive income', description: 'Living off investments or rental income', icon: Landmark, score: 1 },
    ],
  },
  {
    id: 'goal',
    title: 'Which of these sounds most like you?',
    subtitle: 'We ask this to personalise how we present your recommendations.',
    layout: 'list',
    options: [
      { id: 'fd-beater', label: 'Something better than FD', description: 'Reliable, simple, low stress', icon: ShieldCheck },
      { id: 'cashflow', label: 'Regular passive income', description: 'Monthly or quarterly cashflow', icon: Wallet },
      { id: 'diversify-equity', label: 'Diversify away from equity', description: 'Reduce exposure to stock market volatility', icon: BarChart3 },
      { id: 'max-yield', label: 'Highest possible yield', description: 'I understand there is risk involved', icon: Flame },
    ],
  },
  {
    id: 'defaultTolerance',
    title: 'How would you feel if one of your investments had a 2-month repayment delay?',
    subtitle: 'We ask this because delays can happen in alternative lending.',
    layout: 'cards',
    options: [
      { id: 'deal-breaker', label: 'Very uncomfortable', description: 'Delays are a deal-breaker for me', icon: Shield, score: 1 },
      { id: 'ok-with-explanation', label: 'Uncomfortable but okay', description: 'Fine if the platform explains what\'s happening', icon: Scale, score: 2 },
      { id: 'priced-in', label: 'Totally fine', description: 'I\'ve priced in some defaults for higher return', icon: Rocket, score: 3 },
    ],
  },
];

questions.forEach((q) => {
  if (q.options) {
    SCORE_MAP[q.id] = {};
    q.options.forEach((opt) => {
      SCORE_MAP[q.id][opt.id] = opt.score ?? opt.id;
    });
  }
});

const QUADRANT_META = {
  'cautious-wealthy': {
    label: 'Cautious Wealthy',
    description: 'You have strong financial capacity but prefer predictable, low-volatility returns. We\'ll lead with capital-protected and rated instruments.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  aggressive: {
    label: 'Aggressive Investor',
    description: 'You have both the capital and the appetite for higher-yield products. We\'ll show you the full suite with advanced analytics.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  'anxious-explorer': {
    label: 'Anxious Explorer',
    description: 'You\'re new to alternative investments and prefer to start small. We\'ll begin with low-ticket, trust-building opportunities.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  aspirational: {
    label: 'Aspirational Risk-Taker',
    description: 'You\'re yield-driven but working with a constrained wallet. We\'ll highlight accessible entry points with strong diversification.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
};

function getQuadrantFromAnswers(answers) {
  const toScore = (qId) => {
    const map = SCORE_MAP[qId];
    return map ? (map[answers[qId]] || 1) : 1;
  };
  const toleranceScore = toScore('emotionalRisk') + toScore('defaultTolerance');
  const capacityScore = toScore('riskCapacity') + toScore('stability');
  const highTolerance = toleranceScore >= 4;
  const highCapacity = capacityScore >= 4;

  if (highCapacity && !highTolerance) return 'cautious-wealthy';
  if (highCapacity && highTolerance) return 'aggressive';
  if (!highCapacity && highTolerance) return 'aspirational';
  return 'anxious-explorer';
}

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
      <div className="flex-1 min-w-0">
        <span className="font-medium text-sm">{option.label}</span>
        {option.description && (
          <p className={`mt-0.5 text-xs leading-relaxed ${selected ? 'text-white/70' : 'text-text-muted'}`}>
            {option.description}
          </p>
        )}
      </div>
      {selected && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex-shrink-0">
          <Check className="h-4 w-4" />
        </motion.div>
      )}
    </motion.button>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { registerNewUser, isAuthenticated, signUp } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [signingUp, setSigningUp] = useState(false);

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

  const handleGoToDashboard = async () => {
    const { name, ...rest } = answers;
    const scoredData = {};
    questions.forEach((q) => {
      if (q.id === 'name' || !rest[q.id]) return;
      const map = SCORE_MAP[q.id];
      scoredData[q.id] = map ? map[rest[q.id]] : rest[q.id];
    });

    if (!isAuthenticated) {
      if (!signUpEmail.trim() || !signUpPassword.trim()) {
        setSignUpError('Please enter your email and password to create an account.');
        return;
      }
      setSigningUp(true);
      setSignUpError('');
      const result = await signUp(signUpEmail.trim(), signUpPassword, name || 'Investor');
      if (!result.success) {
        setSignUpError(result.error || 'Sign up failed.');
        setSigningUp(false);
        return;
      }
    }

    await registerNewUser(name || 'Investor', scoredData);
    setSigningUp(false);
    navigate('/dashboard');
  };

  const canProceed = currentQuestion && answers[currentQuestion.id] && String(answers[currentQuestion.id]).trim();

  const renderOptions = () => {
    if (!currentQuestion) return null;
    const selected = answers[currentQuestion.id];
    const { layout, options } = currentQuestion;

    if (layout === 'input') {
      return (
        <div className="max-w-sm mx-auto">
          <input
            type="text"
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))}
            placeholder={currentQuestion.placeholder}
            className="w-full rounded-xl border border-border bg-white px-5 py-4 text-center text-lg font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter' && canProceed) goNext(); }}
          />
        </div>
      );
    }

    if (layout === 'cards') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              (() => {
                const quadrant = getQuadrantFromAnswers(answers);
                const meta = QUADRANT_META[quadrant];
                return (
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
                        Based on your answers, we&apos;ve identified your investor type.
                      </p>
                    </div>
                    <div className={`rounded-xl ${meta.bg} border border-border-light p-5 text-left`}>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${meta.color} mb-1`}>Your investor profile</p>
                      <p className="text-lg font-bold text-text-primary">{meta.label}</p>
                      <p className="mt-2 text-sm text-text-secondary leading-relaxed">{meta.description}</p>
                    </div>
                    <div className="rounded-xl bg-bg-alt border border-border-light p-4 text-left space-y-3">
                      {[
                        'Risk tolerance & capacity scored',
                        'Sophistication & horizon gates applied',
                        'Matched products generated',
                      ].map((text) => (
                        <div key={text} className="flex items-center gap-3">
                          <div className="flex-shrink-0 rounded-full bg-green-soft p-1">
                            <Check className="h-3 w-3 text-green" />
                          </div>
                          <span className="text-sm text-text-secondary">{text}</span>
                        </div>
                      ))}
                    </div>
                    {!isAuthenticated && (
                      <div className="space-y-3 text-left max-w-xs mx-auto">
                        <div>
                          <label className="text-xs font-medium text-text-muted mb-1 block">Email</label>
                          <input
                            type="email"
                            value={signUpEmail}
                            onChange={(e) => { setSignUpEmail(e.target.value); setSignUpError(''); }}
                            placeholder="your@email.com"
                            className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-text-muted mb-1 block">Password</label>
                          <input
                            type="password"
                            value={signUpPassword}
                            onChange={(e) => { setSignUpPassword(e.target.value); setSignUpError(''); }}
                            placeholder="Create a password (min 6 chars)"
                            className="w-full rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                          />
                        </div>
                        {signUpError && (
                          <p className="text-xs text-red">{signUpError}</p>
                        )}
                      </div>
                    )}
                    <button
                      onClick={handleGoToDashboard}
                      disabled={signingUp}
                      className="group inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:bg-border disabled:text-text-muted"
                    >
                      {signingUp ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</>
                      ) : (
                        <>Go to Dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                      )}
                    </button>
                  </motion.div>
                );
              })()
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
