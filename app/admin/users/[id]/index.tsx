import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Switch, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocument, updateDocument, deleteDocument, getDocuments, where } from '@/firebase/firestore';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#4299e1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDanger: {
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 8,
  },
  card: {
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
  label: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 8,
    fontWeight: '500',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  valueText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  roleButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#a0aec0',
    marginTop: 16,
    fontSize: 16,
  },
  emptyText: {
    color: '#a0aec0',
    fontSize: 16,
  },
});

export default function AdminUserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const { clearSession } = useSessionStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [role, setRole] = useState<'admin' | 'client'>('client');
  const [company, setCompany] = useState('');

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

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) return null;
      // users koleksiyonunda uid veya id ile arama yap
      const userDoc = await getDocument<any>('users', id);
      if (!userDoc) {
        // uid ile arama yap
        const users = await getDocuments<any>('users', [where('uid', '==', id)]);
        return users[0] || null;
      }
      return userDoc;
    },
    enabled: !!id,
    onSuccess: (data) => {
      if (data) {
        setName(data.name || data.displayName || '');
        setEmail(data.email || '');
        setIsActive(data.isActive !== false);
        setRole(data.role || 'client');
        setCompany(data.company || '');
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!user?.id && !user?.uid) return false;
      const userId = user.id || user.uid;
      return await updateDocument('users', userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      setIsEditing(false);
      Alert.alert('Success', 'User updated successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id && !user?.uid) return false;
      const userId = user.id || user.uid;
      return await deleteDocument('users', userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      router.back();
      Alert.alert('Success', 'User deleted successfully');
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      name,
      email,
      isActive,
      role,
      company: company.trim() || undefined,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  };

  const handleLogout = async () => {
    await logout();
    clearSession();
    router.replace('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: 'home-outline', path: '/admin/dashboard' },
    { label: 'Projects', icon: 'folder-outline', path: '/admin/projects' },
    { label: 'Users', icon: 'people-outline', path: '/admin/users' },
  ];

  if (authLoading || isLoading) {
    return (
      <DashboardLayout menuItems={menuItems} user={currentUser} onLogout={handleLogout}>
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
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout menuItems={menuItems} user={currentUser} onLogout={handleLogout}>
        <View style={styles.container}>
          <LinearGradient
            colors={['#0f172a', '#020617', '#000000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.backgroundGradient}
          />
          <View style={styles.loadingContainer}>
            <Text style={styles.emptyText}>User not found</Text>
          </View>
        </View>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems} user={currentUser} onLogout={handleLogout}>
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
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, styles.title]}
                    value={name}
                    onChangeText={setName}
                    placeholder="User name"
                    placeholderTextColor="#718096"
                  />
                ) : (
                  <Text style={styles.title}>
                    {user.name || user.displayName || 'User'}
                  </Text>
                )}
              </View>
              <View style={styles.actions}>
                {isEditing ? (
                  <>
                    <TouchableOpacity onPress={handleSave} activeOpacity={0.8}>
                      <LinearGradient
                        colors={['#4299e1', '#667eea']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                      >
                        <Ionicons name="checkmark-outline" size={20} color="#ffffff" />
                        <Text style={styles.buttonText}>Save</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsEditing(false)} activeOpacity={0.8}>
                      <View style={[styles.button, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
                        <Ionicons name="close-outline" size={20} color="#ffffff" />
                        <Text style={styles.buttonText}>Cancel</Text>
                      </View>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity onPress={() => setIsEditing(true)} activeOpacity={0.8}>
                      <LinearGradient
                        colors={['#4299e1', '#667eea']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                      >
                        <Ionicons name="create-outline" size={20} color="#ffffff" />
                        <Text style={styles.buttonText}>Edit</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete} activeOpacity={0.8}>
                      <LinearGradient
                        colors={['#ef4444', '#dc2626']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonDanger}
                      >
                        <Ionicons name="trash-outline" size={20} color="#ffffff" />
                        <Text style={styles.buttonText}>Delete</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            {/* Email */}
            <View style={styles.card}>
              <Text style={styles.label}>Email</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="email@example.com"
                  placeholderTextColor="#718096"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.value}>{user.email}</Text>
              )}
            </View>

            {/* Role */}
            <View style={styles.card}>
              <Text style={styles.label}>Role</Text>
              {isEditing ? (
                <View style={styles.roleSelector}>
                  <TouchableOpacity
                    onPress={() => setRole('admin')}
                    activeOpacity={0.8}
                    style={{ flex: 1 }}
                  >
                    <LinearGradient
                      colors={role === 'admin' ? ['#4299e1', '#667eea'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.roleButton}
                    >
                      <Text style={[styles.roleButtonText, { color: role === 'admin' ? '#ffffff' : '#a0aec0' }]}>
                        Admin
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setRole('client')}
                    activeOpacity={0.8}
                    style={{ flex: 1 }}
                  >
                    <LinearGradient
                      colors={role === 'client' ? ['#4299e1', '#667eea'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.roleButton}
                    >
                      <Text style={[styles.roleButtonText, { color: role === 'client' ? '#ffffff' : '#a0aec0' }]}>
                        Client
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[styles.statusBadge, user.role === 'admin' ? styles.statusBadgeAdmin : styles.statusBadgeActive]}>
                  <Text style={[styles.statusText, user.role === 'admin' ? styles.statusTextAdmin : styles.statusTextActive]}>
                    {user.role === 'admin' ? 'Admin' : 'Client'}
                  </Text>
                </View>
              )}
            </View>

            {/* Active Status */}
            <View style={styles.card}>
              <Text style={styles.label}>Active Status</Text>
              {isEditing ? (
                <View style={styles.switchContainer}>
                  <Text style={styles.valueText}>{isActive ? 'Active' : 'Inactive'}</Text>
                  <Switch
                    value={isActive}
                    onValueChange={setIsActive}
                    trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: 'rgba(66, 153, 225, 0.5)' }}
                    thumbColor={isActive ? '#4299e1' : '#f4f3f4'}
                  />
                </View>
              ) : (
                <View style={[styles.statusBadge, user.isActive !== false ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
                  <Text style={[styles.statusText, user.isActive !== false ? styles.statusTextActive : styles.statusTextInactive]}>
                    {user.isActive !== false ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              )}
            </View>

            {/* Company */}
            <View style={styles.card}>
              <Text style={styles.label}>Company</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={company}
                  onChangeText={setCompany}
                  placeholder="Company name"
                  placeholderTextColor="#718096"
                />
              ) : (
                <Text style={styles.valueText}>
                  {user.company || 'No company'}
                </Text>
              )}
            </View>

            {/* UID */}
            {user.uid && (
              <View style={styles.card}>
                <Text style={styles.label}>UID</Text>
                <Text style={[styles.valueText, { fontSize: 12, fontFamily: 'monospace' }]}>
                  {user.uid}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </DashboardLayout>
  );
}
