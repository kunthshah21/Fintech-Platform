import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import {
  notifications as defaultNotifications,
  opportunities, emptyPortfolio,
} from '../data/mockData';

const AppContext = createContext(null);

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

function quadrantToRiskLevel(quadrant) {
  if (quadrant === 'aggressive') return 'high';
  if (quadrant === 'cautious-wealthy') return 'medium';
  return 'low';
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
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(false);
  const [onboardingAnswers, setOnboardingAnswers] = useState(null);

  const [user, setUser] = useState({ name: '', email: '', mobile: '', dob: '', referralCode: '', joinedDate: '' });
  const [kyc, setKyc] = useState(initialKyc);
  const [portfolio, setPortfolio] = useState(emptyPortfolio);
  const [userInvestments, setUserInvestments] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [viewMode, setViewMode] = useState('chat');
  const [tourStep, setTourStep] = useState(null);

  const skipAuthEffect = useRef(false);
  const activeLoadIdRef = useRef(0);

  const resetState = useCallback(() => {
    setUser({ name: '', email: '', mobile: '', dob: '', referralCode: '', joinedDate: '' });
    setKyc(initialKyc);
    setPortfolio(emptyPortfolio);
    setUserInvestments([]);
    setWalletBalance(0);
    setNotifications([]);
    setWatchlist([]);
    setIsNewUser(false);
    setHasSeenTour(false);
    setOnboardingAnswers(null);
    setViewMode('chat');
    setTourStep(null);
  }, []);

  // ── Load user data from Supabase after auth ──
  const loadUserData = useCallback(async (userId) => {
    const loadId = ++activeLoadIdRef.current;
    const isStaleLoad = () => activeLoadIdRef.current !== loadId;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (isStaleLoad()) return;

    if (profile) {
      setUser({
        name: profile.name || '',
        email: profile.email || '',
        mobile: profile.mobile || '',
        dob: profile.dob || '',
        referralCode: profile.referral_code || '',
        joinedDate: profile.joined_date || '',
      });

      setPortfolio({
        totalInvested: Number(profile.total_invested) || 0,
        currentValue: Number(profile.current_value) || 0,
        totalReturns: Number(profile.total_returns) || 0,
        returnPercent: Number(profile.return_percent) || 0,
        activeInvestments: profile.active_investments_count || 0,
        xirr: Number(profile.xirr) || 0,
        walletBalance: Number(profile.wallet_balance) || 0,
      });
      setWalletBalance(Number(profile.wallet_balance) || 0);

      setKyc((prev) => ({
        ...prev,
        status: profile.kyc_status || 'not_started',
        pan: { ...prev.pan, number: profile.pan_number || '', verified: !!profile.pan_number },
        aadhaar: { ...prev.aadhaar, verified: profile.aadhaar_verified || false },
        bank: { ...prev.bank, verified: profile.bank_verified || false },
        currentStep: profile.kyc_status === 'verified' ? 4 : prev.currentStep,
      }));

      setOnboardingAnswers(profile.onboarding_answers || null);
      setIsNewUser(!profile.onboarding_completed);
      setHasSeenTour(profile.onboarding_completed || false);
    } else {
      // Ensure an account switch cannot show a previous user's identity.
      setUser((prev) => ({ ...prev, name: '', email: '', mobile: '', dob: '', referralCode: '', joinedDate: '' }));
      setPortfolio(emptyPortfolio);
      setWalletBalance(0);
      setOnboardingAnswers(null);
      setIsNewUser(true);
      setHasSeenTour(false);
    }

    const { data: investments } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (isStaleLoad()) return;

    if (investments) {
      const mapped = investments.map((inv) => ({
        id: inv.id,
        opportunityId: inv.opportunity_id,
        name: inv.name,
        productType: inv.product_type,
        amountInvested: Number(inv.amount_invested),
        currentValue: Number(inv.current_value),
        returnsEarned: Number(inv.returns_earned),
        returnPercent: Number(inv.return_percent),
        startDate: inv.start_date,
        maturityDate: inv.maturity_date,
        nextRepayment: inv.next_repayment,
        status: inv.status,
      }));
      setUserInvestments(mapped);
      if (mapped.length > 0) setIsNewUser(false);
    } else {
      setUserInvestments([]);
    }

    const { data: watchlistData } = await supabase
      .from('watchlist')
      .select('opportunity_id')
      .eq('user_id', userId);

    if (isStaleLoad()) return;

    if (watchlistData) {
      setWatchlist(watchlistData.map((w) => w.opportunity_id));
    } else {
      setWatchlist([]);
    }

    setNotifications(defaultNotifications);
  }, []);

  // ── Supabase Auth listener ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        setIsAuthenticated(true);
        resetState();
        loadUserData(s.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (skipAuthEffect.current) {
        skipAuthEffect.current = false;
        return;
      }
      setSession(s);
      if (s?.user) {
        setIsAuthenticated(true);
        resetState();
        loadUserData(s.user.id);
      } else {
        activeLoadIdRef.current += 1;
        setIsAuthenticated(false);
        resetState();
      }
    });

    return () => subscription.unsubscribe();
  }, [loadUserData, resetState]);

  // ── Auth actions ──
  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    await loadUserData(data.user.id);
    return { success: true };
  }, [loadUserData]);

  const signUp = useCallback(async (email, password, name) => {
    skipAuthEffect.current = true;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { success: false, error: error.message };

    const userId = data.user.id;
    const referralCode = `YIELD-${(name || 'NEW').substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 100)}`;
    const joinedDate = new Date().toISOString().split('T')[0];

    await supabase.from('profiles').insert({
      id: userId,
      name: name || 'Investor',
      email,
      referral_code: referralCode,
      joined_date: joinedDate,
      kyc_status: 'not_started',
      onboarding_completed: false,
    });

    const newUser = {
      name: name || 'Investor',
      email,
      mobile: '',
      dob: '',
      referralCode,
      joinedDate,
    };

    setUser(newUser);
    setPortfolio(emptyPortfolio);
    setUserInvestments([]);
    setWalletBalance(0);
    setKyc(initialKyc);
    setNotifications([
      { id: 'n-welcome', type: 'info', title: 'Welcome to YieldVest!', message: `Hi ${newUser.name}, start by completing your KYC and exploring investment opportunities.`, time: 'Just now', read: false },
    ]);
    setWatchlist([]);
    setOnboardingAnswers(null);
    setIsAuthenticated(true);
    setIsNewUser(true);
    setHasSeenTour(false);
    setTourStep(0);
    setViewMode('standard');

    return { success: true, user: data.user };
  }, []);

  const registerNewUser = useCallback(async (name, answers) => {
    const userId = session?.user?.id;
    if (!userId) return;

    const profile = computeInvestorProfile(answers);
    const riskLevel = profile ? quadrantToRiskLevel(profile.quadrant) : 'low';

    await supabase.from('profiles').update({
      name,
      onboarding_answers: answers,
      onboarding_completed: true,
      investor_quadrant: profile?.quadrant || null,
      risk_level: riskLevel,
      tolerance_score: profile?.toleranceScore || null,
      capacity_score: profile?.capacityScore || null,
      sophistication_level: profile?.sophisticationLevel || null,
      horizon_level: profile?.horizonLevel || null,
      investment_goal: profile?.goal || null,
    }).eq('id', userId);

    setUser((prev) => ({ ...prev, name: name || prev.name }));
    setOnboardingAnswers(answers);
    setIsNewUser(false);
    setHasSeenTour(false);
    setTourStep(0);
    setViewMode('standard');
  }, [session]);

  const loginWithDigiLocker = useCallback(async (name, email, password) => {
    skipAuthEffect.current = true;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { success: false, error: error.message };

    const userId = data.user.id;
    const referralCode = `YIELD-${(name || 'DL').substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 100)}`;
    const joinedDate = new Date().toISOString().split('T')[0];

    await supabase.from('profiles').insert({
      id: userId,
      name: name || 'DigiLocker User',
      email,
      referral_code: referralCode,
      joined_date: joinedDate,
      kyc_status: 'in_progress',
      aadhaar_verified: true,
      onboarding_completed: false,
    });

    const newUser = {
      name: name || 'DigiLocker User',
      email,
      mobile: '',
      dob: '',
      referralCode,
      joinedDate,
    };

    setUser(newUser);
    setPortfolio(emptyPortfolio);
    setUserInvestments([]);
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

    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    activeLoadIdRef.current += 1;
    await supabase.auth.signOut();
    resetState();
    setIsAuthenticated(false);
  }, [resetState]);

  // ── Tour ──
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

  // ── KYC ──
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

  const verifyKyc = useCallback(async () => {
    const userId = session?.user?.id;
    if (!userId) return false;

    const { error } = await supabase.from('profiles').update({
      kyc_status: 'verified',
      pan_number: kyc.pan.number || null,
      aadhaar_verified: kyc.aadhaar.verified,
      bank_verified: kyc.bank.verified,
    }).eq('id', userId);

    if (error) return false;

    setKyc((prev) => ({ ...prev, status: 'verified' }));
    return true;
  }, [session, kyc]);

  const persistKycStatus = useCallback(async (status, extraFields = {}) => {
    const userId = session?.user?.id;
    if (!userId) return;
    await supabase.from('profiles').update({
      kyc_status: status,
      ...extraFields,
    }).eq('id', userId);
  }, [session]);

  // ── Watchlist ──
  const toggleWatchlist = useCallback(async (opportunityId) => {
    const userId = session?.user?.id;
    const isInWatchlist = watchlist.includes(opportunityId);

    if (isInWatchlist) {
      setWatchlist((prev) => prev.filter((id) => id !== opportunityId));
      if (userId) {
        await supabase.from('watchlist').delete().eq('user_id', userId).eq('opportunity_id', opportunityId);
      }
    } else {
      setWatchlist((prev) => [...prev, opportunityId]);
      if (userId) {
        await supabase.from('watchlist').insert({ user_id: userId, opportunity_id: opportunityId });
      }
    }
  }, [session, watchlist]);

  // ── Notifications ──
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // ── Investments ──
  const createInvestment = useCallback(async ({ opportunity, amount, paymentMethod }) => {
    const userId = session?.user?.id;
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

    const investmentRow = {
      user_id: userId,
      opportunity_id: opportunity.id,
      name: `${opportunity.issuer} ${opportunity.productType}`,
      product_type: opportunity.productType,
      amount_invested: amount,
      current_value: amount,
      returns_earned: 0,
      return_percent: 0,
      start_date: now.toISOString().split('T')[0],
      maturity_date: maturityDate.toISOString().split('T')[0],
      next_repayment: nextRepayment.toISOString().split('T')[0],
      status: 'on_track',
      payment_method: paymentMethod,
    };

    const { data: inserted } = await supabase.from('investments').insert(investmentRow).select().single();

    const investment = {
      id: inserted?.id || `inv-${Date.now().toString(36)}`,
      opportunityId: opportunity.id,
      name: investmentRow.name,
      productType: opportunity.productType,
      amountInvested: amount,
      currentValue: amount,
      returnsEarned: 0,
      returnPercent: 0,
      startDate: investmentRow.start_date,
      maturityDate: investmentRow.maturity_date,
      nextRepayment: investmentRow.next_repayment,
      status: 'on_track',
    };

    setUserInvestments((prev) => [investment, ...prev]);
    setPortfolio((prev) => {
      const totalInvested = prev.totalInvested + amount;
      const currentValue = prev.currentValue + amount + expectedReturns;
      const totalReturns = currentValue - totalInvested;
      const xirr = totalInvested > 0
        ? Number((((prev.xirr * prev.totalInvested) + (opportunity.returnRate * amount)) / totalInvested).toFixed(2))
        : opportunity.returnRate;
      const newPortfolio = {
        ...prev,
        totalInvested,
        currentValue,
        totalReturns,
        returnPercent: totalInvested > 0 ? Number(((totalReturns / totalInvested) * 100).toFixed(2)) : 0,
        activeInvestments: (prev.activeInvestments || 0) + 1,
        xirr,
      };

      if (userId) {
        supabase.from('profiles').update({
          total_invested: newPortfolio.totalInvested,
          current_value: newPortfolio.currentValue,
          total_returns: newPortfolio.totalReturns,
          return_percent: newPortfolio.returnPercent,
          active_investments_count: newPortfolio.activeInvestments,
          xirr: newPortfolio.xirr,
          wallet_balance: paymentMethod === 'wallet' ? Math.max(0, walletBalance - amount) : walletBalance,
        }).eq('id', userId).then();
      }

      return newPortfolio;
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
  }, [session, walletBalance]);

  // ── Profile update ──
  const updateProfile = useCallback(async (fields) => {
    const userId = session?.user?.id;
    setUser((prev) => ({ ...prev, ...fields }));

    if (userId) {
      const dbFields = {};
      if (fields.name !== undefined) dbFields.name = fields.name;
      if (fields.email !== undefined) dbFields.email = fields.email;
      if (fields.mobile !== undefined) dbFields.mobile = fields.mobile;
      if (fields.dob !== undefined) dbFields.dob = fields.dob;
      await supabase.from('profiles').update(dbFields).eq('id', userId);
    }
  }, [session]);

  // ── Tickets ──
  const createTicket = useCallback(async ({ category, subject, description }) => {
    const userId = session?.user?.id;
    if (!userId) return null;

    const { data, error } = await supabase.from('tickets').insert({
      user_id: userId,
      category,
      subject,
      description,
      status: 'open',
    }).select().single();

    if (error) return null;
    return data;
  }, [session]);

  const fetchTickets = useCallback(async () => {
    const userId = session?.user?.id;
    if (!userId) return [];

    const { data } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return data || [];
  }, [session]);

  // ── Community ──
  const fetchCommunityPosts = useCallback(async () => {
    const userId = session?.user?.id;

    const { data: posts, error } = await supabase
      .from('community_posts')
      .select('*, profiles:user_id(name)')
      .eq('hidden', false)
      .order('created_at', { ascending: false });

    if (error || !posts) return [];

    let likedPostIds = new Set();
    if (userId) {
      const { data: likes } = await supabase
        .from('community_likes')
        .select('post_id')
        .eq('user_id', userId);
      if (likes) likedPostIds = new Set(likes.map((l) => l.post_id));
    }

    return posts.map((p) => ({
      id: p.id,
      userId: p.user_id,
      authorName: p.profiles?.name || 'Investor',
      content: p.content,
      postType: p.post_type,
      sharedData: p.shared_data,
      likesCount: p.likes_count,
      commentsCount: p.comments_count,
      likedByMe: likedPostIds.has(p.id),
      createdAt: p.created_at,
    }));
  }, [session]);

  const createCommunityPost = useCallback(async ({ content, postType = 'text', sharedData = null }) => {
    const userId = session?.user?.id;
    if (!userId || !content.trim()) return null;

    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: userId,
        content: content.trim(),
        post_type: postType,
        shared_data: sharedData,
      })
      .select('*, profiles:user_id(name)')
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      authorName: data.profiles?.name || 'Investor',
      content: data.content,
      postType: data.post_type,
      sharedData: data.shared_data,
      likesCount: 0,
      commentsCount: 0,
      likedByMe: false,
      createdAt: data.created_at,
    };
  }, [session]);

  const togglePostLike = useCallback(async (postId, currentlyLiked) => {
    const userId = session?.user?.id;
    if (!userId) return { success: false };

    let error;
    if (currentlyLiked) {
      ({ error } = await supabase
        .from('community_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId));
    } else {
      ({ error } = await supabase
        .from('community_likes')
        .insert({ post_id: postId, user_id: userId }));
    }

    return { success: !error };
  }, [session]);

  const fetchPostComments = useCallback(async (postId) => {
    const { data, error } = await supabase
      .from('community_comments')
      .select('*, profiles:user_id(name)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error || !data) return [];

    return data.map((c) => ({
      id: c.id,
      userId: c.user_id,
      authorName: c.profiles?.name || 'Investor',
      content: c.content,
      createdAt: c.created_at,
    }));
  }, []);

  const createPostComment = useCallback(async (postId, content) => {
    const userId = session?.user?.id;
    if (!userId || !content.trim()) return null;

    const { data, error } = await supabase
      .from('community_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content: content.trim(),
      })
      .select('*, profiles:user_id(name)')
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      authorName: data.profiles?.name || 'Investor',
      content: data.content,
      createdAt: data.created_at,
    };
  }, [session]);

  const deleteCommunityPost = useCallback(async (postId) => {
    const userId = session?.user?.id;
    if (!userId) return false;

    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', userId);

    return !error;
  }, [session]);

  const isKycVerified = kyc.status === 'verified';
  const unreadCount = notifications.filter((n) => !n.read).length;
  const investorProfile = computeInvestorProfile(onboardingAnswers);
  const recommendations = getRecommendations(onboardingAnswers);

  const value = {
    loading,
    isAuthenticated, isNewUser, hasSeenTour, onboardingAnswers, investorProfile,
    login, signUp, loginWithDigiLocker, registerNewUser, logout, completeTour,
    tourStep, setTourStep, advanceTour,
    user, setUser, updateProfile,
    kyc, updateKyc, completeKycStep, verifyKyc, persistKycStatus, isKycVerified,
    portfolio, setPortfolio,
    userInvestments, createInvestment,
    walletBalance, setWalletBalance,
    notifications, markNotificationRead, markAllNotificationsRead, unreadCount,
    watchlist, toggleWatchlist,
    viewMode, setViewMode,
    recommendations,
    createTicket, fetchTickets,
    fetchCommunityPosts, createCommunityPost, togglePostLike,
    fetchPostComments, createPostComment, deleteCommunityPost,
    session,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
