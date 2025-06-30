# RTK Query Setup & Usage Guide

## Overview

This project uses RTK Query for efficient API management with built-in caching, error handling, and optimistic updates.

## Architecture

```
src/lib/
├── api.ts              # Base API configuration with error handling
├── store.ts            # Redux store setup
├── providers.tsx       # Redux Provider component
├── apiUtils.ts         # Utility functions for API handling
└── services/           # API service modules
    ├── authApi.ts      # Authentication endpoints
    ├── reviewApi.ts    # Review management endpoints
    ├── courseApi.ts    # Course management endpoints
    └── institutionApi.ts # Institution management endpoints
```

## Features

### ✅ Error Handling

- Automatic error categorization (network, auth, validation, server)
- Centralized error message formatting
- Automatic token refresh and redirect on auth errors

### ✅ Caching

- Automatic cache invalidation
- Optimistic updates
- Background refetching

### ✅ Type Safety

- Full TypeScript support
- Generated hooks with proper typing
- Request/response type definitions

### ✅ Loading States

- Built-in loading indicators
- Skeleton loading support
- Optimistic UI updates

## Usage Examples

### Basic Query

```tsx
import { useGetReviewsQuery } from "@/lib/services/reviewApi";

function ReviewList() {
  const { data, isLoading, isError, error } = useGetReviewsQuery({
    page: 1,
    limit: 10,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {getErrorMessage(error)}</div>;

  return (
    <div>
      {data?.data.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
```

### Mutation with Error Handling

```tsx
import { useCreateReviewMutation } from "@/lib/services/reviewApi";
import {
  getErrorMessage,
  showSuccessToast,
  showErrorToast,
} from "@/lib/apiUtils";

function CreateReview() {
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (formData) => {
    try {
      await createReview(formData).unwrap();
      showSuccessToast("Review created successfully!");
    } catch (error) {
      showErrorToast(getErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Review"}
      </button>
    </form>
  );
}
```

### Conditional Queries

```tsx
import { useGetUserReviewsQuery } from "@/lib/services/reviewApi";

function UserReviews({ userId }) {
  const { data, isLoading } = useGetUserReviewsQuery(
    { user_id: userId },
    { skip: !userId } // Skip query if userId is not available
  );

  if (!userId) return <div>Please select a user</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.data.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
```

## Error Handling

### Error Types

- **Network Errors**: Connection issues, timeouts
- **Authentication Errors**: 401 responses, token expiration
- **Validation Errors**: 422 responses with field-specific errors
- **Server Errors**: 5xx responses
- **Client Errors**: 4xx responses (except auth/validation)

### Error Messages

```tsx
import { getErrorMessage } from "@/lib/apiUtils";

// Automatic error message formatting
const errorMessage = getErrorMessage(error);

// Custom error handling
if (isFetchBaseQueryError(error)) {
  switch (error.status) {
    case 401:
      // Handle auth error
      break;
    case 422:
      // Handle validation error
      break;
    default:
    // Handle other errors
  }
}
```

## CSS Classes

### Primary Colors

```css
.bg-primary-50   /* Lightest primary background */
/* Lightest primary background */
.bg-primary-100  /* Very light primary background */
.bg-primary-200  /* Light primary background */
.bg-primary-300  /* Medium light primary background */
.bg-primary-400  /* Medium primary background */
.bg-primary-500  /* Base primary background */
.bg-primary-600  /* Medium dark primary background */
.bg-primary-700  /* Dark primary background */
.bg-primary-800  /* Very dark primary background */
.bg-primary-900  /* Darkest primary background */
.bg-primary-950; /* Darkest primary background */
```

### Text Colors

```css
.text-primary-50   /* Lightest primary text */
/* Lightest primary text */
.text-primary-100  /* Very light primary text */
.text-primary-200  /* Light primary text */
.text-primary-300  /* Medium light primary text */
.text-primary-400  /* Medium primary text */
.text-primary-500  /* Base primary text */
.text-primary-600  /* Medium dark primary text */
.text-primary-700  /* Dark primary text */
.text-primary-800  /* Very dark primary text */
.text-primary-900  /* Darkest primary text */
.text-primary-950; /* Darkest primary text */
```

### Border Colors

```css
.border-primary-50   /* Lightest primary border */
/* Lightest primary border */
.border-primary-100  /* Very light primary border */
.border-primary-200  /* Light primary border */
.border-primary-300  /* Medium light primary border */
.border-primary-400  /* Medium primary border */
.border-primary-500  /* Base primary border */
.border-primary-600  /* Medium dark primary border */
.border-primary-700  /* Dark primary border */
.border-primary-800  /* Very dark primary border */
.border-primary-900  /* Darkest primary border */
.border-primary-950; /* Darkest primary border */
```

### Reusable Component Classes

```css
.btn-primary      /* Primary button styling */
/* Primary button styling */
.btn-secondary    /* Secondary button styling */
.card             /* Card container styling */
.input-field      /* Form input styling */
.badge            /* Badge base styling */
.badge-primary    /* Primary badge styling */
.badge-secondary; /* Secondary badge styling */
```

### Status Colors

```css
/* Success colors */
.bg-success-50, .text-success-50, .border-success-50
.bg-success-100, .text-success-100, .border-success-100
/* ... up to success-950 */

/* Warning colors */
.bg-warning-50, .text-warning-50, .border-warning-50
.bg-warning-100, .text-warning-100, .border-warning-100
/* ... up to warning-950 */

/* Error colors */
.bg-error-50, .text-error-50, .border-error-50
.bg-error-100, .text-error-100, .border-error-100
/* ... up to error-950 */

/* Info colors */
.bg-info-50, .text-info-50, .border-info-50
.bg-info-100, .text-info-100, .border-info-100; /* ... up to info-950 */
```

## Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Best Practices

1. **Use TypeScript**: All API responses and requests are typed
2. **Handle Loading States**: Always show loading indicators
3. **Error Boundaries**: Wrap components with error boundaries
4. **Optimistic Updates**: Use for better UX
5. **Cache Management**: Let RTK Query handle caching automatically
6. **Form Validation**: Use client-side validation before API calls

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows requests from frontend origin
2. **Authentication**: Check token storage and refresh logic
3. **Cache Issues**: Use `invalidateTags` to refresh data
4. **Type Errors**: Ensure API response types match backend

### Debug Tips

1. Enable Redux DevTools in development
2. Check network tab for failed requests
3. Use `console.log` in error handlers
4. Verify API endpoint URLs and methods
