import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { logout } from '@/firebase/auth';
import { useSessionStore } from '@/stores/sessionStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDocument } from '@/firebase/firestore';
import { Notification } from '@/types';

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
    alignItems: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  notificationCard: {
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
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#4299e1',
    backgroundColor: 'rgba(66, 153, 225, 0.1)',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#a0aec0',
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#718096',
    marginTop: 8,
  },
  notificationType: {
    fontSize: 12,
    color: '#4299e1',
    fontWeight: '600',
    marginTop: 4,
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
  markAllReadButton: {
    backgroundColor: 'rgba(66, 153, 225, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    alignSelf: 'flex-end',
  },
  markAllReadText: {
    color: '#4299e1',
    fontSize: 14,
    fontWeight: '600',
  },
});

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'update':
      return 'megaphone-outline';
    case 'approval':
      return 'checkmark-circle-outline';
    case 'message':
      return 'chatbubble-outline';
    case 'task':
      return 'checkbox-outline';
    case 'file':
      return 'document-outline';
    default:
      return 'notifications-outline';
  }
};

const getNotificationIconColor = (type: string) => {
  switch (type) {
    case 'update':
      return '#4299e1';
    case 'approval':
      return '#22c55e';
    case 'message':
      return '#ff9700';
    case 'task':
      return '#667eea';
    case 'file':
      return '#3b82f6';
    default:
      return '#a0aec0';
  }
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { notifications, isLoading, unreadCount } = useNotifications();
  const { clearSession } = useSessionStore();
  const queryClient = useQueryClient();

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

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return await updateDocument('notifications', notificationId, { read: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.uid] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unreadNotifications = notifications.filter((n) => !n.read);
      await Promise.all(
        unreadNotifications.map((n) => updateDocument('notifications', n.id, { read: true }))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.uid] });
    },
  });

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read) {
      markAsReadMutation.mutate(notification.id);
    }

    // Navigate based on type
    if (notification.relatedId) {
      switch (notification.type) {
        case 'update':
        case 'approval':
        case 'task':
        case 'file':
          router.push(`/projects/${notification.relatedId}`);
          break;
        case 'message':
          router.push(`/projects/${notification.relatedId}/chat`);
          break;
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    clearSession();
    router.replace('/login');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Şimdi';
    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  const menuItems = [
    { label: 'Dashboard', icon: 'home-outline', path: '/dashboard' },
    { label: 'My Projects', icon: 'folder-outline', path: '/projects' },
    { label: 'Notifications', icon: 'notifications-outline', path: '/notifications', badge: unreadCount },
  ];

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

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout menuItems={menuItems} user={user} onLogout={handleLogout}>
      <View style={styles.container}>
        {/* Background gradient */}
        <LinearGradient
          colors={['#0f172a', '#020617', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.backgroundGradient}
        />

        {/* Animated blur circles */}
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
              onRefresh={() => queryClient.invalidateQueries({ queryKey: ['notifications', user?.uid] })}
              tintColor="#4299e1"
            />
          }
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerText}>Notifications</Text>
              {unreadCount > 0 && (
                <TouchableOpacity
                  style={styles.markAllReadButton}
                  onPress={() => markAllAsReadMutation.mutate()}
                  activeOpacity={0.7}
                >
                  <Text style={styles.markAllReadText}>Mark All as Read</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Notifications List */}
            {isLoading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="large" color="#4299e1" />
                <Text style={styles.emptyText}>Loading...</Text>
              </View>
            ) : notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="notifications-outline" size={48} color="#a0aec0" />
                <Text style={styles.emptyText}>No notifications found</Text>
                <Text style={[styles.emptyText, { marginTop: 8, fontSize: 14 }]}>
                  You'll see notifications here when there are updates on your projects.
                </Text>
              </View>
            ) : (
              notifications.map((notification: Notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    !notification.read && styles.notificationCardUnread,
                  ]}
                  onPress={() => handleNotificationPress(notification)}
                  activeOpacity={0.8}
                >
                  <View style={styles.notificationHeader}>
                    <LinearGradient
                      colors={[
                        `${getNotificationIconColor(notification.type)}33`,
                        `${getNotificationIconColor(notification.type)}11`,
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.notificationIcon}
                    >
                      <Ionicons
                        name={getNotificationIcon(notification.type) as any}
                        size={24}
                        color={getNotificationIconColor(notification.type)}
                      />
                    </LinearGradient>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                      <Text style={styles.notificationType}>
                        {notification.type === 'update' ? 'Update' :
                         notification.type === 'approval' ? 'Approval' :
                         notification.type === 'message' ? 'Message' :
                         notification.type === 'task' ? 'Task' :
                         notification.type === 'file' ? 'File' : 'Notification'}
                      </Text>
                      <Text style={styles.notificationTime}>
                        {formatTime(notification.createdAt)}
                      </Text>
                    </View>
                    {!notification.read && (
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: '#4299e1',
                          marginLeft: 12,
                          marginTop: 4,
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </DashboardLayout>
  );
}

