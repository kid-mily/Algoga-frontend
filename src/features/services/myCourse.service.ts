import type {
  LatestDiagnosisResult,
  MyCourse,
  PageResponse,
} from "@/features/mypage/coursedetails/types";
import { api, ApiRequestError, ApiResult, unwrapData } from "@/lib/api";

const emptyPage = <T>(page: number, size: number): PageResponse<T> => ({
  content: [],
  page,
  size,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
});

export async function getMyCourses(
  page = 0,
  size = 10
): Promise<PageResponse<MyCourse>> {
  const response = await api.get<ApiResult<PageResponse<MyCourse>>>(
    "/api/v1/my/courses",
    {
      params: {
        page,
        size,
      },
      cache: "no-store",
      suppressGlobalError: true,
    }
  );

  const result = unwrapData(response) ?? emptyPage<MyCourse>(page, size);

  return {
    ...result,
    content: (result.content ?? []).map((course) => ({
      ...course,
      thumbnailUrl: course.thumbnailUrl ?? null,
      countryName: course.countryName ?? "",
      totalDurationSeconds: course.totalDurationSeconds ?? 0,
      studentCount: course.studentCount ?? 0,
      averageRating: course.averageRating ?? 0,
      progressRate: course.progressRate ?? 0,
      completedChapterCount: course.completedChapterCount ?? 0,
      totalChapterCount: course.totalChapterCount ?? 0,
      quizSubmitted: course.quizSubmitted ?? false,
      reviewWritten: course.reviewWritten ?? false,
      certificateAvailable:
        course.certificateAvailable ?? Boolean(course.certificateCode),
      certificateCode: course.certificateCode ?? null,
      certificateDownloadUrl: course.certificateDownloadUrl ?? null,
      completedAt: course.completedAt ?? null,
    })),
  };
}

export async function getLatestDiagnoses(): Promise<LatestDiagnosisResult[]> {
  try {
    const response = await api.get<ApiResult<LatestDiagnosisResult[]>>(
      "/api/v1/diagnosis/me/latest",
      {
        cache: "no-store",
        suppressGlobalError: true,
      }
    );

    return unwrapData(response) ?? [];
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      (error.code === "DIAGNOSIS_RESULT_NOT_FOUND" || error.status === 404)
    ) {
      return [];
    }

    throw error;
  }
}

export const isMyCourseCompleted = (course?: MyCourse) => {
  return course?.learningStatus === "COMPLETED";
};