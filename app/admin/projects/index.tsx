import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAllProjects } from '@/hooks/useAllProjects';

export default function AdminProjectsScreen() {
  const router = useRouter();
  const { projects, isLoading } = useAllProjects();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-text">Tüm Projeler</Text>
          <TouchableOpacity
            className="bg-primary rounded-lg px-4 py-2"
            onPress={() => router.push('/admin/projects/new')}
          >
            <Text className="text-white font-semibold">Yeni Proje</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <Text className="text-gray-500">Yükleniyor...</Text>
        ) : projects.length === 0 ? (
          <View className="bg-surface rounded-lg p-6 items-center">
            <Text className="text-gray-500">Henüz proje bulunmuyor</Text>
          </View>
        ) : (
          projects.map((project: any) => (
            <TouchableOpacity
              key={project.id}
              className="bg-surface rounded-lg p-4 mb-3 shadow-sm"
              onPress={() => router.push(`/admin/projects/${project.id}`)}
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-text">
                    {project.name || project.title || 'Proje'}
                  </Text>
                  {project.client && (
                    <Text className="text-sm text-gray-500 mt-1">Client: {project.client}</Text>
                  )}
                </View>
                <View className="items-end">
                  <Text className="text-sm text-gray-500">
                    {project.clientId ? 'Client Hub' : 'Portfolio'}
                  </Text>
                  {project.progress !== undefined && (
                    <Text className="text-sm text-primary mt-1">{project.progress}%</Text>
                  )}
                </View>
              </View>
              <Text className="text-sm text-gray-500">
                Durum: {project.status || 'Bilinmiyor'}
              </Text>
              {project.clientId && (
                <Text className="text-xs text-gray-400 mt-1">
                  Client ID: {project.clientId}
                </Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

