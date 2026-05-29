"use client";

import { useParams } from "next/navigation";

import ChapterForm from "@/features/contentmanage/lecture/ChapterForm";
import ChapterList from "@/features/contentmanage/lecture/ChapterList";
import SubHeader from "@/features/contentmanage/SubHeader";

import { chapters }
from "@/features/contentmanage/MockData";

export default function EditChapterPage() {

  const params = useParams();

  const lectureid =
    Number(params.lectureid);

  const chapterid =
    Number(params.chapterid);

  // 현재 챕터 찾기
  const chapter =
    chapters.find(
      (item) =>
        item.id === chapterid
    );

  if (!chapter) {

    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-10 py-10">

      {/* 상단 */}
      <SubHeader
        backHref={`/contentadmin/lecture/${lectureid}/chapter/new`}
        backText="챕터 목록으로 돌아가기"
        title="챕터 수정"
        description="챕터 정보를 수정합니다"
      />

      {/* 목록 */}
      <ChapterList
        lectureId={lectureid}
        hideEdit
      />

      {/* 수정 폼 */}
      <ChapterForm
        mode="edit"

        initialChapter={{
          ...chapter,
          video: null,
          preview: "",
        }}
      />
    </div>
  );
}