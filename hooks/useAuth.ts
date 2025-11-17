import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useSessionStore } from '@/stores/sessionStore';
import { getCurrentUser } from '@/firebase/auth';
import { ClientUser } from '@/types';

export const useAuth = () => {
  const router = useRouter();
  const { user, setUser, clearSession } = useSessionStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          clearSession();
          router.replace('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        clearSession();
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, isAuthenticated: !!user, isLoading };
};
