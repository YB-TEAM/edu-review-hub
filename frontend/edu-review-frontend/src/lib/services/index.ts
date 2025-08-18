// Export all API services
export { authApi } from "./authApi";
export { profileApi } from "./profileApi";
export { courseApi } from "./courseApi";
export { reviewApi } from "./reviewApi";
export { blogApi } from "./blogApi";
export { institutionApi } from "./institutionApi";
export { uploadApi } from "./uploadApi";

// Export hooks from authApi
export {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "./authApi";

// Export hooks from profileApi
export {
  useGetProfileQuery,
  useUpdateProfileMutation as useUpdateProfileMutationFromProfile,
  useUploadAvatarMutation as useUploadAvatarMutationFromProfile,
} from "./profileApi";

// Export hooks from courseApi
export {
  useGetCoursesQuery,
  useGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetInstitutionCoursesQuery as useGetInstitutionCoursesFromCourseQuery,
  useGetCourseCategoriesQuery,
} from "./courseApi";

// Export hooks from reviewApi
export {
  useGetReviewsQuery,
  useGetReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetUserReviewsQuery,
} from "./reviewApi";

// Export hooks from blogApi
export {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useGetBlogBySlugQuery,
  useGetMyDraftsQuery,
  useGetModerationBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  usePublishBlogMutation,
  useDeleteBlogMutation,
  useLikeBlogMutation,
  useApproveBlogMutation,
  useRejectBlogMutation,
  useBanBlogMutation,
  useGetTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useGetBlogCommentsQuery,
  useAddBlogCommentMutation,
  useDeleteBlogCommentMutation,
} from "./blogApi";

// Export hooks from institutionApi
export {
  useGetInstitutionsQuery,
  useGetInstitutionByIdQuery,
  useCreateInstitutionMutation,
  useUpdateInstitutionMutation,
  useDeleteInstitutionMutation,
  useSearchInstitutionsQuery,
  useGetInstitutionsByLocationQuery,
  useGetTopRatedInstitutionsQuery,
  useGetInstitutionsByProgramQuery,
  useGetInstitutionStatsQuery,
  useUploadInstitutionLogoMutation,
  useGetInstitutionReviewsQuery,
  useGetInstitutionCoursesQuery,
} from "./institutionApi";

// Export hooks from uploadApi
export {
  useUploadImageMutation,
} from "./uploadApi";
