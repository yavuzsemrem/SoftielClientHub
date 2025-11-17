import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocument, updateDocument, deleteDocument } from '@/firebase/firestore';
import { useState } from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  content: {
    padding: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f1f1f',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    backgroundColor: '#0056b8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonDanger: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f1f1f',
  },
  valueText: {
    fontSize: 16,
    color: '#1f1f1f',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0056b8',
    borderRadius: 6,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fb',
  },
  loadingText: {
    color: '#6b7280',
    marginTop: 8,
  },
  emptyText: {
    color: '#6b7280',
  },
});

export default function AdminProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) return null;
      return await getDocument<any>('projects', id);
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!id) return false;
      return await updateDocument('projects', id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['all-projects'] });
      setIsEditing(false);
      Alert.alert('Başarılı', 'Proje güncellendi');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) return false;
      return await deleteDocument('projects', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-projects'] });
      router.back();
      Alert.alert('Başarılı', 'Proje silindi');
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Projeyi Sil',
      'Bu projeyi silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0056b8" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>Proje bulunamadı</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {project.name || project.title || 'Proje Detayı'}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Text style={styles.buttonText}>{isEditing ? 'İptal' : 'Düzenle'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonDanger}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Sil</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Durum</Text>
          <Text style={styles.value}>{project.status || 'Bilinmiyor'}</Text>
        </View>

        {project.clientId && (
          <View style={styles.card}>
            <Text style={styles.label}>Client ID</Text>
            <Text style={styles.value}>{project.clientId}</Text>
          </View>
        )}

        {project.client && (
          <View style={styles.card}>
            <Text style={styles.label}>Client</Text>
            <Text style={styles.value}>{project.client}</Text>
          </View>
        )}

        {project.description && (
          <View style={styles.card}>
            <Text style={styles.label}>Açıklama</Text>
            <Text style={styles.valueText}>{project.description}</Text>
          </View>
        )}

        {project.content && (
          <View style={styles.card}>
            <Text style={styles.label}>İçerik</Text>
            <Text style={styles.valueText}>{project.content}</Text>
          </View>
        )}

        {project.progress !== undefined && (
          <View style={styles.card}>
            <Text style={styles.label}>İlerleme</Text>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${project.progress}%` }]}
              />
            </View>
            <Text style={styles.value}>{project.progress}%</Text>
          </View>
        )}

        {project.createdAt && (
          <View style={styles.card}>
            <Text style={styles.label}>Oluşturulma</Text>
            <Text style={styles.valueText}>
              {typeof project.createdAt === 'string'
                ? project.createdAt
                : project.createdAt?.toDate?.()?.toLocaleString('tr-TR') || 'Bilinmiyor'}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
