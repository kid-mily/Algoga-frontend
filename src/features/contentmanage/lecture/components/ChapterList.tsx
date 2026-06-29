"use client";

import { useRouter } from "next/navigation";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import CompleteModal from "@/features/common/components/CompleteModal";
import Modal from "@/features/common/components/Modal";
import ChapterCard from "./ChapterCard";
import { useChapterList } from "../hooks/useChapterList";
import type { ChapterListProps } from "../types";

const formatDuration = (durationSeconds: number) => {
  if (!durationSeconds || durationSeconds <= 0) return "-";
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  if (minutes <= 0) return `${seconds}초`;
  if (seconds === 0) return `${minutes}분`;
  return `${minutes}분 ${seconds}초`;
};

export default function ChapterList({
  lectureId,
  hideEdit = false,
}: ChapterListProps) {
  const router = useRouter();
  const {
    chapters,
    errorMessage,
    isLoading,
    openDeleteCompleteModal,
    openDeleteModal,
    closeDeleteComplete,
    closeDeleteConfirm,
    handleDeleteConfirm,
    openDeleteConfirm,
  } = useChapterList(lectureId);

  if (isLoading) {
    return (
      <section
        aria-live="polite"
        className="mt-8 rounded-[18px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]"
      >
        챕터를 불러오는 중...
      </section>
    );
  }

  return (
    <section className="mt-8 space-y-4" aria-labelledby="chapter-list-title">
      <h2 id="chapter-list-title" className="sr-only">
        챕터 목록
      </h2>

      <AdminErrorBanner message={errorMessage} className="m-0" />

      {chapters.length === 0 ? (
        <p className="rounded-[18px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#98A2B3]">
          등록된 챕터가 없습니다.
        </p>
      ) : (
        <div className="space-y-4" role="list">
          {chapters.map((chapter) => {
            const currentChapterId =
              chapter.chapterId || (chapter as { id?: number }).id || 0;

            return (
              <div key={currentChapterId} role="listitem">
                <ChapterCard
                  id={chapter.chapterOrder || currentChapterId}
                  duration={formatDuration(chapter.durationSeconds)}
                  title={chapter.title || "-"}
                  description={chapter.description || chapter.videoUrl || ""}
                  onEdit={
                    hideEdit
                      ? undefined
                      : () =>
                          router.push(
                            `/contentadmin/lecture/${lectureId}/chapter/${currentChapterId}/edit`
                          )
                  }
                  onDelete={() => openDeleteConfirm(currentChapterId)}
                />
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={openDeleteModal}
        title="챕터 삭제"
        description="정말 이 챕터를 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteConfirm}
      />
      <CompleteModal
        open={openDeleteCompleteModal}
        title="삭제 완료"
        description="챕터가 삭제되었습니다."
        buttonText="확인"
        onConfirm={closeDeleteComplete}
      />
    </section>
  );
}
