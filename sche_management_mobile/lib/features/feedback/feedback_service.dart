import 'dart:convert';
import '../../services/api_client.dart';
import '../../config/api_config.dart' as app_config;
import 'feedback_models.dart';
import 'package:amplify_flutter/amplify_flutter.dart';

class FeedbackService {
  final ApiClient _apiClient = ApiClient();

  /// 🔹 Lấy tất cả feedback của student hiện tại với pagination và optional filter eventId
  /// Endpoint: GET /events/feedback/me?page=1&size=10&eventId=xxx
  Future<FeedbackResponse> getMyFeedbacks({
    int page = 1,
    int size = 10,
    String? eventId,
  }) async {
    try {
      safePrint(
        '🔍 [getMyFeedbacks] Loading feedbacks page $page, size $size, eventId: $eventId',
      );

      // Build query parameters
      final queryParams = <String, String>{
        'page': page.toString(),
        'size': size.toString(),
      };

      if (eventId != null && eventId.isNotEmpty) {
        queryParams['eventId'] = eventId;
      }

      // Build URL with query parameters
      final queryString = queryParams.entries
          .map(
            (e) =>
                '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value)}',
          )
          .join('&');
      final url = '${app_config.ApiConfig.myFeedbacks}?$queryString';

      safePrint('🔍 [getMyFeedbacks] Request URL: $url');

      final response = await _apiClient.get(url);

      safePrint('📥 [getMyFeedbacks] Response status: ${response.statusCode}');
      safePrint('📥 [getMyFeedbacks] Response body: ${response.body}');

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        final feedbackResponse = FeedbackResponse.fromJson(json);

        safePrint(
          '✅ [getMyFeedbacks] Loaded ${feedbackResponse.data.length} feedbacks',
        );
        return feedbackResponse;
      } else {
        throw Exception('Failed to load feedbacks: ${response.statusCode}');
      }
    } catch (e) {
      safePrint('❌ [getMyFeedbacks] Error: $e');
      rethrow;
    }
  }

  /// 🔹 Cập nhật feedback của student
  /// Endpoint: PUT /events/feedback/{feedbackId}
  Future<Feedback> updateFeedback({
    required String feedbackId,
    required int rating,
    required String comments,
  }) async {
    try {
      safePrint(
        '🔍 [updateFeedback] Updating feedback $feedbackId with rating $rating',
      );

      final response = await _apiClient.put(
        app_config.ApiConfig.updateFeedback(feedbackId),
        body: {'rating': rating, 'comments': comments},
      );

      safePrint('📥 [updateFeedback] Response status: ${response.statusCode}');
      safePrint('📥 [updateFeedback] Response body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        final data = json['data'] ?? json;
        final feedback = Feedback.fromJson(data as Map<String, dynamic>);

        safePrint('✅ [updateFeedback] Updated feedback successfully');
        return feedback;
      } else {
        throw Exception('Failed to update feedback: ${response.statusCode}');
      }
    } catch (e) {
      safePrint('❌ [updateFeedback] Error: $e');
      rethrow;
    }
  }

  /// 🔹 Xóa feedback của student
  /// Endpoint: DELETE /events/feedback/{feedbackId}
  Future<void> deleteFeedback(String feedbackId) async {
    try {
      safePrint('🔍 [deleteFeedback] Deleting feedback $feedbackId');

      final response = await _apiClient.delete(
        app_config.ApiConfig.deleteFeedback(feedbackId),
      );

      safePrint('📥 [deleteFeedback] Response status: ${response.statusCode}');

      if (response.statusCode == 200 || response.statusCode == 204) {
        safePrint('✅ [deleteFeedback] Deleted feedback successfully');
      } else {
        throw Exception('Failed to delete feedback: ${response.statusCode}');
      }
    } catch (e) {
      safePrint('❌ [deleteFeedback] Error: $e');
      rethrow;
    }
  }

  /// 🔹 Lấy danh sách feedback của một sự kiện cụ thể
  /// Tương tự như web app: GET /events/{eventId}/feedback
  Future<List<Feedback>> getEventFeedbacks(String eventId) async {
    try {
      safePrint('🔍 [getEventFeedbacks] Loading feedbacks for event $eventId');

      final response = await _apiClient.get(
        app_config.ApiConfig.getEventFeedbacks(eventId),
      );

      safePrint(
        '📥 [getEventFeedbacks] Response status: ${response.statusCode}',
      );
      safePrint('📥 [getEventFeedbacks] Response body: ${response.body}');

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);

        // Handle different response formats
        List<dynamic> feedbackList = [];

        if (decoded is List) {
          // Response is directly a list
          feedbackList = decoded;
        } else if (decoded is Map<String, dynamic>) {
          final json = decoded;
          if (json['data'] != null) {
            if (json['data'] is List) {
              feedbackList = json['data'] as List;
            } else if (json['data'] is Map<String, dynamic>) {
              final dataMap = json['data'] as Map<String, dynamic>;
              if (dataMap['data'] is List) {
                feedbackList = dataMap['data'] as List;
              }
            }
          }
        }

        final feedbacks = feedbackList
            .map((item) => Feedback.fromJson(item as Map<String, dynamic>))
            .toList();

        safePrint('✅ [getEventFeedbacks] Loaded ${feedbacks.length} feedbacks');
        return feedbacks;
      } else {
        safePrint(
          '⚠️ [getEventFeedbacks] Response status: ${response.statusCode}',
        );
        return [];
      }
    } catch (e) {
      safePrint('❌ [getEventFeedbacks] Error: $e');
      return [];
    }
  }
}
