import 'package:cloud_firestore/cloud_firestore.dart';

class TagModel {
  final String id;
  final String name;
  final String slug;
  final String description;
  final String color;
  final int postCount; // Mevcut yapıda postCount
  final bool isActive;
  final DateTime createdAt;
  final DateTime? updatedAt;

  TagModel({
    required this.id,
    required this.name,
    required this.slug,
    this.description = '',
    this.color = '#3b82f6',
    this.postCount = 0,
    this.isActive = true,
    required this.createdAt,
    this.updatedAt,
  });

  factory TagModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return TagModel(
      id: doc.id,
      name: data['name'] ?? '',
      slug: data['slug'] ?? '',
      description: data['description'] ?? '',
      color: data['color'] ?? '#3b82f6',
      postCount: data['postCount'] ?? 0,
      isActive: data['isActive'] ?? true,
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      updatedAt: (data['updatedAt'] as Timestamp?)?.toDate(),
    );
  }

  Map<String, dynamic> toFirestore() {
    final map = <String, dynamic>{
      'name': name,
      'slug': slug,
      'description': description,
      'color': color,
      'postCount': postCount,
      'isActive': isActive,
      'createdAt': Timestamp.fromDate(createdAt),
    };
    
    if (updatedAt != null) {
      map['updatedAt'] = Timestamp.fromDate(updatedAt!);
    }
    
    return map;
  }
}

