import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, X, ChevronRight, TrendingUp, Shield,
  Clock, IndianRupee, BarChart3, CheckCircle2, Store, Briefcase, ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const quadrantLabels = {
  'cautious-wealthy': 'Cautious Wealthy',
  aggressive: 'Aggressive Investor',
  'anxious-explorer': 'Anxious Explorer',
  aspirational: 'Aspirational Risk-Taker',
};

const quadrantColors = {
  'cautious-wealthy': 'bg-blue-50 text-blue-600',
  aggressive: 'bg-green-soft text-green',
  'anxious-explorer': 'bg-amber-soft text-amber',
  aspirational: 'bg-purple-50 text-purple-600',
};

const goalCopy = {
  'fd-beater': 'earn more than FDs with minimal stress',
  cashflow: 'generate regular passive income',
  'diversify-equity': 'diversify away from equity volatility',
  'max-yield': 'chase the highest possible yield',
};

function buildWhyText(profile, topRec) {
  if (!profile || !topRec) return '';
  const label = quadrantLabels[profile.quadrant] || 'Balanced';
  const goalText = goalCopy[profile.goal] || 'grow your wealth';
  return `As a ${label} investor looking to ${goalText}, we recommend ${topRec.productType} with ${topRec.issuer}. This ${topRec.riskRating?.toLowerCase()}-risk product offers ${topRec.returnRate}% annual returns over ${topRec.tenure}.`;
}

const TOUR_STEPS = [
  { type: 'modal', target: null, title: 'Welcome', description: '' },
  { type: 'spotlight', target: 'stat-cards', title: 'Portfolio Summary', description: 'Your portfolio summary — track invested amounts, returns, and active investments at a glance.', position: 'bottom' },
  { type: 'spotlight', target: 'recommendations', title: 'Best Matches', description: 'Opportunities matched to your risk profile. Tap any card to explore details.', position: 'top' },
  { type: 'nav', target: '/dashboard/marketplace', title: 'Marketplace', description: 'Tap Marketplace to browse all investment opportunities.', icon: Store },
  { type: 'spotlight', target: 'marketplace-search', title: 'Search & Filter', description: 'Search and filter opportunities by risk, returns, tenure, and more.', position: 'bottom' },
  { type: 'spotlight', target: 'marketplace-cards', title: 'Opportunity Cards', description: 'Each card shows key details — returns, risk rating, and funding progress.', position: 'top' },
  { type: 'nav', target: '/dashboard/portfolio', title: 'Portfolio', description: 'Tap Portfolio to see how your investments perform.', icon: Briefcase },
  { type: 'spotlight', target: 'portfolio-summary', title: 'Portfolio Overview', description: "Your portfolio overview — all zeros now, but will fill up as you invest.", position: 'bottom' },
  { type: 'spotlight', target: 'portfolio-cta', title: 'Start Investing', description: "Head to the Marketplace from here when you're ready to invest.", position: 'top' },
  { type: 'nav', target: '/dashboard/kyc', title: 'KYC Verification', description: 'Tap KYC to verify your identity before investing.', icon: ShieldCheck },
  { type: 'spotlight', target: 'kyc-start', title: 'Identity Verification', description: 'Complete these 4 quick steps to verify your identity and start investing.', position: 'bottom' },
  { type: 'finish', target: null, title: "You're all set!", description: 'Your tour is complete. Start your KYC or explore the marketplace.' },
];

