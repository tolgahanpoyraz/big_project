import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/food_post.dart';
import 'api_config.dart';

class PostsApiException implements Exception {
  PostsApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  @override
  String toString() => message;
}

class PostsApi {
  static Future<List<FoodPost>> getFeed() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/posts'),
      headers: {
        'Content-Type': 'application/json',
      },
    );

    final data = _decodeResponse(response);
    final postsJson = data['posts'] as List<dynamic>? ?? [];

    return postsJson
        .map((postJson) => FoodPost.fromJson(postJson as Map<String, dynamic>))
        .toList();
  }

  static Future<FoodPost> createPost({
    required String token,
    required String foodName,
    required String location,
    required List<String> badges,
    String? imageKey,
  }) async {
    final body = <String, dynamic>{
      'foodName': foodName.trim(),
      'location': location.trim(),
      'badges': badges,
    };

    if (imageKey != null && imageKey.isNotEmpty) {
      body['imageKey'] = imageKey;
    }

    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/posts'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(body),
    );

    final data = _decodeResponse(response);
    final postJson = data['post'] as Map<String, dynamic>;

    return FoodPost.fromJson(postJson);
  }

  static Future<void> votePost({
    required String token,
    required String postId,
    required String type,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/posts/$postId/vote'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'type': type,
      }),
    );

    _decodeResponse(response);
  }

  static Future<Map<String, String>> getUploadUrl({
    required String token,
  }) async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/posts/upload-url'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    final data = _decodeResponse(response);

    return {
      'url': data['url'].toString(),
      'key': data['key'].toString(),
    };
  }

  static Future<String> uploadImageBytes({
    required String token,
    required List<int> bytes,
    required String contentType,
  }) async {
    final uploadData = await getUploadUrl(token: token);

    final uploadUrl = uploadData['url']!;
    final imageKey = uploadData['key']!;

    final uploadResponse = await http.put(
      Uri.parse(uploadUrl),
      headers: {
        'Content-Type': contentType,
      },
      body: bytes,
    );

    if (uploadResponse.statusCode < 200 || uploadResponse.statusCode >= 300) {
      throw PostsApiException(
        'Image upload failed',
        statusCode: uploadResponse.statusCode,
      );
    }

    return imageKey;
  }

  static Map<String, dynamic> _decodeResponse(http.Response response) {
    final data = response.body.isNotEmpty
        ? jsonDecode(response.body) as Map<String, dynamic>
        : <String, dynamic>{};

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw PostsApiException(
        data['error']?.toString() ?? 'Request failed',
        statusCode: response.statusCode,
      );
    }

    return data;
  }
}