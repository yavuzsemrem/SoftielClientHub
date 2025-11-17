import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Image, Platform, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Folder, Users, Bell, LogOut, Menu, X, ChevronUp, ChevronDown, User } from 'lucide-react-native';
import { useRouter, useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { logout } from '@/firebase/auth';
import { useSessionStore } from '@/stores/sessionStore';
import { useNotifications } from '@/hooks/useNotifications';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH_COLLAPSED = 80; // Icon-only width
const SIDEBAR_WIDTH_EXPANDED = 280; // Expanded with text
const MOBILE_BREAKPOINT = 768;

interface MenuItem {
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

// İkon mapping fonksiyonu - eski Ionicons isimlerini Lucide ikonlarına çevirir
const getIconComponent = (iconName: string, size: number, color: string) => {
  const iconProps = { size, color, strokeWidth: 2 };
  
  switch (iconName) {
    case 'home-outline':
      return <Home {...iconProps} />;
    case 'folder-outline':
      return <Folder {...iconProps} />;
    case 'people-outline':
      return <Users {...iconProps} />;
    case 'notifications-outline':
      return <Bell {...iconProps} />;
    case 'exit-outline':
      return <LogOut {...iconProps} />;
    default:
      return <Home {...iconProps} />;
  }
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems: MenuItem[];
  user: any;
  onLogout: () => void | Promise<void>;
}

export default function DashboardLayout({ children, menuItems, user, onLogout }: DashboardLayoutProps) {
  const router = useRouter();
  const segments = useSegments();
  const pathname = segments.length > 0 ? '/' + segments.join('/') : '/';
  const insets = useSafeAreaInsets();
  const { unreadCount } = useNotifications();
  const { width } = useWindowDimensions();
  const { clearSession } = useSessionStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(SCREEN_WIDTH < MOBILE_BREAKPOINT);
  const [isExpanded, setIsExpanded] = useState(false); // Başlangıçta collapsed (görseldeki gibi)
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isWeb = Platform.OS === 'web';
  const isWebMobile = isWeb && width < 768;
  const sidebarAnimation = useRef(new Animated.Value(isMobile ? -SIDEBAR_WIDTH_EXPANDED : 0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sidebarWidthAnimation = useRef(new Animated.Value(isMobile ? SIDEBAR_WIDTH_EXPANDED : (isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED))).current;
  const logoTextOpacity = useRef(new Animated.Value(isMobile ? 1 : (isExpanded ? 1 : 0))).current;
  const menuIconRotation = useRef(new Animated.Value(0)).current;
  
  const navbarHeight = 64 + insets.top;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const mobile = window.width < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
        // Desktop'ta collapsed kalır
      } else {
        setIsExpanded(false);
      }
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (isMobile) {
      // Mobile: Sidebar overlay olarak açılıp kapanıyor
      Animated.parallel([
        Animated.timing(sidebarAnimation, {
          toValue: sidebarOpen ? 0 : -SIDEBAR_WIDTH_EXPANDED,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: sidebarOpen ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(logoTextOpacity, {
          toValue: sidebarOpen ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(menuIconRotation, {
          toValue: sidebarOpen ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Desktop: Sidebar genişliği değişiyor
      sidebarAnimation.setValue(0);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(sidebarWidthAnimation, {
          toValue: isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(logoTextOpacity, {
          toValue: isExpanded ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(menuIconRotation, {
          toValue: isExpanded ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [sidebarOpen, isMobile, isExpanded]);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleMenuClick = (path: string) => {
    router.push(path);
    if (isMobile) {
      closeSidebar();
    }
  };

  return (
    <View style={[
      styles.container,
      isWeb && { 
        width: '100%', 
        height: '100%', 
        margin: 0, 
        padding: 0,
        overflow: 'hidden',
        maxWidth: '100%'
      }
    ]}
    pointerEvents="auto"
    >
      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: sidebarAnimation }],
            width: isMobile ? SIDEBAR_WIDTH_EXPANDED : sidebarWidthAnimation,
            top: 0,
            paddingTop: insets.top,
          },
          Platform.OS === 'android' && isMobile && !sidebarOpen && { pointerEvents: 'none' },
        ]}
      >
        <LinearGradient
          colors={['#0f172a', '#020617', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sidebarGradient}
        >
          {/* Logo */}
          <View style={[
            styles.logoContainer,
            !(isExpanded || isMobile) && styles.logoContainerCollapsed
          ]}>
            <View style={[
              styles.logoWrapper,
              !(isExpanded || isMobile) && styles.logoWrapperCollapsed
            ]}>
              <Image
                source={require('@/assets/images/client.webp')}
                style={[
                  styles.logo,
                  !(isExpanded || isMobile) && styles.logoCollapsed
                ]}
                resizeMode="contain"
              />
              <Animated.View 
                style={[
                  styles.logoTextContainer,
                  { 
                    opacity: logoTextOpacity,
                  }
                ]}
                pointerEvents={isExpanded || isMobile ? 'auto' : 'none'}
              >
                <Text style={styles.logoTextMain}>Softiel</Text>
                <Text style={styles.logoTextSub}>Client Hub</Text>
              </Animated.View>
            </View>
          </View>

          {/* Menu Items */}
          <View style={[
            styles.menuContainer,
            !(isExpanded || isMobile) && styles.menuContainerCollapsed
          ]}>
            {menuItems.map((item, index) => {
              const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
              const showExpanded = isExpanded || isMobile;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.menuItem,
                    !showExpanded && styles.menuItemCollapsed,
                    !showExpanded && index === 0 && styles.menuItemFirstCollapsed, // İlk item collapsed durumda
                    isActive && showExpanded && styles.menuItemActive,
                  ]}
                  onPress={() => handleMenuClick(item.path)}
                  activeOpacity={0.7}
                >
                  {/* Active gradient - only show when expanded */}
                  {isActive && showExpanded && (
                    <LinearGradient
                      colors={['rgba(66, 153, 225, 0.3)', 'rgba(66, 153, 225, 0.1)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.menuItemActiveGradient}
                    />
                  )}
                  <View style={[
                    styles.menuItemContent,
                    !showExpanded && styles.menuItemContentCollapsed,
                  ]}>
                    {getIconComponent(
                      item.icon,
                      24,
                      isActive ? '#4299e1' : '#a0aec0'
                    )}
                    {showExpanded && (
                      <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
                        {item.label}
                      </Text>
                    )}
                  </View>
                  {item.badge && item.badge > 0 && showExpanded && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Footer - User Info & Logout */}
          <View style={[
            styles.sidebarFooter,
            !(isExpanded || isMobile) && styles.sidebarFooterCollapsed
          ]}>
            <View style={[styles.userInfo, !(isExpanded || isMobile) && styles.userInfoCollapsed]}>
              <Image
                source={require('@/assets/images/client.webp')}
                style={[styles.userLogo, !(isExpanded || isMobile) && styles.userLogoCollapsed]}
                resizeMode="contain"
              />
              {(isExpanded || isMobile) && (
                <View style={styles.userDetails}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {user?.name || user?.displayName || 'Admin'}
                  </Text>
                  <Text style={styles.userEmail} numberOfLines={1}>
                    {user?.email || 'info@softiel.com'}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={[
                styles.logoutButtonSidebar, 
                !(isExpanded || isMobile) && styles.logoutButtonCollapsed
              ]}
              onPress={onLogout}
              activeOpacity={0.7}
            >
              <LogOut size={20} color="#ff9700" strokeWidth={2} />
              {(isExpanded || isMobile) && (
                <Text style={styles.logoutButtonSidebarText}>Logout</Text>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Overlay for mobile */}
      {isMobile && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
              top: 0,
              paddingTop: insets.top,
            },
            sidebarOpen 
              ? { pointerEvents: 'auto', zIndex: 999 } 
              : { 
                  pointerEvents: 'none', 
                  zIndex: Platform.OS === 'android' ? -1 : 999 
                },
          ]}
        >
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={closeSidebar}
          />
        </Animated.View>
      )}

      {/* Overlay for user menu dropdown - dropdown'dan ÖNCE render edilmeli */}
      {userMenuOpen && (
        <TouchableOpacity
          style={[
            styles.userMenuOverlay,
            {
              top: navbarHeight,
            }
          ]}
          activeOpacity={1}
          onPress={() => setUserMenuOpen(false)}
          pointerEvents="auto"
        />
      )}

      {/* Navbar */}
      <Animated.View 
        style={[
          styles.navbar, 
          { 
            paddingTop: insets.top + 12, 
            paddingBottom: 12,
            height: navbarHeight,
            left: isMobile ? 0 : sidebarWidthAnimation,
          }
        ]}
      >
        <View style={styles.navbarLeft}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton} activeOpacity={0.7}>
            <Animated.View
              style={[
                styles.menuButtonGradient,
                {
                  transform: [
                    {
                      rotate: menuIconRotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              {(isMobile ? sidebarOpen : isExpanded) ? (
                <X size={22} color="#ffffff" strokeWidth={2.5} />
              ) : (
                <Menu size={22} color="#ffffff" strokeWidth={2.5} />
              )}
            </Animated.View>
          </TouchableOpacity>
        </View>
        <View style={styles.navbarRight}>
          <TouchableOpacity
            onPress={() => router.push('/notifications')}
            style={styles.notificationButton}
            activeOpacity={0.7}
          >
            <Bell size={22} color="#ffffff" strokeWidth={2} />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.userMenuContainer}>
            <TouchableOpacity 
              onPress={() => setUserMenuOpen(!userMenuOpen)} 
              style={styles.userMenuButton}
              activeOpacity={0.7}
            >
              <View style={styles.userMenuButtonContent}>
                <Image
                  source={require('@/assets/images/client.webp')}
                  style={styles.userMenuAvatar}
                  resizeMode="contain"
                />
                {!isMobile && (
                  <View style={styles.userMenuInfo}>
                    <Text style={styles.userMenuName} numberOfLines={1}>
                      {user?.name || user?.displayName || 'Admin'}
                    </Text>
                    <Text style={styles.userMenuEmail} numberOfLines={1}>
                      {user?.email || 'info@softiel.com'}
                    </Text>
                  </View>
                )}
                {userMenuOpen ? (
                  <ChevronUp size={16} color="#ffffff" strokeWidth={2.5} style={styles.userMenuChevron} />
                ) : (
                  <ChevronDown size={16} color="#ffffff" strokeWidth={2.5} style={styles.userMenuChevron} />
                )}
              </View>
            </TouchableOpacity>

            {userMenuOpen && (
              <View style={styles.userMenuDropdown}>
                {/* User Info Header */}
                <View style={styles.userMenuDropdownHeader}>
                  <Image
                    source={require('@/assets/images/client.webp')}
                    style={styles.userMenuDropdownAvatar}
                    resizeMode="contain"
                  />
                  <View style={styles.userMenuDropdownInfo}>
                    <Text style={styles.userMenuDropdownName} numberOfLines={1}>
                      {user?.name || user?.displayName || 'Admin'}
                    </Text>
                    <Text style={styles.userMenuDropdownEmail} numberOfLines={1}>
                      {user?.email || 'info@softiel.com'}
                    </Text>
                  </View>
                </View>

                {/* Divider */}
                <View style={styles.userMenuDivider} />

                {/* Profile Settings */}
                <TouchableOpacity
                  style={styles.userMenuItem}
                  onPress={() => {
                    console.log('Profile Settings clicked');
                    setUserMenuOpen(false);
                    router.push('/admin/users');
                  }}
                  activeOpacity={0.7}
                >
                  <User size={20} color="#ffffff" strokeWidth={2} />
                  <Text style={styles.userMenuItemText}>Profile Settings</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.userMenuDivider} />

                {/* Logout */}
                <TouchableOpacity
                  style={styles.userMenuItem}
                  onPress={async () => {
                    console.log('Logout clicked');
                    setUserMenuOpen(false);
                    try {
                      await logout();
                      clearSession();
                      router.replace('/login');
                    } catch (error) {
                      console.error('Logout error:', error);
                      clearSession();
                      router.replace('/login');
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.userMenuLogoutIcon}>
                    <LogOut size={20} color="#ef4444" strokeWidth={2} />
                  </View>
                  <Text style={[styles.userMenuItemText, styles.userMenuLogoutText]}>Log Out</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Animated.View>

      {/* Main Content */}
      <Animated.View 
        style={[
          styles.mainContent, 
          { 
            marginLeft: isMobile 
              ? 0 
              : sidebarWidthAnimation,
            marginTop: navbarHeight,
          },
          Platform.OS === 'android' && isMobile ? { zIndex: 10 } : (Platform.OS === 'android' ? { zIndex: 1 } : {}),
          isWeb && { 
            width: '100%', 
            height: '100%', 
            marginRight: 0,
            position: 'relative',
            overflow: 'visible',
            zIndex: 10
          }
        ]}
        pointerEvents="auto"
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  navbar: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 1001,
    elevation: 10,
  },
  navbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    borderRadius: 12,
  },
  menuButtonGradient: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  navbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff9700',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: 'rgba(15, 23, 42, 0.95)',
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  overlayTouchable: {
    flex: 1,
  },
  // Sidebar Container
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1002,
    elevation: 10,
  },
  sidebarGradient: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  // Logo Section
  logoContainer: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 24, // Sol padding sabit
    paddingRight: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    height: 108, // Sabit yükseklik: 24 + 60 + 24
  },
  logoContainerCollapsed: {
    paddingTop: 24,
    paddingBottom: 8,
    paddingLeft: 24, // Expanded ile aynı padding - sabit pozisyon
    paddingRight: 24, // Expanded ile aynı padding - sabit pozisyon
    alignItems: 'flex-start', // Expanded ile aynı - sola hizala
    justifyContent: 'flex-start',
    height: 72, // Sabit yükseklik: 24 + 40 + 8
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    height: 60,
    position: 'relative', // logoTextContainer için referans
  },
  logoWrapperCollapsed: {
    flexDirection: 'row', // Expanded ile aynı
    alignItems: 'flex-start', // Expanded ile aynı - üstte hizala
    justifyContent: 'flex-start', // Expanded ile aynı - sola hizala
    gap: 0, // Collapsed durumda gap yok
    height: 40,
    width: 'auto', // Genişlik otomatik - expanded ile aynı
  },
  logo: {
    width: 60,
    height: 60,
  },
  logoCollapsed: {
    width: 40,
    height: 40,
  },
  logoTextContainer: {
    justifyContent: 'flex-start',
    paddingTop: 10, // 17'den 12'ye düşürüldü - 5px yukarı kaydı
    overflow: 'hidden',
    width: 180, // Sabit genişlik - yazı sağa sola kaymaz
    position: 'absolute', // Pozisyonu sabit tut
    left: 69, // Logo genişliği (60) + gap (9) = 69px
  },
  logoTextMain: {
    fontSize: 35,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'left',
    marginBottom: 2,
  },
  logoTextSub: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4299e1',
    textAlign: 'left',
  },
  
  // Menu Container
  menuContainer: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  menuContainerCollapsed: {
    paddingTop: 8, // Biraz aşağıya kaydırmak için
    paddingBottom: 8,
    paddingLeft: 16, // Expanded ile aynı padding - menu item'lar sabit pozisyonda
    paddingRight: 16,
    width: '100%', // Tam genişlik
    alignItems: 'flex-start', // Menu item'ları sola hizala - expanded ile aynı
    justifyContent: 'flex-start', // Yukarıdan başla
  },
  
  // Menu Items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 4,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 48,
  },
  menuItemCollapsed: {
    justifyContent: 'center', // İkonu ortala - collapsed durumda
    alignItems: 'center',
    paddingHorizontal: 0, // Collapsed durumda padding yok
    paddingVertical: 12,
    marginBottom: 4,
    marginLeft: 0,
    marginRight: 0,
    width: '100%', // Tam genişlik - collapsed durumda
    minHeight: 48,
  },
  menuItemFirstCollapsed: {
    marginTop: 0,
  },
  menuItemActive: {
    // Active state handled by gradient
  },
  menuItemActiveGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    zIndex: 1,
  },
  menuItemContentCollapsed: {
    justifyContent: 'center', // İkonu ortala - collapsed durumda
    alignItems: 'center',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#a0aec0',
    marginLeft: 16,
  },
  menuItemTextActive: {
    color: '#4299e1',
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#ff9700',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    zIndex: 1,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  
  // Footer Section
  sidebarFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  sidebarFooterCollapsed: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16, // Expanded ile aynı padding - sabit pozisyon
    paddingRight: 16, // Expanded ile aynı padding - sabit pozisyon
    alignItems: 'flex-start', // Expanded ile aynı - sola hizala
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfoCollapsed: {
    flexDirection: 'row', // Expanded ile aynı
    alignItems: 'center', // Expanded ile aynı
    justifyContent: 'flex-start', // Expanded ile aynı - sola hizala
    marginBottom: 16,
    width: 'auto', // Genişlik otomatik - expanded ile aynı
  },
  userLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  userLogoCollapsed: {
    width: 40,
    height: 40,
    marginRight: 12, // Expanded ile aynı margin - sabit pozisyon
    marginLeft: 8, // Biraz sağa yaklaştırmak için
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#718096',
  },
  logoutButtonSidebar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Sola hizala - sabit pozisyon
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 151, 0, 0.3)',
    backgroundColor: 'rgba(255, 151, 0, 0.1)',
  },
  logoutButtonCollapsed: {
    paddingHorizontal: 16, // Expanded ile aynı padding - sabit pozisyon
    paddingVertical: 12, // Expanded ile aynı padding
    width: 'auto', // Genişlik otomatik - expanded ile aynı
    minHeight: 48, // Expanded ile aynı
    justifyContent: 'flex-start', // Expanded ile aynı - sola hizala
    alignItems: 'center',
    alignSelf: 'flex-start', // Expanded ile aynı - sola hizala
    marginTop: 0,
  },
  logoutButtonSidebarText: {
    color: '#ff9700',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  userMenuContainer: {
    position: 'relative',
    zIndex: 1002,
  },
  userMenuButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  userMenuButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userMenuAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userMenuInfo: {
    flex: 1,
    marginRight: 4,
  },
  userMenuName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  userMenuEmail: {
    color: '#a0aec0',
    fontSize: 12,
  },
  userMenuChevron: {
    marginLeft: 4,
  },
  userMenuDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'visible',
    zIndex: 1004,
  },
  userMenuDropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  userMenuDropdownAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userMenuDropdownInfo: {
    flex: 1,
  },
  userMenuDropdownName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  userMenuDropdownEmail: {
    color: '#a0aec0',
    fontSize: 13,
  },
  userMenuDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 12,
  },
  userMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    zIndex: 1004,
  },
  userMenuItemText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  userMenuLogoutIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMenuLogoutText: {
    color: '#ef4444',
  },
  userMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  mainContent: {
    flex: 1,
  },
});

