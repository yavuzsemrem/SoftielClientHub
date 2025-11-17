import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getDocument, queryCollection } from '@/firebase/firestore';
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
  phaseCard: {
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
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  phasePercent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4299e1',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  phaseDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#a0aec0',
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

export default function PhasesScreen() {
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

  // TODO: Implement phases query when phases collection is available
  const { data: phases = [], isLoading: phasesLoading } = useQuery({
    queryKey: ['phases', id],
    queryFn: async () => {
      // Placeholder - implement when phases collection is ready
      return [];
    },
    enabled: !!id,
  });

  const isLoading = projectLoading || phasesLoading;

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
          <Text style={styles.title}>Phases</Text>
        </View>

        {phases.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="layers-outline" size={64} color="#a0aec0" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No phases found</Text>
            <Text style={[styles.emptyText, { marginTop: 8, fontSize: 14 }]}>
              Phases will appear here once they are added to the project.
            </Text>
          </View>
        ) : (
          phases.map((phase: any) => (
            <View key={phase.id} style={styles.phaseCard}>
              <View style={styles.phaseHeader}>
                <Text style={styles.phaseTitle}>{phase.title || 'Untitled Phase'}</Text>
                <Text style={styles.phasePercent}>{phase.percent || 0}%</Text>
              </View>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#4299e1', '#667eea']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${phase.percent || 0}%` }]}
                />
              </View>
              {(phase.startDate || phase.endDate) && (
                <View style={styles.phaseDates}>
                  {phase.startDate && (
                    <Text style={styles.dateText}>Start: {new Date(phase.startDate).toLocaleDateString()}</Text>
                  )}
                  {phase.endDate && (
                    <Text style={styles.dateText}>End: {new Date(phase.endDate).toLocaleDateString()}</Text>
                  )}
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

