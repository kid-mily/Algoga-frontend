import { api, adminApi, ApiResponse } from "@/lib/api";
import { getErrorMessage } from "@/features/common/utils/getErrorMessage";
import {
  AdminCourse,
  CourseCountry,
  CreateAdminCoursePayload,
  UpdateLecturePayload,
} from "../contentmanage/lecture/types";

type ContinentRecord = {
  continentCode?: string;
  continent_code?: string;
  continentName?: string;
  continent?: string;
};

type CountryRecord = {
  countryId?: number;
  country_id?: number;
  countryName?: string;
  name?: string;
  countryCode?: string;
  country_code?: string;
};

const supportedCountryNames = new Set([
  "남아프리카공화국",
  "이집트",
  "콩고민주공화국",
  "남극",
  "남극연구기지",
  "한국",
  "대한민국",
  "일본",
  "이탈리아",
  "프랑스",
  "미국",
  "캐나다",
  "뉴질랜드",
  "호주",
  "브라질",
  "아르헨티나",
]);

const supportedCountryCodes = new Set([
  "ZA",
  "ZAF",
  "EG",
  "EGY",
  "CD",
  "COD",
  "AQ",
  "ATA",
  "KR",
  "KOR",
  "JP",
  "JPN",
  "IT",
  "ITA",
  "FR",
  "FRA",
  "US",
  "USA",
  "CA",
  "CAN",
  "NZ",
  "NZL",
  "AU",
  "AUS",
  "BR",
  "BRA",
  "AR",
  "ARG",
]);

const normalizeCountryKey = (value?: string) =>
  value?.replace(/\s/g, "").toUpperCase() ?? "";

const isSupportedCountry = (country: CourseCountry) => {
  const countryName = country.countryName.replace(/\s/g, "");
  const countryCode = normalizeCountryKey(country.countryCode);

  return (
    supportedCountryNames.has(countryName) ||
    supportedCountryCodes.has(countryCode)
  );
};

type CourseIdRecord = {
  courseId?: number;
  course_id?: number;
  id?: number;
};

type CourseListResponse = AdminCourse[] | {
  content?: AdminCourse[];
};

export const getAdminCourses = async (
  signal?: AbortSignal
): Promise<AdminCourse[]> => {
  try {
    const response = await adminApi.get<ApiResponse<CourseListResponse>>(
      "/api/v1/admin/courses",
      {
        params: {
          page: 0,
          size: 100,
          t: Date.now(),
        },
        signal,
        suppressGlobalError: true,
      }
    );

    const data = response.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.content)) return data.content;

    return [];
  } catch (error: unknown) {
    throw new Error(
      getErrorMessage(error, "관리자 강의 목록 조회에 실패했습니다.")
    );
  }
};

export const getCourseCountries = async (
  signal?: AbortSignal
): Promise<CourseCountry[]> => {
  try {
    const continentResponse = await api.get<ApiResponse<ContinentRecord[]>>(
      "/api/v1/maps/continents",
      {
        params: { t: Date.now() },
        signal,
        suppressGlobalError: true,
      }
    );

    const continents = continentResponse.data ?? [];

    const countryGroups = await Promise.all(
      continents.map(async (continent) => {
        const continentCode =
          continent.continentCode ?? continent.continent_code ?? "";

        if (!continentCode) return [];

        const countryResponse = await api.get<ApiResponse<CountryRecord[]>>(
          `/api/v1/maps/continents/${continentCode}/countries`,
          {
            params: { t: Date.now() },
            signal,
        suppressGlobalError: true,
          }
        );

        const countries = countryResponse.data ?? [];

        return countries.map((country) => ({
          countryId: country.countryId ?? country.country_id ?? 0,
          countryName: country.countryName ?? country.name ?? "",
          countryCode: country.countryCode ?? country.country_code,
          continentCode,
          continentName:
            continent.continentName ?? continent.continent ?? "",
        }));
      })
    );

    return countryGroups
      .flat()
      .filter((country) => country.countryId && country.countryName)
      .filter(isSupportedCountry);
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "국가 목록 조회에 실패했습니다."));
  }
};

export const createAdminCourse = async (
  payload: CreateAdminCoursePayload
): Promise<AdminCourse> => {
  try {
    const formData = new FormData();
    const maxRewardMileage = payload.maxRewardMileage ?? payload.mileage ?? 0;

    const request = {
      countryId: payload.countryId,
      title: payload.title.trim(),
      description: payload.description.trim(),
      price: payload.price,
      mileage: maxRewardMileage,
      maxRewardMileage,
      level: payload.level,
      status: payload.status,
      isPublic: payload.status === "PUBLISHED",
    };

    formData.append(
      "request",
      new Blob([JSON.stringify(request)], { type: "application/json" })
    );

    formData.append("thumbnail", payload.thumbnail);

    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await adminApi.post<
      ApiResponse<number | CourseIdRecord>
    >("/api/v1/admin/courses", formData);

    const rawData = response.data;
    let newCourseId = 0;

    if (typeof rawData === "number") {
      newCourseId = rawData;
    } else if (typeof rawData === "object" && rawData !== null) {
      newCourseId =
        rawData.courseId || rawData.course_id || rawData.id || 0;
    }

    if (!newCourseId) {
      throw new Error("강의가 등록되었지만 courseId를 찾을 수 없습니다.");
    }

    return {
      courseId: newCourseId,
      countryId: payload.countryId,
      title: payload.title,
      status: payload.status || "DRAFT",
    };
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "관리자 강의 등록에 실패했습니다."));
  }
};

export const getAdminCourse = async (
  courseId: number
): Promise<AdminCourse> => {
  try {
    const response = await adminApi.get<ApiResponse<AdminCourse>>(
      `/api/v1/admin/courses/${courseId}`,
      {
        params: { t: Date.now() },
      }
    );

    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "강의 상세 조회에 실패했습니다."));
  }
};

export const updateAdminCourse = async (
  courseId: number,
  payload: UpdateLecturePayload
) => {
  try {
    const formData = new FormData();

    const maxRewardMileage = payload.maxRewardMileage ?? payload.mileage ?? 0;

    const requestData = {
      countryId: payload.countryId,
      title: payload.title?.trim(),
      description: payload.description?.trim(),
      price: payload.price,
      mileage: maxRewardMileage,
      maxRewardMileage,
      level: payload.level,
      status: payload.status,
      isPublic: payload.status === "PUBLISHED",
    };

    formData.append(
      "request",
      new Blob([JSON.stringify(requestData)], { type: "application/json" })
    );

    if (payload.thumbnail) {
      formData.append("thumbnail", payload.thumbnail);
    }

    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await adminApi.put<ApiResponse<AdminCourse>>(
      `/api/v1/admin/courses/${courseId}`,
      formData
    );

    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "강의 수정에 실패했습니다."));
  }
};

export const deleteAdminCourse = async (courseId: number) => {
  try {
    return adminApi.delete(`/api/v1/admin/courses/${courseId}`);
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "강의 삭제에 실패했습니다."));
  }
};

