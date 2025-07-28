# 🎨 Frontend Documentation

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [UI Components](#ui-components)
- [App Components](#app-components)
- [Hooks](#hooks)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Styling](#styling)
- [Routing](#routing)
- [Authentication Flow](#authentication-flow)
- [Component Examples](#component-examples)
- [Best Practices](#best-practices)

## Overview

The frontend is built with **Next.js 14** using the App Router, **React 18**, **TypeScript**, **Tailwind CSS**, and **Redux Toolkit** for state management. The project follows modern React patterns and implements a component-based architecture.

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **State Management**: Redux Toolkit
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **HTTP Client**: Custom API utilities
- **Theme**: Dark/Light mode support

---

## Project Structure

```
frontend/edu-review-frontend/src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── profile/           # User profile pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── app/               # App-specific components
│   ├── ui/                # UI primitives
│   └── theme-provider.tsx # Theme provider
├── features/              # Feature-based components
│   └── landing/           # Landing page features
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
│   ├── services/          # API services
│   ├── api.ts             # API configuration
│   ├── store.ts           # Redux store
│   └── utils.ts           # Utility functions
└── styles/                # Global styles
```

---

## UI Components

### Button Component

A versatile button component with multiple variants and sizes.

**Location**: `src/components/ui/button.tsx`

```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  // ... other button props
}
```

**Usage:**
```tsx
import { Button } from '@/components/ui/button';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost Button</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">👍</Button>

// As child (renders as different element)
<Button asChild>
  <Link href="/profile">Go to Profile</Link>
</Button>
```

**Variants:**
- `default`: Primary blue button
- `destructive`: Red button for dangerous actions
- `outline`: Outlined button
- `secondary`: Secondary color scheme
- `ghost`: Transparent background
- `link`: Text button with underline

---

### Input Component

Styled input component with focus states and error handling.

**Location**: `src/components/ui/input.tsx`

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}
```

**Usage:**
```tsx
import { Input } from '@/components/ui/input';

<Input 
  type="email" 
  placeholder="Enter your email"
  className="w-full"
/>

<Input 
  type="password" 
  placeholder="Password"
  required
/>
```

---

### Alert Component

Alert component for displaying messages, warnings, and errors.

**Location**: `src/components/ui/alert.tsx`

```typescript
interface AlertProps {
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
  className?: string;
}
```

**Usage:**
```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

<Alert>
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Your profile has been updated successfully.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Failed to save your changes. Please try again.
  </AlertDescription>
</Alert>
```

---

### Avatar Dropdown Component

User avatar with dropdown menu for profile actions.

**Location**: `src/components/ui/avatar-dropdown.tsx`

```typescript
interface AvatarDropdownProps {
  user: {
    username: string;
    email: string;
    avatarUrl?: string;
    role: string;
  };
  onLogout: () => void;
}
```

**Usage:**
```tsx
import { AvatarDropdown } from '@/components/ui/avatar-dropdown';

<AvatarDropdown
  user={{
    username: "johndoe",
    email: "john@example.com",
    avatarUrl: "/avatars/john.jpg",
    role: "STUDENT"
  }}
  onLogout={handleLogout}
/>
```

**Features:**
- Displays user avatar or initials
- Dropdown with profile, settings, and logout options
- Role-based menu items
- Keyboard navigation support

---

### Dropdown Menu Component

Flexible dropdown menu component built on Radix UI.

**Location**: `src/components/ui/dropdown-menu.tsx`

```typescript
// Main components exported
- DropdownMenu
- DropdownMenuTrigger
- DropdownMenuContent
- DropdownMenuItem
- DropdownMenuCheckboxItem
- DropdownMenuRadioItem
- DropdownMenuLabel
- DropdownMenuSeparator
- DropdownMenuShortcut
- DropdownMenuGroup
- DropdownMenuPortal
- DropdownMenuSub
- DropdownMenuSubContent
- DropdownMenuSubTrigger
- DropdownMenuRadioGroup
```

**Usage:**
```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      Profile
    </DropdownMenuItem>
    <DropdownMenuItem>
      Settings
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      Log out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### Mode Toggle Component

Theme toggle component for switching between light and dark mode.

**Location**: `src/components/ui/mode-toggle.tsx`

```typescript
interface ModeToggleProps {
  className?: string;
}
```

**Usage:**
```tsx
import { ModeToggle } from '@/components/ui/mode-toggle';

<ModeToggle />
```

**Features:**
- Toggles between light, dark, and system theme
- Smooth transitions
- System preference detection
- Persistent theme storage

---

## App Components

### Theme Provider

Global theme provider that manages dark/light mode state.

**Location**: `src/components/theme-provider.tsx`

```typescript
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}
```

**Usage:**
```tsx
import { ThemeProvider } from '@/components/theme-provider';

<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

---

## Hooks

### Custom Hooks Location
`src/hooks/` - Custom React hooks for reusable logic

**Common Hook Patterns:**

```typescript
// useAuth.ts - Authentication hook
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const login = useCallback(async (credentials: LoginDto) => {
    return dispatch(authApi.endpoints.login.initiate(credentials));
  }, [dispatch]);
  
  const logout = useCallback(() => {
    dispatch(authActions.logout());
  }, [dispatch]);
  
  return { user, isLoading, error, login, logout };
};

// useLocalStorage.ts - Local storage hook
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue] as const;
};
```

---

## API Integration

### API Configuration

**Location**: `src/lib/api.ts`

```typescript
interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

class ApiClient {
  private config: ApiConfig;
  
  constructor(config: ApiConfig) {
    this.config = config;
  }
  
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Implementation with error handling, auth tokens, etc.
  }
  
  get<T>(endpoint: string, params?: Record<string, any>): Promise<T>;
  post<T>(endpoint: string, data?: any): Promise<T>;
  patch<T>(endpoint: string, data?: any): Promise<T>;
  delete<T>(endpoint: string): Promise<T>;
}

export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### API Utilities

**Location**: `src/lib/apiUtils.ts`

```typescript
// Request interceptors
export const addAuthToken = (config: RequestInit): RequestInit => {
  const token = getAuthToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
};

// Response interceptors
export const handleApiError = (error: any): never => {
  if (error.status === 401) {
    // Redirect to login
    window.location.href = '/auth/login';
  }
  throw error;
};

// Utility functions
export const buildQueryString = (params: Record<string, any>): string => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });
  return query.toString();
};
```

### Service Classes

**Location**: `src/lib/services/`

```typescript
// auth.service.ts
export class AuthService {
  async register(data: RegisterDto): Promise<AuthResponse> {
    return apiClient.post('/auth/register', data);
  }
  
  async login(data: LoginDto): Promise<AuthResponse> {
    return apiClient.post('/auth/login', data);
  }
  
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post('/auth/refresh', { refreshToken });
  }
  
  async logout(deviceId?: string): Promise<void> {
    return apiClient.post('/auth/logout', { deviceId });
  }
}

// university.service.ts
export class UniversityService {
  async getUniversities(params?: PaginationParams): Promise<University[]> {
    const queryString = params ? `?${buildQueryString(params)}` : '';
    return apiClient.get(`/universities${queryString}`);
  }
  
  async getUniversityById(id: number): Promise<University> {
    return apiClient.get(`/universities/${id}`);
  }
  
  async createUniversity(data: CreateUniversityDto): Promise<University> {
    return apiClient.post('/universities', data);
  }
}
```

---

## State Management

### Redux Store Configuration

**Location**: `src/lib/store.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slices/authSlice';
import { universitySlice } from './slices/universitySlice';
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    university: universitySlice.reducer,
    api: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Auth Slice Example

```typescript
// slices/authSlice.ts
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
    },
  },
});
```

### Redux Provider

**Location**: `src/lib/providers.tsx`

```typescript
'use client';

