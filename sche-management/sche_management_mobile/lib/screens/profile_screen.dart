import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hồ Sơ'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              // TODO: Navigate to settings
            },
          ),
        ],
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.deepPurple, Colors.purpleAccent],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                // Profile Header
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 10,
                        offset: const Offset(0, 5),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      // Avatar
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: const LinearGradient(
                            colors: [Colors.deepPurple, Colors.purpleAccent],
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.deepPurple.withOpacity(0.3),
                              blurRadius: 10,
                              offset: const Offset(0, 5),
                            ),
                          ],
                        ),
                        child: const Icon(
                          Icons.person,
                          size: 50,
                          color: Colors.white,
                        ),
                      ),

                      const SizedBox(height: 16),

                      // User Info
                      const Text(
                        'Nguyễn Văn A',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.deepPurple,
                        ),
                      ),

                      const SizedBox(height: 4),

                      Text(
                        'sinhvien@university.edu.vn',
                        style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                      ),

                      const SizedBox(height: 8),

                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.green.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text(
                          'Thành viên tích cực',
                          style: TextStyle(
                            color: Colors.green,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Stats Row
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildStatItem('Sự kiện', '12', Icons.event),
                          _buildStatItem('Điểm', '1,250', Icons.star),
                          _buildStatItem('Bạn bè', '45', Icons.people),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Menu Items
                _buildMenuSection('Tài khoản', [
                  _buildMenuItem(
                    'Thông tin cá nhân',
                    'Cập nhật thông tin và avatar',
                    Icons.person_outline,
                    () {},
                  ),
                  _buildMenuItem(
                    'Đổi mật khẩu',
                    'Bảo mật tài khoản của bạn',
                    Icons.lock_outline,
                    () {},
                  ),
                  _buildMenuItem(
                    'Cài đặt thông báo',
                    'Quản lý thông báo nhận được',
                    Icons.notifications_outlined,
                    () {},
                  ),
                ]),

                const SizedBox(height: 16),

                _buildMenuSection('Hoạt động', [
                  _buildMenuItem(
                    'Lịch sử đăng ký',
                    'Xem các sự kiện đã tham gia',
                    Icons.history,
                    () {},
                  ),
                  _buildMenuItem(
                    'Đánh giá & phản hồi',
                    'Đánh giá sự kiện đã tham gia',
                    Icons.star_outline,
                    () {},
                  ),
                  _buildMenuItem(
                    'Giấy chứng nhận',
                    'Tải xuống giấy chứng nhận',
                    Icons.card_membership,
                    () {},
                  ),
                ]),

                const SizedBox(height: 16),

                _buildMenuSection('Hỗ trợ', [
                  _buildMenuItem(
                    'Trung tâm trợ giúp',
                    'Câu hỏi thường gặp và hướng dẫn',
                    Icons.help_outline,
                    () {},
                  ),
                  _buildMenuItem(
                    'Liên hệ',
                    'Gửi phản hồi và yêu cầu hỗ trợ',
                    Icons.contact_support_outlined,
                    () {},
                  ),
                  _buildMenuItem(
                    'Đăng xuất',
                    'Thoát khỏi tài khoản',
                    Icons.logout,
                    () {},
                    textColor: Colors.red,
                  ),
                ]),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: Colors.deepPurple, size: 24),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.deepPurple,
          ),
        ),
        Text(label, style: TextStyle(fontSize: 12, color: Colors.grey[600])),
      ],
    );
  }

  Widget _buildMenuSection(String title, List<Widget> items) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.deepPurple,
              ),
            ),
          ),
          ...items,
        ],
      ),
    );
  }

  Widget _buildMenuItem(
    String title,
    String subtitle,
    IconData icon,
    VoidCallback onTap, {
    Color? textColor,
  }) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: (textColor ?? Colors.deepPurple).withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, color: textColor ?? Colors.deepPurple, size: 20),
      ),
      title: Text(
        title,
        style: TextStyle(
          fontWeight: FontWeight.w600,
          color: textColor ?? Colors.black87,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
      ),
      trailing: Icon(
        Icons.arrow_forward_ios,
        size: 16,
        color: Colors.grey[400],
      ),
      onTap: onTap,
    );
  }
}
