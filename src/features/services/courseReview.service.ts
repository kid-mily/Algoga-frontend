import { api, ApiResponse } from "@/lib/api";
import { CLASSROOM_REVALIDATE_SECONDS } from "../classroom/constants/classroomCache";

export interface CourseReview {
  reviewId: number;
  courseId: number;
  userId: number;
  nickname: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseReviewSummary {
  courseId: number;
  averageRating: number;
  totalReviewCount: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
  fiveStarRate: number;
  fourStarRate: number;
  threeStarRate: number;
  twoStarRate: number;
  oneStarRate: number;
}

export interface CreateCourseReviewRequest {
  rating: number;
  content: string;
}

interface CourseReviewResponse {
  reviewId: number;
  courseId: number;
  userId: number;
  nickname?: string | null;
  userNickname?: string | null;
  writerNickname?: string | null;
  reviewerNickname?: string | null;
  userName?: string | null;
  name?: string | null;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const getReviewNickname = (review: CourseReviewResponse) =>
  review.nickname?.trim() ||
  review.userNickname?.trim() ||
  review.writerNickname?.trim() ||
  review.reviewerNickname?.trim() ||
  review.userName?.trim() ||
  review.name?.trim() ||
  "익명";

const normalizeCourseReview = (review: CourseReviewResponse): CourseReview => ({
  reviewId: review.reviewId,
  courseId: review.courseId,
  userId: review.userId,
  nickname: getReviewNickname(review),
  rating: review.rating,
  content: review.content,
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
});

export const getCourseReviews = async (
  courseId: string | number
): Promise<CourseReview[]> => {
  try {
    const response = await api.get<ApiResponse<CourseReviewResponse[]>>(
      `/api/v1/courses/${courseId}/reviews`,
      {
        next: { revalidate: CLASSROOM_REVALIDATE_SECONDS },
        suppressGlobalError: true,
      }
    );

    return (response.data ?? []).map(normalizeCourseReview);
  } catch (error) {
    console.error("[review] 후기 목록 조회 실패:", error);
    return [];
  }
};

export const getCourseReviewSummary = async (
  courseId: string | number
): Promise<CourseReviewSummary | null> => {
  try {
    const response = await api.get<ApiResponse<CourseReviewSummary>>(
      `/api/v1/courses/${courseId}/reviews/summary`,
      {
        next: { revalidate: CLASSROOM_REVALIDATE_SECONDS },
        suppressGlobalError: true,
      }
    );

    return response.data ?? null;
  } catch (error) {
    console.error("[review] 후기 요약 조회 실패:", error);
    return null;
  }
};

export const createCourseReview = async (
  courseId: string | number,
  request: CreateCourseReviewRequest
): Promise<CourseReview> => {
  const rating = Number(request.rating);
  const content = request.content.trim();

  if (rating < 1 || rating > 5) {
    throw new Error("평점은 1점부터 5점까지 선택해 주세요.");
  }

  if (!content) {
    throw new Error("후기 내용을 입력해 주세요.");
  }

  const response = await api.post<ApiResponse<CourseReviewResponse>>(
    `/api/v1/courses/${courseId}/reviews`,
    { rating, content },
    { suppressGlobalError: true }
  );

  return normalizeCourseReview(response.data);
};