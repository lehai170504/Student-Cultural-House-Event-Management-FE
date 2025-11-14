import 'package:flutter/material.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import '../../services/auth_service.dart';
import '../../services/notification_service.dart';
import '../notifications/notification_banner.dart';
import '../notifications/notifications_page.dart';
import '../notifications/notification_models.dart';
import 'home_page.dart';
import '../auth/login_page.dart';
import '../auth/profile_page.dart';
import '../events/events_page.dart';
import '../history/event_history_page.dart';
import '../gifts/gifts_page.dart';

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation>
    with SingleTickerProviderStateMixin {
  int _currentIndex = 0;
  final AuthService _authService = AuthService();
  final NotificationService _notificationService = NotificationService();
  bool _isSignedIn = false;

  final List<Widget> _pages = [];
  late final AnimationController _pulseController;

  // Notification banner state
  NotificationMessage? _currentNotification;
  bool _showBanner = false;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
      lowerBound: 0.95,
      upperBound: 1.05,
    )..repeat(reverse: true);
    _checkAuthStatus().then((_) {
      _initPages();
      _setupNotificationListener();
    });
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _notificationService.onNewNotification = null;
    _notificationService.onUnreadCountChanged = null;
    super.dispose();
  }

  void _setupNotificationListener() {
    // Lắng nghe thông báo mới
    _notificationService.onNewNotification = (notification) {
      safePrint(
        '📬 Received new notification in MainNavigation: ${notification.deliveryId}',
      );
      if (mounted) {
        setState(() {
          _currentNotification = notification;
          _showBanner = true;
        });
        safePrint('✅ Banner should be visible now');

        // Tự động ẩn banner sau 5 giây
        Future.delayed(const Duration(seconds: 5), () {
          if (mounted && _showBanner) {
            setState(() {
              _showBanner = false;
            });
          }
        });
      } else {
        safePrint('⚠️ Widget not mounted, cannot show banner');
      }
    };

    // Bắt đầu polling nếu đã đăng nhập
    if (_isSignedIn) {
      safePrint('🔔 User is signed in, starting notification polling');
      _notificationService.startPolling();
    } else {
      safePrint('⚠️ User not signed in, skipping notification polling');
    }
  }

  Future<void> _checkAuthStatus() async {
    final signedIn = await _authService.isSignedIn();
    if (mounted) {
      setState(() {
        _isSignedIn = signedIn;
      });

      // Bắt đầu/dừng polling dựa trên trạng thái đăng nhập
      if (signedIn) {
        _notificationService.startPolling();
      } else {
        _notificationService.stopPolling();
        _notificationService.reset();
      }
    }
  }

  void _initPages() {
    _pages.clear();
    _pages.addAll([
      const HomePage(),
      const EventsPage(),
      const GiftsPage(),
      const EventHistoryPage(key: ValueKey('EventHistoryPage')),
      _isSignedIn
          ? const ProfilePage()
          : const _ComingSoonPage(title: 'Đăng nhập', icon: Icons.login),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          IndexedStack(index: _currentIndex, children: _pages),
          // Notification banner overlay
          if (_showBanner && _currentNotification != null)
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: SafeArea(
                child: NotificationBanner(
                  notification: _currentNotification!,
                  onDismiss: () {
                    setState(() {
                      _showBanner = false;
                    });
                  },
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => const NotificationsPage(),
                      ),
                    );
                  },
                ),
              ),
            ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) async {
          // Nếu nhấn Profile (index 4) chưa đăng nhập -> đi đến login
          if (index == 4 && !_isSignedIn) {
            // Chờ login hoàn thành
            final result = await Navigator.of(
              context,
            ).push(MaterialPageRoute(builder: (_) => const LoginPage()));
            // Reload auth status sau khi login
            await _checkAuthStatus();
            if (result == true && _isSignedIn) {
              // Cập nhật profile page và chuyển sang tab profile
              _pages[4] = const ProfilePage();
              setState(() {
                _currentIndex = 4;
              });
            }
          } else {
            // Reload EventHistoryPage when switching to it
            if (index == 3) {
              EventHistoryPage.reload();
            }
            setState(() {
              _currentIndex = index;
            });
          }
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: const Color(0xFFFB923C),
        unselectedItemColor: const Color(0xFF9CA3AF),
        selectedLabelStyle: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.normal,
        ),
        items: [
          BottomNavigationBarItem(
            icon: ScaleTransition(
              scale: _pulseController,
              child: const Icon(Icons.home_outlined),
            ),
            activeIcon: ScaleTransition(
              scale: _pulseController,
              child: const Icon(Icons.home),
            ),
            label: 'Trang chủ',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.event_available_outlined),
            activeIcon: Icon(Icons.event_available),
            label: 'Sự kiện',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.card_giftcard_outlined),
            activeIcon: Icon(Icons.card_giftcard),
            label: 'Đổi quà',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.history_outlined),
            activeIcon: Icon(Icons.history),
            label: 'Lịch sử',
          ),
          BottomNavigationBarItem(
            icon: _isSignedIn
                ? const Icon(Icons.account_circle_outlined)
                : const Icon(Icons.login_outlined),
            activeIcon: _isSignedIn
                ? const Icon(Icons.account_circle)
                : const Icon(Icons.login),
            label: _isSignedIn ? 'Profile' : 'Đăng nhập',
          ),
        ],
      ),
    );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Reload auth status mỗi khi dependencies thay đổi
    _checkAuthStatus();
  }
}

// Placeholder page cho các tab chưa implement
class _ComingSoonPage extends StatelessWidget {
  final String title;
  final IconData icon;

  const _ComingSoonPage({required this.title, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        backgroundColor: const Color(0xFFFB923C),
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 100, color: const Color(0xFF9CA3AF)),
            const SizedBox(height: 24),
            Text(
              'Tính năng $title',
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Color(0xFF111827),
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Đang phát triển',
              style: TextStyle(fontSize: 16, color: Color(0xFF6B7280)),
            ),
          ],
        ),
      ),
    );
  }
}
