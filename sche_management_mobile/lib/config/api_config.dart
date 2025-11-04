// API Configuration for the app
class ApiConfig {
  // Base URL cho API backend
  // Thay đổi URL này theo môi trường deployment của bạn
  static const String baseUrl =
      'https://brachycranic-noncorrelative-joya.ngrok-free.dev/api/v1';

  // API Endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String profile = '/me';
  static const String events = '/events';
  static const String gifts = '/gifts';
  static const String students = '/students';
  static const String completeProfile = '/students/me/complete-profile';
  static const String universities = '/universities';

  // Event endpoints
  static String getEventDetail(int eventId) => '/events/$eventId';
  static String registerForEvent(int eventId) => '/events/$eventId/register';
  static String submitFeedback(int eventId) => '/events/$eventId/feedback';
  static const String studentEvents = '/students/me/events';

  // Wallet endpoints
  static String getWallet(int walletId) => '/wallets/$walletId';
  static const String walletHistory = '/wallets/me/history';

  // Headers
  static Map<String, String> get defaultHeaders => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };
}
