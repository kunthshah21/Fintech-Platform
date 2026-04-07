import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  defaultUser, userPortfolio, notifications as defaultNotifications,
  registeredUsers, emptyPortfolio, opportunities,
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

function getRecommendations(onboardingAnswers) {
  if (!onboardingAnswers) return opportunities.slice(0, 3);

  const { risk, goal, horizon } = onboardingAnswers;
  const scored = opportunities.map((opp) => {
    let score = 0;
    if (risk === 'conservative') {
      if (opp.riskRating === 'Low') score += 3;
      if (opp.riskRating === 'Medium') score += 1;
    } else if (risk === 'moderate') {
      if (opp.riskRating === 'Medium') score += 3;
      if (opp.riskRating === 'Low') score += 2;
      if (opp.riskRating === 'High') score += 1;
    } else if (risk === 'aggressive') {
      if (opp.riskRating === 'High') score += 3;
      if (opp.riskRating === 'Medium') score += 2;
    }

    if (goal === 'income' && opp.paymentFrequency === 'Monthly') score += 2;
    if (goal === 'preserve' && opp.riskRating === 'Low') score += 2;
    if (goal === 'wealth' && opp.returnRate >= 14) score += 2;

    if (horizon === 'short' && opp.tenureMonths <= 6) score += 2;
    else if (horizon === 'medium' && opp.tenureMonths <= 18) score += 1;
    else if (horizon === 'long' && opp.tenureMonths >= 12) score += 1;

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
  const [walletBalance, setWalletBalance] = useState(saved?.walletBalance ?? userPortfolio.walletBalance);
  const [notifications, setNotifications] = useState(saved?.notifications || defaultNotifications);
  const [watchlist, setWatchlist] = useState(saved?.watchlist || []);
  const [viewMode, setViewMode] = useState(saved?.viewMode || 'chat');

  useEffect(() => {
    saveState({
      isAuthenticated, isNewUser, hasSeenTour, onboardingAnswers,
      user, kyc, portfolio, walletBalance, notifications, watchlist, viewMode,
    });
  }, [isAuthenticated, isNewUser, hasSeenTour, onboardingAnswers, user, kyc, portfolio, walletBalance, notifications, watchlist, viewMode]);

  const login = useCallback((username, password) => {
    const key = username.toLowerCase();
    const record = registeredUsers[key];
    if (!record || record.password !== password) return false;

    setUser(record.user);
    setPortfolio(record.portfolio);
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

  const isKycVerified = kyc.status === 'verified';
  const unreadCount = notifications.filter((n) => !n.read).length;
  const recommendations = getRecommendations(onboardingAnswers);

  const value = {
    isAuthenticated, isNewUser, hasSeenTour, onboardingAnswers,
    login, loginWithDigiLocker, registerNewUser, logout, completeTour,
    tourStep, setTourStep, advanceTour,
    user, setUser,
    kyc, updateKyc, completeKycStep, verifyKyc, isKycVerified,
    portfolio, setPortfolio,
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
