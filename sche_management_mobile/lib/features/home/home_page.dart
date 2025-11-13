import 'package:flutter/material.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import '../../services/auth_service.dart';
import 'dart:convert';
import '../../services/api_client.dart';
import '../../config/api_config.dart' as app_config;
import '../events/events_page.dart';
import '../gifts/gifts_page.dart';
import '../gifts/gift_models.dart';
import '../notifications/notifications_page.dart';
import '../../services/notification_service.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  PageController _heroController = PageController();
  int _currentHeroSlide = 0;
  bool _isLoading = true;
  bool _isSignedIn = false;

  final List<_HomeEvent> _events = [];

  final List<Gift> _gifts = [];
  bool _loadingGifts = true;

  final AuthService _authService = AuthService();
  final ApiClient _apiClient = ApiClient();
  final NotificationService _notificationService = NotificationService();

  // Dynamic data
  String _userName = '';
  int _totalPoints = 0;
  int _unreadNotificationCount = 0;

  final List<HeroSlide> _heroSlides = [
    HeroSlide(
      title: "Nhà Văn Hóa Sinh Viên",
      subtitle: "Nơi tổ chức sự kiện, giao lưu văn hóa",
      description:
          "Tham gia các hoạt động văn hóa, nghệ thuật và giao lưu với cộng đồng sinh viên",
      buttonText: "Khám phá sự kiện",
      gradient: const LinearGradient(
        colors: [Color(0xFFFB923C), Color(0xFFF97316)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
      icon: Icons.event_available_rounded,
    ),
    HeroSlide(
      title: "Đêm nhạc Sinh Viên 2025",
      subtitle: "Trải nghiệm âm nhạc đỉnh cao",
      description:
          "Cùng thưởng thức những giai điệu tuyệt vời từ các nghệ sĩ sinh viên tài năng",
      buttonText: "Tham gia ngay",
      gradient: const LinearGradient(
        colors: [Color(0xFF8B5CF6), Color(0xFF7C3AED)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
      icon: Icons.music_note_rounded,
    ),
    HeroSlide(
      title: "Lễ hội Văn Hóa Quốc Tế",
      subtitle: "Khám phá đa dạng văn hóa thế giới",
      description:
          "Trải nghiệm ẩm thực, trang phục và truyền thống từ khắp nơi trên thế giới",
      buttonText: "Xem chi tiết",
      gradient: const LinearGradient(
        colors: [Color(0xFF10B981), Color(0xFF059669)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
      icon: Icons.public_rounded,
    ),
    HeroSlide(
      title: "Workshop Khởi Nghiệp",
      subtitle: "Học hỏi từ các chuyên gia",
      description:
          "Phát triển kỹ năng kinh doanh và tư duy khởi nghiệp từ những người thành công",
      buttonText: "Đăng ký",
      gradient: const LinearGradient(
        colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
      icon: Icons.lightbulb_rounded,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _startAutoSlide();
    _initialize();
  }

  Future<void> _initialize() async {
    await _checkAuthStatus();
    if (!mounted) return;

    if (_isSignedIn) {
      await _loadProfile();
      _loadUnreadNotificationCount();
      _setupNotificationListener();
    } else {
      setState(() {
        _userName = '';
        _totalPoints = 0;
        _unreadNotificationCount = 0;
      });
    }

    await Future.wait([_loadEvents(), _loadGifts()]);
  }

  void _setupNotificationListener() {
    _notificationService.onUnreadCountChanged = (count) {
      if (mounted) {
        setState(() {
          _unreadNotificationCount = count;
        });
      }
    };
  }

  Future<void> _loadUnreadNotificationCount() async {
    try {
      final count = await _notificationService.getUnreadCount();
      if (mounted) {
        setState(() {
          _unreadNotificationCount = count;
        });
      }
    } catch (e) {
      safePrint('❌ Error loading unread notification count: $e');
    }
  }

  Widget _buildHeaderCard(BuildContext context) {
    final greeting = _userName.isNotEmpty
        ? 'Chào, $_userName'
        : 'Chào mừng bạn';
    final pointsLabel = _isSignedIn
        ? '${_totalPoints.toString()} coin'
        : 'Đăng nhập để tích coin';
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      child: Container(
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFFFFA726), Color(0xFFFF7043)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(28),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFFFA726).withOpacity(0.35),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          greeting,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.w800,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Tham gia các hoạt động văn hóa, nghệ thuật và giao lưu với cộng đồng sinh viên',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.9),
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  // Notification bell
                  Stack(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.18),
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.3),
                          ),
                        ),
                        child: GestureDetector(
                          onTap: () {
                            Navigator.of(context)
                                .push(
                                  MaterialPageRoute(
                                    builder: (_) => const NotificationsPage(),
                                  ),
                                )
                                .then((_) {
                                  // Reload unread count when returning
                                  _loadUnreadNotificationCount();
                                });
                          },
                          child: const Icon(
                            Icons.notifications_outlined,
                            color: Colors.white,
                            size: 24,
                          ),
                        ),
                      ),
                      if (_unreadNotificationCount > 0)
                        Positioned(
                          right: 4,
                          top: 4,
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            decoration: const BoxDecoration(
                              color: Colors.red,
                              shape: BoxShape.circle,
                            ),
                            constraints: const BoxConstraints(
                              minWidth: 18,
                              minHeight: 18,
                            ),
                            child: Text(
                              _unreadNotificationCount > 9
                                  ? '9+'
                                  : '$_unreadNotificationCount',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.18),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: Colors.white.withOpacity(0.3)),
                    ),
                    child: Image.asset(
                      'assets/images/LogoRMBG.png',
                      height: 42,
                      width: 42,
                      fit: BoxFit.contain,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 10,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: Colors.white.withOpacity(0.3),
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.stars_rounded, color: Colors.white),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              pointsLabel,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w700,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  TextButton(
                    onPressed: () {
                      if (_isSignedIn) {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const EventsPage()),
                        );
                      } else {
                        Navigator.of(context).pushNamed('/login');
                      }
                    },
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 18,
                        vertical: 10,
                      ),
                      textStyle: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    child: Text(
                      _isSignedIn ? 'Khám phá sự kiện' : 'Đăng nhập ngay',
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeroCarousel() {
    if (_heroSlides.isEmpty) {
      return const SizedBox.shrink();
    }

    return Padding(
      padding: const EdgeInsets.only(top: 8),
      child: Column(
        children: [
          SizedBox(
            height: 260,
            child: PageView.builder(
              controller: _heroController,
              onPageChanged: (index) {
                setState(() {
                  _currentHeroSlide = index % _heroSlides.length;
                });
              },
              itemCount: null,
              itemBuilder: (context, index) {
                final slideIndex = index % _heroSlides.length;
                return _buildHeroSlide(_heroSlides[slideIndex]);
              },
            ),
          ),
          const SizedBox(height: 12),
          _buildHeroIndicators(),
        ],
      ),
    );
  }

  Widget _buildHeroIndicators() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(
        _heroSlides.length,
        (index) => AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          margin: const EdgeInsets.symmetric(horizontal: 4),
          height: 6,
          width: index == _currentHeroSlide ? 22 : 8,
          decoration: BoxDecoration(
            color: index == _currentHeroSlide
                ? const Color(0xFFFB923C)
                : const Color(0xFFE5E7EB),
            borderRadius: BorderRadius.circular(4),
          ),
        ),
      ),
    );
  }

  Widget _buildQuickActionsSection(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Tính năng nổi bật',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color(0xFF111827),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildQuickAction(
                  icon: Icons.event_available_rounded,
                  title: 'Sự kiện',
                  subtitle: 'Xem tất cả',
                  color: const Color(0xFFFB923C),
                  onTap: () => Navigator.of(
                    context,
                  ).push(MaterialPageRoute(builder: (_) => const EventsPage())),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildQuickAction(
                  icon: Icons.card_giftcard_rounded,
                  title: 'Đổi quà',
                  subtitle: 'Cửa hàng',
                  color: const Color(0xFF8B5CF6),
                  onTap: () => Navigator.of(
                    context,
                  ).push(MaterialPageRoute(builder: (_) => const GiftsPage())),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildUpcomingEventsSection(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text(
                'Sự kiện sắp tới',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF111827),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (_isLoading)
            const Center(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 24),
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFFB923C)),
                ),
              ),
            )
          else if (_events.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 24),
              child: Text(
                'Chưa có sự kiện nào được mở đăng ký.',
                style: TextStyle(color: Color(0xFF6B7280)),
              ),
            )
          else
            SizedBox(
              height: 200,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _events.length,
                separatorBuilder: (_, __) => const SizedBox(width: 12),
                itemBuilder: (context, index) {
                  return _buildUpcomingCard(context, _events[index]);
                },
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildUpcomingCard(BuildContext context, _HomeEvent event) {
    return InkWell(
      onTap: () => Navigator.of(
        context,
      ).push(MaterialPageRoute(builder: (_) => const EventsPage())),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        width: 220,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: event.statusColor.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      event.statusLabel,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: event.statusColor,
                      ),
                    ),
                  ),
                  const Icon(
                    Icons.calendar_today_rounded,
                    size: 18,
                    color: Color(0xFFFB923C),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                event.title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF111827),
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 8),
              Text(
                '${event.formattedDate} • ${_formatTimeRange(event)}',
                style: const TextStyle(fontSize: 13, color: Color(0xFF6B7280)),
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  const Icon(
                    Icons.location_on_rounded,
                    size: 16,
                    color: Color(0xFF8B5CF6),
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      event.location,
                      style: const TextStyle(
                        fontSize: 13,
                        color: Color(0xFF6B7280),
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _checkAuthStatus() async {
    final signedIn = await _authService.isSignedIn();
    if (mounted) {
      setState(() {
        _isSignedIn = signedIn;
      });
    }
  }

  Future<void> _loadProfile() async {
    try {
      safePrint('🔍 Loading user profile on HomePage...');
      final res = await _apiClient.get(app_config.ApiConfig.profile);
      safePrint('📥 Profile response status: ${res.statusCode}');
      safePrint('📥 Profile response body: ${res.body}');

      if (res.statusCode == 200) {
        final data = (await Future.value(res.body)).isNotEmpty
            ? (jsonDecode(res.body) as Map<String, dynamic>)
            : {};
        final d = data['data'] ?? data;
        safePrint('📥 Parsed data: $d');
        safePrint('📥 Total points: ${d['totalPoints']}');

        if (mounted) {
          setState(() {
            _userName = (d['fullName'] as String?)?.trim() ?? '';
            _totalPoints = (d['balance'] as num?)?.toInt() ?? 0;
          });
          safePrint(
            '✅ Updated: userName=$_userName, totalPoints=$_totalPoints',
          );
        }
      } else if (res.statusCode == 401) {
        safePrint('⚠️ Profile requires authentication (401).');
        if (mounted) {
          setState(() {
            _isSignedIn = false;
            _userName = '';
            _totalPoints = 0;
          });
        }
      } else {
        safePrint('⚠️ Profile not found (status: ${res.statusCode})');
      }
    } catch (e) {
      safePrint('❌ Error loading profile: $e');
    }
  }

  Future<void> _loadEvents() async {
    try {
      setState(() => _isLoading = true);
      final res = await _apiClient.get(
        '${app_config.ApiConfig.events}?page=1&size=20',
      );
      if (res.statusCode == 200) {
        final json = jsonDecode(res.body) as Map<String, dynamic>;
        final data = json['data'] ?? json['content'] ?? [];
        final now = DateTime.now();
        final raw = (data as List)
            .map((e) => _HomeEvent.fromJson(e as Map<String, dynamic>))
            .where((event) => event.isActive)
            .toList();

        final filtered =
            raw.where((event) {
              final isOngoing =
                  now.isAfter(event.startTime) && now.isBefore(event.endTime);
              final isUpcoming = now.isBefore(event.startTime);
              return isOngoing || isUpcoming;
            }).toList()..sort((a, b) {
              final aOngoing =
                  now.isAfter(a.startTime) && now.isBefore(a.endTime);
              final bOngoing =
                  now.isAfter(b.startTime) && now.isBefore(b.endTime);
              if (aOngoing != bOngoing) {
                return aOngoing ? -1 : 1;
              }
              return a.startTime.compareTo(b.startTime);
            });

        if (mounted) {
          setState(() {
            _events
              ..clear()
              ..addAll(filtered.take(10));
            _isLoading = false;
          });
        }
      } else {
        if (mounted) setState(() => _isLoading = false);
        safePrint('⚠️ Failed to load home events (status: ${res.statusCode})');
      }
    } catch (err) {
      safePrint('⚠️ Failed to load home events: $err');
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _loadGifts() async {
    try {
      setState(() => _loadingGifts = true);
      final endpoints = [
        '${app_config.ApiConfig.products}?category=GIFT&isActive=true&sortBy=createdAt&order=desc&limit=8&offset=0',
        '${app_config.ApiConfig.products}?category=VOUCHER&isActive=true&sortBy=createdAt&order=desc&limit=8&offset=0',
      ];
      final responses = await Future.wait(
        endpoints.map((path) => _apiClient.get(path)),
      );

      final combined = <Gift>[];
      for (final response in responses) {
        if (response.statusCode == 200) {
          final decoded = jsonDecode(response.body);
          final list = _extractGiftList(
            decoded,
          ).whereType<Map<String, dynamic>>().map(Gift.fromJson).toList();
          combined.addAll(list);
        } else {
          safePrint('⚠️ Failed to load gifts (status: ${response.statusCode})');
        }
      }

      final unique =
          {for (final gift in combined) gift.id: gift}.values.toList()..sort(
            (a, b) => (a.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0))
                .compareTo(
                  b.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0),
                ),
          );

      if (mounted) {
        setState(() {
          _gifts
            ..clear()
            ..addAll(unique.reversed.take(6));
          _loadingGifts = false;
        });
      }
    } catch (err) {
      safePrint('⚠️ Failed to load gifts: $err');
      if (mounted) setState(() => _loadingGifts = false);
    }
  }

  List<dynamic> _extractGiftList(dynamic source) {
    if (source == null) return [];
    if (source is List) return source;
    if (source is Map<String, dynamic>) {
      final candidates = [
        source['data'],
        source['content'],
        source['items'],
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

  Future<void> _refreshHome() async {
    await _checkAuthStatus();
    if (!mounted) return;

    if (_isSignedIn) {
      await _loadProfile();
    } else {
      setState(() {
        _userName = '';
        _totalPoints = 0;
      });
    }

    await Future.wait([_loadEvents(), _loadGifts()]);
  }

  void _startAutoSlide() {
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted && _heroController.hasClients) {
        _heroController.nextPage(
          duration: const Duration(milliseconds: 800),
          curve: Curves.easeInOut,
        );
        _startAutoSlide();
      }
    });
  }

  @override
  void dispose() {
    _heroController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F7FB),
      body: SafeArea(
        child: RefreshIndicator(
          color: const Color(0xFFFB923C),
          onRefresh: _refreshHome,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeaderCard(context),
                const SizedBox(height: 20),
                _buildHeroCarousel(),
                const SizedBox(height: 24),
                _buildQuickActionsSection(context),
                const SizedBox(height: 24),
                _buildUpcomingEventsSection(context),
                const SizedBox(height: 24),
                _buildGiftHighlightsSection(context),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeroSlide(HeroSlide slide) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        gradient: slide.gradient,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: slide.gradient.colors[0].withOpacity(0.4),
            blurRadius: 30,
            spreadRadius: -5,
            offset: const Offset(0, 15),
          ),
        ],
      ),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          // Add a subtle overlay for text readability
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Colors.transparent, Colors.black.withOpacity(0.1)],
          ),
        ),
        child: Stack(
          children: [
            // Decorative elements
            Positioned(
              top: -20,
              right: -20,
              child: Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withOpacity(0.1),
                ),
              ),
            ),
            Positioned(
              bottom: -30,
              left: -30,
              child: Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withOpacity(0.08),
                ),
              ),
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Icon badge
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Colors.white.withOpacity(0.3),
                        width: 1.5,
                      ),
                    ),
                    child: Icon(slide.icon, color: Colors.white, size: 28),
                  ),
                  const SizedBox(height: 16),

                  // Subtitle
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: Colors.white.withOpacity(0.3),
                        width: 1,
                      ),
                    ),
                    child: Text(
                      slide.subtitle,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Title
                  Text(
                    slide.title,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      height: 1.2,
                      letterSpacing: -0.5,
                      shadows: [
                        Shadow(
                          color: Colors.black26,
                          offset: Offset(0, 2),
                          blurRadius: 4,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Description
                  Text(
                    slide.description,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.white.withOpacity(0.95),
                      height: 1.5,
                      shadows: const [
                        Shadow(
                          color: Colors.black26,
                          offset: Offset(0, 1),
                          blurRadius: 2,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickAction({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    VoidCallback? onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.1),
            blurRadius: 12,
            spreadRadius: -2,
            offset: const Offset(0, 4),
          ),
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(20),
          child: Padding(
            padding: const EdgeInsets.all(18),
            child: Row(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [color, color.withOpacity(0.8)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: color.withOpacity(0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Icon(icon, color: Colors.white, size: 28),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF111827),
                          letterSpacing: 0.3,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: const TextStyle(
                          fontSize: 13,
                          color: Color(0xFF6B7280),
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.chevron_right, color: Color(0xFFCBD5F5)),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGiftHighlightsSection(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Quà tặng nổi bật',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF111827),
                ),
              ),
              TextButton(
                onPressed: () => Navigator.of(
                  context,
                ).push(MaterialPageRoute(builder: (_) => const GiftsPage())),
                child: const Text('Xem tất cả'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (_loadingGifts)
            const Center(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 24),
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF8B5CF6)),
                ),
              ),
            )
          else if (_gifts.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 24),
              child: Text(
                'Chưa có quà tặng khả dụng.',
                style: TextStyle(color: Color(0xFF6B7280)),
              ),
            )
          else
            SizedBox(
              height: 200,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _gifts.length,
                separatorBuilder: (_, __) => const SizedBox(width: 12),
                itemBuilder: (context, index) {
                  final gift = _gifts[index];
                  return _GiftHighlightCard(gift: gift);
                },
              ),
            ),
        ],
      ),
    );
  }

  String _formatTimeRange(_HomeEvent event) {
    String fmt(DateTime dt) =>
        '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    return '${fmt(event.startTime)} - ${fmt(event.endTime)}';
  }
}

