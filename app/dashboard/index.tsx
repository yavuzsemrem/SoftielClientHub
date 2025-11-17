import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { useNotifications } from '@/hooks/useNotifications';
import { logout } from '@/firebase/auth';
import { useSessionStore } from '@/stores/sessionStore';

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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f1f1f',
  },
  userName: {
    fontSize: 16,
    color: '#1f1f1f',
    marginTop: 4,
  },
  logoutButton: {
    color: '#0056b8',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    flex: 1,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0056b8',
  },
  statValueSecondary: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff9700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f1f1f',
    marginBottom: 16,
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f1f1f',
    flex: 1,
  },
  projectProgress: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0056b8',
    borderRadius: 4,
  },
  projectStatus: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
  },
  loadingText: {
    color: '#6b7280',
  },
});

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { projects, isLoading, refetch } = useProjects();
  const { unreadCount } = useNotifications();
  const { clearSession } = useSessionStore();

  const handleLogout = async () => {
    await logout();
    clearSession();
    router.replace('/login');
  };

  const activeProjects = projects.filter((p: any) => p.status === 'active');
  const totalProgress = activeProjects.length > 0
    ? Math.round(activeProjects.reduce((sum: number, p: any) => sum + (p.progress || 0), 0) / activeProjects.length)
    : 0;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>Hoş Geldiniz</Text>
            <Text style={styles.userName}>{user?.name || user?.displayName || 'Kullanıcı'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutButton}>Çıkış</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Aktif Projeler</Text>
            <Text style={styles.statValue}>{activeProjects.length}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Genel İlerleme</Text>
            <Text style={styles.statValue}>{totalProgress}%</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Bildirimler</Text>
            <Text style={styles.statValueSecondary}>{unreadCount}</Text>
          </View>
        </View>

        {/* Projects List */}
        <View>
          <Text style={styles.sectionTitle}>Projelerim</Text>
          {isLoading ? (
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          ) : projects.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Henüz proje bulunmuyor</Text>
            </View>
          ) : (
            projects.map((project: any) => (
              <TouchableOpacity
                key={project.id}
                style={styles.projectCard}
                onPress={() => router.push(`/projects/${project.id}`)}
              >
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{project.name || project.title || 'Proje'}</Text>
                  <Text style={styles.projectProgress}>{project.progress || 0}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${project.progress || 0}%` }]}
                  />
                </View>
                <Text style={styles.projectStatus}>
                  Durum: {project.status === 'active' ? 'Aktif' : project.status || 'Bilinmiyor'}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
