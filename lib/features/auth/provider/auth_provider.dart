import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/firestore_auth_service.dart';
import '../../../../core/services/session_service.dart';
import '../data/models/user_model.dart';

final firestoreAuthServiceProvider = Provider<FirestoreAuthService>((ref) {
  return FirestoreAuthService();
});

final sessionServiceProvider = Provider<SessionService>((ref) {
  return SessionService();
});

// Current user state (Firestore-based)
final currentUserProvider = StateNotifierProvider<CurrentUserNotifier, UserModel?>((ref) {
  return CurrentUserNotifier(ref);
});

class CurrentUserNotifier extends StateNotifier<UserModel?> {
  CurrentUserNotifier(Ref ref) : super(null);
  
  void setUser(UserModel? user) {
    state = user;
  }
  
  void clearUser() {
    state = null;
  }
}

// User profile stream (real-time updates)
final userProfileProvider = StreamProvider<UserModel?>((ref) {
  final currentUser = ref.watch(currentUserProvider);
  
  if (currentUser == null) {
    return Stream.value(null);
  }
  
  return FirebaseFirestore.instance
      .collection(AppConstants.usersCollection)
      .doc(currentUser.id)
      .snapshots()
      .map((doc) {
    if (!doc.exists) return null;
    return UserModel.fromFirestore(doc);
  });
});

final authControllerProvider = StateNotifierProvider<AuthController, AsyncValue<void>>((ref) {
  return AuthController(ref);
});

class AuthController extends StateNotifier<AsyncValue<void>> {
  final FirestoreAuthService _authService;
  final SessionService _sessionService;
  final Ref _ref;

  AuthController(Ref ref)
      : _authService = ref.read(firestoreAuthServiceProvider),
        _sessionService = ref.read(sessionServiceProvider),
        _ref = ref,
        super(const AsyncValue.data(null));

  Future<void> signInWithEmailAndPassword({
    required String email,
    required String password,
  }) async {
    state = const AsyncValue.loading();
    try {
      final userModel = await _authService.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      
      // Session kaydet
      await _sessionService.saveSession(userModel);
      
      // Current user'ı set et
      _ref.read(currentUserProvider.notifier).setUser(userModel);
      
      state = const AsyncValue.data(null);
    } catch (e, stackTrace) {
      state = AsyncValue.error(e, stackTrace);
      rethrow;
    }
  }

  Future<void> signUpWithEmailAndPassword({
    required String email,
    required String password,
    required String name,
  }) async {
    state = const AsyncValue.loading();
    try {
      final userModel = await _authService.signUpWithEmailAndPassword(
        email: email,
        password: password,
        name: name,
      );
      
      // Session kaydet
      await _sessionService.saveSession(userModel);
      
      // Current user'ı set et
      _ref.read(currentUserProvider.notifier).setUser(userModel);
      
      state = const AsyncValue.data(null);
    } catch (e, stackTrace) {
      state = AsyncValue.error(e, stackTrace);
      rethrow;
    }
  }

  Future<void> signOut() async {
    state = const AsyncValue.loading();
    try {
      await _authService.signOut();
      await _sessionService.clearSession();
      _ref.read(currentUserProvider.notifier).clearUser();
      state = const AsyncValue.data(null);
    } catch (e, stackTrace) {
      state = AsyncValue.error(e, stackTrace);
      rethrow;
    }
  }
  
  /// Session'dan kullanıcıyı yükle (app başlangıcında)
  Future<void> loadSession() async {
    try {
      final sessionData = await _sessionService.getSession();
      if (sessionData != null) {
        // Firestore'dan güncel user data'yı al
        final userId = sessionData['id'] as String;
        final userModel = await _authService.getUserById(userId);
        
        if (userModel != null && userModel.isActive) {
          // Session'ı yenile (expire time'ı uzat)
          await _sessionService.refreshSession();
          
          // Current user'ı set et
          _ref.read(currentUserProvider.notifier).setUser(userModel);
          debugPrint('✅ Session loaded for user: ${userModel.email}');
        } else {
          // Kullanıcı bulunamadı veya aktif değil
          await _sessionService.clearSession();
          debugPrint('⚠️ User not found or inactive, session cleared');
        }
      }
    } catch (e) {
      debugPrint('❌ Error loading session: $e');
      await _sessionService.clearSession();
    }
  }
}

