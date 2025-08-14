import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import {
  DashboardResponse,
  DashboardQueryParams,
  DashboardOverview,
  DashboardStatistics,
  UserAnalytics,
  ContentAnalytics,
  SystemHealth,
  RecentActivity,
  SystemAlert,
  PerformanceMetrics
} from '@/types/dashboard';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery,
  tagTypes: ['Dashboard', 'DashboardStats', 'DashboardAnalytics'],
  endpoints: (builder) => ({
    // Main dashboard data
    getDashboardData: builder.query<DashboardResponse, DashboardQueryParams>({
      query: (params) => ({ url: '/dashboard', method: 'GET', params }),
      providesTags: ['Dashboard'],
    }),

    getDashboardOverview: builder.query<DashboardOverview, void>({
      query: () => '/dashboard/overview',
      providesTags: ['Dashboard'],
    }),

    getDashboardStatistics: builder.query<DashboardStatistics, void>({
      query: () => '/dashboard/statistics',
      providesTags: ['DashboardStats'],
    }),

    // User analytics
    getUserAnalytics: builder.query<UserAnalytics, { startDate?: string; endDate?: string }>({
      query: (params) => ({ url: '/dashboard/user-analytics', method: 'GET', params }),
      providesTags: ['DashboardAnalytics'],
    }),

    getUserRetention: builder.query<UserAnalytics['retention'], { startDate?: string; endDate?: string }>({
      query: (params) => ({ url: '/dashboard/user-retention', method: 'GET', params }),
      providesTags: ['DashboardAnalytics'],
    }),

    getUserBehavior: builder.query<UserAnalytics['behavior'], { startDate?: string; endDate?: string }>({
      query: (params) => ({ url: '/dashboard/user-behavior', method: 'GET', params }),
      providesTags: ['DashboardAnalytics'],
    }),

    getUserSegments: builder.query<UserAnalytics['segments'], { startDate?: string; endDate?: string }>({
      query: (params) => ({ url: '/dashboard/user-segments', method: 'GET', params }),
      providesTags: ['DashboardAnalytics'],
    }),

    getTopUsers: builder.query<UserAnalytics['topUsers'], { limit?: number; period?: string }>({
      query: (params) => ({ url: '/dashboard/top-users', method: 'GET', params }),
      providesTags: ['DashboardAnalytics'],
    }),

    getUserActivityHeatmap: builder.query<UserAnalytics['activityHeatmap'], { startDate?: string; endDate?: string }>({
      query: (params) => ({ url: '/dashboard/user-activity-heatmap', method: 'GET', params }),
      providesTags: ['DashboardAnalytics'],
    }),

    // Content analytics
    getContentAnalytics: builder.query<ContentAnalytics, { startDate?: string; endDate?: string }>({
      query: (params) => ({ url: '/dashboard/content-analytics', method: 'GET', params }),
      providesTags: ['DashboardAnalytics'],
    }),

    getBlogAnalytics: builder.query<ContentAnalytics['blogAnalytics'], { startDate?: string; endDate?: string }>({
      query: (params) => ({ url: '/dashboard/blog-analytics', method: 'GET', params }),
      providesTags: ['DashboardAnalytics'],
    }),

    getUniversityAnalytics: builder.query<ContentAnalytics['universityAnalytics'], { startDate?: string; endDate?: string }>({
      query: (params) => ({ url: '/dashboard/university-analytics', method: 'GET', params }),
      providesTags: ['DashboardAnalytics'],
    }),

    getReviewAnalytics: builder.query<ContentAnalytics['reviewAnalytics'], { startDate?: string; endDate?: string }>({
      query: (params) => ({ url: '/dashboard/review-analytics', method: 'GET', params }),
      providesTags: ['DashboardAnalytics'],
    }),

    getSearchAnalytics: builder.query<ContentAnalytics['searchAnalytics'], { startDate?: string; endDate?: string }>({
      query: (params) => ({ url: '/dashboard/search-analytics', method: 'GET', params }),
      providesTags: ['DashboardAnalytics'],
    }),

    getContentPerformance: builder.query<ContentAnalytics['contentPerformance'], { startDate?: string; endDate?: string }>({
      query: (params) => ({ url: '/dashboard/content-performance', method: 'GET', params }),
      providesTags: ['DashboardAnalytics'],
    }),

    // System health and monitoring
    getSystemHealth: builder.query<SystemHealth, void>({
      query: () => '/dashboard/system-health',
      providesTags: ['Dashboard'],
    }),

    getPerformanceMetrics: builder.query<PerformanceMetrics, { startDate?: string; endDate?: string }>({
      query: (params) => ({ url: '/dashboard/performance-metrics', method: 'GET', params }),
      providesTags: ['Dashboard'],
    }),

    getSystemAlerts: builder.query<SystemAlert[], { severity?: string; status?: string; limit?: number }>({
      query: (params) => ({ url: '/dashboard/alerts', method: 'GET', params }),
      providesTags: ['Dashboard'],
    }),

    getRecentActivities: builder.query<RecentActivity[], { limit?: number; type?: string }>({
      query: (params) => ({ url: '/dashboard/recent-activities', method: 'GET', params }),
      providesTags: ['Dashboard'],
    }),

    // Dashboard customization
    getDashboardLayout: builder.query<{ layout: string; widgets: any[] }, void>({
      query: () => '/dashboard/layout',
      providesTags: ['Dashboard'],
    }),

    updateDashboardLayout: builder.mutation<{ success: boolean }, { layout: string; widgets: any[] }>({
      query: (data) => ({ url: '/dashboard/layout', method: 'PUT', body: data }),
      invalidatesTags: ['Dashboard'],
    }),

    getDashboardWidgets: builder.query<any[], void>({
      query: () => '/dashboard/widgets',
      providesTags: ['Dashboard'],
    }),

    addDashboardWidget: builder.mutation<{ success: boolean }, { widgetType: string; position: any; config: any }>({
      query: (data) => ({ url: '/dashboard/widgets', method: 'POST', body: data }),
      invalidatesTags: ['Dashboard'],
    }),

    updateDashboardWidget: builder.mutation<{ success: boolean }, { widgetId: string; config: any }>({
      query: ({ widgetId, config }) => ({ url: `/dashboard/widgets/${widgetId}`, method: 'PUT', body: config }),
      invalidatesTags: ['Dashboard'],
    }),

    removeDashboardWidget: builder.mutation<{ success: boolean }, string>({
      query: (widgetId) => ({ url: `/dashboard/widgets/${widgetId}`, method: 'DELETE' }),
      invalidatesTags: ['Dashboard'],
    }),

    // Dashboard reports
    generateDashboardReport: builder.mutation<{ reportUrl: string }, { 
      type: string; 
      format: string; 
      params: any 
    }>({
      query: (data) => ({ url: '/dashboard/reports', method: 'POST', body: data }),
    }),

    getDashboardReports: builder.query<{ id: string; type: string; createdAt: string; status: string }[], void>({
      query: () => '/dashboard/reports',
      providesTags: ['Dashboard'],
    }),

    downloadDashboardReport: builder.query<{ downloadUrl: string }, string>({
      query: (reportId) => `/dashboard/reports/${reportId}/download`,
    }),

    // Real-time dashboard updates
    getDashboardUpdates: builder.query<{ updates: any[]; timestamp: string }, void>({
      query: () => '/dashboard/updates',
      providesTags: ['Dashboard'],
    }),

    // Dashboard insights and recommendations
    getDashboardInsights: builder.query<{ insights: any[]; recommendations: any[] }, void>({
      query: () => '/dashboard/insights',
      providesTags: ['Dashboard'],
    }),

    // Dashboard export
    exportDashboardData: builder.mutation<{ exportUrl: string }, { 
      sections: string[]; 
      format: string; 
      params: any 
    }>({
      query: (data) => ({ url: '/dashboard/export', method: 'POST', body: data }),
    }),

    // Dashboard backup and restore
    backupDashboard: builder.mutation<{ backupId: string; backupUrl: string }, void>({
      query: () => ({ url: '/dashboard/backup', method: 'POST' }),
    }),

    restoreDashboard: builder.mutation<{ success: boolean }, { backupId: string }>({
      query: ({ backupId }) => ({ url: `/dashboard/restore/${backupId}`, method: 'POST' }),
      invalidatesTags: ['Dashboard'],
    }),

    getDashboardBackups: builder.query<{ id: string; createdAt: string; size: string; description: string }[], void>({
      query: () => '/dashboard/backups',
      providesTags: ['Dashboard'],
    }),

    // Dashboard settings
    getDashboardSettings: builder.query<{ theme: string; refreshInterval: number; notifications: boolean }, void>({
      query: () => '/dashboard/settings',
      providesTags: ['Dashboard'],
    }),

    updateDashboardSettings: builder.mutation<{ success: boolean }, { 
      theme?: string; 
      refreshInterval?: number; 
      notifications?: boolean 
    }>({
      query: (settings) => ({ url: '/dashboard/settings', method: 'PUT', body: settings }),
      invalidatesTags: ['Dashboard'],
    }),

    // Dashboard notifications
    getDashboardNotifications: builder.query<{ notifications: any[]; unreadCount: number }, void>({
      query: () => '/dashboard/notifications',
      providesTags: ['Dashboard'],
    }),

    markNotificationAsRead: builder.mutation<{ success: boolean }, string>({
      query: (notificationId) => ({ url: `/dashboard/notifications/${notificationId}/read`, method: 'PATCH' }),
      invalidatesTags: ['Dashboard'],
    }),

    markAllNotificationsAsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: '/dashboard/notifications/read-all', method: 'PATCH' }),
      invalidatesTags: ['Dashboard'],
    }),

    // Dashboard search
    searchDashboard: builder.query<{ results: any[]; total: number }, { query: string; filters?: any }>({
      query: ({ query, filters }) => ({ 
        url: '/dashboard/search', 
        method: 'GET', 
        params: { q: query, ...filters } 
      }),
    }),

    // Dashboard help and documentation
    getDashboardHelp: builder.query<{ sections: any[]; faq: any[] }, void>({
      query: () => '/dashboard/help',
    }),

    getDashboardTutorials: builder.query<{ tutorials: any[] }, void>({
      query: () => '/dashboard/tutorials',
    }),
  }),
});

