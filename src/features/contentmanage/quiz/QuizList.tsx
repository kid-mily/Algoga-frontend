"use client";

import { useRouter } from "next/navigation";
import QuizCard from "./QuizCard";
import { quizzes }from "@/features/contentmanage/MockData";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import { useState } from "react";

interface QuizListProps {
  lectureId?: number;
}

export default function QuizList({
  lectureId,
}: QuizListProps) {

  const router = useRouter();
  // 강의별 필터
  const filteredQuizzes =
    lectureId
      ? quizzes.filter(
          (quiz) =>
            quiz.lectureId === lectureId
        ): quizzes;
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openDeleteCompleteModal, setOpenDeleteCompleteModal] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);

  return (
    <div className="mt-6 space-y-4">
      {filteredQuizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          lectureTitle={quiz.lectureTitle}
          question={quiz.question}
          options={quiz.options}
          answer={quiz.answer}
          explanation={ quiz.explanation}
          onView={() => {
            console.log("보기");
          }}
          onEdit={() =>
            router.push(
              `/contentadmin/quiz/${quiz.id}/edit`
            )
          }
          onDelete={() => {
            console.log("삭제");
            setSelectedQuizId(
            quiz.id
          );

          setOpenDeleteModal(true);
          }}
        />
      ))}
      {/* 삭제 확인 */}
      <Modal
        open={openDeleteModal}
        title="퀴즈 삭제"
        description="정말 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={() => {
          console.log(
            "삭제 퀴즈:",
            selectedQuizId
          );
          // TODO:
          // API 연결 예정
          setOpenDeleteModal(false);
          setOpenDeleteCompleteModal(true);
        }}
        onCancel={() =>
          setOpenDeleteModal(false)
        }
      />
      {/* 삭제 완료 */}
    <CompleteModal
      open={openDeleteCompleteModal}
      title="삭제 완료"
      description="퀴즈가 삭제되었습니다."
      buttonText="확인"
      onConfirm={() =>
        setOpenDeleteCompleteModal(false)
      }
    />
    </div>
  );
}