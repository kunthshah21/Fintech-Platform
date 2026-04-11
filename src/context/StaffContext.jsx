import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const StaffContext = createContext(null);

export function StaffProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [staff, setStaff] = useState(null);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        loadStaffProfile(s.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        loadStaffProfile(s.user.id);
      } else {
        setStaff(null);
        setIsStaff(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadStaffProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data && data.role === 'staff') {
      setStaff(data);
      setIsStaff(true);
    } else {
      setStaff(null);
      setIsStaff(false);
    }
    setLoading(false);
  };

  const staffLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (!profile || profile.role !== 'staff') {
      await supabase.auth.signOut();
      return { success: false, error: 'This account does not have staff access.' };
    }

    return { success: true };
  };

  const staffSignUp = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { success: false, error: error.message };

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      name,
      email,
      role: 'staff',
      joined_date: new Date().toISOString().split('T')[0],
      kyc_status: 'verified',
      onboarding_completed: true,
    });

    if (profileError) return { success: false, error: profileError.message };
    return { success: true };
  };

  const staffLogout = async () => {
    await supabase.auth.signOut();
    setStaff(null);
    setIsStaff(false);
  };

  // ── Dashboard Stats ──

  const fetchDashboardStats = useCallback(async () => {
    const [clientsRes, ticketsRes, aumRes, recentRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'investor'),
      supabase.from('tickets').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('profiles').select('total_invested').eq('role', 'investor'),
      supabase.from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'investor')
        .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
    ]);

    const totalAum = (aumRes.data || []).reduce((sum, p) => sum + (Number(p.total_invested) || 0), 0);

    return {
      totalClients: clientsRes.count || 0,
      openTickets: ticketsRes.count || 0,
      totalAum,
      newSignupsWeek: recentRes.count || 0,
    };
  }, []);

  // ── Clients ──

  const fetchAllClients = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, mobile, kyc_status, priority, total_invested, current_value, active_investments_count, investor_quadrant, risk_level, onboarding_completed, joined_date, created_at')
      .eq('role', 'investor')
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  }, []);

  const fetchClientDetail = useCallback(async (clientId) => {
    const [profileRes, investmentsRes, ticketsRes, notesRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', clientId).single(),
      supabase.from('investments').select('*').eq('user_id', clientId).order('created_at', { ascending: false }),
      supabase.from('tickets').select('*').eq('user_id', clientId).order('created_at', { ascending: false }),
      supabase.from('staff_notes')
        .select('*, profiles:author_id(name)')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false }),
    ]);

    return {
      profile: profileRes.data,
      investments: investmentsRes.data || [],
      tickets: ticketsRes.data || [],
      notes: notesRes.data || [],
    };
  }, []);

  const updateClientPriority = useCallback(async (clientId, priority) => {
    const { error } = await supabase
      .from('profiles')
      .update({ priority: priority || null })
      .eq('id', clientId);
    return !error;
  }, []);

  // ── Staff Notes ──

  const addStaffNote = useCallback(async (clientId, content) => {
    if (!staff) return null;
    const { data, error } = await supabase
      .from('staff_notes')
      .insert({ client_id: clientId, author_id: staff.id, content })
      .select('*, profiles:author_id(name)')
      .single();
    if (error) return null;
    return data;
  }, [staff]);

  // ── Tickets ──

  const fetchAllTickets = useCallback(async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*, profiles:user_id(name, email)')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  }, []);

  const updateTicketStatus = useCallback(async (ticketId, status, resolutionNotes) => {
    const updates = { status };
    if (resolutionNotes !== undefined) updates.resolution_notes = resolutionNotes;
    const { error } = await supabase.from('tickets').update(updates).eq('id', ticketId);
    return !error;
  }, []);

  const assignTicket = useCallback(async (ticketId, staffId) => {
    const { error } = await supabase.from('tickets').update({ assigned_to: staffId }).eq('id', ticketId);
    return !error;
  }, []);

  // ── Community Moderation ──

  const fetchAllPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*, profiles:user_id(name, email)')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  }, []);

  const fetchPostComments = useCallback(async (postId) => {
    const { data, error } = await supabase
      .from('community_comments')
      .select('*, profiles:user_id(name)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (error) return [];
    return data || [];
  }, []);

  const hidePost = useCallback(async (postId) => {
    if (!staff) return false;
    const { error } = await supabase
      .from('community_posts')
      .update({ hidden: true, hidden_by: staff.id, hidden_at: new Date().toISOString() })
      .eq('id', postId);
    return !error;
  }, [staff]);

  const unhidePost = useCallback(async (postId) => {
    const { error } = await supabase
      .from('community_posts')
      .update({ hidden: false, hidden_by: null, hidden_at: null })
      .eq('id', postId);
    return !error;
  }, []);

  const deletePost = useCallback(async (postId) => {
    const { error } = await supabase.from('community_posts').delete().eq('id', postId);
    return !error;
  }, []);

  const deleteComment = useCallback(async (commentId) => {
    const { error } = await supabase.from('community_comments').delete().eq('id', commentId);
    return !error;
  }, []);

  const value = {
    loading,
    session,
    staff,
    isStaff,
    staffLogin,
    staffSignUp,
    staffLogout,
    fetchDashboardStats,
    fetchAllClients,
    fetchClientDetail,
    updateClientPriority,
    addStaffNote,
    fetchAllTickets,
    updateTicketStatus,
    assignTicket,
    fetchAllPosts,
    fetchPostComments,
    hidePost,
    unhidePost,
    deletePost,
    deleteComment,
  };

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
}

export function useStaff() {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error('useStaff must be used within StaffProvider');
  return ctx;
}
