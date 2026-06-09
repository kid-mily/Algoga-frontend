"use client";

import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import LoadingSpinner from "@/features/common/LoadingSpinner";
import QuizList from "./QuizList";
import QuizToolbar from "./QuizToolbar";
import { useAdminQuizList } from "../hooks/useAdminQuizList";

export default function QuizManageClient() {
  const {
    selectedLecture,
    setSelectedLecture,
    searchKeyword,
    setSearchKeyword,
    courses,
    filteredQuizzes,
    isLoading,
    errorMessage,
    refetch,
  } = useAdminQuizList();

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8" aria-labelledby="quiz-management-title">
      <section aria-labelledby="quiz-management-title">
        <SimpleSubHeader
          title="퀴즈 관리"
          description="강의별 퀴즈를 등록하고 관리합니다."
        />
      </section>

      <section aria-label="퀴즈 검색 및 필터 영역">
        <QuizToolbar
          searchKeyword={searchKeyword}
          selectedLecture={selectedLecture}
          courses={courses}
          onSearchKeywordChange={setSearchKeyword}
          onSelectedLectureChange={setSelectedLecture}
        />
      </section>

      {isLoading && (
        <section
          aria-live="polite"
          className="mt-6 flex justify-center rounded-[18px] border border-[#E4E7EC] bg-white p-8"
        >
          <LoadingSpinner text="퀴즈 목록을 불러오는 중입니다..." />
        </section>
      )}

      {!isLoading && errorMessage && (
        <section
          role="alert"
          className="mt-6 rounded-[18px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-red-500"
        >
          {errorMessage}
        </section>
      )}

      {!isLoading && !errorMessage && (
        <QuizList quizzes={filteredQuizzes} onDeleted={refetch} />
      )}
    </main>
  );
}
