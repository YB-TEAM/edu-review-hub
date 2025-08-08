import 'package:edu_review_mobile/common_libs.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({Key? key}) : super(key: key);

  @override
  _SearchScreenState createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Offset> _searchBarAnimation;
  late Animation<double> _opacityAnimation;
  late Animation<double> _borderAnimation;
  bool _isSearchActive = false;
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );

    _searchBarAnimation = Tween<Offset>(
      begin: const Offset(0, 0.2),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutCubic,
    ));

    _opacityAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeIn,
    ));

    _borderAnimation = Tween<double>(
      begin: 12.0,
      end: 50.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));

    _focusNode.addListener(() {
      if (_focusNode.hasFocus && !_isSearchActive) {
        _toggleSearch();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _searchController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _toggleSearch() {
    setState(() {
      _isSearchActive = !_isSearchActive;
      if (_isSearchActive) {
        _controller.forward();
        _focusNode.requestFocus();
      } else {
        _controller.reverse();
        _searchController.clear();
        _focusNode.unfocus();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                // Search Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                  child: SlideTransition(
                    position: _searchBarAnimation,
                    child: AnimatedBuilder(
                      animation: _borderAnimation,
                      builder: (context, child) {
                        return Container(
                          decoration: BoxDecoration(
                            color: Colors.grey[100],
                            borderRadius: BorderRadius.circular(_borderAnimation.value),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 10,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: TextField(
                            controller: _searchController,
                            focusNode: _focusNode,
                            decoration: InputDecoration(
                              hintText: 'Tìm kiếm sản phẩm, bài viết...',
                              hintStyle: TextStyle(color: Colors.grey[500]),
                              prefixIcon: Icon(
                                Icons.search,
                                color: _isSearchActive ? Colors.blue : Colors.grey[600],
                              ),
                              suffixIcon: _isSearchActive
                                  ? IconButton(
                                      icon: const Icon(Icons.clear, color: Colors.grey),
                                      onPressed: () {
                                        _searchController.clear();
                                      },
                                    )
                                  : null,
                              border: InputBorder.none,
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 16.0,
                                vertical: 14.0,
                              ),
                            ),
                            onTap: _toggleSearch,
                            onChanged: (value) {
                              setState(() {}); // Update UI when typing
                            },
                          ),
                        );
                      },
                    ),
                  ),
                ),
                // Main content
                Expanded(
                  child: AnimatedOpacity(
                    opacity: _isSearchActive ? 0.0 : 1.0,
                    duration: const Duration(milliseconds: 300),
                    child: ListView.builder(
                      padding: const EdgeInsets.all(16.0),
                      itemCount: 20,
                      itemBuilder: (context, index) {
                        return Card(
                          margin: const EdgeInsets.symmetric(vertical: 8.0),
                          elevation: 2,
                          child: ListTile(
                            title: Text('Mục ${index + 1}'),
                            subtitle: const Text('Nội dung mẫu'),
                            leading: const Icon(Icons.star_border),
                          ),
                        );
                      },
                    ),
                  ),
                ),
              ],
            ),
            // Search results screen
            if (_isSearchActive)
              SlideTransition(
                position: _searchBarAnimation,
                child: FadeTransition(
                  opacity: _opacityAnimation,
                  child: Container(
                    color: Colors.white,
                    child: Column(
                      children: [
                        const SizedBox(height: 60), // Space for search bar
                        Expanded(
                          child: ListView.builder(
                            padding: const EdgeInsets.all(16.0),
                            itemCount: 10,
                            itemBuilder: (context, index) {
                              return Card(
                                margin: const EdgeInsets.symmetric(vertical: 8.0),
                                elevation: 2,
                                child: ListTile(
                                  title: Text('Kết quả tìm kiếm ${index + 1}'),
                                  subtitle: Text('Mô tả cho "${_searchController.text}"'),
                                  leading: const Icon(Icons.search),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
      floatingActionButton: _isSearchActive
          ? FloatingActionButton(
              onPressed: _toggleSearch,
              child: const Icon(Icons.close),
              backgroundColor: Colors.blue,
              elevation: 2,
            )
          : null,
    );
  }
}