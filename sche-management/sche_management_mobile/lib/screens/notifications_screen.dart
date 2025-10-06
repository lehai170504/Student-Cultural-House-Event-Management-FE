import 'package:flutter/material.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Thông Báo'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.mark_email_read),
            onPressed: () {
              // TODO: Mark all as read
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
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Notification Stats
                Container(
                  padding: const EdgeInsets.all(16),
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
                  child: Row(
                    children: [
                      Expanded(
                        child: _buildStatCard(
                          'Chưa đọc',
                          '3',
                          Icons.mark_email_unread,
                          Colors.red,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _buildStatCard(
                          'Đã đọc',
                          '12',
                          Icons.mark_email_read,
                          Colors.green,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Filter Tabs
                SizedBox(
                  height: 40,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: [
                      _buildFilterChip('Tất cả', true),
                      const SizedBox(width: 8),
                      _buildFilterChip('Sự kiện', false),
                      const SizedBox(width: 8),
                      _buildFilterChip('Hệ thống', false),
                      const SizedBox(width: 8),
                      _buildFilterChip('Thông báo', false),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Notifications List
                const Text(
                  'Thông Báo Gần Đây',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),

                const SizedBox(height: 15),

                _buildNotificationCard(
                  'Đăng ký thành công',
                  'Bạn đã đăng ký thành công sự kiện "Lễ Hội Văn Hóa Truyền Thống 2024"',
                  '2 phút trước',
                  Icons.check_circle,
                  Colors.green,
                  true,
                ),

                _buildNotificationCard(
                  'Nhắc nhở sự kiện',
                  'Sự kiện "Workshop Kỹ Năng Mềm" sẽ diễn ra vào ngày mai lúc 14:00',
                  '1 giờ trước',
                  Icons.event,
                  Colors.blue,
                  true,
                ),

                _buildNotificationCard(
                  'Cập nhật hệ thống',
                  'Ứng dụng đã được cập nhật lên phiên bản mới với nhiều tính năng hữu ích',
                  '3 giờ trước',
                  Icons.system_update,
                  Colors.orange,
                  true,
                ),

                _buildNotificationCard(
                  'Đánh giá sự kiện',
                  'Hãy đánh giá trải nghiệm của bạn tại sự kiện "Giải Bóng Đá Sinh Viên"',
                  '1 ngày trước',
                  Icons.star,
                  Colors.purple,
                  false,
                ),

                _buildNotificationCard(
                  'Thông báo mới',
                  'Nhà văn hóa sinh viên sẽ tổ chức thêm nhiều hoạt động thú vị trong tháng 12',
                  '2 ngày trước',
                  Icons.notifications,
                  Colors.deepPurple,
                  false,
                ),

                _buildNotificationCard(
                  'Nhắc nhở thanh toán',
                  'Vui lòng hoàn tất thanh toán cho sự kiện "Workshop Kỹ Năng Mềm" trước ngày 16/12',
                  '3 ngày trước',
                  Icons.payment,
                  Colors.red,
                  false,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(
    String title,
    String count,
    IconData icon,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            count,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              color: color,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? Colors.white : Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.3)),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: isSelected ? Colors.deepPurple : Colors.white,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }

  Widget _buildNotificationCard(
    String title,
    String message,
    String time,
    IconData icon,
    Color iconColor,
    bool isUnread,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
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
        border: isUnread
            ? Border.all(color: Colors.deepPurple.withOpacity(0.3), width: 1)
            : null,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Icon with unread indicator
          Stack(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: iconColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: iconColor, size: 20),
              ),
              if (isUnread)
                Positioned(
                  right: 0,
                  top: 0,
                  child: Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
            ],
          ),

          const SizedBox(width: 12),

          // Content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: isUnread
                              ? FontWeight.bold
                              : FontWeight.w600,
                          color: Colors.black87,
                        ),
                      ),
                    ),
                    Text(
                      time,
                      style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                    ),
                  ],
                ),

                const SizedBox(height: 4),

                Text(
                  message,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
