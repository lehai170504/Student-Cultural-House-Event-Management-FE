import 'dart:convert';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  static const _storage = FlutterSecureStorage();
  static const _keyAccessToken = 'access_token';
  static const _keyIdToken = 'id_token';

  Future<bool> isSignedIn() async {
    try {
      final session = await Amplify.Auth.fetchAuthSession();
      if (session.isSignedIn) {
        // Ensure tokens are saved
        await _saveTokens();
        return true;
      }
      return false;
    } catch (e) {
      safePrint('❌ Error checking sign in status: $e');
      return false;
    }
  }

  /// Check if token is expired and refresh if needed
  Future<bool> ensureValidSession() async {
    try {
      final session = await Amplify.Auth.fetchAuthSession();
      if (!session.isSignedIn) {
        return false;
      }

      // Try to refresh session to get new tokens if needed
      if (session is CognitoAuthSession) {
        try {
          // Save current tokens first
          await _saveTokens();

          // Check if tokens are valid by trying to get them
          final accessToken = await getAccessToken();
          if (accessToken != null && accessToken.isNotEmpty) {
            return true;
          }

          // If no tokens, try to get fresh session
          final refreshedSession = await Amplify.Auth.fetchAuthSession();
          if (refreshedSession.isSignedIn) {
            await _saveTokens();
            return true;
          }
          return false;
        } catch (e) {
          safePrint('⚠️ Failed to refresh session: $e');
          // If refresh fails, check if we still have valid tokens
          final accessToken = await getAccessToken();
          return accessToken != null && accessToken.isNotEmpty;
        }
      }
      return true;
    } catch (e) {
      safePrint('❌ Error ensuring valid session: $e');
      return false;
    }
  }

  Future<void> signInWithHostedUI() async {
    if (!Amplify.isConfigured) {
      throw StateError(
        'Amplify chưa được cấu hình (isConfigured=false). Hãy khởi động lại ứng dụng.',
      );
    }
    try {
      safePrint('🔐 Bắt đầu signInWithWebUI...');
      final result = await Amplify.Auth.signInWithWebUI(
        provider: AuthProvider.cognito,
      );
      safePrint('✅ SignIn result: isSignedIn=${result.isSignedIn}');
      if (result.isSignedIn) {
        await _saveTokens();
      } else {
        safePrint('User chưa đăng nhập xong.');
      }
    } on AuthException catch (e) {
      safePrint('❌ AuthException: ${e.message}');
      safePrint('❌ Exception type: ${e.runtimeType}');
      safePrint('❌ Exception toString: $e');
      rethrow;
    } catch (e, stackTrace) {
      safePrint('❌ Unexpected error: $e');
      safePrint('❌ Stack trace: $stackTrace');
      rethrow;
    }
  }

  Future<void> signOut() async {
    try {
      await Amplify.Auth.signOut();
    } finally {
      await _clearTokens();
    }
  }

  Future<String?> getAccessToken() async => _storage.read(key: _keyAccessToken);
  Future<String?> getIdToken() async => _storage.read(key: _keyIdToken);

  Future<void> _saveTokens() async {
    final session = await Amplify.Auth.fetchAuthSession();
    if (session is CognitoAuthSession) {
      final access = session.userPoolTokensResult.value.accessToken.raw;
      final id = session.userPoolTokensResult.value.idToken.raw;
      await _storage.write(key: _keyAccessToken, value: access);
      await _storage.write(key: _keyIdToken, value: id);
    }
  }

  /// Refresh tokens after updating user attributes
  Future<void> refreshTokens() async {
    safePrint('🔄 Refreshing tokens...');
    await _saveTokens();
    safePrint('✅ Tokens refreshed');

    // Debug: Log ID token to verify custom attributes
    final idToken = await getIdToken();
    if (idToken != null) {
      // Decode JWT to see claims
      try {
        final parts = idToken.split('.');
        if (parts.length == 3) {
          final payload = parts[1];
          // Add padding if needed
          final normalized = base64.normalize(payload);
          final decoded = utf8.decode(base64.decode(normalized));
          safePrint('🔍 ID Token claims: $decoded');
        }
      } catch (e) {
        safePrint('❌ Failed to decode ID token: $e');
      }
    }
  }

  Future<void> _clearTokens() async {
    await _storage.delete(key: _keyAccessToken);
    await _storage.delete(key: _keyIdToken);
  }
}
