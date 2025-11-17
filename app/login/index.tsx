import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { login, resetPassword } from '@/firebase/auth';
import { useSessionStore } from '@/stores/sessionStore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardView: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  loginCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glassmorphism effect
    borderRadius: 20,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)', // Darker border for glass effect
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 110,
    height: 110,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#cbd5e0',
    marginBottom: 10,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 18,
    zIndex: 1,
  },
  input: {
    width: '100%',
    backgroundColor: '#1a202c',
    borderWidth: 0, // Border is handled by Animated.View
    borderRadius: 14,
    paddingHorizontal: 52,
    paddingVertical: 16,
    fontSize: 16,
    color: '#ffffff',
  },
  inputFocused: {
    // This will be handled by animated border
  },
  passwordToggle: {
    position: 'absolute',
    right: 18,
    top: 16,
    padding: 4,
    zIndex: 2,
  },
  loginButton: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 12,
    shadowColor: '#4299e1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 8,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  errorText: {
    color: '#fc8181',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 4,
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
});

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useSessionStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState('');

  // Animation values for the blur circles
  const scale1 = useRef(new Animated.Value(1)).current;
  const opacity1 = useRef(new Animated.Value(0.4)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const opacity2 = useRef(new Animated.Value(0.3)).current;

  // Animation values for input borders
  const emailBorderColor = useRef(new Animated.Value(0)).current;
  const passwordBorderColor = useRef(new Animated.Value(0)).current;

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

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Lütfen email ve şifre giriniz');
      return;
    }

    setError('');
    setIsLoading(true);
    
    try {
      const { user, error: loginError } = await login(email, password);
      
      if (loginError) {
        setError(loginError);
      } else if (user) {
        console.log('Login successful, user:', user);
        setUser(user);
        // Kısa bir gecikme ile yönlendirme (state'in güncellenmesi için)
        setTimeout(() => {
          if (user.role === 'admin') {
            console.log('Redirecting admin to admin dashboard');
            router.replace('/admin/dashboard');
          } else {
            console.log('Redirecting client to dashboard');
            router.replace('/dashboard');
          }
        }, 100);
      }
    } catch (err: any) {
      setError(err.message || 'Giriş yapılırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Hata', 'Lütfen email adresinizi giriniz');
      return;
    }

    const { error: resetError } = await resetPassword(email);
    if (resetError) {
      Alert.alert('Hata', resetError);
    } else {
      Alert.alert('Başarılı', 'Şifre sıfırlama linki email adresinize gönderildi');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Background gradient - Dark slate to black (Tailwind dark mode style) */}
        <LinearGradient
          colors={['#0f172a', '#020617', '#000000']} // slate-900 to slate-950 to black
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
            colors={['rgba(0, 86, 184, 0.6)', 'rgba(0, 61, 130, 0.4)', 'transparent']} // Softiel blue gradient with transparency
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
            colors={['rgba(66, 153, 225, 0.5)', 'rgba(0, 86, 184, 0.3)', 'transparent']} // Light to primary blue with transparency
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
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Login Card */}
            <View style={styles.loginCard}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.logoContainer}>
                  <Image
                    source={require('@/assets/images/client.webp')}
                    style={styles.logo}
                  />
                </View>
                <Text style={styles.title}>Secure Login</Text>
                <Text style={styles.subtitle}>
                  Sign in to access the Softiel Client Hub
                </Text>
              </View>

              {/* Form */}
              <View style={styles.formContainer}>
                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Username or Email</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color="#a0aec0"
                      style={styles.inputIcon}
                    />
                    <Animated.View
                      style={{
                        width: '100%',
                        borderWidth: 1,
                        borderRadius: 14,
                        borderColor: emailBorderColor.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['#4a5568', '#4299e1'], // Gray to blue
                        }),
                      }}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="username or email"
                        placeholderTextColor="#718096"
                        value={email}
                        onChangeText={(text) => {
                          setEmail(text);
                          setError('');
                        }}
                        onFocus={() => {
                          setEmailFocused(true);
                          Animated.timing(emailBorderColor, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: false,
                          }).start();
                        }}
                        onBlur={() => {
                          setEmailFocused(false);
                          Animated.timing(emailBorderColor, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: false,
                          }).start();
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect={false}
                        editable={!isLoading}
                      />
                    </Animated.View>
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#a0aec0"
                      style={styles.inputIcon}
                    />
                    <Animated.View
                      style={{
                        width: '100%',
                        borderWidth: 1,
                        borderRadius: 14,
                        borderColor: passwordBorderColor.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['#4a5568', '#4299e1'], // Gray to blue
                        }),
                      }}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        placeholderTextColor="#718096"
                        value={password}
                        onChangeText={(text) => {
                          setPassword(text);
                          setError('');
                        }}
                        onFocus={() => {
                          setPasswordFocused(true);
                          Animated.timing(passwordBorderColor, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: false,
                          }).start();
                        }}
                        onBlur={() => {
                          setPasswordFocused(false);
                          Animated.timing(passwordBorderColor, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: false,
                          }).start();
                        }}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoComplete="password"
                        autoCorrect={false}
                        editable={!isLoading}
                      />
                    </Animated.View>
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color="#a0aec0"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Error Message */}
                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : null}

                {/* Login Button */}
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isLoading || !email || !password}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#4299e1', '#667eea']} // Light blue to purple-blue gradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.loginButton,
                      (isLoading || !email || !password) && styles.loginButtonDisabled,
                    ]}
                  >
                    <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                    <Text style={styles.loginButtonText}>
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  © 2024 Softiel. All rights reserved.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}