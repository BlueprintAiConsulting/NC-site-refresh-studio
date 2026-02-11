import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthContext, type AuthSession, type AuthUser } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';

const createUserFromAuth = (user: { id: string; email?: string | null }): AuthUser => ({
  id: user.id,
  email: user.email ?? '',
});

const checkIsAdmin = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc('has_role', {
    _user_id: userId,
    _role: 'admin',
  });

  if (error) {
    throw error;
  }

  return data === true;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const syncFromSession = async () => {
      try {
        const {
          data: { session: authSession },
          error,
        } = await supabase.auth.getSession();

        if (error || !authSession?.user) {
          if (!mounted) return;
          setUser(null);
          setSession(null);
          setIsAdmin(false);
          return;
        }

        const admin = await checkIsAdmin(authSession.user.id);

        if (!mounted) return;

        setUser(createUserFromAuth(authSession.user));
        setSession({ loggedInAt: new Date().toISOString() });
        setIsAdmin(admin);
      } catch (error) {
        console.error('Failed to restore auth session:', error);
        if (!mounted) return;
        setUser(null);
        setSession(null);
        setIsAdmin(false);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    syncFromSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, authSession) => {
      if (!mounted) return;

      if (!authSession?.user) {
        setUser(null);
        setSession(null);
        setIsAdmin(false);
        return;
      }

      try {
        const admin = await checkIsAdmin(authSession.user.id);
        if (!mounted) return;
        setUser(createUserFromAuth(authSession.user));
        setSession({ loggedInAt: new Date().toISOString() });
        setIsAdmin(admin);
      } catch (error) {
        console.error('Failed to validate admin role:', error);
        if (!mounted) return;
        setUser(createUserFromAuth(authSession.user));
        setSession({ loggedInAt: new Date().toISOString() });
        setIsAdmin(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      const authError = new Error(error?.message || 'Invalid admin credentials.');
      toast({
        title: 'Error',
        description: authError.message,
        variant: 'destructive',
      });
      throw authError;
    }

    const admin = await checkIsAdmin(data.user.id);

    if (!admin) {
      await supabase.auth.signOut();
      const roleError = new Error('Your account does not have admin access.');
      toast({
        title: 'Access denied',
        description: roleError.message,
        variant: 'destructive',
      });
      throw roleError;
    }

    setUser(createUserFromAuth(data.user));
    setSession({ loggedInAt: new Date().toISOString() });
    setIsAdmin(true);

    toast({
      title: 'Success',
      description: 'Signed in successfully',
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);

    toast({
      title: 'Success',
      description: 'Signed out successfully',
    });
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
