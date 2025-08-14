import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import {
  UploadResponse,
  UploadListResponse,
  UploadRequest,
  UploadQueryParams,
  UploadStatistics,
  UploadAnalytics,
  ImageUploadRequest,
  FileUploadRequest,
  BulkUploadRequest,
  UploadValidationResult
} from '@/types/upload';

export const uploadApi = createApi({
  reducerPath: 'uploadApi',
  baseQuery,
  tagTypes: ['Upload', 'UploadStats'],
  endpoints: (builder) => ({
    // File uploads
    uploadFile: builder.mutation<UploadResponse, FileUploadRequest>({
      query: (data) => ({
        url: '/upload/file',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Upload'],
    }),

    uploadImage: builder.mutation<UploadResponse, ImageUploadRequest>({
      query: (data) => ({
        url: '/upload/image',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Upload'],
    }),

    bulkUpload: builder.mutation<UploadResponse[], BulkUploadRequest>({
      query: (data) => ({
        url: '/upload/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Upload'],
    }),

    // File management
    getUploads: builder.query<UploadListResponse, UploadQueryParams>({
      query: (params) => ({
        url: '/upload',
        params,
      }),
      providesTags: ['Upload'],
    }),

    getUploadById: builder.query<UploadResponse, number>({
      query: (id) => `/upload/${id}`,
      providesTags: (result, error, id) => [{ type: 'Upload', id }],
    }),

    updateUpload: builder.mutation<UploadResponse, { id: number; data: Partial<UploadRequest> }>({
      query: ({ id, data }) => ({
        url: `/upload/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Upload', id }, 'Upload'],
    }),

    deleteUpload: builder.mutation<void, number>({
      query: (id) => ({
        url: `/upload/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Upload'],
    }),

    // Image operations
    resizeImage: builder.mutation<UploadResponse, { id: number; width: number; height: number }>({
      query: ({ id, ...data }) => ({
        url: `/upload/${id}/resize`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Upload', id }],
    }),

    cropImage: builder.mutation<UploadResponse, { id: number; x: number; y: number; width: number; height: number }>({
      query: ({ id, ...data }) => ({
        url: `/upload/${id}/crop`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Upload', id }],
    }),

    compressImage: builder.mutation<UploadResponse, { id: number; quality: number }>({
      query: ({ id, ...data }) => ({
        url: `/upload/${id}/compress`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Upload', id }],
    }),

    // File operations
    downloadFile: builder.query<Blob, number>({
      query: (id) => ({
        url: `/upload/${id}/download`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    generateThumbnail: builder.mutation<UploadResponse, { id: number; size: string }>({
      query: ({ id, ...data }) => ({
        url: `/upload/${id}/thumbnail`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Upload', id }],
    }),

    // Validation and processing
    validateUpload: builder.query<UploadValidationResult, number>({
      query: (id) => `/upload/${id}/validate`,
    }),

    processUpload: builder.mutation<UploadResponse, { id: number; options: Record<string, unknown> }>({
      query: ({ id, options }) => ({
        url: `/upload/${id}/process`,
        method: 'POST',
        body: options,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Upload', id }],
    }),

    // Statistics and analytics
    getUploadStatistics: builder.query<UploadStatistics, void>({
      query: () => '/upload/statistics',
      providesTags: ['UploadStats'],
    }),

    getUploadAnalytics: builder.query<UploadAnalytics, { period: string; type?: string }>({
      query: (params) => ({
        url: '/upload/analytics',
        params,
      }),
      providesTags: ['UploadStats'],
    }),

    // Search and filtering
    searchUploads: builder.query<UploadListResponse, { query: string; filters?: Record<string, unknown> }>({
      query: (params) => ({
        url: '/upload/search',
        params,
      }),
      providesTags: ['Upload'],
    }),

    // Batch operations
    batchDelete: builder.mutation<void, number[]>({
      query: (ids) => ({
        url: '/upload/batch/delete',
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: ['Upload'],
    }),

    batchProcess: builder.mutation<UploadResponse[], { ids: number[]; operation: string; options?: Record<string, unknown> }>({
      query: (data) => ({
        url: '/upload/batch/process',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Upload'],
    }),

    // Export and import
    exportUploads: builder.query<Blob, UploadQueryParams>({
      query: (params) => ({
        url: '/upload/export',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Storage management
    getStorageInfo: builder.query<{ used: number; total: number; files: number }, void>({
      query: () => '/upload/storage/info',
    }),

    cleanupStorage: builder.mutation<{ deleted: number; freed: number }, { olderThan?: string; minSize?: number }>({
      query: (params) => ({
        url: '/upload/storage/cleanup',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['Upload', 'UploadStats'],
    }),
  }),
});

export const {
  useUploadFileMutation,
  useUploadImageMutation,
  useBulkUploadMutation,
  useGetUploadsQuery,
  useGetUploadByIdQuery,
  useUpdateUploadMutation,
  useDeleteUploadMutation,
  useResizeImageMutation,
  useCropImageMutation,
  useCompressImageMutation,
  useDownloadFileQuery,
  useGenerateThumbnailMutation,
  useValidateUploadQuery,
  useProcessUploadMutation,
  useGetUploadStatisticsQuery,
  useGetUploadAnalyticsQuery,
  useSearchUploadsQuery,
  useBatchDeleteMutation,
  useBatchProcessMutation,
  useExportUploadsQuery,
  useGetStorageInfoQuery,
  useCleanupStorageMutation,
} = uploadApi;
