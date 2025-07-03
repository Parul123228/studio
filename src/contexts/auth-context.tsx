'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import Logo from '@/components/shared/Logo';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setLoading(false);
        });
        return () => unsubscribe();
    } else {
        setLoading(false);
    }
  }, []);

  if (!isFirebaseConfigured) {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-4 p-4 text-center">
            <Logo />
            <div className="bg-destructive/10 border border-destructive/50 text-destructive p-6 rounded-lg flex flex-col items-center gap-4 max-w-2xl">
               <AlertCircle className="h-12 w-12"/>
               <div className='space-y-2'>
                <h2 className="font-bold text-2xl">Configuration Error</h2>
                <p className="text-sm">
                    Your app is not connected to Firebase because the configuration keys are missing or invalid. Please add your Firebase project's configuration keys to the <strong>.env</strong> file in your project.
                </p>
                <Button variant="destructive" asChild>
                    <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">
                        Get Firebase Keys
                    </a>
                </Button>
               </div>
            </div>
      </div>
    )
  }

  const value = { user, loading };
  
  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-4">
        <Logo />
        <p className="text-primary glowing-text">Initializing Session...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
