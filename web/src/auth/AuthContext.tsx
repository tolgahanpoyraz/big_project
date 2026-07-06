import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import * as authApi from '../api/auth';
import { getToken, onUnauthorized, setToken } from '../api/client';
import type { User } from '../api/types';

type Status = 'loading' | 'authed' | 'anon';

interface AuthContextValue {
  user: User | null;
  status: Status;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  updateUser: (partial: Partial<User>) => void;
  setSessionToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setStatus('anon');
  }, []);

  const refresh = useCallback(async () => {
    try {
      const { user } = await authApi.getMe();
      setUser(user);
      setStatus('authed');
    } catch {
      logout();
    }
  }, [logout]);

  // Hydrate the session from a stored token on first load.
  useEffect(() => {
    if (getToken()) {
      refresh();
    } else {
      setStatus('anon');
    }
  }, [refresh]);

  // Any authenticated 401 (expired/invalidated token) drops the session.
  useEffect(() => onUnauthorized(logout), [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await authApi.login(email, password);
    setToken(token);
    // Login only succeeds for verified accounts, so mark it so.
    setUser({ ...user, verified: true });
    setStatus('authed');
  }, []);

  const updateUser = useCallback((partial: Partial<User>) => {
    setUser((u) => (u ? { ...u, ...partial } : u));
  }, []);

  const setSessionToken = useCallback((token: string) => {
    setToken(token);
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, logout, refresh, updateUser, setSessionToken }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
