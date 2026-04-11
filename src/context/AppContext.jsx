import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  defaultUser, userPortfolio, notifications as defaultNotifications,
  registeredUsers, emptyPortfolio, opportunities, activeInvestments, transactions as defaultTransactions,
} from '../data/mockData';

const AppContext = createContext(null);

const STORAGE_KEY = 'yieldvest_app_state';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const initialKyc = {
  status: 'not_started',
  currentStep: 0,
  pan: { number: '', name: '', dob: '', verified: false },
  aadhaar: { method: '', verified: false },
  bank: { accountNumber: '', ifsc: '', bankName: '', holderName: '', type: 'savings', verified: false },
  submittedAt: null,
};

const QUADRANT_PRODUCTS = {
  'cautious-wealthy': ['Invoice Discounting', 'Structured Debt'],
  'aggressive': ['Private Credit', 'Revenue-Based Financing', 'P2P Lending'],
  'anxious-explorer': ['P2P Lending', 'Invoice Discounting'],
  'aspirational': ['P2P Lending', 'Revenue-Based Financing'],
};

function computeInvestorProfile(answers) {
  if (!answers) return null;
  const toleranceScore = (answers.emotionalRisk || 1) + (answers.defaultTolerance || 1);
  const capacityScore = (answers.riskCapacity || 1) + (answers.stability || 1);
  const highTolerance = toleranceScore >= 4;
  const highCapacity = capacityScore >= 4;

  let quadrant;
  if (highCapacity && !highTolerance) quadrant = 'cautious-wealthy';
  else if (highCapacity && highTolerance) quadrant = 'aggressive';
  else if (!highCapacity && highTolerance) quadrant = 'aspirational';
  else quadrant = 'anxious-explorer';

  return {
    quadrant,
    toleranceScore,
    capacityScore,
    sophisticationLevel: answers.sophistication || 1,
    horizonLevel: answers.horizon || 1,
    goal: answers.goal || 'fd-beater',
  };
}

function getRecommendations(onboardingAnswers) {
  if (!onboardingAnswers) return opportunities.slice(0, 3);

  const profile = computeInvestorProfile(onboardingAnswers);
  if (!profile) return opportunities.slice(0, 3);

  const preferredTypes = QUADRANT_PRODUCTS[profile.quadrant] || [];

  const filtered = opportunities.filter((opp) => {
    if (profile.horizonLevel === 1 && opp.productType !== 'Invoice Discounting') return false;
    if (profile.sophisticationLevel <= 2) {
      if (opp.productType === 'Private Credit' || opp.productType === 'Structured Debt') return false;
    }
    return true;
  });

  const scored = filtered.map((opp) => {
    let score = 0;

    if (preferredTypes.includes(opp.productType)) score += 5;

    if (profile.quadrant === 'cautious-wealthy') {
      if (opp.riskRating === 'Low') score += 3;
      if (opp.riskRating === 'Medium') score += 1;
    } else if (profile.quadrant === 'aggressive') {
      if (opp.riskRating === 'High') score += 2;
      if (opp.riskRating === 'Medium') score += 2;
      if (opp.returnRate >= 15) score += 2;
    } else if (profile.quadrant === 'anxious-explorer') {
      if (opp.riskRating === 'Low') score += 3;
      if (opp.minInvestment <= 25000) score += 2;
    } else if (profile.quadrant === 'aspirational') {
      if (opp.minInvestment <= 25000) score += 2;
      if (opp.returnRate >= 14) score += 2;
    }

    if (profile.goal === 'fd-beater' && opp.riskRating === 'Low') score += 2;
    if (profile.goal === 'cashflow' && opp.paymentFrequency === 'Monthly') score += 2;
    if (profile.goal === 'diversify-equity') score += 1;
    if (profile.goal === 'max-yield' && opp.returnRate >= 15) score += 2;

    return { ...opp, _score: score };
  });

  scored.sort((a, b) => b._score - a._score);
  return scored.slice(0, 3);
}

