import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';

class FirebaseAuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;

  User? get currentUser => _auth.currentUser;
  
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  Future<UserCredential> signInWithEmailAndPassword({
    required String email,
    required String password,
  }) async {
    try {
      // Email formatını kontrol et
      final trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail.contains('@') || !trimmedEmail.contains('.')) {
        throw FirebaseAuthException(
          code: 'invalid-email',
          message: 'Geçersiz email formatı',
        );
      }

      // Debug: Login denemesi başlıyor
      debugPrint('🔐 Login attempt: $trimmedEmail');

      final credential = await _auth.signInWithEmailAndPassword(
        email: trimmedEmail,
        password: password,
      );

      debugPrint('✅ Login successful: ${credential.user?.uid}');
      return credential;
    } on FirebaseAuthException catch (e) {
      // Detaylı hata loglama
      debugPrint('❌ Firebase Auth Error:');
      debugPrint('   Code: ${e.code}');
      debugPrint('   Message: ${e.message}');
      debugPrint('   Email: $email');
      
      // Özel hata mesajları
      if (e.code == 'operation-not-allowed') {
        debugPrint('⚠️ Email/Password provider etkin değil!');
        debugPrint('   Firebase Console > Authentication > Sign-in method > Email/Password > Enable');
      } else if (e.code == 'invalid-api-key') {
        debugPrint('⚠️ API key geçersiz veya kısıtlanmış!');
        debugPrint('   Google Cloud Console > APIs & Services > Credentials kontrol edin');
      } else if (e.code == 'unauthorized-domain') {
        debugPrint('⚠️ Domain authorized değil!');
        debugPrint('   Firebase Console > Authentication > Settings > Authorized domains kontrol edin');
      }
      
      rethrow;
    } catch (e, stackTrace) {
      // Diğer hataları Firebase Auth exception'a çevir
      debugPrint('❌ Unknown error: $e');
      debugPrint('   Stack trace: $stackTrace');
      throw FirebaseAuthException(
        code: 'unknown-error',
        message: e.toString(),
      );
    }
  }

  Future<UserCredential> signUpWithEmailAndPassword({
    required String email,
    required String password,
  }) async {
    return await _auth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );
  }

  Future<void> sendPasswordResetEmail(String email) async {
    await _auth.sendPasswordResetEmail(email: email);
  }

  Future<void> sendSignInLinkToEmail({
    required String email,
    required ActionCodeSettings actionCodeSettings,
  }) async {
    await _auth.sendSignInLinkToEmail(
      email: email,
      actionCodeSettings: actionCodeSettings,
    );
  }

  Future<void> signOut() async {
    await _auth.signOut();
  }
}

