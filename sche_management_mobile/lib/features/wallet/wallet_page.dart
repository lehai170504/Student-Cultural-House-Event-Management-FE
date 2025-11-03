import 'package:flutter/material.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'dart:convert';
import '../../services/api_client.dart';
import '../../config/api_config.dart' as app_config;

class WalletPage extends StatefulWidget {
  const WalletPage({super.key});

  @override
  State<WalletPage> createState() => _WalletPageState();
}

class _WalletPageState extends State<WalletPage> {
  final ApiClient _apiClient = ApiClient();
  bool _isLoading = true;
  int? _walletId;
  double _balance = 0.0;
  List<Transaction> _transactions = [];
  String? _error;
  int _currentPage = 1;
  final int _pageSize = 10;

  @override
  void initState() {
    super.initState();
    _loadWalletInfo();
  }

  Future<void> _loadWalletInfo({bool refresh = false}) async {
    if (refresh) {
      setState(() {
        _isLoading = true;
        _error = null;
      });
    }

    try {
      // First, get user profile to find wallet ID
      safePrint('🔍 Loading user profile...');
      final profileResponse = await _apiClient.get(
        app_config.ApiConfig.profile,
      );

      if (profileResponse.statusCode == 200) {
        final profileJson =
            jsonDecode(profileResponse.body) as Map<String, dynamic>;
        final profileData = profileJson['data'] ?? profileJson;
        _walletId = profileData['walletId'] as int?;

        safePrint('📥 Wallet ID: $_walletId');

        if (_walletId != null) {
          // Load wallet details
          safePrint('🔍 Loading wallet details...');
          final walletResponse = await _apiClient.get(
            app_config.ApiConfig.getWallet(_walletId!),
          );

          safePrint('📥 Wallet response: ${walletResponse.statusCode}');

          if (walletResponse.statusCode == 200) {
            final walletJson =
                jsonDecode(walletResponse.body) as Map<String, dynamic>;
            final walletData = walletJson['data'] ?? walletJson;
            _balance = (walletData['balance'] as num?)?.toDouble() ?? 0.0;

            // Load transaction history
            await _loadTransactionHistory();
          } else {
            throw Exception(
              'Failed to load wallet: ${walletResponse.statusCode}',
            );
          }
        }

        setState(() {
          _isLoading = false;
        });
      } else {
        throw Exception(
          'Failed to load profile: ${profileResponse.statusCode}',
        );
      }
    } catch (e) {
      safePrint('❌ Error loading wallet info: $e');
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _loadTransactionHistory() async {
    try {
      safePrint('🔍 Loading transaction history...');
      final response = await _apiClient.get(
        '${app_config.ApiConfig.walletHistory}?page=$_currentPage&size=$_pageSize&sort=createdAt,desc',
      );

      safePrint('📥 Transaction history response: ${response.statusCode}');
      safePrint('📥 Response body: ${response.body}');

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        final rawData = json['data'] ?? json;
        final Map<String, dynamic> dataMap;
        if (rawData is List) {
          dataMap = {'content': rawData};
        } else {
          dataMap = rawData as Map<String, dynamic>;
        }
        final transactionsData =
            dataMap['content'] ?? dataMap['transactions'] ?? [];

        final transactions = (transactionsData as List)
            .map((t) => Transaction.fromJson(t))
            .toList();

        setState(() {
          _transactions = transactions;
        });

        safePrint('✅ Loaded ${transactions.length} transactions');
      } else {
        throw Exception('Failed to load transactions: ${response.statusCode}');
      }
    } catch (e) {
      safePrint('❌ Error loading transaction history: $e');
      // Don't set error state here, just log it
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Ví của tôi'),
        backgroundColor: const Color(0xFFFB923C),
        foregroundColor: Colors.white,
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFFB923C)),
        ),
      );
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Color(0xFF6B7280)),
            const SizedBox(height: 16),
            const Text(
              'Không thể tải thông tin ví',
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
              onPressed: () => _loadWalletInfo(refresh: true),
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

    return RefreshIndicator(
      onRefresh: () => _loadWalletInfo(refresh: true),
      color: const Color(0xFFFB923C),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Balance Card
            _buildBalanceCard(),
            const SizedBox(height: 24),
            // Transactions Section
            const Text(
              'Lịch sử giao dịch',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color(0xFF111827),
              ),
            ),
            const SizedBox(height: 16),
            _buildTransactionList(),
          ],
        ),
      ),
    );
  }

  Widget _buildBalanceCard() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFFB923C), Color(0xFFF97316)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFB923C).withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Số dư hiện tại',
            style: TextStyle(fontSize: 16, color: Colors.white70),
          ),
          const SizedBox(height: 8),
          Text(
            '${_balance.toStringAsFixed(0)} coin',
            style: const TextStyle(
              fontSize: 48,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(
                Icons.account_balance_wallet,
                color: Colors.white70,
                size: 16,
              ),
              const SizedBox(width: 4),
              Text(
                'Ví ID: ${_walletId ?? 'N/A'}',
                style: const TextStyle(fontSize: 14, color: Colors.white70),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionList() {
    if (_transactions.isEmpty) {
      return Center(
        child: Column(
          children: [
            const Icon(Icons.history, size: 64, color: Color(0xFF9CA3AF)),
            const SizedBox(height: 16),
            const Text(
              'Chưa có giao dịch',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF111827),
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Lịch sử giao dịch sẽ xuất hiện ở đây',
              style: TextStyle(color: Color(0xFF6B7280)),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _transactions.length,
      itemBuilder: (context, index) {
        return _buildTransactionCard(_transactions[index]);
      },
    );
  }

  Widget _buildTransactionCard(Transaction transaction) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Row(
        children: [
          // Icon
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: transaction.isCredit
                  ? const Color(0xFFD1FAE5)
                  : const Color(0xFFFEE2E2),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              transaction.isCredit ? Icons.add_circle : Icons.remove_circle,
              color: transaction.isCredit
                  ? const Color(0xFF10B981)
                  : const Color(0xFFDC2626),
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          // Details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  transaction.description,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF111827),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  transaction.formattedDate,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Color(0xFF6B7280),
                  ),
                ),
              ],
            ),
          ),
          // Amount
          Text(
            '${transaction.isCredit ? '+' : '-'}${transaction.amount.toStringAsFixed(0)}',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: transaction.isCredit
                  ? const Color(0xFF10B981)
                  : const Color(0xFFDC2626),
            ),
          ),
        ],
      ),
    );
  }
}

