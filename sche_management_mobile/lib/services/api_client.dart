import 'dart:convert';
import 'package:http/http.dart' as http;
import 'auth_service.dart';
import '../config/api_config.dart';

class ApiClient {
  static final ApiClient instance = ApiClient._internal();

  factory ApiClient() => instance;

  ApiClient._internal();

  final String baseUrl = ApiConfig.baseUrl;
  final http.Client _http = http.Client();
  final AuthService _authService = AuthService();

  Future<http.Response> get(String path) async {
    final headers = await _buildHeaders();
    final uri = Uri.parse(_join(baseUrl, path));
    return _http.get(uri, headers: headers);
  }

  Future<http.Response> post(String path, {Object? body}) async {
    final headers = await _buildHeaders();
    final uri = Uri.parse(_join(baseUrl, path));
    return _http.post(
      uri,
      headers: headers,
      body: body == null ? null : jsonEncode(body),
    );
  }

  Future<http.Response> put(String path, {Object? body}) async {
    final headers = await _buildHeaders();
    final uri = Uri.parse(_join(baseUrl, path));
    return _http.put(
      uri,
      headers: headers,
      body: body == null ? null : jsonEncode(body),
    );
  }

  Future<Map<String, String>> _buildHeaders() async {
    final accessToken = await _authService.getAccessToken();
    final idToken = await _authService.getIdToken();
    final headers = Map<String, String>.from(ApiConfig.defaultHeaders);

    if (accessToken != null && accessToken.isNotEmpty) {
      headers['Authorization'] = 'Bearer $accessToken';
    }
    if (idToken != null && idToken.isNotEmpty) {
      headers['X-ID-Token'] = idToken;
    }
    return headers;
  }

  String _join(String a, String b) {
    if (a.endsWith('/')) a = a.substring(0, a.length - 1);
    if (!b.startsWith('/')) b = '/$b';
    return '$a$b';
  }
}
