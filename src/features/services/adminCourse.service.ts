// src/features/services/adminCourse.service.ts

import axios from "axios";
import { api, adminApi } from "@/lib/api";
import {
  AdminCourse,
  CourseCountry,
  CreateAdminCoursePayload,
} from "../contentmanage/lecture/types";

// ------------------------------------------
// 2. 공통 에러 핸들러
// ------------------------------------------
const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallbackMessage;
  }
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }
  return fallbackMessage;
};

// ------------------------------------------
// 3. 강의 목록 조회 (getAdminCourses)
// ------------------------------------------
export const getAdminCourses = async (): Promise<AdminCourse[]> => {
  try {
    const response = await adminApi.get("/api/v1/admin/courses", {
      params: { 
        page: 0, 
        size: 100,
        // 🌟 핵심: 시간값을 파라미터로 넘겨서 브라우저/Next.js 캐시를 완벽히 박살냄!
        t: new Date().getTime() 
      },
    });
    
    const data = response.data.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    
    return [];
  } catch (error: any) {
    console.error(`🔥 강의 목록 조회 에러:`, error);
    throw new Error(getErrorMessage(error, "관리자 강의 목록 조회에 실패했습니다."));
  }
};

// ------------------------------------------
// 4. 국가 목록 조회 (getCourseCountries)
// ------------------------------------------
export const getCourseCountries = async (): Promise<CourseCountry[]> => {
  try {
    const continentResponse = await api.get("/api/v1/maps/continents", {
      params: { t: new Date().getTime() } // 🌟 여기도 혹시 몰라 캐시 방지 추가
    });
    const continents = continentResponse.data.data ?? [];

    const countryGroups = await Promise.all(
      continents.map(async (continent: any) => {
        const continentCode = continent.continentCode ?? continent.continent_code ?? "";
        if (!continentCode) return [];
        
        const countryResponse = await api.get(`/api/v1/maps/continents/${continentCode}/countries`, {
          params: { t: new Date().getTime() }
        });
        const countries = countryResponse.data.data ?? [];
        
        return countries.map((country: any) => ({
          countryId: country.countryId ?? country.country_id ?? 0,
          countryName: country.countryName ?? country.name ?? "",
          countryCode: country.countryCode ?? country.country_code,
          continentCode,
          continentName: continent.continentName ?? continent.continent ?? "",
        }));
      })
    );
    
    return countryGroups.flat().filter((country) => country.countryId && country.countryName);
  } catch (error: any) {
    console.error(`🔥 국가 목록 조회 에러:`, error);
    throw new Error(getErrorMessage(error, "국가 목록 조회에 실패했습니다."));
  }
};

// ------------------------------------------
// 5. 강의 등록 (createAdminCourse)
// ------------------------------------------
export const createAdminCourse = async (
  payload: CreateAdminCoursePayload
): Promise<AdminCourse> => {
  try {
    const formData = new FormData();

    const request = {
      countryId: payload.countryId,
      title: payload.title.trim(),
      description: payload.description.trim(),
      price: payload.price,
      level: payload.level,
      status: payload.status, 
      isPublic: payload.status === "PUBLISHED" 
    };

    console.log("🚀 [강의 등록] 백엔드로 쏘는 최종 JSON:", request);

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

    const response = await adminApi.post("/api/v1/admin/courses", formData);
    
    const rawData = response.data.data || response.data;
    let newCourseId = 0;

    if (typeof rawData === "number") {
      newCourseId = rawData;
    } else if (typeof rawData === "object" && rawData !== null) {
      newCourseId = rawData.courseId || rawData.course_id || rawData.id || 0;
    }

    if (!newCourseId) {
      throw new Error("강의는 등록되었지만, courseId를 찾을 수 없습니다.");
    }

    return {
      courseId: newCourseId,
      countryId: payload.countryId,
      title: payload.title,
      status: payload.status || "DRAFT",
    };
  } catch (error: any) {
    console.error(`🔥 강의 등록 에러:`, error);
    throw new Error(getErrorMessage(error, "관리자 강의 등록에 실패했습니다."));
  }
};

// ------------------------------------------
// 6. 강의 상세 조회 (getAdminCourse)
// ------------------------------------------
export const getAdminCourse = async (courseId: number): Promise<AdminCourse> => {
  try {
    const response = await adminApi.get(`/api/v1/admin/courses/${courseId}`, {
      // 🌟 상세 조회도 캐시를 완벽히 차단!
      params: { t: new Date().getTime() } 
    });
    return response.data.data || response.data;
  } catch (error: any) {
    console.error(`🔥 강의 상세 조회 에러:`, error);
    throw new Error(getErrorMessage(error, "강의 상세 조회에 실패했습니다."));
  }
};

// ------------------------------------------
// 7. 강의 수정 (updateAdminCourse)
// ------------------------------------------
export const updateAdminCourse = async (courseId: number, payload: any) => {
  try {
    const formData = new FormData();

    const requestData = {
      countryId: payload.countryId,
      title: payload.title?.trim(),
      description: payload.description?.trim(),
      price: payload.price,
      level: payload.level,
      status: payload.status, 
      isPublic: payload.status === "PUBLISHED" 
    };

    console.log("🚀 [강의 수정] 백엔드로 쏘는 최종 JSON:", requestData);

    formData.append(
      "request",
      new Blob([JSON.stringify(requestData)], { type: "application/json" })
    );

    if (payload.thumbnail) {
      formData.append("thumbnail", payload.thumbnail);
    }

    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((file: File) => {
        formData.append("files", file);
      });
    }

    const response = await adminApi.put(`/api/v1/admin/courses/${courseId}`, formData);
    return response.data;
  } catch (error: any) {
    console.error(`🔥 강의 수정 에러:`, error);
    throw new Error(getErrorMessage(error, "강의 수정에 실패했습니다."));
  }
};

// ------------------------------------------
// 8. 강의 삭제 (deleteAdminCourse)
// ------------------------------------------
export const deleteAdminCourse = async (courseId: number) => {
  try {
    const response = await adminApi.delete(`/api/v1/admin/courses/${courseId}`);
    return response.data;
  } catch (error: any) {
    console.error(`🔥 강의 삭제 에러:`, error);
    throw new Error(getErrorMessage(error, "강의 삭제에 실패했습니다."));
  }
};
