import { api, ApiResult, ApiRequestError, unwrapData } from "@/lib/api";
import { LatestDiagnosisResult, MyCourse } from "@/features/mypage/coursedetails/types";

const normalizeCourses = (
  data: unknown
): MyCourse[] => {
  if (Array.isArray(data)) {
    return data as MyCourse[];
  }

  if (
    data &&
    typeof data === "object" && "content" in data && Array.isArray(
      (data as { content?: unknown }).content
    )
  ) {
    return (
      data as { content: MyCourse[] }
    ).content;
  }

  return [];
};

export const getMyCourses =
  async (): Promise<MyCourse[]> => {
    const response = await api.get<ApiResult<unknown>>("/api/v1/my/courses", {
      cache: "no-store",
      suppressGlobalError: true,
    });

    return normalizeCourses(
      unwrapData(response)
    );
  };

export const getLatestDiagnosis =
  async (): Promise<LatestDiagnosisResult | null> => {
    try {
      const response = await api.get<ApiResult<LatestDiagnosisResult>>("/api/v1/diagnosis/me/latest", {
        cache: "no-store",
        suppressGlobalError: true,
      });

      return unwrapData(response);
    } catch (error) {
      // 아직 진단평가를 응시하지 않은 경우
      if (
        error instanceof ApiRequestError &&
        error.status === 404
      ) {
        return null;
      }

      throw error;
    }
  };

export const isMyCourseCompleted = (
  course?: MyCourse
): boolean => {
  if (!course) return false;

  return (
    course.learningStatus === "COMPLETED" ||
    course.certificateAvailable === true ||
    course.completedAt !== null
  );
};