import 'dart:convert';
import 'package:http/http.dart' as http;

import '../models/food_post.dart';
import 'api_config.dart';

class PostsApi {
  static Future<List<FoodPost>> getFeed() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/posts'),
      headers: {
        'Content-Type': 'application/json',
      },
    );

    final data = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(data['error'] ?? 'Failed to load food posts');
    }

    final postsJson = data['posts'] as List<dynamic>? ?? [];

    return postsJson
        .map((postJson) => FoodPost.fromJson(postJson as Map<String, dynamic>))
        .toList();
  }
}