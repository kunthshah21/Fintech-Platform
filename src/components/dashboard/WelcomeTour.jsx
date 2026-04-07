import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, LayoutDashboard, Store, Briefcase, ShieldCheck, MessageSquare,
  ArrowRight, X, ChevronRight, ChevronLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const riskLabels = {
  conservative: 'Conservative',
  moderate: 'Balanced',
  aggressive: 'Growth-focused',
};

const riskDescriptions = {
  conservative: 'stability and capital preservation with steady, lower-risk returns',
  moderate: 'a balance of growth and safety across diversified products',
  aggressive: 'high-growth opportunities with higher return potential',
};

export default function WelcomeTour() {
  const { user, onboardingAnswers, recommendations, completeTour, isNewUser, hasSeenTour } = useApp();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isNewUser || hasSeenTour) return null;

  const riskProfile = onboardingAnswers?.risk || 'moderate';
  const topRec = recommendations[0];

  const steps = [
    {
      icon: Sparkles,
      iconBg: 'bg-green-soft',
      iconColor: 'text-green',
      title: `Welcome to YieldVest, ${user.name}!`,
      description: onboardingAnswers
        ? `Based on your ${riskLabels[riskProfile] || 'Balanced'} risk profile, we recommend focusing on ${riskDescriptions[riskProfile] || riskDescriptions.moderate}. ${topRec ? `Your top match: ${topRec.issuer} at ${topRec.returnRate}% p.a.` : ''}`
        : `We're excited to have you here. Let's take a quick tour of your investment dashboard.`,
    },
    {
      icon: LayoutDashboard,
      iconBg: 'bg-accent-soft',
      iconColor: 'text-accent',
      title: 'Your Dashboard',
      description: 'Switch between the AI Chat assistant and the visual Dashboard view. The chat lets you ask questions about your finances in natural language.',
    },
    {
      icon: Store,
      iconBg: 'bg-blue-soft',
      iconColor: 'text-blue',
      title: 'Investment Marketplace',
      description: 'Browse curated investment opportunities across Invoice Discounting, P2P Lending, Private Credit, and more. Filter by risk, returns, and tenure.',
    },
    {
      icon: Briefcase,
      iconBg: 'bg-green-soft',
      iconColor: 'text-green',
      title: 'Your Portfolio',
      description: 'Track all your investments here. Right now it\'s empty, but it\'ll fill up as you start investing. Monitor returns, repayments, and diversification.',
    },
    {
      icon: ShieldCheck,
      iconBg: 'bg-amber-soft',
      iconColor: 'text-amber',
      title: 'Complete Your KYC',
      description: 'Before you can invest, you\'ll need to verify your identity. It only takes a few minutes with PAN, Aadhaar, and bank verification.',
    },
    {
      icon: MessageSquare,
      iconBg: 'bg-accent-soft',
      iconColor: 'text-accent',
      title: 'AI Investment Assistant',
      description: 'Ask our AI about portfolio performance, allocation, market opportunities, and more. It\'s like having a personal financial advisor.',
    },
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;

  const handleNext = () => {
    if (isLast) {
      completeTour();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) setCurrentStep((s) => s - 1);
  };

  const handleSkip = () => {
    completeTour();
  };

  const handleStartKyc = () => {
    completeTour();
    navigate('/dashboard/kyc');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={handleSkip}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.25 }}
          className="relative bg-white rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 sm:p-8"
        >
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-bg-alt transition-colors"
          >
            <X className="h-4 w-4 text-text-muted" />
          </button>

          <div className="text-center space-y-4">
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${step.iconBg}`}>
              <StepIcon className={`h-7 w-7 ${step.iconColor}`} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary">{step.title}</h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">{step.description}</p>
            </div>

            {currentStep === 0 && topRec && onboardingAnswers && (
              <div className="rounded-xl bg-bg-alt border border-border-light p-4 text-left">
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Top recommendation</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-white border border-border flex items-center justify-center text-xs font-bold text-text-secondary">
                    {topRec.issuerLogo}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{topRec.issuer}</p>
                    <p className="text-xs text-text-muted">{topRec.productType} &middot; {topRec.returnRate}% p.a. &middot; {topRec.tenure}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 pt-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentStep ? 'w-6 bg-accent' : i < currentStep ? 'w-1.5 bg-accent/40' : 'w-1.5 bg-border'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              {!isFirst && (
                <button
                  onClick={handleBack}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-alt"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              )}
              {isFirst && (
                <button
                  onClick={handleSkip}
                  className="flex-1 inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-bg-alt"
                >
                  Skip tour
                </button>
              )}
              {isLast ? (
                <button
                  onClick={handleStartKyc}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                >
                  Start KYC <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
