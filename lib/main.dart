import 'package:easy_localization/easy_localization.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app/app.dart';
import 'firebase_options.dart';
import 'features/auth/provider/auth_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase
  try {
    final options = DefaultFirebaseOptions.currentPlatform;
    debugPrint('🔥 Firebase initializing...');
    debugPrint('   Project ID: ${options.projectId}');
    debugPrint('   Auth Domain: ${options.authDomain}');
    debugPrint('   API Key: ${options.apiKey.substring(0, 10)}...');
    
    await Firebase.initializeApp(
      options: options,
    );
    debugPrint('✅ Firebase initialized successfully');
  } catch (e, stackTrace) {
    debugPrint('❌ Firebase initialization error: $e');
    debugPrint('   Stack trace: $stackTrace');
    rethrow;
  }
  
  // Initialize Easy Localization
  await EasyLocalization.ensureInitialized();
  
  runApp(
    ProviderScope(
      child: EasyLocalization(
        supportedLocales: const [Locale('en'), Locale('tr')],
        path: 'assets/translations',
        fallbackLocale: const Locale('en'),
        child: const App(),
      ),
    ),
  );
}
