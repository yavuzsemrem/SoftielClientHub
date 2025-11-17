import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useAllProjects } from '@/hooks/useAllProjects';
import { useAllUsers } from '@/hooks/useAllUsers';
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
  quickActions: {
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#0056b8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionButtonSecondary: {
    backgroundColor: '#ff9700',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionButtonOutline: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  actionButtonTextOutline: {
    color: '#1f1f1f',
    fontWeight: '600',
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
  projectType: {
    fontSize: 14,
    color: '#6b7280',
  },
  projectStatus: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  projectClientId: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllLink: {
    color: '#0056b8',
    fontSize: 14,
  },
});

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { projects, isLoading: projectsLoading, refetch: refetchProjects } = useAllProjects();
  const { users, isLoading: usersLoading } = useAllUsers();
  const { clearSession } = useSessionStore();

  const handleLogout = async () => {
    await logout();
    clearSession();
    router.replace('/login');
  };

  const activeProjects = projects.filter((p: any) => p.status === 'active' || !p.status);
  const clientUsers = users.filter((u: any) => u.role === 'client');
  const adminUsers = users.filter((u: any) => u.role === 'admin');

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={projectsLoading || usersLoading} onRefresh={() => {
          refetchProjects();
        }} />
      }
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>Admin Paneli</Text>
            <Text style={styles.userName}>{user?.name || user?.displayName || 'Admin'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutButton}>Çıkış</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/admin/projects')}
          >
            <Text style={styles.statLabel}>Toplam Projeler</Text>
            <Text style={styles.statValue}>{projects.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/admin/projects')}
          >
            <Text style={styles.statLabel}>Aktif Projeler</Text>
            <Text style={styles.statValue}>{activeProjects.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/admin/users')}
          >
            <Text style={styles.statLabel}>Müşteriler</Text>
            <Text style={styles.statValueSecondary}>{clientUsers.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/admin/users')}
          >
            <Text style={styles.statLabel}>Adminler</Text>
            <Text style={styles.statValueSecondary}>{adminUsers.length}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/admin/projects/new')}
            >
              <Text style={styles.actionButtonText}>Yeni Proje</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButtonSecondary}
              onPress={() => router.push('/admin/users/new')}
            >
              <Text style={styles.actionButtonText}>Yeni Kullanıcı</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButtonOutline}
              onPress={() => router.push('/admin/projects')}
            >
              <Text style={styles.actionButtonTextOutline}>Tüm Projeler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButtonOutline}
              onPress={() => router.push('/admin/users')}
            >
              <Text style={styles.actionButtonTextOutline}>Tüm Kullanıcılar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Projects */}
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Son Projeler</Text>
            <TouchableOpacity onPress={() => router.push('/admin/projects')}>
              <Text style={styles.seeAllLink}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          {projectsLoading ? (
            <Text style={{ color: '#6b7280' }}>Yükleniyor...</Text>
          ) : projects.length === 0 ? (
            <View style={{ backgroundColor: '#ffffff', borderRadius: 8, padding: 24, alignItems: 'center' }}>
              <Text style={{ color: '#6b7280' }}>Henüz proje bulunmuyor</Text>
            </View>
          ) : (
            projects.slice(0, 5).map((project: any) => (
              <TouchableOpacity
                key={project.id}
                style={styles.projectCard}
                onPress={() => router.push(`/admin/projects/${project.id}`)}
              >
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>
                    {project.name || project.title || 'Proje'}
                  </Text>
                  <Text style={styles.projectType}>
                    {project.clientId ? 'Client Hub' : 'Portfolio'}
                  </Text>
                </View>
                <Text style={styles.projectStatus}>
                  Durum: {project.status || 'Bilinmiyor'}
                </Text>
                {project.clientId && (
                  <Text style={styles.projectClientId}>
                    Client ID: {project.clientId}
                  </Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
