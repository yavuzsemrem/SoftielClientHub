import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'router.dart';
import 'theme.dart';
import '../features/auth/provider/auth_provider.dart';

class App extends HookConsumerWidget {
  const App({super.key});
  
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    final authController = ref.watch(authControllerProvider.notifier);
    
    // App başlangıcında session yükle (sadece bir kez)
    useEffect(() {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        authController.loadSession();
      });
      return null;
    }, []);
    
    return MaterialApp.router(
      title: 'Softiel Client Hub',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      routerConfig: router,
      localizationsDelegates: [
        ...context.localizationDelegates,
      ],
      supportedLocales: context.supportedLocales,
      locale: context.locale,
    );
  }
}

