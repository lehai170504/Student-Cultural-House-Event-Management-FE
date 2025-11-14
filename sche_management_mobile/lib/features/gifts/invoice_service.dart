import 'dart:convert';
import '../../services/api_client.dart';
import '../../config/api_config.dart' as app_config;
import 'invoice_models.dart';
import 'package:amplify_flutter/amplify_flutter.dart';

class InvoiceService {
  final ApiClient _apiClient = ApiClient();

  /// 🔹 Đổi quà - Tạo invoice và trừ balance
  /// Endpoint: POST /invoices
  Future<RedeemResponse> redeemProduct({
    required String productId,
    required String studentId,
    int quantity = 1,
  }) async {
    try {
      safePrint('🔍 [redeemProduct] Redeeming product $productId for student $studentId, quantity: $quantity');

      final request = RedeemRequest(
        productId: productId,
        studentId: studentId,
        quantity: quantity,
      );

      final response = await _apiClient.post(
        app_config.ApiConfig.invoices,
        body: request.toJson(),
      );

      safePrint('📥 [redeemProduct] Response status: ${response.statusCode}');
      safePrint('📥 [redeemProduct] Response body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        final redeemResponse = RedeemResponse.fromJson(json);

        safePrint('✅ [redeemProduct] Redeemed successfully');
        return redeemResponse;
      } else {
        throw Exception('Failed to redeem product: ${response.statusCode}');
      }
    } catch (e) {
      safePrint('❌ [redeemProduct] Error: $e');
      rethrow;
    }
  }

  /// 🔹 Lấy lịch sử đổi quà của student
  /// Endpoint: GET /invoices/students/{studentId}
  Future<List<Invoice>> getStudentInvoices(String studentId) async {
    try {
      safePrint('🔍 [getStudentInvoices] Loading invoices for student $studentId');

      final response = await _apiClient.get(
        app_config.ApiConfig.getStudentInvoices(studentId),
      );

      safePrint('📥 [getStudentInvoices] Response status: ${response.statusCode}');
      safePrint('📥 [getStudentInvoices] Response body: ${response.body}');

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);

        // Handle different response formats
        List<dynamic> invoiceList = [];
        if (decoded is List) {
          invoiceList = decoded;
        } else if (decoded is Map<String, dynamic>) {
          if (decoded['data'] != null) {
            if (decoded['data'] is List) {
              invoiceList = decoded['data'] as List;
            } else if (decoded['data'] is Map<String, dynamic>) {
              final dataMap = decoded['data'] as Map<String, dynamic>;
              if (dataMap['data'] is List) {
                invoiceList = dataMap['data'] as List;
              }
            }
          }
        }

        final invoices = invoiceList
            .map((item) => Invoice.fromJson(item as Map<String, dynamic>))
            .toList();

        safePrint('✅ [getStudentInvoices] Loaded ${invoices.length} invoices');
        return invoices;
      } else {
        safePrint('⚠️ [getStudentInvoices] Response status: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      safePrint('❌ [getStudentInvoices] Error: $e');
      return [];
    }
  }

  /// 🔹 Lấy thống kê đổi quà
  /// Endpoint: GET /invoices/stats
  Future<InvoiceStats> getStats() async {
    try {
      safePrint('🔍 [getStats] Loading invoice stats');

      final response = await _apiClient.get(app_config.ApiConfig.invoiceStats);

      safePrint('📥 [getStats] Response status: ${response.statusCode}');
      safePrint('📥 [getStats] Response body: ${response.body}');

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        final data = json['data'] ?? json;
        final stats = InvoiceStats.fromJson(data as Map<String, dynamic>);

        safePrint('✅ [getStats] Loaded stats successfully');
        return stats;
      } else {
        throw Exception('Failed to load stats: ${response.statusCode}');
      }
    } catch (e) {
      safePrint('❌ [getStats] Error: $e');
      rethrow;
    }
  }
}

