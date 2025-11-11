import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart' as intl;
import '../../../../core/widgets/role_based_scaffold.dart';
import '../../../../core/widgets/loading_widget.dart';
import '../../../../core/widgets/error_widget.dart';
import '../../../../core/utils/date_formatter.dart';
import '../../../../core/constants/app_constants.dart';
import '../provider/admin_dashboard_provider.dart';
import '../../auth/provider/auth_provider.dart';
import '../../notifications/data/models/activity_model.dart';
import '../../projects/data/models/project_model.dart';

class AdminDashboardPage extends ConsumerWidget {
  const AdminDashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(adminStatsProvider);
    final activitiesAsync = ref.watch(recentActivitiesProvider);
    final projectsAsync = ref.watch(recentProjectsProvider);
    final userProfile = ref.watch(userProfileProvider);
    final user = userProfile.valueOrNull;

    return RoleBasedScaffold(
      title: 'Dashboard',
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(adminStatsProvider);
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Section
              _buildWelcomeSection(context, user),
              
              const SizedBox(height: 32),
              
              // Statistics Cards (4 cards like in image)
              statsAsync.when(
                data: (stats) => _buildStatsCards(context, stats),
                loading: () => const LoadingWidget(),
                error: (error, stack) => ErrorDisplayWidget(
                  message: 'Statistics failed to load',
                  onRetry: () => ref.invalidate(adminStatsProvider),
                ),
              ),
              
              const SizedBox(height: 32),
              
              // Quick Actions
              _buildQuickActions(context),
              
              const SizedBox(height: 32),
              
              // Recent Activities and Projects
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Recent Activities
                  Expanded(
                    flex: 2,
                    child: _buildRecentActivities(context, activitiesAsync),
                  ),
                  const SizedBox(width: 16),
                  
                  // Recent Projects
                  Expanded(
                    flex: 3,
                    child: _buildRecentProjects(context, projectsAsync),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Welcome Section
  Widget _buildWelcomeSection(BuildContext context, user) {
    final now = DateTime.now();
    final dateFormat = intl.DateFormat('d MMMM yyyy', 'en_US');
    final timeFormat = intl.DateFormat('HH:mm');
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Admin Panel Badge
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF0056b8), Color(0xFF0066d0)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(8),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF0056b8).withValues(alpha: 0.3),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: const Text(
            'Admin Panel',
            style: TextStyle(
              color: Colors.white,
              fontSize: 13,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.3,
            ),
          ),
        ),
        const SizedBox(height: 20),
        
