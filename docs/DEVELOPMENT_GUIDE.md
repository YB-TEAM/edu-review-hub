# 🚀 Development Guide

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Testing Strategy](#testing-strategy)
- [Deployment](#deployment)
- [Database Management](#database-management)
- [API Versioning](#api-versioning)
- [Security Guidelines](#security-guidelines)
- [Performance Optimization](#performance-optimization)
- [Monitoring and Logging](#monitoring-and-logging)
- [Contributing Guidelines](#contributing-guidelines)
- [Troubleshooting](#troubleshooting)

## Project Overview

**Edu Review Hub** is a comprehensive platform for university reviews and educational content management. The system consists of multiple components working together to provide a seamless experience across web and mobile platforms.

### System Components

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

### Key Features

- **User Management**: Registration, authentication, profiles, roles
- **University Reviews**: Multi-criteria reviews with moderation
- **Blog System**: Educational content creation and management
- **Admin Dashboard**: Content moderation and user management
- **Mobile App**: Native experience with offline capabilities
- **Email Service**: Notifications and verification
- **File Upload**: Image and document management
- **Search & Filtering**: Advanced university discovery

---

## Architecture Overview

### Backend Architecture (NestJS)

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Controllers  │  Guards  │  Middleware  │  Interceptors     │
└─────────────────────────────────────────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
├─────────────────────────────────────────────────────────────┤
│   Services    │    DTOs     │   Use Cases  │  Interfaces    │
└─────────────────────────────────────────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Repositories │  Entities  │ External APIs │  File Storage  │
└─────────────────────────────────────────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────┐
│                     Domain Layer                            │
├─────────────────────────────────────────────────────────────┤
│  Business Logic  │  Domain Models  │  Domain Services       │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture (Next.js)

```
┌─────────────────────────────────────────────────────────────┐
│                      Pages Layer                            │
├─────────────────────────────────────────────────────────────┤
│     App Router     │    Layouts    │     Pages             │
└─────────────────────────────────────────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────┐
│                   Components Layer                          │
├─────────────────────────────────────────────────────────────┤
│  UI Components  │  Feature Components  │  Custom Hooks     │
└─────────────────────────────────────────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────┐
│                   Services Layer                            │
├─────────────────────────────────────────────────────────────┤
│   API Client   │  State Management  │   Utilities          │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Architecture (Flutter)

```
┌─────────────────────────────────────────────────────────────┐
│                  Presentation Layer                         │
├─────────────────────────────────────────────────────────────┤
│    Screens     │    Widgets     │    BLoC/Cubit            │
└─────────────────────────────────────────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────┐
│                    Domain Layer                             │
├─────────────────────────────────────────────────────────────┤
│   Entities     │   Use Cases    │   Repository Interfaces   │
└─────────────────────────────────────────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                              │
├─────────────────────────────────────────────────────────────┤
│  Repositories  │  Data Sources  │   Models   │  Services    │
└─────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **PostgreSQL**: 12.0 or higher
- **Flutter**: 3.10.0 or higher (for mobile development)
- **Docker**: Optional but recommended
- **Git**: Latest version

### Environment Setup

1. **Clone the Repository**
```bash
git clone https://github.com/your-org/edu-review-hub.git
cd edu-review-hub
```

2. **Backend Setup**
```bash
cd backend
npm install
cp env.example .env
# Configure your .env file
npm run migration:run
npm run start:dev
```

3. **Frontend Setup**
```bash
cd frontend/edu-review-frontend
npm install
cp .env.local.example .env.local
# Configure your environment variables
npm run dev
```

4. **Mobile Setup**
```bash
cd mobile/edu_review_mobile
flutter pub get
flutter run
```

### Environment Variables

#### Backend (.env)
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

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

---

## Development Workflow

### Branch Strategy

```
main
├── develop
│   ├── feature/user-authentication
│   ├── feature/university-reviews
│   ├── feature/blog-system
│   └── feature/mobile-app
├── release/v1.0.0
└── hotfix/critical-bug-fix
```

### Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add university review system
fix: resolve authentication token expiry issue
docs: update API documentation
style: format code according to style guide
refactor: restructure user service
test: add unit tests for auth controller
chore: update dependencies
```

### Code Review Process

1. **Create Feature Branch**: `git checkout -b feature/feature-name`
2. **Implement Feature**: Write code following project conventions
3. **Write Tests**: Ensure adequate test coverage
4. **Update Documentation**: Update relevant documentation
5. **Create Pull Request**: Provide clear description and context
6. **Code Review**: Address feedback from reviewers
7. **Merge**: Squash and merge after approval

### Development Commands

#### Backend
```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging
npm run build              # Build for production
npm run start:prod         # Start production build

# Database
npm run migration:generate # Generate new migration
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration
npm run seed:run           # Run database seeds

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Run tests with coverage

# Code Quality
npm run lint               # Check code style
npm run lint:fix           # Fix code style issues
npm run format             # Format code
```

#### Frontend
```bash
# Development
npm run dev                # Start development server
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint
npm run type-check         # Run TypeScript checks

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage
```

#### Mobile
```bash
# Development
flutter run                # Run on connected device
flutter run -d chrome      # Run on web browser
flutter build apk          # Build Android APK
flutter build ios          # Build iOS app

# Testing
flutter test               # Run unit tests
flutter test --coverage    # Run tests with coverage
flutter analyze            # Analyze code quality

# Code Generation
flutter packages pub run build_runner build --delete-conflicting-outputs
```

---

## Testing Strategy

### Testing Pyramid

```
                    ┌─────────────┐
                    │  E2E Tests  │ (Few)
                    └─────────────┘
                ┌─────────────────────┐
                │ Integration Tests   │ (Some)
                └─────────────────────┘
            ┌─────────────────────────────┐
            │      Unit Tests             │ (Many)
            └─────────────────────────────┘
```

### Backend Testing

#### Unit Tests
```typescript
// auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useClass: Repository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should register a new user', async () => {
    const registerDto: RegisterDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
    jest.spyOn(jwtService, 'sign').mockReturnValue('mock-token');

    const result = await service.register(registerDto);

    expect(result.accessToken).toBeDefined();
    expect(result.user.email).toBe(registerDto.email);
  });
});
```

#### Integration Tests
```typescript
// auth.controller.e2e-spec.ts
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.user.email).toBe('test@example.com');
      });
  });
});
```

### Frontend Testing

#### Component Tests
```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-error-600');
  });
});
```

#### Integration Tests
```typescript
// LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Provider } from 'react-redux';
import { store } from '@/lib/store';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('LoginForm Integration', () => {
  it('submits form with valid credentials', async () => {
    const onSuccess = jest.fn();
    renderWithProviders(<LoginForm onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
```

### Mobile Testing

#### Widget Tests
```dart
// sign_in_page_test.dart
void main() {
  group('SignInPage Widget Tests', () => {
    testWidgets('renders all form elements', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider(
            create: (context) => MockAuthCubit(),
            child: const SignInPage(),
          ),
        ),
      );

      expect(find.text('Welcome Back!'), findsOneWidget);
      expect(find.byType(TextFormField), findsNWidgets(2));
      expect(find.text('Sign In'), findsOneWidget);
    });

    testWidgets('shows error message on invalid input', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider(
            create: (context) => MockAuthCubit(),
            child: const SignInPage(),
          ),
        ),
      );

      await tester.tap(find.text('Sign In'));
      await tester.pump();

      expect(find.text('Please enter your email or username'), findsOneWidget);
    });
  });
}
```

---

## Deployment

### Production Environment

#### Backend Deployment (Docker)

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000
CMD ["node", "dist/main"]
```

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      - db
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend/edu-review-frontend
      dockerfile: Dockerfile
    ports:
      - "3001:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.edu-review-hub.com
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: edu_review_hub
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - backend
      - frontend
    restart: unless-stopped

