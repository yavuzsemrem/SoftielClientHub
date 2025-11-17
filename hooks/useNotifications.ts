import { useQuery } from '@tanstack/react-query';
import { useSessionStore } from '@/stores/sessionStore';
import { getDocuments, where, orderBy, limit } from '@/firebase/firestore';
import { Notification } from '@/types';

export const useNotifications = () => {
  const { user } = useSessionStore();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      return await getDocuments<Notification>('notifications', [
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(50),
      ]);
    },
    enabled: !!user?.uid,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
  };
};

