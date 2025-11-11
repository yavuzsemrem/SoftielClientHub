import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../features/auth/provider/auth_provider.dart';
import '../../core/constants/app_constants.dart';

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

    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        actions: [
          ...?actions,
          // User menu
          PopupMenuButton<String>(
            icon: CircleAvatar(
              radius: 16,
              backgroundImage: user?.photoUrl != null
                  ? NetworkImage(user!.photoUrl!)
                  : null,
              child: user?.photoUrl == null
                  ? Text(
                      (user?.name.isNotEmpty ?? false)
                          ? user!.name.substring(0, 1).toUpperCase()
                          : 'U',
                      style: const TextStyle(fontSize: 14),
                    )
                  : null,
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
      drawer: isAdmin ? _buildAdminDrawer(context, ref, user) : _buildClientDrawer(context, ref, user),
      body: body,
      floatingActionButton: floatingActionButton,
    );
  }

  Widget _buildAdminDrawer(BuildContext context, WidgetRef ref, user) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundImage: user?.photoUrl != null
                      ? NetworkImage(user!.photoUrl!)
                      : null,
                  child: user?.photoUrl == null
                      ? Text(
                          user?.name.substring(0, 1).toUpperCase() ?? 'A',
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
          // Admin Menu Items
          _buildDrawerItem(
            context,
            icon: Icons.dashboard_outlined,
            title: 'Dashboard',
            onTap: () {
              Navigator.pop(context);
              if (selectedIndex != 0) onNavigationTap?.call(0);
            },
            isSelected: selectedIndex == 0,
          ),
          const Divider(),
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'CMS Management',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: Colors.grey,
              ),
            ),
          ),
          _buildDrawerItem(
            context,
            icon: Icons.article_outlined,
            title: 'Blog Yazıları',
            onTap: () {
              Navigator.pop(context);
              // TODO: Navigate to blog list
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.folder_outlined,
            title: 'Projelerimiz',
            onTap: () {
              Navigator.pop(context);
              // TODO: Navigate to portfolio projects
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.category_outlined,
            title: 'Kategoriler',
            onTap: () {
              Navigator.pop(context);
              // TODO: Navigate to categories
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.label_outline,
            title: 'Etiketler',
            onTap: () {
              Navigator.pop(context);
              // TODO: Navigate to tags
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.people_outline,
            title: 'Kullanıcılar',
            onTap: () {
              Navigator.pop(context);
              // TODO: Navigate to users
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.comment_outlined,
            title: 'Yorumlar',
            onTap: () {
              Navigator.pop(context);
              // TODO: Navigate to comments
            },
          ),
          const Divider(),
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Client Hub',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: Colors.grey,
              ),
            ),
          ),
          _buildDrawerItem(
            context,
            icon: Icons.work_outline,
            title: 'Client Projects',
            onTap: () {
              Navigator.pop(context);
              // TODO: Navigate to client projects
            },
          ),
        ],
      ),
    );
  }

  Widget _buildClientDrawer(BuildContext context, WidgetRef ref, user) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundImage: user?.photoUrl != null
                      ? NetworkImage(user!.photoUrl!)
                      : null,
                  child: user?.photoUrl == null
                      ? Text(
                          user?.name.substring(0, 1).toUpperCase() ?? 'U',
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
          // Client Menu Items (Sadece Client Hub modülleri)
          _buildDrawerItem(
            context,
            icon: Icons.dashboard_outlined,
            title: 'Dashboard',
            onTap: () {
              Navigator.pop(context);
              if (selectedIndex != 0) onNavigationTap?.call(0);
            },
            isSelected: selectedIndex == 0,
          ),
          _buildDrawerItem(
            context,
            icon: Icons.work_outline,
            title: 'Projelerim',
            onTap: () {
              Navigator.pop(context);
              // TODO: Navigate to client projects
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.notifications_outlined,
            title: 'Bildirimler',
            onTap: () {
              Navigator.pop(context);
              // TODO: Navigate to notifications
            },
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    bool isSelected = false,
  }) {
    return ListTile(
      leading: Icon(icon),
      title: Text(title),
      selected: isSelected,
      selectedTileColor: Theme.of(context).colorScheme.primary.withOpacity(0.1),
      onTap: onTap,
    );
  }
}

