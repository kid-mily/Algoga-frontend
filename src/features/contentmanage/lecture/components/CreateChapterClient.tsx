"use client";

import { useState } from "react";

import SubHeader from "@/features/contentmanage/common/SubHeader";
import ChapterList from "@/features/contentmanage/lecture/components/ChapterList";
import ChapterForm from "@/features/contentmanage/lecture/components/ChapterForm";
import CompleteModal from "@/features/common/CompleteModal";

import { createChapterAction, getChapterListAction } from "../actions";
import { ChapterSubmitPayload, CreateChapterClientProps } from "../types";

export default function CreateChapterClient({
  lectureId,
}: CreateChapterClientProps) {
  const [alertModal, setAlertModal] = useState({
    open: false,
    title: "",
    description: "",
  });

  const handleCreate = async (data: ChapterSubmitPayload) => {
    const durationSeconds = Number(data.duration);

    if (Number.isNaN(durationSeconds) || durationSeconds < 1) {
      setAlertModal({
        open: true,
        title: "입력 오류",
        description: "영상 길이는 0초보다 큰 숫자여야 합니다.",
      });
      return false;
    }

    try {
      const currentChapters = await getChapterListAction(lectureId);

      if (currentChapters.length >= 5) {
        setAlertModal({
          open: true,
          title: "챕터 개수 제한",
          description: "챕터는 최대 5개까지 등록할 수 있습니다.",
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
    } catch (error: unknown) {
      setAlertModal({
        open: true,
        title: "등록 실패",
        description:
          error instanceof Error ? error.message : "챕터 등록에 실패했습니다.",
      });
      return false;
    }
  };

  return (
    <main className="bg-[#F8F8F8] px-10 py-10">
      <section aria-labelledby="chapter-management-title">
        <SubHeader
          backHref="/contentadmin/lecture"
          backText="강의 목록으로"
          title="챕터 관리"
          description="강의 챕터를 등록하고 관리합니다."
        />
      </section>

      <ChapterList lectureId={lectureId} />

      <section aria-label="챕터 등록 폼">
        <ChapterForm mode="create" onSubmit={handleCreate} />
      </section>

      <CompleteModal
        open={alertModal.open}
        title={alertModal.title}
        description={alertModal.description}
        buttonText="확인"
        onConfirm={() => setAlertModal((prev) => ({ ...prev, open: false }))}
      />
    </main>
  );
}

