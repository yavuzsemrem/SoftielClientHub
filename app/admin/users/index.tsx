import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useAllUsers } from '@/hooks/useAllUsers';
import { logout } from '@/firebase/auth';
import { useSessionStore } from '@/stores/sessionStore';
import DashboardLayout from '@/components/layout/DashboardLayout';

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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 24,
    paddingTop: 24,
  },
  header: {
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    marginTop: 8,
  },
  userCard: {
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
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 4,
  },
  userCompany: {
    fontSize: 14,
    color: '#718096',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusBadgeActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusBadgeInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusBadgeAdmin: {
    backgroundColor: 'rgba(66, 153, 225, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#22c55e',
  },
  statusTextInactive: {
    color: '#ef4444',
  },
  statusTextAdmin: {
    color: '#4299e1',
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
    marginTop: 16,
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
  newUserButton: {
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#ff9700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  newUserButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 8,
  },
});

export default function AdminUsersScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { users, isLoading, refetch } = useAllUsers();
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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading]);

  // Redirect to client dashboard if client
  useEffect(() => {
    if (user && user.role === 'client') {
      router.replace('/dashboard');
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    clearSession();
    router.replace('/login');
  };

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

  // Don't render if client (will redirect)
  if (user.role === 'client') {
    return null;
  }

  const menuItems = [
    { label: 'Dashboard', icon: 'home-outline', path: '/admin/dashboard' },
    { label: 'Projects', icon: 'folder-outline', path: '/admin/projects' },
    { label: 'Users', icon: 'people-outline', path: '/admin/users' },
  ];

  const clientUsers = users.filter((u: any) => u.role === 'client');
  const adminUsers = users.filter((u: any) => u.role === 'admin');

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
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor="#4299e1"
            />
          }
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerText}>All Users</Text>
              <TouchableOpacity
                onPress={() => router.push('/admin/users/new')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#ff9700', '#ff6b35']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.newUserButton}
                >
                  <Ionicons name="person-add-outline" size={20} color="#ffffff" />
                  <Text style={styles.newUserButtonText}>New User</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Client Users */}
            <View>
              <Text style={styles.sectionTitle}>Clients ({clientUsers.length})</Text>
              {isLoading ? (
                <View style={styles.emptyState}>
                  <ActivityIndicator size="large" color="#4299e1" />
                  <Text style={styles.emptyText}>Loading...</Text>
                </View>
              ) : clientUsers.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="people-outline" size={48} color="#a0aec0" />
                  <Text style={styles.emptyText}>No clients found</Text>
                </View>
              ) : (
                clientUsers.map((userItem: any) => (
                  <TouchableOpacity
                    key={userItem.id || userItem.uid}
                    style={styles.userCard}
                    onPress={() => router.push(`/admin/users/${userItem.uid || userItem.id}`)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.userHeader}>
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>
                          {userItem.name || userItem.displayName || 'User'}
                        </Text>
                        <Text style={styles.userEmail}>{userItem.email}</Text>
                        {userItem.company && (
                          <Text style={styles.userCompany}>{userItem.company}</Text>
                        )}
                      </View>
                      <View style={[
                        styles.statusBadge,
                        userItem.isActive !== false ? styles.statusBadgeActive : styles.statusBadgeInactive
                      ]}>
                        <Text style={[
                          styles.statusText,
                          userItem.isActive !== false ? styles.statusTextActive : styles.statusTextInactive
                        ]}>
                          {userItem.isActive !== false ? 'Active' : 'Inactive'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>

            {/* Admin Users */}
            <View>
              <Text style={styles.sectionTitle}>Admins ({adminUsers.length})</Text>
              {adminUsers.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="shield-outline" size={48} color="#a0aec0" />
                  <Text style={styles.emptyText}>No admins found</Text>
                </View>
              ) : (
                adminUsers.map((userItem: any) => (
                  <TouchableOpacity
                    key={userItem.id || userItem.uid}
                    style={styles.userCard}
                    onPress={() => router.push(`/admin/users/${userItem.uid || userItem.id}`)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.userHeader}>
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>
                          {userItem.name || userItem.displayName || 'Admin'}
                        </Text>
                        <Text style={styles.userEmail}>{userItem.email}</Text>
                      </View>
                      <View style={[styles.statusBadge, styles.statusBadgeAdmin]}>
                        <Text style={[styles.statusText, styles.statusTextAdmin]}>
                          Admin
                        </Text>
                      </View>
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
