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
  approvalCard: {
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
  approvalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  approvalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  approvalStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  statusPending: {
    backgroundColor: 'rgba(255, 151, 0, 0.2)',
    color: '#ff9700',
  },
  statusApproved: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    color: '#22c55e',
  },
  statusRejected: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
  },
  approvalNotes: {
    fontSize: 14,
    color: '#cbd5e0',
    lineHeight: 20,
    marginTop: 8,
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

export default function ApprovalsScreen() {
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

  // TODO: Implement approvals query when approvals collection is available
  const { data: approvals = [], isLoading: approvalsLoading } = useQuery({
    queryKey: ['approvals', id],
    queryFn: async () => {
      // Placeholder - implement when approvals collection is ready
      return [];
    },
    enabled: !!id,
  });

  const isLoading = projectLoading || approvalsLoading;

  const handleLogout = async () => {
    await logout();
    clearSession();
    router.replace('/login');
  };

  const menuItems = createProjectMenuItems(id as string, unreadCount);

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return styles.statusApproved;
      case 'rejected':
      case 'revision':
        return styles.statusRejected;
      default:
        return styles.statusPending;
    }
  };

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
          <Text style={styles.title}>Approvals</Text>
        </View>

        {approvals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#a0aec0" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No approvals found</Text>
            <Text style={[styles.emptyText, { marginTop: 8, fontSize: 14 }]}>
              Approval requests will appear here.
            </Text>
          </View>
        ) : (
          approvals.map((approval: any) => (
            <View key={approval.id} style={styles.approvalCard}>
              <View style={styles.approvalHeader}>
                <Text style={styles.approvalTitle}>{approval.title || 'Approval Request'}</Text>
                <Text style={[styles.approvalStatus, getStatusStyle(approval.status)]}>
                  {approval.status || 'Pending'}
                </Text>
              </View>
              {approval.notes && (
                <Text style={styles.approvalNotes}>{approval.notes}</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
    </DashboardLayout>
  );
}

