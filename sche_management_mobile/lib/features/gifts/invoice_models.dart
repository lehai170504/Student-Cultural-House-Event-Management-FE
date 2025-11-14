import 'package:flutter/material.dart';
import 'package:amplify_flutter/amplify_flutter.dart';

class Invoice {
  final String id;
  final String studentId;
  final String studentName;
  final String productId;
  final String productName;
  final int pointsUsed;
  final int quantity;
  final String status;
  final DateTime createdAt;
  final String? productImageUrl;

  Invoice({
    required this.id,
    required this.studentId,
    required this.studentName,
    required this.productId,
    required this.productName,
    required this.pointsUsed,
    required this.quantity,
    required this.status,
    required this.createdAt,
    this.productImageUrl,
  });

  factory Invoice.fromJson(Map<String, dynamic> json) {
    // Debug: Print raw JSON to see what we're getting
    safePrint('🔍 [Invoice.fromJson] Raw JSON keys: ${json.keys.toList()}');
    if (json['productTitle'] != null) {
      safePrint('🔍 [Invoice.fromJson] productTitle: ${json['productTitle']}');
    }
    if (json['productName'] != null) {
      safePrint('🔍 [Invoice.fromJson] productName: ${json['productName']}');
    }
    if (json['product'] != null) {
      safePrint('🔍 [Invoice.fromJson] product: ${json['product']}');
    }

    // Handle nested product object
    final product = json['product'] as Map<String, dynamic>?;
    // Try multiple field names: productTitle (from web), productName, product.name, product.title
    final productName =
        json['productTitle'] as String? ??
        product?['title'] as String? ??
        product?['name'] as String? ??
        json['productName'] as String? ??
        product?['productName'] as String? ??
        'Sản phẩm';

    safePrint('✅ [Invoice.fromJson] Final productName: $productName');

    // Debug: Print points/cost values
    if (json['pointsUsed'] != null) {
      safePrint(
        '🔍 [Invoice.fromJson] pointsUsed: ${json['pointsUsed']} (type: ${json['pointsUsed'].runtimeType})',
      );
    }
    if (json['totalCost'] != null) {
      safePrint(
        '🔍 [Invoice.fromJson] totalCost: ${json['totalCost']} (type: ${json['totalCost'].runtimeType})',
      );
    }

    // Handle pointsUsed - could be totalCost in web app
    // Priority: totalCost (from web) > pointsUsed > unitCost * quantity > 0
    int pointsUsed = 0;
    if (json['totalCost'] != null) {
      if (json['totalCost'] is int) {
        pointsUsed = json['totalCost'] as int;
      } else if (json['totalCost'] is num) {
        pointsUsed = (json['totalCost'] as num).toInt();
      } else {
        pointsUsed = int.tryParse(json['totalCost'].toString()) ?? 0;
      }
    } else if (json['pointsUsed'] != null) {
      if (json['pointsUsed'] is int) {
        pointsUsed = json['pointsUsed'] as int;
      } else if (json['pointsUsed'] is num) {
        pointsUsed = (json['pointsUsed'] as num).toInt();
      } else {
        pointsUsed = int.tryParse(json['pointsUsed'].toString()) ?? 0;
      }
    } else if (product != null && product['unitCost'] != null) {
      // Fallback: calculate from unitCost * quantity
      final unitCost = product['unitCost'] is int
          ? product['unitCost'] as int
          : product['unitCost'] is num
          ? (product['unitCost'] as num).toInt()
          : int.tryParse(product['unitCost'].toString()) ?? 0;
      final quantity = json['quantity'] is int
          ? json['quantity'] as int
          : int.tryParse(json['quantity']?.toString() ?? '1') ?? 1;
      pointsUsed = unitCost * quantity;
      safePrint(
        '🔍 [Invoice.fromJson] Calculated from unitCost * quantity: $unitCost * $quantity = $pointsUsed',
      );
    }

    safePrint('✅ [Invoice.fromJson] Final pointsUsed: $pointsUsed');

    return Invoice(
      id: json['id']?.toString() ?? json['invoiceId']?.toString() ?? '',
      studentId: json['studentId']?.toString() ?? '',
      studentName: json['studentName']?.toString() ?? 'Người dùng ẩn danh',
      productId:
          json['productId']?.toString() ?? product?['id']?.toString() ?? '',
      productName: productName,
      pointsUsed: pointsUsed,
      quantity: json['quantity'] is int
          ? json['quantity']
          : int.tryParse(json['quantity']?.toString() ?? '1') ?? 1,
      status: json['status']?.toString() ?? 'PENDING',
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : DateTime.now(),
      productImageUrl:
          json['productImageUrl'] as String? ?? product?['imageUrl'] as String?,
    );
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

  Color get statusColor {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'SUCCESS':
        return const Color(0xFF10B981);
      case 'PENDING':
        return const Color(0xFFF59E0B);
      case 'CANCELLED':
      case 'FAILED':
        return const Color(0xFFDC2626);
      default:
        return const Color(0xFF6B7280);
    }
  }

  String get statusLabel {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'SUCCESS':
        return 'Hoàn thành';
      case 'PENDING':
        return 'Đang xử lý';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'FAILED':
        return 'Thất bại';
      default:
        return status;
    }
  }
}

class InvoiceStats {
  final int totalRedeemed;
  final int totalPointsUsed;
  final int totalInvoices;
  final Map<String, int>? topProducts;

  InvoiceStats({
    required this.totalRedeemed,
    required this.totalPointsUsed,
    required this.totalInvoices,
    this.topProducts,
  });

  factory InvoiceStats.fromJson(Map<String, dynamic> json) {
    return InvoiceStats(
      totalRedeemed: json['totalRedeemed'] is int
          ? json['totalRedeemed']
          : int.tryParse(json['totalRedeemed']?.toString() ?? '0') ?? 0,
      totalPointsUsed: json['totalPointsUsed'] is int
          ? json['totalPointsUsed']
          : int.tryParse(json['totalPointsUsed']?.toString() ?? '0') ?? 0,
      totalInvoices: json['totalInvoices'] is int
          ? json['totalInvoices']
          : int.tryParse(json['totalInvoices']?.toString() ?? '0') ?? 0,
      topProducts: json['topProducts'] as Map<String, int>?,
    );
  }
}

class RedeemRequest {
  final String productId;
  final String studentId;
  final int quantity;

  RedeemRequest({
    required this.productId,
    required this.studentId,
    this.quantity = 1,
  });

  Map<String, dynamic> toJson() {
    return {
      'productId': productId,
      'studentId': studentId,
      'quantity': quantity,
    };
  }
}

class RedeemResponse {
  final Invoice invoice;
  final int newBalance;

  RedeemResponse({required this.invoice, required this.newBalance});

  factory RedeemResponse.fromJson(Map<String, dynamic> json) {
    return RedeemResponse(
      invoice: Invoice.fromJson(json['invoice'] ?? json),
      newBalance: json['newBalance'] is int
          ? json['newBalance']
          : int.tryParse(json['newBalance']?.toString() ?? '0') ?? 0,
    );
  }
}
