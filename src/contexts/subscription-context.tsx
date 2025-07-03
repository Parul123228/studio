'use client';

import { createContext, useContext, ReactNode } from 'react';

// This is a placeholder context.
// All subscription-related logic has been removed to simplify the app.
// You can re-implement this later with a real subscription system.

interface SubscriptionContextType {
  subscription: null;
  loading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({ subscription: null, loading: false });

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const value = { subscription: null, loading: false };
  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export const useSubscription = () => {
  return useContext(SubscriptionContext);
};
