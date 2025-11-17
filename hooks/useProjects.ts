import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '@/stores/sessionStore';
import { getProjectsByClientId, subscribeToProjects, createDocument, updateDocument } from '@/firebase/firestore';
import { Project } from '@/types';

export const useProjects = () => {
  const { user } = useSessionStore();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      return await getProjectsByClientId(user.uid);
    },
    enabled: !!user?.uid,
  });

  const createProject = useMutation({
    mutationFn: async (projectData: Omit<Project, 'id'>) => {
      return await createDocument<Project>('projects', projectData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Project> }) => {
      return await updateDocument<Project>('projects', id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    projects,
    isLoading,
    error,
    createProject,
    updateProject,
  };
};
