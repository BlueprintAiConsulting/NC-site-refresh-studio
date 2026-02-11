import { createContext } from "react";

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthSession {
  loggedInAt: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
