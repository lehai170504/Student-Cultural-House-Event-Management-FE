// API Configuration for the app
class ApiConfig {
  // Base URL cho API backend
  // Thay đổi URL này theo môi trường deployment của bạn
  static const String baseUrl =
      'https://loyalty-system-be.onrender.com/api/v1/';

  // API Endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String profile = '/me';
  static const String events = '/events';
  static const String gifts = '/gifts';
  static const String products = '/products';
  static const String students = '/students';
  static const String completeProfile = '/students/me/complete-profile';
  static const String universities = '/universities';

  // Event endpoints
  static String getEventDetail(String eventId) => '/events/$eventId';
  static String registerForEvent(String eventId) => '/events/$eventId/register';
  static String submitFeedback(String eventId) => '/events/$eventId/feedback';
  static String getEventFeedbacks(String eventId) => '/events/$eventId/feedback';
  static const String studentEvents = '/students/me/events';

  // Feedback endpoints
  static const String myFeedbacks = '/events/feedback/me';
  static String updateFeedback(String feedbackId) => '/events/feedback/$feedbackId';
  static String deleteFeedback(String feedbackId) => '/events/feedback/$feedbackId';

  // Wallet endpoints
  static String getWallet(String walletId) => '/wallets/$walletId';
  static const String walletHistory = '/wallets/me/history';

  // Invoice/Redeem endpoints
  static const String invoices = '/invoices';
  static String getStudentInvoices(String studentId) => '/invoices/students/$studentId';
  static const String invoiceStats = '/invoices/stats';

  // Product endpoints
  static const String topProducts = '/products/top';
  static const String lowStockProducts = '/products/low-stock';

  // Notification endpoints
  static const String notifications = '/me/broadcasts';
  static const String unreadCount = '/me/broadcasts/unread-count';
  static String markAsRead(String deliveryId) =>
      '/me/broadcasts/$deliveryId/read';

  // Headers
  static Map<String, String> get defaultHeaders => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };
}
