import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import {
  ProfileResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UpdateAvatarRequest,
  ProfileSettings,
  NotificationPreferences,
  PrivacySettings,
  SecuritySettings,
  ProfileStatistics,
  ProfileActivity
} from '@/types/profile';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery,
  tagTypes: ['Profile', 'ProfileSettings', 'ProfileStats'],
  endpoints: (builder) => ({
    // Basic profile operations
    getProfile: builder.query<ProfileResponse, void>({
      query: () => '/api/v1/profile',
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation<ProfileResponse, UpdateProfileRequest>({
      query: (data) => ({ url: '/api/v1/profile', method: 'PUT', body: data }),
      invalidatesTags: ['Profile'],
    }),

    // Password management
    changePassword: builder.mutation<{ success: boolean }, ChangePasswordRequest>({
      query: (data) => ({ url: '/api/v1/profile/change-password', method: 'POST', body: data }),
    }),

    // Avatar management
    updateAvatar: builder.mutation<{ avatarUrl: string }, UpdateAvatarRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append('avatar', data.avatar);
        return { 
          url: '/api/v1/profile/avatar', 
          method: 'PUT', 
          body: formData,
          headers: {}, // Let the browser set Content-Type for FormData
        };
      },
      invalidatesTags: ['Profile'],
    }),

    removeAvatar: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: '/api/v1/profile/avatar', method: 'DELETE' }),
      invalidatesTags: ['Profile'],
    }),

    // Profile settings
    getProfileSettings: builder.query<ProfileSettings, void>({
      query: () => '/api/v1/profile/settings',
      providesTags: ['ProfileSettings'],
    }),

    updateProfileSettings: builder.mutation<ProfileSettings, Partial<ProfileSettings>>({
      query: (settings) => ({ url: '/api/v1/profile/settings', method: 'PUT', body: settings }),
      invalidatesTags: ['ProfileSettings'],
    }),

    // Notification preferences
    getNotificationPreferences: builder.query<NotificationPreferences, void>({
      query: () => '/api/v1/profile/notifications',
      providesTags: ['ProfileSettings'],
    }),

    updateNotificationPreferences: builder.mutation<NotificationPreferences, NotificationPreferences>({
      query: (preferences) => ({ url: '/api/v1/profile/notifications', method: 'PUT', body: preferences }),
      invalidatesTags: ['ProfileSettings'],
    }),

    // Privacy settings
    getPrivacySettings: builder.query<PrivacySettings, void>({
      query: () => '/api/v1/profile/privacy',
      providesTags: ['ProfileSettings'],
    }),

    updatePrivacySettings: builder.mutation<PrivacySettings, PrivacySettings>({
      query: (settings) => ({ url: '/api/v1/profile/privacy', method: 'PUT', body: settings }),
      invalidatesTags: ['ProfileSettings'],
    }),

    // Security settings
    getSecuritySettings: builder.query<SecuritySettings, void>({
      query: () => '/api/v1/profile/security',
      providesTags: ['ProfileSettings'],
    }),

    updateSecuritySettings: builder.mutation<SecuritySettings, SecuritySettings>({
      query: (settings) => ({ url: '/api/v1/profile/security', method: 'PUT', body: settings }),
      invalidatesTags: ['ProfileSettings'],
    }),

    // Two-factor authentication
    enableTwoFactor: builder.mutation<{ qrCode: string; secret: string }, void>({
      query: () => ({ url: '/api/v1/profile/2fa/enable', method: 'POST' }),
      invalidatesTags: ['ProfileSettings'],
    }),

    verifyTwoFactor: builder.mutation<{ success: boolean }, { code: string }>({
      query: (data) => ({ url: '/api/v1/profile/2fa/verify', method: 'POST', body: data }),
      invalidatesTags: ['ProfileSettings'],
    }),

    disableTwoFactor: builder.mutation<{ success: boolean }, { code: string }>({
      query: (data) => ({ url: '/api/v1/profile/2fa/disable', method: 'POST', body: data }),
      invalidatesTags: ['ProfileSettings'],
    }),

    // Backup codes
    generateBackupCodes: builder.mutation<{ codes: string[] }, void>({
      query: () => ({ url: '/api/v1/profile/2fa/backup-codes', method: 'POST' }),
      invalidatesTags: ['ProfileSettings'],
    }),

    // Session management
    getActiveSessions: builder.query<{ sessions: any[] }, void>({
      query: () => '/api/v1/profile/sessions',
      providesTags: ['ProfileSettings'],
    }),

    revokeSession: builder.mutation<{ success: boolean }, string>({
      query: (sessionId) => ({ url: `/profile/sessions/${sessionId}`, method: 'DELETE' }),
      invalidatesTags: ['ProfileSettings'],
    }),

    revokeAllSessions: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: '/api/v1/profile/sessions/revoke-all', method: 'POST' }),
      invalidatesTags: ['ProfileSettings'],
    }),

    // Profile statistics
    getProfileStatistics: builder.query<ProfileStatistics, { startDate?: string; endDate?: string }>({
      query: (params) => ({ url: '/api/v1/profile/statistics', method: 'GET', params }),
      providesTags: ['ProfileStats'],
    }),

    // Profile activity
    getProfileActivity: builder.query<ProfileActivity[], { limit?: number; type?: string }>({
      query: (params) => ({ url: '/api/v1/profile/activity', method: 'GET', params }),
      providesTags: ['Profile'],
    }),

    // Profile verification
    requestEmailVerification: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: '/api/v1/profile/verify-email', method: 'POST' }),
    }),

    verifyEmail: builder.mutation<{ success: boolean }, { token: string }>({
      query: (data) => ({ url: '/api/v1/profile/verify-email', method: 'POST', body: data }),
      invalidatesTags: ['Profile'],
    }),

    // Profile export
    exportProfileData: builder.mutation<{ downloadUrl: string }, { format: string }>({
      query: (data) => ({ url: '/api/v1/profile/export', method: 'POST', body: data }),
    }),

    // Profile deletion
    requestProfileDeletion: builder.mutation<{ success: boolean }, { reason: string }>({
      query: (data) => ({ url: '/api/v1/profile/deletion-request', method: 'POST', body: data }),
    }),

    cancelProfileDeletion: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: '/api/v1/profile/deletion-request', method: 'DELETE' }),
    }),

    // Profile backup
    createProfileBackup: builder.mutation<{ backupId: string; downloadUrl: string }, void>({
      query: () => ({ url: '/api/v1/profile/backup', method: 'POST' }),
    }),

    getProfileBackups: builder.query<{ id: string; createdAt: string; size: string }[], void>({
      query: () => '/api/v1/profile/backups',
      providesTags: ['Profile'],
    }),

    downloadProfileBackup: builder.query<{ downloadUrl: string }, string>({
      query: (id) => `/api/v1/profile/backups/${backupId}/download`,
    }),

    deleteProfileBackup: builder.mutation<{ success: boolean }, string>({
      query: (backupId) => ({ url: `/profile/backups/${backupId}`, method: 'DELETE' }),
      invalidatesTags: ['Profile'],
    }),

    // Profile preferences
    getProfilePreferences: builder.query<{ preferences: any }, void>({
      query: () => '/api/v1/profile/preferences',
      providesTags: ['ProfileSettings'],
    }),

    updateProfilePreferences: builder.mutation<{ success: boolean }, { preferences: any }>({
      query: (data) => ({ url: '/api/v1/profile/preferences', method: 'PUT', body: data }),
      invalidatesTags: ['ProfileSettings'],
    }),

    // Profile themes
    getProfileThemes: builder.query<{ themes: any[]; currentTheme: string }, void>({
      query: () => '/api/v1/profile/themes',
      providesTags: ['ProfileSettings'],
    }),

    updateProfileTheme: builder.mutation<{ success: boolean }, { theme: string }>({
      query: (data) => ({ url: '/api/v1/profile/themes', method: 'PUT', body: data }),
      invalidatesTags: ['ProfileSettings'],
    }),

    // Profile language
    getProfileLanguage: builder.query<{ language: string; availableLanguages: string[] }, void>({
      query: () => '/api/v1/profile/language',
      providesTags: ['ProfileSettings'],
    }),

    updateProfileLanguage: builder.mutation<{ success: boolean }, { language: string }>({
      query: (data) => ({ url: '/api/v1/profile/language', method: 'PUT', body: data }),
      invalidatesTags: ['ProfileSettings'],
    }),

    // Profile timezone
    getProfileTimezone: builder.query<{ timezone: string; availableTimezones: string[] }, void>({
      query: () => '/api/v1/profile/timezone',
      providesTags: ['ProfileSettings'],
    }),

    updateProfileTimezone: builder.mutation<{ success: boolean }, { timezone: string }>({
      query: (data) => ({ url: '/api/v1/profile/timezone', method: 'PUT', body: data }),
      invalidatesTags: ['ProfileSettings'],
    }),

    // Profile currency
    getProfileCurrency: builder.query<{ currency: string; availableCurrencies: string[] }, void>({
      query: () => '/api/v1/profile/currency',
      providesTags: ['ProfileSettings'],
    }),

    updateProfileCurrency: builder.mutation<{ success: boolean }, { currency: string }>({
      query: (data) => ({ url: '/api/v1/profile/currency', method: 'PUT', body: data }),
      invalidatesTags: ['ProfileSettings'],
    }),

    // Profile social links
    getProfileSocialLinks: builder.query<{ socialLinks: any[] }, void>({
      query: () => '/api/v1/profile/social-links',
      providesTags: ['Profile'],
    }),

    addProfileSocialLink: builder.mutation<{ success: boolean }, { platform: string; url: string }>({
      query: (data) => ({ url: '/api/v1/profile/social-links', method: 'POST', body: data }),
      invalidatesTags: ['Profile'],
    }),

    updateProfileSocialLink: builder.mutation<{ success: boolean }, { id: string; platform: string; url: string }>({
      query: ({ id, ...data }) => ({ url: `/profile/social-links/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Profile'],
    }),

    deleteProfileSocialLink: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/profile/social-links/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Profile'],
    }),

    // Profile achievements
    getProfileAchievements: builder.query<{ achievements: any[]; totalPoints: number }, void>({
      query: () => '/api/v1/profile/achievements',
      providesTags: ['Profile'],
    }),

    // Profile badges
    getProfileBadges: builder.query<{ badges: any[] }, void>({
      query: () => '/api/v1/profile/badges',
      providesTags: ['Profile'],
    }),

    // Profile reputation
    getProfileReputation: builder.query<{ reputation: number; level: string; nextLevel: string }, void>({
      query: () => '/api/v1/profile/reputation',
      providesTags: ['Profile'],
    }),
  }),
});

export const {
  // Basic profile operations
  useGetProfileQuery,
  useUpdateProfileMutation,
  
  // Password management
  useChangePasswordMutation,
  
  // Avatar management
  useUpdateAvatarMutation,
  useRemoveAvatarMutation,
  
  // Profile settings
  useGetProfileSettingsQuery,
  useUpdateProfileSettingsMutation,
  
  // Notification preferences
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
  
  // Privacy settings
  useGetPrivacySettingsQuery,
  useUpdatePrivacySettingsMutation,
  
  // Security settings
  useGetSecuritySettingsQuery,
  useUpdateSecuritySettingsMutation,
  
  // Two-factor authentication
  useEnableTwoFactorMutation,
  useVerifyTwoFactorMutation,
  useDisableTwoFactorMutation,
  
  // Backup codes
  useGenerateBackupCodesMutation,
  
  // Session management
  useGetActiveSessionsQuery,
  useRevokeSessionMutation,
  useRevokeAllSessionsMutation,
  
  // Profile statistics
  useGetProfileStatisticsQuery,
  
  // Profile activity
  useGetProfileActivityQuery,
  
  // Profile verification
  useRequestEmailVerificationMutation,
  useVerifyEmailMutation,
  
  // Profile export
  useExportProfileDataMutation,
  
  // Profile deletion
  useRequestProfileDeletionMutation,
  useCancelProfileDeletionMutation,
  
  // Profile backup
  useCreateProfileBackupMutation,
  useGetProfileBackupsQuery,
  useDownloadProfileBackupQuery,
  useDeleteProfileBackupMutation,
  
  // Profile preferences
  useGetProfilePreferencesQuery,
  useUpdateProfilePreferencesMutation,
  
  // Profile themes
  useGetProfileThemesQuery,
  useUpdateProfileThemeMutation,
  
  // Profile language
  useGetProfileLanguageQuery,
  useUpdateProfileLanguageMutation,
  
  // Profile timezone
  useGetProfileTimezoneQuery,
  useUpdateProfileTimezoneMutation,
  
  // Profile currency
  useGetProfileCurrencyQuery,
  useUpdateProfileCurrencyMutation,
  
  // Profile social links
  useGetProfileSocialLinksQuery,
  useAddProfileSocialLinkMutation,
  useUpdateProfileSocialLinkMutation,
  useDeleteProfileSocialLinkMutation,
  
  // Profile achievements
  useGetProfileAchievementsQuery,
  
  // Profile badges
  useGetProfileBadgesQuery,
  
  // Profile reputation
  useGetProfileReputationQuery,
} = profileApi;
