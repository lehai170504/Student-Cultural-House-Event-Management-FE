import 'package:flutter/material.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'dart:convert';
import '../../services/api_client.dart';
import '../../config/api_config.dart' as app_config;
import 'notification_models.dart';

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  final ApiClient _apiClient = ApiClient();
  List<NotificationMessage> _notifications = [];
  bool _isLoading = true;
  String? _error;
  int _unreadCount = 0;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
    _loadUnreadCount();
  }

  Future<void> _loadNotifications() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final response = await _apiClient.get(app_config.ApiConfig.notifications);
      safePrint('📬 Notifications response: ${response.statusCode}');

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        final data = body is Map<String, dynamic>
            ? (body['data'] ?? body)
            : body;

        List<NotificationMessage> notifications = [];
        if (data is List) {
          notifications = data
              .map((item) => NotificationMessage.fromJson(
                  item as Map<String, dynamic>))
              .toList();
        }

        setState(() {
          _notifications = notifications;
          _isLoading = false;
        });
      } else {
        setState(() {
          _error = 'Không thể tải danh sách thông báo';
          _isLoading = false;
        });
      }
    } catch (e) {
      safePrint('❌ Error loading notifications: $e');
      setState(() {
        _error = 'Đã xảy ra lỗi khi tải thông báo';
        _isLoading = false;
      });
    }
  }

  Future<void> _loadUnreadCount() async {
    try {
      final response =
          await _apiClient.get(app_config.ApiConfig.unreadCount);
      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        final count = body is Map<String, dynamic>
            ? (body['count'] ?? 0)
            : (body ?? 0);
        setState(() {
          _unreadCount = count is int ? count : 0;
        });
      }
    } catch (e) {
      safePrint('❌ Error loading unread count: $e');
    }
  }

  Future<void> _markAsRead(String deliveryId) async {
    try {
      final response = await _apiClient.patch(
        app_config.ApiConfig.markAsRead(deliveryId),
      );

      if (response.statusCode == 200 || response.statusCode == 204) {
        // Update local state
        setState(() {
          final index = _notifications.indexWhere(
            (n) => n.deliveryId == deliveryId,
          );
          if (index != -1) {
            _notifications[index] = NotificationMessage(
              deliveryId: _notifications[index].deliveryId,
              messageContent: _notifications[index].messageContent,
              sentAt: _notifications[index].sentAt,
              status: 'READ',
              eventId: _notifications[index].eventId,
              eventTitle: _notifications[index].eventTitle,
            );
          }
          if (_unreadCount > 0) {
            _unreadCount--;
          }
        });
      }
    } catch (e) {
      safePrint('❌ Error marking as read: $e');
    }
  }

  String _formatNotificationTime(String value) {
    try {
      final date = DateTime.parse(value).toLocal();
      final now = DateTime.now().toLocal();
      final difference = now.difference(date);

      if (difference.inDays == 0) {
        if (difference.inHours == 0) {
          if (difference.inMinutes == 0) {
            return 'Vừa xong';
          }
          return '${difference.inMinutes} phút trước';
        }
        return '${difference.inHours} giờ trước';
      } else if (difference.inDays == 1) {
        return 'Hôm qua';
      } else if (difference.inDays < 7) {
        return '${difference.inDays} ngày trước';
      } else {
        return '${date.day}/${date.month}/${date.year}';
      }
    } catch (e) {
      return value;
    }
  }

  Future<void> _refresh() async {
    await Future.wait([_loadNotifications(), _loadUnreadCount()]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Thông báo',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        backgroundColor: const Color(0xFFFB923C),
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          if (_unreadCount > 0)
            Padding(
              padding: const EdgeInsets.only(right: 16),
              child: Center(
                child: Text(
                  '$_unreadCount chưa đọc',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _refresh,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.error_outline,
                          size: 64,
                          color: Color(0xFF9CA3AF),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          _error!,
                          style: const TextStyle(
                            color: Color(0xFF6B7280),
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadNotifications,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFFB923C),
                            foregroundColor: Colors.white,
                          ),
                          child: const Text('Thử lại'),
                        ),
                      ],
                    ),
                  )
                : _notifications.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.notifications_none,
                              size: 64,
                              color: Color(0xFF9CA3AF),
                            ),
                            const SizedBox(height: 16),
                            const Text(
                              'Hiện chưa có thông báo nào',
                              style: TextStyle(
                                color: Color(0xFF6B7280),
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        itemCount: _notifications.length,
                        itemBuilder: (context, index) {
                          final notification = _notifications[index];
                          return _NotificationItem(
                            notification: notification,
                            onMarkAsRead: () =>
                                _markAsRead(notification.deliveryId),
                            formatTime: _formatNotificationTime,
                          );
                        },
                      ),
      ),
    );
  }
}

class _NotificationItem extends StatelessWidget {
  final NotificationMessage notification;
  final VoidCallback onMarkAsRead;
  final String Function(String) formatTime;

  const _NotificationItem({
    required this.notification,
    required this.onMarkAsRead,
    required this.formatTime,
  });

  @override
  Widget build(BuildContext context) {
    final isUnread = notification.isUnread;

    return Container(
      decoration: BoxDecoration(
        color: isUnread
            ? const Color(0xFFFFF7ED)
            : Colors.white,
        border: Border(
          bottom: BorderSide(
            color: Colors.grey.shade200,
            width: 1,
          ),
        ),
      ),
      child: InkWell(
        onTap: isUnread ? onMarkAsRead : null,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          notification.eventTitle ?? 'Thông báo',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: isUnread
                                ? const Color(0xFFFB923C)
                                : const Color(0xFF1F2937),
                          ),
                        ),
                        if (notification.messageContent.isNotEmpty) ...[
                          const SizedBox(height: 8),
                          Text(
                            notification.messageContent,
                            style: const TextStyle(
                              fontSize: 14,
                              color: Color(0xFF4B5563),
                              height: 1.5,
                            ),
                          ),
                        ],
                        const SizedBox(height: 8),
                        Text(
                          formatTime(notification.sentAt),
                          style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xFF9CA3AF),
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (isUnread)
                    Container(
                      width: 12,
                      height: 12,
                      decoration: const BoxDecoration(
                        color: Color(0xFFFB923C),
                        shape: BoxShape.circle,
                      ),
                    ),
                ],
              ),
              if (isUnread) ...[
                const SizedBox(height: 12),
                TextButton(
                  onPressed: onMarkAsRead,
                  style: TextButton.styleFrom(
                    padding: EdgeInsets.zero,
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  child: const Text(
                    'Đánh dấu đã đọc',
                    style: TextStyle(
                      fontSize: 12,
                      color: Color(0xFFFB923C),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

