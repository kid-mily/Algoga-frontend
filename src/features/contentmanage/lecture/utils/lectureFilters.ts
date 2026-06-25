import { getIsPublic, getLectureCountryId } from "./lectureFormatters";
import {
  AdminCourseRecord,
  CourseCountry,
  LectureFilterParams,
} from "../types";

export function withCountryNames(
  lectures: AdminCourseRecord[],
  countries: CourseCountry[]
) {
  const countryNameMap = new Map<number, string>();

  countries.forEach((country) => {
    countryNameMap.set(country.countryId, country.countryName);
  });

  return lectures.map((lecture) => {
    const countryId = getLectureCountryId(lecture);
    const mappedCountryName = countryNameMap.get(countryId);

    return {
      ...lecture,
      countryName:
        lecture.countryName ||
        lecture.country_name ||
        mappedCountryName ||
        `국가 ID ${countryId}`,
    };
  });
}

export function getCountryOptions(countries: CourseCountry[]) {
  const names = countries
    .map((country) => country.countryName)
    .filter((country): country is string => Boolean(country));

  return Array.from(new Set(names));
}

export function filterLectures(
  lectures: AdminCourseRecord[],
  filters: LectureFilterParams
) {
  const keyword = filters.searchKeyword.trim().toLowerCase();

  return lectures.filter((lecture) => {
    const title = lecture.title || "";
    const description = lecture.description || "";
    const countryName = lecture.countryName || "";
    const isPublic = getIsPublic(lecture);

    const matchesSearch =
      keyword === "" ||
      title.toLowerCase().includes(keyword) ||
      description.toLowerCase().includes(keyword);

    const matchesCountry =
      filters.countryFilter === "all" || countryName === filters.countryFilter;

    const matchesStatus =
      filters.statusFilter === "all" ||
      (filters.statusFilter === "public" && isPublic) ||
      (filters.statusFilter === "private" && !isPublic);

    return matchesSearch && matchesCountry && matchesStatus;
  });
}
