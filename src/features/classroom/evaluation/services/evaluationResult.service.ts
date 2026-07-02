import { api, type ApiResponse } from "@/lib/api";
import type { DiagnosisLevel, DiagnosisResult } from "../types";
import type { RecommendedCourse } from "../evaluationResult.types";

export const getRecommendedCourses = async (
    countryId: string,
    level: DiagnosisLevel
): Promise<RecommendedCourse[]> => {
    const response = await api.get<ApiResponse<RecommendedCourse[]>>(
        "/api/v1/diagnosis/recommendations",
        {
        params: {
            countryId,
            level,
        },
        cache: "no-store",
        suppressGlobalError: true,
        }
    );

    return response.data ?? [];
};

export const getRecommendedCoursesFromResult = async (
    countryId: string,
    result: DiagnosisResult
): Promise<RecommendedCourse[]> => {
    if (
        Array.isArray(result.recommendedCourses) &&
        result.recommendedCourses.length > 0
    ) {
        return result.recommendedCourses;
    }

    return getRecommendedCourses(countryId, result.level);
};