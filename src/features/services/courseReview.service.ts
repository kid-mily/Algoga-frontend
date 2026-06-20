import { api, ApiResponse } from "@/lib/api";

export interface CourseReview {
    reviewId: number;
    courseId: number;
    userId: number;
    nickname?: string;
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

export const getCourseReviews = async (
    courseId: string | number
): Promise<CourseReview[]> => {
    const response = await api.get<ApiResponse<CourseReview[]>>(`/api/v1/courses/${courseId}/reviews`, {
        next: { revalidate: 300 },
        suppressGlobalError: true,
    });

    return response.data ?? [];
};

export const getCourseReviewSummary = async (
    courseId: string | number
): Promise<CourseReviewSummary> => {
    const response = await api.get<ApiResponse<CourseReviewSummary>>(`/api/v1/courses/${courseId}/reviews/summary`, {
        next: { revalidate: 300 },
        suppressGlobalError: true,
    });

    return response.data;
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

    const response = await api.post<ApiResponse<CourseReview>>(
        `/api/v1/courses/${courseId}/reviews`,
        { rating, content },
        { suppressGlobalError: true }
    );

    return response.data;
};