class Transaction {
  final int id;
  final String description;
  final DateTime createdAt;
  final double amount;
  final String type; // 'CREDIT' or 'DEBIT'

  Transaction({
    required this.id,
    required this.description,
    required this.createdAt,
    required this.amount,
    required this.type,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    // Map txnType to description
    String description;
    String type;

    switch (json['txnType'] as String? ?? '') {
      case 'SIGNUP_BONUS':
        description = 'Thưởng đăng ký';
        type = 'CREDIT';
        break;
      case 'EVENT_DEPOSIT':
        description = 'Tham gia sự kiện';
        type = 'DEBIT';
        break;
      case 'REDEEM_GIFT':
        description = 'Đổi quà';
        type = 'DEBIT';
        break;
      default:
        description = 'Giao dịch';
        type = 'CREDIT';
    }

    return Transaction(
      id: json['id'] as int,
      description: description,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : DateTime.now(),
      amount: (json['amount'] as num).toDouble(),
      type: type,
    );
  }

  bool get isCredit => type.toUpperCase() == 'CREDIT';

  String get formattedDate {
    final now = DateTime.now();
    final diff = now.difference(createdAt);

    if (diff.inDays == 0) {
      if (diff.inHours == 0) {
        if (diff.inMinutes == 0) {
          return 'Vừa xong';
        }
        return '${diff.inMinutes} phút trước';
      }
      return '${diff.inHours} giờ trước';
    } else if (diff.inDays == 1) {
      return 'Hôm qua';
    } else if (diff.inDays < 7) {
      return '${diff.inDays} ngày trước';
    } else {
      final months = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
      ];
      return '${createdAt.day}/${months[createdAt.month - 1]}/${createdAt.year}';
    }
  }
}
