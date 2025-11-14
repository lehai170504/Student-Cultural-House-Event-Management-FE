import 'package:flutter/material.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'dart:convert';
import 'feedback_service.dart';
import 'feedback_models.dart' as feedback_models;
import '../../services/auth_service.dart';
import '../../services/api_client.dart';
import '../../config/api_config.dart' as app_config;
import '../events/events_page.dart';

class FeedbacksPage extends StatefulWidget {
  final String? eventId; // Optional: filter by eventId

  const FeedbacksPage({super.key, this.eventId});

  @override
  State<FeedbacksPage> createState() => _FeedbacksPageState();
}

class _FeedbacksPageState extends State<FeedbacksPage> {
  final FeedbackService _feedbackService = FeedbackService();
  final AuthService _authService = AuthService();
  final ScrollController _scrollController = ScrollController();

  bool _isLoading = true;
  List<feedback_models.Feedback> _feedbacks = [];
  String? _error;
  int _currentPage = 1;
  final int _pageSize = 10;
  bool _hasMore = true;
  String? _currentStudentId;

  // Filter by event
  String? _selectedEventId;
  List<Event> _events = [];
  bool _loadingEvents = false;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    _selectedEventId = widget.eventId;
    _bootstrap();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _bootstrap() async {
    final signedIn = await _authService.isSignedIn();
    if (!mounted) return;

    setState(() {
      _isLoading = true;
      _error = null;
      _currentPage = 1;
      _feedbacks = [];
      _hasMore = true;
    });

    if (signedIn) {
      // Get current student ID from profile
      try {
        final apiClient = ApiClient();
        final response = await apiClient.get(app_config.ApiConfig.profile);
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
    } else {
      // Not signed in, show error
      if (mounted) {
        setState(() {
          _isLoading = false;
          _error = 'Vui lòng đăng nhập để xem feedback của bạn';
        });
      }
      return;
    }

    // Load events for filter (only events that student has feedback for)
    await _loadEvents();

    // Load feedbacks (only feedbacks of current student)
    await _loadFeedbacks(refresh: true);
  }

  Future<void> _loadEvents() async {
    if (_loadingEvents) return;
    setState(() => _loadingEvents = true);

    try {
      final apiClient = ApiClient();
      final response = await apiClient.get(
        '${app_config.ApiConfig.events}?page=1&size=100',
      );

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        final data = json['data'] ?? json['content'] ?? [];
        final events = (data as List)
            .map((e) => Event.fromJson(e as Map<String, dynamic>))
            .toList();

        if (mounted) {
          setState(() {
            _events = events;
            _loadingEvents = false;
          });
        }
      }
    } catch (e) {
      safePrint('❌ Error loading events: $e');
      if (mounted) {
        setState(() => _loadingEvents = false);
      }
    }
  }

