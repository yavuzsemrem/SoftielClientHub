import 'package:cloud_firestore/cloud_firestore.dart';

class MediaUsage {
  final String type; // 'blog', 'portfolio', etc.
  final String id;

  MediaUsage({
    required this.type,
    required this.id,
  });

  Map<String, dynamic> toMap() {
    return {
      'type': type,
      'id': id,
    };
  }

  factory MediaUsage.fromMap(Map<String, dynamic> map) {
    return MediaUsage(
      type: map['type'] ?? '',
      id: map['id'] ?? '',
    );
  }
}

class MediaModel {
  final String id;
  final String fileName;
  final String originalName;
  final String fileType;
  final int fileSize;
  final String fileUrl;
  final String? thumbnailUrl;
  final int? width;
  final int? height;
  final String? alt;
  final String? caption;
  final String uploadedBy;
  final List<MediaUsage> usedIn;
  final List<String> tags;
  final DateTime createdAt;
  final DateTime updatedAt;

  MediaModel({
    required this.id,
    required this.fileName,
    required this.originalName,
    required this.fileType,
    required this.fileSize,
    required this.fileUrl,
    this.thumbnailUrl,
    this.width,
    this.height,
    this.alt,
    this.caption,
    required this.uploadedBy,
    required this.usedIn,
    required this.tags,
    required this.createdAt,
    required this.updatedAt,
  });

  bool get isImage => fileType.startsWith('image/');
  bool get isVideo => fileType.startsWith('video/');
  bool get isDocument => !isImage && !isVideo;

  factory MediaModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return MediaModel(
      id: doc.id,
      fileName: data['fileName'] ?? '',
      originalName: data['originalName'] ?? '',
      fileType: data['fileType'] ?? '',
      fileSize: data['fileSize'] ?? 0,
      fileUrl: data['fileUrl'] ?? '',
      thumbnailUrl: data['thumbnailUrl'],
      width: data['width'],
      height: data['height'],
      alt: data['alt'],
      caption: data['caption'],
      uploadedBy: data['uploadedBy'] ?? '',
      usedIn: (data['usedIn'] as List<dynamic>?)
          ?.map((item) => MediaUsage.fromMap(item as Map<String, dynamic>))
          .toList() ?? [],
      tags: List<String>.from(data['tags'] ?? []),
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      updatedAt: (data['updatedAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'fileName': fileName,
      'originalName': originalName,
      'fileType': fileType,
      'fileSize': fileSize,
      'fileUrl': fileUrl,
      'thumbnailUrl': thumbnailUrl,
      'width': width,
      'height': height,
      'alt': alt,
      'caption': caption,
      'uploadedBy': uploadedBy,
      'usedIn': usedIn.map((usage) => usage.toMap()).toList(),
      'tags': tags,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': Timestamp.fromDate(updatedAt),
    };
  }
}

