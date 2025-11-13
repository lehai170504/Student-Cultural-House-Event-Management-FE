import 'package:flutter/material.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'dart:convert';
import '../../services/api_client.dart';
import '../../services/auth_service.dart';
import '../../config/api_config.dart' as app_config;

class EventsPage extends StatefulWidget {
  const EventsPage({super.key});

  @override
  State<EventsPage> createState() => _EventsPageState();
}

class _EventsPageState extends State<EventsPage> {
  final ApiClient _apiClient = ApiClient();
  final AuthService _authService = AuthService();
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = true;
  List<Event> _events = [];
  String? _error;
  int _currentPage = 1;
  final int _pageSize = 10;
  bool _hasMore = true;
  bool _isSignedIn = false;
  bool _authChecked = false;
  Set<String> _registeredEventIds = {};

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    final signedIn = await _authService.isSignedIn();
    if (!mounted) return;

    setState(() {
      _isSignedIn = signedIn;
      _authChecked = true;
      _isLoading = true;
      _error = null;
      _currentPage = 1;
      _events = [];
      _hasMore = true;
    });

    await _loadEvents(refresh: true);

    if (signedIn) {
      await _loadRegisteredEvents();
    } else {
      setState(() {
        _registeredEventIds = {};
      });
    }
  }

  Future<void> _loadRegisteredEvents() async {
    if (!_isSignedIn) {
      setState(() {
        _registeredEventIds = {};
      });
      return;
    }

    try {
      safePrint('🔍 Loading registered events list...');
      final response = await _apiClient.get(app_config.ApiConfig.studentEvents);

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        final rawData = json['data'] ?? json;
        final Map<String, dynamic> dataMap;
        if (rawData is List) {
          dataMap = {'content': rawData};
        } else {
          dataMap = rawData as Map<String, dynamic>;
        }
        final eventsData = dataMap['content'] ?? dataMap['events'] ?? [];

        final registeredIds = (eventsData as List)
            .map((e) => (e['id'] ?? e['eventId']).toString())
            .toSet();

        setState(() {
          _registeredEventIds = registeredIds;
        });

        safePrint('✅ Loaded ${registeredIds.length} registered event IDs');
      } else if (response.statusCode == 401) {
        safePrint('⚠️ Registered events API returned 401.');
        setState(() {
          _isSignedIn = false;
          _registeredEventIds = {};
        });
      } else if (response.statusCode == 404) {
        safePrint('⚠️ No registered events endpoint, clearing list');
        setState(() {
          _registeredEventIds = {};
        });
      }
    } catch (e) {
      safePrint('⚠️ Failed to load registered events: $e');
      // Don't set error, just leave the set empty
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent * 0.8) {
      _loadMore();
    }
  }

  Future<void> _loadEvents({bool refresh = false}) async {
    if (refresh) {
      setState(() {
        _isLoading = true;
        _error = null;
        _currentPage = 1;
        _events = [];
        _hasMore = true;
      });
    } else {
      setState(() {
        _isLoading = true;
      });
    }

    try {
      safePrint('🔍 Loading events page $_currentPage...');

      final response = await _apiClient.get(
        '${app_config.ApiConfig.events}?page=$_currentPage&size=$_pageSize',
      );

      safePrint('📥 Events response status: ${response.statusCode}');
      safePrint('📥 Events response body: ${response.body}');

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        final data = json['data'] ?? json['content'] ?? [];
        final meta = json['meta'] ?? {};

        final events =
            (data as List)
                .map((e) => Event.fromJson(e as Map<String, dynamic>))
                .where((event) => event.status.toUpperCase() == 'ACTIVE')
                .toList()
              ..sort((a, b) => a.startTime.compareTo(b.startTime));

        setState(() {
          _events.addAll(events);
          _events.sort((a, b) => a.startTime.compareTo(b.startTime));
          _hasMore = (meta['currentPage'] ?? 0) < (meta['totalPages'] ?? 0);
          _isLoading = false;
        });

        safePrint(
          '✅ Loaded ${events.length} active events. Total: ${_events.length}',
        );
      } else {
        throw Exception('Failed to load events: ${response.statusCode}');
      }
    } catch (e) {
      safePrint('❌ Error loading events: $e');
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _loadMore() async {
    if (!_isLoading && _hasMore) {
      _currentPage++;
      await _loadEvents();
    }
  }

  Future<void> _registerForEvent(Event event) async {
    if (!_isSignedIn) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng đăng nhập để đăng ký sự kiện.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    try {
      safePrint('🔍 Registering for event ${event.id}...');
      final response = await _apiClient.post(
        app_config.ApiConfig.registerForEvent(event.id),
        body: {},
      );

      safePrint('✅ Register response: ${response.statusCode}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Add to registered list
        setState(() {
          _registeredEventIds.add(event.id);
        });

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Đăng ký sự kiện thành công!'),
              backgroundColor: Color(0xFF10B981),
            ),
          );
        }
      } else if (response.statusCode == 401) {
        safePrint('⚠️ Register API returned 401.');
        setState(() {
          _isSignedIn = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
            ),
            behavior: SnackBarBehavior.floating,
          ),
        );
      } else {
        final message =
            _extractErrorMessage(response.body) ??
            'Không thể đăng ký sự kiện (mã ${response.statusCode}).';
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(message),
              backgroundColor: const Color(0xFFDC2626),
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
        return;
      }
    } catch (e) {
      safePrint('❌ Error registering for event: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Không thể đăng ký sự kiện. Vui lòng thử lại.'),
            backgroundColor: const Color(0xFFDC2626),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  String? _extractErrorMessage(String body) {
    if (body.trim().isEmpty) return null;
    try {
      final decoded = jsonDecode(body);
      if (decoded is Map<String, dynamic>) {
        for (final key in ['message', 'error', 'detail', 'reason']) {
          final value = decoded[key];
          if (value is String && value.trim().isNotEmpty) {
            return value;
          }
        }
      } else if (decoded is List) {
        final first = decoded.first;
        if (first is String) return first;
        if (first is Map<String, dynamic>) {
          for (final key in ['message', 'error', 'detail', 'reason']) {
            final value = first[key];
            if (value is String && value.trim().isNotEmpty) {
              return value;
            }
          }
        }
      } else if (decoded is String && decoded.trim().isNotEmpty) {
        return decoded;
      }
    } catch (_) {
      // ignore JSON parse errors
    }
    if (body.length <= 200) {
      return body;
    }
    return null;
  }

  Future<void> _handleRefresh() async {
    if (!_authChecked) {
      await _bootstrap();
      return;
    }

    _currentPage = 1;
    _hasMore = true;
    _error = null;
    _events = [];

    await _loadEvents(refresh: true);

    if (_isSignedIn) {
      await _loadRegisteredEvents();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sự kiện'),
        backgroundColor: const Color(0xFFFB923C),
        foregroundColor: Colors.white,
      ),
      body: RefreshIndicator(
        onRefresh: _handleRefresh,
        color: const Color(0xFFFB923C),
        child: _buildBody(),
      ),
    );
  }

  Widget _buildEventsList() {
    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.all(16),
      itemCount: _events.length + (_hasMore ? 1 : 0),
      itemBuilder: (context, index) {
        if (index == _events.length) {
          // Load more indicator
          _loadMore();
          return const Padding(
            padding: EdgeInsets.all(16),
            child: Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFFB923C)),
              ),
            ),
          );
        }

        return _buildEventCard(_events[index]);
      },
    );
  }

  Widget _buildEventCard(Event event) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 12,
            spreadRadius: -2,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _showEventDetail(event),
          borderRadius: BorderRadius.circular(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                decoration: BoxDecoration(
                  color: event.statusColor.withOpacity(0.08),
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(20),
                  ),
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 14,
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 6,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: Icon(
                        Icons.event_available_rounded,
                        color: event.statusColor,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            event.status,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: event.statusColor,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            event.formattedDate,
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF6B7280),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      event.title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF111827),
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 10),
                    if (event.description != null &&
                        event.description!.isNotEmpty) ...[
                      Text(
                        event.description!,
                        style: const TextStyle(
                          fontSize: 14,
                          color: Color(0xFF6B7280),
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 12),
                    ],
                    Row(
                      children: [
                        const Icon(
                          Icons.location_on,
                          size: 16,
                          color: Color(0xFF8B5CF6),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            event.location,
                            style: const TextStyle(
                              fontSize: 14,
                              color: Color(0xFF6B7280),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    if (event.category != null) ...[
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF3F4F6),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          event.category!,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF6B7280),
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBody() {
    if (!_authChecked) {
      return const Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFFB923C)),
        ),
      );
    }

    if (_isLoading && _events.isEmpty) {
      return const Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFFB923C)),
        ),
      );
    }

    if (_error != null && _events.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Color(0xFF6B7280)),
            const SizedBox(height: 16),
            Text(
              'Không thể tải sự kiện',
              style: const TextStyle(
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
              onPressed: () => _loadEvents(refresh: true),
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

    if (_events.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.event_busy, size: 64, color: Color(0xFF9CA3AF)),
            const SizedBox(height: 16),
            const Text(
              'Chưa có sự kiện',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF111827),
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Sự kiện sẽ xuất hiện ở đây',
              style: TextStyle(color: Color(0xFF6B7280)),
            ),
          ],
        ),
      );
    }

    return _buildEventsList();
  }

  void _showEventDetail(Event event) {
    final isRegistered = _registeredEventIds.contains(event.id);
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _EventDetailModal(
        event: event,
        isRegistered: isRegistered,
        isSignedIn: _isSignedIn,
        onRegister: () => _registerForEvent(event),
        onLoginRequested: () {
          Navigator.of(context).pop();
          Navigator.of(context).pushNamed('/login');
        },
      ),
    );
  }
}

