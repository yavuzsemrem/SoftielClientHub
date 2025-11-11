import 'package:cloud_firestore/cloud_firestore.dart';
import '../../core/constants/app_constants.dart';
import '../../features/projects/data/models/project_model.dart';
import '../../features/tasks/data/models/task_model.dart';
import '../../features/projects/data/models/project_update_model.dart';
import '../../features/chat/data/models/message_model.dart';
import '../../features/files/data/models/file_model.dart';
import '../../features/notifications/data/models/notification_model.dart';

class FirestoreService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Client Hub Projects
  Stream<List<ProjectModel>> getClientHubProjects(String clientId) {
    return _firestore
        .collection(AppConstants.clientHubProjectsCollection)
        .where('clientId', isEqualTo: clientId)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => ProjectModel.fromFirestore(doc))
            .toList());
  }

  Future<ProjectModel?> getClientHubProject(String projectId) async {
    final doc = await _firestore
        .collection(AppConstants.clientHubProjectsCollection)
        .doc(projectId)
        .get();
    if (!doc.exists) return null;
    return ProjectModel.fromFirestore(doc);
  }

  // Tasks
  Stream<List<TaskModel>> getTasks(String projectId) {
    return _firestore
        .collection(AppConstants.clientHubProjectsCollection)
        .doc(projectId)
        .collection(AppConstants.tasksCollection)
        .orderBy('created_at', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => TaskModel.fromFirestore(doc))
            .toList());
  }

  // Updates
  Stream<List<ProjectUpdateModel>> getUpdates(String projectId) {
    return _firestore
        .collection(AppConstants.clientHubProjectsCollection)
        .doc(projectId)
        .collection(AppConstants.updatesCollection)
        .orderBy('created_at', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => ProjectUpdateModel.fromFirestore(doc))
            .toList());
  }

  // Messages
  Stream<List<MessageModel>> getMessages(String projectId, {int limit = 30}) {
    return _firestore
        .collection(AppConstants.clientHubProjectsCollection)
        .doc(projectId)
        .collection(AppConstants.messagesCollection)
        .orderBy('created_at', descending: true)
        .limit(limit)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => MessageModel.fromFirestore(doc))
            .toList()
            .reversed
            .toList());
  }

  Future<void> sendMessage({
    required String projectId,
    required String senderId,
    required String message,
    List<String> attachments = const [],
  }) async {
    await _firestore
        .collection(AppConstants.clientHubProjectsCollection)
        .doc(projectId)
        .collection(AppConstants.messagesCollection)
        .add({
      'sender_id': senderId,
      'message': message,
      'attachments': attachments,
      'created_at': FieldValue.serverTimestamp(),
    });
  }

  // Files
  Stream<List<FileModel>> getFiles(String projectId) {
    return _firestore
        .collection(AppConstants.clientHubProjectsCollection)
        .doc(projectId)
        .collection(AppConstants.filesCollection)
        .orderBy('created_at', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => FileModel.fromFirestore(doc))
            .toList());
  }

  Future<void> addFile({
    required String projectId,
    required String fileName,
    required String uploaderId,
    required String fileUrl,
  }) async {
    await _firestore
        .collection(AppConstants.clientHubProjectsCollection)
        .doc(projectId)
        .collection(AppConstants.filesCollection)
        .add({
      'file_name': fileName,
      'uploader_id': uploaderId,
      'file_url': fileUrl,
      'created_at': FieldValue.serverTimestamp(),
    });
  }

  // Notifications
  Stream<List<NotificationModel>> getNotifications(String userId) {
    return _firestore
        .collection(AppConstants.notificationsCollection)
        .where('user_id', isEqualTo: userId)
        .orderBy('created_at', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => NotificationModel.fromFirestore(doc))
            .toList());
  }

  Future<void> markNotificationAsRead(String notificationId) async {
    await _firestore
        .collection(AppConstants.notificationsCollection)
        .doc(notificationId)
        .update({'is_read': true});
  }
}

