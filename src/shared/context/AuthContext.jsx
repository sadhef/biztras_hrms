import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { login as loginRequest, logout as logoutRequest } from '../../modules/auth/services/authService.js';
import { setToken, clearToken } from '../../config/axios.js';

const AuthContext = createContext(undefined);

const EMPLOYEE_KEY = 'biztras-hr-employee';
const SESSION_EXPIRED_EVENT = 'auth:session-expired';

/** Reads the employee identity persisted at login, or null if there is none/it's corrupt. */
const readStoredEmployee = () => {
  const raw = window.localStorage.getItem(EMPLOYEE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * App-wide authentication state. The backend has no "current user" endpoint and no refresh
 * token, so the session is just a Bearer token plus the employee identity returned at login,
 * both persisted to localStorage and read back synchronously on boot (no loading round-trip).
 */
export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(readStoredEmployee);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    /** A 401 from any request means the token is no longer valid — drop the local session. */
    const handleSessionExpired = () => {
      window.localStorage.removeItem(EMPLOYEE_KEY);
      setUser(null);
      queryClient.clear();
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, [queryClient]);

  /** Logs in, persists the token/employee identity, and updates the shared session state. */
  const login = useCallback(async ({ username, password }) => {
    setLoading(true);
    try {
      const data = await loginRequest({ username, password });
      const employee = { id: data.employee_id, name: data.employee_name };
      setToken(data.token);
      window.localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(employee));
      setUser(employee);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Signs out: best-effort server call, then always clears local session state. */
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutRequest();
    } catch {
      // Intent to log out is honored client-side regardless of network outcome.
    } finally {
      clearToken();
      window.localStorage.removeItem(EMPLOYEE_KEY);
      setUser(null);
      queryClient.clear();
      setLoading(false);
    }
  }, [queryClient]);

  const value = useMemo(() => ({
    user,
    loading,
    initializing: false,
    login,
    logout,
  }), [user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/** Accesses the shared auth state and actions; must be called within an AuthProvider. */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
