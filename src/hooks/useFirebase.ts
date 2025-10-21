import { useEffect } from 'react';
import { useAppStore } from '../store';

export const useFirebase = () => {
  const { initializeFirebaseSubscriptions, isConnected } = useAppStore();

  useEffect(() => {
    // Initialize Firebase subscriptions when component mounts
    initializeFirebaseSubscriptions();
  }, [initializeFirebaseSubscriptions]);

  return { isConnected };
};
