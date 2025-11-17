import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getDocument } from '@/firebase/firestore';
import { Project } from '@/types';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) return null;
      return await getDocument<Project>('projects', id);
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-gray-500">Yükleniyor...</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-gray-500">Proje bulunamadı</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-6">
        <Text className="text-2xl font-bold text-text mb-4">{project.name}</Text>
        
        <View className="bg-surface rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-sm text-gray-500 mb-1">İlerleme</Text>
          <View className="h-3 bg-gray-200 rounded-full mb-2">
            <View
              className="h-3 bg-primary rounded-full"
              style={{ width: `${project.progress}%` }}
            />
          </View>
          <Text className="text-lg font-semibold text-text">{project.progress}%</Text>
        </View>

        <View className="bg-surface rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-sm text-gray-500 mb-1">Durum</Text>
          <Text className="text-lg font-semibold text-text">
            {project.status === 'active' ? 'Aktif' : project.status}
          </Text>
        </View>

        {project.description && (
          <View className="bg-surface rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-sm text-gray-500 mb-1">Açıklama</Text>
            <Text className="text-text">{project.description}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

