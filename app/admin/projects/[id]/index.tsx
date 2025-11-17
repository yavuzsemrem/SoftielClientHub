import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Animated, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocument, updateDocument, deleteDocument } from '@/firebase/firestore';
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    marginTop: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
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
  statusBadgeCompleted: {
    backgroundColor: 'rgba(66, 153, 225, 0.2)',
  },
  statusBadgeOnHold: {
    backgroundColor: 'rgba(255, 151, 0, 0.2)',
  },
  statusBadgeCancelled: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#22c55e',
  },
  statusTextCompleted: {
    color: '#4299e1',
  },
  statusTextOnHold: {
    color: '#ff9700',
  },
  statusTextCancelled: {
    color: '#ef4444',
  },
});

export default function AdminProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();
  const { clearSession } = useSessionStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'completed' | 'on-hold' | 'cancelled'>('active');
  const [progress, setProgress] = useState('0');

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

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) return null;
      return await getDocument<any>('projects', id);
    },
    enabled: !!id,
    onSuccess: (data) => {
      if (data) {
        setName(data.name || data.title || '');
        setDescription(data.description || '');
        setStatus(data.status || 'active');
        setProgress(String(data.progress || 0));
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!id) return false;
      return await updateDocument('projects', id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['all-projects'] });
      setIsEditing(false);
      Alert.alert('Success', 'Project updated successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) return false;
      return await deleteDocument('projects', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-projects'] });
      router.back();
      Alert.alert('Success', 'Project deleted successfully');
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      name: name.trim(),
      description: description.trim(),
      status,
      progress: parseInt(progress) || 0,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project?',
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
      <DashboardLayout menuItems={menuItems} user={user} onLogout={handleLogout}>
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

  if (!project) {
    return (
      <DashboardLayout menuItems={menuItems} user={user} onLogout={handleLogout}>
        <View style={styles.container}>
          <LinearGradient
            colors={['#0f172a', '#020617', '#000000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.backgroundGradient}
          />
          <View style={styles.loadingContainer}>
            <Text style={styles.emptyText}>Project not found</Text>
          </View>
        </View>
      </DashboardLayout>
    );
  }

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':
        return [styles.statusBadge, styles.statusBadgeActive];
      case 'completed':
        return [styles.statusBadge, styles.statusBadgeCompleted];
      case 'on-hold':
        return [styles.statusBadge, styles.statusBadgeOnHold];
      case 'cancelled':
        return [styles.statusBadge, styles.statusBadgeCancelled];
      default:
        return [styles.statusBadge, styles.statusBadgeActive];
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status) {
      case 'active':
        return [styles.statusText, styles.statusTextActive];
      case 'completed':
        return [styles.statusText, styles.statusTextCompleted];
      case 'on-hold':
        return [styles.statusText, styles.statusTextOnHold];
      case 'cancelled':
        return [styles.statusText, styles.statusTextCancelled];
      default:
        return [styles.statusText, styles.statusTextActive];
    }
  };

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
                    placeholder="Project name"
                    placeholderTextColor="#718096"
                  />
                ) : (
                  <Text style={styles.title}>
                    {project.name || project.title || 'Project'}
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

            {/* Status */}
            <View style={styles.card}>
              <Text style={styles.label}>Status</Text>
              {isEditing ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  {(['active', 'completed', 'on-hold', 'cancelled'] as const).map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => setStatus(s)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={status === s ? ['#4299e1', '#667eea'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 8,
                        }}
                      >
                        <Text style={[styles.value, { fontSize: 14 }]}>
                          {s === 'active' ? 'Active' : s === 'completed' ? 'Completed' : s === 'on-hold' ? 'On Hold' : 'Cancelled'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={getStatusBadgeStyle(project.status || 'active')}>
                  <Text style={getStatusTextStyle(project.status || 'active')}>
                    {project.status === 'active' ? 'Active' : 
                     project.status === 'completed' ? 'Completed' : 
                     project.status === 'on-hold' ? 'On Hold' : 
                     project.status === 'cancelled' ? 'Cancelled' : 'Unknown'}
                  </Text>
                </View>
              )}
            </View>

            {/* Description */}
            <View style={styles.card}>
              <Text style={styles.label}>Description</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Project description"
                  placeholderTextColor="#718096"
                  multiline
                />
              ) : (
                <Text style={styles.valueText}>
                  {project.description || 'No description'}
                </Text>
              )}
            </View>

            {/* Progress */}
            {project.progress !== undefined && (
              <View style={styles.card}>
                <Text style={styles.label}>Progress</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={progress}
                    onChangeText={setProgress}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor="#718096"
                  />
                ) : (
                  <>
                    <Text style={styles.value}>{project.progress}%</Text>
                    <View style={styles.progressBar}>
                      <LinearGradient
                        colors={['#4299e1', '#667eea']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressFill, { width: `${project.progress}%` }]}
                      />
                    </View>
                  </>
                )}
              </View>
            )}

            {/* Client ID */}
            {project.clientId && (
              <View style={styles.card}>
                <Text style={styles.label}>Client ID</Text>
                <Text style={styles.value}>{project.clientId}</Text>
              </View>
            )}

            {/* Client */}
            {project.client && (
              <View style={styles.card}>
                <Text style={styles.label}>Client</Text>
                <Text style={styles.value}>{project.client}</Text>
              </View>
            )}

            {/* Created At */}
            {project.createdAt && (
              <View style={styles.card}>
                <Text style={styles.label}>Created At</Text>
                <Text style={styles.valueText}>
                  {typeof project.createdAt === 'string'
                    ? project.createdAt
                    : project.createdAt?.toDate?.()?.toLocaleString('en-US') || 'Unknown'}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </DashboardLayout>
  );
}
