import 'package:flutter/material.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'dart:convert';
import '../../services/api_client.dart';
import '../../config/api_config.dart' as app_config;
import '../events/events_page.dart'; // Import Event class

class EventHistoryPage extends StatefulWidget {
  const EventHistoryPage({super.key});

  @override
  State<EventHistoryPage> createState() => _EventHistoryPageState();

  // Static reference to current instance
  static _EventHistoryPageState? _currentInstance;

  // Method to reload from outside
  static void reload() {
    _currentInstance?._loadRegisteredEvents(refresh: true);
  }
}

class _EventHistoryPageState extends State<EventHistoryPage> {
  final ApiClient _apiClient = ApiClient();
  bool _isLoading = true;
  List<Event> _registeredEvents = [];
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadRegisteredEvents();

    // Register this instance to the static reload method
    EventHistoryPage._currentInstance = this;
  }

  @override
  void dispose() {
    EventHistoryPage._currentInstance = null;
    super.dispose();
  }

  Future<void> _loadRegisteredEvents({bool refresh = false}) async {
    if (refresh) {
      setState(() {
        _isLoading = true;
        _error = null;
        _registeredEvents = [];
      });
    }

    try {
      safePrint('🔍 Loading registered events...');
      final response = await _apiClient.get(app_config.ApiConfig.studentEvents);

      safePrint('📥 Registered events response: ${response.statusCode}');
      safePrint('📥 Response body: ${response.body}');

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        // Handle different response formats
        final rawData = json['data'] ?? json;
        final Map<String, dynamic> dataMap;
        if (rawData is List) {
          dataMap = {'content': rawData};
        } else {
          dataMap = rawData as Map<String, dynamic>;
        }
        final eventsData = dataMap['content'] ?? dataMap['events'] ?? [];

        final events = (eventsData as List)
            .map((e) => Event.fromJson(e))
            .toList();

        setState(() {
          _registeredEvents = events;
          _isLoading = false;
        });

        safePrint('✅ Loaded ${events.length} registered events');
      } else if (response.statusCode == 404) {
        // API endpoint doesn't exist yet, show empty list
        safePrint('⚠️ API endpoint not found (404), showing empty list');
        setState(() {
          _registeredEvents = [];
          _isLoading = false;
          _error = null;
        });
      } else {
        throw Exception('Failed to load events: ${response.statusCode}');
      }
    } catch (e) {
      safePrint('❌ Error loading registered events: $e');
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lịch sử đăng ký'),
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

    if (_error != null && _registeredEvents.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Color(0xFF6B7280)),
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
              onPressed: () => _loadRegisteredEvents(refresh: true),
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

    if (_registeredEvents.isEmpty) {
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
              'Bạn chưa đăng ký sự kiện nào',
              style: TextStyle(color: Color(0xFF6B7280)),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => _loadRegisteredEvents(refresh: true),
      color: const Color(0xFFFB923C),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _registeredEvents.length,
        itemBuilder: (context, index) {
          return _buildEventCard(_registeredEvents[index]);
        },
      ),
    );
  }

  Widget _buildEventCard(Event event) {
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
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _showEventDetail(event),
          borderRadius: BorderRadius.circular(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Banner Image
              if (event.bannerImageUrl != null)
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(16),
                  ),
                  child: Image.network(
                    event.bannerImageUrl!,
                    height: 180,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        height: 180,
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
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            event.title,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF111827),
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
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
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: event.statusColor,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
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
                          Icons.calendar_today,
                          size: 16,
                          color: Color(0xFFFB923C),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          event.formattedDate,
                          style: const TextStyle(
                            fontSize: 14,
                            color: Color(0xFF6B7280),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
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
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
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

  void _showEventDetail(Event event) {
    // TODO: Implement detailed view or feedback submission
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(event.title),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Địa điểm: ${event.location}'),
            const SizedBox(height: 8),
            Text('Thời gian: ${event.formattedDate}'),
            const SizedBox(height: 16),
            const Text('Bạn có muốn đánh giá sự kiện này không?'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Đóng'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              _showFeedbackDialog(event);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFFB923C),
              foregroundColor: Colors.white,
            ),
            child: const Text('Đánh giá'),
          ),
        ],
      ),
    );
  }

  void _showFeedbackDialog(Event event) {
    final feedbackController = TextEditingController();
    int tempRating = 0;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Đánh giá sự kiện'),
          content: Column(
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
                controller: feedbackController,
                decoration: const InputDecoration(
                  labelText: 'Nhận xét của bạn *',
                  border: OutlineInputBorder(),
                  hintText: 'Nhập đánh giá về sự kiện...',
                ),
                maxLines: 5,
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                tempRating = 0;
                Navigator.of(context).pop();
              },
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
                if (feedbackController.text.trim().isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Vui lòng nhập đánh giá'),
                      backgroundColor: Color(0xFFDC2626),
                    ),
                  );
                  return;
                }

                Navigator.of(context).pop();
                await _submitFeedback(
                  event.id,
                  tempRating,
                  feedbackController.text.trim(),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFB923C),
                foregroundColor: Colors.white,
              ),
              child: const Text('Gửi'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _submitFeedback(int eventId, int rating, String comments) async {
    try {
      safePrint('🔍 Submitting feedback for event $eventId...');
      safePrint('🔍 Rating: $rating, Comments: $comments');
      final response = await _apiClient.post(
        app_config.ApiConfig.submitFeedback(eventId),
        body: {'rating': rating, 'comments': comments},
      );

      safePrint('✅ Feedback response: ${response.statusCode}');
      safePrint('✅ Response body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Cảm ơn bạn đã đánh giá!'),
              backgroundColor: Color(0xFF10B981),
            ),
          );
        }
      } else {
        throw Exception('Failed to submit feedback: ${response.statusCode}');
      }
    } catch (e) {
      safePrint('❌ Error submitting feedback: $e');
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
