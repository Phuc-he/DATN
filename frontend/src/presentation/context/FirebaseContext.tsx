'use client';
import { analytics, app } from '@/src/shared/firebase.config';
import { Analytics } from 'firebase/analytics';
import { FirebaseApp } from 'firebase/app';
import { createContext, ReactNode, useContext } from 'react';

interface FirebaseContextType {
  app: FirebaseApp;
  analytics: Analytics | undefined;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  return (
    <FirebaseContext.Provider value={{ app, analytics }}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom hook for easy access
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
