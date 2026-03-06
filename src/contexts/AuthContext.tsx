import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'coach' | 'athlete' | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  profile: any;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: 'coach' | 'athlete') => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    const [roleRes, profileRes] = await Promise.all([
      supabase.from('user_roles').select('role').eq('user_id', userId).limit(1).maybeSingle(),
      supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
    ]);

    const profileData = profileRes.data ?? null;
    let resolvedRole: UserRole = (roleRes.data?.role as UserRole | undefined) ?? null;

    // Auto-heal legacy accounts that have a team but no role row.
    if (!resolvedRole && profileData?.team_id) {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role: 'athlete' }, { onConflict: 'user_id,role' });

      if (!error) resolvedRole = 'athlete';
    }

    setRole(resolvedRole);
    setProfile(profileData);
  };

  const refreshProfile = async () => {
    if (user) await fetchUserData(user.id);
  };

  useEffect(() => {
    let isMounted = true;

    const applySession = (nextSession: Session | null) => {
      setSession(nextSession);
      const nextUser = nextSession?.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        setRole(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      void fetchUserData(nextUser.id).finally(() => {
        if (isMounted) setLoading(false);
      });
    };

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) applySession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isMounted) applySession(nextSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, role: 'coach' | 'athlete') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;

    if (data.user) {
      const userId = data.user.id;

      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });
      if (roleError) throw roleError;

      const { data: updatedProfile, error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ name, email: data.user.email ?? email })
        .eq('user_id', userId)
        .select('id')
        .maybeSingle();

      if (profileUpdateError) throw profileUpdateError;

      if (!updatedProfile) {
        const { error: profileInsertError } = await supabase
          .from('profiles')
          .insert({ user_id: userId, name, email: data.user.email ?? email });
        if (profileInsertError) throw profileInsertError;
      }

      setRole(role);
    }

    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, profile, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
