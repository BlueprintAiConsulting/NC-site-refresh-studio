import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, Loader2 } from 'lucide-react';
import churchLogo from '@/assets/church-logo.png';
import { supabase } from '@/integrations/supabase/client';


const getInviteParam = (key: string) => {
  const queryParams = new URLSearchParams(window.location.search);
  const queryValue = queryParams.get(key);
  if (queryValue) return queryValue;

  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash;
  if (!hash) return null;

  return new URLSearchParams(hash).get(key);
};

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [inviteVerified, setInviteVerified] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteChecking, setInviteChecking] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const inviteAccessToken = useMemo(() => getInviteParam('access_token'), []);
  const inviteRefreshToken = useMemo(() => getInviteParam('refresh_token'), []);
  const inviteTokenHash = useMemo(() => getInviteParam('token_hash'), []);
  const inviteType = useMemo(() => getInviteParam('type'), []);
  const hasInviteToken = Boolean(inviteTokenHash || inviteAccessToken);

  useEffect(() => {
    if (inviteAccessToken && inviteRefreshToken) {
      setInviteChecking(true);
      supabase.auth
        .setSession({ access_token: inviteAccessToken, refresh_token: inviteRefreshToken })
        .then(({ error }) => {
          if (error) {
            console.error('Invite session error:', error);
            setInviteError('This invite link is no longer valid. Request a new invite.');
            return;
          }
          setInviteVerified(true);
        })
        .catch((error) => {
          console.error('Invite session error:', error);
          setInviteError('This invite link is no longer valid. Request a new invite.');
        })
        .finally(() => {
          setInviteChecking(false);
        });
      return;
    }

    if (inviteType === 'invite' && inviteTokenHash) {
      setInviteChecking(true);
      supabase.auth
        .verifyOtp({ type: 'invite', token_hash: inviteTokenHash })
        .then(({ error }) => {
          if (error) {
            console.error('Invite verification error:', error);
            setInviteError('This invite link is no longer valid. Request a new invite.');
            return;
          }
          setInviteVerified(true);
        })
        .catch((error) => {
          console.error('Invite verification error:', error);
          setInviteError('This invite link is no longer valid. Request a new invite.');
        })
        .finally(() => {
          setInviteChecking(false);
        });
    }
  }, [inviteAccessToken, inviteRefreshToken, inviteTokenHash, inviteType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!inviteVerified) {
          throw new Error('Invite required. Use your invite link to set a password.');
        }

        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;

        navigate('/admin/dashboard');
        return;
      }
      await signIn(email, password);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={churchLogo} alt="New Creation Community Church" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold">Admin Access</h1>
          <p className="text-muted-foreground">New Creation Community Church</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</CardTitle>
            <CardDescription>
              {mode === 'signin'
                ? 'Enter your credentials to access the admin dashboard'
                : 'Use your invite email to create your admin account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' ? (
                <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                  {inviteError
                    ? inviteError
                    : inviteChecking
                      ? 'Checking invite link...'
                      : inviteVerified || inviteAccessToken
                      ? 'Invite verified. Set a password to finish creating your admin account.'
                      : 'Use your invite link to verify access before setting a password.'}
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@newcreationumc.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || (mode === 'signup' && !hasInviteToken)}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  mode === 'signin' ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {mode === 'signin' ? (
                <>
                  Invited admin?{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setMode('signup')}
                  >
                    Create your account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setMode('signin')}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
