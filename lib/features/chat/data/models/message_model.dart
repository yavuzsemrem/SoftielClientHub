import 'package:cloud_firestore/cloud_firestore.dart';

class MessageModel {
  final String id;
  final String senderId;
  final String message;
  final List<String> attachments;
  final DateTime createdAt;

  MessageModel({
    required this.id,
    required this.senderId,
    required this.message,
    required this.attachments,
    required this.createdAt,
  });

  factory MessageModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return MessageModel(
      id: doc.id,
      senderId: data['sender_id'] ?? '',
      message: data['message'] ?? '',
      attachments: List<String>.from(data['attachments'] ?? []),
      createdAt: (data['created_at'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'sender_id': senderId,
      'message': message,
      'attachments': attachments,
      'created_at': Timestamp.fromDate(createdAt),
    };
  }
}

