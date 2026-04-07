import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { defaultUser, userPortfolio, notifications as defaultNotifications } from '../data/mockData';

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

export function AppProvider({ children }) {
  const saved = loadState();

  const [user, setUser] = useState(saved?.user || defaultUser);
  const [kyc, setKyc] = useState(saved?.kyc || initialKyc);
  const [portfolio, setPortfolio] = useState(saved?.portfolio || userPortfolio);
  const [walletBalance, setWalletBalance] = useState(saved?.walletBalance ?? userPortfolio.walletBalance);
  const [notifications, setNotifications] = useState(saved?.notifications || defaultNotifications);
  const [watchlist, setWatchlist] = useState(saved?.watchlist || []);

  useEffect(() => {
    saveState({ user, kyc, portfolio, walletBalance, notifications, watchlist });
  }, [user, kyc, portfolio, walletBalance, notifications, watchlist]);

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

  const value = {
    user, setUser,
    kyc, updateKyc, completeKycStep, verifyKyc, isKycVerified,
    portfolio, setPortfolio,
    walletBalance, setWalletBalance,
    notifications, markNotificationRead, markAllNotificationsRead, unreadCount,
    watchlist, toggleWatchlist,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
