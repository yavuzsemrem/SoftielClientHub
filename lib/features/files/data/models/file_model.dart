import 'package:cloud_firestore/cloud_firestore.dart';

class FileModel {
  final String id;
  final String fileName;
  final String uploaderId;
  final String fileUrl;
  final DateTime createdAt;

  FileModel({
    required this.id,
    required this.fileName,
    required this.uploaderId,
    required this.fileUrl,
    required this.createdAt,
  });

  factory FileModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return FileModel(
      id: doc.id,
      fileName: data['file_name'] ?? '',
      uploaderId: data['uploader_id'] ?? '',
      fileUrl: data['file_url'] ?? '',
      createdAt: (data['created_at'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'file_name': fileName,
      'uploader_id': uploaderId,
      'file_url': fileUrl,
      'created_at': Timestamp.fromDate(createdAt),
    };
  }
}

