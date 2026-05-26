"use client";

import { useParams } from "next/navigation";

import QuizForm from "@/features/contentmanage/quiz/QuizForm";
import SubHeader from "@/features/contentmanage/SubHeader";

import { quizzes }
from "@/features/contentmanage/MockData";

export default function EditQuizPage() {

  const params = useParams();

  const quizid =
    Number(params.quizid);

  // 현재 퀴즈 찾기
  const quiz =
    quizzes.find(
      (item) =>
        item.id === quizid
    );

  // 없으면 return
  if (!quiz) {
    return null;
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
          lectureId:quiz.lectureId,
          question:quiz.question,
          options:quiz.options,
          answer:quiz.answer,
          explanation:quiz.explanation || "",
        }}
      />
    </div>
  );
}