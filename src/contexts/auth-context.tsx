'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    updateProfile,
    sendPasswordResetEmail,
    type User 
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';

export interface AppUser extends User {
  plan: 'Free' | 'Premium' | 'Ultra Premium';
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signup: (displayName: string, email: string, pass: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  upgradePlan: (plan: 'Premium' | 'Ultra Premium') => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
  sendPasswordReset: async () => {},
  upgradePlan: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const getPlanForUser = (userId: string): 'Free' | 'Premium' | 'Ultra Premium' => {
    try {
      const storedPlans = localStorage.getItem('nextgenai-plans');
      if (storedPlans) {
        const plans = JSON.parse(storedPlans);
        return plans[userId] || 'Free';
      }
    } catch (error) {
      console.error("Failed to parse plans from localStorage", error);
    }
    return 'Free';
  };

  const setPlanForUser = (userId: string, plan: 'Free' | 'Premium' | 'Ultra Premium') => {
    try {
      const storedPlans = localStorage.getItem('nextgenai-plans');
      const plans = storedPlans ? JSON.parse(storedPlans) : {};
      plans[userId] = plan;
      localStorage.setItem('nextgenai-plans', JSON.stringify(plans));
    } catch (error) {
       console.error("Failed to save plan to localStorage", error);
    }
  };


  useEffect(() => {
    if (!auth) {
        setLoading(false);
        const storedUser = localStorage.getItem('nextgenai-user');
        if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch(e) {
              localStorage.removeItem('nextgenai-user');
            }
        }
        return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const plan = getPlanForUser(firebaseUser.uid);
        const appUser: AppUser = {
            ...firebaseUser,
             displayName: firebaseUser.displayName,
             email: firebaseUser.email,
             emailVerified: firebaseUser.emailVerified,
             isAnonymous: firebaseUser.isAnonymous,
             metadata: firebaseUser.metadata,
             phoneNumber: firebaseUser.phoneNumber,
             photoURL: firebaseUser.photoURL,
             providerData: firebaseUser.providerData,
             providerId: firebaseUser.providerId,
             tenantId: firebaseUser.tenantId,
             uid: firebaseUser.uid,
             delete: firebaseUser.delete,
             getIdToken: firebaseUser.getIdToken,
             getIdTokenResult: firebaseUser.getIdTokenResult,
             reload: firebaseUser.reload,
             toJSON: firebaseUser.toJSON,
            plan: plan,
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (displayName: string, email: string, pass: string) => {
    if (!auth) {
        // Create a mock user for signup when Firebase is not configured
        const MOCK_USER = {
            uid: `mock-user-${new Date().getTime()}`,
            email: email,
            displayName: displayName,
            photoURL: null,
            plan: 'Free' as const,
        };
        localStorage.setItem('nextgenai-user', JSON.stringify(MOCK_USER));
        // @ts-ignore
        setUser(MOCK_USER);
        return;
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName });
    
    const plan = 'Free';
    setPlanForUser(userCredential.user.uid, plan);

    const appUser: AppUser = {
        ...userCredential.user,
        displayName: displayName,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified,
        isAnonymous: userCredential.user.isAnonymous,
        metadata: userCredential.user.metadata,
        phoneNumber: userCredential.user.phoneNumber,
        photoURL: userCredential.user.photoURL,
        providerData: userCredential.user.providerData,
        providerId: userCredential.user.providerId,
        tenantId: userCredential.user.tenantId,
        uid: userCredential.user.uid,
        delete: userCredential.user.delete,
        getIdToken: userCredential.user.getIdToken,
        getIdTokenResult: userCredential.user.getIdTokenResult,
        reload: userCredential.user.reload,
        toJSON: userCredential.user.toJSON,
        plan: plan
    };
    setUser(appUser);
  };

  const login = async (email: string, pass: string) => {
    if (!auth) {
        const MOCK_USER = {
            uid: 'mock-user-123',
            email: 'parul@example.com',
            displayName: 'Parul',
            photoURL: null,
            plan: 'Free' as const
        };
        localStorage.setItem('nextgenai-user', JSON.stringify(MOCK_USER));
        // @ts-ignore
        setUser(MOCK_USER);
        return;
    }
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    if (!auth) {
        localStorage.removeItem('nextgenai-user');
        setUser(null);
        return;
    }
    await signOut(auth);
  };

  const sendPasswordReset = async (email: string) => {
      if (!auth) throw new Error("Firebase not configured. Cannot reset password.");
      await sendPasswordResetEmail(auth, email);
  }

  const upgradePlan = useCallback((plan: 'Premium' | 'Ultra Premium') => {
    setUser(currentUser => {
        if (currentUser) {
            setPlanForUser(currentUser.uid, plan);
            const upgradedUser: AppUser = { ...currentUser, plan: plan };
            if (!auth) {
                localStorage.setItem('nextgenai-user', JSON.stringify(upgradedUser));
            }
            return upgradedUser;
        }
        return null;
    });
  }, []);

  const value = { user, loading, login, signup, logout, upgradePlan, sendPasswordReset };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
