import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [memberProfile, setMemberProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchMemberProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session) {
          await fetchMemberProfile(session.user.id);
        } else {
          setMemberProfile(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function fetchMemberProfile(authUid) {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('auth_uid', authUid)
        .single();

      if (error) throw error;

      setMemberProfile(data);
      // Admin verification: role = 'admin' OR admin_level > 0
      const adminAccess = data.role === 'admin' || (data.admin_level && data.admin_level > 0);
      setIsAdmin(adminAccess);
    } catch (err) {
      console.error('Error fetching member profile:', err);
      setMemberProfile(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setMemberProfile(null);
    setIsAdmin(false);
  }

  const value = {
    session,
    memberProfile,
    loading,
    isAdmin,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
