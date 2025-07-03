'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { getUserSubscription, Subscription } from '@/lib/firestore';

interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({ subscription: null, loading: true });

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getUserSubscription(user.uid).then(sub => {
        setSubscription(sub);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  const value = { subscription, loading };
  
  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export const useSubscription = () => {
  return useContext(SubscriptionContext);
};
