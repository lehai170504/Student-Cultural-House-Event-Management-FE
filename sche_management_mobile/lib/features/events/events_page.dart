import 'package:flutter/material.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'dart:convert';
import '../../services/api_client.dart';
import '../../services/auth_service.dart';
import '../../config/api_config.dart' as app_config;
import '../feedback/feedback_service.dart';
import '../feedback/feedback_models.dart' as feedback_models;

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

class _EventDetailModal extends StatefulWidget {
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
  State<_EventDetailModal> createState() => _EventDetailModalState();
}

class _EventDetailModalState extends State<_EventDetailModal> {
  final FeedbackService _feedbackService = FeedbackService();
  final AuthService _authService = AuthService();
  List<feedback_models.Feedback> _feedbacks = [];
  bool _loadingFeedbacks = false;
  String? _currentStudentId;

  @override
  void initState() {
    super.initState();
    _loadFeedbacks();
    _loadCurrentStudent();
  }

  Future<void> _loadCurrentStudent() async {
    try {
      final signedIn = await _authService.isSignedIn();
      if (!signedIn || !mounted) return;

      final response = await ApiClient().get(app_config.ApiConfig.profile);
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        final data = json['data'] ?? json;
        if (mounted) {
          setState(() {
            _currentStudentId = data['id']?.toString();
          });
        }
      }
    } catch (e) {
      safePrint('⚠️ Could not get student ID: $e');
    }
  }

  Future<void> _loadFeedbacks() async {
    if (mounted) {
      setState(() {
        _loadingFeedbacks = true;
      });
    }

    try {
      final feedbacks = await _feedbackService.getEventFeedbacks(
        widget.event.id,
      );
      if (mounted) {
        setState(() {
          _feedbacks = feedbacks;
          _loadingFeedbacks = false;
        });
      }
    } catch (e) {
      safePrint('❌ Error loading feedbacks: $e');
      if (mounted) {
        setState(() {
          _loadingFeedbacks = false;
        });
      }
    }
  }

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
                      if (widget.event.bannerImageUrl != null)
                        ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: Image.network(
                            widget.event.bannerImageUrl!,
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
                              widget.event.title,
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
                              color: widget.event.statusColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              widget.event.status,
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: widget.event.statusColor,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      // Category
                      if (widget.event.category != null) ...[
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
                            widget.event.category!,
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
                      if (widget.event.description != null &&
                          widget.event.description!.isNotEmpty) ...[
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
                          widget.event.description!,
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
                                    widget.event.formattedDate,
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
                                    widget.event.location,
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
                              isRegistered: widget.isRegistered,
                              isSignedIn: widget.isSignedIn,
                              event: widget.event,
                            )
                            ? () {
                                Navigator.of(context).pop();
                                if (!widget.isSignedIn) {
                                  widget.onLoginRequested();
                                } else {
                                  widget.onRegister();
                                }
                              }
                            : null,
                        icon: Icon(
                          _resolveButtonIcon(
                            isRegistered: widget.isRegistered,
                            isSignedIn: widget.isSignedIn,
                            event: widget.event,
                          ),
                        ),
                        label: Text(
                          _resolveButtonLabel(
                            isRegistered: widget.isRegistered,
                            isSignedIn: widget.isSignedIn,
                            event: widget.event,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _resolveButtonColor(
                            isRegistered: widget.isRegistered,
                            isSignedIn: widget.isSignedIn,
                            event: widget.event,
                          ),
                          foregroundColor: Colors.white,
                          disabledBackgroundColor: _resolveButtonColor(
                            isRegistered: widget.isRegistered,
                            isSignedIn: widget.isSignedIn,
                            event: widget.event,
                          ),
                          minimumSize: const Size(double.infinity, 56),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),
                      // Feedback Section
                      _buildFeedbackSection(),
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

  Widget _buildFeedbackSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Divider(),
        const SizedBox(height: 16),
        Row(
          children: [
            const Icon(
              Icons.feedback_outlined,
              color: Color(0xFF111827),
              size: 24,
            ),
            const SizedBox(width: 8),
            const Text(
              'Phản hồi từ người tham gia',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF111827),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          _loadingFeedbacks
              ? 'Đang tải phản hồi...'
              : 'Có ${_feedbacks.length} phản hồi',
          style: const TextStyle(fontSize: 14, color: Color(0xFF6B7280)),
        ),
        const SizedBox(height: 16),
        if (_loadingFeedbacks)
          const Center(
            child: Padding(
              padding: EdgeInsets.all(24),
              child: CircularProgressIndicator(color: Color(0xFFFB923C)),
            ),
          )
        else if (_feedbacks.isEmpty)
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFFF3F4F6),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Center(
              child: Text(
                'Chưa có phản hồi nào.',
                style: TextStyle(fontSize: 14, color: Color(0xFF6B7280)),
              ),
            ),
          )
        else
          ..._feedbacks.map((feedback) => _buildFeedbackCard(feedback)),
      ],
    );
  }

  Widget _buildFeedbackCard(feedback_models.Feedback feedback) {
    final isMyFeedback =
        _currentStudentId != null && feedback.studentId == _currentStudentId;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isMyFeedback ? const Color(0xFFEFF6FF) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: isMyFeedback
            ? Border.all(color: const Color(0xFF3B82F6), width: 2)
            : Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header: Student name and sentiment
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Text(
                    feedback.studentName,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: isMyFeedback
                          ? const Color(0xFF1E40AF)
                          : const Color(0xFF111827),
                    ),
                  ),
                  if (isMyFeedback) ...[
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFF3B82F6),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        'Bạn',
                        style: TextStyle(
                          fontSize: 10,
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: feedback.sentimentColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  feedback.sentimentLabel.toUpperCase(),
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: feedback.sentimentColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          // Rating stars
          Row(
            children: List.generate(5, (index) {
              return Icon(
                index < feedback.rating ? Icons.star : Icons.star_border,
                color: const Color(0xFFF59E0B),
                size: 16,
              );
            }),
          ),
          const SizedBox(height: 8),
          // Comments
          if (feedback.comments.isNotEmpty) ...[
            Text(
              feedback.comments,
              style: TextStyle(
                fontSize: 13,
                color: isMyFeedback
                    ? const Color(0xFF1E3A8A)
                    : const Color(0xFF374151),
                height: 1.4,
              ),
            ),
            const SizedBox(height: 8),
          ],
          // Created date
          Text(
            feedback.formattedDate,
            style: TextStyle(
              fontSize: 11,
              color: isMyFeedback
                  ? const Color(0xFF3B82F6)
                  : const Color(0xFF9CA3AF),
            ),
          ),
          // Edit and Delete buttons (only for my feedback)
          if (isMyFeedback) ...[
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton.icon(
                  onPressed: () => _showEditFeedbackDialog(feedback),
                  icon: const Icon(Icons.edit_outlined, size: 14),
                  label: const Text('Sửa', style: TextStyle(fontSize: 12)),
                  style: TextButton.styleFrom(
                    foregroundColor: const Color(0xFF3B82F6),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                  ),
                ),
                const SizedBox(width: 4),
                TextButton.icon(
                  onPressed: () => _showDeleteFeedbackDialog(feedback),
                  icon: const Icon(Icons.delete_outline, size: 14),
                  label: const Text('Xóa', style: TextStyle(fontSize: 12)),
                  style: TextButton.styleFrom(
                    foregroundColor: const Color(0xFFDC2626),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  void _showEditFeedbackDialog(feedback_models.Feedback feedback) {
    final commentsController = TextEditingController(text: feedback.comments);
    int tempRating = feedback.rating;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Sửa feedback'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'Đánh giá (1-5 sao)',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(5, (index) {
                    final rating = index + 1;
                    return IconButton(
                      icon: Icon(
                        rating <= tempRating ? Icons.star : Icons.star_border,
                        color: const Color(0xFFF59E0B),
                        size: 40,
                      ),
                      onPressed: () {
                        setDialogState(() {
                          tempRating = rating;
                        });
                      },
                    );
                  }),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: commentsController,
                  decoration: const InputDecoration(
                    labelText: 'Nhận xét của bạn *',
                    border: OutlineInputBorder(),
                    hintText: 'Nhập đánh giá về sự kiện...',
                  ),
                  maxLines: 5,
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Hủy'),
            ),
            ElevatedButton(
              onPressed: () async {
                if (tempRating == 0) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Vui lòng chọn số sao đánh giá'),
                      backgroundColor: Color(0xFFDC2626),
                    ),
                  );
                  return;
                }
                if (commentsController.text.trim().isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Vui lòng nhập đánh giá'),
                      backgroundColor: Color(0xFFDC2626),
                    ),
                  );
                  return;
                }

                Navigator.of(context).pop();
                await _updateFeedback(
                  feedback.id,
                  tempRating,
                  commentsController.text.trim(),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFB923C),
                foregroundColor: Colors.white,
              ),
              child: const Text('Lưu'),
            ),
          ],
        ),
      ),
    );
  }

  void _showDeleteFeedbackDialog(feedback_models.Feedback feedback) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Xóa feedback'),
        content: const Text('Bạn có chắc chắn muốn xóa feedback này không?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Hủy'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.of(context).pop();
              await _deleteFeedback(feedback.id);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
            ),
            child: const Text('Xóa'),
          ),
        ],
      ),
    );
  }

  Future<void> _updateFeedback(
    String feedbackId,
    int rating,
    String comments,
  ) async {
    try {
      safePrint('🔍 Updating feedback $feedbackId...');
      await _feedbackService.updateFeedback(
        feedbackId: feedbackId,
        rating: rating,
        comments: comments,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Cập nhật feedback thành công!'),
            backgroundColor: Color(0xFF10B981),
          ),
        );
        // Reload feedbacks
        await _loadFeedbacks();
      }
    } catch (e) {
      safePrint('❌ Error updating feedback: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Lỗi: ${e.toString()}'),
            backgroundColor: const Color(0xFFDC2626),
          ),
        );
      }
    }
  }

  Future<void> _deleteFeedback(String feedbackId) async {
    try {
      safePrint('🔍 Deleting feedback $feedbackId...');
      await _feedbackService.deleteFeedback(feedbackId);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Xóa feedback thành công!'),
            backgroundColor: Color(0xFF10B981),
          ),
        );
        // Reload feedbacks
        await _loadFeedbacks();
      }
    } catch (e) {
      safePrint('❌ Error deleting feedback: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Lỗi: ${e.toString()}'),
            backgroundColor: const Color(0xFFDC2626),
          ),
        );
      }
    }
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
