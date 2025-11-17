import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useProjects } from '@/hooks/useProjects';

export default function ProjectsScreen() {
  const router = useRouter();
  const { projects, isLoading } = useProjects();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-6">
        <Text className="text-2xl font-bold text-text mb-6">Tüm Projeler</Text>

        {isLoading ? (
          <Text className="text-gray-500">Yükleniyor...</Text>
        ) : projects.length === 0 ? (
          <View className="bg-surface rounded-lg p-6 items-center">
            <Text className="text-gray-500">Henüz proje bulunmuyor</Text>
          </View>
        ) : (
          projects.map((project) => (
            <TouchableOpacity
              key={project.id}
              className="bg-surface rounded-lg p-4 mb-3 shadow-sm"
              onPress={() => router.push(`/projects/${project.id}`)}
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-semibold text-text flex-1">{project.name}</Text>
                <Text className="text-sm text-gray-500">{project.progress}%</Text>
              </View>
              <View className="h-2 bg-gray-200 rounded-full mb-2">
                <View
                  className="h-2 bg-primary rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </View>
              <Text className="text-sm text-gray-500">
                Durum: {project.status === 'active' ? 'Aktif' : project.status}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

