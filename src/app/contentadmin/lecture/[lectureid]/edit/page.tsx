"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LectureUpdateForm from "@/features/contentmanage/lecture/LectureUpdateForm";
import LectureHeader from "@/features/contentmanage/common/LectureHeader";
import { getAdminCourse, updateAdminCourse } from "@/features/services/adminCourse.service";

export default function LectureEditPage() {
  const params = useParams();
  const router = useRouter();
  const lectureId = Number(params.lectureid);
  
  const [lecture, setLecture] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const data = await getAdminCourse(lectureId);
        setLecture(data);
      } catch (error) {
        console.error("강의 정보를 불러오지 못했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (lectureId) fetchLecture();
  }, [lectureId]);

  if (isLoading) return <div className="p-10">로딩 중...</div>;
  if (!lecture) return <div className="p-10">강의 정보를 찾을 수 없습니다.</div>;

  const handleEdit = async (data: any, thumbnailFile?: File, attachments?: File[]) => {
    try {
      const isPublicBool = String(data.isPublic) === "true";
      const targetStatus = data.status || (isPublicBool ? "PUBLISHED" : "DRAFT");
      
      await updateAdminCourse(lectureId, {
        countryId: lecture.countryId, // 수정 시에는 원래 있던 countryId를 그대로 보냄
        title: data.title,
        description: data.description,
        price: Number(data.price),
        level: lecture.level || "BEGINNER",
        status: targetStatus,
        thumbnail: thumbnailFile,
        files: attachments,
      });
      return true;
    } catch (error: any) {
      alert(error.message || "강의 수정에 실패했습니다.");
      return false;
    }
  };

  const getIsPublic = (lectureData: any) => {
    if (lectureData.isPublic !== undefined) return String(lectureData.isPublic) === "true";
    if (lectureData.is_public !== undefined) return String(lectureData.is_public) === "true";
    if (lectureData.public !== undefined) return String(lectureData.public) === "true"; 

    if (lectureData.status) {
      const s = String(lectureData.status).toUpperCase();
      if (s === "PUBLIC" || s === "OPEN" || s === "PUBLISHED") return true;
      if (s === "DRAFT" || s === "PRIVATE" || s === "CLOSED") return false;
    }
    
    return false;
  };

  // 🌟 백엔드에서 countryName이 안 올 경우 countryId를 통해 국가 이름으로 변환하는 함수
  const getCountryName = () => {
    if (lecture.countryName) return lecture.countryName;
    const id = String(lecture.countryId);
    if (id === "1") return "일본";
    if (id === "2") return "프랑스";
    if (id === "3") return "미국";
    return id || "";
  };

  const currentIsPublic = getIsPublic(lecture);

  return (
    <div className="p-6">
      <LectureHeader title="강의 수정" description="여행 강의를 수정하고 관리합니다" />
      <div className="mt-6">
        <LectureUpdateForm
          initialData={{
            country: getCountryName(), // 🌟 변환된 국가 이름을 폼에 전달
            title: lecture.title || "",
            description: lecture.description || "",
            price: String(lecture.price || ""),
            mileage: String(lecture.mileage || ""),
            isPublic: currentIsPublic ? "true" : "false", 
          }}
          onSubmit={handleEdit}
        />
      </div>
    </div>
  );
}