import 'package:flutter/material.dart';

import '../../api/auth_api.dart';
import 'auth_session.dart';

class AccountPage extends StatefulWidget {
  const AccountPage({
    super.key,
    required this.authSession,
  });

  final AuthSession authSession;

  @override
  State<AccountPage> createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _isLoginMode = true;
  String? _message;
  String? _error;

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() {
      _message = null;
      _error = null;
    });

    try {
      if (_isLoginMode) {
        await widget.authSession.login(
          email: _emailController.text,
          password: _passwordController.text,
        );

        setState(() {
          _message = 'Logged in successfully.';
        });
      } else {
        final message = await widget.authSession.register(
          firstName: _firstNameController.text,
          lastName: _lastNameController.text,
          email: _emailController.text,
          password: _passwordController.text,
        );

        setState(() {
          _message = message;
          _isLoginMode = true;
        });
      }
    } on AuthApiException catch (error) {
      setState(() {
        _error = error.message;
      });
    } catch (error) {
      setState(() {
        _error = 'Something went wrong. Please try again.';
      });
    }
  }

  Future<void> _resendVerification() async {
    setState(() {
      _message = null;
      _error = null;
    });

    try {
      final message = await widget.authSession.resendVerification(
        email: _emailController.text,
      );

      setState(() {
        _message = message;
      });
    } on AuthApiException catch (error) {
      setState(() {
        _error = error.message;
      });
    } catch (_) {
      setState(() {
        _error = 'Could not resend verification email.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: widget.authSession,
      builder: (context, _) {
        final user = widget.authSession.user;

        if (widget.authSession.isLoggedIn && user != null) {
          return Scaffold(
            appBar: AppBar(
              title: const Text('Account'),
            ),
            body: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Signed in as',
                    style: Theme.of(context).textTheme.labelLarge,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    user['displayName']?.toString() ?? user['email']?.toString() ?? 'User',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 4),
                  Text(user['email']?.toString() ?? ''),
                  const SizedBox(height: 24),
                  FilledButton(
                    onPressed: widget.authSession.isLoading
                        ? null
                        : widget.authSession.logout,
                    child: const Text('Log out'),
                  ),
                ],
              ),
            ),
          );
        }

        return Scaffold(
          appBar: AppBar(
            title: Text(_isLoginMode ? 'Log In' : 'Sign Up'),
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                if (!_isLoginMode) ...[
                  TextField(
                    controller: _firstNameController,
                    textInputAction: TextInputAction.next,
                    decoration: const InputDecoration(
                      labelText: 'First name',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _lastNameController,
                    textInputAction: TextInputAction.next,
                    decoration: const InputDecoration(
                      labelText: 'Last name',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 12),
                ],
                TextField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  textInputAction: TextInputAction.next,
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _passwordController,
                  obscureText: true,
                  onSubmitted: (_) => _submit(),
                  decoration: const InputDecoration(
                    labelText: 'Password',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                FilledButton(
                  onPressed: widget.authSession.isLoading ? null : _submit,
                  child: widget.authSession.isLoading
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : Text(_isLoginMode ? 'Log In' : 'Sign Up'),
                ),
                const SizedBox(height: 8),
                TextButton(
                  onPressed: widget.authSession.isLoading
                      ? null
                      : () {
                          setState(() {
                            _isLoginMode = !_isLoginMode;
                            _message = null;
                            _error = null;
                          });
                        },
                  child: Text(
                    _isLoginMode
                        ? 'Need an account? Sign up'
                        : 'Already have an account? Log in',
                  ),
                ),
                if (_isLoginMode)
                  TextButton(
                    onPressed: widget.authSession.isLoading
                        ? null
                        : _resendVerification,
                    child: const Text('Resend verification email'),
                  ),
                if (_message != null) ...[
                  const SizedBox(height: 16),
                  Text(
                    _message!,
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                ],
                if (_error != null) ...[
                  const SizedBox(height: 16),
                  Text(
                    _error!,
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.error,
                    ),
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }
}