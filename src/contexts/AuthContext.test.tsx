import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const toastMock = vi.fn();

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: toastMock,
  }),
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
        <button type="button" onClick={() => signIn('admin@example.com', 'StrongPassword123!')}>
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

describe('AuthProvider local admin flow', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_ADMIN_EMAIL', 'admin@example.com');
    vi.stubEnv('VITE_ADMIN_PASSWORD', 'StrongPassword123!');
    window.localStorage.clear();
    toastMock.mockReset();
  });

  it('signs in and persists local admin session', async () => {
    await renderHarness();

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('admin@example.com');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
    });

    expect(window.localStorage.getItem('admin-auth-session')).toContain('admin@example.com');
  });

  it('restores session from localStorage on load', async () => {
    window.localStorage.setItem(
      'admin-auth-session',
      JSON.stringify({ email: 'admin@example.com', loggedInAt: new Date().toISOString() }),
    );

    await renderHarness();

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('admin@example.com');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
    });
  });



  it('allows sign-in for locally added admin accounts', async () => {
    window.localStorage.setItem(
      'admin-auth-accounts',
      JSON.stringify([
        { email: 'editor@example.com', password: 'LocalPass123!', createdAt: new Date().toISOString(), source: 'local' },
      ]),
    );

    const { AuthProvider } = await import('./AuthContext');
    const { useAuth } = await import('./useAuth');

    function LocalSignInHarness() {
      const { user, signIn } = useAuth();
      return (
        <div>
          <div data-testid="local-email">{user?.email ?? 'none'}</div>
          <button type="button" onClick={() => signIn('editor@example.com', 'LocalPass123!')}>
            Local Sign In
          </button>
        </div>
      );
    }

    render(
      <AuthProvider>
        <LocalSignInHarness />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /local sign in/i }));

    await waitFor(() => {
      expect(screen.getByTestId('local-email')).toHaveTextContent('editor@example.com');
    });
  });

  it('signs out and clears persisted session', async () => {
    window.localStorage.setItem(
      'admin-auth-session',
      JSON.stringify({ email: 'admin@example.com', loggedInAt: new Date().toISOString() }),
    );

    await renderHarness();

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('admin@example.com');
    });

    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('none');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
    });

    expect(window.localStorage.getItem('admin-auth-session')).toBeNull();
  });
});
