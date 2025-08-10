# EDU Review Hub - Complete API Documentation

## Table of Contents
- [Overview](#overview)
- [User Roles](#user-roles)
- [Authentication APIs](#authentication-apis)
- [Blog Management APIs](#blog-management-apis)
- [University Management APIs](#university-management-apis)
- [Dashboard APIs](#dashboard-apis)
- [Profile Management APIs](#profile-management-apis)
- [Tag Management APIs](#tag-management-apis)
- [Upload APIs](#upload-apis)
- [System Management APIs](#system-management-apis)
- [Activity & User Activity APIs](#activity--user-activity-apis)
- [Email Verification APIs](#email-verification-apis)
- [Account Deactivation APIs](#account-deactivation-apis)
- [Device Management APIs](#device-management-apis)
- [University Review APIs](#university-review-apis)
- [Data Transfer Objects (DTOs) Reference](#data-transfer-objects-dtos-reference)
- [Entity Types Reference](#entity-types-reference)

## Overview

This document provides a comprehensive list of all available APIs in the EDU Review Hub backend system, including detailed information about authentication requirements, user roles, and related data types.

## User Roles

The system supports the following user roles with different permission levels:

- **STUDENT** - Basic user with limited access
- **UNIVERSITY_REP** - University representative with enhanced access
- **MODERATOR** - Content moderator with content management permissions
- **ADMIN** - System administrator with full access
- **SUPER_ADMIN** - Super administrator with highest privileges

## Authentication APIs

| Method | Endpoint | Description | Auth Required | Required Role | Request Body | Response | Related Types |
|--------|----------|-------------|---------------|---------------|--------------|----------|---------------|
| POST | `/auth/register` | Register new user | ❌ Public | None | `RegisterDto` | `RegisterResponseDto` | [RegisterDto](src/application/dto/auth/register.dto.ts), [RegisterResponseDto](src/application/dto/auth/register-response.dto.ts) |
| POST | `/auth/login` | Login user | ❌ Public | None | `LoginDto` | `AuthResponseDto` | [LoginDto](src/application/dto/auth/login.dto.ts), [AuthResponseDto](src/application/dto/auth/auth-response.dto.ts) |
| POST | `/auth/refresh-token` | Refresh access token | ❌ Public | None | `RefreshTokenDto` | `AuthResponseDto` | [RefreshTokenDto](src/application/dto/auth/refresh-token.dto.ts), [AuthResponseDto](src/application/dto/auth/auth-response.dto.ts) |
| POST | `/auth/logout` | Logout user | ✅ JWT | Any authenticated user | None | None | None |
| POST | `/auth/verify-email` | Verify email address | ❌ Public | None | `VerifyEmailDto` | None | [VerifyEmailDto](src/application/dto/auth/verify-email.dto.ts) |
| POST | `/auth/resend-verification` | Resend email verification | ❌ Public | None | `ResendVerificationDto` | None | [ResendVerificationDto](src/application/dto/auth/resend-verification.dto.ts) |
| POST | `/auth/forgot-password` | Request password reset | ❌ Public | None | `ForgotPasswordDto` | None | [ForgotPasswordDto](src/application/dto/auth/forgot-password.dto.ts) |
| POST | `/auth/reset-password` | Reset password | ❌ Public | None | `ResetPasswordDto` | None | [ResetPasswordDto](src/application/dto/auth/reset-password.dto.ts) |
| POST | `/auth/change-email` | Request email change | ✅ JWT | Any authenticated user | `ChangeEmailDto` | None | [ChangeEmailDto](src/application/dto/auth/change-email.dto.ts) |
| POST | `/auth/confirm-email-change` | Confirm email change | ❌ Public | None | `ConfirmEmailChangeDto` | None | [ConfirmEmailChangeDto](src/application/dto/auth/confirm-email-change.dto.ts) |
| POST | `/auth/deactivate-account` | Deactivate account | ✅ JWT | Any authenticated user | `DeactivateAccountDto` | None | [DeactivateAccountDto](src/application/dto/auth/deactivate-account.dto.ts) |
| POST | `/auth/delete-account` | Delete account | ✅ JWT | Any authenticated user | `DeleteAccountDto` | None | [DeleteAccountDto](src/application/dto/auth/delete-account.dto.ts) |

## Blog Management APIs

| Method | Endpoint | Description | Auth Required | Required Role | Request Body | Response | Related Types |
|--------|----------|-------------|---------------|---------------|--------------|----------|---------------|
| GET | `/blogs` | Get all approved blogs | 🔓 Optional | None | None | `BlogResponseDto[]` | [BlogResponseDto](src/application/dto/blog/blog-response.dto.ts), [BlogPublicQueryDto](src/application/dto/blog/blog-public-query.dto.ts) |
| GET | `/blogs/public/:id` | Get public blog by ID | ❌ Public | None | None | `BlogResponseDto` | [BlogResponseDto](src/application/dto/blog/blog-response.dto.ts) |
| GET | `/blogs/my-blogs` | Get user's own blogs | ✅ JWT | Any authenticated user | None | `BlogResponseDto[]` | [BlogResponseDto](src/application/dto/blog/blog-response.dto.ts), [PaginationDto](src/application/dto/pagination/pagination.dto.ts) |
| GET | `/blogs/pending-moderation` | Get blogs pending moderation | ✅ JWT | MODERATOR, ADMIN, SUPER_ADMIN | None | `BlogResponseDto[]` | [BlogResponseDto](src/application/dto/blog/blog-response.dto.ts), [PaginationDto](src/application/dto/pagination/pagination.dto.ts) |
| GET | `/blogs/admin/all` | Get all blogs (admin) | ✅ JWT | ADMIN, SUPER_ADMIN | None | `BlogResponseDto[]` | [BlogResponseDto](src/application/dto/blog/blog-response.dto.ts), [BlogQueryDto](src/application/dto/blog/blog-query.dto.ts) |
| GET | `/blogs/:id` | Get blog by ID | ✅ JWT | Any authenticated user | None | `BlogResponseDto` | [BlogResponseDto](src/application/dto/blog/blog-response.dto.ts) |
| POST | `/blogs` | Create new blog | ✅ JWT | Any authenticated user | `CreateBlogDto` | `BlogResponseDto` | [CreateBlogDto](src/application/dto/blog/create-blog.dto.ts), [BlogResponseDto](src/application/dto/blog/blog-response.dto.ts) |
| PATCH | `/blogs/:id` | Update blog | ✅ JWT | Blog owner or ADMIN/SUPER_ADMIN | `UpdateBlogDto` | `BlogResponseDto` | [UpdateBlogDto](src/application/dto/blog/update-blog.dto.ts), [BlogResponseDto](src/application/dto/blog/blog-response.dto.ts) |
| POST | `/blogs/:id/publish` | Publish blog | ✅ JWT | Blog owner or ADMIN/SUPER_ADMIN | None | `BlogResponseDto` | [BlogResponseDto](src/application/dto/blog/blog-response.dto.ts) |
| POST | `/blogs/:id/like` | Like/unlike blog | ✅ JWT | Any authenticated user | None | None | None |
| DELETE | `/blogs/:id` | Delete blog | ✅ JWT | Blog owner or ADMIN/SUPER_ADMIN | None | None | None |
| POST | `/blogs/:id/approve` | Approve blog | ✅ JWT | MODERATOR, ADMIN, SUPER_ADMIN | `ApproveBlogDto` | `BlogResponseDto` | [ApproveBlogDto](src/application/dto/blog/moderate-blog.dto.ts), [BlogResponseDto](src/application/dto/blog/blog-response.dto.ts) |
| POST | `/blogs/:id/reject` | Reject blog | ✅ JWT | MODERATOR, ADMIN, SUPER_ADMIN | `RejectBlogDto` | `BlogResponseDto` | [RejectBlogDto](src/application/dto/blog/moderate-blog.dto.ts), [BlogResponseDto](src/application/dto/blog/blog-response.dto.ts) |
| POST | `/blogs/:id/ban` | Ban blog | ✅ JWT | ADMIN, SUPER_ADMIN | `BanBlogDto` | `BlogResponseDto` | [BanBlogDto](src/application/dto/blog/moderate-blog.dto.ts), [BlogResponseDto](src/application/dto/blog/blog-response.dto.ts) |
| POST | `/blogs/:id/unban` | Unban blog | ✅ JWT | ADMIN, SUPER_ADMIN | `UnbanBlogDto` | `BlogResponseDto` | [UnbanBlogDto](src/application/dto/blog/moderate-blog.dto.ts), [BlogResponseDto](src/application/dto/blog/blog-response.dto.ts) |

## University Management APIs

| Method | Endpoint | Description | Auth Required | Required Role | Request Body | Response | Related Types |
|--------|----------|-------------|---------------|---------------|--------------|----------|---------------|
| GET | `/universities` | Get all universities | ❌ Public | None | None | `UniversityListResponseDto` | [UniversityListResponseDto](src/application/dto/university/university-list-response.dto.ts), [PaginationDto](src/application/dto/pagination/pagination.dto.ts) |
| GET | `/universities/featured` | Get featured universities | ❌ Public | None | None | `UniversityResponseDto[]` | [UniversityResponseDto](src/application/dto/university/university-response.dto.ts) |
| GET | `/universities/top-rated` | Get top-rated universities | ❌ Public | None | None | `UniversityResponseDto[]` | [UniversityResponseDto](src/application/dto/university/university-response.dto.ts) |
| GET | `/universities/search` | Search universities | ❌ Public | None | None | `UniversityListResponseDto` | [UniversityListResponseDto](src/application/dto/university/university-list-response.dto.ts) |
| GET | `/universities/statistics` | Get university statistics | ❌ Public | None | None | Object | None |
| GET | `/universities/:id` | Get university by ID | ❌ Public | None | None | `UniversityResponseDto` | [UniversityResponseDto](src/application/dto/university/university-response.dto.ts) |
| GET | `/universities/:id/reviews` | Get university reviews | ❌ Public | None | None | `UniversityReviewResponseDto[]` | [UniversityReviewResponseDto](src/application/dto/university/university-review-response.dto.ts) |
| GET | `/universities/:id/review-statistics` | Get review statistics | ❌ Public | None | None | Object | None |
| GET | `/universities/:id/analytics` | Get university analytics | ✅ JWT | UNIVERSITY_REP, ADMIN, SUPER_ADMIN | None | Object | None |
| POST | `/universities/:id/reviews` | Create university review | ✅ JWT | Any authenticated user | `CreateUniversityReviewDto` | `UniversityReviewResponseDto` | [CreateUniversityReviewDto](src/application/dto/university/create-university-review.dto.ts), [UniversityReviewResponseDto](src/application/dto/university/university-review-response.dto.ts) |
| PUT | `/universities/:id/reviews/:reviewId` | Update university review | ✅ JWT | Review owner or ADMIN/SUPER_ADMIN | `UpdateUniversityReviewDto` | `UniversityReviewResponseDto` | [UpdateUniversityReviewDto](src/application/dto/university/update-university-review.dto.ts), [UniversityReviewResponseDto](src/application/dto/university/university-review-response.dto.ts) |
| DELETE | `/universities/:id/reviews/:reviewId` | Delete university review | ✅ JWT | Review owner or ADMIN/SUPER_ADMIN | None | None | None |
| GET | `/universities/recommended` | Get recommended universities | ✅ JWT | Any authenticated user | None | `UniversityResponseDto[]` | [UniversityResponseDto](src/application/dto/university/university-response.dto.ts) |
| POST | `/universities` | Create university | ✅ JWT | ADMIN, SUPER_ADMIN | `CreateUniversityDto` | `UniversityResponseDto` | [CreateUniversityDto](src/application/dto/university/create-university.dto.ts), [UniversityResponseDto](src/application/dto/university/university-response.dto.ts) |
| PUT | `/universities/:id` | Update university | ✅ JWT | ADMIN, SUPER_ADMIN | `UpdateUniversityDto` | `UniversityResponseDto` | [UpdateUniversityDto](src/application/dto/university/update-university.dto.ts), [UniversityResponseDto](src/application/dto/university/university-response.dto.ts) |
| DELETE | `/universities/:id` | Delete university | ✅ JWT | ADMIN, SUPER_ADMIN | None | None | None |
| PATCH | `/universities/:id/status` | Update university status | ✅ JWT | ADMIN, SUPER_ADMIN | Object | `UniversityResponseDto` | [UniversityResponseDto](src/application/dto/university/university-response.dto.ts) |
| PATCH | `/universities/:id/feature` | Feature/unfeature university | ✅ JWT | ADMIN, SUPER_ADMIN | Object | `UniversityResponseDto` | [UniversityResponseDto](src/application/dto/university/university-response.dto.ts) |
| PATCH | `/universities/:id/verify` | Verify university | ✅ JWT | ADMIN, SUPER_ADMIN | Object | `UniversityResponseDto` | [UniversityResponseDto](src/application/dto/university/university-response.dto.ts) |
| PATCH | `/universities/:id/reviews/:reviewId/moderate` | Moderate university review | ✅ JWT | MODERATOR, ADMIN, SUPER_ADMIN | `ModerateUniversityReviewDto` | `UniversityReviewResponseDto` | [ModerateUniversityReviewDto](src/application/dto/university/moderate-university-review.dto.ts), [UniversityReviewResponseDto](src/application/dto/university/university-review-response.dto.ts) |
| POST | `/universities/:id/upload-image` | Upload university image | ✅ JWT | ADMIN, SUPER_ADMIN | FormData | Object | None |
| GET | `/universities/compare` | Compare universities | ❌ Public | None | None | Object | None |
| POST | `/universities/:id/report/:type` | Report university | ✅ JWT | Any authenticated user | Object | None | None |
| GET | `/universities/:id/insights` | Get university insights | ❌ Public | None | None | Object | None |

## Dashboard APIs

| Method | Endpoint | Description | Auth Required | Required Role | Request Body | Response | Related Types |
|--------|----------|-------------|---------------|---------------|--------------|----------|---------------|
| GET | `/dashboard/overview` | Get dashboard overview | ✅ JWT | ADMIN, SUPER_ADMIN | None | `DashboardResponseDto` | [DashboardResponseDto](src/application/dto/dashboard/dashboard-response.dto.ts) |
| GET | `/dashboard/statistics` | Get detailed statistics | ✅ JWT | ADMIN, SUPER_ADMIN | None | `DashboardResponseDto` | [DashboardResponseDto](src/application/dto/dashboard/dashboard-response.dto.ts) |
| GET | `/dashboard/users/analytics` | Get user analytics | ✅ JWT | ADMIN, SUPER_ADMIN | None | `DashboardResponseDto` | [DashboardResponseDto](src/application/dto/dashboard/dashboard-response.dto.ts) |
| GET | `/dashboard/content/analytics` | Get content analytics | ✅ JWT | ADMIN, SUPER_ADMIN | None | `DashboardResponseDto` | [DashboardResponseDto](src/application/dto/dashboard/dashboard-response.dto.ts) |
| GET | `/dashboard/system-health` | Get system health | ✅ JWT | ADMIN, SUPER_ADMIN | None | `DashboardResponseDto` | [DashboardResponseDto](src/application/dto/dashboard/dashboard-response.dto.ts) |
| GET | `/dashboard/report/:type` | Generate report | ✅ JWT | ADMIN, SUPER_ADMIN | None | `DashboardResponseDto` | [DashboardResponseDto](src/application/dto/dashboard/dashboard-response.dto.ts) |
| GET | `/dashboard/alerts` | Get system alerts | ✅ JWT | ADMIN, SUPER_ADMIN | None | `DashboardResponseDto` | [DashboardResponseDto](src/application/dto/dashboard/dashboard-response.dto.ts) |
| GET | `/dashboard/performance-metrics` | Get performance metrics | ✅ JWT | ADMIN, SUPER_ADMIN | None | `DashboardResponseDto` | [DashboardResponseDto](src/application/dto/dashboard/dashboard-response.dto.ts) |

## Profile Management APIs

| Method | Endpoint | Description | Auth Required | Required Role | Request Body | Response | Related Types |
|--------|----------|-------------|---------------|---------------|--------------|----------|---------------|
| GET | `/profile` | Get user profile | ✅ JWT | Any authenticated user | None | `ProfileResponseDto` | [ProfileResponseDto](src/application/dto/profile/profile-response.dto.ts) |
| PUT | `/profile` | Update user profile | ✅ JWT | Any authenticated user | `UpdateProfileDto` | `ProfileResponseDto` | [UpdateProfileDto](src/application/dto/profile/update-profile.dto.ts), [ProfileResponseDto](src/application/dto/profile/profile-response.dto.ts) |
| POST | `/profile/upload-avatar` | Upload profile avatar | ✅ JWT | Any authenticated user | FormData | Object | None |

## Tag Management APIs

| Method | Endpoint | Description | Auth Required | Required Role | Request Body | Response | Related Types |
|--------|----------|-------------|---------------|---------------|--------------|----------|---------------|
| GET | `/tags` | Get all tags | ❌ Public | None | None | `TagResponseDto[]` | [TagResponseDto](src/application/dto/tag/tag-response.dto.ts) |
| GET | `/tags/:id` | Get tag by ID | ❌ Public | None | None | `TagResponseDto` | [TagResponseDto](src/application/dto/tag/tag-response.dto.ts) |
| POST | `/tags` | Create new tag | ✅ JWT | ADMIN, SUPER_ADMIN | `CreateTagDto` | `TagResponseDto` | [CreateTagDto](src/application/dto/tag/create-tag.dto.ts), [TagResponseDto](src/application/dto/tag/tag-response.dto.ts) |
| PUT | `/tags/:id` | Update tag | ✅ JWT | ADMIN, SUPER_ADMIN | `UpdateTagDto` | `TagResponseDto` | [UpdateTagDto](src/application/dto/tag/update-tag.dto.ts), [TagResponseDto](src/application/dto/tag/tag-response.dto.ts) |
| DELETE | `/tags/:id` | Delete tag | ✅ JWT | ADMIN, SUPER_ADMIN | None | None | None |

## Upload APIs

| Method | Endpoint | Description | Auth Required | Required Role | Request Body | Response | Related Types |
|--------|----------|-------------|---------------|---------------|--------------|----------|---------------|
| POST | `/upload/image` | Upload image | ✅ JWT | Any authenticated user | FormData | `UploadResponseDto` | [UploadResponseDto](src/application/dto/upload/upload-response.dto.ts) |
| POST | `/upload/file` | Upload file | ✅ JWT | Any authenticated user | FormData | `UploadResponseDto` | [UploadResponseDto](src/application/dto/upload/upload-response.dto.ts) |

## System Management APIs

| Method | Endpoint | Description | Auth Required | Required Role | Request Body | Response | Related Types |
|--------|----------|-------------|---------------|---------------|--------------|----------|---------------|
| GET | `/system/health` | Get system health | ✅ JWT | ADMIN, SUPER_ADMIN | None | Object | None |
| GET | `/system/logs` | Get system logs | ✅ JWT | ADMIN, SUPER_ADMIN | None | Object | None |
| POST | `/system/backup` | Create system backup | ✅ JWT | SUPER_ADMIN | None | Object | None |
| POST | `/system/restore` | Restore system from backup | ✅ JWT | SUPER_ADMIN | Object | None | None |

## Activity & User Activity APIs

| Method | Endpoint | Description | Auth Required | Required Role | Request Body | Response | Related Types |
|--------|----------|-------------|---------------|---------------|--------------|----------|---------------|
| GET | `/activities` | Get all activities | ✅ JWT | ADMIN, SUPER_ADMIN | None | `ActivityResponseDto[]` | [ActivityResponseDto](src/application/dto/activity/activity-response.dto.ts) |
| GET | `/activities/:id` | Get activity by ID | ✅ JWT | ADMIN, SUPER_ADMIN | None | `ActivityResponseDto` | [ActivityResponseDto](src/application/dto/activity/activity-response.dto.ts) |
| GET | `/user-activities` | Get user activities | ✅ JWT | Any authenticated user | None | `UserActivityResponseDto[]` | [UserActivityResponseDto](src/application/dto/user-activity/user-activity-response.dto.ts) |
| GET | `/user-activities/:id` | Get user activity by ID | ✅ JWT | Any authenticated user | None | `UserActivityResponseDto` | [UserActivityResponseDto](src/application/dto/user-activity/user-activity-response.dto.ts) |

## Email Verification APIs

| Method | Endpoint | Description | Auth Required | Required Role | Request Body | Response | Related Types |
|--------|----------|-------------|---------------|---------------|--------------|----------|---------------|
| POST | `/email-verification/send` | Send verification email | ✅ JWT | Any authenticated user | `SendVerificationDto` | None | [SendVerificationDto](src/application/dto/email-verification/send-verification.dto.ts) |
| POST | `/email-verification/verify` | Verify email | ❌ Public | None | `VerifyEmailDto` | None | [VerifyEmailDto](src/application/dto/email-verification/verify-email.dto.ts) |

## Account Deactivation APIs

| Method | Endpoint | Description | Auth Required | Required Role | Request Body | Response | Related Types |
|--------|----------|-------------|---------------|---------------|--------------|----------|---------------|
| POST | `/account-deactivation/request` | Request account deactivation | ✅ JWT | Any authenticated user | `RequestDeactivationDto` | None | [RequestDeactivationDto](src/application/dto/account-deactivation/request-deactivation.dto.ts) |
| POST | `/account-deactivation/confirm` | Confirm account deactivation | ✅ JWT | Any authenticated user | `ConfirmDeactivationDto` | None | [ConfirmDeactivationDto](src/application/dto/account-deactivation/confirm-deactivation.dto.ts) |
| POST | `/account-deactivation/cancel` | Cancel account deactivation | ✅ JWT | Any authenticated user | None | None | None |

## Device Management APIs

| Method | Endpoint | Description | Auth Required | Required Role | Request Body | Response | Related Types |
|--------|----------|-------------|---------------|---------------|--------------|----------|---------------|
| GET | `/devices` | Get user devices | ✅ JWT | Any authenticated user | None | `DeviceResponseDto[]` | [DeviceResponseDto](src/application/dto/device/device-response.dto.ts) |
| DELETE | `/devices/:id` | Remove device | ✅ JWT | Any authenticated user | None | None | None |
| DELETE | `/devices/all` | Remove all devices | ✅ JWT | Any authenticated user | None | None | None |

## University Review APIs

| Method | Endpoint | Description | Auth Required | Required Role | Request Body | Response | Related Types |
|--------|----------|-------------|---------------|---------------|--------------|----------|---------------|
| GET | `/university-review-criteria` | Get review criteria | ❌ Public | None | None | `ReviewCriterionResponseDto[]` | [ReviewCriterionResponseDto](src/application/dto/university-review-criterion/review-criterion-response.dto.ts) |
| POST | `/university-review-criteria` | Create review criterion | ✅ JWT | ADMIN, SUPER_ADMIN | `CreateReviewCriterionDto` | `ReviewCriterionResponseDto` | [CreateReviewCriterionDto](src/application/dto/university-review-criterion/create-review-criterion.dto.ts), [ReviewCriterionResponseDto](src/application/dto/university-review-criterion/review-criterion-response.dto.ts) |
| PUT | `/university-review-criteria/:id` | Update review criterion | ✅ JWT | ADMIN, SUPER_ADMIN | `UpdateReviewCriterionDto` | `ReviewCriterionResponseDto` | [UpdateReviewCriterionDto](src/application/dto/university-review-criterion/update-review-criterion.dto.ts), [ReviewCriterionResponseDto](src/application/dto/university-review-criterion/review-criterion-response.dto.ts) |
| DELETE | `/university-review-criteria/:id` | Delete review criterion | ✅ JWT | ADMIN, SUPER_ADMIN | None | None | None |

## Data Transfer Objects (DTOs) Reference

### Authentication DTOs
- [RegisterDto](src/application/dto/auth/register.dto.ts)
- [LoginDto](src/application/dto/auth/login.dto.ts)
- [AuthResponseDto](src/application/dto/auth/auth-response.dto.ts)
- [RefreshTokenDto](src/application/dto/auth/refresh-token.dto.ts)
- [VerifyEmailDto](src/application/dto/auth/verify-email.dto.ts)
- [ResendVerificationDto](src/application/dto/auth/resend-verification.dto.ts)
- [ForgotPasswordDto](src/application/dto/auth/forgot-password.dto.ts)
- [ResetPasswordDto](src/application/dto/auth/reset-password.dto.ts)
- [ChangeEmailDto](src/application/dto/auth/change-email.dto.ts)
- [ConfirmEmailChangeDto](src/application/dto/auth/confirm-email-change.dto.ts)
- [DeactivateAccountDto](src/application/dto/auth/deactivate-account.dto.ts)
- [DeleteAccountDto](src/application/dto/auth/delete-account.dto.ts)

### Blog DTOs
- [CreateBlogDto](src/application/dto/blog/create-blog.dto.ts)
- [UpdateBlogDto](src/application/dto/blog/update-blog.dto.ts)
- [BlogResponseDto](src/application/dto/blog/blog-response.dto.ts)
- [ApproveBlogDto](src/application/dto/blog/moderate-blog.dto.ts)
- [RejectBlogDto](src/application/dto/blog/moderate-blog.dto.ts)
- [BanBlogDto](src/application/dto/blog/moderate-blog.dto.ts)
- [UnbanBlogDto](src/application/dto/blog/moderate-blog.dto.ts)
- [BlogQueryDto](src/application/dto/blog/blog-query.dto.ts)
- [BlogPublicQueryDto](src/application/dto/blog/blog-public-query.dto.ts)

### University DTOs
- [CreateUniversityDto](src/application/dto/university/create-university.dto.ts)
- [UpdateUniversityDto](src/application/dto/university/update-university.dto.ts)
- [UniversityResponseDto](src/application/dto/university/university-response.dto.ts)
- [UniversityListResponseDto](src/application/dto/university/university-list-response.dto.ts)
- [CreateUniversityReviewDto](src/application/dto/university/create-university-review.dto.ts)
- [UpdateUniversityReviewDto](src/application/dto/university/update-university-review.dto.ts)
- [UniversityReviewResponseDto](src/application/dto/university/university-review-response.dto.ts)
- [ModerateUniversityReviewDto](src/application/dto/university/moderate-university-review.dto.ts)

### Dashboard DTOs
- [DashboardResponseDto](src/application/dto/dashboard/dashboard-response.dto.ts)

### Profile DTOs
- [ProfileResponseDto](src/application/dto/profile/profile-response.dto.ts)
- [UpdateProfileDto](src/application/dto/profile/update-profile.dto.ts)

### Tag DTOs
- [CreateTagDto](src/application/dto/tag/create-tag.dto.ts)
- [UpdateTagDto](src/application/dto/tag/update-tag.dto.ts)
- [TagResponseDto](src/application/dto/tag/tag-response.dto.ts)

### Upload DTOs
- [UploadResponseDto](src/application/dto/upload/upload-response.dto.ts)

### Common DTOs
- [PaginationDto](src/application/dto/pagination/pagination.dto.ts)

### Activity DTOs
- [ActivityResponseDto](src/application/dto/activity/activity-response.dto.ts)
- [UserActivityResponseDto](src/application/dto/user-activity/user-activity-response.dto.ts)

### Email Verification DTOs
- [SendVerificationDto](src/application/dto/email-verification/send-verification.dto.ts)
- [VerifyEmailDto](src/application/dto/email-verification/verify-email.dto.ts)

### Account Deactivation DTOs
- [RequestDeactivationDto](src/application/dto/account-deactivation/request-deactivation.dto.ts)
- [ConfirmDeactivationDto](src/application/dto/account-deactivation/confirm-deactivation.dto.ts)

### Device DTOs
- [DeviceResponseDto](src/application/dto/device/device-response.dto.ts)

### University Review Criterion DTOs
- [CreateReviewCriterionDto](src/application/dto/university-review-criterion/create-review-criterion.dto.ts)
- [UpdateReviewCriterionDto](src/application/dto/university-review-criterion/update-review-criterion.dto.ts)
- [ReviewCriterionResponseDto](src/application/dto/university-review-criterion/review-criterion-response.dto.ts)

## Entity Types Reference

### Core Entities
- [User](src/infrastructure/database/entities/user.entity.ts)
- [UserProfile](src/infrastructure/database/entities/user-profile.entity.ts)
- [UserSession](src/infrastructure/database/entities/user-session.entity.ts)
- [UserDevice](src/infrastructure/database/entities/user-device.entity.ts)
- [Role](src/infrastructure/database/entities/role.entity.ts)
- [Permission](src/infrastructure/database/entities/permission.entity.ts)

### Blog Entities
- [Blog](src/infrastructure/database/entities/blog.entity.ts)
- [BlogLike](src/infrastructure/database/entities/blog-like.entity.ts)
- [BlogTag](src/infrastructure/database/entities/blog-tag.entity.ts)

### University Entities
- [University](src/infrastructure/database/entities/university.entity.ts)
- [UniversityReview](src/infrastructure/database/entities/university-review.entity.ts)
- [UniversityReviewCriterion](src/infrastructure/database/entities/university-review-criterion.entity.ts)
- [UniversityImage](src/infrastructure/database/entities/university-image.entity.ts)

### Tag Entities
- [Tag](src/infrastructure/database/entities/tag.entity.ts)

### Activity Entities
- [UserActivity](src/infrastructure/database/entities/user-activity.entity.ts)
- [Activity](src/infrastructure/database/entities/activity.entity.ts)

### Verification Entities
- [EmailVerification](src/infrastructure/database/entities/email-verification.entity.ts)
- [PhoneVerification](src/infrastructure/database/entities/phone-verification.entity.ts)

### Account Management Entities
- [AccountDeactivation](src/infrastructure/database/entities/account-deactivation.entity.ts)
- [PasswordReset](src/infrastructure/database/entities/password-reset.entity.ts)

### System Entities
- [SystemLog](src/infrastructure/database/entities/system-log.entity.ts)
- [SystemSetting](src/infrastructure/database/entities/system-setting.entity.ts)
- [AuditTrail](src/infrastructure/database/entities/audit-trail.entity.ts)

---

**Note**: This documentation is automatically generated and should be updated when new APIs are added or existing ones are modified. For the most up-to-date information, please refer to the source code and Swagger documentation.
