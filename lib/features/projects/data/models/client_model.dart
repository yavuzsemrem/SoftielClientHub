import 'package:cloud_firestore/cloud_firestore.dart';

class ClientModel {
  final String id;
  final String name;
  final String email;
  final String? company;
  final String? photoUrl;
  final DateTime createdAt;

  ClientModel({
    required this.id,
    required this.name,
    required this.email,
    this.company,
    this.photoUrl,
    required this.createdAt,
  });

  factory ClientModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return ClientModel(
      id: doc.id,
      name: data['name'] ?? '',
      email: data['email'] ?? '',
      company: data['company'],
      photoUrl: data['photo_url'],
      createdAt: (data['created_at'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'name': name,
      'email': email,
      'company': company,
      'photo_url': photoUrl,
      'created_at': Timestamp.fromDate(createdAt),
    };
  }
}

