import 'package:flutter/material.dart';
import 'dart:convert';
import 'dart:io';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import '../../services/auth_service.dart';
import '../../services/api_client.dart';
import '../../config/api_config.dart' as app_config;
import '../wallet/wallet_page.dart';
import '../history/event_history_page.dart';
import '../notifications/notifications_page.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

// University model
class University {
  final String id;
  final String name;

  University({required this.id, required this.name});

  factory University.fromJson(Map<String, dynamic> json) {
    return University(
      id: (json['id'] ?? json['universityId']).toString(),
      name: json['name'] as String,
    );
  }
}

class _ProfilePageState extends State<ProfilePage> {
  final AuthService _authService = AuthService();
  final ApiClient _apiClient = ApiClient();
  bool _isLoading = false;

  // User info - lấy từ backend API
  String _userName = '';
  String _userEmail = '';
  String _phoneNumber = '';
  String? _avatarUrl;
  String? _avatarPath;
  String? _universityName;
  int _totalPoints = 0;
  int _unreadNotificationCount = 0;

  // Onboarding form fields
  String? _selectedUserType;
  String? _selectedUniversity;
  List<University> _universities = [];
  bool _loadingUniversities = false;
  XFile? _onboardingAvatarFile;
  String? _onboardingAvatarPreview;

  // Edit form fields
  final TextEditingController _editNameController = TextEditingController();
  final TextEditingController _editPhoneController = TextEditingController();
  final ImagePicker _imagePicker = ImagePicker();
  XFile? _editAvatarFile;
  String? _editAvatarPreview;

  String _normalizePhoneNumber(String phone) =>
      phone.replaceAll(RegExp(r'\D'), '');

  bool _isValidPhoneNumber(String phone) {
    final normalized = _normalizePhoneNumber(phone);
    const pattern = r'^(03|05|07|08|09)\d{8}$';
    return RegExp(pattern).hasMatch(normalized);
  }

  @override
  void initState() {
    super.initState();
    _loadUserInfo();
    _loadUnreadNotificationCount();
  }

  @override
  void dispose() {
    _editNameController.dispose();
    _editPhoneController.dispose();
    super.dispose();
  }

  Future<void> _loadUserInfo() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Lấy thông tin từ backend API
      final response = await _apiClient.get(app_config.ApiConfig.profile);
      safePrint('🔍 Profile response: ${response.statusCode}');

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        final data = json['data'] ?? json;

