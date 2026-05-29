import axios from "axios";
import { api, adminApi } from "@/lib/api";

// ------------------------------------------
// 1. 타입 (Interfaces)
// ------------------------------------------
export interface AdminCourse {
  courseId: number;
  countryId: number;
  managerId?: number;
  title: string;
  description?: string;
  price?: number;
  thumbnailUrl?: string | null;
  fileUrls?: string[];
  level?: string;
  levelName?: string;
  status?: string;
  countryName?: string;
  isPublic?: boolean;
  studentCount?: number;
  chapterCount?: number;
  createdAt?: string;
}

export interface CourseCountry {
  countryId: number;
  countryName: string;
  countryCode?: string;
  continentCode?: string;
  continentName?: string;
}

export interface CreateAdminCoursePayload {
  countryId: number;
  title: string;
  description: string;
  price: number;
  level: string;
  thumbnail: File;
  files?: File[];
}

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
      params: { page: 0, size: 100 },
    });
    
    const data = response.data.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    
    return [];
  } catch (error: any) {
    console.error(`🔥 강의 목록 조회 에러 [상태코드: ${error.response?.status || '네트워크/CORS 에러'}]:`, error.response?.data || error.message);
    throw new Error(getErrorMessage(error, "관리자 강의 목록 조회에 실패했습니다."));
  }
};

// ------------------------------------------
// 4. 국가 목록 조회 (getCourseCountries)
// ------------------------------------------
export const getCourseCountries = async (): Promise<CourseCountry[]> => {
  try {
    const continentResponse = await api.get("/api/v1/maps/continents");
    const continents = continentResponse.data.data ?? [];

    const countryGroups = await Promise.all(
      continents.map(async (continent: any) => {
        const continentCode = continent.continentCode ?? continent.continent_code ?? "";
        if (!continentCode) return [];
        
        const countryResponse = await api.get(`/api/v1/maps/continents/${continentCode}/countries`);
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
    console.error(`🔥 국가 목록 조회 에러 [상태코드: ${error.response?.status || '네트워크/CORS 에러'}]:`, error.response?.data || error.message);
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
    };

    formData.append(
      "request",
      new Blob([JSON.stringify(request)], { type: "application/json" })
    );

    formData.append("thumbnail", payload.thumbnail);

    payload.files?.forEach((file) => {
      formData.append("files", file);
    });

    // API 호출
    const response = await adminApi.post("/api/v1/admin/courses", formData);
    console.log("📝 [강의 등록] 백엔드 원본 응답:", response.data);

    // ID 안전하게 추출
    const rawData = response.data.data || response.data;
    let newCourseId = 0;

    if (typeof rawData === "number") {
      newCourseId = rawData;
    } else if (typeof rawData === "object" && rawData !== null) {
      newCourseId = rawData.courseId || rawData.course_id || rawData.id || 0;
    }

    if (!newCourseId) {
      throw new Error("강의는 등록되었지만, 서버 응답에서 생성된 강의의 ID(courseId)를 찾을 수 없습니다.");
    }

    // 다음 단계(챕터 등록)로 넘어가기 위한 객체 리턴
    return {
      courseId: newCourseId,
      countryId: payload.countryId,
      managerId: 0,
      title: payload.title,
      description: payload.description,
      price: payload.price,
      thumbnailUrl: null,
      fileUrls: [],
      level: payload.level,
      levelName: "",
      status: "DRAFT",
    };

  } catch (error: any) {
    console.error(`🔥 강의 등록 에러 [상태코드: ${error.response?.status || '네트워크/CORS 에러'}]:`, error.response?.data || error.message);
    throw new Error(getErrorMessage(error, "관리자 강의 등록에 실패했습니다."));
  }
};

// ------------------------------------------
// 6. 강의 상세 조회 (getAdminCourse)
// ------------------------------------------
export const getAdminCourse = async (courseId: number): Promise<AdminCourse> => {
  try {
    const response = await adminApi.get(`/api/v1/admin/courses/${courseId}`);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error(`🔥 강의 상세 조회 에러 [상태코드: ${error.response?.status || '네트워크/CORS 에러'}]:`, error.response?.data || error.message);
    throw new Error(getErrorMessage(error, "강의 상세 조회에 실패했습니다."));
  }
};

// ------------------------------------------
// 7. 강의 수정 (updateAdminCourse)
// ------------------------------------------
export const updateAdminCourse = async (courseId: number, payload: any) => {
  try {
    // 🌟 createAdminCourse와 똑같이 FormData를 사용하도록 수정!
    const formData = new FormData();

    const requestData = {
      countryId: payload.countryId,
      title: payload.title?.trim(),
      description: payload.description?.trim(),
      price: payload.price,
      level: payload.level,
    };

    // JSON 데이터를 Blob으로 변환해서 'request'에 추가
    formData.append(
      "request",
      new Blob([JSON.stringify(requestData)], { type: "application/json" })
    );

    // 썸네일 이미지를 변경한 경우에만 추가
    if (payload.thumbnail) {
      formData.append("thumbnail", payload.thumbnail);
    }

    // 첨부파일을 변경한 경우에만 추가
    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((file: File) => {
        formData.append("files", file);
      });
    }

    // JSON 통신이 아닌 FormData 통신으로 PUT 요청
    const response = await adminApi.put(`/api/v1/admin/courses/${courseId}`, formData);
    return response.data;
  } catch (error: any) {
    console.error(`🔥 강의 수정 에러 [상태코드: ${error.response?.status || '네트워크/CORS 에러'}]:`, error.response?.data || error.message);
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
    console.error(`🔥 강의 삭제 에러 [상태코드: ${error.response?.status || '네트워크/CORS 에러'}]:`, error.response?.data || error.message);
    throw new Error(getErrorMessage(error, "강의 삭제에 실패했습니다."));
  }
};