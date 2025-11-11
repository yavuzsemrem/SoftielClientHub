import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/firestore_auth_service.dart';
import '../data/models/user_model.dart';

final firestoreAuthServiceProvider = Provider<FirestoreAuthService>((ref) {
  return FirestoreAuthService();
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
  final Ref _ref;

  AuthController(Ref ref)
      : _authService = ref.read(firestoreAuthServiceProvider),
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
      _ref.read(currentUserProvider.notifier).clearUser();
      state = const AsyncValue.data(null);
    } catch (e, stackTrace) {
      state = AsyncValue.error(e, stackTrace);
      rethrow;
    }
  }
}