import { Provider } from 'react-redux';
import { store } from './store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
```

---

## Styling

### Tailwind Configuration

The project uses Tailwind CSS with custom color schemes and design tokens.

**Configuration**: `tailwind.config.js`

```javascript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          // ... full color scale
          900: '#1e3a8a',
        },
        // Custom color schemes
      },
      fontFamily: {
        sans: ['var(--font-roboto)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### CSS Variables

**Location**: `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Light mode colors */
  --primary-50: 239 246 255;
  --primary-600: 37 99 235;
  --primary-700: 29 78 216;
  
  /* ... other color variables */
}

.dark {
  /* Dark mode colors */
  --primary-50: 23 37 84;
  --primary-600: 96 165 250;
  --primary-700: 59 130 246;
  
  /* ... other dark mode variables */
}

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700 
           focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  }
}
```

---

## Routing

### App Router Structure

The project uses Next.js 14 App Router with the following structure:

```
src/app/
├── layout.tsx              # Root layout
├── page.tsx               # Home page (/)
├── auth/
│   ├── login/
│   │   └── page.tsx       # Login page (/auth/login)
│   ├── register/
│   │   └── page.tsx       # Register page (/auth/register)
│   └── layout.tsx         # Auth layout
├── dashboard/
│   ├── page.tsx           # Dashboard (/dashboard)
│   └── layout.tsx         # Dashboard layout
└── profile/
    ├── page.tsx           # Profile page (/profile)
    └── settings/
        └── page.tsx       # Settings (/profile/settings)
```

### Layout Components

```typescript
// app/layout.tsx - Root Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} antialiased`}>
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx - Dashboard Layout
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
```

### Navigation

```typescript
// components/navigation.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/universities', label: 'Universities' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/blogs', label: 'Blogs' },
];

