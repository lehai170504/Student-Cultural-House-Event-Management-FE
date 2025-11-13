class NotificationMessage {
  final String deliveryId;
  final String messageContent;
  final String sentAt;
  final String status; // "UNREAD" | "READ" | "DELIVERED"
  final String? eventId;
  final String? eventTitle;

  NotificationMessage({
    required this.deliveryId,
    required this.messageContent,
    required this.sentAt,
    required this.status,
    this.eventId,
    this.eventTitle,
  });

  factory NotificationMessage.fromJson(Map<String, dynamic> json) {
    return NotificationMessage(
      deliveryId: json['deliveryId'] as String? ?? '',
      messageContent: json['messageContent'] as String? ?? '',
      sentAt: json['sentAt'] as String? ?? '',
      status: json['status'] as String? ?? 'UNREAD',
      eventId: json['eventId'] as String?,
      eventTitle: json['eventTitle'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'deliveryId': deliveryId,
      'messageContent': messageContent,
      'sentAt': sentAt,
      'status': status,
      'eventId': eventId,
      'eventTitle': eventTitle,
    };
  }

  bool get isUnread => status.toUpperCase() == 'UNREAD';
}

class UnreadCountResponse {
  final int count;

  UnreadCountResponse({required this.count});

  factory UnreadCountResponse.fromJson(Map<String, dynamic> json) {
    return UnreadCountResponse(
      count: json['count'] as int? ?? 0,
    );
  }
}

