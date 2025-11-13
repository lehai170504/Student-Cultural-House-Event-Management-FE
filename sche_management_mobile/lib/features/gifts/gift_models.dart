import 'package:flutter/material.dart';

class Gift {
  final String id;
  final String name;
  final String? description;
  final int requiredPoints;
  final String? imageUrl;
  final int quantity;
  final String? category;
  final DateTime? createdAt;

  Gift({
    required this.id,
    required this.name,
    this.description,
    required this.requiredPoints,
    this.imageUrl,
    required this.quantity,
    this.category,
    this.createdAt,
  });

  factory Gift.fromJson(Map<String, dynamic> json) {
    final pointsValue =
        (json['requiredPoints'] ??
                json['pointCost'] ??
                json['points'] ??
                json['unitCost'])
            as num?;
    final quantityValue =
        (json['stock'] ?? json['quantity'] ?? json['totalStock']) as num?;
    final rawCategory =
        json['category']?['name'] ??
        json['categoryName'] ??
        json['type'] ??
        json['category'];

    return Gift(
      id: (json['id'] ?? json['giftId']).toString(),
      name: (json['name'] ?? json['title'] ?? 'Quà tặng') as String,
      description: (json['description'] ?? json['summary']) as String?,
      requiredPoints: pointsValue?.toInt() ?? 0,
      imageUrl: json['imageUrl'] as String? ?? json['thumbnailUrl'] as String?,
      quantity: quantityValue?.toInt() ?? 0,
      category: rawCategory?.toString(),
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String)
          : null,
    );
  }

  bool get inStock => quantity > 0;

  Color get availabilityColor {
    if (!inStock) return const Color(0xFFDC2626);
    if (quantity < 5) return const Color(0xFFF59E0B);
    return const Color(0xFF10B981);
  }

  String get categoryLabel {
    switch ((category ?? '').toUpperCase()) {
      case 'VOUCHER':
        return 'Voucher';
      case 'GIFT':
        return 'Quà tặng';
      default:
        return category ?? 'Quà tặng';
    }
  }
}
