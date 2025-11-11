import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/constants/app_constants.dart';

class ProjectModel {
  final String id;
  final String name;
  final String clientId;
  final String status;
  final int progress;
  final DateTime? dueDate;
  final String? description;
  final DateTime? lastUpdate;

  ProjectModel({
    required this.id,
    required this.name,
    required this.clientId,
    required this.status,
    required this.progress,
    this.dueDate,
    this.description,
    this.lastUpdate,
  });

  factory ProjectModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return ProjectModel(
      id: doc.id,
      name: data['name'] ?? '',
      clientId: data['clientId'] ?? '',
      status: data['status'] ?? AppConstants.statusPlanning,
      progress: data['progress'] ?? 0,
      dueDate: (data['due_date'] as Timestamp?)?.toDate(),
      description: data['description'],
      lastUpdate: (data['last_update'] as Timestamp?)?.toDate(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'name': name,
      'clientId': clientId,
      'status': status,
      'progress': progress,
      'due_date': dueDate != null ? Timestamp.fromDate(dueDate!) : null,
      'description': description,
      'last_update': lastUpdate != null ? Timestamp.fromDate(lastUpdate!) : null,
    };
  }
}

