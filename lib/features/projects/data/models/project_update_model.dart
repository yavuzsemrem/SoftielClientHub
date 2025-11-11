import 'package:cloud_firestore/cloud_firestore.dart';

class ProjectUpdateModel {
  final String id;
  final String title;
  final String? description;
  final int progressChange;
  final DateTime createdAt;

  ProjectUpdateModel({
    required this.id,
    required this.title,
    this.description,
    required this.progressChange,
    required this.createdAt,
  });

  factory ProjectUpdateModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return ProjectUpdateModel(
      id: doc.id,
      title: data['title'] ?? '',
      description: data['description'],
      progressChange: data['progress_change'] ?? 0,
      createdAt: (data['created_at'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'title': title,
      'description': description,
      'progress_change': progressChange,
      'created_at': Timestamp.fromDate(createdAt),
    };
  }
}

