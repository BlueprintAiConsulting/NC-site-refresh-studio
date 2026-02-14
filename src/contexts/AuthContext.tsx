import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthContext, type AuthSession, type AuthUser } from '@/contexts/auth-context';
import { ADMIN_STORAGE_KEYS, validateAdminCredentials } from '@/lib/admin-auth';

interface StoredAdminSession {
  email: string;
  loggedInAt: string;
}

const createUserFromEmail = (email: string): AuthUser => ({
  id: `admin:${email.toLowerCase()}`,
  email,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const rawSession = window.localStorage.getItem(ADMIN_STORAGE_KEYS.session);

    if (!rawSession) {
      setLoading(false);
      return;
    }

    try {
      const parsedSession = JSON.parse(rawSession) as StoredAdminSession;
      if (!parsedSession.email || !parsedSession.loggedInAt) {
        throw new Error('Invalid admin session payload');
      }

      setUser(createUserFromEmail(parsedSession.email));
      setSession({ loggedInAt: parsedSession.loggedInAt });
      setIsAdmin(true);
    } catch (error) {
      console.error('Failed to restore admin session:', error);
      window.localStorage.removeItem(ADMIN_STORAGE_KEYS.session);
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const matchedAccount = validateAdminCredentials(email, password);

    if (!matchedAccount) {
      const error = new Error('Invalid admin credentials.');
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }

    const nextSession: StoredAdminSession = {
      email: matchedAccount.email,
      loggedInAt: new Date().toISOString(),
    };

    window.localStorage.setItem(ADMIN_STORAGE_KEYS.session, JSON.stringify(nextSession));

    setUser(createUserFromEmail(matchedAccount.email));
    setSession({ loggedInAt: nextSession.loggedInAt });
    setIsAdmin(true);

    toast({
      title: 'Success',
      description: 'Signed in successfully',
    });
  };

  const signOut = async () => {
    window.localStorage.removeItem(ADMIN_STORAGE_KEYS.session);
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
