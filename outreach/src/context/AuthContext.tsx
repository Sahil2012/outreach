import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  hasProfile: boolean;
  checkProfile: () => Promise<void>;
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const checkProfile = async () => {
    if (!user) return setHasProfile(false);

    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    setHasProfile(!!data);
  };

  // Initialize user/session from Supabase or cookie
  useEffect(() => {
    const initAuth = async () => {
      let currentSession: Session | null = null;

      // Try Supabase session first
      const { data: { session } } = await supabase.auth.getSession();
      currentSession = session;

      // If no session, check cookie
      if (!currentSession) {
        const userId = Cookies.get('sb-user-id');
        if (userId) {
          // fetch user profile from Supabase
          const { data: userData } = await supabase.auth.getUser();
          currentSession = userData?.user ? { user: userData.user, expires_at: 0 } as Session : null;
        }
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    initAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        Cookies.set('sb-user-id', session.user.id);
      } else {
        Cookies.remove('sb-user-id');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) checkProfile();
    else setHasProfile(false);
  }, [user]);

  // Sign Up
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;

      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
        });

        // Immediately set user and cookie
        setUser(data.user);
        Cookies.set('sb-user-id', data.user.id);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Sign In
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        // Immediately set user and cookie
        setUser(data.user);
        setSession(data.session ?? null);
        Cookies.set('sb-user-id', data.user.id);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Sign Out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    Cookies.remove('sb-user-id');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        hasProfile,
        checkProfile,
        token,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
