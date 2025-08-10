import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import {
  SystemConfigResponse,
  SystemConfigUpdateRequest,
  SystemHealthResponse,
  SystemMetricsResponse,
  SystemLogResponse,
  SystemLogQueryParams,
  SystemBackupResponse,
  SystemBackupRequest,
  SystemRestoreRequest,
  SystemMaintenanceRequest,
  SystemNotificationResponse,
  SystemNotificationRequest,
  SystemAuditResponse,
  SystemAuditQueryParams,
  SystemReportResponse,
  SystemReportRequest
} from '@/types/system';

export const systemApi = createApi({
  reducerPath: 'systemApi',
  baseQuery,
  tagTypes: ['System', 'SystemConfig', 'SystemHealth', 'SystemLogs'],
  endpoints: (builder) => ({
    // System configuration
    getSystemConfig: builder.query<SystemConfigResponse, void>({
      query: () => '/system/config',
      providesTags: ['SystemConfig'],
    }),

    updateSystemConfig: builder.mutation<SystemConfigResponse, SystemConfigUpdateRequest>({
      query: (data) => ({
        url: '/system/config',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['SystemConfig'],
    }),

    resetSystemConfig: builder.mutation<SystemConfigResponse, void>({
      query: () => ({
        url: '/system/config/reset',
        method: 'POST',
      }),
      invalidatesTags: ['SystemConfig'],
    }),

    // System health and monitoring
    getSystemHealth: builder.query<SystemHealthResponse, void>({
      query: () => '/system/health',
      providesTags: ['SystemHealth'],
    }),

    getSystemMetrics: builder.query<SystemMetricsResponse, { period: string; type?: string }>({
      query: (params) => ({
        url: '/system/metrics',
        params,
      }),
      providesTags: ['SystemHealth'],
    }),

    checkSystemStatus: builder.query<{ status: string; timestamp: string }, void>({
      query: () => '/system/status',
    }),

    // System logs
    getSystemLogs: builder.query<SystemLogResponse, SystemLogQueryParams>({
      query: (params) => ({
        url: '/system/logs',
        params,
      }),
      providesTags: ['SystemLogs'],
    }),

    getSystemLogById: builder.query<SystemLogResponse, number>({
      query: (id) => `/system/logs/${id}`,
      providesTags: (result, error, id) => [{ type: 'SystemLogs', id }],
    }),

    clearSystemLogs: builder.mutation<{ cleared: number }, { olderThan?: string; level?: string }>({
      query: (params) => ({
        url: '/system/logs/clear',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['SystemLogs'],
    }),

    exportSystemLogs: builder.query<Blob, SystemLogQueryParams>({
      query: (params) => ({
        url: '/system/logs/export',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // System backup and restore
    getSystemBackups: builder.query<SystemBackupResponse[], void>({
      query: () => '/system/backups',
      providesTags: ['System'],
    }),

    createSystemBackup: builder.mutation<SystemBackupResponse, SystemBackupRequest>({
      query: (data) => ({
        url: '/system/backups',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['System'],
    }),

    restoreSystemBackup: builder.mutation<{ success: boolean; message: string }, SystemRestoreRequest>({
      query: (data) => ({
        url: '/system/backups/restore',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['System'],
    }),

    deleteSystemBackup: builder.mutation<void, number>({
      query: (id) => ({
        url: `/system/backups/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['System'],
    }),

    downloadSystemBackup: builder.query<Blob, number>({
      query: (id) => ({
        url: `/system/backups/${id}/download`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // System maintenance
    startMaintenance: builder.mutation<{ success: boolean; message: string }, SystemMaintenanceRequest>({
      query: (data) => ({
        url: '/system/maintenance/start',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['System'],
    }),

    stopMaintenance: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/system/maintenance/stop',
        method: 'POST',
      }),
      invalidatesTags: ['System'],
    }),

    getMaintenanceStatus: builder.query<{ isMaintenanceMode: boolean; message?: string; startedAt?: string }, void>({
      query: () => '/system/maintenance/status',
    }),

    // System notifications
    getSystemNotifications: builder.query<SystemNotificationResponse[], void>({
      query: () => '/system/notifications',
      providesTags: ['System'],
    }),

    createSystemNotification: builder.mutation<SystemNotificationResponse, SystemNotificationRequest>({
      query: (data) => ({
        url: '/system/notifications',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['System'],
    }),

    updateSystemNotification: builder.mutation<SystemNotificationResponse, { id: number; data: Partial<SystemNotificationRequest> }>({
      query: ({ id, data }) => ({
        url: `/system/notifications/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['System'],
    }),

    deleteSystemNotification: builder.mutation<void, number>({
      query: (id) => ({
        url: `/system/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['System'],
    }),

    // System audit
    getSystemAudit: builder.query<SystemAuditResponse, SystemAuditQueryParams>({
      query: (params) => ({
        url: '/system/audit',
        params,
      }),
      providesTags: ['System'],
    }),

    exportSystemAudit: builder.query<Blob, SystemAuditQueryParams>({
      query: (params) => ({
        url: '/system/audit/export',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // System reports
    getSystemReports: builder.query<SystemReportResponse[], void>({
      query: () => '/system/reports',
      providesTags: ['System'],
    }),

    generateSystemReport: builder.mutation<SystemReportResponse, SystemReportRequest>({
      query: (data) => ({
        url: '/system/reports/generate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['System'],
    }),

    downloadSystemReport: builder.query<Blob, number>({
      query: (id) => ({
        url: `/system/reports/${id}/download`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // System utilities
    clearSystemCache: builder.mutation<{ cleared: boolean; message: string }, { type?: string }>({
      query: (params) => ({
        url: '/system/cache/clear',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['System'],
    }),

    optimizeSystem: builder.mutation<{ success: boolean; message: string; optimizations: string[] }, void>({
      query: () => ({
        url: '/system/optimize',
        method: 'POST',
      }),
      invalidatesTags: ['System'],
    }),

    getSystemInfo: builder.query<{
      version: string;
      environment: string;
      uptime: number;
      memory: { used: number; total: number };
      disk: { used: number; total: number };
      cpu: { usage: number; cores: number };
    }, void>({
      query: () => '/system/info',
    }),

    // Database operations
    getDatabaseStatus: builder.query<{
      status: string;
      connections: number;
      size: number;
      lastBackup?: string;
    }, void>({
      query: () => '/system/database/status',
    }),

    optimizeDatabase: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/system/database/optimize',
        method: 'POST',
      }),
      invalidatesTags: ['System'],
    }),

    // Security operations
    getSecurityStatus: builder.query<{
      lastScan: string;
      threats: number;
      vulnerabilities: number;
      recommendations: string[];
    }, void>({
      query: () => '/system/security/status',
    }),

    runSecurityScan: builder.mutation<{ success: boolean; message: string; scanId: string }, void>({
      query: () => ({
        url: '/system/security/scan',
        method: 'POST',
      }),
      invalidatesTags: ['System'],
    }),
  }),
});

export const {
  useGetSystemConfigQuery,
  useUpdateSystemConfigMutation,
  useResetSystemConfigMutation,
  useGetSystemHealthQuery,
  useGetSystemMetricsQuery,
  useCheckSystemStatusQuery,
  useGetSystemLogsQuery,
  useGetSystemLogByIdQuery,
  useClearSystemLogsMutation,
  useExportSystemLogsQuery,
  useGetSystemBackupsQuery,
  useCreateSystemBackupMutation,
  useRestoreSystemBackupMutation,
  useDeleteSystemBackupMutation,
  useDownloadSystemBackupQuery,
  useStartMaintenanceMutation,
  useStopMaintenanceMutation,
  useGetMaintenanceStatusQuery,
  useGetSystemNotificationsQuery,
  useCreateSystemNotificationMutation,
  useUpdateSystemNotificationMutation,
  useDeleteSystemNotificationMutation,
  useGetSystemAuditQuery,
  useExportSystemAuditQuery,
  useGetSystemReportsQuery,
  useGenerateSystemReportMutation,
  useDownloadSystemReportQuery,
  useClearSystemCacheMutation,
  useOptimizeSystemMutation,
  useGetSystemInfoQuery,
  useGetDatabaseStatusQuery,
  useOptimizeDatabaseMutation,
  useGetSecurityStatusQuery,
  useRunSecurityScanMutation,
} = systemApi;
