import 'package:flutter/material.dart';
import '../../services/auth_service.dart';
import 'home_page.dart';
import '../auth/login_page.dart';
import '../auth/profile_page.dart';
import '../events/events_page.dart';
import '../history/event_history_page.dart';

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _currentIndex = 0;
  final AuthService _authService = AuthService();
  bool _isSignedIn = false;

  final List<Widget> _pages = [];

  @override
  void initState() {
    super.initState();
    _checkAuthStatus().then((_) => _initPages());
  }

  Future<void> _checkAuthStatus() async {
    final signedIn = await _authService.isSignedIn();
    if (mounted) {
      setState(() {
        _isSignedIn = signedIn;
      });
    }
  }

  void _initPages() {
    _pages.clear();
    _pages.addAll([
      const HomePage(),
      const EventsPage(),
      const _ComingSoonPage(title: 'Đổi quà', icon: Icons.card_giftcard),
      const EventHistoryPage(key: ValueKey('EventHistoryPage')),
      _isSignedIn
          ? const ProfilePage()
          : const _ComingSoonPage(title: 'Đăng nhập', icon: Icons.login),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _currentIndex, children: _pages),
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
          const BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
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
