import 'package:flutter/material.dart';
import '../widgets/header.widget.dart';
import 'search.page.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    final double statusBarHeight = MediaQuery.of(context).padding.top;
    final double searchBarHeight = statusBarHeight + 8 + 44 + 16;
    return Stack(
      children: [
        ListView(
          physics: const BouncingScrollPhysics(),
          padding: EdgeInsets.zero,
          children: [
            SizedBox(height: searchBarHeight),
            Container(
              height: 180,
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.orange,
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            Container(
              height: 180,
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.green,
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            Container(
              height: 180,
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.blue,
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            Container(
              height: 180,
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.purple,
                borderRadius: BorderRadius.circular(16),
              ),
            ),
          ],
        ),
        Positioned(
          top: 0,
          left: 0,
          right: 0,
          child: HeaderWidget(
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (context) => const SearchPage()),
              );
            },
          ),
        ),
      ],
    );
  }
}
