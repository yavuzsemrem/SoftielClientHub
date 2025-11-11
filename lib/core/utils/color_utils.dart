import 'package:flutter/material.dart';
import '../constants/app_constants.dart';

class ColorUtils {
  static Color hexToColor(String hexString) {
    final buffer = StringBuffer();
    if (hexString.length == 6 || hexString.length == 7) buffer.write('ff');
    buffer.write(hexString.replaceFirst('#', ''));
    return Color(int.parse(buffer.toString(), radix: 16));
  }
  
  static Color get primaryColor => hexToColor(AppConstants.primaryColor);
  static Color get secondaryColor => hexToColor(AppConstants.secondaryColor);
  static Color get accentColor => hexToColor(AppConstants.accentColor);
}

