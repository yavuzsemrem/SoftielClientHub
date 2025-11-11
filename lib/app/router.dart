import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../features/auth/presentation/login_page.dart';
import '../features/auth/presentation/signup_page.dart';
import '../features/auth/provider/auth_provider.dart';
import '../features/dashboard/presentation/dashboard_page.dart';
import '../features/projects/presentation/project_detail_page.dart';

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
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/signup',
        builder: (context, state) => const SignupPage(),
      ),
      GoRoute(
        path: '/dashboard',
        builder: (context, state) => const DashboardPage(),
      ),
      GoRoute(
        path: '/project/:id',
        builder: (context, state) {
          final projectId = state.pathParameters['id']!;
          return ProjectDetailPage(projectId: projectId);
        },
      ),
    ],
  );
});
