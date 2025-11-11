import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:crypto/crypto.dart';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import '../../features/auth/data/models/user_model.dart';
import '../../core/constants/app_constants.dart';

/// Firestore-based authentication service
/// Kullanıcılar Firestore'daki users koleksiyonunda tutuluyor
class FirestoreAuthService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  UserModel? _currentUser;
  
  UserModel? get currentUser => _currentUser;
  
  /// Email ve password ile login
  Future<UserModel> signInWithEmailAndPassword({
    required String email,
    required String password,
  }) async {
    try {
      debugPrint('🔐 Firestore Auth: Login attempt for $email');
      
      // Email ile kullanıcıyı bul
      final querySnapshot = await _firestore
          .collection(AppConstants.usersCollection)
          .where('email', isEqualTo: email.trim().toLowerCase())
          .limit(1)
          .get();
      
      if (querySnapshot.docs.isEmpty) {
        throw Exception('Kullanıcı bulunamadı');
      }
      
      final doc = querySnapshot.docs.first;
      final userModel = UserModel.fromFirestore(doc);
      
      // Kullanıcı aktif mi?
      if (!userModel.isActive) {
        throw Exception('Bu hesap devre dışı bırakılmış');
      }
      
      // Password kontrolü
      // Not: Mevcut sistemde password plain text veya hash olabilir
      // Güvenlik için hash karşılaştırması yapıyoruz
      final storedPassword = userModel.password;
      if (storedPassword == null || storedPassword.isEmpty) {
        throw Exception('Şifre bulunamadı');
      }
      
      // Password hash'lenmiş mi kontrol et
      final isPasswordValid = _verifyPassword(password, storedPassword);
      if (!isPasswordValid) {
        // Login attempt sayısını artır
        await _incrementLoginAttempts(userModel.id);
        throw Exception('Yanlış şifre');
      }
      
      // Login başarılı - lastLoginAt güncelle
      await _updateLastLogin(userModel.id);
      
      // Current user'ı set et
      _currentUser = userModel;
      
      debugPrint('✅ Firestore Auth: Login successful for ${userModel.email}');
      return userModel;
    } catch (e) {
      debugPrint('❌ Firestore Auth Error: $e');
      rethrow;
    }
  }
  
  /// Password doğrulama
  /// Mevcut sistemde password hash'lenmiş veya plain text olabilir
  bool _verifyPassword(String inputPassword, String storedPassword) {
    // Eğer stored password hash ise (64 karakter hex string)
    if (storedPassword.length == 64) {
      // SHA256 hash ile karşılaştır
      final inputHash = sha256.convert(utf8.encode(inputPassword)).toString();
      return inputHash == storedPassword;
    } else {
      // Plain text karşılaştırma (güvenlik açığı ama mevcut sistem böyle)
      return inputPassword == storedPassword;
    }
  }
  
  /// Password hash'leme (SHA256)
  String _hashPassword(String password) {
    return sha256.convert(utf8.encode(password)).toString();
  }
  
  /// Yeni kullanıcı oluştur
  Future<UserModel> signUpWithEmailAndPassword({
    required String email,
    required String password,
    required String name,
    String role = AppConstants.roleVisitor,
  }) async {
    try {
      debugPrint('🔐 Firestore Auth: Signup attempt for $email');
      
      // Email zaten kullanılıyor mu kontrol et
      final querySnapshot = await _firestore
          .collection(AppConstants.usersCollection)
          .where('email', isEqualTo: email.trim().toLowerCase())
          .limit(1)
          .get();
      
      if (querySnapshot.docs.isNotEmpty) {
        throw Exception('Bu email adresi zaten kullanılıyor');
      }
      
      // Yeni kullanıcı oluştur
      final userId = _firestore.collection(AppConstants.usersCollection).doc().id;
      final hashedPassword = _hashPassword(password);
      
      final userModel = UserModel(
        id: userId,
        uid: userId,
        email: email.trim().toLowerCase(),
        name: name,
        displayName: name,
        role: role,
        password: hashedPassword, // Hash'lenmiş password kaydet
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        loginAttempts: 0,
        isActive: true,
      );
      
      // Firestore'a kaydet
      await _firestore
          .collection(AppConstants.usersCollection)
          .doc(userId)
          .set(userModel.toFirestore());
      
      _currentUser = userModel;
      
      debugPrint('✅ Firestore Auth: Signup successful for ${userModel.email}');
      return userModel;
    } catch (e) {
      debugPrint('❌ Firestore Auth Signup Error: $e');
      rethrow;
    }
  }
  
  /// Last login güncelle
  /// Not: Firestore rules'da login sonrası güncelleme için özel izin var
  Future<void> _updateLastLogin(String userId) async {
    try {
      await _firestore
          .collection(AppConstants.usersCollection)
          .doc(userId)
          .update({
        'lastLoginAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
        'loginAttempts': 0, // Başarılı login'de reset
      });
      debugPrint('✅ Last login updated for user: $userId');
    } catch (e) {
      debugPrint('⚠️ Could not update lastLoginAt: $e');
      // Login başarılı oldu, sadece lastLoginAt güncellenemedi (kritik değil)
    }
  }
  
  /// Login attempt sayısını artır
  Future<void> _incrementLoginAttempts(String userId) async {
    try {
      await _firestore
          .collection(AppConstants.usersCollection)
          .doc(userId)
          .update({
        'loginAttempts': FieldValue.increment(1),
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      debugPrint('⚠️ Could not increment loginAttempts: $e');
      // Kritik değil, devam et
    }
  }
  
  /// Logout
  Future<void> signOut() async {
    _currentUser = null;
    debugPrint('✅ Firestore Auth: Logged out');
  }
  
  /// Kullanıcıyı ID ile getir
  Future<UserModel?> getUserById(String userId) async {
    try {
      final doc = await _firestore
          .collection(AppConstants.usersCollection)
          .doc(userId)
          .get();
      
      if (!doc.exists) return null;
      return UserModel.fromFirestore(doc);
    } catch (e) {
      debugPrint('❌ Error getting user: $e');
      return null;
    }
  }
  
  /// Kullanıcıyı email ile getir
  Future<UserModel?> getUserByEmail(String email) async {
    try {
      final querySnapshot = await _firestore
          .collection(AppConstants.usersCollection)
          .where('email', isEqualTo: email.trim().toLowerCase())
          .limit(1)
          .get();
      
      if (querySnapshot.docs.isEmpty) return null;
      return UserModel.fromFirestore(querySnapshot.docs.first);
    } catch (e) {
      debugPrint('❌ Error getting user by email: $e');
      return null;
    }
  }
}

