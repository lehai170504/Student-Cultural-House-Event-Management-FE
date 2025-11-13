import 'dart:async';
import 'package:amplify_flutter/amplify_flutter.dart';
import '../services/api_client.dart';
import '../config/api_config.dart' as app_config;
import '../features/notifications/notification_models.dart';
import 'dart:convert';

class NotificationService {
  static final NotificationService instance = NotificationService._internal();
  factory NotificationService() => instance;
  NotificationService._internal();

  final ApiClient _apiClient = ApiClient();
  Timer? _pollingTimer;
  int _lastUnreadCount = 0;
  List<NotificationMessage> _lastNotifications = [];
  
  // Callbacks
  Function(int unreadCount)? onUnreadCountChanged;
  Function(NotificationMessage notification)? onNewNotification;

  /// Bắt đầu polling để kiểm tra thông báo mới
  void startPolling({Duration interval = const Duration(seconds: 15)}) {
    stopPolling(); // Dừng timer cũ nếu có
    
    safePrint('🚀 Starting notification polling (interval: ${interval.inSeconds}s)');
    
    // Kiểm tra ngay lập tức
    _checkForNewNotifications();
    
    // Sau đó kiểm tra định kỳ
    _pollingTimer = Timer.periodic(interval, (_) {
      _checkForNewNotifications();
    });
  }

  /// Dừng polling
  void stopPolling() {
    _pollingTimer?.cancel();
    _pollingTimer = null;
  }

  /// Kiểm tra thông báo mới
  Future<void> _checkForNewNotifications() async {
    try {
      safePrint('🔔 Checking for new notifications...');
      
      // Lấy unread count
      final countResponse = await _apiClient.get(app_config.ApiConfig.unreadCount);
      if (countResponse.statusCode == 200) {
        final body = jsonDecode(countResponse.body);
        final count = body is Map<String, dynamic>
            ? (body['count'] ?? 0)
            : (body ?? 0);
        final unreadCount = count is int ? count : 0;
        
        safePrint('📊 Unread count: $unreadCount (last: $_lastUnreadCount)');

        // Lấy danh sách thông báo
        final notificationsResponse = await _apiClient.get(
          app_config.ApiConfig.notifications,
        );
        
        if (notificationsResponse.statusCode == 200) {
          final body = jsonDecode(notificationsResponse.body);
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
          
          safePrint('📬 Total notifications: ${notifications.length}');

          // Tìm thông báo mới (chưa có trong danh sách cũ hoặc có thời gian mới hơn)
          if (_lastNotifications.isNotEmpty) {
            final lastIds = _lastNotifications.map((n) => n.deliveryId).toSet();
            final lastSentAtMap = <String, DateTime>{};
            
            for (final notif in _lastNotifications) {
              try {
                lastSentAtMap[notif.deliveryId] = DateTime.parse(notif.sentAt).toLocal();
              } catch (e) {
                safePrint('⚠️ Error parsing sentAt: $e');
              }
            }
            
            final newNotifications = <NotificationMessage>[];
            
            for (final notification in notifications) {
              // Nếu là thông báo mới (chưa có ID) hoặc có thời gian mới hơn
              if (!lastIds.contains(notification.deliveryId)) {
                newNotifications.add(notification);
                safePrint('🆕 New notification found: ${notification.deliveryId} - ${notification.eventTitle}');
              } else {
                // Kiểm tra xem có cập nhật thời gian không (thông báo mới hơn)
                try {
                  final currentSentAt = DateTime.parse(notification.sentAt).toLocal();
                  final lastSentAt = lastSentAtMap[notification.deliveryId];
                  if (lastSentAt != null && currentSentAt.isAfter(lastSentAt)) {
                    newNotifications.add(notification);
                    safePrint('🔄 Updated notification: ${notification.deliveryId}');
                  }
                } catch (e) {
                  // Ignore parsing errors
                }
              }
            }

            // Thông báo cho listener về thông báo mới (chỉ thông báo chưa đọc)
            for (final notification in newNotifications) {
              if (notification.isUnread) {
                safePrint('📢 Calling onNewNotification for: ${notification.deliveryId}');
                onNewNotification?.call(notification);
              }
            }
          } else {
            // Lần đầu tiên, lấy tất cả thông báo chưa đọc và hiển thị thông báo mới nhất
            final unreadNotifications = notifications
                .where((n) => n.isUnread)
                .toList();
            
            if (unreadNotifications.isNotEmpty) {
              // Sắp xếp theo thời gian, mới nhất trước
              unreadNotifications.sort((a, b) {
                try {
                  final aTime = DateTime.parse(a.sentAt);
                  final bTime = DateTime.parse(b.sentAt);
                  return bTime.compareTo(aTime);
                } catch (e) {
                  return 0;
                }
              });
              
              safePrint('📢 First time: showing latest unread: ${unreadNotifications.first.deliveryId}');
              onNewNotification?.call(unreadNotifications.first);
            }
          }

          _lastNotifications = notifications;
        }
        
        // Cập nhật unread count
        if (unreadCount != _lastUnreadCount) {
          _lastUnreadCount = unreadCount;
          onUnreadCountChanged?.call(unreadCount);
        }
      }
    } catch (e) {
      safePrint('❌ Error checking for new notifications: $e');
    }
  }

  /// Lấy unread count hiện tại
  Future<int> getUnreadCount() async {
    try {
      final response = await _apiClient.get(app_config.ApiConfig.unreadCount);
      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        final count = body is Map<String, dynamic>
            ? (body['count'] ?? 0)
            : (body ?? 0);
        final unreadCount = count is int ? count : 0;
        _lastUnreadCount = unreadCount;
        return unreadCount;
      }
    } catch (e) {
      safePrint('❌ Error getting unread count: $e');
    }
    return 0;
  }

  /// Reset state (khi logout)
  void reset() {
    _lastUnreadCount = 0;
    _lastNotifications = [];
    stopPolling();
  }
}

