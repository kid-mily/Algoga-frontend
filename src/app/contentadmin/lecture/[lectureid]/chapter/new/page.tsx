"use client";

import { useParams } from "next/navigation";

import ChapterForm from "@/features/contentmanage/ChapterForm";
import ChapterList from "@/features/contentmanage/ChapterList";
import SubHeader from "@/features/contentmanage/SubHeader";

export default function NewChapterPage() {

  const params = useParams();

  const lectureid =
    Number(params.lectureid);

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-10 py-10">

      {/* 상단 */}
      <SubHeader 
        backHref="/contentadmin/lecture"
        backText="강의 목록으로 돌아가기"
        title="챕터 관리"
        description="챕터를 관리하세요"
      />

      {/* 챕터 목록 */}
      <ChapterList
        lectureId={lectureid}
      />

      {/* 폼 */}
      <ChapterForm
        mode="create"
      />
    </div>
  );
}