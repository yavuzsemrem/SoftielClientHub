import { useQuery } from '@tanstack/react-query';
import { getDocuments } from '@/firebase/firestore';
import { ClientUser } from '@/types';

export const useAllUsers = () => {
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      // Tüm kullanıcıları çek (admin için)
      const allUsers = await getDocuments<any>('users', []);
      
      // Password'u çıkar
      return allUsers.map((user: any) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as ClientUser;
      });
    },
  });

  return {
    users,
    isLoading,
    error,
  };
};