export function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav className="space-y-2">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'block px-3 py-2 rounded-md text-sm font-medium',
            pathname === item.href
              ? 'bg-primary-100 text-primary-900'
              : 'text-gray-600 hover:bg-gray-50'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
```

---

## Authentication Flow

### Protected Routes

```typescript
// components/auth/protected-route.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  fallback = <LoginRedirect />
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return fallback;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <UnauthorizedMessage />;
  }
  
  return <>{children}</>;
}
```

### Auth Context

```typescript
// contexts/auth-context.tsx
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  register: (data: RegisterDto) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Auth methods implementation...
  
  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## Component Examples

### Login Form Component

```typescript
// components/auth/login-form.tsx
interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const [credentials, setCredentials] = useState<LoginDto>({
    identifier: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.login(credentials);
      onSuccess?.();
    } catch (error) {
      onError?.(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="identifier" className="block text-sm font-medium">
          Email or Username
        </label>
        <Input
          id="identifier"
          type="text"
          value={credentials.identifier}
          onChange={(e) => setCredentials({ 
            ...credentials, 
            identifier: e.target.value 
          })}
          required
          className="mt-1"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({ 
            ...credentials, 
            password: e.target.value 
          })}
          required
          className="mt-1"
        />
      </div>
      
      <div className="flex items-center">
        <input
          id="remember-me"
          type="checkbox"
          checked={credentials.rememberMe}
          onChange={(e) => setCredentials({ 
            ...credentials, 
            rememberMe: e.target.checked 
          })}
          className="h-4 w-4 text-primary-600 rounded"
        />
        <label htmlFor="remember-me" className="ml-2 text-sm">
          Remember me
        </label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
```

### University Card Component

```typescript
// components/university/university-card.tsx
interface UniversityCardProps {
  university: University;
  onViewDetails?: (id: number) => void;
  onWriteReview?: (id: number) => void;
}

export function UniversityCard({ 
  university, 
  onViewDetails, 
  onWriteReview 
}: UniversityCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {university.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {university.location}
          </p>
        </div>
        
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium">
            {university.averageRating?.toFixed(1) || 'N/A'}
          </span>
        </div>
      </div>
      
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
        {university.description}
      </p>
      
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Est. {university.establishedYear}</span>
        <span>{university.studentCount?.toLocaleString()} students</span>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onViewDetails?.(university.id)}
        >
          View Details
        </Button>
        <Button 
          size="sm"
          onClick={() => onWriteReview?.(university.id)}
        >
          Write Review
        </Button>
      </div>
    </div>
  );
}
```

---

## Best Practices

### Component Structure

1. **Keep components small and focused** - Single responsibility principle
2. **Use TypeScript interfaces** - Define clear prop types
3. **Implement proper error boundaries** - Handle errors gracefully
4. **Use React.memo** for performance optimization
5. **Extract custom hooks** - Reuse stateful logic

### State Management

1. **Use local state for component-specific data**
2. **Use Redux for global application state**
3. **Implement proper error handling in async actions**
4. **Use RTK Query for server state management**
5. **Keep state normalized and flat**

### Performance

1. **Implement code splitting** with dynamic imports
2. **Use React.lazy** for route-based code splitting
3. **Optimize images** with Next.js Image component
4. **Implement proper loading states**
5. **Use React.memo and useMemo wisely**

### Accessibility

1. **Use semantic HTML elements**
2. **Implement proper ARIA attributes**
3. **Ensure keyboard navigation**
4. **Maintain proper color contrast**
5. **Provide alternative text for images**

### Testing

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
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

### File Organization

```typescript
// Preferred import order
import React from 'react';                    // React imports
import { useState, useEffect } from 'react';  // React hooks
import { NextPage } from 'next';              // Next.js imports
import { useRouter } from 'next/navigation';  // Next.js hooks

import { Button } from '@/components/ui/button';  // UI components
import { LoginForm } from '@/components/auth';    // Feature components
import { useAuth } from '@/hooks/useAuth';        // Custom hooks
import { apiClient } from '@/lib/api';            // Utilities
import { cn } from '@/lib/utils';                 // Helper functions

import type { User } from '@/types';              // Type imports
```

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

---

## Build and Deployment

### Development
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # Run TypeScript checks
```

### Production Optimization
- Code splitting by routes and components
- Image optimization with Next.js Image
- Bundle analysis with @next/bundle-analyzer
- Performance monitoring with Web Vitals
- SEO optimization with next-seo