export function AppProvider({ children }) {
  const saved = loadState();

  const [isAuthenticated, setIsAuthenticated] = useState(saved?.isAuthenticated || false);
  const [isNewUser, setIsNewUser] = useState(saved?.isNewUser || false);
  const [hasSeenTour, setHasSeenTour] = useState(saved?.hasSeenTour || false);
  const [onboardingAnswers, setOnboardingAnswers] = useState(saved?.onboardingAnswers || null);

  const [user, setUser] = useState(saved?.user || defaultUser);
  const [kyc, setKyc] = useState(saved?.kyc || initialKyc);
  const [portfolio, setPortfolio] = useState(saved?.portfolio || userPortfolio);
  const [userInvestments, setUserInvestments] = useState(
    saved?.userInvestments || (saved?.isNewUser ? [] : activeInvestments)
  );
  const [userTransactions, setUserTransactions] = useState(
    saved?.userTransactions || (saved?.isNewUser ? [] : defaultTransactions)
  );
  const [walletBalance, setWalletBalance] = useState(saved?.walletBalance ?? userPortfolio.walletBalance);
  const [notifications, setNotifications] = useState(saved?.notifications || defaultNotifications);
  const [watchlist, setWatchlist] = useState(saved?.watchlist || []);
  const [viewMode, setViewMode] = useState(saved?.viewMode || 'chat');

  useEffect(() => {
    saveState({
      isAuthenticated, isNewUser, hasSeenTour, onboardingAnswers,
      user, kyc, portfolio, userInvestments, userTransactions, walletBalance, notifications, watchlist, viewMode,
    });
  }, [isAuthenticated, isNewUser, hasSeenTour, onboardingAnswers, user, kyc, portfolio, userInvestments, userTransactions, walletBalance, notifications, watchlist, viewMode]);

  const login = useCallback((username, password) => {
    const key = username.toLowerCase();
    const record = registeredUsers[key];
    if (!record || record.password !== password) return false;

    setUser(record.user);
    setPortfolio(record.portfolio);
    setUserInvestments(activeInvestments);
    setUserTransactions(defaultTransactions);
    setWalletBalance(record.portfolio.walletBalance);
    setNotifications(defaultNotifications);
    setKyc(saved?.kyc?.status === 'verified' ? saved.kyc : initialKyc);
    setWatchlist(saved?.watchlist || []);
    setIsAuthenticated(true);
    setIsNewUser(false);
    setHasSeenTour(true);
    setOnboardingAnswers(null);
    return true;
  }, [saved]);

  const loginWithDigiLocker = useCallback((name) => {
    const newUser = {
      name: name || 'DigiLocker User',
      email: '',
      mobile: '',
      dob: '',
      referralCode: `YIELD-${(name || 'DL').substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 100)}`,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    setPortfolio(emptyPortfolio);
    setUserInvestments([]);
    setUserTransactions([]);
    setWalletBalance(0);
    setKyc({ ...initialKyc, aadhaar: { method: 'digilocker', verified: true }, currentStep: 1, status: 'in_progress' });
    setNotifications([
      { id: 'n-welcome', type: 'info', title: 'Welcome to YieldVest!', message: `Hi ${newUser.name}, start by completing your KYC and exploring investment opportunities.`, time: 'Just now', read: false },
    ]);
    setWatchlist([]);
    setIsAuthenticated(true);
    setIsNewUser(true);
    setHasSeenTour(false);
    setTourStep(0);
    setOnboardingAnswers(null);
  }, []);

  const registerNewUser = useCallback((name, answers) => {
    const newUser = {
      name: name || 'Investor',
      email: '',
      mobile: '',
      dob: '',
      referralCode: `YIELD-${(name || 'NEW').substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 100)}`,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    setPortfolio(emptyPortfolio);
    setUserInvestments([]);
    setUserTransactions([]);
    setWalletBalance(0);
    setKyc(initialKyc);
    setNotifications([
      { id: 'n-welcome', type: 'info', title: 'Welcome to YieldVest!', message: `Hi ${newUser.name}, start by completing your KYC and exploring investment opportunities.`, time: 'Just now', read: false },
    ]);
    setWatchlist([]);
    setOnboardingAnswers(answers);
    setIsAuthenticated(true);
    setIsNewUser(true);
    setHasSeenTour(false);
    setTourStep(0);
    setViewMode('standard');
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('yieldvest_onboarding');
    setIsAuthenticated(false);
    setIsNewUser(false);
    setHasSeenTour(false);
    setTourStep(null);
    setOnboardingAnswers(null);
    setUser(defaultUser);
    setKyc(initialKyc);
    setPortfolio(userPortfolio);
    setUserInvestments(activeInvestments);
    setUserTransactions(defaultTransactions);
    setWalletBalance(userPortfolio.walletBalance);
    setNotifications(defaultNotifications);
    setWatchlist([]);
    setViewMode('chat');
  }, []);

  const [tourStep, setTourStep] = useState(() => {
    if (saved?.hasSeenTour) return null;
    if (saved?.isNewUser && !saved?.hasSeenTour) return 0;
    return null;
  });

  const completeTour = useCallback(() => {
    setHasSeenTour(true);
    setTourStep(null);
  }, []);

  const advanceTour = useCallback(() => {
    setTourStep((prev) => {
      if (prev === null) return null;
      const next = prev + 1;
      if (next > 11) {
        setHasSeenTour(true);
        return null;
      }
      return next;
    });
  }, []);

  const updateKyc = useCallback((updates) => {
    setKyc((prev) => ({ ...prev, ...updates }));
  }, []);

  const completeKycStep = useCallback((step, data) => {
    setKyc((prev) => {
      const next = { ...prev, currentStep: Math.max(prev.currentStep, step + 1) };
      if (step === 0) next.pan = { ...prev.pan, ...data, verified: true };
      if (step === 1) next.aadhaar = { ...prev.aadhaar, ...data, verified: true };
      if (step === 2) next.bank = { ...prev.bank, ...data, verified: true };
      if (step === 3) {
        next.status = 'pending_verification';
        next.submittedAt = new Date().toISOString();
      }
      if (next.currentStep > 0 && next.status === 'not_started') {
        next.status = 'in_progress';
      }
      return next;
    });
  }, []);

  const verifyKyc = useCallback(() => {
    setKyc((prev) => ({ ...prev, status: 'verified' }));
  }, []);

  const toggleWatchlist = useCallback((opportunityId) => {
    setWatchlist((prev) =>
      prev.includes(opportunityId)
        ? prev.filter((id) => id !== opportunityId)
        : [...prev, opportunityId]
    );
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const createInvestment = useCallback(({ opportunity, amount, paymentMethod }) => {
    const now = new Date();
    const maturityDate = new Date(now);
    maturityDate.setMonth(maturityDate.getMonth() + opportunity.tenureMonths);
    const nextRepayment = new Date(now);
    if (opportunity.paymentFrequency === 'Monthly') {
      nextRepayment.setMonth(nextRepayment.getMonth() + 1);
    } else {
      nextRepayment.setMonth(nextRepayment.getMonth() + Math.max(1, Math.ceil(opportunity.tenureMonths / 2)));
    }

    const expectedReturns = Math.round(amount * (opportunity.returnRate / 100) * (opportunity.tenureMonths / 12));
    const investment = {
      id: `inv-${Date.now().toString(36)}`,
      opportunityId: opportunity.id,
      name: `${opportunity.issuer} ${opportunity.productType}`,
      productType: opportunity.productType,
      amountInvested: amount,
      currentValue: amount,
      returnsEarned: 0,
      returnPercent: 0,
      startDate: now.toISOString().split('T')[0],
      maturityDate: maturityDate.toISOString().split('T')[0],
      nextRepayment: nextRepayment.toISOString().split('T')[0],
      status: 'on_track',
    };

    const today = now.toISOString().split('T')[0];
    const transaction = {
      id: `TXN${Date.now()}`,
      date: today,
      description: `Investment - ${opportunity.issuer} ${opportunity.productType}`,
      type: 'investment',
      amount: -amount,
      status: 'completed',
      reference: `INV-${opportunity.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
    };

    setUserInvestments((prev) => [investment, ...prev]);
    setUserTransactions((prev) => [transaction, ...prev]);
    setPortfolio((prev) => {
      const totalInvested = prev.totalInvested + amount;
      const currentValue = prev.currentValue + amount + expectedReturns;
      const totalReturns = currentValue - totalInvested;
      const xirr = totalInvested > 0
        ? Number((((prev.xirr * prev.totalInvested) + (opportunity.returnRate * amount)) / totalInvested).toFixed(2))
        : opportunity.returnRate;

      return {
        ...prev,
        totalInvested,
        currentValue,
        totalReturns,
        returnPercent: totalInvested > 0 ? Number(((totalReturns / totalInvested) * 100).toFixed(2)) : 0,
        activeInvestments: (prev.activeInvestments || 0) + 1,
        xirr,
      };
    });

    if (paymentMethod === 'wallet') {
      setWalletBalance((prev) => Math.max(0, prev - amount));
    }

    setNotifications((prev) => [
      {
        id: `n-invest-${Date.now().toString(36)}`,
        type: 'investment',
        title: 'Investment confirmed',
        message: `Your investment of Rs ${amount.toLocaleString('en-IN')} in ${opportunity.issuer} is now active.`,
        time: 'Just now',
        read: false,
      },
      ...prev,
    ]);

    setIsNewUser(false);
  }, []);

  const isKycVerified = kyc.status === 'verified';
  const unreadCount = notifications.filter((n) => !n.read).length;
  const investorProfile = computeInvestorProfile(onboardingAnswers);
  const recommendations = getRecommendations(onboardingAnswers);

  const value = {
    isAuthenticated, isNewUser, hasSeenTour, onboardingAnswers, investorProfile,
    login, loginWithDigiLocker, registerNewUser, logout, completeTour,
    tourStep, setTourStep, advanceTour,
    user, setUser,
    kyc, updateKyc, completeKycStep, verifyKyc, isKycVerified,
    portfolio, setPortfolio,
    userInvestments, createInvestment,
    userTransactions,
    walletBalance, setWalletBalance,
    notifications, markNotificationRead, markAllNotificationsRead, unreadCount,
    watchlist, toggleWatchlist,
    viewMode, setViewMode,
    recommendations,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
