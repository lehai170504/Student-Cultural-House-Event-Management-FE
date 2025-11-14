import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:amplify_flutter/amplify_flutter.dart';
import 'auth_service.dart';
import '../config/api_config.dart' as app_config;

class ApiClient {
  static final ApiClient instance = ApiClient._internal();

  factory ApiClient() => instance;

  ApiClient._internal();

  final String baseUrl = app_config.ApiConfig.baseUrl;
  final http.Client _http = http.Client();
  final AuthService _authService = AuthService();

  Future<http.Response> get(String path) async {
    // Ensure valid session before making request
    await _authService.ensureValidSession();
    final headers = await _buildHeaders();
    final uri = Uri.parse(_join(baseUrl, path));
    final response = await _http.get(uri, headers: headers);

    // If 401, try to refresh token and retry once
    if (response.statusCode == 401) {
      safePrint('⚠️ Got 401, attempting to refresh token...');
      final refreshed = await _authService.ensureValidSession();
      if (refreshed) {
        final newHeaders = await _buildHeaders();
        return _http.get(uri, headers: newHeaders);
      }
    }

    return response;
  }

  Future<http.Response> post(String path, {Object? body}) async {
    // Ensure valid session before making request
    await _authService.ensureValidSession();
    final headers = await _buildHeaders();
    final uri = Uri.parse(_join(baseUrl, path));
    final response = await _http.post(
      uri,
      headers: headers,
      body: body == null ? null : jsonEncode(body),
    );

    // If 401, try to refresh token and retry once
    if (response.statusCode == 401) {
      safePrint('⚠️ Got 401, attempting to refresh token...');
      final refreshed = await _authService.ensureValidSession();
      if (refreshed) {
        final newHeaders = await _buildHeaders();
        return _http.post(
          uri,
          headers: newHeaders,
          body: body == null ? null : jsonEncode(body),
        );
      }
    }

    return response;
  }

  Future<http.Response> put(String path, {Object? body}) async {
    // Ensure valid session before making request
    await _authService.ensureValidSession();
    final headers = await _buildHeaders();
    final uri = Uri.parse(_join(baseUrl, path));
    final response = await _http.put(
      uri,
      headers: headers,
      body: body == null ? null : jsonEncode(body),
    );

    // If 401, try to refresh token and retry once
    if (response.statusCode == 401) {
      safePrint('⚠️ Got 401, attempting to refresh token...');
      final refreshed = await _authService.ensureValidSession();
      if (refreshed) {
        final newHeaders = await _buildHeaders();
        return _http.put(
          uri,
          headers: newHeaders,
          body: body == null ? null : jsonEncode(body),
        );
      }
    }

    return response;
  }

  Future<http.Response> patch(String path, {Object? body}) async {
    // Ensure valid session before making request
    await _authService.ensureValidSession();
    final headers = await _buildHeaders();
    final uri = Uri.parse(_join(baseUrl, path));
    final response = await _http.patch(
      uri,
      headers: headers,
      body: body == null ? null : jsonEncode(body),
    );

    // If 401, try to refresh token and retry once
    if (response.statusCode == 401) {
      safePrint('⚠️ Got 401, attempting to refresh token...');
      final refreshed = await _authService.ensureValidSession();
      if (refreshed) {
        final newHeaders = await _buildHeaders();
        return _http.patch(
          uri,
          headers: newHeaders,
          body: body == null ? null : jsonEncode(body),
        );
      }
    }

    return response;
  }

  Future<http.Response> delete(String path) async {
    // Ensure valid session before making request
    await _authService.ensureValidSession();
    final headers = await _buildHeaders();
    final uri = Uri.parse(_join(baseUrl, path));
    final response = await _http.delete(uri, headers: headers);

    // If 401, try to refresh token and retry once
    if (response.statusCode == 401) {
      safePrint('⚠️ Got 401, attempting to refresh token...');
      final refreshed = await _authService.ensureValidSession();
      if (refreshed) {
        final newHeaders = await _buildHeaders();
        return _http.delete(uri, headers: newHeaders);
      }
    }

    return response;
  }

  Future<http.Response> postMultipart(
    String path, {
    Map<String, String>? fields,
    List<http.MultipartFile>? files,
  }) async {
    final uri = Uri.parse(_join(baseUrl, path));
    final headers = await _buildHeaders(removeContentType: true);
    final request = http.MultipartRequest('POST', uri);
    request.headers.addAll(headers);
    if (fields != null) {
      request.fields.addAll(fields);
    }
    if (files != null && files.isNotEmpty) {
      request.files.addAll(files);
    }
    final streamed = await request.send();
    return http.Response.fromStream(streamed);
  }

  Future<http.Response> putMultipart(
    String path, {
    Map<String, String>? fields,
    List<http.MultipartFile>? files,
  }) async {
    final uri = Uri.parse(_join(baseUrl, path));
    final headers = await _buildHeaders(removeContentType: true);
    final request = http.MultipartRequest('PUT', uri);
    request.headers.addAll(headers);
    if (fields != null) {
      request.fields.addAll(fields);
    }
    if (files != null && files.isNotEmpty) {
      request.files.addAll(files);
    }
    final streamed = await request.send();
    return http.Response.fromStream(streamed);
  }

  Future<Map<String, String>> _buildHeaders({
    bool removeContentType = false,
  }) async {
    final accessToken = await _authService.getAccessToken();
    final idToken = await _authService.getIdToken();
    final headers = Map<String, String>.from(
      app_config.ApiConfig.defaultHeaders,
    );

    if (accessToken != null && accessToken.isNotEmpty) {
      headers['Authorization'] = 'Bearer $accessToken';
    }
    if (idToken != null && idToken.isNotEmpty) {
      headers['X-ID-Token'] = idToken;
    }
    if (removeContentType) {
      headers.remove('Content-Type');
    }
    return headers;
  }

  String _join(String a, String b) {
    if (a.endsWith('/')) a = a.substring(0, a.length - 1);
    if (!b.startsWith('/')) b = '/$b';
    return '$a$b';
  }
}
