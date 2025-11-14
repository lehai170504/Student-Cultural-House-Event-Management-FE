// Feedback models for the mobile app
import 'package:flutter/material.dart';

class Feedback {
  final String id;
  final String studentId;
  final String studentName;
  final String eventId;
  final String eventTitle;
  final int rating;
  final String comments;
  final String sentimentLabel;
  final DateTime createdAt;

  Feedback({
    required this.id,
    required this.studentId,
    required this.studentName,
    required this.eventId,
    required this.eventTitle,
    required this.rating,
    required this.comments,
    required this.sentimentLabel,
    required this.createdAt,
  });

  factory Feedback.fromJson(Map<String, dynamic> json) {
    return Feedback(
      id: json['id']?.toString() ?? '',
      studentId: json['studentId']?.toString() ?? '',
      studentName: json['studentName']?.toString() ?? 'Người dùng ẩn danh',
      eventId: json['eventId']?.toString() ?? '',
      eventTitle: json['eventTitle']?.toString() ?? '',
      rating: json['rating'] is int
          ? json['rating']
          : int.tryParse(json['rating']?.toString() ?? '0') ?? 0,
      comments: json['comments']?.toString() ?? '',
      sentimentLabel: json['sentimentLabel']?.toString() ?? 'NEUTRAL',
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'studentId': studentId,
      'studentName': studentName,
      'eventId': eventId,
      'eventTitle': eventTitle,
      'rating': rating,
      'comments': comments,
      'sentimentLabel': sentimentLabel,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  String get formattedDate {
    final local = createdAt.toLocal();
    final day = local.day.toString().padLeft(2, '0');
    final month = local.month.toString().padLeft(2, '0');
    final year = local.year;
    final hour = local.hour.toString().padLeft(2, '0');
    final minute = local.minute.toString().padLeft(2, '0');
    return '$day/$month/$year $hour:$minute';
  }

  Color get sentimentColor {
    switch (sentimentLabel.toUpperCase()) {
      case 'POSITIVE':
        return const Color(0xFF10B981);
      case 'NEGATIVE':
        return const Color(0xFFDC2626);
      default:
        return const Color(0xFF6B7280);
    }
  }
}

class FeedbackMeta {
  final int currentPage;
  final int pageSize;
  final int totalPages;
  final int totalItems;

  FeedbackMeta({
    required this.currentPage,
    required this.pageSize,
    required this.totalPages,
    required this.totalItems,
  });

  factory FeedbackMeta.fromJson(Map<String, dynamic> json) {
    return FeedbackMeta(
      currentPage: json['currentPage'] is int
          ? json['currentPage']
          : int.tryParse(json['currentPage']?.toString() ?? '1') ?? 1,
      pageSize: json['pageSize'] is int
          ? json['pageSize']
          : int.tryParse(json['pageSize']?.toString() ?? '10') ?? 10,
      totalPages: json['totalPages'] is int
          ? json['totalPages']
          : int.tryParse(json['totalPages']?.toString() ?? '1') ?? 1,
      totalItems: json['totalItems'] is int
          ? json['totalItems']
          : int.tryParse(json['totalItems']?.toString() ?? '0') ?? 0,
    );
  }
}

class FeedbackResponse {
  final List<Feedback> data;
  final FeedbackMeta meta;

  FeedbackResponse({required this.data, required this.meta});

  factory FeedbackResponse.fromJson(Map<String, dynamic> json) {
    final dataList = json['data'] ?? [];
    final metaData = json['meta'] ?? {};

    return FeedbackResponse(
      data: (dataList as List)
          .map((item) => Feedback.fromJson(item as Map<String, dynamic>))
          .toList(),
      meta: FeedbackMeta.fromJson(metaData as Map<String, dynamic>),
    );
  }
}
