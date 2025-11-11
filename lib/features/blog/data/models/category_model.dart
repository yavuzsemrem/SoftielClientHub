import 'package:cloud_firestore/cloud_firestore.dart';

class CategoryModel {
  final String id;
  final String name;
  final String slug;
  final String description;
  final String color;
  final int postCount;
  final String status; // "active", "inactive", etc.
  final DateTime createdAt;
  final DateTime? updatedAt;

  CategoryModel({
    required this.id,
    required this.name,
    required this.slug,
    this.description = '',
    this.color = '#3b82f6',
    this.postCount = 0,
    this.status = 'active',
    required this.createdAt,
    this.updatedAt,
  });

  bool get isActive => status == 'active';

  factory CategoryModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return CategoryModel(
      id: doc.id,
      name: data['name'] ?? '',
      slug: data['slug'] ?? '',
      description: data['description'] ?? '',
      color: data['color'] ?? '#3b82f6',
      postCount: data['postCount'] ?? 0,
      status: data['status'] ?? 'active',
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
      'status': status,
      'createdAt': Timestamp.fromDate(createdAt),
    };
    
    if (updatedAt != null) {
      map['updatedAt'] = Timestamp.fromDate(updatedAt!);
    }
    
    return map;
  }
}

