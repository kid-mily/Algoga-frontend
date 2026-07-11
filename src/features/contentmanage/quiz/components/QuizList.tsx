"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import CompleteModal from "@/features/common/components/CompleteModal";
import Modal from "@/features/common/components/Modal";
import QuizCard from "./QuizCard";
import { deleteQuizAction } from "../actions";
import { AdminQuizWithLecture, QuizListProps } from "../types";

export default function QuizList({
  quizzes = [],
  quizCountByCourse,
  onDeleted,
}: QuizListProps) {
  const router = useRouter();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteCompleteModal, setOpenDeleteCompleteModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<AdminQuizWithLecture | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const safeQuizzes = Array.isArray(quizzes) ? quizzes : [];
  const fallbackQuizCountByCourse = safeQuizzes.reduce<Record<number, number>>(
    (counts, quiz) => {
      counts[quiz.courseId] = (counts[quiz.courseId] ?? 0) + 1;
      return counts;
    },
    {}
  );
  const selectedCourseQuizCount = selectedQuiz
    ? (quizCountByCourse ?? fallbackQuizCountByCourse)[selectedQuiz.courseId] ?? 0
    : 0;
  const isMinimumQuizDeleteBlocked = Boolean(
    selectedQuiz && selectedCourseQuizCount <= 1
  );
  const deleteDescription = isMinimumQuizDeleteBlocked
    ? "강의에는 퀴즈가 최소 1개 이상 필요합니다.\n마지막 퀴즈는 삭제할 수 없습니다."
    : deleteError || "정말 삭제하시겠습니까?";

  const handleDelete = async () => {
    if (!selectedQuiz) return;
    if (isMinimumQuizDeleteBlocked) return;

    try {
      setDeleteError(null);
      await deleteQuizAction(selectedQuiz.courseId, selectedQuiz.quizId);
      setOpenDeleteModal(false);
      setOpenDeleteCompleteModal(true);
    } catch (error: unknown) {
      setDeleteError(error instanceof Error ? error.message : "퀴즈 삭제에 실패했습니다.");
    }
  };

  if (safeQuizzes.length === 0) {
    return (
      <section
        aria-live="polite"
        className="mt-6 rounded-[18px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#98A2B3]"
      >
        등록된 퀴즈가 없습니다.
      </section>
    );
  }

  return (
    <section className="mt-6 space-y-4" aria-labelledby="quiz-list-title">
      <h2 id="quiz-list-title" className="sr-only">
        퀴즈 목록
      </h2>

      {safeQuizzes.map((quiz) => {
        const options = [quiz.option1 || "", quiz.option2 || "", quiz.option3 || "", quiz.option4 || ""];
        const answer = options[(quiz.correctOption || 1) - 1] || "";

        return (
          <QuizCard
            key={`${quiz.courseId}-${quiz.quizId}`}
            lectureTitle={quiz.lectureTitle || `강의 ID ${quiz.courseId}`}
            question={quiz.question || ""}
            options={options}
            answer={answer}
            explanation={quiz.explanation || ""}
            onView={() => undefined}
            onEdit={() =>
              router.push(`/contentadmin/quiz/${quiz.quizId}/edit?courseId=${quiz.courseId}`)
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
        description={deleteDescription}
        confirmText="삭제"
        cancelText="취소"
        confirmDisabled={isMinimumQuizDeleteBlocked}
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
          onDeleted?.();
        }}
      />
    </section>
  );
}
