import 'package:cloud_firestore/cloud_firestore.dart';

class SessionModel {
  final String id;
  final String sessionId;
  final String userId;
  final String email;
  final String displayName;
  final String role;
  final String ipAddress;
  final String userAgent;
  final DateTime loginTime;
  final DateTime? lastActivity;
  final bool isActive;

  SessionModel({
    required this.id,
    required this.sessionId,
    required this.userId,
    required this.email,
    required this.displayName,
    required this.role,
    this.ipAddress = 'unknown',
    this.userAgent = '',
    required this.loginTime,
    this.lastActivity,
    this.isActive = true,
  });

  factory SessionModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    
    // loginTime string veya Timestamp olabilir
    DateTime parseLoginTime() {
      if (data['loginTime'] == null) return DateTime.now();
      if (data['loginTime'] is Timestamp) {
        return (data['loginTime'] as Timestamp).toDate();
      }
      if (data['loginTime'] is String) {
        return DateTime.parse(data['loginTime'] as String);
      }
      return DateTime.now();
    }
    
    // lastActivity string veya Timestamp olabilir
    DateTime? parseLastActivity() {
      if (data['lastActivity'] == null) return null;
      if (data['lastActivity'] is Timestamp) {
        return (data['lastActivity'] as Timestamp).toDate();
      }
      if (data['lastActivity'] is String) {
        return DateTime.parse(data['lastActivity'] as String);
      }
      return null;
    }
    
    return SessionModel(
      id: doc.id,
      sessionId: data['sessionId'] ?? '',
      userId: data['userId'] ?? '',
      email: data['email'] ?? '',
      displayName: data['displayName'] ?? '',
      role: data['role'] ?? '',
      ipAddress: data['ipAddress'] ?? 'unknown',
      userAgent: data['userAgent'] ?? '',
      loginTime: parseLoginTime(),
      lastActivity: parseLastActivity(),
      isActive: data['isActive'] ?? true,
    );
  }

  Map<String, dynamic> toFirestore() {
    final map = <String, dynamic>{
      'sessionId': sessionId,
      'userId': userId,
      'email': email,
      'displayName': displayName,
      'role': role,
      'ipAddress': ipAddress,
      'userAgent': userAgent,
      'isActive': isActive,
    };
    
    // Timestamps
    map['loginTime'] = Timestamp.fromDate(loginTime);
    if (lastActivity != null) {
      map['lastActivity'] = Timestamp.fromDate(lastActivity!);
    }
    
    return map;
  }
  
  // Helper methods
  Duration? get sessionDuration {
    if (lastActivity == null) return null;
    return lastActivity!.difference(loginTime);
  }
  
  bool get isExpired {
    if (lastActivity == null) return false;
    final now = DateTime.now();
    final difference = now.difference(lastActivity!);
    // 30 dakikadan fazla inaktifse expired sayılır
    return difference.inMinutes > 30;
  }
}

