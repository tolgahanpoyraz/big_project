import 'package:flutter/material.dart';

import 'api/auth_api.dart';
import 'features/auth/account_page.dart';
import 'features/auth/auth_session.dart';
import 'features/posts/feed_page.dart';

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  late final AuthSession _authSession;

  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();

    _authSession = AuthSession(AuthApi());
    _authSession.loadFromStorage();
  }

  @override
  void dispose() {
    _authSession.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final pages = [
      const FeedPage(),
      const Center(
        child: Text('Create post page goes here.'),
      ),
      AccountPage(authSession: _authSession),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: pages,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.fastfood_outlined),
            selectedIcon: Icon(Icons.fastfood),
            label: 'Food',
          ),
          NavigationDestination(
            icon: Icon(Icons.add_circle_outline),
            selectedIcon: Icon(Icons.add_circle),
            label: 'Post',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Account',
          ),
        ],
      ),
    );
  }
}