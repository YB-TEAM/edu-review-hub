# 📱 Mobile App Documentation

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Core Features](#core-features)
- [Screen Components](#screen-components)
- [Widgets](#widgets)
- [State Management](#state-management)
- [Services](#services)
- [Navigation](#navigation)
- [API Integration](#api-integration)
- [Authentication Flow](#authentication-flow)
- [Utilities](#utilities)
- [Best Practices](#best-practices)
- [Setup and Development](#setup-and-development)

## Overview

The mobile application is built with **Flutter 3.x** using **Dart**, implementing a clean architecture pattern with **BLoC** for state management. The app provides a native mobile experience for the Edu Review Hub platform.

### Tech Stack
- **Framework**: Flutter 3.x
- **Language**: Dart
- **State Management**: BLoC/Cubit
- **Navigation**: Go Router / Named Routes
- **Dependency Injection**: GetIt
- **HTTP Client**: Dio
- **Local Storage**: Shared Preferences / Hive
- **Image Handling**: Cached Network Image
- **Animations**: Flutter built-in animations

---

## Project Structure

```
mobile/edu_review_mobile/lib/
├── common/                 # Shared components and utilities
│   ├── bloc/              # Global BLoC states
│   ├── widgets/           # Reusable widgets
│   ├── utils/             # Utility functions
│   └── constants/         # App constants
├── core/                   # Core functionality
│   ├── network/           # API client and interceptors
│   ├── storage/           # Local storage services
│   ├── theme/             # App theming
│   └── error/             # Error handling
├── features/              # Feature modules
│   ├── auth/              # Authentication feature
│   │   ├── data/          # Data layer (repositories, models)
│   │   ├── domain/        # Domain layer (entities, use cases)
│   │   └── presentation/  # Presentation layer (screens, widgets, BLoC)
│   ├── dashboard/         # Dashboard feature
│   ├── user_profile/      # User profile feature
│   ├── blog/              # Blog feature
│   └── settings/          # Settings feature
├── main.dart              # App entry point
├── service_locator.dart   # Dependency injection setup
└── common_libs.dart       # Common imports
```

---

## Architecture

The app follows **Clean Architecture** principles with clear separation of concerns:

### Layers

1. **Presentation Layer**
   - Screens (Pages)
   - Widgets (UI Components)
   - BLoC/Cubit (State Management)

2. **Domain Layer**
   - Entities (Business Models)
   - Use Cases (Business Logic)
   - Repository Interfaces

3. **Data Layer**
   - Repository Implementations
   - Data Sources (Remote API, Local Storage)
   - Models (Data Transfer Objects)

### Dependency Flow
```
Presentation → Domain ← Data
```

---

## Core Features

### Authentication Module

**Location**: `lib/features/auth/`

#### Auth Screens

```dart
// presentation/pages/sign_in_page.dart
class SignInPage extends StatelessWidget {
  const SignInPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => sl<AuthCubit>(),
      child: const SignInView(),
    );
  }
}

class SignInView extends StatefulWidget {
  const SignInView({Key? key}) : super(key: key);

  @override
  State<SignInView> createState() => _SignInViewState();
}

class _SignInViewState extends State<SignInView> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sign In'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: BlocConsumer<AuthCubit, AuthState>(
        listener: (context, state) {
          if (state is AuthError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message)),
            );
          } else if (state is Authenticated) {
            Navigator.of(context).pushReplacementNamed('/dashboard');
          }
        },
        builder: (context, state) {
          return SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _buildHeader(),
                    const SizedBox(height: 32),
                    _buildEmailField(),
                    const SizedBox(height: 16),
                    _buildPasswordField(),
                    const SizedBox(height: 24),
                    _buildSignInButton(state),
                    const SizedBox(height: 16),
                    _buildSignUpLink(),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      children: [
        Icon(
          Icons.school,
          size: 64,
          color: Theme.of(context).primaryColor,
        ),
        const SizedBox(height: 16),
        Text(
          'Welcome Back!',
          style: Theme.of(context).textTheme.headlineMedium,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        Text(
          'Sign in to continue to Edu Review Hub',
          style: Theme.of(context).textTheme.bodyMedium,
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildEmailField() {
    return TextFormField(
      controller: _emailController,
      decoration: const InputDecoration(
        labelText: 'Email or Username',
        prefixIcon: Icon(Icons.person),
        border: OutlineInputBorder(),
      ),
      keyboardType: TextInputType.emailAddress,
      validator: (value) {
        if (value?.isEmpty ?? true) {
          return 'Please enter your email or username';
        }
        return null;
      },
    );
  }

  Widget _buildPasswordField() {
    return TextFormField(
      controller: _passwordController,
      decoration: const InputDecoration(
        labelText: 'Password',
        prefixIcon: Icon(Icons.lock),
        border: OutlineInputBorder(),
      ),
      obscureText: true,
      validator: (value) {
        if (value?.isEmpty ?? true) {
          return 'Please enter your password';
        }
        return null;
      },
    );
  }

  Widget _buildSignInButton(AuthState state) {
    return ElevatedButton(
      onPressed: state is AuthLoading ? null : _handleSignIn,
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      child: state is AuthLoading
          ? const CircularProgressIndicator(color: Colors.white)
          : const Text('Sign In'),
    );
  }

  Widget _buildSignUpLink() {
    return TextButton(
      onPressed: () => Navigator.of(context).pushNamed('/sign-up'),
      child: const Text("Don't have an account? Sign up"),
    );
  }

  void _handleSignIn() {
    if (_formKey.currentState?.validate() ?? false) {
      context.read<AuthCubit>().signIn(
        identifier: _emailController.text.trim(),
        password: _passwordController.text,
      );
    }
  }
}
```

#### Auth BLoC/Cubit

```dart
// presentation/cubit/auth_cubit.dart
class AuthCubit extends Cubit<AuthState> {
  final SignInUseCase _signInUseCase;
  final SignUpUseCase _signUpUseCase;
  final SignOutUseCase _signOutUseCase;
  final GetCurrentUserUseCase _getCurrentUserUseCase;

  AuthCubit({
    required SignInUseCase signInUseCase,
    required SignUpUseCase signUpUseCase,
    required SignOutUseCase signOutUseCase,
    required GetCurrentUserUseCase getCurrentUserUseCase,
  })  : _signInUseCase = signInUseCase,
        _signUpUseCase = signUpUseCase,
        _signOutUseCase = signOutUseCase,
        _getCurrentUserUseCase = getCurrentUserUseCase,
        super(AuthInitial());

  Future<void> checkAuthStatus() async {
    emit(AuthLoading());
    
    try {
      final result = await _getCurrentUserUseCase();
      result.fold(
        (failure) => emit(UnAuthenticated()),
        (user) => emit(Authenticated(user: user)),
      );
    } catch (e) {
      emit(UnAuthenticated());
    }
  }

  Future<void> signIn({
    required String identifier,
    required String password,
  }) async {
    emit(AuthLoading());
    
    try {
      final result = await _signInUseCase(SignInParams(
        identifier: identifier,
        password: password,
      ));
      
      result.fold(
        (failure) => emit(AuthError(message: failure.message)),
        (authResponse) => emit(Authenticated(user: authResponse.user)),
      );
    } catch (e) {
      emit(AuthError(message: 'An unexpected error occurred'));
    }
  }

  Future<void> signUp({
    required String username,
    required String email,
    required String password,
    String? phone,
  }) async {
    emit(AuthLoading());
    
    try {
      final result = await _signUpUseCase(SignUpParams(
        username: username,
        email: email,
        password: password,
        phone: phone,
      ));
      
      result.fold(
        (failure) => emit(AuthError(message: failure.message)),
        (authResponse) => emit(Authenticated(user: authResponse.user)),
      );
    } catch (e) {
      emit(AuthError(message: 'An unexpected error occurred'));
    }
  }

  Future<void> signOut() async {
    try {
      await _signOutUseCase();
      emit(UnAuthenticated());
    } catch (e) {
      emit(AuthError(message: 'Failed to sign out'));
    }
  }
}
```

#### Auth States

```dart
// presentation/cubit/auth_state.dart
abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object> get props => [];
}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class Authenticated extends AuthState {
  final User user;

  const Authenticated({required this.user});

  @override
  List<Object> get props => [user];
}

class UnAuthenticated extends AuthState {}

class AuthError extends AuthState {
  final String message;

  const AuthError({required this.message});

  @override
  List<Object> get props => [message];
}
```

---

## Screen Components

### Main Screen (Tab Navigation)

**Location**: `lib/features/main_screen.dart`

```dart
class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  late PageController _pageController;

  final List<Widget> _screens = [
    const DashboardScreen(),
    const UniversitiesScreen(),
    const ReviewsScreen(),
    const BlogScreen(),
    const ProfileScreen(),
  ];

  final List<BottomNavigationBarItem> _bottomNavItems = [
    const BottomNavigationBarItem(
      icon: Icon(Icons.dashboard),
      label: 'Dashboard',
    ),
    const BottomNavigationBarItem(
      icon: Icon(Icons.school),
      label: 'Universities',
    ),
    const BottomNavigationBarItem(
      icon: Icon(Icons.rate_review),
      label: 'Reviews',
    ),
    const BottomNavigationBarItem(
      icon: Icon(Icons.article),
      label: 'Blog',
    ),
    const BottomNavigationBarItem(
      icon: Icon(Icons.person),
      label: 'Profile',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        controller: _pageController,
        onPageChanged: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        children: _screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _onTabTapped,
        type: BottomNavigationBarType.fixed,
        items: _bottomNavItems,
        selectedItemColor: Theme.of(context).primaryColor,
        unselectedItemColor: Colors.grey,
      ),
    );
  }

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }
}
```

### Dashboard Screen

```dart
// features/dashboard/presentation/pages/dashboard_screen.dart
class DashboardScreen extends StatelessWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () => _showNotifications(context),
          ),
        ],
      ),
      body: const DashboardView(),
    );
  }

  void _showNotifications(BuildContext context) {
    // Handle notifications
  }
}

class DashboardView extends StatelessWidget {
  const DashboardView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildWelcomeCard(context),
          const SizedBox(height: 16),
          _buildQuickActions(context),
          const SizedBox(height: 16),
          _buildRecentActivity(context),
          const SizedBox(height: 16),
          _buildRecommendations(context),
        ],
      ),
    );
  }

  Widget _buildWelcomeCard(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Welcome back!',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'Discover and review universities to help others make informed decisions.',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Actions',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildActionCard(
                context,
                icon: Icons.add_circle,
                title: 'Write Review',
                subtitle: 'Share your experience',
                onTap: () => Navigator.pushNamed(context, '/write-review'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildActionCard(
                context,
                icon: Icons.search,
                title: 'Find University',
                subtitle: 'Explore options',
                onTap: () => Navigator.pushNamed(context, '/search'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Icon(
                icon,
                size: 32,
                color: Theme.of(context).primaryColor,
              ),
              const SizedBox(height: 8),
              Text(
                title,
                style: Theme.of(context).textTheme.titleMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: Theme.of(context).textTheme.bodySmall,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRecentActivity(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Recent Activity',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            TextButton(
              onPressed: () => Navigator.pushNamed(context, '/activity'),
              child: const Text('View All'),
            ),
          ],
        ),
        const SizedBox(height: 12),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: 3,
          itemBuilder: (context, index) {
            return _buildActivityItem(context, index);
          },
        ),
      ],
    );
  }

  Widget _buildActivityItem(BuildContext context, int index) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Theme.of(context).primaryColor,
          child: const Icon(Icons.rate_review, color: Colors.white),
        ),
        title: const Text('You reviewed MIT'),
        subtitle: const Text('2 hours ago'),
        trailing: const Icon(Icons.chevron_right),
        onTap: () {
          // Navigate to review details
        },
      ),
    );
  }

  Widget _buildRecommendations(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Recommended Universities',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 200,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: 5,
            itemBuilder: (context, index) {
              return _buildUniversityCard(context, index);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildUniversityCard(BuildContext context, int index) {
    return Container(
      width: 160,
      margin: const EdgeInsets.only(right: 12),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.school, size: 40),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'University ${index + 1}',
                style: Theme.of(context).textTheme.titleSmall,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.star, size: 16, color: Colors.amber),
                  const SizedBox(width: 4),
                  Text(
                    '4.${index + 5}',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

---

## Widgets

### Custom Widgets

#### Loading Widget

```dart
// common/widgets/loading_widget.dart
class LoadingWidget extends StatelessWidget {
  final String? message;
  final double? size;

  const LoadingWidget({
    Key? key,
    this.message,
    this.size,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            width: size ?? 50,
            height: size ?? 50,
            child: CircularProgressIndicator(
              strokeWidth: 3,
              valueColor: AlwaysStoppedAnimation<Color>(
                Theme.of(context).primaryColor,
              ),
            ),
          ),
          if (message != null) ...[
            const SizedBox(height: 16),
            Text(
              message!,
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
          ],
        ],
      ),
    );
  }
}
```

#### Error Widget

```dart
// common/widgets/error_widget.dart
class CustomErrorWidget extends StatelessWidget {
  final String message;
  final String? actionText;
  final VoidCallback? onAction;
  final IconData? icon;

  const CustomErrorWidget({
    Key? key,
    required this.message,
    this.actionText,
    this.onAction,
    this.icon,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon ?? Icons.error_outline,
              size: 64,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 16),
            Text(
              message,
              style: Theme.of(context).textTheme.titleMedium,
              textAlign: TextAlign.center,
            ),
            if (actionText != null && onAction != null) ...[
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: onAction,
                child: Text(actionText!),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
```

#### Custom Input Field

```dart
// common/widgets/custom_input_field.dart
class CustomInputField extends StatefulWidget {
  final String? label;
  final String? hint;
  final IconData? prefixIcon;
  final bool obscureText;
  final TextInputType keyboardType;
  final String? Function(String?)? validator;
  final void Function(String)? onChanged;
  final TextEditingController? controller;
  final bool enabled;
  final int? maxLines;

  const CustomInputField({
    Key? key,
    this.label,
    this.hint,
    this.prefixIcon,
    this.obscureText = false,
    this.keyboardType = TextInputType.text,
    this.validator,
    this.onChanged,
    this.controller,
    this.enabled = true,
    this.maxLines = 1,
  }) : super(key: key);

  @override
  State<CustomInputField> createState() => _CustomInputFieldState();
}

class _CustomInputFieldState extends State<CustomInputField> {
  bool _isObscured = true;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: Theme.of(context).textTheme.titleSmall,
          ),
          const SizedBox(height: 8),
        ],
        TextFormField(
          controller: widget.controller,
          validator: widget.validator,
          onChanged: widget.onChanged,
          obscureText: widget.obscureText ? _isObscured : false,
          keyboardType: widget.keyboardType,
          enabled: widget.enabled,
          maxLines: widget.obscureText ? 1 : widget.maxLines,
          decoration: InputDecoration(
            hintText: widget.hint,
            prefixIcon: widget.prefixIcon != null
                ? Icon(widget.prefixIcon)
                : null,
            suffixIcon: widget.obscureText
                ? IconButton(
                    icon: Icon(
                      _isObscured ? Icons.visibility : Icons.visibility_off,
                    ),
                    onPressed: () {
                      setState(() {
                        _isObscured = !_isObscured;
                      });
                    },
                  )
                : null,
            border: const OutlineInputBorder(),
            enabledBorder: OutlineInputBorder(
              borderSide: BorderSide(color: Colors.grey[300]!),
            ),
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(color: Theme.of(context).primaryColor),
            ),
            errorBorder: const OutlineInputBorder(
              borderSide: BorderSide(color: Colors.red),
            ),
            filled: true,
            fillColor: widget.enabled ? Colors.white : Colors.grey[100],
          ),
        ),
      ],
    );
  }
}
```

#### University Card Widget

```dart
// common/widgets/university_card.dart
class UniversityCard extends StatelessWidget {
  final University university;
  final VoidCallback? onTap;
  final VoidCallback? onFavorite;
  final bool isFavorite;

  const UniversityCard({
    Key? key,
    required this.university,
    this.onTap,
    this.onFavorite,
    this.isFavorite = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          university.name,
                          style: Theme.of(context).textTheme.titleLarge,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Icon(
                              Icons.location_on,
                              size: 16,
                              color: Colors.grey[600],
                            ),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                university.location,
                                style: Theme.of(context).textTheme.bodyMedium,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  if (onFavorite != null)
                    IconButton(
                      icon: Icon(
                        isFavorite ? Icons.favorite : Icons.favorite_border,
                        color: isFavorite ? Colors.red : Colors.grey,
                      ),
                      onPressed: onFavorite,
                    ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                university.description ?? 'No description available',
                style: Theme.of(context).textTheme.bodyMedium,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.star, color: Colors.amber, size: 20),
                      const SizedBox(width: 4),
                      Text(
                        university.averageRating?.toStringAsFixed(1) ?? 'N/A',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ],
                  ),
                  Text(
                    'Est. ${university.establishedYear ?? 'Unknown'}',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

---

## State Management

### BLoC Setup

#### Service Locator

```dart
// service_locator.dart
final sl = GetIt.instance;

void setUpServiceLocator() {
  // Core
  sl.registerLazySingleton<DioClient>(() => DioClient());
  sl.registerLazySingleton<NetworkInfo>(() => NetworkInfoImpl());
  sl.registerLazySingleton<LocalStorage>(() => LocalStorageImpl());

  // Data sources
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(dioClient: sl()),
  );
  sl.registerLazySingleton<AuthLocalDataSource>(
    () => AuthLocalDataSourceImpl(localStorage: sl()),
  );

  // Repositories
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      remoteDataSource: sl(),
      localDataSource: sl(),
      networkInfo: sl(),
    ),
  );

  // Use cases
  sl.registerLazySingleton(() => SignInUseCase(sl()));
  sl.registerLazySingleton(() => SignUpUseCase(sl()));
  sl.registerLazySingleton(() => SignOutUseCase(sl()));
  sl.registerLazySingleton(() => GetCurrentUserUseCase(sl()));

  // BLoC/Cubit
  sl.registerFactory(
    () => AuthCubit(
      signInUseCase: sl(),
      signUpUseCase: sl(),
      signOutUseCase: sl(),
      getCurrentUserUseCase: sl(),
    ),
  );
}
```

#### Auth State Cubit (Global)

```dart
// common/bloc/auth/auth_state_cubit.dart
class AuthStateCubit extends Cubit<AuthState> {
  final GetCurrentUserUseCase _getCurrentUserUseCase;
  final SignOutUseCase _signOutUseCase;

  AuthStateCubit({
    required GetCurrentUserUseCase getCurrentUserUseCase,
    required SignOutUseCase signOutUseCase,
  })  : _getCurrentUserUseCase = getCurrentUserUseCase,
        _signOutUseCase = signOutUseCase,
        super(AuthInitial());

  Future<void> appStarted() async {
    emit(AuthLoading());
    
    try {
      final result = await _getCurrentUserUseCase();
      result.fold(
        (failure) => emit(UnAuthenticated()),
        (user) => emit(Authenticated(user: user)),
      );
    } catch (e) {
      emit(UnAuthenticated());
    }
  }

  Future<void> userSignedIn(User user) async {
    emit(Authenticated(user: user));
  }

  Future<void> userSignedOut() async {
    try {
      await _signOutUseCase();
      emit(UnAuthenticated());
    } catch (e) {
      emit(UnAuthenticated());
    }
  }
}
```

---

## Services

### Network Service

```dart
// core/network/dio_client.dart
class DioClient {
  late final Dio _dio;

  DioClient() {
    _dio = Dio(
      BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        sendTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    _dio.interceptors.addAll([
      AuthInterceptor(),
      LoggingInterceptor(),
      ErrorInterceptor(),
    ]);
  }

  Dio get dio => _dio;

  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.get<T>(
        path,
        queryParameters: queryParameters,
        options: options,
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.post<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<Response<T>> patch<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.patch<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<Response<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.delete<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
    } catch (e) {
      rethrow;
    }
  }
}
```

### Local Storage Service

```dart
// core/storage/local_storage.dart
abstract class LocalStorage {
  Future<void> saveString(String key, String value);
  Future<String?> getString(String key);
  Future<void> saveInt(String key, int value);
  Future<int?> getInt(String key);
  Future<void> saveBool(String key, bool value);
  Future<bool?> getBool(String key);
  Future<void> remove(String key);
  Future<void> clear();
}

class LocalStorageImpl implements LocalStorage {
  static const String _authTokenKey = 'auth_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _userKey = 'user_data';

  @override
  Future<void> saveString(String key, String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, value);
  }

  @override
  Future<String?> getString(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(key);
  }

  @override
  Future<void> saveInt(String key, int value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(key, value);
  }

  @override
  Future<int?> getInt(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(key);
  }

  @override
  Future<void> saveBool(String key, bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(key, value);
  }

  @override
  Future<bool?> getBool(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(key);
  }

  @override
  Future<void> remove(String key) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(key);
  }

  @override
  Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }

  // Helper methods for common storage operations
  Future<void> saveAuthToken(String token) async {
    await saveString(_authTokenKey, token);
  }

  Future<String?> getAuthToken() async {
    return await getString(_authTokenKey);
  }

  Future<void> saveRefreshToken(String token) async {
    await saveString(_refreshTokenKey, token);
  }

  Future<String?> getRefreshToken() async {
    return await getString(_refreshTokenKey);
  }

  Future<void> saveUser(User user) async {
    await saveString(_userKey, jsonEncode(user.toJson()));
  }

  Future<User?> getUser() async {
    final userJson = await getString(_userKey);
    if (userJson != null) {
      return User.fromJson(jsonDecode(userJson));
    }
    return null;
  }

  Future<void> clearAuthData() async {
    await remove(_authTokenKey);
    await remove(_refreshTokenKey);
    await remove(_userKey);
  }
}
```

---

## Navigation

### Route Configuration

```dart
// core/router/app_router.dart
class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case RouteConstants.splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      
      case RouteConstants.signIn:
        return MaterialPageRoute(builder: (_) => const SignInPage());
      
      case RouteConstants.signUp:
        return MaterialPageRoute(builder: (_) => const SignUpPage());
      
      case RouteConstants.main:
        return MaterialPageRoute(builder: (_) => const MainScreen());
      
      case RouteConstants.dashboard:
        return MaterialPageRoute(builder: (_) => const DashboardScreen());
      
      case RouteConstants.profile:
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      
      case RouteConstants.university:
        final args = settings.arguments as Map<String, dynamic>?;
        final universityId = args?['id'] as int?;
        if (universityId != null) {
          return MaterialPageRoute(
            builder: (_) => UniversityDetailScreen(universityId: universityId),
          );
        }
        return _errorRoute();
      
      default:
        return _errorRoute();
    }
  }

  static Route<dynamic> _errorRoute() {
    return MaterialPageRoute(
      builder: (_) => Scaffold(
        appBar: AppBar(title: const Text('Error')),
        body: const Center(
          child: Text('Page not found'),
        ),
      ),
    );
  }
}

// core/router/route_constants.dart
class RouteConstants {
  static const String splash = '/';
  static const String signIn = '/sign-in';
  static const String signUp = '/sign-up';
  static const String main = '/main';
  static const String dashboard = '/dashboard';
  static const String profile = '/profile';
  static const String university = '/university';
  static const String writeReview = '/write-review';
  static const String search = '/search';
  static const String settings = '/settings';
}
```

### Navigation Service

```dart
// core/services/navigation_service.dart
class NavigationService {
  static final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  static Future<dynamic> pushNamed(String routeName, {Object? arguments}) {
    return navigatorKey.currentState!.pushNamed(routeName, arguments: arguments);
  }

  static Future<dynamic> pushReplacementNamed(String routeName, {Object? arguments}) {
    return navigatorKey.currentState!.pushReplacementNamed(routeName, arguments: arguments);
  }

  static Future<dynamic> pushNamedAndClearStack(String routeName, {Object? arguments}) {
    return navigatorKey.currentState!.pushNamedAndRemoveUntil(
      routeName,
      (Route<dynamic> route) => false,
      arguments: arguments,
    );
  }

  static void pop([dynamic result]) {
    return navigatorKey.currentState!.pop(result);
  }

  static void popUntil(String routeName) {
    return navigatorKey.currentState!.popUntil(ModalRoute.withName(routeName));
  }
}
```

---

## API Integration

### Repository Pattern

```dart
// features/auth/domain/repositories/auth_repository.dart
abstract class AuthRepository {
  Future<Either<Failure, AuthResponse>> signIn(SignInParams params);
  Future<Either<Failure, AuthResponse>> signUp(SignUpParams params);
  Future<Either<Failure, void>> signOut();
  Future<Either<Failure, User>> getCurrentUser();
  Future<Either<Failure, AuthResponse>> refreshToken();
}

// features/auth/data/repositories/auth_repository_impl.dart
class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;
  final NetworkInfo networkInfo;

  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, AuthResponse>> signIn(SignInParams params) async {
    if (await networkInfo.isConnected) {
      try {
        final authResponse = await remoteDataSource.signIn(params);
        
        // Save tokens locally
        await localDataSource.saveAuthToken(authResponse.accessToken);
        await localDataSource.saveRefreshToken(authResponse.refreshToken);
        await localDataSource.saveUser(authResponse.user);
        
        return Right(authResponse);
      } on ServerException catch (e) {
        return Left(ServerFailure(message: e.message));
      } catch (e) {
        return Left(ServerFailure(message: 'An unexpected error occurred'));
      }
    } else {
      return Left(NetworkFailure(message: 'No internet connection'));
    }
  }

  @override
  Future<Either<Failure, User>> getCurrentUser() async {
    try {
      final user = await localDataSource.getUser();
      if (user != null) {
        return Right(user);
      } else {
        return Left(CacheFailure(message: 'No user found'));
      }
    } catch (e) {
      return Left(CacheFailure(message: 'Failed to get user'));
    }
  }

  // ... other methods
}
```

### Data Sources

```dart
// features/auth/data/datasources/auth_remote_data_source.dart
abstract class AuthRemoteDataSource {
  Future<AuthResponse> signIn(SignInParams params);
  Future<AuthResponse> signUp(SignUpParams params);
  Future<void> signOut();
  Future<AuthResponse> refreshToken(String refreshToken);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final DioClient dioClient;

  AuthRemoteDataSourceImpl({required this.dioClient});

  @override
  Future<AuthResponse> signIn(SignInParams params) async {
    try {
      final response = await dioClient.post(
        ApiConstants.signIn,
        data: params.toJson(),
      );

      if (response.statusCode == 200) {
        return AuthResponse.fromJson(response.data);
      } else {
        throw ServerException(message: 'Failed to sign in');
      }
    } on DioError catch (e) {
      if (e.response?.statusCode == 401) {
        throw ServerException(message: 'Invalid credentials');
      } else {
        throw ServerException(message: e.message ?? 'Unknown error');
      }
    } catch (e) {
      throw ServerException(message: 'An unexpected error occurred');
    }
  }

  // ... other methods
}
```

---

## Authentication Flow

### Auth Flow Diagram

```
App Start → Check Local Token → Valid? → Navigate to Main
                               ↓
                           Invalid → Navigate to Sign In
                               ↓
                      Sign In Success → Save Token → Navigate to Main
                               ↓
                      Sign In Failed → Show Error → Stay on Sign In
```

### Implementation

```dart
// main.dart
void main() {
  runZonedGuarded(
    () async {
      WidgetsFlutterBinding.ensureInitialized();
      setUpServiceLocator();
      runApp(MyApp(initialRoute: RouteConstants.splash));
    },
    (error, stackTrace) {
      // Error logging
    },
  );
}

class MyApp extends StatelessWidget {
  final String initialRoute;

  const MyApp({Key? key, required this.initialRoute}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => sl<AuthStateCubit>()..appStarted(),
      child: MaterialApp(
        title: 'Edu Review Hub',
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        onGenerateRoute: AppRouter.generateRoute,
        navigatorKey: NavigationService.navigatorKey,
        debugShowCheckedModeBanner: false,
        home: BlocListener<AuthStateCubit, AuthState>(
          listener: (context, state) {
            if (state is Authenticated) {
              NavigationService.pushReplacementNamed(RouteConstants.main);
            } else if (state is UnAuthenticated) {
              NavigationService.pushReplacementNamed(RouteConstants.signIn);
            }
          },
          child: const SplashScreen(),
        ),
      ),
    );
  }
}
```

---

## Utilities

### Common Utilities

```dart
// common/utils/validators.dart
class Validators {
  static String? email(String? value) {
    if (value?.isEmpty ?? true) {
      return 'Email is required';
    }
    
    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value!)) {
      return 'Please enter a valid email';
    }
    
    return null;
  }

  static String? password(String? value) {
    if (value?.isEmpty ?? true) {
      return 'Password is required';
    }
    
    if (value!.length < 8) {
      return 'Password must be at least 8 characters';
    }
    
    return null;
  }

  static String? required(String? value, [String? fieldName]) {
    if (value?.isEmpty ?? true) {
      return '${fieldName ?? 'Field'} is required';
    }
    return null;
  }

  static String? minLength(String? value, int minLength, [String? fieldName]) {
    if (value?.isEmpty ?? true) {
      return '${fieldName ?? 'Field'} is required';
    }
    
    if (value!.length < minLength) {
      return '${fieldName ?? 'Field'} must be at least $minLength characters';
    }
    
    return null;
  }
}

// common/utils/date_utils.dart
class DateUtils {
  static String formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  static String formatDateTime(DateTime dateTime) {
    return '${formatDate(dateTime)} ${formatTime(dateTime)}';
  }

  static String formatTime(DateTime dateTime) {
    return '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  static String timeAgo(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays > 0) {
      return '${difference.inDays} day${difference.inDays > 1 ? 's' : ''} ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hour${difference.inHours > 1 ? 's' : ''} ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minute${difference.inMinutes > 1 ? 's' : ''} ago';
    } else {
      return 'Just now';
    }
  }
}

// common/utils/constants.dart
class ApiConstants {
  static const String baseUrl = 'http://localhost:3000/api';
  static const String signIn = '/auth/login';
  static const String signUp = '/auth/register';
  static const String signOut = '/auth/logout';
  static const String refreshToken = '/auth/refresh';
  static const String universities = '/universities';
  static const String reviews = '/university-reviews';
  static const String blogs = '/blogs';
  static const String profile = '/profile/me';
}

class StorageKeys {
  static const String authToken = 'auth_token';
  static const String refreshToken = 'refresh_token';
  static const String userData = 'user_data';
  static const String themeMode = 'theme_mode';
  static const String language = 'language';
}
```

---

## Best Practices

### Code Organization

1. **Feature-based structure** - Organize code by features, not layers
2. **Clean Architecture** - Maintain clear separation between layers
3. **Single Responsibility** - Each class/widget should have one responsibility
4. **Dependency Injection** - Use GetIt for dependency management
5. **Consistent naming** - Follow Dart naming conventions

### State Management

1. **Use BLoC/Cubit** for state management
2. **Keep business logic in use cases**
3. **Handle errors properly** with Either pattern
4. **Emit loading states** for better UX
5. **Use equatable** for state comparison

### UI/UX Guidelines

1. **Responsive design** - Support different screen sizes
2. **Consistent theming** - Use Material Design principles
3. **Accessibility** - Add semantic labels and screen reader support
4. **Loading states** - Show loading indicators for async operations
5. **Error handling** - Provide meaningful error messages

### Performance

1. **Use const constructors** where possible
2. **Optimize list rendering** with ListView.builder
3. **Image optimization** - Use cached_network_image
4. **Lazy loading** - Load data when needed
5. **Memory management** - Dispose controllers and streams

### Testing

```dart
// test/features/auth/presentation/cubit/auth_cubit_test.dart
void main() {
  group('AuthCubit', () {
    late AuthCubit authCubit;
    late MockSignInUseCase mockSignInUseCase;
    late MockSignUpUseCase mockSignUpUseCase;

    setUp(() {
      mockSignInUseCase = MockSignInUseCase();
      mockSignUpUseCase = MockSignUpUseCase();
      authCubit = AuthCubit(
        signInUseCase: mockSignInUseCase,
        signUpUseCase: mockSignUpUseCase,
        signOutUseCase: MockSignOutUseCase(),
        getCurrentUserUseCase: MockGetCurrentUserUseCase(),
      );
    });

    test('initial state should be AuthInitial', () {
      expect(authCubit.state, AuthInitial());
    });

    blocTest<AuthCubit, AuthState>(
      'emits [AuthLoading, Authenticated] when signIn is successful',
      build: () {
        when(() => mockSignInUseCase(any()))
            .thenAnswer((_) async => Right(tAuthResponse));
        return authCubit;
      },
      act: (cubit) => cubit.signIn(
        identifier: 'test@example.com',
        password: 'password123',
      ),
      expect: () => [
        AuthLoading(),
        Authenticated(user: tUser),
      ],
    );
  });
}
```

---

## Setup and Development

### Environment Setup

```yaml
# pubspec.yaml
name: edu_review_mobile
description: Mobile app for Edu Review Hub platform
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: ">=3.10.0"

dependencies:
  flutter:
    sdk: flutter
  
  # State Management
  flutter_bloc: ^8.1.3
  equatable: ^2.0.5
  
  # Dependency Injection
  get_it: ^7.6.4
  
  # Network
  dio: ^5.3.2
  connectivity_plus: ^5.0.1
  
  # Local Storage
  shared_preferences: ^2.2.2
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  
  # UI
  cached_network_image: ^3.3.0
  flutter_svg: ^2.0.7
  
  # Utilities
  dartz: ^0.10.1
  intl: ^0.18.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  bloc_test: ^9.1.4
  mockito: ^5.4.2
  build_runner: ^2.4.7
```

### Build Configuration

```bash
# Development
flutter run

# Build for testing
flutter build apk --debug

# Build for release
flutter build apk --release
flutter build appbundle --release

# Run tests
flutter test

# Code generation
flutter packages pub run build_runner build

# Clean build
flutter clean && flutter pub get
```

### Environment Variables

```dart
// core/config/environment.dart
abstract class Environment {
  static const String dev = 'development';
  static const String staging = 'staging';
  static const String prod = 'production';
}

class AppConfig {
  static const String currentEnvironment = String.fromEnvironment(
    'ENVIRONMENT',
    defaultValue: Environment.dev,
  );

  static String get baseUrl {
    switch (currentEnvironment) {
      case Environment.prod:
        return 'https://api.edu-review-hub.com';
      case Environment.staging:
        return 'https://staging-api.edu-review-hub.com';
      default:
        return 'http://localhost:3000/api';
    }
  }

  static bool get isDebug => currentEnvironment != Environment.prod;
}
```

---

This comprehensive documentation covers all aspects of the Flutter mobile application, providing developers with detailed information about the architecture, components, and implementation patterns used throughout the app.