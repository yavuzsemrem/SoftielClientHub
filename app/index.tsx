import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getCurrentUser } from '@/firebase/auth';
import { useSessionStore } from '@/stores/sessionStore';

export default function Index() {
  const router = useRouter();
  const { setUser } = useSessionStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          console.log('Index: User found, role:', user.role);
          setUser(user);
          // Kısa bir gecikme ile yönlendirme (state'in güncellenmesi için)
          setTimeout(() => {
            if (user.role === 'admin') {
              router.replace('/admin/dashboard');
            } else {
              router.replace('/dashboard');
            }
          }, 100);
        } else {
          console.log('Index: No user found, redirecting to login');
          router.replace('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.replace('/login');
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0056b8" />
      <Text style={styles.text}>Yükleniyor...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fb',
  },
  text: {
    marginTop: 16,
    color: '#1f1f1f',
    fontSize: 16,
  },
});