// Minimal event model for HomePage
class _HomeEvent {
  final String id;
  final String title;
  final String location;
  final DateTime startTime;
  final DateTime endTime;
  final String status;
  final String? bannerImageUrl;

  _HomeEvent({
    required this.id,
    required this.title,
    required this.location,
    required this.startTime,
    required this.endTime,
    required this.status,
    this.bannerImageUrl,
  });

  factory _HomeEvent.fromJson(Map<String, dynamic> json) => _HomeEvent(
    id: (json['id'] ?? json['eventId']).toString(),
    title: json['title'] as String,
    location: json['location'] as String,
    startTime: DateTime.parse(json['startTime'] as String),
    endTime: DateTime.parse(json['endTime'] as String),
    status: (json['status'] ?? '').toString().toUpperCase(),
    bannerImageUrl: json['bannerImageUrl'] as String?,
  );

  bool get isActive => status == 'ACTIVE';

  String get formattedDate {
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
    return '${startTime.day.toString().padLeft(2, '0')}/${months[startTime.month - 1]}/${startTime.year}';
  }

  String get statusLabel => status;

  Color get statusColor {
    switch (status) {
      case 'ACTIVE':
        return const Color(0xFF10B981);
      case 'DRAFT':
        return const Color(0xFF3B82F6);
      case 'FINISH':
        return const Color(0xFF6B7280);
      case 'CANCEL':
        return const Color(0xFFDC2626);
      default:
        return const Color(0xFF9CA3AF);
    }
  }
}

class HeroSlide {
  final String title;
  final String subtitle;
  final String description;
  final String buttonText;
  final Gradient gradient;
  final IconData icon;

  HeroSlide({
    required this.title,
    required this.subtitle,
    required this.description,
    required this.buttonText,
    required this.gradient,
    required this.icon,
  });
}

class _GiftHighlightCard extends StatelessWidget {
  const _GiftHighlightCard({required this.gift});

  final Gift gift;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
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
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF8B5CF6).withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                gift.categoryLabel,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF8B5CF6),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              gift.name,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF111827),
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 8),
            Text(
              gift.description ?? 'Quà tặng hấp dẫn dành cho bạn.',
              style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280)),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                const Icon(
                  Icons.stars_rounded,
                  size: 18,
                  color: Color(0xFFFB923C),
                ),
                const SizedBox(width: 6),
                Text(
                  '${gift.requiredPoints} coin',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFFFB923C),
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
