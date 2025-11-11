import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../../notifications/data/models/activity_model.dart';
import '../../projects/data/models/project_model.dart';

// Client Hub İstatistikleri için provider
final adminStatsProvider = FutureProvider<AdminStats>((ref) async {
  final firestore = FirebaseFirestore.instance;
  
  // Paralel olarak tüm sayımları yap
  final results = await Future.wait([
    // Total Client Hub Projects
    firestore
        .collection(AppConstants.clientHubProjectsCollection)
        .count()
        .get(),
    
    // Active Projects (InProgress)
    firestore
        .collection(AppConstants.clientHubProjectsCollection)
        .where('status', isEqualTo: AppConstants.statusInProgress)
        .count()
        .get(),
    
    // Completed Projects
    firestore
        .collection(AppConstants.clientHubProjectsCollection)
        .where('status', isEqualTo: AppConstants.statusDelivered)
        .count()
        .get(),
    
    // Total Tasks (tüm projelerdeki task'lar)
    // Not: Subcollection count için tüm projeleri alıp task sayısını hesaplamalıyız
    firestore
        .collection(AppConstants.clientHubProjectsCollection)
        .get(),
    
    // Active users (Client Hub için)
    firestore
        .collection(AppConstants.usersCollection)
        .where('isActive', isEqualTo: true)
        .where('role', whereIn: [AppConstants.roleAdmin, AppConstants.roleClient])
        .count()
        .get(),
    
    // Inactive users
    firestore
        .collection(AppConstants.usersCollection)
        .where('isActive', isEqualTo: false)
        .count()
        .get(),
    
    // Unread notifications
    firestore
        .collection(AppConstants.notificationsCollection)
        .where('isRead', isEqualTo: false)
        .count()
        .get(),
    
    // Total notifications
    firestore
        .collection(AppConstants.notificationsCollection)
        .count()
        .get(),
  ]);
  
  // Task sayısını hesapla (tüm projelerdeki task'ları topla)
  final projectsSnapshot = results[3] as QuerySnapshot;
  int totalTasks = 0;
  int completedTasks = 0;
  
  for (var projectDoc in projectsSnapshot.docs) {
    try {
      final tasksSnapshot = await firestore
          .collection(AppConstants.clientHubProjectsCollection)
          .doc(projectDoc.id)
          .collection(AppConstants.tasksCollection)
          .get();
      
      totalTasks += tasksSnapshot.docs.length;
      completedTasks += tasksSnapshot.docs.where((doc) {
        final data = doc.data();
        return data['completed'] == true;
      }).length;
    } catch (e) {
      // Subcollection yoksa devam et
      continue;
    }
  }
  
  return AdminStats(
    totalProjects: (results[0] as AggregateQuerySnapshot).count ?? 0,
    activeProjects: (results[1] as AggregateQuerySnapshot).count ?? 0,
    completedProjects: (results[2] as AggregateQuerySnapshot).count ?? 0,
    totalTasks: totalTasks,
    completedTasks: completedTasks,
    activeUsers: (results[4] as AggregateQuerySnapshot).count ?? 0,
    inactiveUsers: (results[5] as AggregateQuerySnapshot).count ?? 0,
    unreadNotifications: (results[6] as AggregateQuerySnapshot).count ?? 0,
    totalNotifications: (results[7] as AggregateQuerySnapshot).count ?? 0,
  );
});

// Son aktiviteler için provider (Client Hub activities)
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

// Son Client Hub Projects için provider
final recentProjectsProvider = StreamProvider<List<ProjectModel>>((ref) {
  return FirebaseFirestore.instance
      .collection(AppConstants.clientHubProjectsCollection)
      .orderBy('last_update', descending: true)
      .limit(5)
      .snapshots()
      .map((snapshot) => snapshot.docs
          .map((doc) => ProjectModel.fromFirestore(doc))
          .toList());
});

class AdminStats {
  final int totalProjects;
  final int activeProjects;
  final int completedProjects;
  final int totalTasks;
  final int completedTasks;
  final int activeUsers;
  final int inactiveUsers;
  final int unreadNotifications;
  final int totalNotifications;

  AdminStats({
    required this.totalProjects,
    required this.activeProjects,
    required this.completedProjects,
    required this.totalTasks,
    required this.completedTasks,
    required this.activeUsers,
    required this.inactiveUsers,
    required this.unreadNotifications,
    required this.totalNotifications,
  });
}

