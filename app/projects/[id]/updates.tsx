import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
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
  updateCard: {
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
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  updateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  updateDate: {
    fontSize: 12,
    color: '#a0aec0',
  },
  updateBody: {
    fontSize: 16,
    color: '#cbd5e0',
    lineHeight: 24,
    marginBottom: 12,
  },
  progressChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressChangeText: {
    fontSize: 14,
    color: '#4299e1',
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

export default function UpdatesScreen() {
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

  // TODO: Implement updates query when updates collection is available
  const { data: updates = [], isLoading: updatesLoading } = useQuery({
    queryKey: ['updates', id],
    queryFn: async () => {
      // Placeholder - implement when updates collection is ready
      return [];
    },
    enabled: !!id,
  });

  const isLoading = projectLoading || updatesLoading;

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
          <Text style={styles.title}>Updates</Text>
        </View>

        {updates.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="megaphone-outline" size={64} color="#a0aec0" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No updates found</Text>
            <Text style={[styles.emptyText, { marginTop: 8, fontSize: 14 }]}>
              Project updates will appear here.
            </Text>
          </View>
        ) : (
          updates.map((update: any) => (
            <View key={update.id} style={styles.updateCard}>
              <View style={styles.updateHeader}>
                <Text style={styles.updateTitle}>{update.title || 'Update'}</Text>
                {update.createdAt && (
                  <Text style={styles.updateDate}>
                    {new Date(update.createdAt).toLocaleDateString()}
                  </Text>
                )}
              </View>
              {update.body && (
                <Text style={styles.updateBody}>{update.body}</Text>
              )}
              {update.progressChange !== undefined && (
                <View style={styles.progressChange}>
                  <Ionicons name="trending-up-outline" size={16} color="#4299e1" />
                  <Text style={styles.progressChangeText}>
                    Progress: {update.progressChange > 0 ? '+' : ''}{update.progressChange}%
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
    </DashboardLayout>
  );
}

