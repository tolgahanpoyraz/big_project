class FoodPost {
  final String id;
  final String foodName;
  final String location;
  final String? imageKey;
  final List<String> badges;
  final String status;
  final double? confidence;
  final int presentVotes;
  final int goneVotes;
  final DateTime? expiresAt;
  final DateTime? createdAt;

  FoodPost({
    required this.id,
    required this.foodName,
    required this.location,
    required this.imageKey,
    required this.badges,
    required this.status,
    required this.confidence,
    required this.presentVotes,
    required this.goneVotes,
    required this.expiresAt,
    required this.createdAt,
  });

  factory FoodPost.fromJson(Map<String, dynamic> json) {
    final tallies = json['tallies'] as Map<String, dynamic>?;

    return FoodPost(
      id: (json['id'] ?? json['_id'] ?? '').toString(),
      foodName: (json['foodName'] ?? '').toString(),
      location: (json['location'] ?? '').toString(),
      imageKey: json['imageKey'] as String?,
      badges: (json['badges'] as List<dynamic>? ?? [])
          .map((badge) => badge.toString())
          .toList(),
      status: (json['status'] ?? 'fresh').toString(),
      confidence: json['confidence'] is num
          ? (json['confidence'] as num).toDouble()
          : null,
      presentVotes: tallies?['present'] is num
          ? (tallies!['present'] as num).toInt()
          : 0,
      goneVotes: tallies?['gone'] is num
          ? (tallies!['gone'] as num).toInt()
          : 0,
      expiresAt: json['expiresAt'] != null
          ? DateTime.tryParse(json['expiresAt'].toString())
          : null,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString())
          : null,
    );
  }
}