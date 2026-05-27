"use client";

import { useRouter } from "next/navigation";

import ChapterCard from "./ChapterCard";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";

import { chapters }
from "./MockData";
import { useState } from "react";

interface ChapterListProps {
  lectureId: number;
  hideEdit?: boolean;
}

export default function ChapterList({
  lectureId,
  hideEdit = false,
}: ChapterListProps) {

  const router = useRouter();

  // lecture별 필터
  const filteredChapters =
    chapters.filter(
      (chapter) =>
        chapter.lectureId === lectureId
    );

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteCompleteModal, setOpenDeleteCompleteModal] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

  return (
    <div className="mt-8 space-y-4">
      {filteredChapters.map((chapter) => (
        <ChapterCard
          key={chapter.id}
          id={chapter.id}
          duration={chapter.duration}
          title={chapter.title}
          description={chapter.description}
          onEdit={
            hideEdit
              ? undefined
              : () =>
                  router.push(
                    `/contentadmin/lecture/${lectureId}/chapter/${chapter.id}/edit`
                  )
          }
          onDelete={() => {
            setSelectedChapterId(
            chapter.id
          );
            setOpenDeleteModal(true);
          }}
        />
      ))}
      {/* 삭제 확인 */}
      <Modal
        open={openDeleteModal}
        title="챕터 삭제"
        description="정말 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={() => {
          console.log(
            "삭제 챕터:",
            selectedChapterId
          );
          // TODO:
          // 나중에 API 삭제 연결
          setOpenDeleteModal(false);
          setOpenDeleteCompleteModal(
            true
          );
        }}
        onCancel={() =>
          setOpenDeleteModal(false)
        }
      />
      {/* 삭제 완료 */}
      <CompleteModal
        open={
          openDeleteCompleteModal
        }
        title="삭제 완료"
        description="챕터가 삭제되었습니다."
        buttonText="확인"
        onConfirm={() =>
          setOpenDeleteCompleteModal(
            false
          )
        }
      />
    </div>
  );
}