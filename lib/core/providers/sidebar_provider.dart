import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Sidebar durumunu yöneten provider
/// true = genişletilmiş (280px), false = daraltılmış (80px)
final sidebarExpandedProvider = StateProvider<bool>((ref) => true);

