import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../../notifications/data/models/activity_model.dart';
import '../../blog/data/models/blog_post_model.dart';
import '../../portfolio/data/models/portfolio_project_model.dart';

// İstatistikler için provider
final adminStatsProvider = FutureProvider<AdminStats>((ref) async {
  final firestore = FirebaseFirestore.instance;
  
  // Paralel olarak tüm sayımları yap
  final results = await Future.wait([
    // Blog posts sayısı
    firestore
        .collection(AppConstants.blogsCollection)
        .where('status', isEqualTo: 'published')
        .count()
        .get(),
    
    // Tüm blog posts (draft dahil)
    firestore
        .collection(AppConstants.blogsCollection)
        .count()
        .get(),
    
    // Portfolio projects sayısı
    firestore
        .collection(AppConstants.projectsCollection)
        .count()
        .get(),
    
    // Categories sayısı
    firestore
        .collection(AppConstants.categoriesCollection)
        .where('status', isEqualTo: 'active')
        .count()
        .get(),
    
    // Tags sayısı
    firestore
        .collection(AppConstants.tagsCollection)
        .where('isActive', isEqualTo: true)
        .count()
        .get(),
    
    // Users sayısı
    firestore
        .collection(AppConstants.usersCollection)
        .where('isActive', isEqualTo: true)
        .count()
        .get(),
    
    // Comments sayısı (pending)
    firestore
        .collection(AppConstants.commentsCollection)
        .where('status', isEqualTo: AppConstants.commentStatusPending)
        .count()
        .get(),
    
    // Activities sayısı (unread)
    firestore
        .collection(AppConstants.activitiesCollection)
        .where('isRead', isEqualTo: false)
        .count()
        .get(),
  ]);
  
  return AdminStats(
    publishedBlogs: results[0].count ?? 0,
    totalBlogs: results[1].count ?? 0,
    portfolioProjects: results[2].count ?? 0,
    categories: results[3].count ?? 0,
    tags: results[4].count ?? 0,
    activeUsers: results[5].count ?? 0,
    pendingComments: results[6].count ?? 0,
    unreadActivities: results[7].count ?? 0,
  );
});

// Son aktiviteler için provider
final recentActivitiesProvider = StreamProvider<List<ActivityModel>>((ref) {
  return FirebaseFirestore.instance
      .collection(AppConstants.activitiesCollection)
      .orderBy('createdAt', descending: true)
      .limit(10)
      .snapshots()
      .map((snapshot) => snapshot.docs
          .map((doc) => ActivityModel.fromFirestore(doc))
          .toList());
});

// Son blog posts için provider
final recentBlogPostsProvider = StreamProvider<List<BlogPostModel>>((ref) {
  return FirebaseFirestore.instance
      .collection(AppConstants.blogsCollection)
      .orderBy('createdAt', descending: true)
      .limit(5)
      .snapshots()
      .map((snapshot) => snapshot.docs
          .map((doc) => BlogPostModel.fromFirestore(doc))
          .toList());
});

// Son portfolio projects için provider
final recentPortfolioProjectsProvider = StreamProvider<List<PortfolioProjectModel>>((ref) {
  return FirebaseFirestore.instance
      .collection(AppConstants.projectsCollection)
      .orderBy('createdAt', descending: true)
      .limit(5)
      .snapshots()
      .map((snapshot) => snapshot.docs
          .map((doc) => PortfolioProjectModel.fromFirestore(doc))
          .toList());
});

class AdminStats {
  final int publishedBlogs;
  final int totalBlogs;
  final int portfolioProjects;
  final int categories;
  final int tags;
  final int activeUsers;
  final int pendingComments;
  final int unreadActivities;

  AdminStats({
    required this.publishedBlogs,
    required this.totalBlogs,
    required this.portfolioProjects,
    required this.categories,
    required this.tags,
    required this.activeUsers,
    required this.pendingComments,
    required this.unreadActivities,
  });
}

