# 📖 Edu Review Hub Documentation

Welcome to the comprehensive documentation for **Edu Review Hub** - a platform for university reviews and educational content management.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Quick Start](#quick-start)
- [Documentation Structure](#documentation-structure)
- [Architecture](#architecture)
- [Getting Help](#getting-help)

## Project Overview

Edu Review Hub is a full-stack application built with modern technologies to provide a comprehensive platform for university reviews, educational content management, and community engagement. The system consists of:

- **Backend API** (NestJS + PostgreSQL)
- **Frontend Web App** (Next.js + React)
- **Mobile Application** (Flutter)
- **Admin Dashboard** (React)

### Key Features

- 🎓 **University Management**: Comprehensive university profiles and information
- ⭐ **Review System**: Multi-criteria reviews with moderation capabilities
- 📝 **Blog Platform**: Educational content creation and sharing
- 👥 **User Management**: Role-based authentication and authorization
- 📱 **Mobile Experience**: Native mobile app with offline capabilities
- 🔧 **Admin Tools**: Content moderation and system management

---

## Quick Start

### Prerequisites
- Node.js 18.0.0+
- PostgreSQL 12.0+
- Flutter 3.10.0+ (for mobile development)
- npm 9.0.0+

### 1. Clone Repository
```bash
git clone https://github.com/your-org/edu-review-hub.git
cd edu-review-hub
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Configure your .env file
npm run migration:run
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend/edu-review-frontend
npm install
cp .env.local.example .env.local
# Configure environment variables
npm run dev
```

### 4. Mobile Setup (Optional)
```bash
cd mobile/edu_review_mobile
flutter pub get
flutter run
```

---

## Documentation Structure

Our documentation is organized into several comprehensive guides:

### 🚀 [Development Guide](./DEVELOPMENT_GUIDE.md)
**Complete setup and development workflow**
- Environment setup and configuration
- Development workflow and best practices
- Testing strategies and implementation
- Deployment procedures
- CI/CD pipeline configuration
- Troubleshooting common issues

### 🔌 [API Documentation](./API_DOCUMENTATION.md)
**Comprehensive backend API reference**
- Complete endpoint documentation
- Authentication and authorization
- Request/response examples
- Error handling
- Rate limiting
- API versioning

### 🎨 [Frontend Documentation](./FRONTEND_DOCUMENTATION.md)
**React/Next.js frontend guide**
- Component library and usage
- State management patterns
- Routing and navigation
- UI/UX patterns
- Performance optimization
- Testing strategies

### 📱 [Mobile Documentation](./MOBILE_DOCUMENTATION.md)
**Flutter mobile app guide**
- App architecture and structure
- Widget documentation
- State management with BLoC
- API integration patterns
- Navigation and routing
- Platform-specific implementations

---

## Architecture

### System Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Mobile App    │    │   Admin Panel   │
│   (Next.js)     │    │   (Flutter)     │    │   (React)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Backend API   │
                    │   (NestJS)      │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Database      │
                    │   (PostgreSQL)  │
                    └─────────────────┘
```

### Technology Stack

#### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with refresh tokens
- **File Storage**: Cloudinary
- **Email**: SMTP integration
- **Documentation**: Swagger/OpenAPI

#### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **UI Components**: Radix UI + Custom components
- **Testing**: Jest + React Testing Library

#### Mobile
- **Framework**: Flutter 3.x
- **Language**: Dart
- **State Management**: BLoC/Cubit
- **Architecture**: Clean Architecture
- **HTTP Client**: Dio
- **Local Storage**: Shared Preferences + Hive

### Key Design Patterns

- **Clean Architecture**: Clear separation of concerns
- **Repository Pattern**: Data access abstraction
- **Command Query Responsibility Segregation (CQRS)**: Separate read/write operations
- **Dependency Injection**: Loose coupling and testability
- **Observer Pattern**: Real-time updates and notifications

---

## API Quick Reference

### Authentication Endpoints
```
POST   /api/auth/register         # User registration
POST   /api/auth/login            # User login
POST   /api/auth/refresh          # Token refresh
POST   /api/auth/logout           # User logout
```

### University Endpoints
```
GET    /api/universities          # List universities
GET    /api/universities/:id      # Get university details
POST   /api/universities          # Create university (Admin)
PATCH  /api/universities/:id      # Update university (Admin)
DELETE /api/universities/:id      # Delete university (Admin)
```

### Review Endpoints
```
GET    /api/university-reviews/:id              # Get review by ID
GET    /api/university-reviews/university/:id   # Get reviews by university
POST   /api/university-reviews                  # Create review
PATCH  /api/university-reviews/:id              # Update review
DELETE /api/university-reviews/:id              # Delete review
```

### Blog Endpoints
```
GET    /api/blogs                 # List blog posts
GET    /api/blogs/:id             # Get blog post
POST   /api/blogs                 # Create blog post
PATCH  /api/blogs/:id             # Update blog post
DELETE /api/blogs/:id             # Delete blog post
```

---

## Component Quick Reference

### UI Components (Frontend)

#### Basic Components
```tsx
import { Button, Input, Alert } from '@/components/ui';

<Button variant="primary" size="lg">Click me</Button>
<Input type="email" placeholder="Enter email" />
<Alert variant="success">Operation completed!</Alert>
```

#### Complex Components
```tsx
import { UniversityCard, ReviewForm } from '@/components/university';

<UniversityCard 
  university={university} 
  onViewDetails={handleView}
  onWriteReview={handleReview} 
/>
```

### Mobile Widgets (Flutter)

#### Basic Widgets
```dart
// Custom input field
CustomInputField(
  label: 'Email',
  hint: 'Enter your email',
  prefixIcon: Icons.email,
  validator: Validators.email,
)

// University card
UniversityCard(
  university: university,
  onTap: () => navigateToDetails(university.id),
  onFavorite: () => toggleFavorite(university.id),
)
```

---

## Development Commands

### Backend Commands
```bash
# Development
npm run start:dev              # Start with hot reload
npm run build                  # Build for production
npm run start:prod             # Start production build

# Database
npm run migration:generate     # Generate migration
npm run migration:run          # Run migrations
npm run seed:run               # Seed database

# Testing
npm run test                   # Unit tests
npm run test:e2e               # End-to-end tests
npm run test:cov               # Test coverage
```

### Frontend Commands
```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm run start                  # Start production server

# Testing & Quality
npm run test                   # Run tests
npm run lint                   # Check code style
npm run type-check             # TypeScript validation
```

### Mobile Commands
```bash
# Development
flutter run                    # Run on device
flutter build apk              # Build Android APK
flutter build ios              # Build iOS app

# Testing & Quality
flutter test                   # Run tests
flutter analyze                # Code analysis
flutter doctor                 # Check setup
```

---

## Environment Configuration

### Backend Environment Variables
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=edu_review_hub

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

---

## Testing Overview

### Backend Testing
- **Unit Tests**: Service and controller testing with Jest
- **Integration Tests**: End-to-end API testing
- **Database Tests**: Repository and migration testing

### Frontend Testing
- **Component Tests**: React component testing with React Testing Library
- **Integration Tests**: User flow testing
- **Visual Tests**: Storybook for component documentation

### Mobile Testing
- **Widget Tests**: Flutter widget testing
- **Integration Tests**: App flow testing
- **Unit Tests**: Business logic testing

---

## Deployment

### Production Deployment Options

#### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

#### Cloud Deployment
- **Backend**: Deploy to AWS/DigitalOcean/Railway
- **Frontend**: Deploy to Vercel/Netlify
- **Database**: Managed PostgreSQL (AWS RDS/DigitalOcean)
- **Mobile**: Build and distribute via App Store/Play Store

### CI/CD Pipeline
- Automated testing on pull requests
- Automatic deployment on main branch
- Environment-specific configurations
- Security scanning and vulnerability checks

---

## Security Considerations

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Permission-based endpoint protection
- Rate limiting on authentication endpoints

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Secure password hashing

### File Upload Security
- File type validation
- Size limitations
- Virus scanning
- Secure storage with Cloudinary

---

## Performance Optimization

### Backend Optimization
- Database indexing and query optimization
- Redis caching for frequently accessed data
- Connection pooling
- Compression middleware

### Frontend Optimization
- Code splitting and lazy loading
- Image optimization with Next.js
- Bundle size optimization
- Performance monitoring

### Mobile Optimization
- Efficient list rendering
- Image caching
- Offline data synchronization
- Memory management

---

## Getting Help

### Documentation Resources
1. **[Development Guide](./DEVELOPMENT_GUIDE.md)** - Setup and workflow
2. **[API Documentation](./API_DOCUMENTATION.md)** - Backend API reference
3. **[Frontend Documentation](./FRONTEND_DOCUMENTATION.md)** - React/Next.js guide
4. **[Mobile Documentation](./MOBILE_DOCUMENTATION.md)** - Flutter app guide

### Interactive Documentation
- **API Documentation**: http://localhost:3000/api/docs (Swagger UI)
- **Component Storybook**: http://localhost:6006 (Frontend components)

### Support Channels
- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for questions and community support
- **Email**: chinhtnc2903@gmail.com for direct support

### Contributing
Please read our [Contributing Guidelines](./DEVELOPMENT_GUIDE.md#contributing-guidelines) before submitting pull requests.

---

## Project Status

- ✅ **Backend API**: Complete with authentication, CRUD operations, and documentation
- ✅ **Frontend Web App**: Complete with responsive design and state management
- ✅ **Mobile App**: Complete with native experience and offline capabilities
- ✅ **Documentation**: Comprehensive guides and API documentation
- 🔄 **Testing**: Ongoing improvement of test coverage
- 🔄 **Performance**: Continuous optimization and monitoring

---

## License

This project is licensed under the ISC License. See the LICENSE file for details.

---

> Made with ❤️ by the YB team.

Last updated: December 2024