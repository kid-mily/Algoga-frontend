"use client";

import { useState } from "react";

import SubHeader from "@/features/contentmanage/common/SubHeader";
import ChapterList from "@/features/contentmanage/lecture/components/ChapterList";
import ChapterForm from "@/features/contentmanage/lecture/components/ChapterForm";
import CompleteModal from "@/features/common/CompleteModal";

import { createChapterAction, getChapterListAction } from "../actions";

type CreateChapterClientProps = {
  lectureId: number;
};

export default function CreateChapterClient({
  lectureId,
}: CreateChapterClientProps) {
  const [alertModal, setAlertModal] = useState({
    open: false,
    title: "",
    description: "",
  });

  const handleCreate = async (data: any) => {
    const durationSeconds = Number(data.duration);

    if (Number.isNaN(durationSeconds) || durationSeconds < 1) {
      setAlertModal({
        open: true,
        title: "Input error",
        description: "Duration must be a number greater than 0 seconds.",
      });
      return false;
    }

    try {
      const currentChapters = await getChapterListAction(lectureId);

      if (currentChapters.length >= 5) {
        setAlertModal({
          open: true,
          title: "Chapter limit",
          description: "You can register up to 5 chapters.",
        });
        return false;
      }

      const maxOrder = Math.max(
        0,
        ...currentChapters.map((chapter) => chapter.chapterOrder || 0)
      );

      await createChapterAction({
        courseId: lectureId,
        title: data.title,
        description: data.description,
        durationSeconds,
        chapterOrder: maxOrder + 1,
        video: data.video,
      });

      return true;
    } catch (error: any) {
      setAlertModal({
        open: true,
        title: "Create failed",
        description: error.message || "Failed to create chapter.",
      });
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-10 py-10">
      <SubHeader
        backHref="/contentadmin/lecture"
        backText="강의관리로 돌아가기"
        title="챕터관리"
        description="새로운 챕터를 등록하고 수정합니다."
      />

      <ChapterList lectureId={lectureId} />

      <ChapterForm mode="create" onSubmit={handleCreate} />

      <CompleteModal
        open={alertModal.open}
        title={alertModal.title}
        description={alertModal.description}
        buttonText="OK"
        onConfirm={() => setAlertModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