        // Welcome Message
        RichText(
          text: TextSpan(
            style: const TextStyle(
              fontSize: 36,
              fontWeight: FontWeight.w700,
              color: Colors.white,
              letterSpacing: -0.5,
              height: 1.2,
            ),
            children: [
              const TextSpan(text: 'Welcome, '),
              TextSpan(
                text: user?.displayName ?? user?.name ?? 'Admin',
                style: const TextStyle(
                  color: Color(0xFF00BCD4),
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        
        // Description
        Text(
          'Welcome to the Softiel Client Hub management panel. From here, you can manage all client projects, track progress, and monitor project activities.',
          style: TextStyle(
            color: Colors.grey[300],
            fontSize: 16,
            height: 1.7,
            letterSpacing: 0.1,
          ),
        ),
        const SizedBox(height: 20),
        
        // Date and Time
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: const Color(0xFF1E293B).withValues(alpha: 0.6),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: Colors.grey[800]!.withValues(alpha: 0.3),
              width: 1,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.calendar_today_rounded, color: Colors.grey[400], size: 18),
              const SizedBox(width: 10),
              Text(
                dateFormat.format(now),
                style: TextStyle(
                  color: Colors.grey[300],
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(width: 24),
              Container(
                width: 1,
                height: 20,
                color: Colors.grey[700],
              ),
              const SizedBox(width: 24),
              Icon(Icons.access_time_rounded, color: Colors.grey[400], size: 18),
              const SizedBox(width: 10),
              Text(
                timeFormat.format(now),
                style: TextStyle(
                  color: Colors.grey[300],
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // Statistics Cards (4 cards like in image)
  Widget _buildStatsCards(BuildContext context, AdminStats stats) {
    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            context,
            title: 'Total Projects',
            value: stats.totalProjects.toString(),
            subtitle: '${stats.activeProjects} active ${stats.completedProjects} completed',
            icon: Icons.work_outlined,
            iconColor: const Color(0xFF00BCD4),
            cardColor: const Color(0xFF1E293B),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildStatCard(
            context,
            title: 'Tasks',
            value: stats.totalTasks.toString(),
            subtitle: '${stats.completedTasks} completed ${stats.totalTasks - stats.completedTasks} pending',
            icon: Icons.checklist_outlined,
            iconColor: Colors.purple,
            cardColor: const Color(0xFF1E293B),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildStatCard(
            context,
            title: 'Notifications',
            value: stats.totalNotifications.toString(),
            subtitle: '${stats.unreadNotifications} unread ${stats.totalNotifications - stats.unreadNotifications} read',
            icon: Icons.notifications_outlined,
            iconColor: Colors.orange,
            cardColor: const Color(0xFF1E293B),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildStatCard(
            context,
            title: 'Users',
            value: stats.activeUsers.toString(),
            subtitle: '${stats.activeUsers} active ${stats.inactiveUsers} inactive',
            icon: Icons.people_outlined,
            iconColor: Colors.green,
            cardColor: const Color(0xFF1E293B),
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(
    BuildContext context, {
    required String title,
    required String value,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required Color cardColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(24.0),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey[800]!.withValues(alpha: 0.3),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 10,
            offset: const Offset(0, 4),
            spreadRadius: 0,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      iconColor.withValues(alpha: 0.2),
                      iconColor.withValues(alpha: 0.1),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: iconColor.withValues(alpha: 0.1),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Icon(icon, color: iconColor, size: 28),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            value,
            style: const TextStyle(
              fontSize: 36,
              fontWeight: FontWeight.w700,
              color: Colors.white,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            title,
            style: TextStyle(
              fontSize: 15,
              color: Colors.grey[300],
              fontWeight: FontWeight.w600,
              letterSpacing: 0.2,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            subtitle,
            style: TextStyle(
              fontSize: 13,
              color: Colors.grey[500],
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Quick Actions',
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w700,
            color: Color(0xFF00BCD4),
            letterSpacing: -0.3,
          ),
        ),
        const SizedBox(height: 10),
        Text(
          'Perform the most frequently used actions quickly',
          style: TextStyle(
            color: Colors.grey[400],
            fontSize: 15,
            height: 1.5,
          ),
        ),
        const SizedBox(height: 20),
        Wrap(
          spacing: 14,
          runSpacing: 14,
          children: [
            _buildQuickActionButton(
              context,
              icon: Icons.add_rounded,
              label: 'New Project',
              color: const Color(0xFF00BCD4),
            ),
            _buildQuickActionButton(
              context,
              icon: Icons.person_add_rounded,
              label: 'Add Client',
              color: Colors.orange,
            ),
            _buildQuickActionButton(
              context,
              icon: Icons.people_rounded,
              label: 'Manage Users',
              color: Colors.green,
            ),
            _buildQuickActionButton(
              context,
              icon: Icons.notifications_rounded,
              label: 'View Notifications',
              color: Colors.purple,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildQuickActionButton(
    BuildContext context, {
    required IconData icon,
    required String label,
    required Color color,
    VoidCallback? onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
            spreadRadius: 0,
          ),
        ],
      ),
      child: ElevatedButton.icon(
        onPressed: onTap ?? () {},
        icon: Icon(icon, size: 20),
        label: Text(
          label,
          style: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.2,
          ),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 0,
        ),
      ),
    );
  }

  Widget _buildRecentActivities(
    BuildContext context,
    AsyncValue<List<ActivityModel>> activitiesAsync,
  ) {
    return Container(
      padding: const EdgeInsets.all(24.0),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey[800]!.withValues(alpha: 0.3),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 10,
            offset: const Offset(0, 4),
            spreadRadius: 0,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Recent Activities',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: Colors.white,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 16),
          activitiesAsync.when(
            data: (activities) {
              if (activities.isEmpty) {
                return Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Center(
                    child: Text(
                      'No activities yet',
                      style: TextStyle(color: Colors.grey[400]),
                    ),
                  ),
                );
              }
              return ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: activities.length,
                separatorBuilder: (_, __) => Divider(color: Colors.grey[800]),
                itemBuilder: (context, index) {
                  final activity = activities[index];
                  return ListTile(
                    dense: true,
                    contentPadding: EdgeInsets.zero,
                    leading: CircleAvatar(
                      radius: 16,
                      backgroundColor: activity.isRead
                          ? Colors.grey[700]
                          : const Color(0xFF0056b8),
                      child: Icon(
                        activity.isProjectActivity
                            ? Icons.work
                            : activity.isBlogActivity
                                ? Icons.article
                                : Icons.notifications,
                        size: 16,
                        color: activity.isRead ? Colors.grey[400] : Colors.white,
                      ),
                    ),
                    title: Text(
                      activity.description,
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: activity.isRead
                            ? FontWeight.normal
                            : FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                    subtitle: Text(
                      DateFormatter.formatRelative(activity.createdAt),
                      style: TextStyle(
                        color: Colors.grey[500],
                        fontSize: 11,
                      ),
                    ),
                    trailing: activity.isRead
                        ? null
                        : Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: Colors.red,
                              shape: BoxShape.circle,
                            ),
                          ),
                  );
                },
              );
            },
            loading: () => const LoadingWidget(),
            error: (error, stack) => ErrorDisplayWidget(
              message: 'Failed to load activities',
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentProjects(
    BuildContext context,
    AsyncValue<List<ProjectModel>> projectsAsync,
  ) {
    return Container(
      padding: const EdgeInsets.all(24.0),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey[800]!.withValues(alpha: 0.3),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 10,
            offset: const Offset(0, 4),
            spreadRadius: 0,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Recent Projects',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                  letterSpacing: -0.3,
                ),
              ),
              TextButton(
                onPressed: () {
                  context.go('/projects');
                },
                child: const Text('View All'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          projectsAsync.when(
            data: (projects) {
              if (projects.isEmpty) {
                return Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Center(
                    child: Text(
                      'No projects yet',
                      style: TextStyle(color: Colors.grey[400]),
                    ),
                  ),
                );
              }
              return ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: projects.length,
                separatorBuilder: (_, __) => Divider(color: Colors.grey[800]),
                itemBuilder: (context, index) {
                  final project = projects[index];
                  return ListTile(
                    dense: true,
                    contentPadding: EdgeInsets.zero,
                    leading: Container(
                      width: 52,
                      height: 52,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            const Color(0xFF0056b8).withValues(alpha: 0.3),
                            const Color(0xFF0056b8).withValues(alpha: 0.15),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF0056b8).withValues(alpha: 0.2),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.work_rounded,
                        color: Color(0xFF00BCD4),
                        size: 24,
                      ),
                    ),
                    title: Text(
                      project.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(color: Colors.white, fontSize: 13),
                    ),
                    subtitle: Text(
                      '${project.status} • ${project.progress}% • ${DateFormatter.formatRelative(project.lastUpdate)}',
                      style: TextStyle(color: Colors.grey[500], fontSize: 11),
                    ),
                    trailing: Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: project.status == AppConstants.statusInProgress
                            ? Colors.green
                            : project.status == AppConstants.statusDelivered
                                ? Colors.blue
                                : Colors.orange,
                        shape: BoxShape.circle,
                      ),
                    ),
                    onTap: () {},
                  );
                },
              );
            },
            loading: () => const LoadingWidget(),
            error: (error, stack) => ErrorDisplayWidget(
              message: 'Failed to load projects',
            ),
          ),
        ],
      ),
    );
  }
}
