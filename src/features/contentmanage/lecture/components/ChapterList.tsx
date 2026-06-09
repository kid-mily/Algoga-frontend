"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ChapterCard from "./ChapterCard";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";

import { deleteChapterAction, getChapterListAction } from "../actions";
import { AdminChapter } from "../types";

interface ChapterListProps {
  lectureId: number;
  hideEdit?: boolean;
}

const formatDuration = (durationSeconds: number) => {
  if (!durationSeconds || durationSeconds <= 0) return "-";
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  if (minutes <= 0) return `${seconds}초`;
  if (seconds === 0) return `${minutes}분`;
  return `${minutes}분 ${seconds}초`;
};

export default function ChapterList({ lectureId, hideEdit = false }: ChapterListProps) {
  const router = useRouter();

  const [chapters, setChapters] = useState<AdminChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteCompleteModal, setOpenDeleteCompleteModal] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

  const fetchChapters = async () => {
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
    } catch (error: any) {
      setErrorMessage("챕터 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [lectureId]);

  const handleDeleteConfirm = async () => {
    if (!selectedChapterId) return;
    try {
      setErrorMessage("");
      await deleteChapterAction(lectureId, selectedChapterId);
      setChapters((prev) => prev.filter((chapter) => chapter.chapterId !== selectedChapterId));
      setOpenDeleteModal(false);
      setOpenDeleteCompleteModal(true);
      setSelectedChapterId(null);
    } catch (error: any) {
      setOpenDeleteModal(false);
      // 🌟 alert 대신 인라인 에러로 띄워줍니다!
      setErrorMessage(error.message || "챕터 삭제에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="mt-8 rounded-[18px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]">
        챕터 목록을 불러오는 중입니다...
      </div>
    );
  }

  // 🌟 페이지 렌더링을 완전히 망치지 않고, 에러 박스만 띄운 뒤 목록을 그립니다.
  return (
    <div className="mt-8 space-y-4">
      {errorMessage && (
        <div className="rounded-[12px] border border-[#DC2626] bg-[#FEF2F2] p-4 text-center text-[14px] font-medium text-[#DC2626]">
          🚨 {errorMessage}
        </div>
      )}

      {chapters.length === 0 ? (
        <div className="rounded-[18px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#98A2B3]">
          등록된 챕터가 없습니다.
        </div>
      ) : (
        chapters.map((chapter) => {
          const currentChapterId = chapter.chapterId || (chapter as any).id;
          return (
            <ChapterCard
              key={currentChapterId}
              id={chapter.chapterOrder || currentChapterId}
              duration={formatDuration(chapter.durationSeconds)}
              title={chapter.title || "-"}
              description={chapter.videoUrl || ""}
              onEdit={
                hideEdit
                  ? undefined
                  : () => router.push(`/contentadmin/lecture/${lectureId}/chapter/${currentChapterId}/edit`)
              }
              onDelete={() => {
                setSelectedChapterId(currentChapterId);
                setOpenDeleteModal(true);
              }}
            />
          );
        })
      )}

      <Modal open={openDeleteModal} title="챕터 삭제" description="정말 삭제하시겠습니까?" confirmText="삭제" cancelText="취소" onConfirm={handleDeleteConfirm} onCancel={() => { setOpenDeleteModal(false); setSelectedChapterId(null); }} />
      <CompleteModal open={openDeleteCompleteModal} title="삭제 완료" description="챕터가 삭제되었습니다." buttonText="확인" onConfirm={() => setOpenDeleteCompleteModal(false)} />
    </div>
  );
}
