export function getLectureId(lecture: any) {
  return lecture.courseId || lecture.course_id || lecture.id;
}

export function getLectureCountryId(lecture: any) {
  return lecture.countryId || lecture.country_id;
}

export function getIsPublic(lecture: any) {
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