import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getDocument } from '@/firebase/firestore';
import { Project } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import TabNavigation from '@/components/ui/TabNavigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { createProjectMenuItems, projectTabs } from '@/lib/projectMenuItems';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { logout } from '@/firebase/auth';
import { useSessionStore } from '@/stores/sessionStore';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  deliverableCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  deliverableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliverableTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  deliverableStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  statusCompleted: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    color: '#22c55e',
  },
  statusPending: {
    backgroundColor: 'rgba(255, 151, 0, 0.2)',
    color: '#ff9700',
  },
  deliverableDescription: {
    fontSize: 14,
    color: '#cbd5e0',
    lineHeight: 20,
    marginBottom: 12,
  },
  deliverableMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#a0aec0',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(66, 153, 225, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  downloadButtonText: {
    color: '#4299e1',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    color: '#a0aec0',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#a0aec0',
    marginTop: 16,
    fontSize: 16,
  },
});

export default function DeliverablesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const { clearSession } = useSessionStore();
  
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) return null;
      return await getDocument<Project>('projects', id as string);
    },
    enabled: !!id,
  });

  // TODO: Implement deliverables query when deliverables collection is available
  const { data: deliverables = [], isLoading: deliverablesLoading } = useQuery({
    queryKey: ['deliverables', id],
    queryFn: async () => {
      // Placeholder - implement when deliverables collection is ready
      return [];
    },
    enabled: !!id,
  });

  const isLoading = projectLoading || deliverablesLoading;

  const handleLogout = async () => {
    await logout();
    clearSession();
    router.replace('/login');
  };

  const menuItems = createProjectMenuItems(id as string, unreadCount);

  if (isLoading || !user) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0f172a', '#020617', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.backgroundGradient}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4299e1" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems} user={user} onLogout={handleLogout}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#0f172a', '#020617', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.backgroundGradient}
        />
        
        <TabNavigation tabs={projectTabs} projectId={id as string} />

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Deliverables</Text>
        </View>

        {deliverables.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color="#a0aec0" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No deliverables found</Text>
            <Text style={[styles.emptyText, { marginTop: 8, fontSize: 14 }]}>
              Final deliverables will appear here once the project is completed.
            </Text>
          </View>
        ) : (
          deliverables.map((deliverable: any) => (
            <View key={deliverable.id} style={styles.deliverableCard}>
              <View style={styles.deliverableHeader}>
                <Text style={styles.deliverableTitle}>
                  {deliverable.title || 'Deliverable'}
                </Text>
                <Text
                  style={[
                    styles.deliverableStatus,
                    deliverable.status === 'completed'
                      ? styles.statusCompleted
                      : styles.statusPending,
                  ]}
                >
                  {deliverable.status || 'Pending'}
                </Text>
              </View>
              {deliverable.description && (
                <Text style={styles.deliverableDescription}>{deliverable.description}</Text>
              )}
              <View style={styles.deliverableMeta}>
                {deliverable.version && (
                  <View style={styles.metaItem}>
                    <Ionicons name="code-outline" size={16} color="#a0aec0" />
                    <Text style={styles.metaText}>v{deliverable.version}</Text>
                  </View>
                )}
                {deliverable.deliveredAt && (
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={16} color="#a0aec0" />
                    <Text style={styles.metaText}>
                      {new Date(deliverable.deliveredAt).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>
              {deliverable.downloadUrl && (
                <TouchableOpacity style={styles.downloadButton} activeOpacity={0.8}>
                  <Ionicons name="download-outline" size={20} color="#4299e1" />
                  <Text style={styles.downloadButtonText}>Download Package</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
    </DashboardLayout>
  );
}