volumes:
  postgres_data:
```

#### Frontend Deployment (Vercel/Netlify)

```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

#### Mobile Deployment

```yaml
# GitHub Actions for Mobile (.github/workflows/mobile.yml)
name: Mobile CI/CD

on:
  push:
    branches: [main, develop]
    paths: ['mobile/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.10.0'
      - run: flutter pub get
        working-directory: mobile/edu_review_mobile
      - run: flutter test
        working-directory: mobile/edu_review_mobile

  build-android:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
      - run: flutter pub get
        working-directory: mobile/edu_review_mobile
      - run: flutter build apk --release
        working-directory: mobile/edu_review_mobile
      - uses: actions/upload-artifact@v3
        with:
          name: android-apk
          path: mobile/edu_review_mobile/build/app/outputs/flutter-apk/
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: backend
        run: npm ci

      - name: Run tests
        working-directory: backend
        run: npm run test
        env:
          DB_HOST: localhost
          DB_PORT: 5432
          DB_USERNAME: postgres
          DB_PASSWORD: postgres
          DB_DATABASE: test_db

      - name: Run e2e tests
        working-directory: backend
        run: npm run test:e2e

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/edu-review-frontend/package-lock.json

      - name: Install dependencies
        working-directory: frontend/edu-review-frontend
        run: npm ci

      - name: Run tests
        working-directory: frontend/edu-review-frontend
        run: npm run test

      - name: Build application
        working-directory: frontend/edu-review-frontend
        run: npm run build

  deploy:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          # Add deployment scripts here
          echo "Deploying to production..."
```

