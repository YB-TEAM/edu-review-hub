import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import {
  EmailVerificationResponse,
  EmailVerificationListResponse,
  EmailVerificationRequest,
  EmailVerificationQueryParams,
  EmailVerificationStatistics,
  EmailVerificationAnalytics,
  EmailTemplateResponse,
  EmailTemplateRequest,
  EmailVerificationSettings,
  EmailVerificationReport
} from '@/types/email-verification';

export const emailVerificationApi = createApi({
  reducerPath: 'emailVerificationApi',
  baseQuery,
  tagTypes: ['EmailVerification', 'EmailTemplate', 'EmailVerificationStats'],
  endpoints: (builder) => ({
    // Email verification requests
    getEmailVerifications: builder.query<EmailVerificationListResponse, EmailVerificationQueryParams>({
      query: (params) => ({
        url: '/email-verifications',
        params,
      }),
      providesTags: ['EmailVerification'],
    }),

    getEmailVerificationById: builder.query<EmailVerificationResponse, number>({
      query: (id) => `/email-verifications/${id}`,
      providesTags: (result, error, id) => [{ type: 'EmailVerification', id }],
    }),

    createEmailVerification: builder.mutation<EmailVerificationResponse, EmailVerificationRequest>({
      query: (data) => ({
        url: '/email-verifications',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['EmailVerification'],
    }),

    updateEmailVerification: builder.mutation<EmailVerificationResponse, { id: number; data: Partial<EmailVerificationRequest> }>({
      query: ({ id, data }) => ({
        url: `/email-verifications/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'EmailVerification', id }],
    }),

    deleteEmailVerification: builder.mutation<void, number>({
      query: (id) => ({
        url: `/email-verifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['EmailVerification'],
    }),

    // Email verification operations
    resendVerificationEmail: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/email-verifications/${id}/resend`,
        method: 'POST',
      }),
      invalidatesTags: ['EmailVerification'],
    }),

    verifyEmail: builder.mutation<{ success: boolean; message: string }, { token: string; userId: number }>({
      query: (data) => ({
        url: '/email-verifications/verify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['EmailVerification'],
    }),

    expireVerification: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/email-verifications/${id}/expire`,
        method: 'POST',
      }),
      invalidatesTags: ['EmailVerification'],
    }),

    // Email verification by user
    getUserEmailVerifications: builder.query<EmailVerificationListResponse, { userId: number; params?: Partial<EmailVerificationQueryParams> }>({
      query: ({ userId, params }) => ({
        url: `/users/${userId}/email-verifications`,
        params,
      }),
      providesTags: (result, error, { userId }) => [{ type: 'EmailVerification', userId }],
    }),

    getUserPendingVerifications: builder.query<EmailVerificationResponse[], number>({
      query: (userId) => `/users/${userId}/email-verifications/pending`,
      providesTags: (result, error, userId) => [{ type: 'EmailVerification', userId }],
    }),

    // Email templates
    getEmailTemplates: builder.query<EmailTemplateResponse[], void>({
      query: () => '/email-verifications/templates',
      providesTags: ['EmailTemplate'],
    }),

    getEmailTemplateById: builder.query<EmailTemplateResponse, number>({
      query: (id) => `/email-verifications/templates/${id}`,
      providesTags: (result, error, id) => [{ type: 'EmailTemplate', id }],
    }),

    createEmailTemplate: builder.mutation<EmailTemplateResponse, EmailTemplateRequest>({
      query: (data) => ({
        url: '/email-verifications/templates',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['EmailTemplate'],
    }),

    updateEmailTemplate: builder.mutation<EmailTemplateResponse, { id: number; data: Partial<EmailTemplateRequest> }>({
      query: ({ id, data }) => ({
        url: `/email-verifications/templates/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'EmailTemplate', id }],
    }),

    deleteEmailTemplate: builder.mutation<void, number>({
      query: (id) => ({
        url: `/email-verifications/templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['EmailTemplate'],
    }),

    // Email verification settings
    getEmailVerificationSettings: builder.query<EmailVerificationSettings, void>({
      query: () => '/email-verifications/settings',
      providesTags: ['EmailVerification'],
    }),

    updateEmailVerificationSettings: builder.mutation<EmailVerificationSettings, Partial<EmailVerificationSettings>>({
      query: (data) => ({
        url: '/email-verifications/settings',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['EmailVerification'],
    }),

    // Email verification statistics and analytics
    getEmailVerificationStatistics: builder.query<EmailVerificationStatistics, { period: string; type?: string }>({
      query: (params) => ({
        url: '/email-verifications/statistics',
        params,
      }),
      providesTags: ['EmailVerificationStats'],
    }),

    getEmailVerificationAnalytics: builder.query<EmailVerificationAnalytics, { period: string; groupBy?: string }>({
      query: (params) => ({
        url: '/email-verifications/analytics',
        params,
      }),
      providesTags: ['EmailVerificationStats'],
    }),

    // Email verification reports
    getEmailVerificationReports: builder.query<EmailVerificationReport[], void>({
      query: () => '/email-verifications/reports',
      providesTags: ['EmailVerification'],
    }),

    generateEmailVerificationReport: builder.mutation<EmailVerificationReport, { period: string; type: string; format: string }>({
      query: (data) => ({
        url: '/email-verifications/reports/generate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['EmailVerification'],
    }),

    downloadEmailVerificationReport: builder.query<Blob, number>({
      query: (id) => ({
        url: `/email-verifications/reports/${id}/download`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Email verification export
    exportEmailVerifications: builder.query<Blob, EmailVerificationQueryParams>({
      query: (params) => ({
        url: '/email-verifications/export',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Email verification cleanup and maintenance
    clearExpiredVerifications: builder.mutation<{ cleared: number; freed: number }, { olderThan?: string }>({
      query: (params) => ({
        url: '/email-verifications/cleanup',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['EmailVerification', 'EmailVerificationStats'],
    }),

    // Email verification testing
    testEmailTemplate: builder.mutation<{ success: boolean; message: string }, { templateId: number; testData: Record<string, unknown> }>({
      query: (data) => ({
        url: '/email-verifications/templates/test',
        method: 'POST',
        body: data,
      }),
    }),

    sendTestVerificationEmail: builder.mutation<{ success: boolean; message: string }, { email: string; templateId?: number }>({
      query: (data) => ({
        url: '/email-verifications/test',
        method: 'POST',
        body: data,
      }),
    }),

    // Email verification monitoring
    getEmailVerificationQueue: builder.query<{
      pending: number;
      processing: number;
      failed: number;
      retryCount: number;
    }, void>({
      query: () => '/email-verifications/queue/status',
      providesTags: ['EmailVerification'],
    }),

    retryFailedVerifications: builder.mutation<{ retried: number; message: string }, { olderThan?: string; maxRetries?: number }>({
      query: (params) => ({
        url: '/email-verifications/retry',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['EmailVerification'],
    }),

    // Email verification insights
    getEmailVerificationInsights: builder.query<{
      deliveryRates: Array<{ period: string; rate: number; trend: number }>;
      commonIssues: Array<{ issue: string; count: number; percentage: number }>;
      recommendations: Array<{ recommendation: string; priority: string; impact: string }>;
    }, { period: string }>({
      query: (params) => ({
        url: '/email-verifications/insights',
        params,
      }),
      providesTags: ['EmailVerificationStats'],
    }),
  }),
});

export const {
  useGetEmailVerificationsQuery,
  useGetEmailVerificationByIdQuery,
  useCreateEmailVerificationMutation,
  useUpdateEmailVerificationMutation,
  useDeleteEmailVerificationMutation,
  useResendVerificationEmailMutation,
  useVerifyEmailMutation,
  useExpireVerificationMutation,
  useGetUserEmailVerificationsQuery,
  useGetUserPendingVerificationsQuery,
  useGetEmailTemplatesQuery,
  useGetEmailTemplateByIdQuery,
  useCreateEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
  useDeleteEmailTemplateMutation,
  useGetEmailVerificationSettingsQuery,
  useUpdateEmailVerificationSettingsMutation,
  useGetEmailVerificationStatisticsQuery,
  useGetEmailVerificationAnalyticsQuery,
  useGetEmailVerificationReportsQuery,
  useGenerateEmailVerificationReportMutation,
  useDownloadEmailVerificationReportQuery,
  useExportEmailVerificationsQuery,
  useClearExpiredVerificationsMutation,
  useTestEmailTemplateMutation,
  useSendTestVerificationEmailMutation,
  useGetEmailVerificationQueueQuery,
  useRetryFailedVerificationsMutation,
  useGetEmailVerificationInsightsQuery,
} = emailVerificationApi;
