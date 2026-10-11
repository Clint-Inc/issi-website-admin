import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { setAuthToken, getAuthToken, BASE_URL } from '../services/api';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'Super Admin' | 'Managing Partner';
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: AdminUser = {
  uid: 'demo-admin-uid-1',
  email: 'admin@hermanitarealty.com',
  displayName: 'Executive Admin',
  role: 'Super Admin',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  useEffect(() => {
    const savedDemo = localStorage.getItem('issi_demo_session');
    if (savedDemo === 'true') {
      setUser(DEMO_USER);
      setToken('demo-jwt-token-hermanita-2026');
      setAuthToken('demo-jwt-token-hermanita-2026');
      setIsDemoMode(true);
      setIsLoading(false);
      return;
    }

    const savedUserJson = localStorage.getItem('issi_admin_user');
    const savedToken = getAuthToken();
    if (savedUserJson && savedToken) {
      try {
        setUser(JSON.parse(savedUserJson));
        setToken(savedToken);
        setIsLoading(false);
        return;
      } catch {}
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const idToken = await fbUser.getIdToken();
        setToken(idToken);
        setAuthToken(idToken);
        const adminUser: AdminUser = {
          uid: fbUser.uid,
          email: fbUser.email || 'admin@hermanitarealty.com',
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Admin User',
          role: 'Super Admin',
        };
        setUser(adminUser);
        localStorage.setItem('issi_admin_user', JSON.stringify(adminUser));
        setIsDemoMode(false);
      } else {
        if (localStorage.getItem('issi_demo_session') !== 'true' && !localStorage.getItem('issi_admin_user')) {
          setUser(null);
          setToken(null);
          setAuthToken(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);

    // 1. Primary: Authenticate via FastAPI Backend /auth/login
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      if (res.ok) {
        const data = await res.json();
        const idToken = data.access_token;
        setToken(idToken);
        setAuthToken(idToken);

        const adminUser: AdminUser = {
          uid: data.user.uid,
          email: data.user.email,
          displayName: data.user.displayName || email.split('@')[0],
          role: 'Super Admin',
        };

        setUser(adminUser);
        localStorage.setItem('issi_admin_user', JSON.stringify(adminUser));
        setIsDemoMode(false);
        localStorage.removeItem('issi_demo_session');
        setIsLoading(false);
        return;
      } else {
        const errJson = await res.json().catch(() => ({ detail: 'Authentication failed' }));
        throw new Error(errJson.detail || 'Invalid email or password');
      }
    } catch (backendErr: any) {
      // 2. Fallback: Try Firebase Client Auth SDK
      try {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const idToken = await cred.user.getIdToken();
        setToken(idToken);
        setAuthToken(idToken);

        const adminUser: AdminUser = {
          uid: cred.user.uid,
          email: cred.user.email || email,
          displayName: cred.user.displayName || 'Admin User',
          role: 'Super Admin',
        };

        setUser(adminUser);
        localStorage.setItem('issi_admin_user', JSON.stringify(adminUser));
        setIsDemoMode(false);
        localStorage.removeItem('issi_demo_session');
      } catch (clientErr: any) {
        throw new Error(backendErr.message || clientErr.message || 'Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithEmail = async (email: string, pass: string, name?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, full_name: name }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ detail: 'Sign up failed' }));
        throw new Error(errJson.detail || 'Failed to create account');
      }

      // Automatically sign in after signup
      await loginWithEmail(email, pass);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = () => {
    setUser(DEMO_USER);
    const demoTok = 'demo-jwt-token-hermanita-2026';
    setToken(demoTok);
    setAuthToken(demoTok);
    setIsDemoMode(true);
    localStorage.setItem('issi_demo_session', 'true');
    localStorage.setItem('issi_admin_user', JSON.stringify(DEMO_USER));
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {}
    localStorage.removeItem('issi_demo_session');
    localStorage.removeItem('issi_admin_user');
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setIsDemoMode(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isDemoMode,
        loginWithEmail,
        signupWithEmail,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
