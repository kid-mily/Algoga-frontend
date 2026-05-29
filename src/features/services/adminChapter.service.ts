// src/features/services/adminCourse.service.ts

import { adminApi } from "@/lib/api";

export interface AdminCourse {
  courseId: number;
  countryId: number;
  countryName?: string;
  title: string;
  description: string;
  price: number;
  level: string;
  thumbnailUrl?: string;
  studentCount?: number;
  chapterCount?: number;
  status?: string;
  isPublic?: boolean;
  createdAt?: string;
  mileage?: number;
}

export interface CourseCountry {
  countryId: number;
  countryName: string;
  continentName?: string;
}

// ------------------------------------------
// 1. 강의 목록 조회
// ------------------------------------------
export const getAdminCourses = async (): Promise<AdminCourse[]> => {
  try {
    const response = await adminApi.get("/api/v1/admin/courses");
    return response.data.data || response.data;
  } catch (error: any) {
    console.error(`🔥 강의 목록 조회 에러 [상태코드: ${error.response?.status || '네트워크 에러'}]:`, error.response?.data || error);
    throw new Error(error.response?.data?.message || "강의 목록을 불러오지 못했습니다.");
  }
};

// ------------------------------------------
// 2. 국가 목록 조회
// ------------------------------------------
export const getCourseCountries = async (): Promise<CourseCountry[]> => {
  try {
    const response = await adminApi.get("/api/v1/admin/countries");
    return response.data.data || response.data;
  } catch (error: any) {
    console.error(`🔥 국가 목록 조회 에러 [상태코드: ${error.response?.status || '네트워크 에러'}]:`, error.response?.data || error);
    throw new Error(error.response?.data?.message || "국가 목록을 불러오지 못했습니다.");
  }
};

// ------------------------------------------
// 3. 강의 생성 (createAdminCourse)
// ------------------------------------------
export const createAdminCourse = async (payload: any) => {
  try {
    const formData = new FormData();
    const requestData = {
      countryId: payload.countryId,
      title: payload.title,
      description: payload.description,
      price: payload.price,
      level: payload.level,
    };

    formData.append(
      "request",
      new Blob([JSON.stringify(requestData)], { type: "application/json" })
    );

    formData.append("thumbnail", payload.thumbnail);

    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((file: File) => {
        formData.append("files", file);
      });
    }

    const response = await adminApi.post("/api/v1/admin/courses", formData);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error(`🔥 강의 생성 에러 [상태코드: ${error.response?.status || '네트워크 에러'}]:`, error.response?.data || error);
    throw new Error(error.response?.data?.message || "강의 등록에 실패했습니다.");
  }
};

// ------------------------------------------
// 4. 강의 단일 조회 (getAdminCourse)
// ------------------------------------------
export const getAdminCourse = async (courseId: number): Promise<AdminCourse> => {
  try {
    const response = await adminApi.get(`/api/v1/admin/courses/${courseId}`);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error(`🔥 강의 상세 조회 에러 [상태코드: ${error.response?.status || '네트워크 에러'}]:`, error.response?.data || error);
    throw new Error(error.response?.data?.message || "강의 정보를 불러오지 못했습니다.");
  }
};

// ------------------------------------------
// 5. 강의 수정 (updateAdminCourse)
// ------------------------------------------
export const updateAdminCourse = async (courseId: number, payload: any) => {
  try {
    const response = await adminApi.put(`/api/v1/admin/courses/${courseId}`, payload);
    return response.data.data || response.data;
  } catch (error: any) {
    // 🌟 여기에 상태 코드(status)가 출력되도록 수정했습니다!
    console.error(
      `🔥 강의 수정 에러 [상태코드: ${error.response?.status || '네트워크/CORS 에러'}]:`, 
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "강의 수정에 실패했습니다.");
  }
};

// ------------------------------------------
// 6. 강의 삭제 (deleteAdminCourse)
// ------------------------------------------
export const deleteAdminCourse = async (courseId: number) => {
  try {
    const response = await adminApi.delete(`/api/v1/admin/courses/${courseId}`);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error(`🔥 강의 삭제 에러 [상태코드: ${error.response?.status || '네트워크 에러'}]:`, error.response?.data || error);
    throw new Error(error.response?.data?.message || "강의 삭제에 실패했습니다.");
  }
};