        if (mounted) {
          setState(() {
            _userName = data['fullName'] as String? ?? '';
            _userEmail = data['email'] as String? ?? '';
            _phoneNumber = data['phoneNumber'] as String? ?? '';
            _avatarUrl = data['avatarUrl'] as String?;
            _avatarPath = _avatarUrl;
            _universityName = data['universityName'] as String?;
            _totalPoints = (data['balance'] as num?)?.toInt() ?? 0;
            _isLoading = false;
          });
        }
      } else if (response.statusCode == 404) {
        // Profile chưa tồn tại, cần redirect về onboarding
        safePrint('⚠️ Profile chưa tồn tại (404), hiển thị onboarding');
        if (mounted) {
          setState(() {
            _isLoading = false;
          });
          // Có thể hiển thị dialog hoặc navigate
          _showOnboardingDialog();
        }
      } else {
        safePrint('❌ Lỗi không mong đợi: ${response.statusCode}');
        throw Exception('Failed to load profile: ${response.statusCode}');
      }
    } catch (e) {
      safePrint('❌ Lỗi khi load user info: $e');
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _showOnboardingDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Text('Hoàn thiện hồ sơ'),
        content: const Text(
          'Bạn cần hoàn thiện thông tin hồ sơ trước khi sử dụng tính năng này.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Hủy'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              _showOnboardingForm();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFFB923C),
              foregroundColor: Colors.white,
            ),
            child: const Text('Bắt đầu'),
          ),
        ],
      ),
    );
  }

  Future<void> _loadUniversities() async {
    if (_universities.isNotEmpty) return;

    setState(() {
      _loadingUniversities = true;
    });

    try {
      final response = await _apiClient.get(app_config.ApiConfig.universities);
      safePrint('🔍 Universities response: ${response.statusCode}');

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        safePrint('🔍 Universities data: $json');
        final data = json['data'] ?? [];

        if (mounted) {
          setState(() {
            _universities = (data as List)
                .map((item) => University.fromJson(item))
                .toList();
            _loadingUniversities = false;
          });
          safePrint('🔍 Loaded ${_universities.length} universities');
        }
      }
    } catch (e) {
      safePrint('Lỗi khi load universities: $e');
      if (mounted) {
        setState(() {
          _loadingUniversities = false;
        });
      }
    }
  }

  void _showOnboardingForm() {
    // Reset form
    _selectedUserType = null;
    _selectedUniversity = null;
    _editPhoneController.text = '';
    _onboardingAvatarFile = null;
    _onboardingAvatarPreview = null;
    _loadUniversities();

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => StatefulBuilder(
        builder: (context, setStateDialog) => AlertDialog(
          title: const Text('Hoàn tất hồ sơ'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // User Type
                DropdownButtonFormField<String>(
                  decoration: const InputDecoration(
                    labelText: 'Loại người dùng *',
                    border: OutlineInputBorder(),
                  ),
                  value: _selectedUserType,
                  items: const [
                    DropdownMenuItem(
                      value: 'sinh viên',
                      child: Text('Sinh viên'),
                    ),
                    DropdownMenuItem(
                      value: 'người ngoài',
                      child: Text('Người ngoài'),
                    ),
                  ],
                  onChanged: (value) {
                    setStateDialog(() {
                      _selectedUserType = value;
                      if (value != 'sinh viên') {
                        _selectedUniversity = null;
                      }
                    });
                  },
                ),
                const SizedBox(height: 16),
                // University (only for students)
                if (_selectedUserType == 'sinh viên') ...[
                  DropdownButtonFormField<String>(
                    decoration: InputDecoration(
                      labelText: 'Tên trường Đại học *',
                      border: const OutlineInputBorder(),
                      suffixIcon: _loadingUniversities
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : null,
                    ),
                    value: _selectedUniversity,
                    items: _universities
                        .map(
                          (u) => DropdownMenuItem(
                            value: u.name,
                            child: Text(
                              u.name,
                              overflow: TextOverflow.ellipsis,
                              maxLines: 1,
                            ),
                          ),
                        )
                        .toList(),
                    onChanged: _loadingUniversities
                        ? null
                        : (value) {
                            setStateDialog(() {
                              _selectedUniversity = value;
                            });
                          },
                    isExpanded: true,
                  ),
                  const SizedBox(height: 16),
                ],
                // Phone Number
                TextField(
                  controller: _editPhoneController,
                  decoration: const InputDecoration(
                    labelText: 'Số điện thoại *',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 16),
                // Avatar uploader (optional)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text(
                      'Ảnh đại diện (tùy chọn)',
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 8),
                    if (_onboardingAvatarPreview != null)
                      ClipRRect(
                        borderRadius: BorderRadius.circular(60),
                        child: Image.file(
                          File(_onboardingAvatarPreview!),
                          width: 120,
                          height: 120,
                          fit: BoxFit.cover,
                        ),
                      )
                    else
                      Container(
                        width: 120,
                        height: 120,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(60),
                          color: const Color(0xFFF3F4F6),
                        ),
                        child: const Icon(
                          Icons.person,
                          size: 48,
                          color: Color(0xFF9CA3AF),
                        ),
                      ),
                    const SizedBox(height: 12),
                    ElevatedButton.icon(
                      onPressed: () async {
                        try {
                          final picked = await _imagePicker.pickImage(
                            source: ImageSource.gallery,
                            maxWidth: 1024,
                          );
                          if (picked != null) {
                            setStateDialog(() {
                              _onboardingAvatarFile = picked;
                              _onboardingAvatarPreview = picked.path;
                            });
                          }
                        } catch (e) {
                          safePrint('❌ Error picking image: $e');
                          if (mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  'Không thể mở thư viện ảnh. Vui lòng thử lại sau khi khởi động lại ứng dụng.',
                                ),
                                backgroundColor: Colors.red,
                              ),
                            );
                          }
                        }
                      },
                      icon: const Icon(Icons.upload_file),
                      label: Text(
                        _onboardingAvatarFile == null
                            ? 'Chọn ảnh'
                            : 'Chọn ảnh khác',
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFB923C),
                        foregroundColor: Colors.white,
                      ),
                    ),
                    if (_onboardingAvatarFile != null)
                      TextButton(
                        onPressed: () {
                          setStateDialog(() {
                            _onboardingAvatarFile = null;
                            _onboardingAvatarPreview = null;
                          });
                        },
                        child: const Text('Gỡ ảnh'),
                      ),
                  ],
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
                Navigator.of(context).pop();
                await _completeProfile();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFB923C),
                foregroundColor: Colors.white,
              ),
              child: const Text('Hoàn tất'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _completeProfile() async {
    safePrint('🔍 Starting complete profile...');
    safePrint('🔍 User type: $_selectedUserType');
    safePrint('🔍 University: $_selectedUniversity');
    safePrint('🔍 Phone: ${_editPhoneController.text.trim()}');

    // Validate required fields
    if (_selectedUserType == null || _selectedUserType!.isEmpty) {
      safePrint('❌ User type is null or empty');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Vui lòng chọn loại người dùng'),
            backgroundColor: Color(0xFFDC2626),
          ),
        );
      }
      return;
    }

    if (_selectedUserType == 'sinh viên' &&
        (_selectedUniversity == null || _selectedUniversity!.isEmpty)) {
      safePrint('❌ University is null or empty');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Vui lòng chọn trường đại học'),
            backgroundColor: Color(0xFFDC2626),
          ),
        );
      }
      return;
    }

    if (_editPhoneController.text.trim().isEmpty) {
      safePrint('❌ Phone is empty');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Vui lòng nhập số điện thoại'),
            backgroundColor: Color(0xFFDC2626),
          ),
        );
      }
      return;
    }

    try {
      // Bước 1: Update Cognito attributes (user_type, university)
      safePrint('📝 Cập nhật Cognito attributes...');

      // Update user_type
      final userTypeResult = await Amplify.Auth.updateUserAttribute(
        userAttributeKey: const CognitoUserAttributeKey.custom('user_type'),
        value: _selectedUserType!,
      );
      safePrint(
        '✅ Updated user_type: ${userTypeResult.nextStep.updateAttributeStep}',
      );

      if (_selectedUserType == 'sinh viên' && _selectedUniversity != null) {
        final universityResult = await Amplify.Auth.updateUserAttribute(
          userAttributeKey: const CognitoUserAttributeKey.custom('university'),
          value: _selectedUniversity!.trim(),
        );
        safePrint(
          '✅ Updated university: ${universityResult.nextStep.updateAttributeStep}',
        );
      }

      safePrint('✅ Cognito attributes updated');

      // Refresh tokens để lấy ID token mới có custom attributes
      await _authService.refreshTokens();

      // Bước 2: Gọi API complete-profile để lưu phoneNumber và avatarUrl vào BE
      safePrint('📝 Gọi API complete profile...');
      final phoneRaw = _editPhoneController.text.trim();
      if (!_isValidPhoneNumber(phoneRaw)) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Số điện thoại không hợp lệ'),
              backgroundColor: Color(0xFFDC2626),
            ),
          );
        }
        return;
      }

      final normalizedPhoneNumber = _normalizePhoneNumber(phoneRaw);
      final payload = <String, String>{'phoneNumber': normalizedPhoneNumber};
      if (_avatarPath != null &&
          _avatarPath!.isNotEmpty &&
          _onboardingAvatarFile == null) {
        payload['avatarPath'] = _avatarPath!;
      }

      final files = <http.MultipartFile>[];
      if (_onboardingAvatarFile != null) {
        files.add(
          await http.MultipartFile.fromPath(
            'image',
            _onboardingAvatarFile!.path,
          ),
        );
      }

      final response = await _apiClient.postMultipart(
        app_config.ApiConfig.completeProfile,
        fields: {'data': jsonEncode(payload)},
        files: files,
      );
      safePrint('✅ Complete profile response: ${response.statusCode}');
      safePrint('✅ Response body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        final body = response.body.isNotEmpty
            ? jsonDecode(response.body)
            : null;
        final data = body is Map<String, dynamic>
            ? (body['data'] ?? body)
            : null;
        if (data is Map<String, dynamic>) {
          _avatarUrl = data['avatarUrl'] as String? ?? _avatarUrl;
          _avatarPath = _avatarUrl;
          _phoneNumber = data['phoneNumber'] as String? ?? _phoneNumber;
          _userName = data['fullName'] as String? ?? _userName;
        }

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Hoàn thiện hồ sơ thành công'),
              backgroundColor: Color(0xFF10B981),
            ),
          );
        }

        setState(() {
          _onboardingAvatarFile = null;
          _onboardingAvatarPreview = null;
        });

        await _loadUserInfo();
      } else {
        safePrint('⚠️ Complete profile status code: ${response.statusCode}');
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Lỗi: Status code ${response.statusCode}'),
              backgroundColor: const Color(0xFFDC2626),
            ),
          );
        }
      }
    } on AuthException catch (e) {
      safePrint('❌ Lỗi khi update Cognito: ${e.message}');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Lỗi cập nhật Cognito: ${e.message}'),
            backgroundColor: const Color(0xFFDC2626),
          ),
        );
      }
    } catch (e) {
      safePrint('❌ Lỗi khi complete profile: $e');
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

  void _openEditDialog() {
    _editNameController.text = _userName;
    _editPhoneController.text = _phoneNumber;
    _editAvatarFile = null;
    _editAvatarPreview = _avatarUrl;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setStateDialog) => AlertDialog(
          title: const Text('Chỉnh sửa thông tin'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: _editNameController,
                  decoration: const InputDecoration(
                    labelText: 'Họ tên',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _editPhoneController,
                  decoration: const InputDecoration(
                    labelText: 'Số điện thoại',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text(
                      'Ảnh đại diện',
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 8),
                    if (_editAvatarFile != null)
                      ClipRRect(
                        borderRadius: BorderRadius.circular(60),
                        child: Image.file(
                          File(_editAvatarFile!.path),
                          width: 120,
                          height: 120,
                          fit: BoxFit.cover,
                        ),
                      )
                    else if (_editAvatarPreview != null &&
                        _editAvatarPreview!.isNotEmpty)
                      ClipRRect(
                        borderRadius: BorderRadius.circular(60),
                        child: Image.network(
                          _editAvatarPreview!,
                          width: 120,
                          height: 120,
                          fit: BoxFit.cover,
                        ),
                      )
                    else
                      Container(
                        width: 120,
                        height: 120,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(60),
                          color: const Color(0xFFF3F4F6),
                        ),
                        child: const Icon(
                          Icons.person,
                          size: 48,
                          color: Color(0xFF9CA3AF),
                        ),
                      ),
                    const SizedBox(height: 12),
                    ElevatedButton.icon(
                      onPressed: () async {
                        try {
                          final picked = await _imagePicker.pickImage(
                            source: ImageSource.gallery,
                            maxWidth: 1024,
                          );
                          if (picked != null) {
                            setStateDialog(() {
                              _editAvatarFile = picked;
                              _editAvatarPreview = picked.path;
                            });
                          }
                        } catch (e) {
                          safePrint('❌ Error picking image: $e');
                          if (mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  'Không thể mở thư viện ảnh. Vui lòng thử lại sau khi khởi động lại ứng dụng.',
                                ),
                                backgroundColor: Colors.red,
                              ),
                            );
                          }
                        }
                      },
                      icon: const Icon(Icons.upload_file),
                      label: Text(
                        _editAvatarFile == null ? 'Chọn ảnh' : 'Chọn ảnh khác',
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFB923C),
                        foregroundColor: Colors.white,
                      ),
                    ),
                    if (_editAvatarFile != null ||
                        (_editAvatarPreview != null &&
                            _editAvatarPreview!.isNotEmpty))
                      TextButton(
                        onPressed: () {
                          setStateDialog(() {
                            _editAvatarFile = null;
                            _editAvatarPreview = null;
                          });
                        },
                        child: const Text('Gỡ ảnh'),
                      ),
                  ],
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
                Navigator.of(context).pop();
                await _updateProfile();
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

  Future<void> _updateProfile() async {
    try {
      final payload = <String, String>{};

      final fullName = _editNameController.text.trim();
      final phone = _editPhoneController.text.trim();

      if (fullName.isNotEmpty) {
        payload['fullName'] = fullName;
      }

      if (phone.isNotEmpty) {
        if (!_isValidPhoneNumber(phone)) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Số điện thoại không hợp lệ'),
                backgroundColor: Color(0xFFDC2626),
              ),
            );
          }
          return;
        }
        payload['phoneNumber'] = _normalizePhoneNumber(phone);
      }

      if (_editAvatarFile == null &&
          _editAvatarPreview != null &&
          _editAvatarPreview!.isNotEmpty) {
        payload['avatarPath'] = _editAvatarPreview!;
      }

      final files = <http.MultipartFile>[];
      if (_editAvatarFile != null) {
        files.add(
          await http.MultipartFile.fromPath('image', _editAvatarFile!.path),
        );
      }

      final response = await _apiClient.putMultipart(
        '${app_config.ApiConfig.students}/me',
        fields: {'data': jsonEncode(payload)},
        files: files,
      );

      if (response.statusCode == 200) {
        final body = response.body.isNotEmpty
            ? jsonDecode(response.body)
            : null;
        final data = body is Map<String, dynamic>
            ? (body['data'] ?? body)
            : null;
        if (data is Map<String, dynamic>) {
          _avatarUrl = data['avatarUrl'] as String? ?? _avatarUrl;
          _avatarPath = _avatarUrl;
          _userName = data['fullName'] as String? ?? _userName;
          _phoneNumber = data['phoneNumber'] as String? ?? _phoneNumber;
        }

        await _loadUserInfo();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Cập nhật thông tin thành công'),
              backgroundColor: Color(0xFF10B981),
            ),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Lỗi cập nhật: Status code ${response.statusCode}'),
              backgroundColor: const Color(0xFFDC2626),
            ),
          );
        }
      }
    } catch (e) {
      safePrint('Lỗi khi update profile: $e');
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

  Future<void> _loadUnreadNotificationCount() async {
    try {
      final response = await _apiClient.get(app_config.ApiConfig.unreadCount);
      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        final count = body is Map<String, dynamic>
            ? (body['count'] ?? 0)
            : (body ?? 0);
        if (mounted) {
          setState(() {
            _unreadNotificationCount = count is int ? count : 0;
          });
        }
      }
    } catch (e) {
      safePrint('❌ Error loading unread notification count: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Thông tin cá nhân'),
        backgroundColor: const Color(0xFFFB923C),
        foregroundColor: Colors.white,
        actions: [
          // Notification bell
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined),
                onPressed: () async {
                  final result = await Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const NotificationsPage(),
                    ),
                  );
                  // Reload unread count when returning from notifications page
                  _loadUnreadNotificationCount();
                },
              ),
              if (_unreadNotificationCount > 0)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(
                      minWidth: 16,
                      minHeight: 16,
                    ),
                    child: Text(
                      _unreadNotificationCount > 9
                          ? '9+'
                          : '$_unreadNotificationCount',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
          IconButton(
            icon: const Icon(Icons.edit_outlined),
            onPressed: () => _openEditDialog(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Profile Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFFB923C), Color(0xFFF97316)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFFB923C).withOpacity(0.3),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Column(
                children: [
                  // Avatar
                  Stack(
                    children: [
                      CircleAvatar(
                        radius: 60,
                        backgroundColor: Colors.white.withOpacity(0.2),
                        child: CircleAvatar(
                          radius: 55,
                          backgroundColor: Colors.white,
                          backgroundImage:
                              (_avatarUrl != null && _avatarUrl!.isNotEmpty)
                              ? NetworkImage(_avatarUrl!)
                              : null,
                          child: (_avatarUrl != null && _avatarUrl!.isNotEmpty)
                              ? null
                              : Text(
                                  _userName.isNotEmpty
                                      ? _userName[0].toUpperCase()
                                      : 'S',
                                  style: const TextStyle(
                                    fontSize: 48,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFFFB923C),
                                  ),
                                ),
                        ),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.camera_alt,
                            size: 20,
                            color: Color(0xFFFB923C),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    _userName,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  if (_universityName != null &&
                      _universityName!.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      _universityName!,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.white.withOpacity(0.9),
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                  const SizedBox(height: 4),
                  Text(
                    _userEmail,
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white.withOpacity(0.9),
                    ),
                  ),
                ],
              ),
            ),

            // Points Card
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(24),
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
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEF3C7),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          Icons.stars,
                          size: 32,
                          color: Color(0xFFF59E0B),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Coin của bạn',
                            style: TextStyle(
                              fontSize: 14,
                              color: Color(0xFF6B7280),
                            ),
                          ),
                          Text(
                            '$_totalPoints coin',
                            style: const TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF111827),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => const WalletPage(),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFB923C),
                      foregroundColor: Colors.white,
                      minimumSize: const Size(double.infinity, 48),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Xem lịch sử coin',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Menu Items
            _buildMenuItem(
              icon: Icons.history_outlined,
              title: 'Lịch sử đăng ký',
              subtitle: 'Xem các sự kiện đã tham gia',
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => const EventHistoryPage(),
                  ),
                );
              },
            ),
            _buildMenuItem(
              icon: Icons.card_giftcard_outlined,
              title: 'Quà đã đổi',
              subtitle: 'Chưa có quà nào',
              onTap: () {
                // TODO: Coming soon
              },
            ),
            _buildMenuItem(
              icon: Icons.help_outline,
              title: 'Trợ giúp & FAQ',
              subtitle: 'Câu hỏi thường gặp',
              onTap: () {
                _showHelpDialog();
              },
            ),
            _buildMenuItem(
              icon: Icons.info_outline,
              title: 'Về ứng dụng',
              subtitle: 'Phiên bản 1.0.0',
              onTap: () {
                _showAboutDialog();
              },
            ),

            const SizedBox(height: 16),

            // Logout Button
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              child: ElevatedButton.icon(
                onPressed: _handleLogout,
                icon: _isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            Colors.white,
                          ),
                        ),
                      )
                    : const Icon(Icons.logout),
                label: Text(
                  _isLoading ? 'Đang đăng xuất...' : 'Đăng xuất',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFDC2626),
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 56),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: const Color(0xFFF3F4F6),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: const Color(0xFF111827)),
        ),
        title: Text(
          title,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Color(0xFF111827),
          ),
        ),
        subtitle: Text(
          subtitle,
          style: const TextStyle(fontSize: 14, color: Color(0xFF6B7280)),
        ),
        trailing: const Icon(Icons.chevron_right, color: Color(0xFF9CA3AF)),
        onTap: onTap,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        tileColor: Colors.white,
      ),
    );
  }

  Future<void> _handleLogout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Đăng xuất'),
        content: const Text('Bạn có chắc muốn đăng xuất?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Hủy'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
            ),
            child: const Text('Đăng xuất'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      setState(() {
        _isLoading = true;
      });

      try {
        await _authService.signOut();
        if (mounted) {
          Navigator.of(
            context,
          ).pushNamedAndRemoveUntil('/welcome', (route) => false);
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Lỗi đăng xuất: ${e.toString()}'),
              backgroundColor: Colors.red,
            ),
          );
        }
      } finally {
        if (mounted) {
          setState(() {
            _isLoading = false;
          });
        }
      }
    }
  }

  void _showHelpDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Trợ giúp & FAQ'),
        content: const SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Câu hỏi thường gặp',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 16),
              Text(
                '1. Làm thế nào để đăng ký sự kiện?',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              Text(
                'Vào mục "Sự kiện", chọn sự kiện muốn tham gia và nhấn "Đăng ký tham gia".',
              ),
              SizedBox(height: 12),
              Text(
                '2. Cách tích coin?',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              Text(
                'Tham gia các sự kiện để tích coin. Coin sẽ được cộng vào ví của bạn.',
              ),
              SizedBox(height: 12),
              Text(
                '3. Làm sao để đổi quà?',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              Text('Vào mục "Đổi quà" và chọn quà bạn muốn đổi bằng coin.'),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Đóng'),
          ),
        ],
      ),
    );
  }

  void _showAboutDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Về ứng dụng'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'NVH Sinh Viên',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text('Phiên bản: 1.0.0'),
            SizedBox(height: 16),
            Text(
              'Ứng dụng quản lý sự kiện và tích điểm cho sinh viên.',
              style: TextStyle(fontStyle: FontStyle.italic),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Đóng'),
          ),
        ],
      ),
    );
  }
}
