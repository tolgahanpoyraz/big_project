import 'package:flutter/material.dart';

import '../../models/food_post.dart';
import '../../theme/app_theme.dart';
import '../../theme/freshness.dart';
import 'post_format.dart';
import 'post_widgets.dart';

/// Compact "Hot & fresh right now" list row: thumbnail, status badge, title,
/// "location · time" meta, chevron. Tapping opens the detail sheet — voting
/// lives there, not on the row.
class PostRow extends StatelessWidget {
  const PostRow({
    super.key,
    required this.post,
    required this.onTap,
  });

  final FoodPost post;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final freshness = FreshnessStatus.fromApi(post.status);
    final imageUrl = PostFormat.imageUrl(post.imageKey);

    return Semantics(
      button: true,
      label: '${post.foodName}, ${freshness.label}',
      child: Material(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(18),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(18),
          child: Container(
            padding: const EdgeInsets.all(11),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                PostThumbnail(
                  imageUrl: imageUrl,
                  width: 60,
                  height: 60,
                  radius: 13,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Align(
                        alignment: Alignment.centerLeft,
                        child: StatusBadge(status: freshness, fontSize: 10),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        post.foodName,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 3),
                      Text(
                        _meta(post),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: AppColors.textMuted,
                          fontSize: 11.5,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 6),
                const Icon(
                  Icons.chevron_right_rounded,
                  color: AppColors.chevron,
                  size: 22,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // Distance is intentionally omitted — no geolocation plumbing exists yet.
  String _meta(FoodPost post) {
    return [
      PostFormat.locationName(post),
      PostFormat.relativeTime(post.createdAt),
    ].join(' · ');
  }
}
