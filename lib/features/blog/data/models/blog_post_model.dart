import 'package:cloud_firestore/cloud_firestore.dart';

class BlogPostModel {
  final String id;
  final String title;
  final String slug;
  final String content; // HTML içerik
  final String excerpt; // Özet
  final String image; // Featured image URL
  final String author; // Yazar adı (string)
  final String category; // Kategori adı (string)
  final List<String> tags; // Tag isimleri (array of strings)
  final String status; // "published", "draft", etc.
  final bool featured;
  final String readTime; // Okuma süresi (string, örn: "2")
  final int comments; // Yorum sayısı
  final int likes; // Beğeni sayısı
  final int views; // Görüntülenme sayısı
  final DateTime createdAt;
  final DateTime? publishedAt;
  final DateTime? updatedAt;

  BlogPostModel({
    required this.id,
    required this.title,
    required this.slug,
    required this.content,
    required this.excerpt,
    this.image = '',
    required this.author,
    required this.category,
    this.tags = const [],
    this.status = 'draft',
    this.featured = false,
    this.readTime = '0',
    this.comments = 0,
    this.likes = 0,
    this.views = 0,
    required this.createdAt,
    this.publishedAt,
    this.updatedAt,
  });

  bool get isPublished => status == 'published';
  bool get isDraft => status == 'draft';

  factory BlogPostModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return BlogPostModel(
      id: doc.id,
      title: data['title'] ?? '',
      slug: data['slug'] ?? '',
      content: data['content'] ?? '',
      excerpt: data['excerpt'] ?? '',
      image: data['image'] ?? '',
      author: data['author'] ?? '',
      category: data['category'] ?? '',
      tags: List<String>.from(data['tags'] ?? []),
      status: data['status'] ?? 'draft',
      featured: data['featured'] ?? false,
      readTime: data['readTime'] ?? '0',
      comments: data['comments'] ?? 0,
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
      'content': content,
      'excerpt': excerpt,
      'image': image,
      'author': author,
      'category': category,
      'tags': tags,
      'status': status,
      'featured': featured,
      'readTime': readTime,
      'comments': comments,
      'likes': likes,
      'views': views,
      'createdAt': Timestamp.fromDate(createdAt),
    };
    
    if (publishedAt != null) {
      map['publishedAt'] = Timestamp.fromDate(publishedAt!);
    }
    if (updatedAt != null) {
      map['updatedAt'] = Timestamp.fromDate(updatedAt!);
    }
    
    return map;
  }
}

