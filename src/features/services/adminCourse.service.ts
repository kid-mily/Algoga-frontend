import { api, adminApi, ApiResponse } from "@/lib/api";
import { getErrorMessage } from "@/features/common/utils/getErrorMessage";
import {
  AdminCourse,
  AdminDeletedCoursePage,
  CourseCountry,
  CreateAdminCoursePayload,
  DeletedCourseQueryParams,
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

const normalizeContinentCode = (value: string) => {
  const normalized = value.trim().toUpperCase();

  if (normalized === "EURPOE") return "EUROPE";

  return normalized;
};
const getValidMaxRewardMileage = (payload: {
  maxRewardMileage?: number;
  mileage?: number;
}) => {
  const maxRewardMileage = payload.maxRewardMileage ?? payload.mileage ?? 0;

  if (!Number.isFinite(maxRewardMileage) || maxRewardMileage < 0) {
    throw new Error("최대 지급 마일리지는 0 이상의 숫자로 입력해주세요.");
  }

  return maxRewardMileage;
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


export const getAdminDeletedCourses = async (
  params: DeletedCourseQueryParams = {},
  signal?: AbortSignal
): Promise<AdminDeletedCoursePage> => {
  try {
    const response = await adminApi.get<ApiResponse<AdminDeletedCoursePage>>(
      "/api/v1/admin/courses/deleted",
      {
        params: {
          countryId: params.countryId,
          countryName: params.countryName,
          page: params.page ?? 0,
          size: params.size ?? 10,
          sort: params.sort,
          t: Date.now(),
        },
        signal,
        suppressGlobalError: true,
      }
    );

    return response.data;
  } catch (error: unknown) {
    throw new Error(
      getErrorMessage(error, "삭제 강의 목록 조회에 실패했습니다.")
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
        const rawContinentCode =
          continent.continentCode ?? continent.continent_code ?? "";
        const continentCode = normalizeContinentCode(rawContinentCode);

        if (!continentCode) return [];

        const countryResponse = await api
          .get<ApiResponse<CountryRecord[]>>(
            `/api/v1/maps/continents/${continentCode}/countries`,
            {
              params: { t: Date.now() },
              signal,
              suppressGlobalError: true,
            }
          )
          .catch((error: unknown) => {
            if (signal?.aborted) throw error;

            return { data: [] } as ApiResponse<CountryRecord[]>;
          });

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
      .filter((country) => country.countryId && country.countryName);
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "국가 목록 조회에 실패했습니다."));
  }
};

export const createAdminCourse = async (
  payload: CreateAdminCoursePayload
): Promise<AdminCourse> => {
  try {
    const formData = new FormData();
    const maxRewardMileage = getValidMaxRewardMileage(payload);

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

export const publishAdminCourse = async (
  courseId: number
): Promise<AdminCourse> => {
  try {
    const response = await adminApi.post<ApiResponse<AdminCourse>>(
      `/api/v1/admin/courses/${courseId}/publish`,
      undefined,
      { suppressGlobalError: true }
    );

    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "강의 공개에 실패했습니다."));
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

    const maxRewardMileage = getValidMaxRewardMileage(payload);

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

