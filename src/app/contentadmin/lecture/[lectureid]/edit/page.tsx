// src/app/contentadmin/lecture/[lectureid]/edit/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LectureUpdateForm from "@/features/contentmanage/lecture/LectureUpdateForm";
import LectureHeader from "@/features/contentmanage/LectureHeader";
import { getAdminCourse, updateAdminCourse } from "@/features/services/adminCourse.service";

export default function LectureEditPage() {
  const params = useParams();
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

  if (isLoading) return <div className="p-10">강의 정보를 불러오는 중입니다...</div>;
  if (!lecture) return <div className="p-10">강의를 찾을 수 없습니다.</div>;

  // 🌟 파일 인자(thumbnailFile, attachments) 추가 받기
  const handleEdit = async (data: any, thumbnailFile?: File, attachments?: File[]) => {
    try {
      await updateAdminCourse(lectureId, {
        countryId: lecture.countryId, // 수정 시에도 보통 기존 국가 ID 필요
        title: data.title,
        description: data.description,
        price: Number(data.price),
        level: lecture.level || "BEGINNER", // 난이도도 필요하다면 기존 값 유지
        thumbnail: thumbnailFile, // 새로 첨부한 파일 넘기기
        files: attachments,
      });
      return true; 
    } catch (error: any) {
      alert(error.message || "강의 수정에 실패했습니다.");
      return false;
    }
  };

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
          }}
          onSubmit={handleEdit}
        />          
      </div>
    </div>
  );
}