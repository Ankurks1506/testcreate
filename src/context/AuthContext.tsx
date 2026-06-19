import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { loginApi } from '../api/endpoints';
import type { User } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (userId: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => ({
    token: localStorage.getItem('token'),
    user: (() => {
      try {
        const u = localStorage.getItem('user');
        return u ? JSON.parse(u) : null;
      } catch {
        return null;
      }
    })(),
    loading: false,
  }));

  const login = useCallback(async (userId: string, password: string) => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const res = await loginApi(userId, password);
      const { token, user } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setState({ token, user, loading: false });
    } catch (err: unknown) {
      setState((s) => ({ ...s, loading: false }));
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response: { data: { message?: string } } }).response?.data?.message || 'Login failed'
          : 'Login failed';
      throw new Error(msg);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({ token: null, user: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
