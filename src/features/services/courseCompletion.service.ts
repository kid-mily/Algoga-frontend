import { api, ApiResponse } from "@/lib/api";
import type { CourseCompletion } from "@/features/classroom/completion/types";

export const completeCourse = async (
    courseId: string | number
): Promise<CourseCompletion> => {
    const response = await api.post<ApiResponse<CourseCompletion>>(
        `/api/v1/courses/${courseId}/complete`,
        undefined,
        {
            suppressGlobalError: true,
        }
    );

    return response.data;
};

// 수료 성공 후 내 강의 상태를 다시 확인하는 용도
export const getMyCourses = async (): Promise<unknown> => {
    const response = await api.get<ApiResponse<unknown>>(
        "/api/v1/my/courses",
        {
        cache: "no-store",
        suppressGlobalError: true,
        }
    );

    return response.data;
};