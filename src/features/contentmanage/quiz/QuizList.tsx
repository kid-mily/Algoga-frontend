"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import QuizCard from "./QuizCard";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import {
  deleteAdminQuiz,
} from "@/features/services/adminQuiz.service";
import {AdminQuiz} from "../types";

interface QuizListProps {
  quizzes?: AdminQuiz[];
  onDeleted?: () => void;
}

export default function QuizList({
  quizzes = [],
  onDeleted,
}: QuizListProps) {
  const router = useRouter();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteCompleteModal, setOpenDeleteCompleteModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<AdminQuiz | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const safeQuizzes = Array.isArray(quizzes) ? quizzes : [];

  const handleDelete = async () => {
    if (!selectedQuiz) return;

    try {
      setDeleteError(null);

      await deleteAdminQuiz(selectedQuiz.courseId, selectedQuiz.quizId);

      setOpenDeleteModal(false);
      setOpenDeleteCompleteModal(true);
      onDeleted?.();
    } catch (error: any) {
      setDeleteError(error?.message || "퀴즈 삭제에 실패했습니다.");
    }
  };

  if (safeQuizzes.length === 0) {
    return (
      <div className="mt-6 rounded-[18px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#98A2B3]">
        등록된 퀴즈가 없습니다.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {safeQuizzes.map((quiz) => {
        const options = [
          quiz.option1 || "",
          quiz.option2 || "",
          quiz.option3 || "",
          quiz.option4 || "",
        ];

        const answer = options[(quiz.correctOption || 1) - 1] || "";

        return (
          <QuizCard
            key={`${quiz.courseId}-${quiz.quizId}`}
            lectureTitle={quiz.lectureTitle || `강의 ID ${quiz.courseId}`}
            question={quiz.question || ""}
            options={options}
            answer={answer}
            explanation={quiz.explanation || ""}
            onView={() => {
              console.log("퀴즈 보기:", quiz);
            }}
            onEdit={() =>
              router.push(
                `/contentadmin/quiz/${quiz.quizId}/edit?courseId=${quiz.courseId}`
              )
            }
            onDelete={() => {
              setSelectedQuiz(quiz);
              setDeleteError(null);
              setOpenDeleteModal(true);
            }}
          />
        );
      })}

      <Modal
        open={openDeleteModal}
        title="퀴즈 삭제"
        description={deleteError ? deleteError : "정말 삭제하시겠습니까?"}
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDelete}
        onCancel={() => {
          setOpenDeleteModal(false);
          setSelectedQuiz(null);
          setDeleteError(null);
        }}
      />

      <CompleteModal
        open={openDeleteCompleteModal}
        title="삭제 완료"
        description="퀴즈가 삭제되었습니다."
        buttonText="확인"
        onConfirm={() => {
          setOpenDeleteCompleteModal(false);
          setSelectedQuiz(null);
        }}
      />
    </div>
  );
}