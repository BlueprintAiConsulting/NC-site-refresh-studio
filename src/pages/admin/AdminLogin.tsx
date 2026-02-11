import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, Loader2 } from 'lucide-react';
import churchLogo from '@/assets/church-logo.png';
import { addLocalAdminAccount, isAdminLoginConfigured } from '@/lib/admin-auth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const loginConfigured = isAdminLoginConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!loginConfigured) {
        addLocalAdminAccount(email, password);
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
            <CardTitle>{loginConfigured ? 'Sign In' : 'Set Up Admin Access'}</CardTitle>
            <CardDescription>
              {loginConfigured
                ? 'Enter your credentials to access the admin dashboard'
                : 'No admin account is configured yet. Create the first admin account to continue.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!loginConfigured ? (
                <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                  Create your first admin account here. It will be stored locally in this browser.
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loginConfigured ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : loginConfigured ? (
                  'Sign In'
                ) : (
                  'Create Initial Admin'
                )}
              </Button>
            </form>
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
