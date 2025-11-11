import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../features/auth/data/models/user_model.dart';
import '../constants/app_constants.dart';

/// Session/Token yönetimi için service
/// Hem web hem mobile'da çalışır (SharedPreferences kullanır)
class SessionService {
  static const String _keyUserId = 'session_user_id';
  static const String _keyUserEmail = 'session_user_email';
  static const String _keyUserData = 'session_user_data';
  static const String _keyToken = 'session_token';
  static const String _keyExpireTime = 'session_expire_time';
  
  // Session süresi: 30 gün (milisaniye cinsinden)
  static const int sessionDurationDays = 30;
  static const int sessionDurationMs = sessionDurationDays * 24 * 60 * 60 * 1000;
  
  /// Token oluştur (user ID + timestamp)
  String _generateToken(String userId) {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final tokenData = {
      'userId': userId,
      'timestamp': timestamp,
    };
    return base64Encode(utf8.encode(jsonEncode(tokenData)));
  }
  
  /// Token'dan user ID'yi çıkar
  String? _getUserIdFromToken(String token) {
    try {
      final decoded = utf8.decode(base64Decode(token));
      final tokenData = jsonDecode(decoded) as Map<String, dynamic>;
      return tokenData['userId'] as String?;
    } catch (e) {
      debugPrint('⚠️ Error parsing token: $e');
      return null;
    }
  }
  
  /// Session kaydet (login başarılı olduğunda)
  Future<void> saveSession(UserModel user) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final expireTime = DateTime.now().add(const Duration(days: sessionDurationDays));
      final token = _generateToken(user.id);
      
      // User data'yı JSON olarak kaydet
      final userDataJson = jsonEncode({
        'id': user.id,
        'uid': user.uid,
        'email': user.email,
        'name': user.name,
        'displayName': user.displayName,
        'photoUrl': user.photoUrl,
        'role': user.role,
        'isActive': user.isActive,
      });
      
      await prefs.setString(_keyUserId, user.id);
      await prefs.setString(_keyUserEmail, user.email);
      await prefs.setString(_keyUserData, userDataJson);
      await prefs.setString(_keyToken, token);
      await prefs.setInt(_keyExpireTime, expireTime.millisecondsSinceEpoch);
      
      debugPrint('✅ Session saved for user: ${user.email}');
      debugPrint('✅ Session expires at: ${expireTime.toString()}');
    } catch (e) {
      debugPrint('❌ Error saving session: $e');
      rethrow;
    }
  }
  
  /// Session'ı kontrol et ve user data'yı döndür
  /// Eğer session geçerliyse user data'yı döndürür, değilse null
  Future<Map<String, dynamic>?> getSession() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      // Token var mı?
      final token = prefs.getString(_keyToken);
      if (token == null || token.isEmpty) {
        debugPrint('⚠️ No session token found');
        return null;
      }
      
      // Expire time kontrolü
      final expireTimeMs = prefs.getInt(_keyExpireTime);
      if (expireTimeMs == null) {
        debugPrint('⚠️ No expire time found');
        await clearSession();
        return null;
      }
      
      final expireTime = DateTime.fromMillisecondsSinceEpoch(expireTimeMs);
      final now = DateTime.now();
      
      if (now.isAfter(expireTime)) {
        debugPrint('⚠️ Session expired. Expire time: $expireTime, Now: $now');
        await clearSession();
        return null;
      }
      
      // User data'yı al
      final userDataJson = prefs.getString(_keyUserData);
      if (userDataJson == null || userDataJson.isEmpty) {
        debugPrint('⚠️ No user data found');
        await clearSession();
        return null;
      }
      
      final userData = jsonDecode(userDataJson) as Map<String, dynamic>;
      
      // Token'dan user ID'yi kontrol et
      final userIdFromToken = _getUserIdFromToken(token);
      if (userIdFromToken != userData['id']) {
        debugPrint('⚠️ Token user ID mismatch');
        await clearSession();
        return null;
      }
      
      debugPrint('✅ Valid session found for user: ${userData['email']}');
      debugPrint('✅ Session expires at: $expireTime');
      
      return userData;
    } catch (e) {
      debugPrint('❌ Error getting session: $e');
      await clearSession();
      return null;
    }
  }
  
  /// Session'ı temizle (logout)
  Future<void> clearSession() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_keyUserId);
      await prefs.remove(_keyUserEmail);
      await prefs.remove(_keyUserData);
      await prefs.remove(_keyToken);
      await prefs.remove(_keyExpireTime);
      debugPrint('✅ Session cleared');
    } catch (e) {
      debugPrint('❌ Error clearing session: $e');
    }
  }
  
  /// Session geçerli mi kontrol et
  Future<bool> isSessionValid() async {
    final session = await getSession();
    return session != null;
  }
  
  /// Kalan session süresini döndür (gün cinsinden)
  Future<int?> getRemainingDays() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final expireTimeMs = prefs.getInt(_keyExpireTime);
      if (expireTimeMs == null) return null;
      
      final expireTime = DateTime.fromMillisecondsSinceEpoch(expireTimeMs);
      final now = DateTime.now();
      
      if (now.isAfter(expireTime)) return 0;
      
      final difference = expireTime.difference(now);
      return difference.inDays;
    } catch (e) {
      debugPrint('❌ Error getting remaining days: $e');
      return null;
    }
  }
  
  /// Session'ı yenile (expire time'ı uzat)
  Future<void> refreshSession() async {
    try {
      final session = await getSession();
      if (session == null) {
        debugPrint('⚠️ Cannot refresh: No valid session');
        return;
      }
      
      final prefs = await SharedPreferences.getInstance();
      final expireTime = DateTime.now().add(const Duration(days: sessionDurationDays));
      await prefs.setInt(_keyExpireTime, expireTime.millisecondsSinceEpoch);
      
      debugPrint('✅ Session refreshed. New expire time: $expireTime');
    } catch (e) {
      debugPrint('❌ Error refreshing session: $e');
    }
  }
}

