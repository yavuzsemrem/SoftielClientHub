import 'package:cloud_firestore/cloud_firestore.dart';

class ActivityMetadata {
  final String action; // "updated", "created", "deleted", etc.
  final String type; // "project_updated", "blog_published", etc.
  final String userId; // "system" veya user ID
  final String userName; // "System" veya user name
  final String? targetId; // İlgili doküman ID'si
  final String? title; // Aktivite başlığı
  final String? projectTitle; // Proje başlığı (eğer proje ile ilgiliyse)
  final String? projectStatus; // Proje durumu (eğer proje ile ilgiliyse)

  ActivityMetadata({
    required this.action,
    required this.type,
    required this.userId,
    required this.userName,
    this.targetId,
    this.title,
    this.projectTitle,
    this.projectStatus,
  });

  Map<String, dynamic> toMap() {
    final map = <String, dynamic>{
      'action': action,
      'type': type,
      'userId': userId,
      'userName': userName,
    };
    
    if (targetId != null) map['targetId'] = targetId;
    if (title != null) map['title'] = title;
    if (projectTitle != null) map['projectTitle'] = projectTitle;
    if (projectStatus != null) map['projectStatus'] = projectStatus;
    
    return map;
  }

  factory ActivityMetadata.fromMap(Map<String, dynamic>? map) {
    if (map == null) {
      return ActivityMetadata(
        action: '',
        type: '',
        userId: 'system',
        userName: 'System',
      );
    }
    
    return ActivityMetadata(
      action: map['action'] ?? '',
      type: map['type'] ?? '',
      userId: map['userId'] ?? 'system',
      userName: map['userName'] ?? 'System',
      targetId: map['targetId'],
      title: map['title'],
      projectTitle: map['projectTitle'],
      projectStatus: map['projectStatus'],
    );
  }
}

class ActivityModel {
  final String id;
  final String description;
  final ActivityMetadata metadata;
  final bool isRead;
  final DateTime createdAt;

  ActivityModel({
    required this.id,
    required this.description,
    required this.metadata,
    this.isRead = false,
    required this.createdAt,
  });

  factory ActivityModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return ActivityModel(
      id: doc.id,
      description: data['description'] ?? '',
      metadata: ActivityMetadata.fromMap(data['metadata']),
      isRead: data['isRead'] ?? false,
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'description': description,
      'metadata': metadata.toMap(),
      'isRead': isRead,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
  
  // Helper methods
  bool get isProjectActivity => metadata.type.startsWith('project_');
  bool get isBlogActivity => metadata.type.startsWith('blog_');
  bool get isSystemActivity => metadata.userId == 'system';
}

