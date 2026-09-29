import React, { createContext, useContext, useState, useEffect } from 'react';

const ADMIN_AUTH_KEY = 'panjiyar_admin_session_v1';
const CORRECT_PASS = 'Krishna@2026';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  lastLoginTime: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = sessionStorage.getItem(ADMIN_AUTH_KEY);
      return stored === 'active_authenticated';
    } catch {
      return false;
    }
  });

  const [lastLoginTime, setLastLoginTime] = useState<string | null>(() => {
    try {
      return localStorage.getItem('panjiyar_admin_last_login');
    } catch {
      return null;
    }
  });

  const login = (password: string): boolean => {
    if (password === CORRECT_PASS) {
      setIsAuthenticated(true);
      const timestamp = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      setLastLoginTime(timestamp);
      try {
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'active_authenticated');
        localStorage.setItem('panjiyar_admin_last_login', timestamp);
      } catch (e) {
        console.warn('Session write error:', e);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    } catch (e) {
      console.warn('Session clear error:', e);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, lastLoginTime }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
