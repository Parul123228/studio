'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

// This is a mock user for demonstration purposes.
const MOCK_USER = {
  uid: 'mock-user-123',
  email: 'parul@example.com',
  displayName: 'Parul',
  photoURL: 'https://placehold.co/100x100.png'
};

interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  plan: 'Free' | 'Premium';
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  upgradePlan: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  upgradePlan: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('nextgenai-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('nextgenai-user');
    }
    setLoading(false);
  }, []);

  const login = useCallback(() => {
    const loggedInUser = { ...MOCK_USER, plan: user?.plan || 'Free' as const };
    localStorage.setItem('nextgenai-user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  }, [user?.plan]);

  const logout = useCallback(() => {
    localStorage.removeItem('nextgenai-user');
    setUser(null);
  }, []);

  const upgradePlan = useCallback(() => {
    setUser(currentUser => {
        if (currentUser) {
            const upgradedUser = { ...currentUser, plan: 'Premium' as const };
            localStorage.setItem('nextgenai-user', JSON.stringify(upgradedUser));
            return upgradedUser;
        }
        return null;
    });
  }, []);

  const value = { user, loading, login, logout, upgradePlan };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
