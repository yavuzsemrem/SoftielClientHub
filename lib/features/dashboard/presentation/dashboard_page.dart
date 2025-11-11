import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../../../features/auth/provider/auth_provider.dart';
import 'admin_dashboard_page.dart';
import 'client_dashboard_page.dart';

class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userProfile = ref.watch(userProfileProvider);
    final user = userProfile.valueOrNull;
    final isAdmin = user?.isAdmin ?? false;

    // Role bazlı dashboard göster
    if (isAdmin) {
      return const AdminDashboardPage();
    } else {
      return const ClientDashboardPage();
    }
  }
}

