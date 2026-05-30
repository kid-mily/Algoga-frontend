"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LectureUpdateForm from "@/features/contentmanage/lecture/LectureUpdateForm";
import LectureHeader from "@/features/contentmanage/LectureHeader";
import { getAdminCourse, updateAdminCourse } from "@/features/services/adminCourse.service";

export default function LectureEditPage() {
  const params = useParams();
  const router = useRouter();
  const lectureId = Number(params.lectureid);
  
  const [lecture, setLecture] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const data = await getAdminCourse(lectureId);
        setLecture(data);
      } catch (error: any) {
        setApiError(error.message || "강의 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (lectureId) fetchLecture();
  }, [lectureId]);

  if (isLoading) return <div className="p-10">데이터를 불러오는 중입니다...</div>;
  if (!lecture && !apiError) return <div className="p-10">강의 정보를 찾을 수 없습니다.</div>;

  const handleEdit = async (data: any, thumbnailFile?: File, attachments?: File[]) => {
    try {
      setApiError("");
      await updateAdminCourse(lectureId, data); 
      return true;
    } catch (error: any) {
      setApiError(error.message || "강의 수정에 실패했습니다.");
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <LectureHeader title="강의 수정" description="등록된 강의 정보를 수정합니다." />
      
      <div className="py-7">
        <div className="mx-auto max-w-[900px]">
          {/* 🌟 에러 발생 시 박스로 출력 */}
          {apiError && (
            <div className="mb-4 rounded-[12px] border border-[#DC2626] bg-[#FEF2F2] p-4 text-[14px] font-medium text-[#DC2626]">
              🚨 {apiError}
            </div>
          )}

          {lecture && (
            <LectureUpdateForm 
              initialData={{
                country: lecture.countryName || "",
                title: lecture.title || "",
                description: lecture.description || "",
                price: String(lecture.price || ""),
                mileage: String(lecture.mileage || ""),
                isPublic: String(lecture.isPublic || lecture.status === "PUBLISHED"),
              }} 
              onSubmit={handleEdit} 
            />
          )}
        </div>
      </div>
    </div>
  );
}