class Event {
  final String id;
  final String title;
  final String? description;
  final String location;
  final DateTime startTime;
  final DateTime endTime;
  final String? bannerImageUrl;
  final String? category;
  final String status;

  Event({
    required this.id,
    required this.title,
    this.description,
    required this.location,
    required this.startTime,
    required this.endTime,
    this.bannerImageUrl,
    this.category,
    required this.status,
  });

  factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      id: (json['id'] ?? json['eventId']).toString(),
      title: json['title'] as String,
      description: json['description'] as String?,
      location: json['location'] as String,
      startTime: DateTime.parse(json['startTime'] as String),
      endTime: DateTime.parse(json['endTime'] as String),
      bannerImageUrl: json['bannerImageUrl'] as String?,
      category: json['category']?['name'] as String?,
      status: json['status'] as String,
    );
  }

  String get formattedDate {
    final local = startTime.toLocal();
    final month = local.month.toString().padLeft(2, '0');
    final day = local.day.toString().padLeft(2, '0');
    final hour = local.hour.toString().padLeft(2, '0');
    final minute = local.minute.toString().padLeft(2, '0');
    return '$day/$month/${local.year} $hour:$minute';
  }

  Color get statusColor {
    switch (status) {
      case 'ACTIVE':
        return const Color(0xFF10B981);
      case 'UPCOMING':
        return const Color(0xFFF59E0B);
      case 'COMPLETED':
        return const Color(0xFF6B7280);
      default:
        return const Color(0xFF6B7280);
    }
  }

  bool get hasStarted => DateTime.now().isAfter(startTime);

  bool get isUpcoming => DateTime.now().isBefore(startTime);

  bool get canRegister => status.toUpperCase() == 'ACTIVE' && isUpcoming;
}

