"use client";

import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ChapterCard from "./ChapterCard";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";

import { deleteChapterAction, getChapterListAction } from "../actions";
import { AdminChapter, ChapterListProps } from "../types";

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

  const [chapters, setChapters] = useState<AdminChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteCompleteModal, setOpenDeleteCompleteModal] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

  const fetchChapters = useCallback(async () => {
    await Promise.resolve();

    if (!lectureId) {
      setChapters([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      const data = await getChapterListAction(lectureId);
      setChapters(data);
    } catch {
      setErrorMessage("챕터 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [lectureId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchChapters();
  }, [fetchChapters]);

  const handleDeleteConfirm = async () => {
    if (!selectedChapterId) return;

    try {
      setErrorMessage("");
      await deleteChapterAction(lectureId, selectedChapterId);
      setChapters((prev) =>
        prev.filter((chapter) => chapter.chapterId !== selectedChapterId)
      );
      setOpenDeleteModal(false);
      setOpenDeleteCompleteModal(true);
      setSelectedChapterId(null);
    } catch (error: unknown) {
      setOpenDeleteModal(false);
      setErrorMessage(
        error instanceof Error ? error.message : "챕터 삭제에 실패했습니다."
      );
    }
  };

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
                  onDelete={() => {
                    setSelectedChapterId(currentChapterId);
                    setOpenDeleteModal(true);
                  }}
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
        onCancel={() => {
          setOpenDeleteModal(false);
          setSelectedChapterId(null);
        }}
      />
      <CompleteModal
        open={openDeleteCompleteModal}
        title="삭제 완료"
        description="챕터가 삭제되었습니다."
        buttonText="확인"
        onConfirm={() => setOpenDeleteCompleteModal(false)}
      />
    </section>
  );
}
