import 'package:flutter/material.dart';

class EventsScreen extends StatelessWidget {
  const EventsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sự Kiện'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // TODO: Implement search functionality
            },
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              // TODO: Implement filter functionality
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
                // Event Categories
                SizedBox(
                  height: 50,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: [
                      _buildCategoryChip('Tất cả', true),
                      const SizedBox(width: 8),
                      _buildCategoryChip('Văn hóa', false),
                      const SizedBox(width: 8),
                      _buildCategoryChip('Thể thao', false),
                      const SizedBox(width: 8),
                      _buildCategoryChip('Giáo dục', false),
                      const SizedBox(width: 8),
                      _buildCategoryChip('Giải trí', false),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Events List
                const Text(
                  'Sự Kiện Nổi Bật',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),

                const SizedBox(height: 15),

                _buildEventCard(
                  'Lễ Hội Văn Hóa Truyền Thống 2024',
                  'Khám phá những giá trị văn hóa truyền thống của dân tộc qua các hoạt động biểu diễn, triển lãm và trải nghiệm thú vị.',
                  '15/12/2024 - 19:00',
                  'Sân trường A',
                  'Miễn phí',
                  Icons.festival,
                  Colors.orange,
                ),

                _buildEventCard(
                  'Workshop Kỹ Năng Mềm',
                  'Phát triển kỹ năng giao tiếp, làm việc nhóm và tư duy phản biện qua các bài tập thực hành.',
                  '18/12/2024 - 14:00',
                  'Phòng họp B',
                  '50,000đ',
                  Icons.school,
                  Colors.blue,
                ),

                _buildEventCard(
                  'Giải Bóng Đá Sinh Viên',
                  'Tham gia giải đấu bóng đá hằng năm với các đội từ các khoa trong trường.',
                  '20/12/2024 - 16:00',
                  'Sân vận động',
                  'Miễn phí',
                  Icons.sports_soccer,
                  Colors.green,
                ),

                _buildEventCard(
                  'Triển Lãm Nghệ Thuật',
                  'Trưng bày các tác phẩm nghệ thuật của sinh viên với chủ đề "Tương lai xanh".',
                  '22/12/2024 - 09:00',
                  'Thư viện',
                  'Miễn phí',
                  Icons.palette,
                  Colors.purple,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryChip(String label, bool isSelected) {
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

  Widget _buildEventCard(
    String title,
    String description,
    String date,
    String location,
    String price,
    IconData icon,
    Color iconColor,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: iconColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: iconColor, size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      price,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.green[600],
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.deepPurple.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  'Đăng ký',
                  style: TextStyle(
                    color: Colors.deepPurple,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          Text(
            description,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
              height: 1.4,
            ),
          ),

          const SizedBox(height: 12),

          Row(
            children: [
              Icon(Icons.access_time, size: 16, color: Colors.grey[600]),
              const SizedBox(width: 4),
              Text(
                date,
                style: TextStyle(fontSize: 13, color: Colors.grey[600]),
              ),
              const SizedBox(width: 16),
              Icon(Icons.location_on, size: 16, color: Colors.grey[600]),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  location,
                  style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