class _EventDetailModal extends StatelessWidget {
  final Event event;
  final VoidCallback onRegister;
  final bool isRegistered;
  final bool isSignedIn;
  final VoidCallback onLoginRequested;

  const _EventDetailModal({
    required this.event,
    required this.onRegister,
    required this.isRegistered,
    required this.isSignedIn,
    required this.onLoginRequested,
  });

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.9,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      builder: (context, scrollController) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            children: [
              // Handle bar
              Container(
                margin: const EdgeInsets.only(top: 12, bottom: 8),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: const Color(0xFFE5E7EB),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              // Content
              Expanded(
                child: SingleChildScrollView(
                  controller: scrollController,
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Banner Image
                      if (event.bannerImageUrl != null)
                        ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: Image.network(
                            event.bannerImageUrl!,
                            height: 200,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                height: 200,
                                color: const Color(0xFFE5E7EB),
                                child: const Icon(
                                  Icons.event_rounded,
                                  size: 64,
                                  color: Color(0xFF9CA3AF),
                                ),
                              );
                            },
                          ),
                        ),
                      const SizedBox(height: 24),
                      // Title & Status
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Text(
                              event.title,
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF111827),
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
                              color: event.statusColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              event.status,
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: event.statusColor,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      // Category
                      if (event.category != null) ...[
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF3F4F6),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            event.category!,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF6B7280),
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                      ],
                      // Description
                      if (event.description != null &&
                          event.description!.isNotEmpty) ...[
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
                          event.description!,
                          style: const TextStyle(
                            fontSize: 14,
                            color: Color(0xFF6B7280),
                            height: 1.6,
                          ),
                        ),
                        const SizedBox(height: 24),
                      ],
                      // Date & Time
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEF3C7),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.calendar_today,
                              size: 24,
                              color: Color(0xFFF59E0B),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Ngày và giờ',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF92400E),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    event.formattedDate,
                                    style: const TextStyle(
                                      fontSize: 14,
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
                      const SizedBox(height: 16),
                      // Location
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF3F4F6),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.location_on,
                              size: 24,
                              color: Color(0xFF8B5CF6),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Địa điểm',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF6B7280),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    event.location,
                                    style: const TextStyle(
                                      fontSize: 14,
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
                      const SizedBox(height: 24),
                      // Action Buttons
                      ElevatedButton.icon(
                        onPressed:
                            _resolveButtonEnabled(
                              isRegistered: isRegistered,
                              isSignedIn: isSignedIn,
                              event: event,
                            )
                            ? () {
                                Navigator.of(context).pop();
                                if (!isSignedIn) {
                                  onLoginRequested();
                                } else {
                                  onRegister();
                                }
                              }
                            : null,
                        icon: Icon(
                          _resolveButtonIcon(
                            isRegistered: isRegistered,
                            isSignedIn: isSignedIn,
                            event: event,
                          ),
                        ),
                        label: Text(
                          _resolveButtonLabel(
                            isRegistered: isRegistered,
                            isSignedIn: isSignedIn,
                            event: event,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _resolveButtonColor(
                            isRegistered: isRegistered,
                            isSignedIn: isSignedIn,
                            event: event,
                          ),
                          foregroundColor: Colors.white,
                          disabledBackgroundColor: _resolveButtonColor(
                            isRegistered: isRegistered,
                            isSignedIn: isSignedIn,
                            event: event,
                          ),
                          minimumSize: const Size(double.infinity, 56),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

bool _resolveButtonEnabled({
  required bool isRegistered,
  required bool isSignedIn,
  required Event event,
}) {
  if (isRegistered) return false;
  if (event.hasStarted) return false;
  if (!isSignedIn) return true;
  return event.canRegister;
}

IconData _resolveButtonIcon({
  required bool isRegistered,
  required bool isSignedIn,
  required Event event,
}) {
  if (isRegistered) return Icons.check_circle;
  if (event.hasStarted) return Icons.schedule;
  if (!isSignedIn) return Icons.lock_open;
  return Icons.event_available;
}

String _resolveButtonLabel({
  required bool isRegistered,
  required bool isSignedIn,
  required Event event,
}) {
  if (isRegistered) return 'Đã đăng ký';
  if (event.hasStarted) return 'Đã bắt đầu';
  if (!isSignedIn) return 'Đăng nhập để đăng ký';
  return 'Đăng ký tham gia';
}

Color _resolveButtonColor({
  required bool isRegistered,
  required bool isSignedIn,
  required Event event,
}) {
  if (isRegistered) return const Color(0xFF10B981);
  if (event.hasStarted) return const Color(0xFFD1D5DB);
  if (!isSignedIn) return const Color(0xFFFB923C);
  return const Color(0xFFFB923C);
}
