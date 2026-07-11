import { AdminCourseRecord } from "../types";

export function getLectureId(lecture: AdminCourseRecord) {
  return lecture.courseId || lecture.course_id || lecture.id || 0;
}

export function getLectureCountryId(lecture: AdminCourseRecord) {
  return lecture.countryId || lecture.country_id || 0;
}

export function getMaxRewardMileage(lecture: AdminCourseRecord) {
  if (lecture.maxRewardMileage !== undefined) return lecture.maxRewardMileage;
  if (lecture.max_reward_mileage !== undefined) return lecture.max_reward_mileage;
  if (lecture.mileage !== undefined) return lecture.mileage;
  if (lecture.reward_mileage !== undefined) return lecture.reward_mileage;

  return undefined;
}

export function getIsPublic(lecture: AdminCourseRecord) {
  if (lecture.status) {
    const status = String(lecture.status).toUpperCase();

    if (["PUBLIC", "OPEN", "PUBLISHED"].includes(status)) return true;
    if (["DRAFT", "PRIVATE", "CLOSED"].includes(status)) return false;
  }

  if (lecture.isPublic !== undefined) return String(lecture.isPublic) === "true";
  if (lecture.is_public !== undefined) return String(lecture.is_public) === "true";
  if (lecture.public !== undefined) return String(lecture.public) === "true";

  return false;
}

export function formatPrice(price?: number) {
  if (typeof price !== "number") return "-";
  return `${price.toLocaleString()}원`;
}
