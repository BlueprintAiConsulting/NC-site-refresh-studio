export interface AdminAccount {
  email: string;
  password: string;
  createdAt: string;
  source: 'env' | 'local';
}

const ADMIN_ACCOUNTS_KEY = 'admin-auth-accounts';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const getConfiguredAdmin = (): AdminAccount | null => {
  const email = import.meta.env.VITE_ADMIN_EMAIL;
  const password = import.meta.env.VITE_ADMIN_PASSWORD;

  if (!email || !password) return null;

  return {
    email: normalizeEmail(email),
    password,
    createdAt: 'environment',
    source: 'env',
  };
};

const readLocalAccounts = (): AdminAccount[] => {
  try {
    const raw = window.localStorage.getItem(ADMIN_ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AdminAccount[];
    return parsed
      .filter((account) => account.email && account.password)
      .map((account) => ({
        ...account,
        email: normalizeEmail(account.email),
        source: 'local' as const,
      }));
  } catch (error) {
    console.error('Failed to parse local admin accounts:', error);
    return [];
  }
};

const persistLocalAccounts = (accounts: AdminAccount[]) => {
  window.localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(accounts));
};

export const listAdminAccounts = (): AdminAccount[] => {
  const configured = getConfiguredAdmin();
  const localAccounts = readLocalAccounts();

  if (!configured) return localAccounts;

  const withoutConfiguredDuplicate = localAccounts.filter(
    (account) => normalizeEmail(account.email) !== configured.email,
  );

  return [configured, ...withoutConfiguredDuplicate];
};

export const addLocalAdminAccount = (email: string, password: string): AdminAccount => {
  const normalizedEmail = normalizeEmail(email);
  const nextAccount: AdminAccount = {
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
    source: 'local',
  };

  const localAccounts = readLocalAccounts();
  const existingIndex = localAccounts.findIndex((account) => account.email === normalizedEmail);

  if (existingIndex >= 0) {
    localAccounts[existingIndex] = nextAccount;
  } else {
    localAccounts.push(nextAccount);
  }

  persistLocalAccounts(localAccounts);
  return nextAccount;
};

export const removeLocalAdminAccount = (email: string): boolean => {
  const normalizedEmail = normalizeEmail(email);
  const configured = getConfiguredAdmin();

  if (configured?.email === normalizedEmail) {
    return false;
  }

  const localAccounts = readLocalAccounts();
  const nextAccounts = localAccounts.filter((account) => account.email !== normalizedEmail);

  if (nextAccounts.length === localAccounts.length) {
    return false;
  }

  persistLocalAccounts(nextAccounts);
  return true;
};

export const validateAdminCredentials = (email: string, password: string): AdminAccount | null => {
  const normalizedEmail = normalizeEmail(email);
  return listAdminAccounts().find(
    (account) => account.email === normalizedEmail && account.password === password,
  ) ?? null;
};

export const isAdminLoginConfigured = () => Boolean(getConfiguredAdmin());

export const ADMIN_STORAGE_KEYS = {
  accounts: ADMIN_ACCOUNTS_KEY,
  session: 'admin-auth-session',
} as const;
