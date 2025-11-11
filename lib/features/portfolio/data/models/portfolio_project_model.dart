import 'package:cloud_firestore/cloud_firestore.dart';

class PortfolioProjectModel {
  final String id;
  final String title;
  final String slug;
  final String description; // Kısa açıklama
  final String content; // Uzun açıklama
  final String category; // Kategori slug'ı
  final String client; // Müşteri adı
  final String duration; // Süre (örn: "1 Day")
  final String? endDate; // Bitiş tarihi (string format: "2024-06-16")
  final List<String> features; // Özellikler listesi
  final List<String> gallery; // Galeri görselleri
  final String image; // Featured image
  final List<String> technologies;
  final String status; // "completed", "in-progress", etc.
  final bool featured;
  final String? liveUrl;
  final String githubUrl; // Boş string olabilir
  final int likes;
  final int views;
  final DateTime createdAt;
  final DateTime? publishedAt;
  final DateTime? updatedAt;

  PortfolioProjectModel({
    required this.id,
    required this.title,
    required this.slug,
    required this.description,
    this.content = '',
    required this.category,
    this.client = '',
    this.duration = '',
    this.endDate,
    this.features = const [],
    this.gallery = const [],
    this.image = '',
    required this.technologies,
    this.status = 'completed',
    required this.featured,
    this.liveUrl,
    this.githubUrl = '',
    this.likes = 0,
    this.views = 0,
    required this.createdAt,
    this.publishedAt,
    this.updatedAt,
  });

  factory PortfolioProjectModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return PortfolioProjectModel(
      id: doc.id,
      title: data['title'] ?? '',
      slug: data['slug'] ?? '',
      description: data['description'] ?? '',
      content: data['content'] ?? '',
      category: data['category'] ?? '',
      client: data['client'] ?? '',
      duration: data['duration'] ?? '',
      endDate: data['endDate'],
      features: List<String>.from(data['features'] ?? []),
      gallery: List<String>.from(data['gallery'] ?? []),
      image: data['image'] ?? '',
      technologies: List<String>.from(data['technologies'] ?? []),
      status: data['status'] ?? 'completed',
      featured: data['featured'] ?? false,
      liveUrl: data['liveUrl'],
      githubUrl: data['githubUrl'] ?? '',
      likes: data['likes'] ?? 0,
      views: data['views'] ?? 0,
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      publishedAt: (data['publishedAt'] as Timestamp?)?.toDate(),
      updatedAt: (data['updatedAt'] as Timestamp?)?.toDate(),
    );
  }

  Map<String, dynamic> toFirestore() {
    final map = <String, dynamic>{
      'title': title,
      'slug': slug,
      'description': description,
      'content': content,
      'category': category,
      'client': client,
      'duration': duration,
      'features': features,
      'gallery': gallery,
      'image': image,
      'technologies': technologies,
      'status': status,
      'featured': featured,
      'likes': likes,
      'views': views,
      'createdAt': Timestamp.fromDate(createdAt),
    };
    
    // Optional fields
    if (endDate != null) map['endDate'] = endDate;
    if (liveUrl != null) map['liveUrl'] = liveUrl;
    if (githubUrl != null && githubUrl.isNotEmpty) map['githubUrl'] = githubUrl;
    if (publishedAt != null) map['publishedAt'] = Timestamp.fromDate(publishedAt!);
    if (updatedAt != null) map['updatedAt'] = Timestamp.fromDate(updatedAt!);
    
    return map;
  }
  
  // Helper methods
  List<String> get allImages {
    final images = <String>[];
    if (image.isNotEmpty) images.add(image);
    images.addAll(gallery);
    return images;
  }
  
  bool get isPublished => publishedAt != null;
  bool get isCompleted => status == 'completed';
}