export const {
  // Main dashboard data
  useGetDashboardDataQuery,
  useGetDashboardOverviewQuery,
  useGetDashboardStatisticsQuery,
  
  // User analytics
  useGetUserAnalyticsQuery,
  useGetUserRetentionQuery,
  useGetUserBehaviorQuery,
  useGetUserSegmentsQuery,
  useGetTopUsersQuery,
  useGetUserActivityHeatmapQuery,
  
  // Content analytics
  useGetContentAnalyticsQuery,
  useGetBlogAnalyticsQuery,
  useGetUniversityAnalyticsQuery,
  useGetReviewAnalyticsQuery,
  useGetSearchAnalyticsQuery,
  useGetContentPerformanceQuery,
  
  // System health and monitoring
  useGetSystemHealthQuery,
  useGetPerformanceMetricsQuery,
  useGetSystemAlertsQuery,
  useGetRecentActivitiesQuery,
  
  // Dashboard customization
  useGetDashboardLayoutQuery,
  useUpdateDashboardLayoutMutation,
  useGetDashboardWidgetsQuery,
  useAddDashboardWidgetMutation,
  useUpdateDashboardWidgetMutation,
  useRemoveDashboardWidgetMutation,
  
  // Dashboard reports
  useGenerateDashboardReportMutation,
  useGetDashboardReportsQuery,
  useDownloadDashboardReportQuery,
  
  // Real-time updates
  useGetDashboardUpdatesQuery,
  
  // Insights and recommendations
  useGetDashboardInsightsQuery,
  
  // Export
  useExportDashboardDataMutation,
  
  // Backup and restore
  useBackupDashboardMutation,
  useRestoreDashboardMutation,
  useGetDashboardBackupsQuery,
  
  // Settings
  useGetDashboardSettingsQuery,
  useUpdateDashboardSettingsMutation,
  
  // Notifications
  useGetDashboardNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  
  // Search
  useSearchDashboardQuery,
  
  // Help and documentation
  useGetDashboardHelpQuery,
  useGetDashboardTutorialsQuery,
} = dashboardApi;
