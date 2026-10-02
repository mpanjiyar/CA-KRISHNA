import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export interface VaultAuthUser {
  id: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  username: string;
  accountType: 'super_admin' | 'staff' | 'client' | 'custom';
  role: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Suspended' | 'Expired';
  assignedProjects: string[];
  assignedClientIds?: string[];
  notes?: string;
  createdAt: string;
  lastLogin: string;
  forcePasswordChange: boolean;
  loginDisabled: boolean;
  twoFactorEnabled: boolean;
  permissions: Record<string, {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    upload: boolean;
    download: boolean;
    share: boolean;
  }>;
  sectionAccess: string[];
}

export interface ActiveSessionItem {
  id: string;
  token?: string;
  userId: string;
  username: string;
  fullName: string;
  accountType: string;
  device: string;
  ipAddress: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  isCurrent?: boolean;
}

export interface VaultAuthContextType {
  user: VaultAuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  expiresAt: string | null;
  sessionRemainingSeconds: number;
  login: (username: string, password: string, twoFactorCode?: string, tempToken?: string) => Promise<{
    success: boolean;
    require2FA?: boolean;
    tempToken?: string;
    demoOtp?: string;
    maskedEmail?: string;
    error?: string;
    attemptsLeft?: number;
    locked?: boolean;
    remainingSeconds?: number;
  }>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  fetchSessions: () => Promise<ActiveSessionItem[]>;
  revokeSession: (sessionId: string) => Promise<boolean>;
  refreshUserData: () => Promise<void>;
}

const VaultAuthContext = createContext<VaultAuthContextType | undefined>(undefined);

const VAULT_TOKEN_KEY = 'panjiyar_vault_session_token_v3';

export const VaultAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(VAULT_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<VaultAuthUser | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState<number>(0);

  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isLoggingOutRef = useRef<boolean>(false);

  // Validate session on load or token change
  const validateSession = useCallback(async (sessionToken: string) => {
    if (isLoggingOutRef.current || !sessionToken) {
      setIsLoading(false);
      return false;
    }

    try {
      const res = await fetch('/api/vault/auth/me', {
        headers: {
          Authorization: `Bearer ${sessionToken}`
        }
      });

      if (!res.ok) {
        throw new Error('Session invalid or expired');
      }

      const data = await res.json();
      
      // Double check that user hasn't logged out while request was in-flight
      if (isLoggingOutRef.current || !localStorage.getItem(VAULT_TOKEN_KEY)) {
        setUser(null);
        setToken(null);
        setExpiresAt(null);
        return false;
      }

      setUser(data.user);
      setExpiresAt(data.session.expiresAt);
      return true;
    } catch {
      // Clear token on failure
      setToken(null);
      setUser(null);
      setExpiresAt(null);
      try {
        localStorage.removeItem(VAULT_TOKEN_KEY);
        sessionStorage.removeItem(VAULT_TOKEN_KEY);
      } catch {
        // ignore
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token && !isLoggingOutRef.current) {
      validateSession(token);
    } else {
      setIsLoading(false);
    }
  }, [token, validateSession]);

  // Session timer ticker & auto expiration logout
  useEffect(() => {
    if (!expiresAt || !user) {
      setSessionRemainingSeconds(0);
      return;
    }

    const checkTime = () => {
      const remainingMs = new Date(expiresAt).getTime() - Date.now();
      const secs = Math.max(0, Math.floor(remainingMs / 1000));
      setSessionRemainingSeconds(secs);

      if (secs <= 0) {
        // Automatically logout expired session
        setToken(null);
        setUser(null);
        setExpiresAt(null);
        try {
          localStorage.removeItem(VAULT_TOKEN_KEY);
        } catch {
          // ignore
        }
      }
    };

    checkTime();
    heartbeatIntervalRef.current = setInterval(checkTime, 1000);
    return () => {
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
    };
  }, [expiresAt, user]);

  const login = async (username: string, password: string, twoFactorCode?: string, tempToken?: string) => {
    isLoggingOutRef.current = false;
    try {
      const res = await fetch('/api/vault/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, twoFactorCode, tempToken })
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Authentication failed',
          attemptsLeft: data.attemptsLeft,
          locked: data.locked,
          remainingSeconds: data.remainingSeconds
        };
      }

      if (data.require2FA) {
        return {
          success: true,
          require2FA: true,
          tempToken: data.tempToken,
          maskedEmail: data.maskedEmail,
          demoOtp: data.demoOtp
        };
      }

      // Successful login
      isLoggingOutRef.current = false;
      setToken(data.token);
      setUser(data.user);
      setExpiresAt(data.expiresAt);
      try {
        localStorage.setItem(VAULT_TOKEN_KEY, data.token);
        sessionStorage.setItem(VAULT_TOKEN_KEY, data.token);
      } catch {
        // ignore
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Network error communicating with authentication server.' };
    }
  };

  const logout = async () => {
    isLoggingOutRef.current = true;
    const currentToken = token;
    
    // Immediately clear all in-memory auth state
    setToken(null);
    setUser(null);
    setExpiresAt(null);
    setSessionRemainingSeconds(0);
    setIsLoading(false);

    try {
      localStorage.removeItem(VAULT_TOKEN_KEY);
      sessionStorage.removeItem(VAULT_TOKEN_KEY);
    } catch {
      // ignore
    }

    if (currentToken) {
      try {
        await fetch('/api/vault/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${currentToken}`
          }
        });
      } catch {
        // Ignore network errors on logout
      }
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!token) return { success: false, error: 'Not authenticated' };

    try {
      const res = await fetch('/api/vault/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to update password' };
      }

      if (user) {
        setUser({ ...user, forcePasswordChange: false });
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Network error updating password.' };
    }
  };

  const fetchSessions = async (): Promise<ActiveSessionItem[]> => {
    if (!token) return [];
    try {
      const res = await fetch('/api/vault/auth/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        return data.sessions || [];
      }
    } catch (e) {
      console.error('Failed to fetch sessions:', e);
    }
    return [];
  };

  const revokeSession = async (sessionId: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/vault/auth/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const refreshUserData = async () => {
    if (token) {
      await validateSession(token);
    }
  };

  return (
    <VaultAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        expiresAt,
        sessionRemainingSeconds,
        login,
        logout,
        changePassword,
        fetchSessions,
        revokeSession,
        refreshUserData
      }}
    >
      {children}
    </VaultAuthContext.Provider>
  );
};

export const useVaultAuth = () => {
  const context = useContext(VaultAuthContext);
  if (!context) {
    throw new Error('useVaultAuth must be used within a VaultAuthProvider');
  }
  return context;
};
