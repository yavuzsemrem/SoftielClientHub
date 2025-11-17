import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDocument } from '@/firebase/firestore';
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
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 8,
    fontWeight: '500',
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
  statusSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    color: '#718096',
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 8,
    gap: 12,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4299e1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSecondary: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonTextSecondary: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
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

export default function NewProjectScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();
  const { clearSession } = useSessionStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
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

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await createDocument('projects', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-projects'] });
      Alert.alert('Success', 'Project created successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to create project');
    },
  });

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Project name is required');
      return;
    }

    const projectData: any = {
      name: name.trim(),
      status,
      progress: parseInt(progress) || 0,
      dueDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    if (description.trim()) {
      projectData.description = description.trim();
    }

    if (clientId.trim()) {
      projectData.clientId = clientId.trim();
    }

    createMutation.mutate(projectData);
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

  if (authLoading) {
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
              <Text style={styles.title}>New Project</Text>
            </View>

            {/* Project Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Project Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Project name"
                placeholderTextColor="#718096"
              />
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Project description"
                placeholderTextColor="#718096"
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Client ID */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Client ID (Optional)</Text>
              <TextInput
                style={styles.input}
                value={clientId}
                onChangeText={setClientId}
                placeholder="User UID"
                placeholderTextColor="#718096"
              />
              <Text style={styles.helperText}>
                Enter the user's UID for Client Hub projects
              </Text>
            </View>

            {/* Status */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusSelector}>
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
                      style={styles.statusButton}
                    >
                      <Text style={[styles.statusButtonText, { color: status === s ? '#ffffff' : '#a0aec0' }]}>
                        {s === 'active' ? 'Active' : s === 'completed' ? 'Completed' : s === 'on-hold' ? 'On Hold' : 'Cancelled'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Progress */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Progress (%)</Text>
              <TextInput
                style={styles.input}
                value={progress}
                onChangeText={setProgress}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#718096"
              />
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleCreate}
                disabled={createMutation.isPending}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#4299e1', '#667eea']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    {createMutation.isPending ? 'Creating...' : 'Create Project'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <View style={styles.buttonSecondary}>
                  <Text style={styles.buttonTextSecondary}>Cancel</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </DashboardLayout>
  );
}
