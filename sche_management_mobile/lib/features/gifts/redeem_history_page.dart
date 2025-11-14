import 'package:flutter/material.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'dart:convert';
import 'invoice_service.dart';
import 'invoice_models.dart';
import '../../services/api_client.dart';
import '../../services/auth_service.dart';
import '../../config/api_config.dart' as app_config;

class RedeemHistoryPage extends StatefulWidget {
  const RedeemHistoryPage({super.key});

  @override
  State<RedeemHistoryPage> createState() => _RedeemHistoryPageState();
}

class _RedeemHistoryPageState extends State<RedeemHistoryPage> {
  final InvoiceService _invoiceService = InvoiceService();
  final AuthService _authService = AuthService();
  final ApiClient _apiClient = ApiClient();

  bool _isLoading = true;
  List<Invoice> _invoices = [];
  String? _error;
  String? _currentStudentId;

  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    final signedIn = await _authService.isSignedIn();
    if (!mounted) return;

    if (!signedIn) {
      setState(() {
        _isLoading = false;
        _error = 'Vui lòng đăng nhập để xem lịch sử đổi quà';
      });
      return;
    }

    // Get current student ID
    try {
      final response = await _apiClient.get(app_config.ApiConfig.profile);
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        final data = json['data'] ?? json;
        setState(() {
          _currentStudentId = data['id']?.toString();
        });
      }
    } catch (e) {
      safePrint('⚠️ Could not get student ID: $e');
    }

    await _loadInvoices();
  }

  Future<void> _loadInvoices() async {
    if (_currentStudentId == null) {
      setState(() {
        _isLoading = false;
        _error = 'Không thể lấy thông tin người dùng';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      safePrint('🔍 Loading invoices for student $_currentStudentId...');
      final invoices = await _invoiceService.getStudentInvoices(
        _currentStudentId!,
      );

      if (mounted) {
        setState(() {
          _invoices = invoices;
          _isLoading = false;
        });
      }

      safePrint('✅ Loaded ${invoices.length} invoices');
    } catch (e) {
      safePrint('❌ Error loading invoices: $e');
      if (mounted) {
        setState(() {
          _error = e.toString();
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Lịch sử đổi quà',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Color(0xFF111827),
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF111827)),
      ),
      backgroundColor: const Color(0xFFF9FAFB),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: Color(0xFFFB923C)),
      );
    }

    if (_error != null && _invoices.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Color(0xFFDC2626)),
            const SizedBox(height: 16),
            const Text(
              'Không thể tải lịch sử',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF111827),
              ),
            ),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                _error!,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Color(0xFF6B7280)),
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () => _loadInvoices(),
              icon: const Icon(Icons.refresh),
              label: const Text('Thử lại'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFB923C),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
              ),
            ),
          ],
        ),
      );
    }

    if (_invoices.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.receipt_long_outlined,
              size: 64,
              color: Color(0xFF9CA3AF),
            ),
            const SizedBox(height: 16),
            const Text(
              'Chưa có lịch sử đổi quà',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF111827),
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Bạn chưa đổi quà nào',
              style: TextStyle(color: Color(0xFF6B7280)),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => _loadInvoices(),
      color: const Color(0xFFFB923C),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _invoices.length,
        itemBuilder: (context, index) {
          return _buildInvoiceCard(_invoices[index]);
        },
      ),
    );
  }

  Widget _buildInvoiceCard(Invoice invoice) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header: Product name and status
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        invoice.productName.isNotEmpty
                            ? invoice.productName
                            : 'Sản phẩm #${invoice.productId}',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF111827),
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      if (invoice.productName.isEmpty ||
                          invoice.productName == 'Sản phẩm')
                        const SizedBox(height: 4),
                      if (invoice.productName.isEmpty ||
                          invoice.productName == 'Sản phẩm')
                        Text(
                          'ID: ${invoice.productId}',
                          style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xFF6B7280),
                          ),
                        ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: invoice.statusColor.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    invoice.statusLabel,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: invoice.statusColor,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            // Points used
            Row(
              children: [
                const Icon(
                  Icons.monetization_on,
                  size: 16,
                  color: Color(0xFFFB923C),
                ),
                const SizedBox(width: 8),
                Text(
                  'Đã dùng: ${invoice.pointsUsed} coin',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF111827),
                  ),
                ),
                if (invoice.quantity > 1) ...[
                  const SizedBox(width: 8),
                  Text(
                    'x${invoice.quantity}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFF6B7280),
                    ),
                  ),
                ],
              ],
            ),
            const SizedBox(height: 8),
            // Date
            Row(
              children: [
                const Icon(
                  Icons.calendar_today,
                  size: 14,
                  color: Color(0xFF6B7280),
                ),
                const SizedBox(width: 8),
                Text(
                  invoice.formattedDate,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF6B7280),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
