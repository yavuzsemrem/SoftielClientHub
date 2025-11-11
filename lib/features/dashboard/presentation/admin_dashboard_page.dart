import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../../../core/widgets/role_based_scaffold.dart';
import '../../../../core/widgets/loading_widget.dart';
import '../../../../core/widgets/error_widget.dart';
import '../../../../core/utils/date_formatter.dart';
import '../provider/admin_dashboard_provider.dart';
import '../../notifications/data/models/activity_model.dart';
import '../../blog/data/models/blog_post_model.dart';
import '../../portfolio/data/models/portfolio_project_model.dart';

class AdminDashboardPage extends ConsumerWidget {
  const AdminDashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(adminStatsProvider);
    final activitiesAsync = ref.watch(recentActivitiesProvider);
    final blogPostsAsync = ref.watch(recentBlogPostsProvider);
    final portfolioProjectsAsync = ref.watch(recentPortfolioProjectsProvider);

    return RoleBasedScaffold(
      title: 'Admin Dashboard',
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(adminStatsProvider);
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // İstatistikler
              statsAsync.when(
                data: (stats) => _buildStatsGrid(context, stats),
                loading: () => const LoadingWidget(),
                error: (error, stack) => ErrorDisplayWidget(
                  message: 'İstatistikler yüklenirken hata oluştu',
                  onRetry: () => ref.invalidate(adminStatsProvider),
                ),
              ),
              
              const SizedBox(height: 24),
              
              // Hızlı Erişim
              _buildQuickActions(context),
              
              const SizedBox(height: 24),
              
              // Son Aktiviteler ve Son İçerikler
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Son Aktiviteler
                  Expanded(
                    flex: 2,
                    child: _buildRecentActivities(context, activitiesAsync),
                  ),
                  const SizedBox(width: 16),
                  
                  // Son Blog Posts ve Portfolio Projects
                  Expanded(
                    flex: 3,
                    child: Column(
                      children: [
                        _buildRecentBlogPosts(context, blogPostsAsync),
                        const SizedBox(height: 16),
                        _buildRecentPortfolioProjects(context, portfolioProjectsAsync),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatsGrid(BuildContext context, AdminStats stats) {
    return GridView.count(
      crossAxisCount: 4,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      childAspectRatio: 1.5,
      children: [
        _buildStatCard(
          context,
          title: 'Yayınlanan Blog',
          value: stats.publishedBlogs.toString(),
          icon: Icons.article,
          color: Colors.blue,
        ),
        _buildStatCard(
          context,
          title: 'Toplam Blog',
          value: stats.totalBlogs.toString(),
          icon: Icons.article_outlined,
          color: Colors.blue.shade300,
        ),
        _buildStatCard(
          context,
          title: 'Portfolio Projeler',
          value: stats.portfolioProjects.toString(),
          icon: Icons.folder,
          color: Colors.orange,
        ),
        _buildStatCard(
          context,
          title: 'Kategoriler',
          value: stats.categories.toString(),
          icon: Icons.category,
          color: Colors.green,
        ),
        _buildStatCard(
          context,
          title: 'Etiketler',
          value: stats.tags.toString(),
          icon: Icons.label,
          color: Colors.purple,
        ),
        _buildStatCard(
          context,
          title: 'Aktif Kullanıcılar',
          value: stats.activeUsers.toString(),
          icon: Icons.people,
          color: Colors.teal,
        ),
        _buildStatCard(
          context,
          title: 'Bekleyen Yorumlar',
          value: stats.pendingComments.toString(),
          icon: Icons.comment_outlined,
          color: Colors.amber,
          isAlert: stats.pendingComments > 0,
        ),
        _buildStatCard(
          context,
          title: 'Okunmamış Aktiviteler',
          value: stats.unreadActivities.toString(),
          icon: Icons.notifications_outlined,
          color: Colors.red,
          isAlert: stats.unreadActivities > 0,
        ),
      ],
    );
  }

  Widget _buildStatCard(
    BuildContext context, {
    required String title,
    required String value,
    required IconData icon,
    required Color color,
    bool isAlert = false,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 8),
            Text(
              value,
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: isAlert ? Colors.red : null,
                  ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Hızlı Erişim',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: [
                _buildQuickActionButton(
                  context,
                  icon: Icons.add,
                  label: 'Yeni Blog',
                  color: Colors.blue,
                  onTap: () {
                    // TODO: Navigate to blog create
                  },
                ),
                _buildQuickActionButton(
                  context,
                  icon: Icons.add,
                  label: 'Yeni Proje',
                  color: Colors.orange,
                  onTap: () {
                    // TODO: Navigate to portfolio create
                  },
                ),
                _buildQuickActionButton(
                  context,
                  icon: Icons.category,
                  label: 'Kategori Ekle',
                  color: Colors.green,
                  onTap: () {
                    // TODO: Navigate to category create
                  },
                ),
                _buildQuickActionButton(
                  context,
                  icon: Icons.label,
                  label: 'Etiket Ekle',
                  color: Colors.purple,
                  onTap: () {
                    // TODO: Navigate to tag create
                  },
                ),
                _buildQuickActionButton(
                  context,
                  icon: Icons.comment,
                  label: 'Yorumları Yönet',
                  color: Colors.amber,
                  onTap: () {
                    // TODO: Navigate to comments
                  },
                ),
                _buildQuickActionButton(
                  context,
                  icon: Icons.people,
                  label: 'Kullanıcıları Yönet',
                  color: Colors.teal,
                  onTap: () {
                    // TODO: Navigate to users
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActionButton(
    BuildContext context, {
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return ElevatedButton.icon(
      onPressed: onTap,
      icon: Icon(icon, size: 18),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        foregroundColor: Colors.white,
      ),
    );
  }

  Widget _buildRecentActivities(
    BuildContext context,
    AsyncValue<List<ActivityModel>> activitiesAsync,
  ) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Son Aktiviteler',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),
            activitiesAsync.when(
              data: (activities) {
                if (activities.isEmpty) {
                  return const Padding(
                    padding: EdgeInsets.all(24.0),
                    child: Center(
                      child: Text('Henüz aktivite yok'),
                    ),
                  );
                }
                return ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: activities.length,
                  separatorBuilder: (_, __) => const Divider(),
                  itemBuilder: (context, index) {
                    final activity = activities[index];
                    return ListTile(
                      dense: true,
                      leading: CircleAvatar(
                        radius: 16,
                        backgroundColor: activity.isRead
                            ? Colors.grey[300]
                            : Theme.of(context).colorScheme.primary,
                        child: Icon(
                          activity.isProjectActivity
                              ? Icons.work
                              : activity.isBlogActivity
                                  ? Icons.article
                                  : Icons.notifications,
                          size: 16,
                          color: activity.isRead ? Colors.grey[600] : Colors.white,
                        ),
                      ),
                      title: Text(
                        activity.description,
                        style: TextStyle(
                          fontWeight: activity.isRead
                              ? FontWeight.normal
                              : FontWeight.bold,
                        ),
                      ),
                      subtitle: Text(
                        DateFormatter.formatRelative(activity.createdAt),
                        style: Theme.of(context).textTheme.bodySmall,
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
                message: 'Aktiviteler yüklenirken hata oluştu',
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentBlogPosts(
    BuildContext context,
    AsyncValue<List<BlogPostModel>> blogPostsAsync,
  ) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Son Blog Yazıları',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                TextButton(
                  onPressed: () {
                    // TODO: Navigate to all blogs
                  },
                  child: const Text('Tümünü Gör'),
                ),
              ],
            ),
            const SizedBox(height: 16),
            blogPostsAsync.when(
              data: (posts) {
                if (posts.isEmpty) {
                  return const Padding(
                    padding: EdgeInsets.all(24.0),
                    child: Center(
                      child: Text('Henüz blog yazısı yok'),
                    ),
                  );
                }
                return ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: posts.length,
                  separatorBuilder: (_, __) => const Divider(),
                  itemBuilder: (context, index) {
                    final post = posts[index];
                    return ListTile(
                      dense: true,
                      leading: post.image.isNotEmpty
                          ? ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: Image.network(
                                post.image,
                                width: 50,
                                height: 50,
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => const Icon(Icons.article),
                              ),
                            )
                          : const Icon(Icons.article),
                      title: Text(
                        post.title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      subtitle: Text(
                        '${post.status} • ${DateFormatter.formatRelative(post.createdAt)}',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      trailing: post.isPublished
                          ? const Icon(Icons.check_circle, color: Colors.green, size: 20)
                          : const Icon(Icons.edit_note, color: Colors.orange, size: 20),
                      onTap: () {
                        // TODO: Navigate to blog detail
                      },
                    );
                  },
                );
              },
              loading: () => const LoadingWidget(),
              error: (error, stack) => ErrorDisplayWidget(
                message: 'Blog yazıları yüklenirken hata oluştu',
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentPortfolioProjects(
    BuildContext context,
    AsyncValue<List<PortfolioProjectModel>> projectsAsync,
  ) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Son Portfolio Projeler',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                TextButton(
                  onPressed: () {
                    // TODO: Navigate to all projects
                  },
                  child: const Text('Tümünü Gör'),
                ),
              ],
            ),
            const SizedBox(height: 16),
            projectsAsync.when(
              data: (projects) {
                if (projects.isEmpty) {
                  return const Padding(
                    padding: EdgeInsets.all(24.0),
                    child: Center(
                      child: Text('Henüz proje yok'),
                    ),
                  );
                }
                return ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: projects.length,
                  separatorBuilder: (_, __) => const Divider(),
                  itemBuilder: (context, index) {
                    final project = projects[index];
                    return ListTile(
                      dense: true,
                      leading: project.image.isNotEmpty
                          ? ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: Image.network(
                                project.image,
                                width: 50,
                                height: 50,
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => const Icon(Icons.folder),
                              ),
                            )
                          : const Icon(Icons.folder),
                      title: Text(
                        project.title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      subtitle: Text(
                        '${project.category} • ${DateFormatter.formatRelative(project.createdAt)}',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      trailing: project.featured
                          ? const Icon(Icons.star, color: Colors.amber, size: 20)
                          : null,
                      onTap: () {
                        // TODO: Navigate to project detail
                      },
                    );
                  },
                );
              },
              loading: () => const LoadingWidget(),
              error: (error, stack) => ErrorDisplayWidget(
                message: 'Projeler yüklenirken hata oluştu',
              ),
            ),
          ],
        ),
      ),
    );
  }
}
