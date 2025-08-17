import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import {
  UploadResponse,
  UploadRequest,
  ImageUploadRequest,
  BulkUploadRequest
} from '@/types/upload';

export const uploadApi = createApi({
  reducerPath: 'uploadApi',
  baseQuery,
  tagTypes: ['Upload'],
  endpoints: (builder) => ({
    // File uploads
    uploadFile: builder.mutation<UploadResponse, UploadRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append('file', data.file);
        if (data.folder) formData.append('folder', data.folder);
        if (data.allowedTypes) formData.append('allowedTypes', JSON.stringify(data.allowedTypes));
        if (data.maxSize) formData.append('maxSize', data.maxSize.toString());
        if (data.transformation) formData.append('transformation', JSON.stringify(data.transformation));
        if (data.tags) formData.append('tags', JSON.stringify(data.tags));
        if (data.context) formData.append('context', JSON.stringify(data.context));
        
        return {
          url: '/api/v1/upload/file',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Upload'],
    }),

    uploadImage: builder.mutation<UploadResponse, ImageUploadRequest>({
      query: (data) => {
        console.log('🔍 Creating FormData for image upload:', data);
        
        const formData = new FormData();
        formData.append('image', data.image);
        
        if (data.folder) {
          formData.append('folder', data.folder);
          console.log('📁 Added folder:', data.folder);
        }
        if (data.transformation) {
          formData.append('transformation', JSON.stringify(data.transformation));
          console.log('🔄 Added transformation:', data.transformation);
        }
        if (data.tags) {
          formData.append('tags', JSON.stringify(data.tags));
          console.log('🏷️ Added tags:', data.tags);
        }
        if (data.context) {
          formData.append('context', JSON.stringify(data.context));
          console.log('📝 Added context:', data.context);
        }
        
        // Debug: Log FormData contents
        console.log('🔍 FormData contents:');
        for (let [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value);
        }
        
        return {
          url: '/api/v1/upload/image',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Upload'],
    }),

    bulkUpload: builder.mutation<UploadResponse[], BulkUploadRequest>({
      query: (data) => {
        const formData = new FormData();
        data.files.forEach((file, index) => {
          formData.append(`files`, file);
        });
        formData.append('folder', data.folder);
        if (data.tags) formData.append('tags', JSON.stringify(data.tags));
        if (data.context) formData.append('context', JSON.stringify(data.context));
        if (data.transformation) formData.append('transformation', JSON.stringify(data.transformation));
        
        return {
          url: '/api/v1/upload/bulk',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Upload'],
    }),
  }),
});

export const {
  useUploadFileMutation,
  useUploadImageMutation,
  useBulkUploadMutation,
} = uploadApi;



