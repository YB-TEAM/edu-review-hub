"use client";

import { useState } from "react";
import {
  useGetReviewsQuery,
  useCreateReviewMutation,
} from "@/lib/services/reviewApi";
import { useGetCoursesQuery } from "@/lib/services/courseApi";
import { useGetInstitutionsQuery } from "@/lib/services/institutionApi";
import {
  getErrorMessage,
  showSuccessToast,
  showErrorToast,
} from "@/lib/apiUtils";

export function ReviewList() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort_by: "created_at" as const,
    sort_order: "desc" as const,
  });

  // RTK Query hooks
  const {
    data: reviewsData,
    isLoading,
    isError,
    error,
  } = useGetReviewsQuery(filters);
  const { data: coursesData } = useGetCoursesQuery({});
  const { data: institutionsData } = useGetInstitutionsQuery({});
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();

  // Form state
  const [formData, setFormData] = useState({
    course_id: "",
    institution_id: "",
    rating: 5,
    content: "",
    pros: "",
    cons: "",
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createReview({
        course_id: parseInt(formData.course_id),
        institution_id: parseInt(formData.institution_id),
        rating: formData.rating,
        content: formData.content,
        pros: formData.pros || undefined,
        cons: formData.cons || undefined,
      }).unwrap();

      showSuccessToast("Review created successfully!");
      setFormData({
        course_id: "",
        institution_id: "",
        rating: 5,
        content: "",
        pros: "",
        cons: "",
      });
    } catch (error) {
      showErrorToast(getErrorMessage(error));
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2">Loading reviews...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-error-50 border border-error-200 rounded-lg p-4">
        <h3 className="text-error-800 font-medium">Error loading reviews</h3>
        <p className="text-error-600 mt-1">{getErrorMessage(error)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Review Form */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Create New Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Course</label>
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="">Select a course</option>
                {coursesData?.data.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Institution
              </label>
              <select
                name="institution_id"
                value={formData.institution_id}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="">Select an institution</option>
                {institutionsData?.data.map((institution) => (
                  <option key={institution.id} value={institution.id}>
                    {institution.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Star{rating !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Review Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="input-field"
              rows={4}
              placeholder="Share your experience..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Pros (Optional)
              </label>
              <textarea
                name="pros"
                value={formData.pros}
                onChange={handleInputChange}
                className="input-field"
                rows={3}
                placeholder="What did you like?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Cons (Optional)
              </label>
              <textarea
                name="cons"
                value={formData.cons}
                onChange={handleInputChange}
                className="input-field"
                rows={3}
                placeholder="What could be improved?"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating..." : "Create Review"}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>

        {reviewsData?.data.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews found.</p>
        ) : (
          <div className="space-y-4">
            {reviewsData?.data.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {review.user?.name || "Anonymous"}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < review.rating
                            ? "text-warning-500"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 mb-2">{review.content}</p>

                {(review.pros || review.cons) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    {review.pros && (
                      <div>
                        <span className="text-sm font-medium text-success-600">
                          Pros:
                        </span>
                        <p className="text-sm text-gray-600">{review.pros}</p>
                      </div>
                    )}
                    {review.cons && (
                      <div>
                        <span className="text-sm font-medium text-error-600">
                          Cons:
                        </span>
                        <p className="text-sm text-gray-600">{review.cons}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{review.course?.name}</span>
                    <span>•</span>
                    <span>{review.institution?.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {reviewsData && reviewsData.last_page > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {(filters.page - 1) * filters.limit + 1} to{" "}
              {Math.min(filters.page * filters.limit, reviewsData.total)} of{" "}
              {reviewsData.total} reviews
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={filters.page === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={filters.page === reviewsData.last_page}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
