import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import {
  ActivityResponse,
  ActivityListResponse,
  ActivityQueryParams,
  UserActivityResponse,
  UserActivityListResponse,
  UserActivityQueryParams,
  ActivityStatistics,
  ActivityAnalytics,
  ActivityFilter,
  ActivityExportRequest,
  ActivityReportRequest,
  ActivityReportResponse
} from '@/types/activity';

export const activityApi = createApi({
  reducerPath: 'activityApi',
  baseQuery,
  tagTypes: ['Activity', 'UserActivity', 'ActivityStats'],
  endpoints: (builder) => ({
    // System activities
    getActivities: builder.query<ActivityListResponse, ActivityQueryParams>({
      query: (params) => ({
        url: '/api/v1/activities',
        params,
      }),
      providesTags: ['Activity'],
    }),

    getActivityById: builder.query<ActivityResponse, number>({
      query: (id) => `/api/v1/activities/${id}`,
      providesTags: (result, error, id) => [{ type: 'Activity', id }],
    }),

    createActivity: builder.mutation<ActivityResponse, { type: string; description: string; metadata?: Record<string, unknown> }>({
      query: (data) => ({
        url: '/api/v1/activities',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Activity'],
    }),

    updateActivity: builder.mutation<ActivityResponse, { id: number; data: Partial<ActivityResponse> }>({
      query: ({ id, data }) => ({
        url: `/activities/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Activity', id }],
    }),

    deleteActivity: builder.mutation<void, number>({
      query: (id) => ({
        url: `/activities/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Activity'],
    }),

    // User activities
    getUserActivities: builder.query<UserActivityListResponse, UserActivityQueryParams>({
      query: (params) => ({
        url: '/api/v1/user-activities',
        params,
      }),
      providesTags: ['UserActivity'],
    }),

    getUserActivityById: builder.query<UserActivityResponse, number>({
      query: (id) => `/api/v1/user-activities/${id}`,
      providesTags: (result, error, id) => [{ type: 'UserActivity', id }],
    }),

    getUserActivitiesByUserId: builder.query<UserActivityListResponse, { userId: number; params?: Partial<UserActivityQueryParams> }>({
      query: ({ userId, params }) => ({
        url: `/users/${userId}/activities`,
        params,
      }),
      providesTags: (result, error, { userId }) => [{ type: 'UserActivity', userId }],
    }),

    createUserActivity: builder.mutation<UserActivityResponse, {
      userId: number;
      type: string;
      description: string;
      metadata?: Record<string, unknown>;
      ipAddress?: string;
      userAgent?: string;
    }>({
      query: (data) => ({
        url: '/api/v1/user-activities',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['UserActivity'],
    }),

    updateUserActivity: builder.mutation<UserActivityResponse, { id: number; data: Partial<UserActivityResponse> }>({
      query: ({ id, data }) => ({
        url: `/user-activities/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'UserActivity', id }],
    }),

    deleteUserActivity: builder.mutation<void, number>({
      query: (id) => ({
        url: `/user-activities/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserActivity'],
    }),

    // Activity filtering and search
    searchActivities: builder.query<ActivityListResponse, { query: string; filters?: ActivityFilter }>({
      query: (params) => ({
        url: '/api/v1/activities/search',
        params,
      }),
      providesTags: ['Activity'],
    }),

    searchUserActivities: builder.query<UserActivityListResponse, { query: string; filters?: ActivityFilter }>({
      query: (params) => ({
        url: '/api/v1/user-activities/search',
        params,
      }),
      providesTags: ['UserActivity'],
    }),

    filterActivities: builder.query<ActivityListResponse, ActivityFilter>({
      query: (filters) => ({
        url: '/api/v1/activities/filter',
        method: 'POST',
        body: filters,
      }),
      providesTags: ['Activity'],
    }),

    filterUserActivities: builder.query<UserActivityListResponse, ActivityFilter>({
      query: (filters) => ({
        url: '/api/v1/user-activities/filter',
        method: 'POST',
        body: filters,
      }),
      providesTags: ['UserActivity'],
    }),

    // Activity statistics and analytics
    getActivityStatistics: builder.query<ActivityStatistics, { period: string; type?: string }>({
      query: (params) => ({
        url: '/api/v1/activities/statistics',
        params,
      }),
      providesTags: ['ActivityStats'],
    }),

    getUserActivityStatistics: builder.query<ActivityStatistics, { period: string; userId?: number }>({
      query: (params) => ({
        url: '/api/v1/user-activities/statistics',
        params,
      }),
      providesTags: ['ActivityStats'],
    }),

    getActivityAnalytics: builder.query<ActivityAnalytics, { period: string; groupBy?: string; filters?: ActivityFilter }>({
      query: (params) => ({
        url: '/api/v1/activities/analytics',
        params,
      }),
      providesTags: ['ActivityStats'],
    }),

    getUserActivityAnalytics: builder.query<ActivityAnalytics, { period: string; userId?: number; groupBy?: string }>({
      query: (params) => ({
        url: '/api/v1/user-activities/analytics',
        params,
      }),
      providesTags: ['ActivityStats'],
    }),

    // Activity reports
    getActivityReports: builder.query<ActivityReportResponse[], void>({
      query: () => '/api/v1/activities/reports',
      providesTags: ['Activity'],
    }),

    generateActivityReport: builder.mutation<ActivityReportResponse, ActivityReportRequest>({
      query: (data) => ({
        url: '/api/v1/activities/reports/generate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Activity'],
    }),

    downloadActivityReport: builder.query<Blob, number>({
      query: (id) => ({
        url: `/activities/reports/${id}/download`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Activity export
    exportActivities: builder.query<Blob, ActivityExportRequest>({
      query: (params) => ({
        url: '/api/v1/activities/export',
        method: 'POST',
        body: params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    exportUserActivities: builder.query<Blob, ActivityExportRequest>({
      query: (params) => ({
        url: '/api/v1/user-activities/export',
        method: 'POST',
        body: params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Activity cleanup and maintenance
    clearOldActivities: builder.mutation<{ cleared: number; freed: number }, { olderThan: string; type?: string }>({
      query: (params) => ({
        url: '/api/v1/activities/cleanup',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['Activity', 'ActivityStats'],
    }),

    clearOldUserActivities: builder.mutation<{ cleared: number; freed: number }, { olderThan: string; userId?: number }>({
      query: (params) => ({
        url: '/api/v1/user-activities/cleanup',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['UserActivity', 'ActivityStats'],
    }),

    // Real-time activity monitoring
    getRecentActivities: builder.query<ActivityResponse[], { limit?: number; type?: string }>({
      query: (params) => ({
        url: '/api/v1/activities/recent',
        params,
      }),
      providesTags: ['Activity'],
    }),

    getRecentUserActivities: builder.query<UserActivityResponse[], { limit?: number; userId?: number }>({
      query: (params) => ({
        url: '/api/v1/user-activities/recent',
        params,
      }),
      providesTags: ['UserActivity'],
    }),

    // Activity insights and recommendations
    getActivityInsights: builder.query<{
      topActivities: Array<{ type: string; count: number; trend: number }>;
      unusualPatterns: Array<{ description: string; severity: string; recommendation: string }>;
      performanceMetrics: Array<{ metric: string; value: number; threshold: number; status: string }>;
    }, { period: string }>({
      query: (params) => ({
        url: '/api/v1/activities/insights',
        params,
      }),
      providesTags: ['ActivityStats'],
    }),

    getUserActivityInsights: builder.query<{
      userBehavior: Array<{ userId: number; username: string; activityPattern: string; risk: string }>;
      recommendations: Array<{ userId: number; recommendation: string; priority: string }>;
    }, { period: string }>({
      query: (params) => ({
        url: '/api/v1/user-activities/insights',
        params,
      }),
      providesTags: ['ActivityStats'],
    }),
  }),
});

export const {
  useGetActivitiesQuery,
  useGetActivityByIdQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  useGetUserActivitiesQuery,
  useGetUserActivityByIdQuery,
  useGetUserActivitiesByUserIdQuery,
  useCreateUserActivityMutation,
  useUpdateUserActivityMutation,
  useDeleteUserActivityMutation,
  useSearchActivitiesQuery,
  useSearchUserActivitiesQuery,
  useFilterActivitiesQuery,
  useFilterUserActivitiesQuery,
  useGetActivityStatisticsQuery,
  useGetUserActivityStatisticsQuery,
  useGetActivityAnalyticsQuery,
  useGetUserActivityAnalyticsQuery,
  useGetActivityReportsQuery,
  useGenerateActivityReportMutation,
  useDownloadActivityReportQuery,
  useExportActivitiesQuery,
  useExportUserActivitiesQuery,
  useClearOldActivitiesMutation,
  useClearOldUserActivitiesMutation,
  useGetRecentActivitiesQuery,
  useGetRecentUserActivitiesQuery,
  useGetActivityInsightsQuery,
  useGetUserActivityInsightsQuery,
} = activityApi;