  Future<void> _loadFeedbacks({bool refresh = false}) async {
    if (refresh) {
      setState(() {
        _isLoading = true;
        _error = null;
        _currentPage = 1;
        _feedbacks = [];
        _hasMore = true;
      });
    } else {
      if (!_hasMore || _isLoading) return;
      setState(() => _isLoading = true);
    }

    try {
      safePrint('🔍 Loading feedbacks page $_currentPage...');

      final response = await _feedbackService.getMyFeedbacks(
        page: _currentPage,
        size: _pageSize,
        eventId: _selectedEventId,
      );

      // Filter to only show feedbacks of current student (endpoint should already do this, but double-check)
      List<feedback_models.Feedback> filteredFeedbacks = response.data;
      if (_currentStudentId != null) {
        filteredFeedbacks = response.data
            .where((fb) => fb.studentId == _currentStudentId)
            .toList();
      }

      if (mounted) {
        setState(() {
          if (refresh) {
            _feedbacks = filteredFeedbacks;
          } else {
            _feedbacks.addAll(filteredFeedbacks);
          }
          _hasMore = response.meta.currentPage < response.meta.totalPages;
          _isLoading = false;
        });
      }

      safePrint(
        '✅ Loaded ${filteredFeedbacks.length} feedbacks (filtered). Total: ${_feedbacks.length}',
      );
    } catch (e) {
      safePrint('❌ Error loading feedbacks: $e');
      if (mounted) {
        setState(() {
          _error = e.toString();
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _loadMore() async {
    if (!_isLoading && _hasMore) {
      _currentPage++;
      await _loadFeedbacks();
    }
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent * 0.8) {
      _loadMore();
    }
  }

  void _onEventFilterChanged(String? eventId) {
    setState(() {
      _selectedEventId = eventId;
    });
    _loadFeedbacks(refresh: true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Feedback của tôi',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Color(0xFF111827),
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF111827)),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Xem các đánh giá và bình luận mà bạn đã gửi',
                  style: TextStyle(fontSize: 12, color: Color(0xFF6B7280)),
                ),
                const SizedBox(height: 8),
                // Event filter dropdown
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF3F4F6),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: const Color(0xFFE5E7EB)),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _selectedEventId,
                      isExpanded: true,
                      hint: const Text(
                        'Lọc theo sự kiện...',
                        style: TextStyle(color: Color(0xFF6B7280)),
                      ),
                      items: [
                        const DropdownMenuItem<String>(
                          value: null,
                          child: Text('Tất cả sự kiện'),
                        ),
                        ..._events.map(
                          (event) => DropdownMenuItem<String>(
                            value: event.id,
                            child: Text(
                              event.title,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ),
                      ],
                      onChanged: _onEventFilterChanged,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      backgroundColor: const Color(0xFFF9FAFB),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading && _feedbacks.isEmpty) {
      return const Center(
        child: CircularProgressIndicator(color: Color(0xFFFB923C)),
      );
    }

    if (_error != null && _feedbacks.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Color(0xFFDC2626)),
            const SizedBox(height: 16),
            const Text(
              'Không thể tải feedback',
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
              onPressed: () => _loadFeedbacks(refresh: true),
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

    if (_feedbacks.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.feedback_outlined,
              size: 64,
              color: Color(0xFF9CA3AF),
            ),
            const SizedBox(height: 16),
            const Text(
              'Chưa có feedback',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF111827),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _selectedEventId != null
                  ? 'Bạn chưa gửi feedback cho sự kiện này'
                  : 'Bạn chưa gửi feedback nào',
              style: const TextStyle(color: Color(0xFF6B7280)),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => _loadFeedbacks(refresh: true),
      color: const Color(0xFFFB923C),
      child: ListView.builder(
        controller: _scrollController,
        padding: const EdgeInsets.all(16),
        itemCount: _feedbacks.length + (_hasMore ? 1 : 0),
        itemBuilder: (context, index) {
          if (index == _feedbacks.length) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: CircularProgressIndicator(color: Color(0xFFFB923C)),
              ),
            );
          }
          return _buildFeedbackCard(_feedbacks[index]);
        },
      ),
    );
  }

  Widget _buildFeedbackCard(feedback_models.Feedback feedback) {
    // All feedbacks in this page are from current student, so always highlight
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: const Color(0xFFEFF6FF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF3B82F6), width: 2),
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
            // Header: Student name and sentiment
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Text(
                      feedback.studentName,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1E40AF),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFF3B82F6),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'Phản hồi của bạn',
                        style: TextStyle(
                          fontSize: 10,
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
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
            // Event title
            Text(
              feedback.eventTitle,
              style: const TextStyle(
                fontSize: 12,
                color: Color(0xFF6B7280),
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 12),
            // Rating stars
            Row(
              children: List.generate(5, (index) {
                return Icon(
                  index < feedback.rating ? Icons.star : Icons.star_border,
                  color: const Color(0xFFF59E0B),
                  size: 20,
                );
              }),
            ),
            const SizedBox(height: 12),
            // Comments
            if (feedback.comments.isNotEmpty) ...[
              Text(
                feedback.comments,
                style: const TextStyle(fontSize: 14, color: Color(0xFF1E3A8A)),
              ),
              const SizedBox(height: 12),
            ],
            // Created date
            Text(
              feedback.formattedDate,
              style: const TextStyle(fontSize: 12, color: Color(0xFF3B82F6)),
            ),
            const SizedBox(height: 12),
            // Edit and Delete buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton.icon(
                  onPressed: () => _showEditFeedbackDialog(feedback),
                  icon: const Icon(Icons.edit_outlined, size: 16),
                  label: const Text('Sửa'),
                  style: TextButton.styleFrom(
                    foregroundColor: const Color(0xFF3B82F6),
                  ),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () => _showDeleteFeedbackDialog(feedback),
                  icon: const Icon(Icons.delete_outline, size: 16),
                  label: const Text('Xóa'),
                  style: TextButton.styleFrom(
                    foregroundColor: const Color(0xFFDC2626),
                  ),
                ),
              ],
            ),
          ],
        ),
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
        await _loadFeedbacks(refresh: true);
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
        await _loadFeedbacks(refresh: true);
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
