import 'package:flutter/material.dart';
import '../../../../core/widgets/role_based_scaffold.dart';

class ClientDashboardPage extends StatelessWidget {
  const ClientDashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return RoleBasedScaffold(
      title: 'Dashboard',
      body: const Center(
        child: Text('Client Dashboard - Coming Soon'),
      ),
    );
  }
}