---

## Database Management

### Migration Strategy

```typescript
// migrations/001-create-users.ts
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsers1640000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'username',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          // ... other columns
        ],
        indices: [
          {
            name: 'IDX_USER_EMAIL',
            columnNames: ['email'],
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

### Seeding Data

```typescript
// seeds/001-admin-user.seed.ts
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

export default class AdminUserSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const userRepository = connection.getRepository(User);
    
    const adminUser = userRepository.create({
      username: 'admin',
      email: 'admin@edu-review-hub.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'SUPER_ADMIN',
      isEmailVerified: true,
    });

    await userRepository.save(adminUser);
  }
}
```

### Backup Strategy

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="edu_review_hub"

# Create backup
pg_dump -h localhost -U postgres -d $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

---

## API Versioning

### Version Strategy

```typescript
// Version 1 Controller
@Controller({ path: 'users', version: '1' })
export class UsersV1Controller {
  @Get()
  async findAll(): Promise<UserV1Dto[]> {
    // Version 1 implementation
  }
}

// Version 2 Controller
@Controller({ path: 'users', version: '2' })
export class UsersV2Controller {
  @Get()
  async findAll(): Promise<UserV2Dto[]> {
    // Version 2 implementation with additional fields
  }
}
```

### API Documentation Versioning

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  // Swagger for V1
  const configV1 = new DocumentBuilder()
    .setTitle('Edu Review Hub API')
    .setDescription('The Edu Review Hub API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentV1 = SwaggerModule.createDocument(app, configV1, {
    include: [UsersV1Module],
  });
  SwaggerModule.setup('api/v1/docs', app, documentV1);

  // Swagger for V2
  const configV2 = new DocumentBuilder()
    .setTitle('Edu Review Hub API')
    .setDescription('The Edu Review Hub API description')
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  const documentV2 = SwaggerModule.createDocument(app, configV2, {
    include: [UsersV2Module],
  });
  SwaggerModule.setup('api/v2/docs', app, documentV2);

  await app.listen(3000);
}
```

---

## Security Guidelines

### Authentication & Authorization

