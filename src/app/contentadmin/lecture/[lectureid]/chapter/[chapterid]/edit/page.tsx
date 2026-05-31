"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ChapterForm from "@/features/contentmanage/lecture/ChapterForm";
import ChapterList from "@/features/contentmanage/lecture/ChapterList";
import SubHeader from "@/features/contentmanage/common/SubHeader";

import { getAdminChapters, updateAdminChapter } from "@/features/services/adminChapter.service";
import {AdminChapter} from "../../../../../../../features/contentmanage/types"

export default function EditChapterPage() {
  const params = useParams();
  const router = useRouter();
  
  const lectureid = Number(params.lectureid);
  const chapterid = Number(params.chapterid);

  const [chapter, setChapter] = useState<AdminChapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 실제 데이터 불러오기
  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const chapters = await getAdminChapters(lectureid);
        const target = chapters.find((c) => (c.chapterId || (c as any).id) === chapterid);
        if (target) setChapter(target);
      } catch (error) {
        console.error("챕터 정보를 불러오지 못했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (lectureid && chapterid) fetchChapter();
  }, [lectureid, chapterid]);

  if (isLoading) return <div className="p-10 text-center">챕터 정보를 불러오는 중입니다...</div>;
  if (!chapter) return <div className="p-10 text-center text-red-500">챕터를 찾을 수 없습니다.</div>;

  // 2. 수정 제출 함수 (API 통신)
  const handleEdit = async (data: any) => {
    try {
      await updateAdminChapter(lectureid, chapterid, {
        title: data.title,
        durationSeconds: Number(data.duration) || chapter.durationSeconds,
        chapterOrder: chapter.chapterOrder || 1, 
        video: data.video, // 새로 등록한 영상 객체
      });
      return true; // 성공 시 true
    } catch (error: any) {
      alert(error.message || "챕터 수정에 실패했습니다.");
      return false; // 에러 시 false를 반환하여 모달창 안뜨게 함
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-10 py-10">
      {/* 상단 */}
      <SubHeader
        backHref={`/contentadmin/lecture/${lectureid}/chapter/new`}
        backText="챕터 목록으로 돌아가기"
        title="챕터 수정"
        description="챕터 정보를 수정합니다"
      />

      {/* 목록 (수정 중이므로 리스트에서는 수정 버튼 숨김) */}
      <ChapterList lectureId={lectureid} hideEdit />

      {/* 수정 폼 */}
      <ChapterForm
        mode="edit"
        initialChapter={{
          id: chapter.chapterId || (chapter as any).id || 0,
          title: chapter.title,
          description: "", // DTO에 설명이 없으면 빈칸
          duration: String(chapter.durationSeconds || ""),
          video: null,
          preview: chapter.videoUrl || "",
        }}
        onSubmit={handleEdit}
        onClose={() => router.push(`/contentadmin/lecture/${lectureid}/chapter/new`)}
      />
    </div>
  );
}