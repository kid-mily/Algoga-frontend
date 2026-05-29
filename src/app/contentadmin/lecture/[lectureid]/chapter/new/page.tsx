"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import SubHeader from "@/features/contentmanage/SubHeader";
import ChapterList from "@/features/contentmanage/lecture/ChapterList";
import ChapterForm from "@/features/contentmanage/lecture/ChapterForm";
import CompleteModal from "@/features/common/CompleteModal";

import { createAdminChapter, getAdminChapters } from "@/features/services/adminChapter.service";

export default function NewChapterPage() {
  const params = useParams();
  const lectureid = Number(params.lectureid);

  const [alertModal, setAlertModal] = useState({
    open: false,
    title: "",
    description: "",
  });

  const handleCreate = async (data: any) => {
    const durationNum = Number(data.duration);

    // 🌟 1. 강의 시간 안내 문구를 '초 단위'로 명확하게 수정했습니다!
    if (isNaN(durationNum) || durationNum < 1) {
      setAlertModal({
        open: true,
        title: "입력 오류",
        description: "강의 시간은 '초(Second)' 단위로 1 이상의 숫자를 입력해주세요! (예: 30초 영상 ➔ 30 입력, 1분 영상 ➔ 60 입력)",
      });
      return false; 
    }

    try {
      const currentChapters = await getAdminChapters(lectureid);
      
      if (currentChapters && currentChapters.length >= 5) {
        setAlertModal({
          open: true,
          title: "등록 제한",
          description: "챕터는 최대 5개까지만 등록할 수 있습니다.",
        });
        return false;
      }
      
      let nextOrder = 1;
      if (currentChapters && currentChapters.length > 0) {
        const maxOrder = Math.max(...currentChapters.map(c => c.chapterOrder || 0));
        nextOrder = maxOrder + 1;
      }

      await createAdminChapter({
        courseId: lectureid,
        title: data.title,
        description: data.description,
        durationSeconds: durationNum, 
        chapterOrder: nextOrder,
        video: data.video, 
      });
      
      return true; 
    } catch (error: any) {
      setAlertModal({
        open: true,
        title: "등록 실패",
        description: error.message || "챕터 등록에 실패했습니다.",
      });
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-10 py-10">
      <SubHeader
        backHref="/contentadmin/lecture"
        backText="강의 목록으로 돌아가기"
        title="챕터 관리"
        description="해당 강의의 챕터 목록을 확인하고 새 챕터를 추가합니다"
      />

      <ChapterList lectureId={lectureid} />

      <ChapterForm 
        mode="create" 
        onSubmit={handleCreate}
      />

      <CompleteModal
        open={alertModal.open}
        title={alertModal.title}
        description={alertModal.description}
        buttonText="확인"
        onConfirm={() => setAlertModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}