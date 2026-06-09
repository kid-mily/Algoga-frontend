"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import QuizForm from "@/features/contentmanage/quiz/QuizForm";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import { getAdminQuizDetail } from "@/features/services/adminQuiz.service";
import { AdminQuiz } from "@/features/contentmanage/quiz/types";
// 🌟 스피너 컴포넌트 추가
import LoadingSpinner from "@/features/common/LoadingSpinner";

export default function EditQuizPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const quizId = Number(params.quizid);
  const courseId = Number(searchParams.get("courseId"));

  const [quiz, setQuiz] = useState<AdminQuiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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

        const data = await getAdminQuizDetail(courseId, quizId);

        if (!data) {
          setErrorMessage("해당 퀴즈가 존재하지 않습니다.");
          return;
        }

        setQuiz(data);
      } catch (error: any) {
        setErrorMessage(error?.message || "퀴즈 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, courseId]);

  //  스피너 영역
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F8F8] px-8 py-8">
        <LoadingSpinner text="퀴즈 정보를 불러오는 중입니다..." />
      </div>
    );
  }

  if (errorMessage || !quiz) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">
        <SubHeader
          backHref="/contentadmin/quiz"
          backText="퀴즈 목록으로 돌아가기"
          title="퀴즈 수정"
          description="퀴즈 정보를 수정합니다"
        />

        <div className="mt-6 rounded-[18px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-red-500">
          {errorMessage || "퀴즈 정보를 찾을 수 없습니다."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SubHeader
        backHref="/contentadmin/quiz"
        backText="퀴즈 목록으로 돌아가기"
        title="퀴즈 수정"
        description="퀴즈 정보를 수정합니다"
      />

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
    </div>
  );
}
