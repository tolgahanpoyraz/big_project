import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../../api/posts_api.dart';
import '../auth/auth_session.dart';

class CreatePostPage extends StatefulWidget {
  const CreatePostPage({
    super.key,
    required this.authSession,
    required this.onRequireLogin,
    required this.onPostCreated,
  });

  final AuthSession authSession;
  final VoidCallback onRequireLogin;
  final VoidCallback onPostCreated;

  @override
  State<CreatePostPage> createState() => _CreatePostPageState();
}

class _CreatePostPageState extends State<CreatePostPage> {
  final _formKey = GlobalKey<FormState>();

  final _foodNameController = TextEditingController();
  final _locationController = TextEditingController();
  final _badgesController = TextEditingController();

  final ImagePicker _imagePicker = ImagePicker();

  XFile? _selectedImage;
  Uint8List? _selectedImageBytes;

  bool _isSubmitting = false;
  String? _error;

  @override
  void dispose() {
    _foodNameController.dispose();
    _locationController.dispose();
    _badgesController.dispose();
    super.dispose();
  }

  List<String> _parseBadges(String rawValue) {
    return rawValue
        .split(',')
        .map((badge) => badge.trim())
        .where((badge) => badge.isNotEmpty)
        .toList();
  }

  String _getImageContentType(XFile image) {
    if (image.mimeType != null && image.mimeType!.isNotEmpty) {
      return image.mimeType!;
    }

    final lowerPath = image.path.toLowerCase();

    if (lowerPath.endsWith('.png')) {
      return 'image/png';
    }

    if (lowerPath.endsWith('.webp')) {
      return 'image/webp';
    }

    if (lowerPath.endsWith('.heic') || lowerPath.endsWith('.heif')) {
      return 'image/heic';
    }

    return 'image/jpeg';
  }

  Future<void> _showPhotoOptions() async {
    if (_isSubmitting) {
      return;
    }

    await showModalBottomSheet<void>(
      context: context,
      builder: (bottomSheetContext) {
        return SafeArea(
          child: Wrap(
            children: [
              ListTile(
                leading: const Icon(Icons.camera_alt_outlined),
                title: const Text('Take photo'),
                subtitle: const Text('Use your device camera'),
                onTap: () {
                  Navigator.pop(bottomSheetContext);
                  _pickImage(ImageSource.camera);
                },
              ),
              ListTile(
                leading: const Icon(Icons.photo_library_outlined),
                title: const Text('Choose from library'),
                subtitle: const Text('Select an existing photo'),
                onTap: () {
                  Navigator.pop(bottomSheetContext);
                  _pickImage(ImageSource.gallery);
                },
              ),
              ListTile(
                leading: const Icon(Icons.close),
                title: const Text('Cancel'),
                onTap: () {
                  Navigator.pop(bottomSheetContext);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final image = await _imagePicker.pickImage(
        source: source,
        imageQuality: 75,
        maxWidth: 1400,
      );

      if (image == null) {
        return;
      }

      final bytes = await image.readAsBytes();

      if (!mounted) return;

      setState(() {
        _selectedImage = image;
        _selectedImageBytes = bytes;
        _error = null;
      });
    } catch (_) {
      if (!mounted) return;

      setState(() {
        _error = source == ImageSource.camera
            ? 'Could not take the photo.'
            : 'Could not select the photo.';
      });
    }
  }

  void _removeImage() {
    setState(() {
      _selectedImage = null;
      _selectedImageBytes = null;
      _error = null;
    });
  }

  Future<void> _submitPost() async {
    if (!widget.authSession.isLoggedIn) {
      widget.onRequireLogin();
      return;
    }

    if (!_formKey.currentState!.validate()) {
      return;
    }

    final token = widget.authSession.token;

    if (token == null || token.isEmpty) {
      widget.onRequireLogin();
      return;
    }

    setState(() {
      _isSubmitting = true;
      _error = null;
    });

    try {
      String? imageKey;

      if (_selectedImage != null && _selectedImageBytes != null) {
        imageKey = await PostsApi.uploadImageBytes(
          token: token,
          bytes: _selectedImageBytes!,
          contentType: _getImageContentType(_selectedImage!),
        );
      }

      await PostsApi.createPost(
        token: token,
        foodName: _foodNameController.text,
        location: _locationController.text,
        badges: _parseBadges(_badgesController.text),
        imageKey: imageKey,
      );

      _foodNameController.clear();
      _locationController.clear();
      _badgesController.clear();

      if (!mounted) return;

      setState(() {
        _selectedImage = null;
        _selectedImageBytes = null;
      });

      widget.onPostCreated();
    } on PostsApiException catch (error) {
      if (!mounted) return;

      setState(() {
        _error = error.message;
      });
    } catch (_) {
      if (!mounted) return;

      setState(() {
        _error = 'Could not create the food post. Please try again.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.authSession.isLoggedIn) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Create Food Post'),
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.lock_outline,
                  size: 48,
                ),
                const SizedBox(height: 16),
                const Text(
                  'Log in to create a post',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'You can browse food posts without an account, but you need to log in before posting.',
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                FilledButton(
                  onPressed: widget.onRequireLogin,
                  child: const Text('Log in or sign up'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Food Post'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _foodNameController,
                textInputAction: TextInputAction.next,
                decoration: const InputDecoration(
                  labelText: 'Food name',
                  hintText: 'Pizza, donuts, sandwiches...',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Food name is required';
                  }

                  return null;
                },
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _locationController,
                textInputAction: TextInputAction.next,
                decoration: const InputDecoration(
                  labelText: 'Location',
                  hintText: 'HEC 101, Library lobby...',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Location is required';
                  }

                  return null;
                },
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _badgesController,
                textInputAction: TextInputAction.done,
                decoration: const InputDecoration(
                  labelText: 'Badges',
                  hintText: 'pizza, dessert, vegan',
                  helperText: 'Separate badges with commas',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: _isSubmitting ? null : _showPhotoOptions,
                icon: const Icon(Icons.add_photo_alternate_outlined),
                label: Text(
                  _selectedImage == null ? 'Add photo' : 'Change photo',
                ),
              ),
              if (_selectedImageBytes != null) ...[
                const SizedBox(height: 12),
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.memory(
                    _selectedImageBytes!,
                    height: 220,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(height: 4),
                TextButton.icon(
                  onPressed: _isSubmitting ? null : _removeImage,
                  icon: const Icon(Icons.delete_outline),
                  label: const Text('Remove photo'),
                ),
              ],
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: _isSubmitting ? null : _submitPost,
                icon: _isSubmitting
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                        ),
                      )
                    : const Icon(Icons.add),
                label: Text(
                  _isSubmitting ? 'Posting...' : 'Post food',
                ),
              ),
              if (_error != null) ...[
                const SizedBox(height: 16),
                Text(
                  _error!,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.error,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
