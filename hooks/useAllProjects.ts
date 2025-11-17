import { useQuery } from '@tanstack/react-query';
import { getDocuments, orderBy } from '@/firebase/firestore';
import { Project } from '@/types';

export const useAllProjects = () => {
  const { data: projects = [], isLoading, error, refetch } = useQuery({
    queryKey: ['all-projects'],
    queryFn: async () => {
      // Tüm projeleri çek (admin için)
      const allProjects = await getDocuments<any>('projects', []);
      
      // Sıralama
      return allProjects.sort((a, b) => {
        const aDate = a.lastUpdate || a.updatedAt || a.createdAt || '';
        const bDate = b.lastUpdate || b.updatedAt || b.createdAt || '';
        return bDate.localeCompare(aDate);
      });
    },
  });

  return {
    projects,
    isLoading,
    error,
    refetch,
  };
};

