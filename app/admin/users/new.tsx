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
    shadowColor: '#ff9700',
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

export default function NewUserScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();
  const { clearSession } = useSessionStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await createDocument('users', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      Alert.alert('Success', 'User created successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to create user');
    },
  });

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Password is required');
      return;
    }

    // UID oluştur (basit bir yöntem, production'da daha güvenli olmalı)
    const uid = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const userData: any = {
      uid,
      name: name.trim(),
      displayName: name.trim(),
      email: email.toLowerCase().trim(),
      password: password.trim(), // Production'da hash kullanılmalı
      role,
      isActive: true,
      loginAttempts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bio: '',
    };

    if (company.trim()) {
      userData.company = company.trim();
    }

    createMutation.mutate(userData);
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
              <Text style={styles.title}>New User</Text>
            </View>

            {/* Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="User name"
                placeholderTextColor="#718096"
              />
            </View>

            {/* Email */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com"
                placeholderTextColor="#718096"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#718096"
                secureTextEntry
              />
              <Text style={styles.helperText}>
                Password should be hashed in production
              </Text>
            </View>

            {/* Role */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Role *</Text>
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
            </View>

            {/* Company */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Company (Optional)</Text>
              <TextInput
                style={styles.input}
                value={company}
                onChangeText={setCompany}
                placeholder="Company name"
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
                  colors={['#ff9700', '#ff6b35']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    {createMutation.isPending ? 'Creating...' : 'Create User'}
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
