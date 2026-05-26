"use client";

import QuizForm from "@/features/contentmanage/quiz/QuizForm";
import SubHeader from "@/features/contentmanage/SubHeader";

export default function CreateQuizPage() {

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">

      {/* 헤더 */}
      <SubHeader
        backHref="/contentadmin/quiz"
        backText="퀴즈 목록으로 돌아가기"
        title="퀴즈 등록"
        description="새로운 퀴즈를 등록합니다"
      />

      {/* 폼 */}
      <QuizForm
        mode="create"
      />
    </div>
  );
}