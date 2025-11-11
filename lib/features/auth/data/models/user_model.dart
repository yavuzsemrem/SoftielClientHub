import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/constants/app_constants.dart';

class UserPermissions {
  final bool canPublish;
  final bool canModerate;
  final bool canManageUsers;

  UserPermissions({
    this.canPublish = false,
    this.canModerate = false,
    this.canManageUsers = false,
  });

  Map<String, dynamic> toMap() {
    return {
      'canPublish': canPublish,
      'canModerate': canModerate,
      'canManageUsers': canManageUsers,
    };
  }

  factory UserPermissions.fromMap(Map<String, dynamic>? map) {
    if (map == null) return UserPermissions();
    return UserPermissions(
      canPublish: map['canPublish'] ?? false,
      canModerate: map['canModerate'] ?? false,
      canManageUsers: map['canManageUsers'] ?? false,
    );
  }
}

class UserStats {
  final int postsCount;
  final int commentsCount;

  UserStats({
    this.postsCount = 0,
    this.commentsCount = 0,
  });

  Map<String, dynamic> toMap() {
    return {
      'postsCount': postsCount,
      'commentsCount': commentsCount,
    };
  }

  factory UserStats.fromMap(Map<String, dynamic>? map) {
    if (map == null) return UserStats();
    return UserStats(
      postsCount: map['postsCount'] ?? 0,
      commentsCount: map['commentsCount'] ?? 0,
    );
  }
}

class UserModel {
  final String id;
  final String uid; // Firebase Auth UID
  final String email;
  final String name;
  final String? displayName;
  final String? photoUrl; // Mevcut verilerde yok ama eklenebilir
  final String role;
  final String bio; // Mevcut yapıda string (boş string olabilir)
  final String? password; // Mevcut yapıda var (eski sistem veya başka amaç için)
  final String? website; // Mevcut verilerde yok ama eklenebilir
  final Map<String, String>? socialLinks; // Mevcut verilerde yok ama eklenebilir
  final UserPermissions permissions; // Mevcut verilerde yok ama eklenebilir
  final UserStats stats; // Mevcut verilerde yok ama eklenebilir
  final DateTime createdAt;
  final DateTime? updatedAt;
  final DateTime? lastLoginAt;
  final int loginAttempts;
  final bool isActive;

  UserModel({
    required this.id,
    required this.uid,
    required this.email,
    required this.name,
    this.displayName,
    this.photoUrl,
    required this.role,
    this.bio = '',
    this.password,
    this.website,
    this.socialLinks,
    UserPermissions? permissions,
    UserStats? stats,
    required this.createdAt,
    this.updatedAt,
    this.lastLoginAt,
    this.loginAttempts = 0,
    this.isActive = true,
  })  : permissions = permissions ?? UserPermissions(),
        stats = stats ?? UserStats();

  bool get isAdmin => role == AppConstants.roleAdmin;
  bool get isAuthor => role == AppConstants.roleAuthor;
  bool get isClient => role == AppConstants.roleClient;
  bool get isVisitor => role == AppConstants.roleVisitor;
  bool get canPublish => isAdmin || isAuthor || permissions.canPublish;
  bool get canModerate => isAdmin || permissions.canModerate;
  bool get canManageUsers => isAdmin || permissions.canManageUsers;

  factory UserModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    
    // createdAt string olarak gelebilir veya Timestamp olabilir
    DateTime parseCreatedAt() {
      if (data['createdAt'] == null) return DateTime.now();
      if (data['createdAt'] is Timestamp) {
        return (data['createdAt'] as Timestamp).toDate();
      }
      if (data['createdAt'] is String) {
        return DateTime.parse(data['createdAt'] as String);
      }
      return DateTime.now();
    }
    
    return UserModel(
      id: doc.id,
      uid: data['uid'] ?? doc.id,
      email: data['email'] ?? '',
      name: data['name'] ?? '',
      displayName: data['displayName'],
      photoUrl: data['photoUrl'],
      role: data['role'] ?? AppConstants.roleVisitor,
      bio: data['bio'] ?? '',
      password: data['password'], // Mevcut yapıda var
      website: data['website'],
      socialLinks: data['socialLinks'] != null
          ? Map<String, String>.from(data['socialLinks'])
          : null,
      permissions: UserPermissions.fromMap(data['permissions']),
      stats: UserStats.fromMap(data['stats']),
      createdAt: parseCreatedAt(),
      updatedAt: (data['updatedAt'] as Timestamp?)?.toDate(),
      lastLoginAt: (data['lastLoginAt'] as Timestamp?)?.toDate(),
      loginAttempts: data['loginAttempts'] ?? 0,
      isActive: data['isActive'] ?? true,
    );
  }

  Map<String, dynamic> toFirestore() {
    final map = <String, dynamic>{
      'uid': uid,
      'email': email,
      'name': name,
      'displayName': displayName ?? name,
      'role': role,
      'bio': bio,
      'isActive': isActive,
      'loginAttempts': loginAttempts,
    };
    
    // Optional fields - sadece null değilse ekle
    if (photoUrl != null) map['photoUrl'] = photoUrl;
    if (password != null) map['password'] = password;
    if (website != null) map['website'] = website;
    if (socialLinks != null) map['socialLinks'] = socialLinks;
    
    // Timestamps
    map['createdAt'] = Timestamp.fromDate(createdAt);
    if (updatedAt != null) {
      map['updatedAt'] = Timestamp.fromDate(updatedAt!);
    }
    if (lastLoginAt != null) {
      map['lastLoginAt'] = Timestamp.fromDate(lastLoginAt!);
    }
    
    // Yeni alanlar (mevcut verilerde yok ama yeni kullanıcılar için)
    if (permissions.canPublish || permissions.canModerate || permissions.canManageUsers) {
      map['permissions'] = permissions.toMap();
    }
    if (stats.postsCount > 0 || stats.commentsCount > 0) {
      map['stats'] = stats.toMap();
    }
    
    return map;
  }
}

