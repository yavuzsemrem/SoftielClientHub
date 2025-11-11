import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../features/auth/presentation/login_page.dart';
import '../features/auth/presentation/signup_page.dart';
import '../features/auth/provider/auth_provider.dart';
import '../features/dashboard/presentation/dashboard_page.dart';
import '../features/projects/presentation/project_detail_page.dart';
import '../features/projects/presentation/projects_list_page.dart';
import '../features/users/presentation/users_page.dart';
import '../features/notifications/presentation/notifications_page.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final currentUser = ref.watch(currentUserProvider);
  
  return GoRouter(
    initialLocation: '/login',
    redirect: (context, state) {
      final isLoggedIn = currentUser != null;
      final isGoingToLogin = state.matchedLocation == '/login' || 
                             state.matchedLocation == '/signup';
      
      // If not logged in and trying to access protected routes
      if (!isLoggedIn && !isGoingToLogin) {
        return '/login';
      }
      
      // If logged in and trying to access login/signup
      if (isLoggedIn && isGoingToLogin) {
        return '/dashboard';
      }
      
      return null; // No redirect needed
    },
    routes: [
      GoRoute(
        path: '/login',
        pageBuilder: (context, state) => NoTransitionPage(
          key: state.pageKey,
          child: const LoginPage(),
        ),
      ),
      GoRoute(
        path: '/signup',
        pageBuilder: (context, state) => NoTransitionPage(
          key: state.pageKey,
          child: const SignupPage(),
        ),
      ),
      GoRoute(
        path: '/dashboard',
        pageBuilder: (context, state) => NoTransitionPage(
          key: state.pageKey,
          child: const DashboardPage(),
        ),
      ),
      GoRoute(
        path: '/projects',
        pageBuilder: (context, state) => NoTransitionPage(
          key: state.pageKey,
          child: const ProjectsListPage(),
        ),
      ),
      GoRoute(
        path: '/project/:id',
        pageBuilder: (context, state) {
          final projectId = state.pathParameters['id']!;
          return NoTransitionPage(
            key: state.pageKey,
            child: ProjectDetailPage(projectId: projectId),
          );
        },
      ),
      GoRoute(
        path: '/users',
        pageBuilder: (context, state) => NoTransitionPage(
          key: state.pageKey,
          child: const UsersPage(),
        ),
      ),
      GoRoute(
        path: '/notifications',
        pageBuilder: (context, state) => NoTransitionPage(
          key: state.pageKey,
          child: const NotificationsPage(),
        ),
      ),
    ],
  );
});
