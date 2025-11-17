import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { useNotifications } from '@/hooks/useNotifications';
import { logout } from '@/firebase/auth';
import { useSessionStore } from '@/stores/sessionStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import GradientText from '@/components/ui/GradientText';

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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 24,
    paddingTop: 24,
  },
  animatedBlur1: {
    position: 'absolute',
    borderRadius: 200,
    overflow: 'hidden',
  },
  animatedBlur2: {
    position: 'absolute',
    borderRadius: 200,
    overflow: 'hidden',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userNameGradient: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    flex: 1,
    minWidth: 150,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  statCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: {
    color: '#a0aec0',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  statValuePrimary: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4299e1',
  },
  statValueSecondary: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff9700',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
  },
  projectCard: {
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
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    marginRight: 12,
  },
  projectProgress: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4299e1',
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  projectStatus: {
    fontSize: 14,
    color: '#a0aec0',
    fontWeight: '500',
  },
  projectFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  projectIcon: {
    marginRight: 8,
  },
  emptyState: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
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

export default function DashboardScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { projects, isLoading: projectsLoading, refetch } = useProjects();
  const { unreadCount } = useNotifications();
  const { clearSession } = useSessionStore();

  // Animation values for the blur circles
  const scale1 = useRef(new Animated.Value(1)).current;
  const opacity1 = useRef(new Animated.Value(0.4)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const opacity2 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // First circle animation (top right) - twinkling effect
    const animate1 = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale1, {
            toValue: 1.3,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity1, {
            toValue: 0.6,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale1, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity1, {
            toValue: 0.4,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // Second circle animation (bottom left) - twinkling effect with delay
    const animate2 = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale2, {
            toValue: 1.4,
            duration: 3500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity2, {
            toValue: 0.5,
            duration: 3500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale2, {
            toValue: 1,
            duration: 3500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity2, {
            toValue: 0.3,
            duration: 3500,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    animate1.start();
    animate2.start();

    return () => {
      animate1.stop();
      animate2.stop();
    };
  }, []);

  // Redirect to login if not authenticated (only after loading is complete)
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('No user found, redirecting to login');
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  // Redirect to admin dashboard if admin (only after loading is complete)
  useEffect(() => {
    if (!authLoading && user && user.role === 'admin') {
      console.log('Admin user detected, redirecting to admin dashboard');
      router.replace('/admin/dashboard');
    }
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    await logout();
    clearSession();
    router.replace('/login');
  };

  const isLoading = authLoading || projectsLoading;

  // Show loading screen while checking auth
  if (authLoading) {
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

  // Don't render if no user (will redirect)
  if (!user) {
    return null;
  }

  // Don't render if admin (will redirect)
  if (user.role === 'admin') {
    return null;
  }

  const activeProjects = projects.filter((p: any) => p.status === 'active');
  const totalProgress = activeProjects.length > 0
    ? Math.round(activeProjects.reduce((sum: number, p: any) => sum + (p.progress || 0), 0) / activeProjects.length)
    : 0;

  const menuItems = [
    { label: 'Dashboard', icon: 'home-outline', path: '/dashboard' },
    { label: 'My Projects', icon: 'folder-outline', path: '/projects' },
    { label: 'Notifications', icon: 'notifications-outline', path: '/notifications', badge: unreadCount },
  ];

  return (
    <DashboardLayout menuItems={menuItems} user={user} onLogout={handleLogout}>
      <View style={styles.container}>
        {/* Background gradient - Dark slate to black */}
        <LinearGradient
          colors={['#0f172a', '#020617', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.backgroundGradient}
        />

        {/* Animated blur circles */}
        {/* Top right circle - Softiel primary blue with gradient */}
        <Animated.View
          style={[
            styles.animatedBlur1,
            {
              width: 300,
              height: 300,
              top: -100,
              right: -100,
              transform: [{ scale: scale1 }],
              opacity: opacity1,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(0, 86, 184, 0.6)', 'rgba(0, 61, 130, 0.4)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 150,
            }}
          />
        </Animated.View>

        {/* Bottom left circle - Light blue with gradient */}
        <Animated.View
          style={[
            styles.animatedBlur2,
            {
              width: 250,
              height: 250,
              bottom: -50,
              left: -50,
              transform: [{ scale: scale2 }],
              opacity: opacity2,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(66, 153, 225, 0.5)', 'rgba(0, 86, 184, 0.3)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 125,
            }}
          />
        </Animated.View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={projectsLoading} onRefresh={refetch} tintColor="#4299e1" />}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Hoşgeldin </Text>
                <GradientText
                  colors={['#3b82f6', '#2563eb', '#1d4ed8']}
                  style={styles.userNameGradient}
                >
                  {user?.name || user?.displayName || 'User'}
                </GradientText>
              </View>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <TouchableOpacity
                style={styles.statCard}
                onPress={() => router.push('/projects')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(66, 153, 225, 0.2)', 'rgba(66, 153, 225, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statCardIcon}
                >
                  <Ionicons name="folder-outline" size={24} color="#4299e1" />
                </LinearGradient>
                <Text style={styles.statLabel}>Active Projects</Text>
                <Text style={styles.statValuePrimary}>{activeProjects.length}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statCard}
                onPress={() => router.push('/projects')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(66, 153, 225, 0.2)', 'rgba(66, 153, 225, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statCardIcon}
                >
                  <Ionicons name="trending-up-outline" size={24} color="#4299e1" />
                </LinearGradient>
                <Text style={styles.statLabel}>Overall Progress</Text>
                <Text style={styles.statValuePrimary}>{totalProgress}%</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statCard}
                onPress={() => router.push('/notifications')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(255, 151, 0, 0.2)', 'rgba(255, 151, 0, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statCardIcon}
                >
                  <Ionicons name="notifications-outline" size={24} color="#ff9700" />
                </LinearGradient>
                <Text style={styles.statLabel}>Notifications</Text>
                <Text style={styles.statValueSecondary}>{unreadCount}</Text>
              </TouchableOpacity>
            </View>

            {/* Projects List */}
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Text style={styles.sectionTitle}>My Projects</Text>
                {projects.length > 0 && (
                  <TouchableOpacity onPress={() => router.push('/projects')} activeOpacity={0.7}>
                    <Text style={{ color: '#4299e1', fontSize: 16, fontWeight: '600' }}>See All</Text>
                  </TouchableOpacity>
                )}
              </View>
              {isLoading ? (
                <View style={styles.emptyState}>
                  <ActivityIndicator size="large" color="#4299e1" />
                  <Text style={[styles.emptyText, { marginTop: 16 }]}>Loading...</Text>
                </View>
              ) : projects.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="folder-outline" size={48} color="#a0aec0" />
                  <Text style={[styles.emptyText, { marginTop: 16 }]}>No projects found</Text>
                  <Text style={[styles.emptyText, { marginTop: 8, fontSize: 14 }]}>
                    Your projects will appear here once they are assigned to you.
                  </Text>
                </View>
              ) : (
                projects.slice(0, 5).map((project: any) => (
                  <TouchableOpacity
                    key={project.id}
                    style={styles.projectCard}
                    onPress={() => router.push(`/projects/${project.id}`)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.projectHeader}>
                      <Text style={styles.projectName}>{project.name || project.title || 'Project'}</Text>
                      <Text style={styles.projectProgress}>{project.progress || 0}%</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <LinearGradient
                        colors={['#4299e1', '#667eea']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressFill, { width: `${project.progress || 0}%` }]}
                      />
                    </View>
                    <View style={styles.projectFooter}>
                      <Ionicons name="time-outline" size={16} color="#a0aec0" style={styles.projectIcon} />
                      <Text style={styles.projectStatus}>
                        Status: {project.status === 'active' ? 'Active' : project.status || 'Unknown'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </DashboardLayout>
  );
}
