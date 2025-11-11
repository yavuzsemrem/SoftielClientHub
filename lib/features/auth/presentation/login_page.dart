import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../provider/auth_provider.dart';

class LoginPage extends HookConsumerWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final emailController = useTextEditingController();
    final passwordController = useTextEditingController();
    final formKey = useMemoized(() => GlobalKey<FormState>());
    final obscurePassword = useState(true);
    final isLoading = useState(false);
    final errorMessage = useState<String?>(null);

    final authController = ref.watch(authControllerProvider.notifier);

    Future<void> handleLogin() async {
      errorMessage.value = null; // Clear previous error
      
      if (!formKey.currentState!.validate()) return;

      isLoading.value = true;
      try {
        await authController.signInWithEmailAndPassword(
          email: emailController.text.trim(),
          password: passwordController.text,
        );
        
        if (context.mounted) {
          context.go('/dashboard');
        }
      } catch (e, stackTrace) {
        // Debug: Print full error for troubleshooting
        debugPrint('🔴 Login Error: $e');
        debugPrint('🔴 Stack Trace: $stackTrace');
        errorMessage.value = _getErrorMessage(e.toString());
      } finally {
        isLoading.value = false;
      }
    }

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              const Color(0xFF1E3A5F), // Lacivert (navy blue)
              const Color(0xFF0F1B2E), // Koyu lacivert
              const Color(0xFF000000), // Siyah
            ],
            stops: const [0.0, 0.5, 1.0],
          ),
        ),
        child: Stack(
          children: [
            // Animated glowing circles (twinkling stars effect)
            // Top right cyan glow
            _AnimatedGlowCircle(
              top: -150,
              right: -150,
              width: 400,
              height: 400,
              colors: [
                const Color(0xFF00BCD4).withValues(alpha: 0.25),
                const Color(0xFF00BCD4).withValues(alpha: 0.10),
                Colors.transparent,
              ],
              duration: const Duration(seconds: 3),
            ),
            // Bottom left blue glow
            _AnimatedGlowCircle(
              bottom: -150,
              left: -150,
              width: 400,
              height: 400,
              colors: [
                const Color(0xFF0056b8).withValues(alpha: 0.25),
                const Color(0xFF0056b8).withValues(alpha: 0.10),
                Colors.transparent,
              ],
              duration: const Duration(seconds: 4),
            ),
            // Center-right cyan glow
            _AnimatedGlowCircle(
              top: MediaQuery.of(context).size.height * 0.3,
              right: -100,
              width: 250,
              height: 250,
              colors: [
                const Color(0xFF00BCD4).withValues(alpha: 0.20),
                Colors.transparent,
              ],
              duration: const Duration(milliseconds: 2500),
            ),
            // Top left subtle blue glow
            _AnimatedGlowCircle(
              top: 100,
              left: -80,
              width: 200,
              height: 200,
              colors: [
                const Color(0xFF0056b8).withValues(alpha: 0.18),
                Colors.transparent,
              ],
              duration: const Duration(milliseconds: 3500),
            ),
            // Bottom right cyan glow
            _AnimatedGlowCircle(
              bottom: 150,
              right: 50,
              width: 180,
              height: 180,
              colors: [
                const Color(0xFF00BCD4).withValues(alpha: 0.15),
                Colors.transparent,
              ],
              duration: const Duration(milliseconds: 2800),
            ),
            // Center-left blue glow
            _AnimatedGlowCircle(
              top: MediaQuery.of(context).size.height * 0.6,
              left: -120,
              width: 300,
              height: 300,
              colors: [
                const Color(0xFF0056b8).withValues(alpha: 0.20),
                const Color(0xFF0056b8).withValues(alpha: 0.08),
                Colors.transparent,
              ],
              duration: const Duration(milliseconds: 3200),
            ),
            // Main content
            SafeArea(
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24.0),
                  child: Form(
                    key: formKey,
                    child: Container(
                      constraints: const BoxConstraints(maxWidth: 480),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // Login Card with blur and transparency
                          ClipRRect(
                            borderRadius: BorderRadius.circular(20),
                            child: BackdropFilter(
                              filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                              child: Container(
                                padding: const EdgeInsets.all(40.0),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF1E1E1E).withValues(alpha: 0.7), // Şeffaf dark grey
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(
                                    color: Colors.white.withValues(alpha: 0.1),
                                    width: 1,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withValues(alpha: 0.5),
                                      blurRadius: 30,
                                      spreadRadius: 0,
                                      offset: const Offset(0, 10),
                                    ),
                                    BoxShadow(
                                      color: const Color(0xFF00BCD4).withValues(alpha: 0.1),
                                      blurRadius: 20,
                                      spreadRadius: -5,
                                    ),
                                  ],
                                ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                // Logo
                                Center(
                                  child: Image.asset(
                                    'assets/images/transparent.png',
                                    height: 100,
                                    width: 100,
                                    fit: BoxFit.contain,
                                  ),
                                ),
                                const SizedBox(height: 32),
                                
                                // Title
                                const Text(
                                  'Secure Login',
                                  style: TextStyle(
                                    fontSize: 32,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 12),
                                
                                // Subtitle
                                Text(
                                  'Sign in to access the client hub.',
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.grey[400],
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 40),
                                
                                // Error Message (inside card) - Animated
                                AnimatedSwitcher(
                                  duration: const Duration(milliseconds: 300),
                                  child: errorMessage.value != null
                                      ? Container(
                                          key: ValueKey(errorMessage.value),
                                          margin: const EdgeInsets.only(bottom: 20),
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 20,
                                            vertical: 16,
                                          ),
                                          decoration: BoxDecoration(
                                            color: Colors.red.withValues(alpha: 0.1),
                                            borderRadius: BorderRadius.circular(12),
                                            border: Border.all(
                                              color: Colors.red.withValues(alpha: 0.3),
                                              width: 1,
                                            ),
                                          ),
                                          child: Row(
                                            children: [
                                              Icon(
                                                Icons.error_outline,
                                                color: Colors.red[300],
                                                size: 24,
                                              ),
                                              const SizedBox(width: 16),
                                              Expanded(
                                                child: Text(
                                                  errorMessage.value!,
                                                  style: TextStyle(
                                                    color: Colors.red[300],
                                                    fontSize: 15,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        )
                                      : const SizedBox.shrink(key: ValueKey('empty')),
                                ),
                                
                                // Username/Email Field
                                TextFormField(
                                  controller: emailController,
                                  keyboardType: TextInputType.emailAddress,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                  ),
                                  decoration: InputDecoration(
                                    labelText: 'Username or Email',
                                    labelStyle: TextStyle(
                                      color: Colors.grey[400],
                                      fontSize: 15,
                                    ),
                                    hintText: 'username or email',
                                    hintStyle: TextStyle(
                                      color: Colors.grey[600],
                                      fontSize: 16,
                                    ),
                                    contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 20,
                                      vertical: 18,
                                    ),
                                    prefixIcon: Icon(
                                      Icons.person_outline,
                                      color: Colors.grey[400],
                                      size: 24,
                                    ),
                                    filled: true,
                                    fillColor: const Color(0xFF2A2A2A),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      borderSide: BorderSide(
                                        color: Colors.grey[800]!,
                                      ),
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      borderSide: BorderSide(
                                        color: Colors.grey[800]!,
                                      ),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      borderSide: const BorderSide(
                                        color: Color(0xFF00BCD4), // Cyan
                                        width: 2,
                                      ),
                                    ),
                                  ),
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Email is required';
                                    }
                                    if (!value.contains('@')) {
                                      return 'Please enter a valid email';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 20),
                                
                                // Password Field
                                TextFormField(
                                  controller: passwordController,
                                  obscureText: obscurePassword.value,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                  ),
                                  decoration: InputDecoration(
                                    labelText: 'Password',
                                    labelStyle: TextStyle(
                                      color: Colors.grey[400],
                                      fontSize: 15,
                                    ),
                                    hintText: 'Enter your password',
                                    hintStyle: TextStyle(
                                      color: Colors.grey[600],
                                      fontSize: 16,
                                    ),
                                    contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 20,
                                      vertical: 18,
                                    ),
                                    prefixIcon: Icon(
                                      Icons.lock_outline,
                                      color: Colors.grey[400],
                                      size: 24,
                                    ),
                                    suffixIcon: IconButton(
                                      icon: Icon(
                                        obscurePassword.value
                                            ? Icons.visibility_outlined
                                            : Icons.visibility_off_outlined,
                                        color: Colors.grey[400],
                                        size: 24,
                                      ),
                                      onPressed: () {
                                        obscurePassword.value = !obscurePassword.value;
                                      },
                                    ),
                                    filled: true,
                                    fillColor: const Color(0xFF2A2A2A),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      borderSide: BorderSide(
                                        color: Colors.grey[800]!,
                                      ),
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      borderSide: BorderSide(
                                        color: Colors.grey[800]!,
                                      ),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      borderSide: const BorderSide(
                                        color: Color(0xFF00BCD4), // Cyan
                                        width: 2,
                                      ),
                                    ),
                                  ),
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Password is required';
                                    }
                                    if (value.length < 6) {
                                      return 'Password must be at least 6 characters';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 36),
                                
                                // Login Button with Gradient
                                Container(
                                  height: 56,
                                  decoration: BoxDecoration(
                                    gradient: const LinearGradient(
                                      begin: Alignment.centerLeft,
                                      end: Alignment.centerRight,
                                      colors: [
                                        Color(0xFF00BCD4), // Cyan
                                        Color(0xFF0056b8), // Blue
                                      ],
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                    boxShadow: [
                                      BoxShadow(
                                        color: const Color(0xFF00BCD4).withValues(alpha: 0.4),
                                        blurRadius: 15,
                                        spreadRadius: 0,
                                        offset: const Offset(0, 4),
                                      ),
                                    ],
                                  ),
                                  child: Material(
                                    color: Colors.transparent,
                                    child: InkWell(
                                      onTap: isLoading.value ? null : handleLogin,
                                      borderRadius: BorderRadius.circular(12),
                                      child: Center(
                                        child: isLoading.value
                                            ? const SizedBox(
                                                height: 24,
                                                width: 24,
                                                child: CircularProgressIndicator(
                                                  strokeWidth: 2,
                                                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                                ),
                                              )
                                            : const Row(
                                                mainAxisAlignment: MainAxisAlignment.center,
                                                children: [
                                                  Text(
                                                    'Login',
                                                    style: TextStyle(
                                                      color: Colors.white,
                                                      fontSize: 18,
                                                      fontWeight: FontWeight.bold,
                                                    ),
                                                  ),
                                                  const SizedBox(width: 10),
                                                  Icon(
                                                    Icons.arrow_forward,
                                                    color: Colors.white,
                                                    size: 22,
                                                  ),
                                                ],
                                              ),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 24),
                          
                          // Copyright
                          Text(
                            '© 2024 Softiel. All rights reserved.',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[500],
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _getErrorMessage(String error) {
    // Firestore Auth error messages
    final errorLower = error.toLowerCase();
    
    if (errorLower.contains('kullanıcı bulunamadı') || 
        errorLower.contains('user not found') || 
        errorLower.contains('user-not-found')) {
      return 'User not found. Please check your email address.';
    } else if (errorLower.contains('yanlış şifre') || 
               errorLower.contains('wrong password') || 
               errorLower.contains('wrong-password') ||
               errorLower.contains('invalid password')) {
      return 'Wrong password. Please try again.';
    } else if (errorLower.contains('geçersiz email') || 
               errorLower.contains('invalid email') || 
               errorLower.contains('invalid-email')) {
      return 'Invalid email address.';
    } else if (errorLower.contains('devre dışı') || 
               errorLower.contains('disabled') ||
               errorLower.contains('account disabled') ||
               errorLower.contains('isactive') && errorLower.contains('false')) {
      return 'This account has been disabled.';
    } else if (errorLower.contains('zaten kullanılıyor') || 
               errorLower.contains('already exists') || 
               errorLower.contains('already in use') ||
               errorLower.contains('email already')) {
      return 'This email address is already in use.';
    } else if (errorLower.contains('network') || 
               errorLower.contains('connection') ||
               errorLower.contains('timeout') ||
               errorLower.contains('unavailable')) {
      return 'Network error. Please check your internet connection.';
    } else if (errorLower.contains('şifre bulunamadı') || 
               errorLower.contains('password not found') ||
               errorLower.contains('password missing')) {
      return 'Password not found. Please contact the administrator.';
    } else if (errorLower.contains('permission') || 
               errorLower.contains('permission-denied') ||
               errorLower.contains('insufficient permissions')) {
      return 'Permission denied. Please check your account permissions.';
    } else if (errorLower.contains('firestore') || 
               errorLower.contains('cloud_firestore')) {
      return 'Database error. Please try again later.';
    }
    
    // Show detailed error message (for debugging)
    // Show first 150 characters to help identify the issue
    final cleanError = error.replaceAll(RegExp(r'Exception: '), '');
    return 'Login error: ${cleanError.length > 150 ? cleanError.substring(0, 150) + '...' : cleanError}';
  }
}

// Animated glow circle widget with twinkling effect
class _AnimatedGlowCircle extends StatefulWidget {
  final double? top;
  final double? bottom;
  final double? left;
  final double? right;
  final double width;
  final double height;
  final List<Color> colors;
  final Duration duration;

  const _AnimatedGlowCircle({
    this.top,
    this.bottom,
    this.left,
    this.right,
    required this.width,
    required this.height,
    required this.colors,
    required this.duration,
  });

  @override
  State<_AnimatedGlowCircle> createState() => _AnimatedGlowCircleState();
}

class _AnimatedGlowCircleState extends State<_AnimatedGlowCircle>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.duration,
      vsync: this,
    )..repeat(reverse: true);
    
    _animation = Tween<double>(
      begin: 0.3,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: widget.top,
      bottom: widget.bottom,
      left: widget.left,
      right: widget.right,
      child: AnimatedBuilder(
        animation: _animation,
        builder: (context, child) {
          return Opacity(
            opacity: _animation.value,
            child: Container(
              width: widget.width,
              height: widget.height,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: widget.colors.map((color) {
                    // Extract alpha from color and multiply by animation value
                    final originalAlpha = color.opacity;
                    return color.withValues(
                      alpha: originalAlpha * _animation.value,
                    );
                  }).toList(),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
