import { adminApi, ApiResponse } from "@/lib/api";
import { Student } from "../contentmanage/lecture/types";

type StudentResponse = {
  students?: Student[];
  content?: Student[];
};

export const getCourseStudents = async (
  courseId: number
): Promise<Student[]> => {
  const response = await adminApi.get<ApiResponse<StudentResponse | Student[]>>(
    `/api/v1/admin/courses/${courseId}/students`,
    {
      params: { t: Date.now() },
    }
  );

  const data = response.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.students)) return data.students;
  if (Array.isArray(data.content)) return data.content;

  return [];
};