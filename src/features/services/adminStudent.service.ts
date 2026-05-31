import axios from "axios";
import { adminApi } from "@/lib/api";
import { Student } from "../contentmanage/types";

// 공통 에러 핸들러
const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallbackMessage;
  }
  return fallbackMessage;
};

// 특정 강의의 수강생 목록 조회
export const getCourseStudents = async (courseId: number): Promise<Student[]> => {
  try {
    const response = await adminApi.get(`/api/v1/admin/courses/${courseId}/students`, {
      params: { t: new Date().getTime() },
    });

    // 백엔드 구조가 data.students 혹은 data.content 등에 담겨올 수 있으니 확인 후 추출
    const resData = response.data;
    const students = resData.data?.students || resData.data || [];

    return students;
  } catch (error: any) {
    console.error(`수강생 목록 조회 에러 (CourseID: ${courseId}):`, error);
    throw new Error(getErrorMessage(error, "수강생 목록을 불러오지 못했습니다."));
  }
};