import { useEffect, useState, useRef } from 'react';
import { useSessionStore } from '@/stores/sessionStore';
import { getCurrentUser } from '@/firebase/auth';
import { ClientUser } from '@/types';

export const useAuth = () => {
  const { user, setUser, clearSession } = useSessionStore();
  const [isLoading, setIsLoading] = useState(true);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Eğer daha önce kontrol edildiyse tekrar etme
      if (hasCheckedRef.current) {
        return;
      }

      try {
        // Eğer session store'da user varsa, AsyncStorage'dan okumaya gerek yok
        if (user) {
          console.log('useAuth: User found in session store:', user.role);
          setIsLoading(false);
          hasCheckedRef.current = true;
          return;
        }

        console.log('useAuth: No user in session store, checking AsyncStorage...');
        // Session store'da yoksa AsyncStorage'dan oku
        const currentUser = await getCurrentUser();
        if (currentUser) {
          console.log('useAuth: User found in AsyncStorage:', currentUser.role);
          setUser(currentUser);
        } else {
          console.log('useAuth: No user found in AsyncStorage');
          clearSession();
        }
      } catch (error) {
        console.error('Auth check error:', error);
        clearSession();
      } finally {
        setIsLoading(false);
        hasCheckedRef.current = true;
      }
    };

    checkAuth();
  }, []);

  // User değiştiğinde loading'i false yap
  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  return { user, isAuthenticated: !!user, isLoading };
};
