import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export type UserRole = 'FARMER' | 'MANDI_OFFICER' | 'DISTRICT_ADMIN' | 'STATE_ADMIN' | 'SUPER_ADMIN';

export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  stateId?: string;
  districtId?: string;
  centerId?: string;
  farmerProfile?: any;
  center?: any;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithPhoneAndOtp: (phone: string, otp: string) => Promise<{ isNewUser: boolean }>;
  loginAsDemoRole: (role: UserRole) => Promise<void>;
  setAuthSession: (token: string, user: UserProfile) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('kisansetu_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      if (!localStorage.getItem('kisansetu_token')) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const data = await api.getMe();
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.warn('Session expired or offline. Defaulting demo farmer.');
      // Auto-fallback for uninterrupted demo experience
      localStorage.removeItem('kisansetu_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('kisansetu_token');
    if (savedToken) {
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loginWithPhoneAndOtp = async (phone: string, otp: string) => {
    setIsLoading(true);
    try {
      const res = await api.verifyOtp(phone, otp);
      if (res.success && res.token) {
        localStorage.setItem('kisansetu_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return { isNewUser: res.isNewUser };
      }
      throw new Error('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemoRole = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const res = await api.demoLogin(role);
      if (res.success && res.token) {
        localStorage.setItem('kisansetu_token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setAuthSession = (newToken: string, newUser: UserProfile) => {
    localStorage.setItem('kisansetu_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('kisansetu_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        loginWithPhoneAndOtp,
        loginAsDemoRole,
        setAuthSession,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
