import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:amplify_flutter/amplify_flutter.dart';

import '../../services/api_client.dart';
import '../../services/auth_service.dart';
import '../../config/api_config.dart' as app_config;
import 'gift_models.dart';
import 'invoice_service.dart';

class GiftsPage extends StatefulWidget {
  const GiftsPage({super.key});

  @override
  State<GiftsPage> createState() => _GiftsPageState();
}

class _GiftsPageState extends State<GiftsPage> {
  final ApiClient _apiClient = ApiClient();
  final ScrollController _scrollController = ScrollController();
  final AuthService _authService = AuthService();

  bool _isLoading = true;
  bool _isRefreshing = false;
  String? _error;
  bool _isSignedIn = false;

  final List<Gift> _gifts = [];

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    _initialize();
  }

  Future<void> _initialize() async {
    await _checkAuthStatus();
    await _loadGifts();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {}

  Future<void> _checkAuthStatus() async {
    final signedIn = await _authService.isSignedIn();
    if (!mounted) return;

    setState(() {
      _isSignedIn = signedIn;
    });
  }

  Future<void> _loadGifts({bool refresh = false}) async {
    if (refresh) {
      setState(() {
        _isRefreshing = true;
        _error = null;
        _gifts.clear();
      });
    } else {
      setState(() {
        _isLoading = true;
        _error = null;
      });
    }

    try {
      final endpoints = [
        '${app_config.ApiConfig.products}?category=GIFT&isActive=true&sortBy=createdAt&order=desc&limit=100&offset=0',
        '${app_config.ApiConfig.products}?category=VOUCHER&isActive=true&sortBy=createdAt&order=desc&limit=100&offset=0',
      ];

      final responses = await Future.wait(
        endpoints.map((path) => _apiClient.get(path)),
      );

      final List<Gift> combined = [];

      for (final response in responses) {
        safePrint('🎁 Products response: ${response.statusCode}');

        if (response.statusCode == 200) {
          final decoded = jsonDecode(response.body);
          final List<dynamic> rawList = _extractGiftList(decoded);
          combined.addAll(
            rawList
                .whereType<Map<String, dynamic>>()
                .map(Gift.fromJson)
                .toList(),
          );
        } else if (response.statusCode == 404) {
          safePrint('⚠️ Products endpoint returned 404, treating as empty.');
        } else {
          throw Exception('Failed to load gifts: ${response.statusCode}');
        }
      }

      final Map<String, Gift> uniqueMap = {
        for (final gift in combined) gift.id: gift,
      };

      final uniqueGifts = uniqueMap.values.toList()
        ..sort((a, b) {
          final aDate = a.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0);
          final bDate = b.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0);
          return bDate.compareTo(aDate);
        });

      setState(() {
        _gifts
          ..clear()
          ..addAll(uniqueGifts);
        _error = null;
      });
      safePrint('✅ Loaded ${uniqueGifts.length} gifts.');
    } catch (e) {
      safePrint('❌ Error loading gifts: $e');
      if (mounted) {
        final message = e.toString().contains('500')
            ? 'Máy chủ đang gặp sự cố (500). Vui lòng thử lại sau.'
            : e.toString();
        setState(() {
          _error = message;
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _isRefreshing = false;
        });
      }
    }
  }

  List<dynamic> _extractGiftList(dynamic source) {
    if (source == null) return [];
    if (source is List) return source;
    if (source is Map<String, dynamic>) {
      final candidates = [
        source['data'],
        source['items'],
        source['content'],
        source['products'],
        source['result'],
      ];
      for (final candidate in candidates) {
        if (candidate is List) return candidate;
      }
      for (final value in source.values) {
        if (value is List) return value;
      }
    }
    return [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Đổi quà'),
        backgroundColor: const Color(0xFFFB923C),
        foregroundColor: Colors.white,
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await _checkAuthStatus();
          await _loadGifts(refresh: true);
        },
        child: _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    if (_isLoading && _gifts.isEmpty && !_isRefreshing) {
      return const Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFFB923C)),
        ),
      );
    }

    if (_error != null && _gifts.isEmpty) {
      return _ErrorState(
        message: _error ?? 'Không thể tải danh sách quà',
        onRetry: () => _loadGifts(refresh: true),
      );
    }

    if (_gifts.isEmpty) {
      return const _EmptyState();
    }

    return CustomScrollView(
      controller: _scrollController,
      slivers: [
        const SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsets.only(top: 16, left: 16, right: 16),
            child: Text(
              'Danh sách quà tặng',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color(0xFF111827),
              ),
            ),
          ),
        ),
        const SliverToBoxAdapter(child: SizedBox(height: 12)),
        SliverPadding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          sliver: SliverGrid(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.72,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
            ),
            delegate: SliverChildBuilderDelegate((context, index) {
              if (index >= _gifts.length) return const SizedBox.shrink();
              return _GiftCard(
                gift: _gifts[index],
                onTap: () => _showGiftDetail(_gifts[index]),
              );
            }, childCount: _gifts.length),
          ),
        ),
        const SliverToBoxAdapter(child: SizedBox(height: 24)),
      ],
    );
  }

  void _showGiftDetail(Gift gift) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) =>
          _GiftDetailSheet(gift: gift, isSignedIn: _isSignedIn),
    );
  }
}

