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
    console.log("전송할 폼 데이터:", data);
    try {
      // 🌟 폼에서 넘겨준 명시적인 status가 있으면 우선 사용, 없으면 2차 방어로 계산
      const isPublicBool = String(data.isPublic) === "true";
      const targetStatus = data.status || (isPublicBool ? "PUBLISHED" : "DRAFT");
      
      console.log("변환된 status:", targetStatus);
      
      await updateAdminCourse(lectureId, {
        countryId: lecture.countryId,
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

  // 🌟 순서가 뒤바뀐 최종 판별 함수
  const getIsPublic = (lectureData: any) => {
    // 1순위: 명확한 isPublic 불리언 값이 있다면 가장 먼저 믿는다!
    if (lectureData.isPublic !== undefined) return String(lectureData.isPublic) === "true";
    if (lectureData.is_public !== undefined) return String(lectureData.is_public) === "true";
    if (lectureData.public !== undefined) return String(lectureData.public) === "true"; 

    // 2순위: isPublic이 아예 없을 때만 status 문자열 확인
    if (lectureData.status) {
      const s = String(lectureData.status).toUpperCase();
      if (s === "PUBLIC" || s === "OPEN" || s === "PUBLISHED") return true;
      if (s === "DRAFT" || s === "PRIVATE" || s === "CLOSED") return false;
    }
    
    return false;
  };

  const currentIsPublic = getIsPublic(lecture);

  return (
    <div className="p-6">
      <LectureHeader title="강의 수정" description="여행 강의를 수정하고 관리합니다" />
      <div className="mt-6">
        <LectureUpdateForm
          initialData={{
            country: lecture.countryName || "",
            title: lecture.title || "",
            description: lecture.description || "",
            price: String(lecture.price || ""),
            mileage: String(lecture.mileage || ""),
            // 🌟 확실한 문자열 주입 ("true" 또는 "false")
            isPublic: currentIsPublic ? "true" : "false", 
          }}
          onSubmit={handleEdit}
        />
      </div>
    </div>
  );
}