```typescript
// JWT Strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.username,
      email: payload.email,
      role: payload.role,
    };
  }
}

// Role Guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

### Input Validation

```typescript
// DTO with validation
export class CreateUserDto {
  @IsNotEmpty()
  @Length(3, 50)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;

  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase())
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
```

### Rate Limiting

```typescript
// Rate limiting configuration
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  @Post('login')
  @Throttle(5, 60) // 5 requests per minute
  async login(@Body() loginDto: LoginDto) {
    // Login logic
  }

  @Post('register')
  @Throttle(3, 60) // 3 requests per minute
  async register(@Body() registerDto: RegisterDto) {
    // Registration logic
  }
}
```

### CORS Configuration

```typescript
// main.ts
app.enableCors({
  origin: [
    'http://localhost:3001', // Frontend development
    'https://edu-review-hub.com', // Production frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
```

---

## Performance Optimization

### Database Optimization

```typescript
// Pagination with proper indexing
@Entity()
@Index(['createdAt'])
@Index(['status', 'universityId'])
export class UniversityReview {
  // Entity definition
}

// Efficient queries
async findReviewsByUniversity(
  universityId: number,
  options: PaginationOptions
): Promise<PaginatedResult<UniversityReview>> {
  const queryBuilder = this.reviewRepository
    .createQueryBuilder('review')
    .leftJoinAndSelect('review.user', 'user')
    .leftJoinAndSelect('review.scores', 'scores')
    .where('review.universityId = :universityId', { universityId })
    .andWhere('review.status = :status', { status: 'APPROVED' })
    .orderBy('review.createdAt', 'DESC')
    .skip(options.offset)
    .take(options.limit);

  const [reviews, total] = await queryBuilder.getManyAndCount();
  
  return {
    data: reviews,
    total,
    page: options.page,
    limit: options.limit,
  };
}
```

### Caching Strategy

```typescript
// Redis caching
@Injectable()
export class UniversityService {
  constructor(
    @InjectRepository(University)
    private universityRepository: Repository<University>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findById(id: number): Promise<University> {
    const cacheKey = `university:${id}`;
    let university = await this.cacheManager.get<University>(cacheKey);

    if (!university) {
      university = await this.universityRepository.findOne({
        where: { id },
        relations: ['reviews'],
      });
      
      if (university) {
        await this.cacheManager.set(cacheKey, university, 300); // 5 minutes
      }
    }

    return university;
  }
}
```

### Frontend Optimization

```typescript
// React optimization patterns
import { memo, useMemo, useCallback } from 'react';

const UniversityCard = memo(({ university, onFavorite }) => {
  const formattedRating = useMemo(() => {
    return university.averageRating?.toFixed(1) || 'N/A';
  }, [university.averageRating]);

  const handleFavoriteClick = useCallback(() => {
    onFavorite(university.id);
  }, [university.id, onFavorite]);

  return (
    <div className="university-card">
      {/* Card content */}
    </div>
  );
});

// Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';

const UniversityList = ({ universities }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <UniversityCard university={universities[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={universities.length}
      itemSize={200}
    >
      {Row}
    </List>
  );
};
```

---

## Monitoring and Logging

### Application Logging

```typescript
// Custom logger
@Injectable()
export class AppLogger {
  private logger = new Logger(AppLogger.name);

  logInfo(message: string, context?: any) {
    this.logger.log(message, context);
  }

  logError(message: string, error: Error, context?: any) {
    this.logger.error(message, error.stack, context);
  }

  logWarn(message: string, context?: any) {
    this.logger.warn(message, context);
  }
}

// Usage in service
@Injectable()
export class AuthService {
  constructor(private logger: AppLogger) {}

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      this.logger.logInfo('User login attempt', { email: loginDto.identifier });
      
      // Login logic
      
      this.logger.logInfo('User login successful', { userId: user.id });
      return authResponse;
    } catch (error) {
      this.logger.logError('User login failed', error, { email: loginDto.identifier });
      throw error;
    }
  }
}
```

### Health Checks

```typescript
// Health check controller
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redis.checkHealth('redis'),
    ]);
  }
}
```

### Error Tracking

```typescript
// Global exception filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    this.logger.error(
      `HTTP Status: ${status} Error Message: ${message}`,
      exception instanceof Error ? exception.stack : 'Unknown error',
    );

    response.status(status).json(errorResponse);
  }
}
```

---

## Contributing Guidelines

### Code Style

```typescript
// .eslintrc.js
module.exports = {
  extends: [
    '@nestjs/eslint-config',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
  },
};

// .prettierrc
{
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 100
}
```

### Pull Request Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] Documentation has been updated
- [ ] No new warnings introduced
```

---

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U postgres -d edu_review_hub

# Reset database
npm run migration:revert
npm run migration:run
```

#### Frontend Build Issues
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check for TypeScript errors
npm run type-check

# Update dependencies
npm update
```

#### Mobile Build Issues
```bash
# Clean Flutter build
flutter clean
flutter pub get

# Update Flutter
flutter upgrade

# Check for platform-specific issues
flutter doctor
```

### Performance Issues

#### Database Performance
```sql
-- Check slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check index usage
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE tablename = 'university_reviews';
```

#### Memory Issues
```bash
# Check Node.js memory usage
node --max-old-space-size=4096 dist/main.js

# Monitor memory
htop
ps aux | grep node
```

### Debugging

#### Backend Debugging
```typescript
// Debug configuration (launch.json)
{
  "type": "node",
  "request": "launch",
  "name": "Debug NestJS",
  "program": "${workspaceFolder}/dist/main.js",
  "env": {
    "NODE_ENV": "development"
  },
  "console": "integratedTerminal",
  "restart": true,
  "protocol": "inspector"
}
```

#### Frontend Debugging
```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Next.js: debug server-side",
  "program": "${workspaceFolder}/node_modules/.bin/next",
  "args": ["dev"],
  "console": "integratedTerminal"
}
```

---

This comprehensive development guide provides everything needed to work effectively with the Edu Review Hub project, from initial setup to production deployment and maintenance.