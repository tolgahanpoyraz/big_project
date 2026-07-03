import 'package:flutter/material.dart';

import '../../api/api_config.dart';
import '../../models/food_post.dart';

class PostCard extends StatelessWidget {
  final FoodPost post;

  const PostCard({
    super.key,
    required this.post,
  });

  String? get imageUrl {
    if (post.imageKey == null || post.imageKey!.isEmpty) {
      return null;
    }

    return '${ApiConfig.imageBaseUrl}${post.imageKey}';
  }

  @override
  Widget build(BuildContext context) {
    final confidencePercent = post.confidence == null
        ? null
        : (post.confidence! * 100).round();

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (imageUrl != null)
            AspectRatio(
              aspectRatio: 16 / 9,
              child: Image.network(
                imageUrl!,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    color: Colors.grey.shade200,
                    alignment: Alignment.center,
                    child: const Icon(Icons.image_not_supported_outlined),
                  );
                },
              ),
            ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  post.foodName,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),

                const SizedBox(height: 6),

                Row(
                  children: [
                    const Icon(Icons.location_on_outlined, size: 18),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        post.location,
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 12),

                if (post.badges.isNotEmpty)
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: post.badges.map((badge) {
                      return Chip(
                        label: Text(badge),
                        visualDensity: VisualDensity.compact,
                      );
                    }).toList(),
                  ),

                const SizedBox(height: 12),

                Row(
                  children: [
                    _StatPill(
                      icon: Icons.thumb_up_alt_outlined,
                      label: '${post.presentVotes} still there',
                    ),
                    const SizedBox(width: 8),
                    _StatPill(
                      icon: Icons.thumb_down_alt_outlined,
                      label: '${post.goneVotes} gone',
                    ),
                  ],
                ),

                const SizedBox(height: 12),

                Row(
                  children: [
                    _StatusPill(status: post.status),
                    if (confidencePercent != null) ...[
                      const SizedBox(width: 8),
                      Text(
                        '$confidencePercent% confidence',
                        style: TextStyle(color: Colors.grey.shade700),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StatPill extends StatelessWidget {
  final IconData icon;
  final String label;

  const _StatPill({
    required this.icon,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        children: [
          Icon(icon, size: 16),
          const SizedBox(width: 4),
          Text(label),
        ],
      ),
    );
  }
}

class _StatusPill extends StatelessWidget {
  final String status;

  const _StatusPill({
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    final label = switch (status) {
      'fresh' => 'Fresh',
      'likely' => 'Likely there',
      'fading' => 'Fading',
      'gone' => 'Gone',
      _ => status,
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.green.shade50,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: Colors.green.shade200),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: Colors.green.shade900,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}