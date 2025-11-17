import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet, ActivityIndicator, Animated, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useAllProjects } from '@/hooks/useAllProjects';
import { useAllUsers } from '@/hooks/useAllUsers';
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
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
  },
  contentWeb: {
    padding: 24,
    paddingTop: 24,
    width: '100%',
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
  heroSection: {
    marginBottom: 48,
    alignItems: 'center',
    paddingTop: 48,
  },
  adminPanelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  adminPanelBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  welcomeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    marginBottom: 32,
    marginTop: 0,
    alignContent: 'center',
  },
  welcomeText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  welcomeGradient: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  heroDescription: {
    fontSize: 20,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 30,
    maxWidth: 900,
    marginBottom: 40,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  dateTimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  dateTimeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 24,
    flex: 1,
    minWidth: 160,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
    overflow: 'hidden',
  },
  statCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statLabel: {
    color: '#cbd5e1',
    fontSize: 13,
    marginBottom: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#4299e1',
    letterSpacing: -0.5,
  },
  statValueSecondary: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ff9700',
    letterSpacing: -0.5,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 48,
    marginBottom: 16,
    alignContent: 'center',
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 40,
    fontWeight: '700',
    color: '#ffffff',
  },
  sectionTitleGradient: {
    fontSize: 40,
    fontWeight: '700',
  },
  sectionDescription: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 48,
    maxWidth: 600,
    lineHeight: 24,
  },
  quickActions: {
    alignItems: 'stretch',
  },
  actionsContainer: {
    gap: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  actionItemLeft: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionItemContent: {
    flex: 1,
  },
  actionItemTitle: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  actionItemDescription: {
    color: '#a0aec0',
    fontSize: 13,
  },
  actionItemArrow: {
    marginLeft: 12,
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
  projectType: {
    fontSize: 14,
    color: '#4299e1',
    fontWeight: '600',
    backgroundColor: 'rgba(66, 153, 225, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  projectStatus: {
    fontSize: 14,
    color: '#a0aec0',
    fontWeight: '500',
    marginTop: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
    textTransform: 'capitalize',
    letterSpacing: 0.5,
  },
  projectClientId: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { projects, isLoading: projectsLoading, refetch: refetchProjects } = useAllProjects();
  const { users, isLoading: usersLoading } = useAllUsers();
  const { clearSession } = useSessionStore();
  const { width, height } = useWindowDimensions();

  // Responsive breakpoints - Web için ayrı, mobil için mevcut
  const isWeb = Platform.OS === 'web';
  const isIOS = Platform.OS === 'ios';
  const isAndroid = Platform.OS === 'android';
  
  // Web için breakpoint'ler
  const isWebMobile = isWeb && width < 768;
  const isWebTablet = isWeb && width >= 768 && width < 1024;
  const isWebDesktop = isWeb && width >= 1024;
  
  // Mobil için breakpoint'ler (iOS/Android)
  const isMobile = !isWeb && width < 768;
  const isTablet = !isWeb && width >= 768 && width < 1024;
  const isDesktop = !isWeb && width >= 1024;
  
  // JSX'te kullanmak için - Web ve mobil için birleşik
  const isMobileView = isWeb ? isWebMobile : isMobile;
  const isTabletView = isWeb ? isWebTablet : isTablet;

  // Responsive values - Web ve mobil için ayrı
  const contentPadding = isWeb 
    ? (isWebMobile ? 16 : isWebTablet ? 20 : 24)
    : (isMobile ? 16 : isTablet ? 20 : 24);
  const statsGap = isWeb
    ? (isWebMobile ? 12 : isWebTablet ? 16 : 20)
    : (isMobile ? 12 : isTablet ? 16 : 20);
  
  const responsiveValues = useMemo(() => {
    // Web için değerler
    if (isWeb) {
      return {
        // Padding
        contentPadding: isWebMobile ? 16 : isWebTablet ? 20 : 24,
        cardPadding: isWebMobile ? 16 : isWebTablet ? 20 : 24,
        
        // Font sizes
        welcomeFontSize: isWebMobile ? 36 : isWebTablet ? 48 : 64,
        heroDescriptionFontSize: isWebMobile ? 16 : isWebTablet ? 18 : 20,
        heroDescriptionMaxWidth: isWebMobile ? width - 32 : isWebTablet ? 700 : 900,
        sectionTitleFontSize: isWebMobile ? 24 : isWebTablet ? 28 : 40,
        sectionDescriptionFontSize: isWebMobile ? 14 : isWebTablet ? 15 : 16,
        statValueFontSize: isWebMobile ? 28 : isWebTablet ? 32 : 36,
        statLabelFontSize: isWebMobile ? 12 : isWebTablet ? 12.5 : 13,
        statCardIconSize: isWebMobile ? 48 : isWebTablet ? 52 : 56,
        statCardIconInnerSize: isWebMobile ? 24 : isWebTablet ? 26 : 28,
        
        // Spacing
        heroPaddingTop: isWebMobile ? 24 : isWebTablet ? 36 : 48,
        heroMarginBottom: isWebMobile ? 32 : isWebTablet ? 40 : 48,
        sectionMarginTop: isWebMobile ? 32 : isWebTablet ? 40 : 48,
        sectionMarginBottom: isWebMobile ? 32 : isWebTablet ? 40 : 48,
        cardGap: isWebMobile ? 12 : isWebTablet ? 16 : 20,
        statsGap: isWebMobile ? 12 : isWebTablet ? 16 : 20,
        
        // Card dimensions - Web'de 4 sütun, tablet'te 2 sütun, mobile'da 2 sütun
        statCardMinWidth: isWebMobile ? 0 : isWebTablet ? 200 : 160,
        statCardFlex: isWebMobile ? 0 : isWebTablet ? 0 : 1,
        statCardWidth: isWebMobile ? Math.floor((width - (contentPadding * 2) - statsGap) / 2) : (isWebTablet ? Math.floor((width - (contentPadding * 2) - statsGap) / 2) : undefined),
        statCardMaxWidth: isWebMobile ? Math.floor((width - (contentPadding * 2) - statsGap) / 2) : (isWebTablet ? Math.floor((width - (contentPadding * 2) - statsGap) / 2) : undefined),
        statCardFlexBasis: isWebMobile ? Math.floor((width - (contentPadding * 2) - statsGap) / 2) : (isWebTablet ? Math.floor((width - (contentPadding * 2) - statsGap) / 2) : undefined),
        
        // Max widths
        contentMaxWidth: isWebMobile ? width : isWebTablet ? 1200 : 1400,
        actionsMaxWidth: isWebMobile ? width : isWebTablet ? 700 : 800,
        
        // Date time
        dateTimeGap: isWebMobile ? 8 : isWebTablet ? 12 : 16,
        dateTimePadding: isWebMobile ? 12 : isWebTablet ? 14 : 16,
        
        // Action items
        actionItemPadding: isWebMobile ? 12 : isWebTablet ? 14 : 16,
        actionItemIconSize: isWebMobile ? 48 : isWebTablet ? 52 : 56,
        actionItemIconInnerSize: isWebMobile ? 24 : isWebTablet ? 26 : 28,
        actionItemTitleSize: isWebMobile ? 16 : isWebTablet ? 17 : 18,
        actionItemDescSize: isWebMobile ? 13 : isWebTablet ? 13.5 : 14,
      };
    }
    
    // Mobil için mevcut değerler (iOS/Android)
    return {
      // Padding
      contentPadding: contentPadding,
      cardPadding: isMobile ? 16 : isTablet ? 20 : 24,
      
      // Font sizes
      welcomeFontSize: isMobile ? 36 : isTablet ? 48 : 64,
      heroDescriptionFontSize: isMobile ? 16 : isTablet ? 18 : 20,
      heroDescriptionMaxWidth: isMobile ? width - 32 : isTablet ? 700 : 900,
      sectionTitleFontSize: isMobile ? 24 : isTablet ? 28 : 40,
      sectionDescriptionFontSize: isMobile ? 14 : isTablet ? 15 : 16,
      statValueFontSize: isMobile ? 28 : isTablet ? 32 : 36,
      statLabelFontSize: isMobile ? 12 : isTablet ? 12.5 : 13,
      statCardIconSize: isMobile ? 48 : isTablet ? 52 : 56,
      statCardIconInnerSize: isMobile ? 24 : isTablet ? 26 : 28,
      
      // Spacing
      heroPaddingTop: isMobile ? 24 : isTablet ? 36 : 48,
      heroMarginBottom: isMobile ? 32 : isTablet ? 40 : 48,
      sectionMarginTop: isMobile ? 32 : isTablet ? 40 : 48,
      sectionMarginBottom: isMobile ? 32 : isTablet ? 40 : 48,
      cardGap: isMobile ? 12 : isTablet ? 16 : 20,
      statsGap: statsGap,
      
      // Card dimensions
      statCardMinWidth: isMobile ? 0 : isTablet ? 200 : 160,
      statCardFlex: isMobile ? 0 : isTablet ? 0 : 1,
      statCardWidth: isMobile ? Math.floor((width - (contentPadding * 2) - statsGap) / 2) : (isTablet ? Math.floor((width - (contentPadding * 2) - statsGap) / 2) : undefined),
      statCardMaxWidth: isMobile ? Math.floor((width - (contentPadding * 2) - statsGap) / 2) : (isTablet ? Math.floor((width - (contentPadding * 2) - statsGap) / 2) : undefined),
      statCardFlexBasis: isMobile ? Math.floor((width - (contentPadding * 2) - statsGap) / 2) : (isTablet ? Math.floor((width - (contentPadding * 2) - statsGap) / 2) : undefined),
      
      // Max widths
      contentMaxWidth: isMobile ? width : isTablet ? 1200 : 1400,
      actionsMaxWidth: isMobile ? width : isTablet ? 700 : 800,
      
      // Date time
      dateTimeGap: isMobile ? 8 : isTablet ? 12 : 16,
      dateTimePadding: isMobile ? 12 : isTablet ? 14 : 16,
      
      // Action items
      actionItemPadding: isMobile ? 12 : isTablet ? 14 : 16,
      actionItemIconSize: isMobile ? 48 : isTablet ? 52 : 56,
      actionItemIconInnerSize: isMobile ? 24 : isTablet ? 26 : 28,
      actionItemTitleSize: isMobile ? 16 : isTablet ? 17 : 18,
      actionItemDescSize: isMobile ? 13 : isTablet ? 13.5 : 14,
    };
  }, [isWeb, isWebMobile, isWebTablet, isWebDesktop, isMobile, isTablet, isDesktop, width, contentPadding, statsGap]);

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

  const activeProjects = projects.filter((p: any) => p.status === 'active' || !p.status);
  const clientUsers = users.filter((u: any) => u.role === 'client');
  const adminUsers = users.filter((u: any) => u.role === 'admin');

  const getStatusConfig = (status: string) => {
    const statusLower = (status || 'unknown').toLowerCase();
    switch (statusLower) {
      case 'active':
        return {
          colors: ['rgba(34, 197, 94, 0.25)', 'rgba(34, 197, 94, 0.1)'] as const,
          textColor: '#22c55e',
          borderColor: 'rgba(34, 197, 94, 0.4)',
          icon: 'checkmark-circle' as const,
        };
      case 'completed':
      case 'done':
        return {
          colors: ['rgba(66, 153, 225, 0.25)', 'rgba(66, 153, 225, 0.1)'] as const,
          textColor: '#4299e1',
          borderColor: 'rgba(66, 153, 225, 0.4)',
          icon: 'checkmark-done-circle' as const,
        };
      case 'pending':
      case 'in-progress':
        return {
          colors: ['rgba(255, 151, 0, 0.25)', 'rgba(255, 151, 0, 0.1)'] as const,
          textColor: '#ff9700',
          borderColor: 'rgba(255, 151, 0, 0.4)',
          icon: 'time-outline' as const,
        };
      case 'cancelled':
      case 'canceled':
        return {
          colors: ['rgba(239, 68, 68, 0.25)', 'rgba(239, 68, 68, 0.1)'] as const,
          textColor: '#ef4444',
          borderColor: 'rgba(239, 68, 68, 0.4)',
          icon: 'close-circle' as const,
        };
      default:
        return {
          colors: ['rgba(160, 174, 192, 0.25)', 'rgba(160, 174, 192, 0.1)'] as const,
          textColor: '#a0aec0',
          borderColor: 'rgba(160, 174, 192, 0.4)',
          icon: 'help-circle-outline' as const,
        };
    }
  };

  const menuItems = [
    { label: 'Dashboard', icon: 'home-outline', path: '/admin/dashboard' },
    { label: 'Projects', icon: 'folder-outline', path: '/admin/projects' },
    { label: 'Users', icon: 'people-outline', path: '/admin/users' },
  ];

  return (
    <DashboardLayout menuItems={menuItems} user={user} onLogout={handleLogout}>
      <View 
        style={[
          styles.container,
          Platform.OS === 'android' && isMobileView && { zIndex: 10 },
          isWeb && { 
            width: '100%', 
            height: '100%', 
            margin: 0, 
            padding: 0,
            position: 'relative',
            overflow: 'hidden',
            maxWidth: '100%'
          }
        ]}
        pointerEvents="auto"
      >
        {/* Background gradient - Dark slate to black (Tailwind dark mode style) */}
        <LinearGradient
          colors={['#0f172a', '#020617', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.backgroundGradient,
            (Platform.OS === 'android' || isWeb) && { pointerEvents: 'none' }
          ]}
        />

        {/* Animated blur circles - Only show on mobile (iOS/Android), not on web */}
        {!isWeb && (
          <>
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
                Platform.OS === 'android' && { pointerEvents: 'none' }
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
                Platform.OS === 'android' && { pointerEvents: 'none' }
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
          </>
        )}

        <ScrollView
          style={[
            styles.container,
            Platform.OS === 'android' && isMobileView && { zIndex: 10 },
            isWeb && { 
              width: '100%', 
              height: '100%',
              margin: 0, 
              padding: 0,
              flex: 1,
              position: 'relative',
              zIndex: 10,
              maxWidth: '100%'
            }
          ]}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: (isMobileView || isTabletView) ? responsiveValues.contentPadding + 32 : responsiveValues.contentPadding
            },
            isWeb && { 
              width: '100%', 
              margin: 0, 
              padding: 0,
              minHeight: '100%',
              flexGrow: 1,
              maxWidth: '100%',
              paddingBottom: (isWebMobile || isWebTablet) ? responsiveValues.contentPadding + 32 : responsiveValues.contentPadding
            }
          ]}
          nestedScrollEnabled={true}
          scrollEnabled={true}
          bounces={!isWeb}
          pointerEvents="auto"
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={projectsLoading || usersLoading}
              onRefresh={() => {
                refetchProjects();
              }}
              tintColor="#4299e1"
            />
          }
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={[
            isWeb ? styles.contentWeb : styles.content,
            { 
              padding: responsiveValues.contentPadding, 
              maxWidth: isWeb && isWebMobile ? '100%' : (isWeb && isWebTablet ? '100%' : responsiveValues.contentMaxWidth),
              alignSelf: isWebDesktop ? 'center' : (isWeb ? 'stretch' : 'center'),
              width: '100%',
              paddingTop: isIOS ? responsiveValues.contentPadding + 8 : responsiveValues.contentPadding,
              paddingBottom: isAndroid ? responsiveValues.contentPadding + 16 : responsiveValues.contentPadding,
            }
          ]}
          pointerEvents="auto"
          >
            {/* Hero Section */}
            <View style={[styles.heroSection, { 
              paddingTop: responsiveValues.heroPaddingTop,
              marginBottom: responsiveValues.heroMarginBottom 
            }]}>
              {/* Admin Panel Badge */}
              <View style={styles.adminPanelBadge}>
                <Ionicons name="bar-chart-outline" size={isMobileView ? 16 : 18} color="#4299e1" />
                <Text style={styles.adminPanelBadgeText}>Admin Panel</Text>
              </View>

              {/* Welcome Title */}
              <View style={styles.welcomeTitleContainer}>
                <Text style={[styles.welcomeText, { fontSize: responsiveValues.welcomeFontSize }]}>Welcome, </Text>
                <GradientText
                  colors={['#06b6d4', '#1d4ed8']}
                  style={[styles.welcomeGradient, { fontSize: responsiveValues.welcomeFontSize }]}
                >
                  {user?.name || user?.displayName || 'Admin'}
                </GradientText>
              </View>

              {/* Description */}
              <Text style={[styles.heroDescription, { 
                fontSize: responsiveValues.heroDescriptionFontSize,
                maxWidth: responsiveValues.heroDescriptionMaxWidth 
              }]}>
                Welcome to the Softiel Client Hub management panel. From here, you can manage all projects, track client progress, monitor project statistics, and optimize your workflow.
              </Text>

              {/* Date and Time Cards */}
              <View style={[styles.dateTimeContainer, { gap: responsiveValues.dateTimeGap }]}>
                <View style={[styles.dateTimeCard, { 
                  paddingHorizontal: responsiveValues.dateTimePadding,
                  paddingVertical: isMobileView ? 8 : responsiveValues.dateTimePadding 
                }]}>
                  <Ionicons name="calendar-outline" size={isMobileView ? 14 : 16} color="#4299e1" />
                  <Text style={[styles.dateTimeText, { fontSize: isMobileView ? 12 : 14 }]}>
                    {new Date().toLocaleDateString('en-US', { 
                      day: 'numeric', 
                      month: isMobileView ? 'short' : 'long', 
                      year: 'numeric' 
                    })}
                  </Text>
                </View>
                <View style={[styles.dateTimeCard, { 
                  paddingHorizontal: responsiveValues.dateTimePadding,
                  paddingVertical: isMobileView ? 8 : responsiveValues.dateTimePadding 
                }]}>
                  <Ionicons name="time-outline" size={isMobileView ? 14 : 16} color="#4299e1" />
                  <Text style={[styles.dateTimeText, { fontSize: isMobileView ? 12 : 14 }]}>
                    {new Date().toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false 
                    })}
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats Cards */}
            <View style={[
              styles.statsContainer, 
              { gap: responsiveValues.statsGap },
              (isMobileView || isTabletView) && { 
                justifyContent: 'center',
                alignItems: 'flex-start'
              }
            ]}>
              <TouchableOpacity
                style={[
                  (isMobileView || isTabletView) ? {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 24,
                    borderWidth: 1.5,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.4,
                    shadowRadius: 24,
                    elevation: 12,
                    overflow: 'hidden',
                    padding: responsiveValues.cardPadding,
                    flex: 0,
                    flexBasis: responsiveValues.statCardFlexBasis,
                    width: responsiveValues.statCardWidth,
                    maxWidth: responsiveValues.statCardMaxWidth,
                    minWidth: 0,
                    flexShrink: 0,
                    flexGrow: 0
                  } : [
                    styles.statCard,
                    {
                      padding: responsiveValues.cardPadding,
                      flex: responsiveValues.statCardFlex,
                      flexBasis: responsiveValues.statCardFlexBasis,
                      minWidth: responsiveValues.statCardMinWidth,
                      width: responsiveValues.statCardWidth,
                      maxWidth: responsiveValues.statCardMaxWidth
                    }
                  ]
                ]}
                onPress={() => router.push('/admin/projects')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(66, 153, 225, 0.2)', 'rgba(66, 153, 225, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.statCardIcon, { 
                    width: responsiveValues.statCardIconSize,
                    height: responsiveValues.statCardIconSize 
                  }]}
                >
                  <Ionicons name="folder-outline" size={responsiveValues.statCardIconInnerSize} color="#4299e1" />
                </LinearGradient>
                <Text style={[styles.statLabel, { fontSize: responsiveValues.statLabelFontSize }]}>Total Projects</Text>
                <Text style={[styles.statValue, { fontSize: responsiveValues.statValueFontSize }]}>{projects.length}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  (isMobileView || isTabletView) ? {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 24,
                    borderWidth: 1.5,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.4,
                    shadowRadius: 24,
                    elevation: 12,
                    overflow: 'hidden',
                    padding: responsiveValues.cardPadding,
                    flex: 0,
                    flexBasis: responsiveValues.statCardFlexBasis,
                    width: responsiveValues.statCardWidth,
                    maxWidth: responsiveValues.statCardMaxWidth,
                    minWidth: 0,
                    flexShrink: 0,
                    flexGrow: 0
                  } : [
                    styles.statCard,
                    {
                      padding: responsiveValues.cardPadding,
                      flex: responsiveValues.statCardFlex,
                      flexBasis: responsiveValues.statCardFlexBasis,
                      minWidth: responsiveValues.statCardMinWidth,
                      width: responsiveValues.statCardWidth,
                      maxWidth: responsiveValues.statCardMaxWidth
                    }
                  ]
                ]}
                onPress={() => router.push('/admin/projects')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(34, 197, 94, 0.2)', 'rgba(34, 197, 94, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.statCardIcon, { 
                    width: responsiveValues.statCardIconSize,
                    height: responsiveValues.statCardIconSize 
                  }]}
                >
                  <Ionicons name="checkmark-circle-outline" size={responsiveValues.statCardIconInnerSize} color="#22c55e" />
                </LinearGradient>
                <Text style={[styles.statLabel, { fontSize: responsiveValues.statLabelFontSize }]}>Active Projects</Text>
                <Text style={[styles.statValue, { fontSize: responsiveValues.statValueFontSize }]}>{activeProjects.length}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  (isMobileView || isTabletView) ? {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 24,
                    borderWidth: 1.5,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.4,
                    shadowRadius: 24,
                    elevation: 12,
                    overflow: 'hidden',
                    padding: responsiveValues.cardPadding,
                    flex: 0,
                    flexBasis: responsiveValues.statCardFlexBasis,
                    width: responsiveValues.statCardWidth,
                    maxWidth: responsiveValues.statCardMaxWidth,
                    minWidth: 0,
                    flexShrink: 0,
                    flexGrow: 0
                  } : [
                    styles.statCard,
                    {
                      padding: responsiveValues.cardPadding,
                      flex: responsiveValues.statCardFlex,
                      flexBasis: responsiveValues.statCardFlexBasis,
                      minWidth: responsiveValues.statCardMinWidth,
                      width: responsiveValues.statCardWidth,
                      maxWidth: responsiveValues.statCardMaxWidth
                    }
                  ]
                ]}
                onPress={() => router.push('/admin/users')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(255, 151, 0, 0.2)', 'rgba(255, 151, 0, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.statCardIcon, { 
                    width: responsiveValues.statCardIconSize,
                    height: responsiveValues.statCardIconSize 
                  }]}
                >
                  <Ionicons name="people-outline" size={responsiveValues.statCardIconInnerSize} color="#ff9700" />
                </LinearGradient>
                <Text style={[styles.statLabel, { fontSize: responsiveValues.statLabelFontSize }]}>Clients</Text>
                <Text style={[styles.statValueSecondary, { fontSize: responsiveValues.statValueFontSize }]}>{clientUsers.length}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  (isMobileView || isTabletView) ? {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 24,
                    borderWidth: 1.5,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.4,
                    shadowRadius: 24,
                    elevation: 12,
                    overflow: 'hidden',
                    padding: responsiveValues.cardPadding,
                    flex: 0,
                    flexBasis: responsiveValues.statCardFlexBasis,
                    width: responsiveValues.statCardWidth,
                    maxWidth: responsiveValues.statCardMaxWidth,
                    minWidth: 0,
                    flexShrink: 0,
                    flexGrow: 0
                  } : [
                    styles.statCard,
                    {
                      padding: responsiveValues.cardPadding,
                      flex: responsiveValues.statCardFlex,
                      flexBasis: responsiveValues.statCardFlexBasis,
                      minWidth: responsiveValues.statCardMinWidth,
                      width: responsiveValues.statCardWidth,
                      maxWidth: responsiveValues.statCardMaxWidth
                    }
                  ]
                ]}
                onPress={() => router.push('/admin/users')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(66, 153, 225, 0.2)', 'rgba(66, 153, 225, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.statCardIcon, { 
                    width: responsiveValues.statCardIconSize,
                    height: responsiveValues.statCardIconSize 
                  }]}
                >
                  <Ionicons name="shield-outline" size={responsiveValues.statCardIconInnerSize} color="#4299e1" />
                </LinearGradient>
                <Text style={[styles.statLabel, { fontSize: responsiveValues.statLabelFontSize }]}>Admins</Text>
                <Text style={[styles.statValueSecondary, { fontSize: responsiveValues.statValueFontSize }]}>{adminUsers.length}</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <View style={[styles.sectionTitleContainer, { marginTop: responsiveValues.sectionMarginTop }]}>
                <Text style={[styles.sectionTitle, { fontSize: responsiveValues.sectionTitleFontSize }]}>Quick </Text>
                <GradientText
                  colors={['#06b6d4', '#1d4ed8']}
                  style={[styles.sectionTitleGradient, { fontSize: responsiveValues.sectionTitleFontSize }]}
                >
                  Actions
                </GradientText>
              </View>
              <Text style={[styles.sectionDescription, { 
                fontSize: responsiveValues.sectionDescriptionFontSize,
                marginBottom: responsiveValues.sectionMarginBottom 
              }]}>
                Access frequently used actions and shortcuts.
              </Text>
              <View style={[styles.actionsContainer, { gap: responsiveValues.cardGap }]}>
                <TouchableOpacity
                  style={[styles.actionItem, { padding: responsiveValues.actionItemPadding }]}
                  onPress={() => router.push('/admin/projects/new')}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#4299e1', '#667eea']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.actionItemLeft, { 
                      width: responsiveValues.actionItemIconSize,
                      height: responsiveValues.actionItemIconSize 
                    }]}
                  >
                    <Ionicons name="add-circle" size={responsiveValues.actionItemIconInnerSize} color="#ffffff" />
                  </LinearGradient>
                  <View style={styles.actionItemContent}>
                    <Text style={[styles.actionItemTitle, { fontSize: responsiveValues.actionItemTitleSize }]}>New Project</Text>
                    <Text style={[styles.actionItemDescription, { fontSize: responsiveValues.actionItemDescSize }]}>Create a new project for your clients</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={isMobileView ? 18 : 20} color="#a0aec0" style={styles.actionItemArrow} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionItem, { padding: responsiveValues.actionItemPadding }]}
                  onPress={() => router.push('/admin/users/new')}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#ff9700', '#ff6b35']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.actionItemLeft, { 
                      width: responsiveValues.actionItemIconSize,
                      height: responsiveValues.actionItemIconSize 
                    }]}
                  >
                    <Ionicons name="person-add" size={responsiveValues.actionItemIconInnerSize} color="#ffffff" />
                  </LinearGradient>
                  <View style={styles.actionItemContent}>
                    <Text style={[styles.actionItemTitle, { fontSize: responsiveValues.actionItemTitleSize }]}>New User</Text>
                    <Text style={[styles.actionItemDescription, { fontSize: responsiveValues.actionItemDescSize }]}>Add a new client or admin user</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={isMobileView ? 18 : 20} color="#a0aec0" style={styles.actionItemArrow} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionItem, { padding: responsiveValues.actionItemPadding }]}
                  onPress={() => router.push('/admin/projects')}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(66, 153, 225, 0.3)', 'rgba(66, 153, 225, 0.2)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.actionItemLeft, { 
                      width: responsiveValues.actionItemIconSize,
                      height: responsiveValues.actionItemIconSize 
                    }]}
                  >
                    <Ionicons name="folder" size={responsiveValues.actionItemIconInnerSize} color="#4299e1" />
                  </LinearGradient>
                  <View style={styles.actionItemContent}>
                    <Text style={[styles.actionItemTitle, { fontSize: responsiveValues.actionItemTitleSize }]}>All Projects</Text>
                    <Text style={[styles.actionItemDescription, { fontSize: responsiveValues.actionItemDescSize }]}>View and manage all projects</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={isMobileView ? 18 : 20} color="#a0aec0" style={styles.actionItemArrow} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionItem, { padding: responsiveValues.actionItemPadding }]}
                  onPress={() => router.push('/admin/users')}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(255, 151, 0, 0.3)', 'rgba(255, 151, 0, 0.2)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.actionItemLeft, { 
                      width: responsiveValues.actionItemIconSize,
                      height: responsiveValues.actionItemIconSize 
                    }]}
                  >
                    <Ionicons name="people" size={responsiveValues.actionItemIconInnerSize} color="#ff9700" />
                  </LinearGradient>
                  <View style={styles.actionItemContent}>
                    <Text style={[styles.actionItemTitle, { fontSize: responsiveValues.actionItemTitleSize }]}>All Users</Text>
                    <Text style={[styles.actionItemDescription, { fontSize: responsiveValues.actionItemDescSize }]}>Manage clients and admins</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={isMobileView ? 18 : 20} color="#a0aec0" style={styles.actionItemArrow} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Projects */}
            <View style={{ marginTop: responsiveValues.sectionMarginTop, marginBottom: responsiveValues.sectionMarginBottom }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={[styles.sectionTitle, { fontSize: responsiveValues.sectionTitleFontSize }]}>Recent </Text>
                  <GradientText
                    colors={['#06b6d4', '#1d4ed8']}
                    style={[styles.sectionTitleGradient, { fontSize: responsiveValues.sectionTitleFontSize }]}
                  >
                    Projects
                  </GradientText>
                </View>
              </View>
              <Text style={[styles.sectionDescription, { 
                fontSize: responsiveValues.sectionDescriptionFontSize,
                marginBottom: responsiveValues.sectionMarginBottom 
              }]}>
                View your most recent project activities and track progress at a glance.
              </Text>
              {projectsLoading ? (
                <View style={styles.emptyState}>
                  <ActivityIndicator size="large" color="#4299e1" />
                  <Text style={[styles.emptyText, { marginTop: 16 }]}>Loading...</Text>
                </View>
              ) : projects.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="folder-outline" size={48} color="#a0aec0" />
                  <Text style={[styles.emptyText, { marginTop: 16 }]}>No projects found</Text>
                </View>
              ) : (
                projects.slice(0, 5).map((project: any) => (
                  <TouchableOpacity
                    key={project.id}
                    style={styles.projectCard}
                    onPress={() => router.push(`/admin/projects/${project.id}`)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.projectHeader}>
                      <Text style={styles.projectName}>
                        {project.name || project.title || 'Project'}
                      </Text>
                      <Text style={styles.projectType}>
                        {project.clientId ? 'Client Hub' : 'Portfolio'}
                      </Text>
                    </View>
                    {(() => {
                      const statusConfig = getStatusConfig(project.status);
                      return (
                        <LinearGradient
                          colors={statusConfig.colors}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={[styles.statusBadge, { borderColor: statusConfig.borderColor }]}
                        >
                          <Ionicons name={statusConfig.icon} size={16} color={statusConfig.textColor} />
                          <Text style={[styles.statusBadgeText, { color: statusConfig.textColor }]}>
                            {project.status || 'Unknown'}
                          </Text>
                        </LinearGradient>
                      );
                    })()}
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
      </View>
    </DashboardLayout>
  );
}
