import type { CourseCompletion } from "@/features/classroom/completion/types";
import { api, type ApiResult, unwrapData } from "@/lib/api";

export async function completeCourse(
  courseId: string | number
): Promise<CourseCompletion> {
  const response = await api.post<ApiResult<CourseCompletion>>(
    `/api/v1/courses/${courseId}/complete`,
    undefined,
    { suppressGlobalError: true }
  );

  return unwrapData(response);
}