function useTargetRect(target, tourStep) {
  const [rect, setRect] = useState(null);
  const rafRef = useRef(null);

  const measure = useCallback(() => {
    if (!target) { setRect(null); return; }
    const el = document.querySelector(`[data-tour="${target}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const doMeasure = () => {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      };
      rafRef.current = requestAnimationFrame(() => {
        setTimeout(doMeasure, 350);
      });
    } else {
      setRect(null);
    }
  }, [target]);

  useEffect(() => {
    measure();
    const handleResize = () => measure();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [measure, tourStep]);

  return rect;
}

function WelcomeModal({ user, profile, topRec, onStart, onSkip }) {
  const quadrant = profile?.quadrant || 'anxious-explorer';
  const whyText = buildWhyText(profile, topRec);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative bg-white rounded-2xl border border-border shadow-2xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onSkip} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-bg-alt transition-colors">
          <X className="h-4 w-4 text-text-muted" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-soft mb-4">
            <Sparkles className="h-7 w-7 text-green" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary">
            Welcome to YieldVest, {user.name}!
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Let&apos;s get you started with your personalized investment journey.
          </p>
        </div>

        {topRec && profile && (
          <div className="rounded-xl border border-border bg-bg-alt p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${quadrantColors[quadrant] || quadrantColors['anxious-explorer']}`}>
                <Shield className="h-3 w-3" />
                {quadrantLabels[quadrant] || 'Explorer'}
              </span>
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Top Pick</span>
            </div>

            <div className="flex items-start gap-3 mb-4">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-white border border-border flex items-center justify-center text-sm font-bold text-text-secondary shadow-sm">
                {topRec.issuerLogo}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">{topRec.issuer}</p>
                <p className="text-xs text-text-muted">{topRec.productType}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-lg font-bold text-green">{topRec.returnRate}%</p>
                <p className="text-[10px] text-text-muted">p.a. returns</p>
              </div>
            </div>

            {whyText && (
              <p className="text-xs text-text-secondary leading-relaxed mb-4">{whyText}</p>
            )}

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-lg bg-white border border-border-light p-2.5 text-center">
                <Clock className="h-3.5 w-3.5 text-text-muted mx-auto mb-1" />
                <p className="text-xs font-semibold text-text-primary">{topRec.tenure}</p>
                <p className="text-[10px] text-text-muted">Tenure</p>
              </div>
              <div className="rounded-lg bg-white border border-border-light p-2.5 text-center">
                <IndianRupee className="h-3.5 w-3.5 text-text-muted mx-auto mb-1" />
                <p className="text-xs font-semibold text-text-primary">₹{topRec.minInvestment?.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-text-muted">Min invest</p>
              </div>
              <div className="rounded-lg bg-white border border-border-light p-2.5 text-center">
                <BarChart3 className="h-3.5 w-3.5 text-text-muted mx-auto mb-1" />
                <p className="text-xs font-semibold text-text-primary">{topRec.riskRating}</p>
                <p className="text-[10px] text-text-muted">Risk</p>
              </div>
            </div>

            {topRec.creditRating && (
              <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
                <Shield className="h-3 w-3" />
                Credit Rating: <span className="font-semibold text-text-primary">{topRec.creditRating}</span>
              </div>
            )}

            {topRec.fundedPercent != null && (
              <div>
                <div className="flex justify-between text-[10px] text-text-muted mb-1">
                  <span>Funding progress</span>
                  <span>{topRec.fundedPercent}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-border-light overflow-hidden">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${topRec.fundedPercent}%` }} />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={onSkip}
            className="text-sm font-medium text-text-muted hover:text-text-secondary transition-colors"
          >
            Skip tour
          </button>
          <button
            onClick={onStart}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            Start Tour <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function SpotlightOverlay({ rect, step, stepIndex, totalSteps, onNext, onSkip }) {
  const padding = 10;
  const tooltipRef = useRef(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!rect || !tooltipRef.current) return;
    const tt = tooltipRef.current.getBoundingClientRect();
    let top, left;

    if (step.position === 'bottom') {
      top = rect.top + rect.height + padding + 12;
      left = rect.left + rect.width / 2 - tt.width / 2;
    } else {
      top = rect.top - tt.height - padding - 12;
      left = rect.left + rect.width / 2 - tt.width / 2;
    }

    left = Math.max(12, Math.min(left, window.innerWidth - tt.width - 12));
    top = Math.max(12, Math.min(top, window.innerHeight - tt.height - 12));
    setTooltipPos({ top, left });
  }, [rect, step.position]);

  if (!rect) return null;

  const cutout = {
    top: rect.top - padding,
    left: rect.left - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };

  return (
    <div className="fixed inset-0 z-[50] pointer-events-auto">
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0,0,0,0.45)',
          clipPath: `polygon(
            0% 0%, 0% 100%, ${cutout.left}px 100%, ${cutout.left}px ${cutout.top}px,
            ${cutout.left + cutout.width}px ${cutout.top}px, ${cutout.left + cutout.width}px ${cutout.top + cutout.height}px,
            ${cutout.left}px ${cutout.top + cutout.height}px, ${cutout.left}px 100%, 100% 100%, 100% 0%
          )`,
        }}
      />

      <div
        className="absolute rounded-xl ring-2 ring-accent/60 ring-offset-2"
        style={{
          top: cutout.top,
          left: cutout.left,
          width: cutout.width,
          height: cutout.height,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        ref={tooltipRef}
        initial={{ opacity: 0, y: step.position === 'bottom' ? -8 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="fixed bg-white rounded-xl border border-border shadow-xl p-4 max-w-xs z-[60]"
        style={{ top: tooltipPos.top, left: tooltipPos.left }}
      >
        <h4 className="text-sm font-semibold text-text-primary mb-1">{step.title}</h4>
        <p className="text-xs text-text-secondary leading-relaxed mb-3">{step.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-muted">{stepIndex} / {totalSteps}</span>
          <div className="flex items-center gap-2">
            <button onClick={onSkip} className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Skip
            </button>
            <button
              onClick={onNext}
              className="inline-flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent/90 transition-colors"
            >
              Next <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function NavHighlightOverlay({ step, onSkip }) {
  return (
    <div className="fixed inset-0 z-[50] pointer-events-auto bg-black/45">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl border border-border shadow-xl p-5 max-w-xs z-[60] text-center"
      >
        {step.icon && (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft mb-3">
            <step.icon className="h-5 w-5 text-accent" />
          </div>
        )}
        <h4 className="text-sm font-semibold text-text-primary mb-1">{step.title}</h4>
        <p className="text-xs text-text-secondary leading-relaxed mb-3">{step.description}</p>
        <button onClick={onSkip} className="text-xs text-text-muted hover:text-text-secondary transition-colors">
          Skip tour
        </button>
      </motion.div>
    </div>
  );
}

function FinishModal({ onKyc, onMarketplace, onComplete }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white rounded-2xl border border-border shadow-2xl max-w-sm w-full p-6 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-soft mb-4">
          <CheckCircle2 className="h-7 w-7 text-green" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">You&apos;re all set!</h3>
        <p className="text-sm text-text-secondary mb-6">Your tour is complete. Start your KYC or explore the marketplace.</p>
        <div className="flex gap-3">
          <button
            onClick={onKyc}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-bg-alt transition-colors"
          >
            Complete KYC
          </button>
          <button
            onClick={onMarketplace}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
          >
            Explore <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function WelcomeTour() {
  const {
    user, investorProfile, recommendations, tourStep, setTourStep,
    advanceTour, completeTour, isNewUser, hasSeenTour,
  } = useApp();
  const navigate = useNavigate();

  const step = tourStep !== null ? TOUR_STEPS[tourStep] : null;
  const targetRect = useTargetRect(step?.type === 'spotlight' ? step.target : null, tourStep);

  const handleSkip = useCallback(() => {
    completeTour();
  }, [completeTour]);

  const handleNext = useCallback(() => {
    advanceTour();
  }, [advanceTour]);

  const handleFinishKyc = useCallback(() => {
    completeTour();
    navigate('/dashboard/kyc');
  }, [completeTour, navigate]);

  const handleFinishMarketplace = useCallback(() => {
    completeTour();
    navigate('/dashboard/marketplace');
  }, [completeTour, navigate]);

  if (!isNewUser || hasSeenTour || tourStep === null) return null;

  if (step.type === 'modal') {
    return (
      <WelcomeModal
        user={user}
        profile={investorProfile}
        topRec={recommendations?.[0]}
        onStart={handleNext}
        onSkip={handleSkip}
      />
    );
  }

  if (step.type === 'spotlight') {
    return (
      <SpotlightOverlay
        rect={targetRect}
        step={step}
        stepIndex={tourStep}
        totalSteps={TOUR_STEPS.length - 1}
        onNext={handleNext}
        onSkip={handleSkip}
      />
    );
  }

  if (step.type === 'nav') {
    return <NavHighlightOverlay step={step} onSkip={handleSkip} />;
  }

  if (step.type === 'finish') {
    return (
      <FinishModal
        onKyc={handleFinishKyc}
        onMarketplace={handleFinishMarketplace}
        onComplete={handleSkip}
      />
    );
  }

  return null;
}
