"use client";

import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import { useEffect, useState } from "react";

import LoadingSpinner from "@/features/common/LoadingSpinner";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import QuizForm from "./QuizForm";
import { getQuizDetailAction } from "../actions";
import { AdminQuiz, EditQuizClientProps } from "../types";

export default function EditQuizClient({ quizId, courseId }: EditQuizClientProps) {
  const [quiz, setQuiz] = useState<AdminQuiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const backHref = courseId
    ? `/contentadmin/quiz?courseId=${courseId}`
    : "/contentadmin/quiz";

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId || !courseId) {
        setErrorMessage("퀴즈 정보를 찾을 수 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getQuizDetailAction(courseId, quizId);
        if (!data) {
          setErrorMessage("해당 퀴즈가 존재하지 않습니다.");
          return;
        }

        setQuiz(data);
      } catch (error: unknown) {
        setErrorMessage(error instanceof Error ? error.message : "퀴즈 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchQuiz();
  }, [quizId, courseId]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F8F8] px-8 py-8">
        <LoadingSpinner text="퀴즈 정보를 불러오는 중입니다..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8" aria-labelledby="edit-quiz-title">
      <section aria-labelledby="edit-quiz-title">
        <SubHeader
          backHref={backHref}
          backText="퀴즈 목록으로 돌아가기"
          title="퀴즈 수정"
          description="퀴즈 정보를 수정합니다."
        />
      </section>

      {errorMessage || !quiz ? (
        <AdminErrorBanner message={errorMessage || "퀴즈 정보를 찾을 수 없습니다."} className="mt-6" />
      ) : (
        <section aria-label="퀴즈 수정 폼">
          <QuizForm
            mode="edit"
            initialQuiz={{
              quizId: quiz.quizId,
              courseId: quiz.courseId,
              question: quiz.question,
              option1: quiz.option1,
              option2: quiz.option2,
              option3: quiz.option3,
              option4: quiz.option4,
              correctOption: quiz.correctOption,
              explanation: quiz.explanation || "",
            }}
          />
        </section>
      )}
    </main>
  );
}
