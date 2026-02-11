import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const toastMock = vi.fn();
const getSessionMock = vi.fn();
const onAuthStateChangeMock = vi.fn();
const signInWithPasswordMock = vi.fn();
const signOutMock = vi.fn();
const rpcMock = vi.fn();

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: toastMock,
  }),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: getSessionMock,
      onAuthStateChange: onAuthStateChangeMock,
      signInWithPassword: signInWithPasswordMock,
      signOut: signOutMock,
    },
    rpc: rpcMock,
  },
}));

async function renderHarness() {
  const { AuthProvider } = await import('./AuthContext');
  const { useAuth } = await import('./useAuth');

  function Harness() {
    const { user, isAdmin, loading, signIn, signOut } = useAuth();

    return (
      <div>
        <div data-testid="loading">{String(loading)}</div>
        <div data-testid="email">{user?.email ?? 'none'}</div>
        <div data-testid="is-admin">{String(isAdmin)}</div>
        <button type="button" onClick={() => signIn('admin@example.com', 'StrongPassword123!').catch(() => undefined)}>
          Sign In
        </button>
        <button type="button" onClick={() => signOut()}>
          Sign Out
        </button>
      </div>
    );
  }

  render(
    <AuthProvider>
      <Harness />
    </AuthProvider>,
  );
}

describe('AuthProvider supabase admin flow', () => {
  beforeEach(() => {
    vi.resetModules();
    toastMock.mockReset();
    getSessionMock.mockReset();
    onAuthStateChangeMock.mockReset();
    signInWithPasswordMock.mockReset();
    signOutMock.mockReset();
    rpcMock.mockReset();

    getSessionMock.mockResolvedValue({ data: { session: null }, error: null });
    onAuthStateChangeMock.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    signOutMock.mockResolvedValue({ error: null });
    rpcMock.mockResolvedValue({ data: true, error: null });
  });

  it('signs in and marks admin when role check passes', async () => {
    signInWithPasswordMock.mockResolvedValue({
      data: { user: { id: 'u1', email: 'admin@example.com' } },
      error: null,
    });

    await renderHarness();

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('admin@example.com');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
    });
  });

  it('rejects sign-in for non-admin accounts', async () => {
    signInWithPasswordMock.mockResolvedValue({
      data: { user: { id: 'u2', email: 'user@example.com' } },
      error: null,
    });
    rpcMock.mockResolvedValue({ data: false, error: null });

    await renderHarness();

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalled();
      expect(screen.getByTestId('email')).toHaveTextContent('none');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
    });
  });

  it('signs out and clears auth state', async () => {
    getSessionMock.mockResolvedValue({
      data: { session: { user: { id: 'u1', email: 'admin@example.com' } } },
      error: null,
    });

    await renderHarness();

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('admin@example.com');
    });

    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('none');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
    });
  });
});
