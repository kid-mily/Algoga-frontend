import { getErrorMessage } from "@/features/services/error.service";
import { CourseEnrollmentStatistic } from "./types";

export const formatCourseEnrollmentError = (
  error: unknown,
  fallbackMessage: string
) => getErrorMessage(error, fallbackMessage);

export const formatNumber = (value: number) =>
  Number(value || 0).toLocaleString("ko-KR");

export const formatPercent = (value: number) =>
  `${Number(value || 0).toFixed(1)}%`;

export const formatHours = (value: number) =>
  `${Number(value || 0).toFixed(1)}시간`;

export const getCourseEnrollmentSummary = (
  courses: CourseEnrollmentStatistic[]
) => {
  const totalCourseCount = courses.length;
  const totalStudentCount = courses.reduce(
    (sum, course) => sum + course.studentCount,
    0
  );
  const averageCompletionRate =
    totalCourseCount > 0
      ? courses.reduce((sum, course) => sum + course.completionRate, 0) /
        totalCourseCount
      : 0;
  const averageProgressRate =
    totalCourseCount > 0
      ? courses.reduce((sum, course) => sum + course.averageProgressRate, 0) /
        totalCourseCount
      : 0;

  return {
    totalCourseCount,
    totalStudentCount,
    averageCompletionRate,
    averageProgressRate,
  };
};
