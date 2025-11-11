import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../../../core/widgets/role_based_scaffold.dart';
import '../../../../core/widgets/loading_widget.dart';
import '../../../../core/widgets/error_widget.dart';

class ProjectsListPage extends ConsumerWidget {
  const ProjectsListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return RoleBasedScaffold(
      title: 'Client Projects',
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.work_outlined,
              size: 64,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 16),
            Text(
              'Projects List',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.grey[300],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'This page will show all client projects',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[500],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