class _GiftCard extends StatelessWidget {
  const _GiftCard({required this.gift, required this.onTap});

  final Gift gift;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(20),
              ),
              child: Container(
                height: 120,
                width: double.infinity,
                color: const Color(0xFFF3F4F6),
                child: gift.imageUrl != null
                    ? Image.network(
                        gift.imageUrl!,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) =>
                            _GiftPlaceholderIcon(icon: Icons.card_giftcard),
                      )
                    : const _GiftPlaceholderIcon(icon: Icons.card_giftcard),
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      gift.name,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(
                          Icons.monetization_on,
                          size: 16,
                          color: Color(0xFFFB923C),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '${gift.requiredPoints} coin',
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFFB923C),
                          ),
                        ),
                      ],
                    ),
                    const Spacer(),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: gift.availabilityColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            gift.inStock ? 'Còn ${gift.quantity}' : 'Hết quà',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: gift.availabilityColor,
                            ),
                          ),
                        ),
                        const Spacer(),
                        const Icon(
                          Icons.chevron_right,
                          size: 20,
                          color: Color(0xFF9CA3AF),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _GiftDetailSheet extends StatefulWidget {
  const _GiftDetailSheet({required this.gift, required this.isSignedIn});

  final Gift gift;
  final bool isSignedIn;

  @override
  State<_GiftDetailSheet> createState() => _GiftDetailSheetState();
}

class _GiftDetailSheetState extends State<_GiftDetailSheet> {
  final InvoiceService _invoiceService = InvoiceService();
  final ApiClient _apiClient = ApiClient();
  bool _isRedeeming = false;
  int? _currentBalance;
  String? _currentStudentId;

  @override
  void initState() {
    super.initState();
    if (widget.isSignedIn) {
      _loadBalance();
    }
  }

  Future<void> _loadBalance() async {
    try {
      final response = await _apiClient.get(app_config.ApiConfig.profile);
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        final data = json['data'] ?? json;
        if (mounted) {
          setState(() {
            _currentBalance = (data['balance'] as num?)?.toInt() ?? 0;
            _currentStudentId = data['id']?.toString();
          });
        }
      }
    } catch (e) {
      safePrint('❌ Error loading balance: $e');
    }
  }

  Future<void> _redeemGift() async {
    if (!widget.isSignedIn) {
      Navigator.of(context).pop();
      Navigator.of(context).pushNamed('/login');
      return;
    }

    if (_currentBalance == null) {
      await _loadBalance();
    }

    if (_currentBalance == null || _currentStudentId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Không thể lấy thông tin người dùng. Vui lòng thử lại.',
          ),
          backgroundColor: Color(0xFFDC2626),
        ),
      );
      return;
    }

    if (_currentBalance! < widget.gift.requiredPoints) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Bạn không đủ điểm. Cần ${widget.gift.requiredPoints} coin, bạn có $_currentBalance coin.',
          ),
          backgroundColor: const Color(0xFFDC2626),
        ),
      );
      return;
    }

    if (!widget.gift.inStock) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Sản phẩm đã hết hàng.'),
          backgroundColor: Color(0xFFDC2626),
        ),
      );
      return;
    }

    // Show confirmation dialog
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Xác nhận đổi quà'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Bạn có chắc chắn muốn đổi "${widget.gift.name}"?'),
            const SizedBox(height: 8),
            Text(
              'Số điểm cần: ${widget.gift.requiredPoints} coin',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            Text(
              'Số dư hiện tại: $_currentBalance coin',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            Text(
              'Số dư sau khi đổi: ${_currentBalance! - widget.gift.requiredPoints} coin',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Color(0xFF10B981),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Hủy'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFFB923C),
              foregroundColor: Colors.white,
            ),
            child: const Text('Xác nhận'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    setState(() => _isRedeeming = true);

    try {
      safePrint(
        '🔍 Redeeming gift ${widget.gift.id} for student $_currentStudentId...',
      );
      final redeemResponse = await _invoiceService.redeemProduct(
        productId: widget.gift.id,
        studentId: _currentStudentId!,
        quantity: 1,
      );

      if (mounted) {
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Đổi quà thành công! Số dư còn lại: ${redeemResponse.newBalance} coin',
            ),
            backgroundColor: const Color(0xFF10B981),
            duration: const Duration(seconds: 3),
          ),
        );
      }
    } catch (e) {
      safePrint('❌ Error redeeming gift: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Lỗi: ${e.toString()}'),
            backgroundColor: const Color(0xFFDC2626),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isRedeeming = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.85,
      maxChildSize: 0.95,
      minChildSize: 0.5,
      builder: (context, controller) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            children: [
              Container(
                width: 60,
                height: 5,
                margin: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFFE5E7EB),
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
              Expanded(
                child: SingleChildScrollView(
                  controller: controller,
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: Container(
                          height: 220,
                          width: double.infinity,
                          color: const Color(0xFFF3F4F6),
                          child: widget.gift.imageUrl != null
                              ? Image.network(
                                  widget.gift.imageUrl!,
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, __, ___) =>
                                      const _GiftPlaceholderIcon(
                                        icon: Icons.card_giftcard,
                                        size: 64,
                                      ),
                                )
                              : const _GiftPlaceholderIcon(
                                  icon: Icons.card_giftcard,
                                  size: 64,
                                ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      Text(
                        widget.gift.name,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF111827),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF3F4F6),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              widget.gift.categoryLabel,
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF6B7280),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: widget.gift.availabilityColor.withOpacity(
                                0.1,
                              ),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              widget.gift.inStock
                                  ? 'Còn ${widget.gift.quantity} sản phẩm'
                                  : 'Đã hết quà',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: widget.gift.availabilityColor,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEF3C7),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.stars_rounded,
                              color: Color(0xFFF59E0B),
                              size: 28,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Điểm cần đổi',
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF92400E),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '${widget.gift.requiredPoints} coin',
                                    style: const TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                      color: Color(0xFF111827),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (widget.gift.description != null &&
                          widget.gift.description!.trim().isNotEmpty) ...[
                        const SizedBox(height: 24),
                        const Text(
                          'Mô tả',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF111827),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          widget.gift.description!,
                          style: const TextStyle(
                            fontSize: 14,
                            color: Color(0xFF6B7280),
                            height: 1.6,
                          ),
                        ),
                      ],
                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ),
              SafeArea(
                top: false,
                minimum: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 16,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    if (!widget.isSignedIn)
                      Container(
                        padding: const EdgeInsets.all(12),
                        margin: const EdgeInsets.only(bottom: 12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF7ED),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: const Color(0xFFF97316).withOpacity(0.3),
                          ),
                        ),
                        child: Row(
                          children: const [
                            Icon(
                              Icons.lock_outline,
                              size: 18,
                              color: Color(0xFFF97316),
                            ),
                            SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                'Đăng nhập để tích điểm và đổi quà.',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFFD97706),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    // Balance info
                    if (widget.isSignedIn && _currentBalance != null) ...[
                      Container(
                        padding: const EdgeInsets.all(12),
                        margin: const EdgeInsets.only(bottom: 12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEFF6FF),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: const Color(0xFF3B82F6).withOpacity(0.3),
                          ),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.account_balance_wallet,
                              size: 18,
                              color: Color(0xFF3B82F6),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                'Số dư: $_currentBalance coin',
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF1E40AF),
                                ),
                              ),
                            ),
                            if (_currentBalance! < widget.gift.requiredPoints)
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFDC2626),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Text(
                                  'Không đủ',
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ],
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: _isRedeeming
                            ? null
                            : () {
                                if (!widget.isSignedIn) {
                                  Navigator.of(context).pop();
                                  Navigator.of(context).pushNamed('/login');
                                } else {
                                  _redeemGift();
                                }
                              },
                        icon: _isRedeeming
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                    Colors.white,
                                  ),
                                ),
                              )
                            : const Icon(Icons.redeem),
                        label: Text(
                          _isRedeeming
                              ? 'Đang xử lý...'
                              : widget.isSignedIn
                              ? 'Đổi quà'
                              : 'Đăng nhập để đổi quà',
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor:
                              widget.isSignedIn &&
                                  _currentBalance != null &&
                                  _currentBalance! >=
                                      widget.gift.requiredPoints &&
                                  widget.gift.inStock
                              ? const Color(0xFFFB923C)
                              : const Color(0xFF9CA3AF),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          disabledBackgroundColor: const Color(0xFF9CA3AF),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _GiftPlaceholderIcon extends StatelessWidget {
  const _GiftPlaceholderIcon({required this.icon, this.size = 40});

  final IconData icon;
  final double size;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Icon(icon, size: size, color: const Color(0xFF9CA3AF)),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: const [
            Icon(
              Icons.card_giftcard_outlined,
              size: 80,
              color: Color(0xFF9CA3AF),
            ),
            SizedBox(height: 16),
            Text(
              'Chưa có quà tặng',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF111827),
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Những món quà hấp dẫn sẽ xuất hiện ở đây, hãy quay lại sau nhé!',
              textAlign: TextAlign.center,
              style: TextStyle(color: Color(0xFF6B7280)),
            ),
          ],
        ),
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 72, color: Color(0xFF9CA3AF)),
            const SizedBox(height: 16),
            const Text(
              'Không thể tải danh sách quà',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF111827),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Color(0xFF6B7280)),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: onRetry,
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
      ),
    );
  }
}
