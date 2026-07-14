import type { RecommendedCourse } from "../evaluationResult.types";

const SELECTED_RECOMMENDED_COURSE_KEY = "selected-diagnosis-recommended-course";

export const saveSelectedRecommendedCourse = (
  course: RecommendedCourse,
  continentCode: string,
  countryId: string
) => {
  sessionStorage.setItem(
    SELECTED_RECOMMENDED_COURSE_KEY,
    JSON.stringify({
      courseId: course.courseId,
      countryId,
      continentCode,
      title: course.title,
      level: course.level,
      levelName: course.levelName ?? course.level,
      selectedAt: new Date().toISOString(),
    })
  );
};

export interface StoredRecommendedCourse {
  courseId: number;
  countryId: string;
  continentCode: string;
  title: string;
  level: string;
  levelName: string;
  selectedAt: string;
}

// 패키지 라운지에서 사용자가 방금 선택한 추천 강의 정보를 보조로 읽는다.
export const getSelectedRecommendedCourse = (): StoredRecommendedCourse | null => {
  if (typeof window === "undefined") return null;

  const stored = sessionStorage.getItem(SELECTED_RECOMMENDED_COURSE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as StoredRecommendedCourse;
  } catch {
    return null;
  }
};
