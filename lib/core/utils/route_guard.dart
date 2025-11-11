import 'package:go_router/go_router.dart';
import '../../features/auth/data/models/user_model.dart';
import '../../core/constants/app_constants.dart';

class RouteGuard {
  /// Admin-only route kontrolü
  static String? checkAdminAccess(UserModel? user, String route) {
    if (user == null) return '/login';
    if (!user.isAdmin) return '/dashboard'; // Admin değilse dashboard'a yönlendir
    return null; // Admin ise erişim izni var
  }

  /// Client/Visitor route kontrolü
  static String? checkClientAccess(UserModel? user, String route) {
    if (user == null) return '/login';
    // Client ve Visitor erişebilir
    return null;
  }

  /// Admin veya Author route kontrolü
  static String? checkAuthorAccess(UserModel? user, String route) {
    if (user == null) return '/login';
    if (!user.canPublish) return '/dashboard';
    return null;
  }
}

