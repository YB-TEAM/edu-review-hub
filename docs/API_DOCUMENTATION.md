# 📚 API Documentation

## Table of Contents

- [Authentication APIs](#authentication-apis)
- [User Profile APIs](#user-profile-apis)  
- [University APIs](#university-apis)
- [University Review APIs](#university-review-apis)
- [Blog APIs](#blog-apis)
- [Email Verification APIs](#email-verification-apis)
- [User Activity APIs](#user-activity-apis)
- [Account Management APIs](#account-management-apis)
- [Data Transfer Objects (DTOs)](#data-transfer-objects-dtos)
- [Authentication & Authorization](#authentication--authorization)
- [Error Handling](#error-handling)

## Base URL

```
Development: http://localhost:3000/api
Production: https://api.edu-review-hub.com/api
```

## Authentication APIs

### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "username": "string (3-50 chars)",
  "email": "string (valid email)",
  "password": "string (8-128 chars)",
  "phone": "string (optional, max 20 chars)",
  "accountType": "STUDENT | UNIVERSITY_REP | ADMIN | SUPER_ADMIN",
  "deviceId": "string (optional)",
  "ip": "string (optional)",
  "userAgent": "string (optional)"
}
```

**Response (201):**
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "role": "string",
    "isEmailVerified": "boolean"
  }
}
```

**Errors:**
- `409`: Email or username already exists
- `400`: Validation error

---

### POST /auth/login

Authenticate user and get access token.

**Request Body:**
```json
{
  "identifier": "string (email or username)",
  "password": "string",
  "deviceId": "string (optional)",
  "rememberMe": "boolean (optional)"
}
```

**Response (200):**
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "role": "string",
    "isEmailVerified": "boolean"
  }
}
```

**Errors:**
- `401`: Invalid credentials

---

### POST /auth/refresh

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "string",
  "deviceId": "string (optional)"
}
```

**Response (200):**
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Errors:**
- `401`: Invalid refresh token

---

### POST /auth/logout

Logout user and invalidate tokens.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "deviceId": "string (optional)"
}
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

## User Profile APIs

### GET /profile/me

Get current user's profile information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": "number",
  "username": "string",
  "email": "string",
  "phone": "string",
  "avatarUrl": "string",
  "firstName": "string",
  "lastName": "string",
  "bio": "string",
  "dateOfBirth": "string (ISO date)",
  "gender": "string",
  "university": "string",
  "major": "string",
  "graduationYear": "number",
  "role": "string",
  "isEmailVerified": "boolean",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

---

### PATCH /profile/me

Update current user's profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phone": "string (optional)",
  "bio": "string (optional)",
  "dateOfBirth": "string (optional, ISO date)",
  "gender": "string (optional)",
  "university": "string (optional)",
  "major": "string (optional)",
  "graduationYear": "number (optional)"
}
```

**Response (200):**
```json
{
  // Updated profile object (same as GET /profile/me)
}
```

---

### POST /profile/me/avatar

Upload avatar image for current user.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:**
```
file: File (image)
```

**Response (200):**
```json
{
  "avatarUrl": "string"
}
```

---

### PATCH /profile/admin/user/:userId

Admin endpoint to update user information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Parameters:**
- `userId`: number (required) - Target user ID

**Request Body:**
```json
{
  "username": "string (optional)",
  "email": "string (optional)",
  "role": "string (optional)",
  "isActive": "boolean (optional)",
  "isEmailVerified": "boolean (optional)"
}
```

**Response (200):**
```json
{
  // Updated user profile object
}
```

---

### GET /profile/admin/users

Admin endpoint to get all users.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
[
  {
    // User profile objects
  }
]
```

---

## University APIs

### GET /universities

Get list of universities with pagination.

**Query Parameters:**
- `page`: number (optional) - Page number (default: 1)
- `limit`: number (optional) - Items per page (default: 10)

**Response (200):**
```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "location": "string",
    "website": "string",
    "establishedYear": "number",
    "studentCount": "number",
    "averageRating": "number",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  }
]
```

---

### GET /universities/:id

Get university details by ID.

**Parameters:**
- `id`: number (required) - University ID

**Response (200):**
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "location": "string",
  "website": "string",
  "establishedYear": "number",
  "studentCount": "number",
  "averageRating": "number",
  "reviews": [
    {
      "id": "number",
      "content": "string",
      "overallRating": "number",
      "createdAt": "string (ISO date)",
      "user": {
        "username": "string",
        "avatarUrl": "string"
      }
    }
  ],
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

---

### POST /universities

Create a new university (Super Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "location": "string (required)",
  "website": "string (optional)",
  "establishedYear": "number (optional)",
  "studentCount": "number (optional)"
}
```

**Response (201):**
```json
{
  // Created university object
}
```

---

### PATCH /universities/:id

Update university information (Super Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Parameters:**
- `id`: number (required) - University ID

**Request Body:**
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "location": "string (optional)",
  "website": "string (optional)",
  "establishedYear": "number (optional)",
  "studentCount": "number (optional)"
}
```

**Response (200):**
```json
{
  // Updated university object
}
```

---

### DELETE /universities/:id

Delete university (Super Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Parameters:**
- `id`: number (required) - University ID

**Response (200):**
```json
{
  "message": "University deleted successfully"
}
```

---

## University Review APIs

### GET /university-reviews/:id

Get review by ID.

**Parameters:**
- `id`: number (required) - Review ID

**Response (200):**
```json
{
  "id": "number",
  "content": "string",
  "overallRating": "number",
  "status": "PENDING | APPROVED | REJECTED",
  "university": {
    "id": "number",
    "name": "string"
  },
  "user": {
    "id": "number",
    "username": "string",
    "avatarUrl": "string"
  },
  "scores": [
    {
      "criterionId": "number",
      "criterionName": "string",
      "score": "number"
    }
  ],
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

---

### GET /university-reviews/university/:universityId

Get all reviews for a specific university.

**Parameters:**
- `universityId`: number (required) - University ID

**Response (200):**
```json
[
  {
    // Review objects (same structure as GET /university-reviews/:id)
  }
]
```

---

### GET /university-reviews/user/:userId

Get all reviews by a specific user (Super Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Parameters:**
- `userId`: number (required) - User ID

**Response (200):**
```json
[
  {
    // Review objects
  }
]
```

---

### POST /university-reviews

Create a new university review (Student only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "universityId": "number (required)",
  "content": "string (required)",
  "scores": [
    {
      "criterionId": "number (required)",
      "score": "number (required, 1-10)"
    }
  ]
}
```

**Response (201):**
```json
{
  // Created review object
}
```

---

### PATCH /university-reviews/:id

Update own review (Student only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Parameters:**
- `id`: number (required) - Review ID

**Request Body:**
```json
{
  "content": "string (optional)",
  "scores": [
    {
      "criterionId": "number",
      "score": "number (1-10)"
    }
  ]
}
```

**Response (200):**
```json
{
  // Updated review object
}
```

---

### DELETE /university-reviews/:id

Delete own review (Student only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Parameters:**
- `id`: number (required) - Review ID

**Response (200):**
```json
{
  "message": "Review deleted successfully"
}
```

---

### PATCH /university-reviews/:id/moderate

Moderate a review (Admin/Moderator only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Parameters:**
- `id`: number (required) - Review ID

**Request Body:**
```json
{
  "status": "APPROVED | REJECTED"
}
```

**Response (200):**
```json
{
  // Updated review object
}
```

---

## Blog APIs

### GET /blogs

Get list of blog posts with pagination.

**Query Parameters:**
- `page`: number (optional) - Page number
- `limit`: number (optional) - Items per page

**Response (200):**
```json
{
  "data": [
    {
      "id": "number",
      "title": "string",
      "content": "string",
      "slug": "string",
      "status": "DRAFT | PUBLISHED | ARCHIVED",
      "featuredImage": "string",
      "author": {
        "id": "number",
        "username": "string",
        "avatarUrl": "string"
      },
      "createdAt": "string (ISO date)",
      "updatedAt": "string (ISO date)"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

---

### GET /blogs/:id

Get blog post by ID.

**Parameters:**
- `id`: number (required) - Blog ID

**Response (200):**
```json
{
  "id": "number",
  "title": "string",
  "content": "string",
  "slug": "string",
  "status": "string",
  "featuredImage": "string",
  "tags": ["string"],
  "author": {
    "id": "number",
    "username": "string",
    "avatarUrl": "string"
  },
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

---

### POST /blogs

Create a new blog post.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "string (required)",
  "content": "string (required)",
  "slug": "string (optional)",
  "status": "DRAFT | PUBLISHED",
  "featuredImage": "string (optional)",
  "tags": ["string"]
}
```

**Response (201):**
```json
{
  // Created blog object
}
```

---

### PATCH /blogs/:id

Update blog post.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Parameters:**
- `id`: number (required) - Blog ID

**Request Body:**
```json
{
  "title": "string (optional)",
  "content": "string (optional)",
  "slug": "string (optional)",
  "status": "string (optional)",
  "featuredImage": "string (optional)",
  "tags": ["string"]
}
```

**Response (200):**
```json
{
  // Updated blog object
}
```

---

### DELETE /blogs/:id

Delete blog post.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Parameters:**
- `id`: number (required) - Blog ID

**Response (200):**
```json
{
  "message": "Blog deleted successfully"
}
```

---

### PATCH /blogs/:id/moderate

Moderate blog post (Admin/Moderator only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Parameters:**
- `id`: number (required) - Blog ID

**Request Body:**
```json
{
  "status": "APPROVED | REJECTED",
  "moderationNote": "string (optional)"
}
```

**Response (200):**
```json
{
  // Updated blog object
}
```

---

## Email Verification APIs

### POST /email-verification/verify-email

Verify email address with OTP.

**Request Body:**
```json
{
  "otp": "string (6-digit code)",
  "email": "string (email address)"
}
```

**Response (200):**
```json
{
  "message": "Email verified successfully"
}
```

**Errors:**
- `400`: Invalid or expired code
- `404`: Code not found

---

### POST /email-verification/resend-verification

Resend email verification code.

**Request Body:**
```json
{
  "email": "string (email address)"
}
```

**Response (200):**
```json
{
  "message": "Verification email sent"
}
```

**Errors:**
- `400`: Email already verified
- `404`: User not found

---

### POST /email-verification/forgot-password

Send password reset email.

**Request Body:**
```json
{
  "email": "string (email address)"
}
```

**Response (200):**
```json
{
  "message": "Password reset email sent"
}
```

---

### POST /email-verification/reset-password

Reset password with OTP.

**Request Body:**
```json
{
  "otp": "string (6-digit code)",
  "email": "string (email address)",
  "newPassword": "string (new password)"
}
```

**Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

**Errors:**
- `400`: Invalid or expired code
- `404`: Code not found

---

### POST /email-verification/change-email

Request email change (authenticated users).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "email": "string (new email address)"
}
```

**Response (200):**
```json
{
  "message": "Email change confirmation sent"
}
```

---

### POST /email-verification/confirm-email-change

Confirm email change with OTP.

**Request Body:**
```json
{
  "otp": "string (6-digit code)",
  "email": "string (new email address)"
}
```

**Response (200):**
```json
{
  "message": "Email changed successfully"
}
```

---

## Data Transfer Objects (DTOs)

### RegisterDto
```typescript
{
  username: string;      // 3-50 characters
  email: string;         // Valid email format
  password: string;      // 8-128 characters
  phone?: string;        // Optional, max 20 characters
  accountType?: UserRole; // Default: STUDENT
  deviceId?: string;     // Optional device identifier
  ip?: string;          // Optional IP address
  userAgent?: string;   // Optional user agent
}
```

### LoginDto
```typescript
{
  identifier: string;    // Email or username
  password: string;      // User password
  deviceId?: string;     // Optional device identifier
  rememberMe?: boolean;  // Optional remember me flag
}
```

### CreateUniversityReviewDto
```typescript
{
  universityId: number;  // Target university ID
  content: string;       // Review content
  scores: Array<{        // Review scores by criteria
    criterionId: number; // Criterion ID
    score: number;       // Score (1-10)
  }>;
}
```

### UpdateProfileDto
```typescript
{
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  dateOfBirth?: string;  // ISO date format
  gender?: string;
  university?: string;
  major?: string;
  graduationYear?: number;
}
```

---

## Authentication & Authorization

### User Roles
- `STUDENT`: Can create reviews, blogs, and manage own profile
- `UNIVERSITY_REP`: University representative with extended permissions
- `MODERATOR`: Can moderate content
- `ADMIN`: Administrative access
- `SUPER_ADMIN`: Full system access

### Permissions
The system uses role-based and permission-based access control:

- `review:create` - Create university reviews
- `review:moderate` - Moderate reviews
- `blog:create` - Create blog posts
- `blog:moderate` - Moderate blog posts
- `university:create` - Create universities
- `university:update` - Update universities
- `university:delete` - Delete universities

### JWT Token Structure
```json
{
  "sub": "user_id",
  "username": "user_username",
  "email": "user_email",
  "role": "user_role",
  "permissions": ["permission1", "permission2"],
  "iat": "issued_at",
  "exp": "expires_at"
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "statusCode": "number",
  "message": "string or array of strings",
  "error": "string",
  "timestamp": "string (ISO date)",
  "path": "string"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `422`: Unprocessable Entity
- `500`: Internal Server Error

### Validation Errors
Validation errors return detailed information about invalid fields:

```json
{
  "statusCode": 400,
  "message": [
    "username must be at least 3 characters long",
    "email must be a valid email address"
  ],
  "error": "Bad Request"
}
```

---

## Rate Limiting

API endpoints are protected with rate limiting:

- Authentication endpoints: 5 requests per minute
- General API endpoints: 100 requests per minute
- File upload endpoints: 10 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

---

## API Examples

### Complete User Registration Flow

1. **Register User**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123",
    "accountType": "STUDENT"
  }'
```

2. **Verify Email**
```bash
curl -X POST http://localhost:3000/api/email-verification/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "otp": "123456",
    "email": "john@example.com"
  }'
```

3. **Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "john@example.com",
    "password": "securepassword123"
  }'
```

4. **Update Profile**
```bash
curl -X PATCH http://localhost:3000/api/profile/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "university": "MIT",
    "major": "Computer Science"
  }'
```

### Creating a University Review

```bash
curl -X POST http://localhost:3000/api/university-reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "universityId": 1,
    "content": "Great university with excellent facilities.",
    "scores": [
      {"criterionId": 1, "score": 9},
      {"criterionId": 2, "score": 8},
      {"criterionId": 3, "score": 7}
    ]
  }'
```

---

## Swagger Documentation

Interactive API documentation is available at:
```
http://localhost:3000/api/docs
```

The Swagger UI provides:
- Interactive endpoint testing
- Request/response schemas
- Authentication testing
- Code generation examples