import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/constants/app_constants.dart';

class CommentModel {
  final String id;
  final String postId;
  final String postType; // 'blog' or 'portfolio'
  final String authorId;
  final String authorName;
  final String authorEmail;
  final String? authorAvatar;
  final String content;
  final String? parentId; // For nested comments
  final String status;
  final String? ipAddress;
  final String? userAgent;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? approvedAt;
  final String? approvedBy;

  CommentModel({
    required this.id,
    required this.postId,
    required this.postType,
    required this.authorId,
    required this.authorName,
    required this.authorEmail,
    this.authorAvatar,
    required this.content,
    this.parentId,
    required this.status,
    this.ipAddress,
    this.userAgent,
    required this.createdAt,
    required this.updatedAt,
    this.approvedAt,
    this.approvedBy,
  });

  bool get isApproved => status == AppConstants.commentStatusApproved;
  bool get isPending => status == AppConstants.commentStatusPending;
  bool get isRejected => status == AppConstants.commentStatusRejected;
  bool get isSpam => status == AppConstants.commentStatusSpam;
  bool get isReply => parentId != null;

  factory CommentModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return CommentModel(
      id: doc.id,
      postId: data['postId'] ?? '',
      postType: data['postType'] ?? AppConstants.postTypeBlog,
      authorId: data['authorId'] ?? '',
      authorName: data['authorName'] ?? '',
      authorEmail: data['authorEmail'] ?? '',
      authorAvatar: data['authorAvatar'],
      content: data['content'] ?? '',
      parentId: data['parentId'],
      status: data['status'] ?? AppConstants.commentStatusPending,
      ipAddress: data['ipAddress'],
      userAgent: data['userAgent'],
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      updatedAt: (data['updatedAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      approvedAt: (data['approvedAt'] as Timestamp?)?.toDate(),
      approvedBy: data['approvedBy'],
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'postId': postId,
      'postType': postType,
      'authorId': authorId,
      'authorName': authorName,
      'authorEmail': authorEmail,
      'authorAvatar': authorAvatar,
      'content': content,
      'parentId': parentId,
      'status': status,
      'ipAddress': ipAddress,
      'userAgent': userAgent,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': Timestamp.fromDate(updatedAt),
      'approvedAt': approvedAt != null ? Timestamp.fromDate(approvedAt!) : null,
      'approvedBy': approvedBy,
    };
  }
}

