import 'dart:io';
import 'dart:typed_data';
import 'package:firebase_storage/firebase_storage.dart';
import '../../core/constants/app_constants.dart';

class FirebaseStorageService {
  final FirebaseStorage _storage = FirebaseStorage.instance;

  Future<String> uploadFile({
    required String projectId,
    required File file,
    required String fileName,
  }) async {
    final ref = _storage
        .ref()
        .child(AppConstants.projectFilesPath)
        .child(projectId)
        .child(fileName);

    final uploadTask = ref.putFile(file);
    final snapshot = await uploadTask;
    return await snapshot.ref.getDownloadURL();
  }

  Future<String> uploadFileFromBytes({
    required String projectId,
    required List<int> bytes,
    required String fileName,
  }) async {
    final ref = _storage
        .ref()
        .child(AppConstants.projectFilesPath)
        .child(projectId)
        .child(fileName);

    final uploadTask = ref.putData(
      Uint8List.fromList(bytes),
      SettableMetadata(contentType: 'application/octet-stream'),
    );
    final snapshot = await uploadTask;
    return await snapshot.ref.getDownloadURL();
  }

  Future<void> deleteFile(String fileUrl) async {
    final ref = _storage.refFromURL(fileUrl);
    await ref.delete();
  }
}

