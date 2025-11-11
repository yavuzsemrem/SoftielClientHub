import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../features/auth/provider/auth_provider.dart';
import '../providers/sidebar_provider.dart';

class RoleBasedScaffold extends ConsumerWidget {
  final String title;
  final Widget body;
  final List<Widget>? actions;
  final Widget? floatingActionButton;
  final int? selectedIndex;
  final Function(int)? onNavigationTap;

  const RoleBasedScaffold({
    super.key,
    required this.title,
    required this.body,
    this.actions,
    this.floatingActionButton,
    this.selectedIndex,
    this.onNavigationTap,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userProfile = ref.watch(userProfileProvider);
    final user = userProfile.valueOrNull;
    final isAdmin = user?.isAdmin ?? false;
    final isSidebarExpanded = ref.watch(sidebarExpandedProvider);

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Dark background
      drawer: isAdmin ? _buildAdminDrawer(context, ref, user) : _buildClientDrawer(context, ref, user),
      body: Row(
        children: [
          // Left Sidebar (always visible, toggleable on all screen sizes)
          _buildSidebar(context, ref, user, isAdmin, isSidebarExpanded),
          
          // Main Content
          Expanded(
            child: Column(
              children: [
                // Top Header Bar
                _buildHeaderBar(context, ref, user, isAdmin),
                
                // Body Content
                Expanded(child: body),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: floatingActionButton,
    );
  }
  
  // Modern Sidebar (Dashboard style)
  Widget _buildSidebar(BuildContext context, WidgetRef ref, user, bool isAdmin, bool isExpanded) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
      width: isExpanded ? 280 : 80,
      color: const Color(0xFF1E293B), // Dark sidebar
      child: Column(
        children: [
          // Logo and Title
          Container(
            padding: EdgeInsets.all(isExpanded ? 24.0 : 20.0),
            child: Row(
              mainAxisAlignment: isExpanded ? MainAxisAlignment.start : MainAxisAlignment.center,
              children: [
                Image.asset(
                  'assets/images/transparent.png',
                  height: isExpanded ? 40 : 32,
                  width: isExpanded ? 40 : 32,
                  fit: BoxFit.contain,
                  errorBuilder: (_, __, ___) => Icon(
                    Icons.business,
                    color: const Color(0xFF00BCD4),
                    size: isExpanded ? 40 : 32,
                  ),
                ),
                if (isExpanded) ...[
                  const SizedBox(width: 12),
                  const Text(
                    'Softiel',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ],
            ),
          ),
          if (isExpanded)
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 24.0),
              child: Text(
                'Management Panel',
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 12,
                ),
              ),
            ),
          if (isExpanded) const SizedBox(height: 24),
          
          // Main Menu
          if (isExpanded)
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 24.0),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'MAIN MENU',
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1,
                  ),
                ),
              ),
            ),
          if (isExpanded) const SizedBox(height: 12),
          
          // Menu Items
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: isAdmin 
                ? _buildAdminMenuItems(context, isExpanded) 
                : _buildClientMenuItems(context, isExpanded),
            ),
          ),
          
          // User Section at Bottom
          Container(
            padding: EdgeInsets.all(isExpanded ? 16.0 : 12.0),
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(color: Colors.grey[800]!, width: 1),
              ),
            ),
            child: isExpanded
              ? Column(
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 20,
                          backgroundImage: user?.photoUrl != null
                              ? NetworkImage(user!.photoUrl!)
                              : null,
                          child: user?.photoUrl == null
                              ? Text(
                                  (user?.name.isNotEmpty ?? false)
                                      ? user!.name.substring(0, 1).toUpperCase()
                                      : 'A',
                                  style: const TextStyle(fontSize: 16),
                                )
                              : null,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                user?.displayName ?? user?.name ?? (isAdmin ? 'Admin' : 'User'),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              Text(
                                user?.role.toUpperCase() ?? 'USER',
                                style: TextStyle(
                                  color: Colors.grey[400],
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    InkWell(
                      onTap: () {
                        ref.read(authControllerProvider.notifier).signOut();
                      },
                      child: Row(
                        children: [
                          Icon(Icons.logout, color: Colors.grey[400], size: 20),
                          const SizedBox(width: 8),
                          Text(
                            'Logout',
                            style: TextStyle(
                              color: Colors.grey[400],
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                )
              : Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CircleAvatar(
                      radius: 20,
                      backgroundImage: user?.photoUrl != null
                          ? NetworkImage(user!.photoUrl!)
                          : null,
                      child: user?.photoUrl == null
                          ? Text(
                              (user?.name.isNotEmpty ?? false)
                                  ? user!.name.substring(0, 1).toUpperCase()
                                  : 'A',
                              style: const TextStyle(fontSize: 16),
                            )
                          : null,
                    ),
                    const SizedBox(height: 12),
                    InkWell(
                      onTap: () {
                        ref.read(authControllerProvider.notifier).signOut();
                      },
                      child: Icon(Icons.logout, color: Colors.grey[400], size: 20),
                    ),
                  ],
                ),
          ),
        ],
      ),
    );
  }
  
  List<Widget> _buildAdminMenuItems(BuildContext context, bool isExpanded) {
    final currentRoute = GoRouterState.of(context).matchedLocation;
    
    return [
      _buildSidebarMenuItem(
        context,
        icon: Icons.dashboard_outlined,
        title: 'Dashboard',
        route: '/dashboard',
        isSelected: currentRoute == '/dashboard',
        isExpanded: isExpanded,
      ),
      _buildSidebarMenuItem(
        context,
        icon: Icons.work_outlined,
        title: 'Client Projects',
        route: '/projects',
        isSelected: currentRoute == '/projects' || currentRoute.startsWith('/project/'),
        isExpanded: isExpanded,
      ),
      _buildSidebarMenuItem(
        context,
        icon: Icons.people_outlined,
        title: 'Users',
        route: '/users',
        isSelected: currentRoute == '/users',
        isExpanded: isExpanded,
      ),
      _buildSidebarMenuItem(
        context,
        icon: Icons.notifications_outlined,
        title: 'Notifications',
        route: '/notifications',
        isSelected: currentRoute == '/notifications',
        isExpanded: isExpanded,
      ),
    ];
  }
  
  List<Widget> _buildClientMenuItems(BuildContext context, bool isExpanded) {
    final currentRoute = GoRouterState.of(context).matchedLocation;
    
    return [
      _buildSidebarMenuItem(
        context,
        icon: Icons.dashboard_outlined,
        title: 'Dashboard',
        route: '/dashboard',
        isSelected: currentRoute == '/dashboard',
        isExpanded: isExpanded,
      ),
      _buildSidebarMenuItem(
        context,
        icon: Icons.work_outlined,
        title: 'My Projects',
        route: '/projects',
        isSelected: currentRoute == '/projects' || currentRoute.startsWith('/project/'),
        isExpanded: isExpanded,
      ),
      _buildSidebarMenuItem(
        context,
        icon: Icons.notifications_outlined,
        title: 'Notifications',
        route: '/notifications',
        isSelected: currentRoute == '/notifications',
        isExpanded: isExpanded,
      ),
    ];
  }
  
  Widget _buildSidebarMenuItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String route,
    required bool isSelected,
    required bool isExpanded,
  }) {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: isExpanded ? 12 : 8, vertical: 3),
      decoration: BoxDecoration(
        gradient: isSelected
            ? const LinearGradient(
                colors: [Color(0xFF0056b8), Color(0xFF0066d0)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              )
            : null,
        color: isSelected ? null : Colors.transparent,
        borderRadius: BorderRadius.circular(10),
        boxShadow: isSelected
            ? [
                BoxShadow(
                  color: const Color(0xFF0056b8).withValues(alpha: 0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ]
            : null,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            context.go(route);
          },
          borderRadius: BorderRadius.circular(10),
          child: Padding(
            padding: EdgeInsets.symmetric(
              horizontal: isExpanded ? 16 : 12,
              vertical: 12,
            ),
            child: Row(
              mainAxisAlignment: isExpanded ? MainAxisAlignment.start : MainAxisAlignment.center,
              children: [
                Icon(
                  icon,
                  color: isSelected ? Colors.white : Colors.grey[400],
                  size: 22,
                ),
                if (isExpanded) ...[
                  const SizedBox(width: 14),
                  Expanded(
                    child: Text(
                      title,
                      style: TextStyle(
                        color: isSelected ? Colors.white : Colors.grey[300],
                        fontSize: 15,
                        fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                        letterSpacing: 0.2,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  // Top Header Bar (Dashboard style)
  Widget _buildHeaderBar(BuildContext context, WidgetRef ref, user, bool isAdmin) {
    return Container(
      height: 70,
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        border: Border(
          bottom: BorderSide(color: Colors.grey[800]!, width: 1),
        ),
      ),
      child: Row(
        children: [
          // Hamburger Menu (toggles sidebar on all screen sizes)
          IconButton(
            icon: Icon(Icons.menu, color: Colors.grey[300]),
            onPressed: () {
              // Toggle sidebar on all screen sizes
              ref.read(sidebarExpandedProvider.notifier).state = 
                  !ref.read(sidebarExpandedProvider);
            },
          ),
          const SizedBox(width: 16),
          
          // Search Bar
          Expanded(
            child: Container(
              height: 44,
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: Colors.grey[700]!.withValues(alpha: 0.5),
                  width: 1,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.1),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: TextField(
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 15,
                ),
                decoration: InputDecoration(
                  hintText: 'Search project, user or message...',
                  hintStyle: TextStyle(
                    color: Colors.grey[500],
                    fontSize: 15,
                  ),
                  prefixIcon: Icon(
                    Icons.search_rounded,
                    color: Colors.grey[400],
                    size: 22,
                  ),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 18,
                    vertical: 12,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),
          
          // Notifications
          IconButton(
            icon: Stack(
              children: [
                Icon(Icons.notifications_outlined, color: Colors.grey[300]),
                Positioned(
                  right: 0,
                  top: 0,
                  child: Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ],
            ),
            onPressed: () {
              context.go('/notifications');
            },
          ),
          const SizedBox(width: 8),
          
          // User Dropdown
          PopupMenuButton<String>(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                CircleAvatar(
                  radius: 16,
                  backgroundImage: user?.photoUrl != null
                      ? NetworkImage(user!.photoUrl!)
                      : null,
                  child: user?.photoUrl == null
                      ? Text(
                          (user?.name.isNotEmpty ?? false)
                              ? user!.name.substring(0, 1).toUpperCase()
                              : 'A',
                          style: const TextStyle(fontSize: 12),
                        )
                      : null,
                ),
                const SizedBox(width: 8),
                Text(
                  user?.displayName ?? user?.name ?? (isAdmin ? 'Admin' : 'User'),
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                ),
                const SizedBox(width: 4),
                Icon(Icons.arrow_drop_down, color: Colors.grey[300]),
              ],
            ),
            onSelected: (value) {
              if (value == 'logout') {
                ref.read(authControllerProvider.notifier).signOut();
              }
            },
            itemBuilder: (context) => [
              PopupMenuItem(
                value: 'profile',
                child: Row(
                  children: [
                    const Icon(Icons.person_outline, size: 20),
                    const SizedBox(width: 8),
                    Text(user?.displayName ?? user?.name ?? 'User'),
                  ],
                ),
              ),
              PopupMenuItem(
                value: 'role',
                child: Row(
                  children: [
                    const Icon(Icons.admin_panel_settings_outlined, size: 20),
                    const SizedBox(width: 8),
                    Text(user?.role.toUpperCase() ?? 'USER'),
                  ],
                ),
              ),
              const PopupMenuDivider(),
              const PopupMenuItem(
                value: 'logout',
                child: Row(
                  children: [
                    Icon(Icons.logout, size: 20, color: Colors.red),
                    SizedBox(width: 8),
                    Text('Logout', style: TextStyle(color: Colors.red)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAdminDrawer(BuildContext context, WidgetRef ref, user) {
    final currentRoute = GoRouterState.of(context).matchedLocation;
    
    return Drawer(
      backgroundColor: const Color(0xFF1E293B),
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          // Drawer Header
          Container(
            padding: const EdgeInsets.all(24.0),
            decoration: BoxDecoration(
              color: const Color(0xFF0056b8),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Image.asset(
                      'assets/images/transparent.png',
                      height: 40,
                      width: 40,
                      fit: BoxFit.contain,
                      errorBuilder: (_, __, ___) => const Icon(
                        Icons.business,
                        color: Colors.white,
                        size: 40,
                      ),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'Softiel',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                CircleAvatar(
                  radius: 30,
                  backgroundImage: user?.photoUrl != null
                      ? NetworkImage(user!.photoUrl!)
                      : null,
                  child: user?.photoUrl == null
                      ? Text(
                          (user?.name.isNotEmpty ?? false)
                              ? user!.name.substring(0, 1).toUpperCase()
                              : 'A',
                          style: const TextStyle(fontSize: 24),
                        )
                      : null,
                ),
                const SizedBox(height: 12),
                Text(
                  user?.displayName ?? user?.name ?? 'Admin',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Admin Panel',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
            child: Text(
              'MAIN MENU',
              style: TextStyle(
                color: Colors.grey,
                fontSize: 12,
                fontWeight: FontWeight.bold,
                letterSpacing: 1,
              ),
            ),
          ),
          // Admin Menu Items
          _buildDrawerMenuItem(
            context,
            icon: Icons.dashboard_outlined,
            title: 'Dashboard',
            route: '/dashboard',
            isSelected: currentRoute == '/dashboard',
          ),
          _buildDrawerMenuItem(
            context,
            icon: Icons.work_outline,
            title: 'Client Projects',
            route: '/projects',
            isSelected: currentRoute == '/projects' || currentRoute.startsWith('/project/'),
          ),
          _buildDrawerMenuItem(
            context,
            icon: Icons.people_outline,
            title: 'Users',
            route: '/users',
            isSelected: currentRoute == '/users',
          ),
          _buildDrawerMenuItem(
            context,
            icon: Icons.notifications_outlined,
            title: 'Notifications',
            route: '/notifications',
            isSelected: currentRoute == '/notifications',
          ),
          const Divider(color: Colors.grey),
          // Logout
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Logout', style: TextStyle(color: Colors.red)),
            onTap: () {
              Navigator.pop(context);
              ref.read(authControllerProvider.notifier).signOut();
            },
          ),
        ],
      ),
    );
  }

  Widget _buildClientDrawer(BuildContext context, WidgetRef ref, user) {
    final currentRoute = GoRouterState.of(context).matchedLocation;
    
    return Drawer(
      backgroundColor: const Color(0xFF1E293B),
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          // Drawer Header
          Container(
            padding: const EdgeInsets.all(24.0),
            decoration: BoxDecoration(
              color: const Color(0xFF0056b8),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Image.asset(
                      'assets/images/transparent.png',
                      height: 40,
                      width: 40,
                      fit: BoxFit.contain,
                      errorBuilder: (_, __, ___) => const Icon(
                        Icons.business,
                        color: Colors.white,
                        size: 40,
                      ),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'Softiel',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                CircleAvatar(
                  radius: 30,
                  backgroundImage: user?.photoUrl != null
                      ? NetworkImage(user!.photoUrl!)
                      : null,
                  child: user?.photoUrl == null
                      ? Text(
                          (user?.name.isNotEmpty ?? false)
                              ? user!.name.substring(0, 1).toUpperCase()
                              : 'U',
                          style: const TextStyle(fontSize: 24),
                        )
                      : null,
                ),
                const SizedBox(height: 12),
                Text(
                  user?.displayName ?? user?.name ?? 'User',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Client Hub',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
            child: Text(
              'MAIN MENU',
              style: TextStyle(
                color: Colors.grey,
                fontSize: 12,
                fontWeight: FontWeight.bold,
                letterSpacing: 1,
              ),
            ),
          ),
          // Client Menu Items
          _buildDrawerMenuItem(
            context,
            icon: Icons.dashboard_outlined,
            title: 'Dashboard',
            route: '/dashboard',
            isSelected: currentRoute == '/dashboard',
          ),
          _buildDrawerMenuItem(
            context,
            icon: Icons.work_outline,
            title: 'My Projects',
            route: '/projects',
            isSelected: currentRoute == '/projects' || currentRoute.startsWith('/project/'),
          ),
          _buildDrawerMenuItem(
            context,
            icon: Icons.notifications_outlined,
            title: 'Notifications',
            route: '/notifications',
            isSelected: currentRoute == '/notifications',
          ),
          const Divider(color: Colors.grey),
          // Logout
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Logout', style: TextStyle(color: Colors.red)),
            onTap: () {
              Navigator.pop(context);
              ref.read(authControllerProvider.notifier).signOut();
            },
          ),
        ],
      ),
    );
  }
  
  Widget _buildDrawerMenuItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String route,
    required bool isSelected,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 3),
      decoration: BoxDecoration(
        gradient: isSelected
            ? const LinearGradient(
                colors: [Color(0xFF0056b8), Color(0xFF0066d0)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              )
            : null,
        color: isSelected ? null : Colors.transparent,
        borderRadius: BorderRadius.circular(10),
        boxShadow: isSelected
            ? [
                BoxShadow(
                  color: const Color(0xFF0056b8).withValues(alpha: 0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ]
            : null,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            Navigator.pop(context);
            context.go(route);
          },
          borderRadius: BorderRadius.circular(10),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: [
                Icon(
                  icon,
                  color: isSelected ? Colors.white : Colors.grey[400],
                  size: 22,
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Text(
                    title,
                    style: TextStyle(
                      color: isSelected ? Colors.white : Colors.grey[300],
                      fontSize: 15,
                      fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                      letterSpacing: 0.2,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

}

