import { api, ApiResponse } from "@/lib/api";

export interface MyCourseSummary {
  courseId: number;
  title?: string;
  completed?: boolean;
  courseCompleted?: boolean;
  completionStatus?: string;
  completedAt?: string;
  certificateAvailable?: boolean;
}

const normalizeMyCourses = (
  data: unknown
): MyCourseSummary[] => {
  if (Array.isArray(data)) {
    return data as MyCourseSummary[];
  }

  if (
    data &&
    typeof data === "object" &&
    "content" in data &&
    Array.isArray(
      (data as { content?: unknown }).content
    )
  ) {
    return (
      data as { content: MyCourseSummary[] }
    ).content;
  }

  return [];
};

export const getMyCourses = async () => {
  const response = await api.get<
    ApiResponse<unknown>
  >("/api/v1/my/courses", {
    cache: "no-store",
    suppressGlobalError: true,
  });

  return normalizeMyCourses(response.data);
};

export const isMyCourseCompleted = (
  course?: MyCourseSummary
) => {
  if (!course) return false;

  return (
    course.completed === true ||
    course.courseCompleted === true ||
    course.completionStatus === "COMPLETED"
  );
};