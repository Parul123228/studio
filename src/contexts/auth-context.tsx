'use client';

import { createContext, useContext, ReactNode } from 'react';

// Simplified auth provider since Firebase is not configured.
// This prevents the configuration error screen from showing.

interface AuthContextType {
  user: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = { user: null, loading: false };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
